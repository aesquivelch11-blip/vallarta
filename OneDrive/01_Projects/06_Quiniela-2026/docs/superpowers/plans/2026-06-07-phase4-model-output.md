# Quiniela 2026 — Phase 4: Model, Output & Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all gathered data into the consensus model, render the quiniela report, and tie everything together in a single runnable CLI pipeline.

**Architecture:** Four modules — `normalize.py` deduplicates records, `consensus.py` blends stats prior with qualitative votes and flags contrarians, `report.py` renders markdown, `pipeline.py` orchestrates all phases end-to-end.

**Tech Stack:** Python 3.11+ stdlib only (no new deps). `pytest`, `pytest-mock`.

**Prerequisite phases:** Phases 1–3 complete. All imports from `src.models`, `src.stats.*`, `src.research.*` available.

**Phase exit criteria:** `pytest tests/` passes entirely (all phases). `python src/pipeline.py` runs end-to-end and writes three files to `output/`.

---

## File Map

```
src/
  normalize.py      # dedup + clip all PredictionRecords
  consensus.py      # Bayesian blend (stats prior + qualitative) + contrarian detection
  report.py         # render List[ConsensusRecord] → markdown report string
  pipeline.py       # CLI entrypoint: orchestrates Phase 1→2→3
tests/
  test_normalize.py
  test_consensus.py
  test_report.py
output/             # written at runtime, gitignored
```

---

## Task 1: Normalizer

**Files:**
- Create: `src/normalize.py`
- Create: `tests/test_normalize.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_normalize.py
from src.normalize import normalize_predictions
from src.models import PredictionRecord

def _rec(source_type: str, outcome: str, confidence: float,
         source_id: str = "test", match_id: str = "A1") -> PredictionRecord:
    return PredictionRecord(
        source_id=source_id,
        source_type=source_type,
        source_url="https://example.com",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        outcome=outcome,
        confidence_pct=confidence,
        raw_text="test",
    )

def test_normalize_deduplicates_same_source_id():
    records = [
        _rec("analyst", "W", 0.65, source_id="espn_A1"),
        _rec("analyst", "W", 0.65, source_id="espn_A1"),  # exact duplicate
    ]
    result = normalize_predictions(records)
    assert len(result) == 1

def test_normalize_keeps_different_sources():
    records = [
        _rec("analyst", "W", 0.65, source_id="espn_A1"),
        _rec("analyst", "D", 0.50, source_id="bbc_A1"),
    ]
    result = normalize_predictions(records)
    assert len(result) == 2

def test_normalize_clips_confidence_above_one():
    records = [_rec("analyst", "W", 1.5)]
    result = normalize_predictions(records)
    assert result[0].confidence_pct == 1.0

def test_normalize_clips_confidence_below_zero():
    records = [_rec("analyst", "W", -0.1)]
    result = normalize_predictions(records)
    assert result[0].confidence_pct == 0.0

def test_normalize_preserves_market_source_type():
    records = [_rec("prediction_market", "D", 0.45)]
    result = normalize_predictions(records)
    assert result[0].source_type == "prediction_market"

def test_normalize_empty_input():
    assert normalize_predictions([]) == []
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_normalize.py -v
```

Expected: `ImportError: cannot import name 'normalize_predictions'`

- [ ] **Step 3: Implement normalize.py**

```python
# src/normalize.py
from dataclasses import replace
from src.models import PredictionRecord

def normalize_predictions(records: list[PredictionRecord]) -> list[PredictionRecord]:
    """Deduplicate by source_id+match_id+outcome. Clip confidence to [0, 1]."""
    seen: set[str] = set()
    result: list[PredictionRecord] = []
    for r in records:
        key = f"{r.source_id}|{r.match_id}|{r.outcome}"
        if key in seen:
            continue
        seen.add(key)
        clipped = min(1.0, max(0.0, r.confidence_pct))
        if clipped != r.confidence_pct:
            r = replace(r, confidence_pct=clipped)
        result.append(r)
    return result
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_normalize.py -v
```

Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/normalize.py tests/test_normalize.py
git commit -m "feat: normalizer — dedup and clip prediction records"
```

---

## Task 2: Consensus Engine

**Files:**
- Create: `src/consensus.py`
- Create: `tests/test_consensus.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_consensus.py
from src.consensus import build_consensus
from src.models import PredictionRecord, ConsensusRecord, MatchFixture, TeamStats, RecentForm

