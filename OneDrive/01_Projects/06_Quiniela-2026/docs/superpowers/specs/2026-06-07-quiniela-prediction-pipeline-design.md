# Quiniela 2026 — Prediction Pipeline Design

**Date:** 2026-06-07  
**Deadline:** 2026-06-11 (WC kickoff, quiniela submission closes)  
**Goal:** Aggregate expert predictions, stats, and market signals into ranked quiniela picks with confidence tiers and contrarian alerts.

---

## 1. Architecture

Three-phase Python CLI pipeline. No server, no DB. Outputs files locally.

```
Phase 1: GATHER
  ├── Stats layer      → Elo ratings + recent form + squad/injury data
  ├── deep-research    → analyst/expert predictions (ESPN, BBC, The Athletic, etc.)
  ├── prediction-market skill → Polymarket/Kalshi WC2026 odds
  └── forum scraper + LLM quality filter → informed fan picks (Reddit)

Phase 2: MODEL
  ├── Normalizer       → all inputs → common schema
  ├── Bayesian updater → stats prior + qualitative signal weighting
  └── Contrarian detector → market vs expert divergence >15pp

Phase 3: OUTPUT
  ├── output/YYYY-MM-DD_raw_data.json
  ├── output/YYYY-MM-DD_consensus.json
  └── output/YYYY-MM-DD_quiniela_report.md
```

Re-run pipeline each day until submission deadline. No scheduler needed.

---

## 2. Data Sources

### 2a. Stats Layer (quantitative baseline)

| Source | Data | Method |
|--------|------|--------|
| eloratings.net | National team Elo ratings | HTTP scrape |
| football-data.org (free tier) | WC2026 fixtures, recent results | REST API |
| FIFA.com | Official squad lists, suspensions | deep-research skill |

### 2b. Qualitative Sources

| Source | Type | Weight |
|--------|------|--------|
| ESPN, BBC Sport, The Athletic, FiveThirtyEight-style analysts | analyst | 1.0 |
| r/soccer, r/WorldCup, r/FIFA, national team subs (via Reddit API + PRAW) | informed_fan | 0.6 |
| Polymarket, Kalshi WC2026 markets | prediction_market | contrarian signal only |

**Forum access:** Reddit via PRAW (Reddit official API, requires free API key). Fallback: web scrape old.reddit.com if PRAW quota exceeded.

**Forum quality filter:** LLM scores each post 0–10 on domain knowledge signals (specific stats, tactical systems, squad depth knowledge, injury awareness). Threshold ≥ 7 required for inclusion as `informed_fan`.

**Markets:** Not included in consensus vote. Used exclusively for contrarian detection.

---

## 3. Data Model

### 3a. Raw prediction record

```python
{
  "source_id": str,           # e.g. "espn_analysts_2026-06-05"
  "source_type": "analyst" | "informed_fan" | "prediction_market",
  "source_url": str,
  "timestamp": str,           # ISO 8601
  "prediction_type": "group_match" | "bracket" | "winner" | "golden_boot",
  "match_id": str,            # e.g. "A1" (Group A, Match 1)
  "team_a": str,
  "team_b": str,
  "outcome": "W" | "D" | "L",  # from team_a perspective
  "confidence_pct": float,    # normalized 0.0–1.0
  "raw_text": str             # original excerpt for audit
}
```

### 3b. Team stats record

```python
{
  "team": str,
  "elo_rating": int,
  "fifa_rank": int,
  "recent_form": {
    "matches": int,           # last 10
    "wins": int,
    "draws": int,
    "losses": int,
    "goals_scored_avg": float,
    "goals_conceded_avg": float
  },
  "squad_flags": [str]        # e.g. ["Ziyech suspended R1", "Hakimi fit"]
}
```

### 3c. Consensus output record

```python
{
  "match_id": str,
  "team_a": str,
  "team_b": str,
  "consensus_outcome": "W" | "D" | "L",
  "confidence_tier": "high" | "medium" | "low",  # high ≥0.70, medium 0.50–0.69, low <0.50
  "weighted_confidence": float,
  "source_count": int,
  "contrarian_flag": bool,
  "contrarian_detail": str    # e.g. "Markets favor Draw (48%) vs expert Win (72%)"
}
```

---

## 4. Bayesian Weighting Model

### Base prior (stats layer)

```python
# form_score = (wins * 3 + draws * 1) / (matches * 3), range 0.0–1.0
team_a_form_score = (team_a.recent_form.wins * 3 + team_a.recent_form.draws) / (team_a.recent_form.matches * 3)
team_b_form_score = (team_b.recent_form.wins * 3 + team_b.recent_form.draws) / (team_b.recent_form.matches * 3)

elo_delta = team_a.elo_rating - team_b.elo_rating
base_win_prob = 1 / (1 + 10 ** (-elo_delta / 400))
form_adj = (team_a_form_score - team_b_form_score) * 0.05  # max ±5pp

# Draw base rate in WC group stage historically ~25%. Adjusted by Elo closeness:
# closer Elo → higher draw probability (max 30%), larger gap → lower (min 18%)
draw_prob = 0.25 + max(-0.07, min(0.05, -abs(elo_delta) / 3000))

w = base_win_prob + form_adj
l = 1.0 - w - draw_prob
prior = { "W": max(0.05, w), "D": draw_prob, "L": max(0.05, l) }
# re-normalize to sum to 1.0
```

### Coverage-based blending

| Source coverage | Stats prior weight | Qualitative weight |
|----------------|-------------------|-------------------|
| 0–2 sources | 80% | 20% |
| 3–7 sources | 55% | 45% |
| 8+ sources | 30% | 70% |

This ensures sparse-coverage matches (smaller nations) still get principled predictions from Elo + form.

### Contrarian detection

Flag when: `abs(market_implied_prob - expert_consensus_prob) > 0.15` for any outcome.

---

## 5. Output

### Report structure (`quiniela_report.md`)

```
# Quiniela 2026 — Recommendations [date]

## Group Stage Picks
| Match | Team A | Team B | Pick | Confidence | Alert |
...

## Knockout Bracket
Round of 32 → QF → SF → Final

## Tournament Winner
## Golden Boot
## Contrarian Watchlist
```

### File structure

```
06_Quiniela-2026/
  src/
    research.py       # Phase 1: stats + deep-research + market + forum gathering
    normalize.py      # normalize all inputs to common schema
    consensus.py      # Bayesian updater + contrarian detection
    report.py         # render output files
    pipeline.py       # CLI entrypoint
  data/
    sources.yaml      # configured source URLs + types
  output/             # generated, gitignored
  docs/
    superpowers/specs/
  requirements.txt
```

### Run

```bash
python src/pipeline.py
# writes output/YYYY-MM-DD_raw_data.json
#         output/YYYY-MM-DD_consensus.json
#         output/YYYY-MM-DD_quiniela_report.md
```

---

## 6. Skills Used

| Skill | Phase | Purpose |
|-------|-------|---------|
| `deep-research` | Phase 1 | Structured web research for analyst predictions |
| `prediction-market-oracle-research` | Phase 1 | Polymarket/Kalshi WC2026 market odds |

---

## 7. Constraints

- Deadline: 2026-06-11. Build + run within 4 days.
- No server, no UI, no DB. Local Python pipeline only.
- Re-runnable: each run overwrites output with fresh date-stamped files.
- Python chosen for speed + data science ecosystem.