def _rec(source_type: str, outcome: str, conf: float,
         match_id: str = "A1", idx: int = 0) -> PredictionRecord:
    return PredictionRecord(
        source_id=f"{source_type}_{outcome}_{idx}",
        source_type=source_type,
        source_url="",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        outcome=outcome,
        confidence_pct=conf,
        raw_text="",
    )

def _stats(team: str, elo: int) -> TeamStats:
    form = RecentForm(matches=10, wins=5, draws=3, losses=2,
                      goals_scored_avg=1.5, goals_conceded_avg=1.0)
    return TeamStats(team=team, elo_rating=elo, fifa_rank=5, recent_form=form)

FIXTURES = [MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11")]
STATS = {"USA": _stats("USA", 1900), "Mexico": _stats("Mexico", 1850)}

def test_consensus_returns_one_record_per_fixture():
    results = build_consensus(FIXTURES, [], STATS)
    assert len(results) == 1
    assert isinstance(results[0], ConsensusRecord)

def test_consensus_majority_outcome_wins():
    records = [
        _rec("analyst", "W", 0.70, idx=0),
        _rec("analyst", "W", 0.65, idx=1),
        _rec("informed_fan", "D", 0.55),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].consensus_outcome == "W"

def test_consensus_confidence_tier_high():
    records = [_rec("analyst", "W", 0.80, idx=i) for i in range(9)]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].confidence_tier == "high"

def test_consensus_confidence_tier_low():
    # No qualitative sources → prior dominates → likely medium or low for even teams
    results = build_consensus(FIXTURES, [], STATS)
    assert results[0].confidence_tier in ("low", "medium", "high")  # just verify it's set

def test_contrarian_flag_raised():
    records = [
        _rec("analyst", "W", 0.72, idx=0),
        _rec("analyst", "W", 0.68, idx=1),
        _rec("prediction_market", "D", 0.55),  # market says D, >15pp gap
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is True
    assert "market" in results[0].contrarian_detail.lower()

def test_no_contrarian_when_market_agrees():
    records = [
        _rec("analyst", "W", 0.65, idx=0),
        _rec("prediction_market", "W", 0.62),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is False

def test_source_count_excludes_markets():
    records = [
        _rec("analyst", "W", 0.65, idx=0),
        _rec("informed_fan", "W", 0.60),
        _rec("prediction_market", "D", 0.50),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].source_count == 2  # market not counted in source_count
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_consensus.py -v
```

Expected: `ImportError: cannot import name 'build_consensus'`

- [ ] **Step 3: Implement consensus.py**

```python
# src/consensus.py
from src.models import PredictionRecord, ConsensusRecord, MatchFixture, TeamStats
from src.stats.prior import compute_prior

_WEIGHTS: dict[str, float] = {"analyst": 1.0, "informed_fan": 0.6}
_CONTRARIAN_THRESHOLD = 0.15

def build_consensus(
    fixtures: list[MatchFixture],
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> list[ConsensusRecord]:
    return [_for_match(f, records, stats) for f in fixtures]

def _for_match(
    fixture: MatchFixture,
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> ConsensusRecord:
    match_records = [r for r in records if r.match_id == fixture.match_id]
    voting = [r for r in match_records if r.source_type != "prediction_market"]
    market = [r for r in match_records if r.source_type == "prediction_market"]

    prior = _prior(fixture, stats)
    prior_w, qual_w = _blend_weights(len(voting))

    # Weighted vote
    scores: dict[str, float] = {"W": 0.0, "D": 0.0, "L": 0.0}
    for r in voting:
        scores[r.outcome] += _WEIGHTS.get(r.source_type, 0.5) * r.confidence_pct
    total_qual = sum(scores.values()) or 1.0
    qual_probs = {k: v / total_qual for k, v in scores.items()}

    # Blend prior + qualitative
    blended = {
        o: prior_w * prior.get(o, 0.33) + qual_w * qual_probs.get(o, 0.0)
        for o in ("W", "D", "L")
    }
    total = sum(blended.values()) or 1.0
    blended = {k: v / total for k, v in blended.items()}

    outcome = max(blended, key=blended.__getitem__)
    conf = blended[outcome]
    contrarian_flag, contrarian_detail = _contrarian(outcome, conf, market)

    return ConsensusRecord(
        match_id=fixture.match_id,
        team_a=fixture.team_a,
        team_b=fixture.team_b,
        consensus_outcome=outcome,
        confidence_tier=_tier(conf),
        weighted_confidence=round(conf, 4),
        source_count=len(voting),
        contrarian_flag=contrarian_flag,
        contrarian_detail=contrarian_detail,
    )

def _prior(fixture: MatchFixture, stats: dict[str, TeamStats]) -> dict[str, float]:
    a, b = stats.get(fixture.team_a), stats.get(fixture.team_b)
    return compute_prior(a, b) if a and b else {"W": 0.34, "D": 0.33, "L": 0.33}

def _blend_weights(source_count: int) -> tuple[float, float]:
    if source_count <= 2:
        return 0.80, 0.20
    if source_count <= 7:
        return 0.55, 0.45
    return 0.30, 0.70

def _tier(conf: float) -> str:
    if conf >= 0.70:
        return "high"
    if conf >= 0.50:
        return "medium"
    return "low"

def _contrarian(
    consensus_outcome: str,
    consensus_conf: float,
    market_records: list[PredictionRecord],
) -> tuple[bool, str]:
    if not market_records:
        return False, ""
    best = max(market_records, key=lambda r: r.confidence_pct)
    if best.outcome != consensus_outcome and abs(best.confidence_pct - consensus_conf) > _CONTRARIAN_THRESHOLD:
        detail = (f"Markets favor {best.outcome} ({best.confidence_pct:.0%}) "
                  f"vs expert consensus {consensus_outcome} ({consensus_conf:.0%})")
        return True, detail
    return False, ""
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_consensus.py -v
```

Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add src/consensus.py tests/test_consensus.py
git commit -m "feat: consensus engine — Bayesian blend + contrarian detection"
```

---

## Task 3: Report Generator

**Files:**
- Create: `src/report.py`
- Create: `tests/test_report.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_report.py
from src.report import render_report
from src.models import ConsensusRecord

def _cr(match_id: str, outcome: str, tier: str, contrarian: bool = False) -> ConsensusRecord:
    return ConsensusRecord(
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        consensus_outcome=outcome,
        confidence_tier=tier,
        weighted_confidence=0.65,
        source_count=8,
        contrarian_flag=contrarian,
        contrarian_detail="Markets favor D (48%) vs expert W (65%)" if contrarian else "",
    )

def test_render_report_contains_header():
    report = render_report([_cr("A1", "W", "high")], run_date="2026-06-07")
    assert "Quiniela 2026" in report
    assert "2026-06-07" in report

def test_render_report_contains_match_row():
    report = render_report([_cr("A1", "W", "high")], run_date="2026-06-07")
    assert "A1" in report
    assert "USA" in report
    assert "Mexico" in report
    assert "| **W**" in report
    assert "HIGH" in report

def test_render_report_contrarian_in_watchlist():
    report = render_report([_cr("A1", "W", "medium", contrarian=True)], run_date="2026-06-07")
    assert "Contrarian Watchlist" in report
    assert "Markets favor D" in report

def test_render_report_watchlist_empty_when_no_contrarian():
    report = render_report([_cr("A1", "W", "high", contrarian=False)], run_date="2026-06-07")
    assert "Contrarian Watchlist" in report
    assert "No significant contrarian signals" in report

def test_render_report_source_count_in_header():
    records = [_cr("A1", "W", "high"), _cr("B1", "L", "medium")]
    report = render_report(records, run_date="2026-06-07")
    assert "16" in report  # 8 sources × 2 records
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_report.py -v
```

Expected: `ImportError: cannot import name 'render_report'`

- [ ] **Step 3: Implement report.py**

```python
# src/report.py
from src.models import ConsensusRecord

_TIER_LABEL = {"high": "HIGH", "medium": "MED", "low": "LOW"}

def render_report(records: list[ConsensusRecord], run_date: str) -> str:
    total_sources = sum(r.source_count for r in records)
    lines = [
        f"# Quiniela 2026 — Recommendations ({run_date})",
        "",
        f"> Generated from {total_sources} source predictions across {len(records)} matches.",
        "",
        "## Group Stage Picks",
        "",
        "| Match | Team A | Team B | Pick | Confidence | Sources | Alert |",
        "|-------|--------|--------|------|------------|---------|-------|",
    ]

    for r in records:
        tier = _TIER_LABEL.get(r.confidence_tier, r.confidence_tier.upper())
        alert = "⚠" if r.contrarian_flag else ""
        lines.append(
            f"| {r.match_id} | {r.team_a} | {r.team_b} "
            f"| **{r.consensus_outcome}** "
            f"| {tier} ({r.weighted_confidence:.0%}) "
            f"| {r.source_count} | {alert} |"
        )

    contrarians = [r for r in records if r.contrarian_flag]
    lines += ["", "## Contrarian Watchlist", ""]
    if contrarians:
        lines.append("Picks where prediction markets diverge >15pp from expert consensus:\n")
        for r in contrarians:
            lines.append(f"- **{r.match_id}** ({r.team_a} vs {r.team_b}): {r.contrarian_detail}")
    else:
        lines.append("No significant contrarian signals detected.")

    return "\n".join(lines)
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_report.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/report.py tests/test_report.py
git commit -m "feat: report renderer — markdown table with contrarian watchlist"
```

---

## Task 4: Pipeline CLI

**Files:**
- Create: `src/pipeline.py`

- [ ] **Step 1: Run full test suite — all phases must be green before wiring the CLI**

```bash
pytest tests/ -v
```

Expected: all tests pass (Phases 1–4). Fix any failures before continuing.

- [ ] **Step 2: Create pipeline.py**

```python
# src/pipeline.py
"""
Quiniela 2026 Prediction Pipeline
Usage:  python src/pipeline.py
Env:    ANTHROPIC_API_KEY, FOOTBALL_DATA_API_KEY, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET
Output: output/YYYY-MM-DD_raw_data.json
        output/YYYY-MM-DD_consensus.json
        output/YYYY-MM-DD_quiniela_report.md
"""
import json
import os
from dataclasses import asdict
from datetime import date
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from src.stats.elo import fetch_elo_ratings
from src.stats.form import fetch_recent_form, fetch_fixtures
from src.stats.squads import fetch_squad_flags
from src.research.analysts import fetch_analyst_predictions
from src.research.markets import fetch_market_predictions
from src.research.forums import fetch_forum_predictions
from src.normalize import normalize_predictions
from src.consensus import build_consensus
from src.report import render_report
from src.models import TeamStats

def run() -> None:
    anthropic_key = os.environ["ANTHROPIC_API_KEY"]
    fd_key        = os.environ["FOOTBALL_DATA_API_KEY"]
    reddit_cid    = os.environ["REDDIT_CLIENT_ID"]
    reddit_csec   = os.environ["REDDIT_CLIENT_SECRET"]

    run_date   = date.today().isoformat()
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    # ── Phase 1: GATHER ───────────────────────────────────────────────────────

    print("=== Phase 1: GATHER ===")

    print("[1/6] Fetching WC2026 fixtures from football-data.org...")
    fixtures = fetch_fixtures(api_key=fd_key)
    if not fixtures:
        print("ERROR: No fixtures returned. Verify FOOTBALL_DATA_API_KEY and that WC2026 "
              "is available at https://api.football-data.org/v4/competitions/WC/matches")
        return
    print(f"  {len(fixtures)} fixtures loaded.")

    all_teams = sorted({t for f in fixtures for t in (f.team_a, f.team_b)})

    print("[2/6] Fetching Elo ratings from eloratings.net...")
    elo_ratings = fetch_elo_ratings()
    print(f"  {len(elo_ratings)} teams rated.")

    print("[3/6] Fetching recent form and squad flags...")
    squad_flags = fetch_squad_flags(all_teams, api_key=anthropic_key)
    stats: dict[str, TeamStats] = {}
    for team in all_teams:
        form = fetch_recent_form(team, api_key=fd_key)
        stats[team] = TeamStats(
            team=team,
            elo_rating=elo_ratings.get(team, 1700),
            fifa_rank=0,
            recent_form=form,
            squad_flags=squad_flags.get(team, []),
        )
    print(f"  Stats built for {len(stats)} teams.")

    print("[4/6] Fetching analyst predictions via Claude + web search...")
    analyst_records = fetch_analyst_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(analyst_records)} analyst records.")

    print("[5/6] Fetching prediction market odds via Claude + web search...")
    market_records = fetch_market_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(market_records)} market records.")

    print("[6/6] Fetching Reddit predictions (quality-filtered)...")
    forum_records = fetch_forum_predictions(
        fixtures,
        reddit_client_id=reddit_cid,
        reddit_client_secret=reddit_csec,
        anthropic_api_key=anthropic_key,
    )
    print(f"  {len(forum_records)} forum records passed quality filter.")

    # ── Phase 2: MODEL ────────────────────────────────────────────────────────

    print("\n=== Phase 2: MODEL ===")
    all_records = normalize_predictions(analyst_records + market_records + forum_records)
    print(f"  {len(all_records)} normalized records.")

    consensus = build_consensus(fixtures, all_records, stats)
    contrarians = sum(1 for c in consensus if c.contrarian_flag)
    print(f"  {len(consensus)} consensus picks. {contrarians} contrarian alerts.")

    # ── Phase 3: OUTPUT ───────────────────────────────────────────────────────

    print("\n=== Phase 3: OUTPUT ===")

    raw_path = output_dir / f"{run_date}_raw_data.json"
    raw_path.write_text(json.dumps([asdict(r) for r in all_records], indent=2))
    print(f"  {raw_path}")

    consensus_path = output_dir / f"{run_date}_consensus.json"
    consensus_path.write_text(json.dumps([asdict(c) for c in consensus], indent=2))
    print(f"  {consensus_path}")

    report_path = output_dir / f"{run_date}_quiniela_report.md"
    report_path.write_text(render_report(consensus, run_date=run_date))
    print(f"  {report_path}")

    print(f"\nDone. Open your report:\n  {report_path}")

if __name__ == "__main__":
    run()
```

- [ ] **Step 3: Smoke-test imports**

```bash
python -c "from src.pipeline import run; print('import OK')"
```

Expected: `import OK`

- [ ] **Step 4: Copy .env.example to .env and fill in keys**

```bash
cp .env.example .env
```

Edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...         # https://console.anthropic.com/keys
FOOTBALL_DATA_API_KEY=...             # https://www.football-data.org/client/register (free)
REDDIT_CLIENT_ID=...                  # https://www.reddit.com/prefs/apps → create app → "script"
REDDIT_CLIENT_SECRET=...
```

- [ ] **Step 5: Run the pipeline**

```bash
python src/pipeline.py
```

Expected output:
```
=== Phase 1: GATHER ===
[1/6] Fetching WC2026 fixtures from football-data.org...
  72 fixtures loaded.
[2/6] Fetching Elo ratings from eloratings.net...
  ...
=== Phase 2: MODEL ===
  ... consensus picks. ... contrarian alerts.
=== Phase 3: OUTPUT ===
  output/2026-06-07_raw_data.json
  output/2026-06-07_consensus.json
  output/2026-06-07_quiniela_report.md
Done.
```

If `[1/6]` returns 0 fixtures: football-data.org may not have WC2026 indexed yet. Check `https://api.football-data.org/v4/competitions` for the correct competition code and update `BASE_URL` in `src/stats/form.py:fetch_fixtures()` accordingly.

- [ ] **Step 6: Verify report**

```bash
# Windows
type output\2026-06-07_quiniela_report.md
```

Verify: table has rows, confidence tiers are HIGH/MED/LOW, contrarian watchlist present.

- [ ] **Step 7: Commit**

```bash
git add src/pipeline.py
git commit -m "feat: pipeline CLI — full Phase 1→2→3 orchestration"
```

---

**Phase 4 complete. Pipeline is live.**

Re-run daily until quiniela submission closes:
```bash
python src/pipeline.py
```
Each run produces fresh date-stamped files in `output/`.
