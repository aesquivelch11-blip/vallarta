# Quiniela 2026 Prediction Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Python CLI pipeline that gathers Elo/form stats, expert analyst predictions, prediction market odds, and quality-filtered Reddit posts, then outputs ranked W/D/L picks with confidence tiers and contrarian alerts for WC2026.

**Architecture:** Three-phase pipeline — GATHER (stats + qualitative sources) → MODEL (Bayesian blend of prior + qualitative) → OUTPUT (JSON + markdown report). Re-runnable; each run produces date-stamped files in `output/`.

**Tech Stack:** Python 3.11+, `anthropic` SDK (Claude API with web_search tool), `requests`, `beautifulsoup4`, `praw`, `pyyaml`, `pytest`, `pytest-mock`

---

## File Map

```
src/
  models.py               # dataclasses: TeamStats, PredictionRecord, ConsensusRecord, MatchFixture
  stats/
    __init__.py
    elo.py                # scrape eloratings.net → {team: elo_rating}
    form.py               # football-data.org API → recent match results → RecentForm
    squads.py             # Claude API web search → squad flags per team
    prior.py              # Elo + form → match prior {W, D, L}
  research/
    __init__.py
    analysts.py           # Claude API + web_search → analyst PredictionRecords
    markets.py            # Claude API + web_search → Polymarket/Kalshi PredictionRecords
    forums.py             # PRAW + Claude quality filter → informed_fan PredictionRecords
  normalize.py            # merge all sources → List[PredictionRecord]
  consensus.py            # Bayesian blend + contrarian detection → List[ConsensusRecord]
  report.py               # render ConsensusRecords → markdown report
  pipeline.py             # CLI entrypoint: orchestrates all phases
data/
  sources.yaml            # analyst URLs + Reddit subreddits config
  fixtures.yaml           # WC2026 match schedule (group + teams per match)
output/                   # gitignored — pipeline writes here
tests/
  test_models.py
  test_prior.py
  test_normalize.py
  test_consensus.py
  test_report.py
requirements.txt
.env.example
.gitignore
```

> **Note:** Spec defined `research.py` as a single file. Split into `src/stats/` + `src/research/` sub-packages for clarity — each file stays under ~150 lines.

---

## Task 1: Project Setup

**Files:**
- Create: `requirements.txt`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `data/sources.yaml`
- Create: `data/fixtures.yaml`
- Create: `src/__init__.py`, `src/stats/__init__.py`, `src/research/__init__.py`
- Create: `tests/__init__.py`

- [ ] **Step 1: Create requirements.txt**

```
anthropic>=0.40.0
requests>=2.31.0
beautifulsoup4>=4.12.0
praw>=7.7.0
pyyaml>=6.0.1
pytest>=7.4.0
pytest-mock>=3.12.0
python-dotenv>=1.0.0
```

- [ ] **Step 2: Create .env.example**

```
ANTHROPIC_API_KEY=your_key_here
FOOTBALL_DATA_API_KEY=your_key_here
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

- [ ] **Step 3: Create .gitignore**

```
output/
.env
__pycache__/
*.pyc
.pytest_cache/
```

- [ ] **Step 4: Create data/sources.yaml**

```yaml
analyst_sources:
  - name: ESPN FC WC2026 predictions
    url: https://www.espn.com/soccer/story/_/id/world-cup-2026-predictions
  - name: BBC Sport WC2026 preview
    url: https://www.bbc.com/sport/football/world-cup/2026
  - name: The Athletic WC2026
    url: https://theathletic.com/world-cup-2026/
  - name: FiveThirtyEight Soccer
    url: https://fivethirtyeight.com/soccer/world-cup/

reddit_subreddits:
  - soccer
  - WorldCup
  - FIFA
  - ussoccer
  - brasil
  - argentina
  - soccerplayer

market_sources:
  - name: Polymarket WC2026
    query: "Polymarket World Cup 2026 winner odds"
  - name: Kalshi WC2026
    query: "Kalshi World Cup 2026 winner predictions market"
```

- [ ] **Step 5: Create data/fixtures.yaml**

```yaml
# WC2026 Group Stage — 48 teams, Groups A-L, 6 matches per group
# Format: match_id, group, team_a (home listed first), team_b, date
# Fetch from football-data.org if available; fill manually if not
# Competition code on football-data.org: WC (verify at https://api.football-data.org/v4/competitions)
matches: []  # populated by Task 3 form.py fetch_fixtures()
```

- [ ] **Step 6: Create package init files**

Create empty `src/__init__.py`, `src/stats/__init__.py`, `src/research/__init__.py`, `tests/__init__.py`.

- [ ] **Step 7: Install dependencies**

```bash
pip install -r requirements.txt
```

Expected: all packages install without error.

- [ ] **Step 8: Commit**

```bash
git add requirements.txt .env.example .gitignore data/ src/ tests/
git commit -m "chore: project scaffold, dependencies, config files"
```

---

## Task 2: Data Models

**Files:**
- Create: `src/models.py`
- Create: `tests/test_models.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_models.py
from src.models import RecentForm, TeamStats, PredictionRecord, ConsensusRecord, MatchFixture

def test_recent_form_fields():
    f = RecentForm(matches=10, wins=6, draws=2, losses=2,
                   goals_scored_avg=1.8, goals_conceded_avg=0.9)
    assert f.matches == 10
    assert f.wins == 6

def test_team_stats_squad_flags_default_empty():
    f = RecentForm(matches=10, wins=6, draws=2, losses=2,
                   goals_scored_avg=1.8, goals_conceded_avg=0.9)
    ts = TeamStats(team="Brazil", elo_rating=2100, fifa_rank=1, recent_form=f)
    assert ts.squad_flags == []

def test_prediction_record_fields():
    pr = PredictionRecord(
        source_id="espn_2026-06-07",
        source_type="analyst",
        source_url="https://espn.com",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id="A1",
        team_a="USA",
        team_b="Mexico",
        outcome="W",
        confidence_pct=0.65,
        raw_text="USA edge Mexico in opener"
    )
    assert pr.outcome == "W"
    assert pr.confidence_pct == 0.65

def test_consensus_record_fields():
    cr = ConsensusRecord(
        match_id="A1",
        team_a="USA",
        team_b="Mexico",
        consensus_outcome="W",
        confidence_tier="medium",
        weighted_confidence=0.62,
        source_count=5,
        contrarian_flag=False,
        contrarian_detail=""
    )
    assert cr.confidence_tier == "medium"

def test_match_fixture_fields():
    mf = MatchFixture(match_id="A1", group="A", team_a="USA",
                      team_b="Mexico", date="2026-06-11")
    assert mf.group == "A"
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_models.py -v
```

Expected: `ImportError: cannot import name 'RecentForm' from 'src.models'`

- [ ] **Step 3: Implement models**

```python
# src/models.py
from dataclasses import dataclass, field
from typing import Literal

@dataclass
class RecentForm:
    matches: int
    wins: int
    draws: int
    losses: int
    goals_scored_avg: float
    goals_conceded_avg: float

@dataclass
class TeamStats:
    team: str
    elo_rating: int
    fifa_rank: int
    recent_form: RecentForm
    squad_flags: list[str] = field(default_factory=list)

@dataclass
class PredictionRecord:
    source_id: str
    source_type: Literal["analyst", "informed_fan", "prediction_market"]
    source_url: str
    timestamp: str
    prediction_type: Literal["group_match", "bracket", "winner", "golden_boot"]
    match_id: str
    team_a: str
    team_b: str
    outcome: Literal["W", "D", "L"]
    confidence_pct: float
    raw_text: str

@dataclass
class ConsensusRecord:
    match_id: str
    team_a: str
    team_b: str
    consensus_outcome: Literal["W", "D", "L"]
    confidence_tier: Literal["high", "medium", "low"]
    weighted_confidence: float
    source_count: int
    contrarian_flag: bool
    contrarian_detail: str

@dataclass
class MatchFixture:
    match_id: str
    group: str
    team_a: str
    team_b: str
    date: str
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_models.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/models.py tests/test_models.py
git commit -m "feat: add data models (TeamStats, PredictionRecord, ConsensusRecord, MatchFixture)"
```

---

## Task 3: Elo Scraper

**Files:**
- Create: `src/stats/elo.py`
- Create: `tests/test_elo.py` (uses `pytest-mock` to avoid live HTTP)

- [ ] **Step 1: Write failing test**

```python
# tests/test_elo.py
from unittest.mock import patch, MagicMock
from src.stats.elo import fetch_elo_ratings

SAMPLE_HTML = """
<html><body>
<table id="elo-ratings">
  <tr><td>1</td><td><a href="/brazil">Brazil</a></td><td>2089</td></tr>
  <tr><td>2</td><td><a href="/spain">Spain</a></td><td>2048</td></tr>
  <tr><td>3</td><td><a href="/france">France</a></td><td>2005</td></tr>
</table>
</body></html>
"""

def test_fetch_elo_ratings_parses_html(mocker):
    mock_resp = MagicMock()
    mock_resp.text = SAMPLE_HTML
    mock_resp.raise_for_status = MagicMock()
    mocker.patch("src.stats.elo.requests.get", return_value=mock_resp)

    ratings = fetch_elo_ratings()
    assert ratings["Brazil"] == 2089
    assert ratings["Spain"] == 2048
    assert ratings["France"] == 2005

def test_fetch_elo_ratings_returns_dict(mocker):
    mock_resp = MagicMock()
    mock_resp.text = SAMPLE_HTML
    mock_resp.raise_for_status = MagicMock()
    mocker.patch("src.stats.elo.requests.get", return_value=mock_resp)

    ratings = fetch_elo_ratings()
    assert isinstance(ratings, dict)
    assert len(ratings) == 3
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_elo.py -v
```

Expected: `ImportError: cannot import name 'fetch_elo_ratings'`

- [ ] **Step 3: Implement elo.py**

```python
# src/stats/elo.py
import requests
from bs4 import BeautifulSoup

ELO_URL = "http://www.eloratings.net/"

def fetch_elo_ratings() -> dict[str, int]:
    """Scrape eloratings.net. Returns {team_name: elo_rating}."""
    resp = requests.get(ELO_URL, timeout=15, headers={"User-Agent": "quiniela2026/1.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    ratings: dict[str, int] = {}
    # eloratings.net table: rank | team link | rating | ...
    for row in soup.select("table tr"):
        cells = row.find_all("td")
        if len(cells) < 3:
            continue
        team_cell = cells[1].find("a")
        rating_cell = cells[2]
        if team_cell and rating_cell:
            team = team_cell.get_text(strip=True)
            try:
                rating = int(rating_cell.get_text(strip=True).replace(",", ""))
                ratings[team] = rating
            except ValueError:
                continue
    return ratings
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_elo.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/stats/elo.py tests/test_elo.py
git commit -m "feat(stats): elo scraper from eloratings.net"
```

---

## Task 4: Form Fetcher + Fixture Loader

**Files:**
- Create: `src/stats/form.py`
- Create: `tests/test_form.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_form.py
from unittest.mock import patch, MagicMock
from src.stats.form import fetch_recent_form, fetch_fixtures
from src.models import RecentForm, MatchFixture

SAMPLE_MATCHES_RESPONSE = {
    "matches": [
        {"homeTeam": {"name": "Brazil"}, "awayTeam": {"name": "Germany"},
         "score": {"fullTime": {"home": 2, "away": 0}}, "status": "FINISHED"},
        {"homeTeam": {"name": "Brazil"}, "awayTeam": {"name": "France"},
         "score": {"fullTime": {"home": 1, "away": 1}}, "status": "FINISHED"},
        {"homeTeam": {"name": "Argentina"}, "awayTeam": {"name": "Brazil"},
         "score": {"fullTime": {"home": 0, "away": 1}}, "status": "FINISHED"},
    ]
}

def test_fetch_recent_form_win(mocker):
    mocker.patch("src.stats.form.requests.get",
                 return_value=MagicMock(json=lambda: SAMPLE_MATCHES_RESPONSE,
                                        raise_for_status=MagicMock()))
    form = fetch_recent_form("Brazil", api_key="test")
    assert form.wins == 3
    assert form.draws == 1
    assert form.losses == 0
    assert form.matches == 4  # 3 matches in sample but 2 home wins + 1 draw + 1 away win

def test_fetch_recent_form_returns_recent_form(mocker):
    mocker.patch("src.stats.form.requests.get",
                 return_value=MagicMock(json=lambda: SAMPLE_MATCHES_RESPONSE,
                                        raise_for_status=MagicMock()))
    form = fetch_recent_form("Brazil", api_key="test")
    assert isinstance(form, RecentForm)
    assert 0.0 <= form.goals_scored_avg <= 10.0
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_form.py -v
```

Expected: `ImportError: cannot import name 'fetch_recent_form'`

- [ ] **Step 3: Implement form.py**

```python
# src/stats/form.py
import requests
from src.models import RecentForm, MatchFixture

BASE_URL = "https://api.football-data.org/v4"

def fetch_recent_form(team_name: str, api_key: str, n_matches: int = 10) -> RecentForm:
    """Fetch last n_matches results for team via football-data.org API."""
    headers = {"X-Auth-Token": api_key}
    # Search team by name
    resp = requests.get(f"{BASE_URL}/teams", headers=headers,
                        params={"name": team_name}, timeout=15)
    resp.raise_for_status()
    teams = resp.json().get("teams", [])
    if not teams:
        return _empty_form()

    team_id = teams[0]["id"]
    resp = requests.get(f"{BASE_URL}/teams/{team_id}/matches",
                        headers=headers,
                        params={"status": "FINISHED", "limit": n_matches},
                        timeout=15)
    resp.raise_for_status()
    matches = resp.json().get("matches", [])

    wins = draws = losses = 0
    goals_scored = goals_conceded = 0

    for m in matches:
        home = m["homeTeam"]["name"]
        score = m["score"]["fullTime"]
        gh, ga = score.get("home") or 0, score.get("away") or 0
        if home == team_name:
            gs, gc = gh, ga
        else:
            gs, gc = ga, gh

        goals_scored += gs
        goals_conceded += gc
        if gs > gc:
            wins += 1
        elif gs == gc:
            draws += 1
        else:
            losses += 1

    total = wins + draws + losses or 1
    return RecentForm(
        matches=total,
        wins=wins,
        draws=draws,
        losses=losses,
        goals_scored_avg=round(goals_scored / total, 2),
        goals_conceded_avg=round(goals_conceded / total, 2),
    )

def fetch_fixtures(api_key: str) -> list[MatchFixture]:
    """Fetch WC2026 group stage fixtures from football-data.org."""
    headers = {"X-Auth-Token": api_key}
    resp = requests.get(f"{BASE_URL}/competitions/WC/matches",
                        headers=headers,
                        params={"stage": "GROUP_STAGE"},
                        timeout=15)
    resp.raise_for_status()
    raw = resp.json().get("matches", [])

    fixtures = []
    for i, m in enumerate(raw):
        group = m.get("group", "?").replace("GROUP_", "")
        match_id = f"{group}{i+1}"
        fixtures.append(MatchFixture(
            match_id=match_id,
            group=group,
            team_a=m["homeTeam"]["name"],
            team_b=m["awayTeam"]["name"],
            date=m.get("utcDate", "")[:10],
        ))
    return fixtures

def _empty_form() -> RecentForm:
    return RecentForm(matches=1, wins=0, draws=1, losses=0,
                      goals_scored_avg=0.0, goals_conceded_avg=0.0)
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_form.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/stats/form.py tests/test_form.py
git commit -m "feat(stats): form fetcher and fixture loader from football-data.org"
```

---

## Task 5: Prior Calculator

**Files:**
- Create: `src/stats/prior.py`
- Create: `tests/test_prior.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_prior.py
from src.stats.prior import compute_prior
from src.models import TeamStats, RecentForm

def _make_team(name: str, elo: int, wins: int = 5, draws: int = 3, losses: int = 2) -> TeamStats:
    form = RecentForm(matches=10, wins=wins, draws=draws, losses=losses,
                      goals_scored_avg=1.5, goals_conceded_avg=1.0)
    return TeamStats(team=name, elo_rating=elo, fifa_rank=1, recent_form=form)

def test_prior_sums_to_one():
    a = _make_team("Brazil", 2100)
    b = _make_team("Germany", 1950)
    prior = compute_prior(a, b)
    assert abs(sum(prior.values()) - 1.0) < 1e-6

def test_prior_keys():
    a = _make_team("Brazil", 2100)
    b = _make_team("Germany", 1950)
    prior = compute_prior(a, b)
    assert set(prior.keys()) == {"W", "D", "L"}

def test_stronger_team_higher_win_prob():
    strong = _make_team("Brazil", 2100)
    weak = _make_team("Minnow", 1500)
    prior = compute_prior(strong, weak)
    assert prior["W"] > prior["L"]
    assert prior["W"] > 0.70

def test_even_teams_higher_draw_prob():
    a = _make_team("TeamA", 1800)
    b = _make_team("TeamB", 1800)
    prior_even = compute_prior(a, b)

    strong = _make_team("Strong", 2100)
    weak = _make_team("Weak", 1500)
    prior_uneven = compute_prior(strong, weak)

    assert prior_even["D"] > prior_uneven["D"]

def test_all_probs_above_floor():
    strong = _make_team("Brazil", 2200)
    weak = _make_team("Minnow", 1400)
    prior = compute_prior(strong, weak)
    assert prior["W"] >= 0.05
    assert prior["D"] >= 0.05
    assert prior["L"] >= 0.05
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_prior.py -v
```

Expected: `ImportError: cannot import name 'compute_prior'`

- [ ] **Step 3: Implement prior.py**

```python
# src/stats/prior.py
from src.models import TeamStats

def compute_prior(team_a: TeamStats, team_b: TeamStats) -> dict[str, float]:
    """
    Compute match prior {W, D, L} from Elo ratings and recent form.
    W = team_a wins, L = team_a loses.
    """
    a_form = _form_score(team_a)
    b_form = _form_score(team_b)

    elo_delta = team_a.elo_rating - team_b.elo_rating
    base_win = 1.0 / (1.0 + 10 ** (-elo_delta / 400))
    form_adj = (a_form - b_form) * 0.05  # max ±5pp

    # Draw rate: closer Elo → higher draw (max 0.30), larger gap → lower (min 0.18)
    draw = 0.25 + max(-0.07, min(0.05, -abs(elo_delta) / 3000))

    w = base_win + form_adj
    l = 1.0 - w - draw

    # Apply floor of 0.05 to all outcomes
    w = max(0.05, w)
    l = max(0.05, l)
    draw = max(0.05, draw)

    # Renormalize
    total = w + draw + l
    return {"W": round(w / total, 4), "D": round(draw / total, 4), "L": round(l / total, 4)}

def _form_score(team: TeamStats) -> float:
    """Points-based form score 0.0–1.0 using last N matches."""
    f = team.recent_form
    if f.matches == 0:
        return 0.5
    return (f.wins * 3 + f.draws) / (f.matches * 3)
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_prior.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/stats/prior.py tests/test_prior.py
git commit -m "feat(stats): Bayesian prior from Elo + form (prior.py)"
```

---

## Task 6: Analyst Research (Claude API + Web Search)

**Files:**
- Create: `src/research/analysts.py`
- Create: `tests/test_analysts.py`

Note: `deep-research` and `prediction-market-oracle-research` are Claude Code session skills, not importable libraries. This module calls the Anthropic Python SDK directly with `web_search_20250305` tool — the same underlying capability those skills use.

- [ ] **Step 1: Write failing test**

```python
# tests/test_analysts.py
from unittest.mock import MagicMock, patch
from src.research.analysts import fetch_analyst_predictions
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
    MatchFixture(match_id="A2", group="A", team_a="Brazil", team_b="Germany", date="2026-06-12"),
]

MOCK_LLM_CONTENT = """
[
  {
    "match_id": "A1",
    "team_a": "USA",
    "team_b": "Mexico",
    "outcome": "W",
    "confidence_pct": 0.55,
    "source_url": "https://espn.com/wc2026",
    "raw_text": "USA expected to win at home advantage"
  },
  {
    "match_id": "A2",
    "team_a": "Brazil",
    "team_b": "Germany",
    "outcome": "W",
    "confidence_pct": 0.70,
    "source_url": "https://bbc.com/sport/wc2026",
    "raw_text": "Brazil clear favorites vs Germany"
  }
]
"""

def test_fetch_analyst_predictions_returns_records(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_LLM_CONTENT)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    assert len(records) == 2
    assert all(isinstance(r, PredictionRecord) for r in records)
    assert all(r.source_type == "analyst" for r in records)
    assert records[0].outcome in ("W", "D", "L")

def test_fetch_analyst_predictions_outcome_valid(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_LLM_CONTENT)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    for r in records:
        assert r.outcome in ("W", "D", "L")
        assert 0.0 <= r.confidence_pct <= 1.0
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_analysts.py -v
```

Expected: `ImportError: cannot import name 'fetch_analyst_predictions'`

- [ ] **Step 3: Implement analysts.py**

```python
# src/research/analysts.py
import json
import anthropic
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a football analytics researcher aggregating expert predictions for WC2026.
Given a list of group stage matches, search for analyst and expert predictions from reputable sources
(ESPN, BBC Sport, The Athletic, Sky Sports, Guardian, etc.).

For each match return a JSON array. Each element must have:
  match_id, team_a, team_b, outcome (W/D/L from team_a perspective),
  confidence_pct (0.0-1.0), source_url, raw_text (brief quote or summary).

Return ONLY valid JSON. No markdown fences. No explanation outside the array."""

def fetch_analyst_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = anthropic.Anthropic(api_key=api_key)
    batch_size = 6  # one group per call

    all_records: list[PredictionRecord] = []
    for i in range(0, len(fixtures), batch_size):
        batch = fixtures[i:i + batch_size]
        records = _fetch_batch(client, batch)
        all_records.extend(records)

    return all_records

def _fetch_batch(client: anthropic.Anthropic, fixtures: list[MatchFixture]) -> list[PredictionRecord]:
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    prompt = f"Research analyst predictions for these WC2026 group stage matches:\n{match_list}"

    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}],
    )

    # Extract text content from response (may follow tool use blocks)
    text = ""
    for block in response.content:
        if hasattr(block, "type") and block.type == "text":
            text = block.text
            break

    return _parse_response(text)

def _parse_response(text: str) -> list[PredictionRecord]:
    try:
        data = json.loads(text.strip())
    except json.JSONDecodeError:
        return []

    records = []
    ts = datetime.now(timezone.utc).isoformat()
    for item in data:
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
            conf = float(item.get("confidence_pct", 0.5))
            records.append(PredictionRecord(
                source_id=f"analyst_{item['match_id']}_{ts[:10]}",
                source_type="analyst",
                source_url=item.get("source_url", ""),
                timestamp=ts,
                prediction_type="group_match",
                match_id=item["match_id"],
                team_a=item["team_a"],
                team_b=item["team_b"],
                outcome=item["outcome"],
                confidence_pct=min(1.0, max(0.0, conf)),
                raw_text=item.get("raw_text", ""),
            ))
        except (KeyError, ValueError):
            continue
    return records
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_analysts.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/research/analysts.py tests/test_analysts.py
git commit -m "feat(research): analyst predictions via Claude API + web search"
```

---

## Task 7: Markets Research

**Files:**
- Create: `src/research/markets.py`
- Create: `tests/test_markets.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_markets.py
from unittest.mock import MagicMock, patch
from src.research.markets import fetch_market_predictions
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
]

MOCK_MARKET_JSON = """
[
  {
    "match_id": "A1",
    "team_a": "USA",
    "team_b": "Mexico",
    "outcome": "D",
    "confidence_pct": 0.48,
    "source_url": "https://polymarket.com/wc2026",
    "raw_text": "Draw 48% implied probability on Polymarket"
  }
]
"""

def test_fetch_market_predictions_source_type(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_MARKET_JSON)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.markets.anthropic.Anthropic", return_value=mock_client)

    records = fetch_market_predictions(SAMPLE_FIXTURES, api_key="test")
    assert all(r.source_type == "prediction_market" for r in records)

def test_fetch_market_predictions_returns_records(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_MARKET_JSON)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.markets.anthropic.Anthropic", return_value=mock_client)

    records = fetch_market_predictions(SAMPLE_FIXTURES, api_key="test")
    assert len(records) >= 1
    assert isinstance(records[0], PredictionRecord)
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_markets.py -v
```

Expected: `ImportError: cannot import name 'fetch_market_predictions'`

- [ ] **Step 3: Implement markets.py**

```python
# src/research/markets.py
import json
import anthropic
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a prediction market researcher. Given WC2026 matches, search Polymarket and Kalshi
for current market-implied probabilities.

For each match return a JSON array. Each element:
  match_id, team_a, team_b, outcome (W/D/L, highest-probability outcome from team_a perspective),
  confidence_pct (market-implied probability 0.0-1.0), source_url, raw_text.

Evaluate signal quality: note thin liquidity or stale markets in raw_text.
Return ONLY valid JSON array. No markdown fences."""

def fetch_market_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = anthropic.Anthropic(api_key=api_key)
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    prompt = f"Find prediction market odds for these WC2026 matches:\n{match_list}"

    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}],
    )

    text = ""
    for block in response.content:
        if hasattr(block, "type") and block.type == "text":
            text = block.text
            break

    return _parse_response(text)

def _parse_response(text: str) -> list[PredictionRecord]:
    try:
        data = json.loads(text.strip())
    except json.JSONDecodeError:
        return []

    records = []
    ts = datetime.now(timezone.utc).isoformat()
    for item in data:
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
            conf = float(item.get("confidence_pct", 0.5))
            records.append(PredictionRecord(
                source_id=f"market_{item['match_id']}_{ts[:10]}",
                source_type="prediction_market",
                source_url=item.get("source_url", ""),
                timestamp=ts,
                prediction_type="group_match",
                match_id=item["match_id"],
                team_a=item["team_a"],
                team_b=item["team_b"],
                outcome=item["outcome"],
                confidence_pct=min(1.0, max(0.0, conf)),
                raw_text=item.get("raw_text", ""),
            ))
        except (KeyError, ValueError):
            continue
    return records
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_markets.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/research/markets.py tests/test_markets.py
git commit -m "feat(research): prediction market odds via Claude API + web search"
```

---

## Task 8: Forum Scraper + LLM Quality Filter

**Files:**
- Create: `src/research/forums.py`
- Create: `tests/test_forums.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_forums.py
from unittest.mock import MagicMock, patch
from src.research.forums import fetch_forum_predictions, _score_post_quality
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
]

def test_score_post_quality_high(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="8")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "USA's 4-3-3 with tactical press vs Mexico's 5-4-1 block. Pulisic xG last 10 games 0.62/90. USA should dominate possession.")
    assert score == 8

def test_score_post_quality_low(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="2")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "USA will definitely win bro they're the best!!!")
    assert score == 2

def test_fetch_forum_predictions_filters_low_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_reddit.subreddit.return_value = mock_sub

    expert_post = MagicMock()
    expert_post.title = "USA vs Mexico tactical breakdown: pressing stats and xG"
    expert_post.selftext = "USA's high press under Berhalter averages 18 PPDA. Mexico's build-up allows 2.1 xGA/90."
    expert_post.url = "https://reddit.com/r/soccer/1"
    expert_post.score = 450

    noise_post = MagicMock()
    noise_post.title = "USA gonna crush it!!!"
    noise_post.selftext = "They're the best team ever lol"
    noise_post.url = "https://reddit.com/r/soccer/2"
    noise_post.score = 12

    mock_sub.search.return_value = [expert_post, noise_post]

    call_count = 0
    def score_side_effect(client, text):
        nonlocal call_count
        call_count += 1
        return 8 if call_count == 1 else 2

    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", side_effect=score_side_effect)
    mocker.patch("src.research.forums._post_to_prediction", return_value=MagicMock(spec=PredictionRecord))

    records = fetch_forum_predictions(
        SAMPLE_FIXTURES,
        reddit_client_id="cid", reddit_client_secret="csec",
        anthropic_api_key="akey", quality_threshold=7
    )
    assert len(records) == 1  # only expert_post passes threshold
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_forums.py -v
```

Expected: `ImportError: cannot import name 'fetch_forum_predictions'`

- [ ] **Step 3: Implement forums.py**

```python
# src/research/forums.py
import praw
import anthropic
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "claude-sonnet-4-6"
SUBREDDITS = ["soccer", "WorldCup", "FIFA", "ussoccer", "brasil", "argentina"]

_QUALITY_SYSTEM = """Rate this Reddit post's football domain knowledge on a scale of 0-10.
High scores (7-10): references specific stats, xG, tactical systems, squad depth, injury impact, manager tendencies.
Low scores (0-3): generic hype, no evidence, vague claims.
Reply with ONLY the integer score. Nothing else."""

_PREDICT_SYSTEM = """Given a Reddit post discussing a WC2026 match, extract a prediction.
Return JSON: {match_id, team_a, team_b, outcome (W/D/L from team_a), confidence_pct (0.0-1.0), raw_text}.
If no clear prediction, return null. No markdown fences."""

def fetch_forum_predictions(
    fixtures: list[MatchFixture],
    reddit_client_id: str,
    reddit_client_secret: str,
    anthropic_api_key: str,
    quality_threshold: int = 7,
    posts_per_match: int = 20,
) -> list[PredictionRecord]:
    reddit = praw.Reddit(
        client_id=reddit_client_id,
        client_secret=reddit_client_secret,
        user_agent="quiniela2026/1.0 (research pipeline)",
    )
    llm = anthropic.Anthropic(api_key=anthropic_api_key)

    records: list[PredictionRecord] = []
    for fixture in fixtures:
        query = f"{fixture.team_a} vs {fixture.team_b} World Cup 2026"
        for sub_name in SUBREDDITS:
            sub = reddit.subreddit(sub_name)
            try:
                posts = list(sub.search(query, limit=posts_per_match, sort="top"))
            except Exception:
                continue
            for post in posts:
                text = f"{post.title}\n{post.selftext}"
                score = _score_post_quality(llm, text)
                if score >= quality_threshold:
                    record = _post_to_prediction(llm, post, fixture)
                    if record:
                        records.append(record)
    return records

def _score_post_quality(client: anthropic.Anthropic, text: str) -> int:
    resp = client.messages.create(
        model=MODEL,
        max_tokens=10,
        system=_QUALITY_SYSTEM,
        messages=[{"role": "user", "content": text[:2000]}],
    )
    try:
        return int(resp.content[0].text.strip())
    except (ValueError, IndexError):
        return 0

def _post_to_prediction(client: anthropic.Anthropic, post: object, fixture: MatchFixture) -> PredictionRecord | None:
    import json
    text = f"Match: {fixture.match_id} — {fixture.team_a} vs {fixture.team_b}\n\n{post.title}\n{post.selftext}"
    resp = client.messages.create(
        model=MODEL,
        max_tokens=256,
        system=_PREDICT_SYSTEM,
        messages=[{"role": "user", "content": text[:3000]}],
    )
    raw = resp.content[0].text.strip()
    if raw.lower() == "null":
        return None
    try:
        d = json.loads(raw)
        if d.get("outcome") not in ("W", "D", "L"):
            return None
        ts = datetime.now(timezone.utc).isoformat()
        return PredictionRecord(
            source_id=f"forum_{fixture.match_id}_{ts[:10]}",
            source_type="informed_fan",
            source_url=getattr(post, "url", ""),
            timestamp=ts,
            prediction_type="group_match",
            match_id=fixture.match_id,
            team_a=fixture.team_a,
            team_b=fixture.team_b,
            outcome=d["outcome"],
            confidence_pct=min(1.0, max(0.0, float(d.get("confidence_pct", 0.5)))),
            raw_text=d.get("raw_text", "")[:500],
        )
    except (json.JSONDecodeError, KeyError, ValueError):
        return None
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_forums.py -v
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/research/forums.py tests/test_forums.py
git commit -m "feat(research): forum scraper with LLM quality filter (PRAW + Claude)"
```

---

## Task 9: Normalizer

**Files:**
- Create: `src/normalize.py`
- Create: `tests/test_normalize.py`

The normalizer merges all prediction sources into a single list. Market records are tagged separately so the consensus engine can exclude them from voting while still using them for contrarian detection.

- [ ] **Step 1: Write failing test**

```python
# tests/test_normalize.py
from src.normalize import normalize_predictions
from src.models import PredictionRecord

def _make_record(source_type: str, outcome: str, confidence: float, match_id: str = "A1") -> PredictionRecord:
    return PredictionRecord(
        source_id=f"{source_type}_test",
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

def test_normalize_deduplicates_same_source():
    records = [
        _make_record("analyst", "W", 0.65),
        _make_record("analyst", "W", 0.65),  # duplicate
    ]
    normalized = normalize_predictions(records)
    assert len(normalized) == 1

def test_normalize_clips_confidence():
    records = [_make_record("analyst", "W", 1.5)]
    normalized = normalize_predictions(records)
    assert normalized[0].confidence_pct <= 1.0

def test_normalize_preserves_market_type():
    records = [_make_record("prediction_market", "D", 0.45)]
    normalized = normalize_predictions(records)
    assert normalized[0].source_type == "prediction_market"

def test_normalize_accepts_multiple_types():
    records = [
        _make_record("analyst", "W", 0.70),
        _make_record("informed_fan", "D", 0.50),
        _make_record("prediction_market", "W", 0.60),
    ]
    normalized = normalize_predictions(records)
    assert len(normalized) == 3
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_normalize.py -v
```

Expected: `ImportError: cannot import name 'normalize_predictions'`

- [ ] **Step 3: Implement normalize.py**

```python
# src/normalize.py
from src.models import PredictionRecord
from dataclasses import replace

def normalize_predictions(records: list[PredictionRecord]) -> list[PredictionRecord]:
    """Deduplicate and clip confidence values. Preserves source_type."""
    seen: set[str] = set()
    normalized: list[PredictionRecord] = []

    for r in records:
        key = f"{r.source_id}_{r.match_id}_{r.outcome}"
        if key in seen:
            continue
        seen.add(key)

        clipped_conf = min(1.0, max(0.0, r.confidence_pct))
        if clipped_conf != r.confidence_pct:
            r = replace(r, confidence_pct=clipped_conf)

        normalized.append(r)

    return normalized
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_normalize.py -v
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/normalize.py tests/test_normalize.py
git commit -m "feat: normalizer — dedup and clip prediction records"
```

---

## Task 10: Consensus Engine

**Files:**
- Create: `src/consensus.py`
- Create: `tests/test_consensus.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_consensus.py
from src.consensus import build_consensus
from src.models import PredictionRecord, ConsensusRecord, MatchFixture, TeamStats, RecentForm

def _make_record(source_type: str, outcome: str, confidence: float, match_id: str = "A1") -> PredictionRecord:
    return PredictionRecord(
        source_id=f"{source_type}_test_{outcome}",
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

def _make_stats(team: str, elo: int) -> TeamStats:
    form = RecentForm(matches=10, wins=5, draws=3, losses=2,
                      goals_scored_avg=1.5, goals_conceded_avg=1.0)
    return TeamStats(team=team, elo_rating=elo, fifa_rank=5, recent_form=form)

FIXTURES = [MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11")]
STATS = {"USA": _make_stats("USA", 1900), "Mexico": _make_stats("Mexico", 1850)}

def test_consensus_majority_outcome():
    records = [
        _make_record("analyst", "W", 0.70),
        _make_record("analyst", "W", 0.65),
        _make_record("informed_fan", "D", 0.55),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].consensus_outcome == "W"

def test_consensus_confidence_tier_high():
    records = [
        _make_record("analyst", "W", 0.80),
        _make_record("analyst", "W", 0.75),
        _make_record("analyst", "W", 0.72),
        _make_record("analyst", "W", 0.71),
        _make_record("analyst", "W", 0.70),
        _make_record("analyst", "W", 0.69),
        _make_record("analyst", "W", 0.68),
        _make_record("analyst", "W", 0.67),
        _make_record("analyst", "W", 0.66),  # 9 sources → 70% qualitative
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].confidence_tier == "high"

def test_consensus_contrarian_flag():
    # Expert consensus: W. Market: D (>15pp gap → contrarian flag)
    records = [
        _make_record("analyst", "W", 0.72),
        _make_record("analyst", "W", 0.68),
        _make_record("prediction_market", "D", 0.50),  # market says D with 50%
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is True
    assert "market" in results[0].contrarian_detail.lower()

def test_no_contrarian_when_aligned():
    records = [
        _make_record("analyst", "W", 0.65),
        _make_record("prediction_market", "W", 0.62),  # market agrees
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is False

def test_sparse_coverage_uses_prior():
    # 0 qualitative sources → result driven by prior (Elo-based)
    records = []
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].consensus_outcome in ("W", "D", "L")
    assert results[0].source_count == 0
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

_WEIGHTS = {"analyst": 1.0, "informed_fan": 0.6}
_CONTRARIAN_THRESHOLD = 0.15

def build_consensus(
    fixtures: list[MatchFixture],
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> list[ConsensusRecord]:
    results = []
    for fixture in fixtures:
        match_records = [r for r in records if r.match_id == fixture.match_id]
        result = _consensus_for_match(fixture, match_records, stats)
        results.append(result)
    return results

def _consensus_for_match(
    fixture: MatchFixture,
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> ConsensusRecord:
    voting = [r for r in records if r.source_type != "prediction_market"]
    market = [r for r in records if r.source_type == "prediction_market"]

    prior = _get_prior(fixture, stats)
    source_count = len(voting)
    prior_weight, qual_weight = _blend_weights(source_count)

    # Weighted vote across outcomes
    outcome_scores: dict[str, float] = {"W": 0.0, "D": 0.0, "L": 0.0}
    for r in voting:
        w = _WEIGHTS.get(r.source_type, 0.5)
        outcome_scores[r.outcome] += w * r.confidence_pct

    total_qual = sum(outcome_scores.values()) or 1.0
    qual_probs = {k: v / total_qual for k, v in outcome_scores.items()}

    # Blend prior + qualitative
    blended = {
        o: prior_weight * prior.get(o, 0.33) + qual_weight * qual_probs.get(o, 0.0)
        for o in ("W", "D", "L")
    }
    total = sum(blended.values()) or 1.0
    blended = {k: v / total for k, v in blended.items()}

    consensus_outcome = max(blended, key=blended.__getitem__)
    weighted_conf = blended[consensus_outcome]
    tier = _tier(weighted_conf)

    # Contrarian detection using market records
    contrarian_flag, contrarian_detail = _check_contrarian(consensus_outcome, weighted_conf, market)

    return ConsensusRecord(
        match_id=fixture.match_id,
        team_a=fixture.team_a,
        team_b=fixture.team_b,
        consensus_outcome=consensus_outcome,
        confidence_tier=tier,
        weighted_confidence=round(weighted_conf, 4),
        source_count=source_count,
        contrarian_flag=contrarian_flag,
        contrarian_detail=contrarian_detail,
    )

def _get_prior(fixture: MatchFixture, stats: dict[str, TeamStats]) -> dict[str, float]:
    a = stats.get(fixture.team_a)
    b = stats.get(fixture.team_b)
    if a and b:
        return compute_prior(a, b)
    return {"W": 0.34, "D": 0.33, "L": 0.33}

def _blend_weights(source_count: int) -> tuple[float, float]:
    if source_count <= 2:
        return 0.80, 0.20
    elif source_count <= 7:
        return 0.55, 0.45
    else:
        return 0.30, 0.70

def _tier(conf: float) -> str:
    if conf >= 0.70:
        return "high"
    elif conf >= 0.50:
        return "medium"
    return "low"

def _check_contrarian(
    consensus_outcome: str,
    consensus_conf: float,
    market_records: list[PredictionRecord],
) -> tuple[bool, str]:
    if not market_records:
        return False, ""

    # Use the market record with the highest confidence
    best_market = max(market_records, key=lambda r: r.confidence_pct)
    market_outcome = best_market.outcome
    market_conf = best_market.confidence_pct

    if market_outcome != consensus_outcome and abs(market_conf - consensus_conf) > _CONTRARIAN_THRESHOLD:
        detail = (f"Markets favor {market_outcome} ({market_conf:.0%}) "
                  f"vs expert consensus {consensus_outcome} ({consensus_conf:.0%})")
        return True, detail

    return False, ""
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_consensus.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/consensus.py tests/test_consensus.py
git commit -m "feat: consensus engine — Bayesian blend + contrarian detection"
```

---

## Task 11: Report Generator

**Files:**
- Create: `src/report.py`
- Create: `tests/test_report.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_report.py
from src.report import render_report
from src.models import ConsensusRecord

def _make_consensus(match_id: str, outcome: str, tier: str, contrarian: bool = False) -> ConsensusRecord:
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
    records = [_make_consensus("A1", "W", "high")]
    report = render_report(records, run_date="2026-06-07")
    assert "Quiniela 2026" in report
    assert "2026-06-07" in report

def test_render_report_contains_match_table():
    records = [_make_consensus("A1", "W", "high")]
    report = render_report(records, run_date="2026-06-07")
    assert "A1" in report
    assert "USA" in report
    assert "Mexico" in report
    assert "W" in report
    assert "HIGH" in report

def test_render_report_contrarian_watchlist():
    records = [_make_consensus("A1", "W", "medium", contrarian=True)]
    report = render_report(records, run_date="2026-06-07")
    assert "Contrarian" in report
    assert "Markets favor D" in report

def test_render_report_no_contrarian_section_when_none():
    records = [_make_consensus("A1", "W", "high", contrarian=False)]
    report = render_report(records, run_date="2026-06-07")
    # Watchlist section should still appear but be empty
    assert "Contrarian Watchlist" in report
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

_TIER_EMOJI = {"high": "HIGH", "medium": "MED", "low": "LOW"}

def render_report(records: list[ConsensusRecord], run_date: str) -> str:
    lines = [
        f"# Quiniela 2026 — Recommendations ({run_date})",
        "",
        f"> Generated from {sum(r.source_count for r in records)} total source predictions.",
        "",
        "## Group Stage Picks",
        "",
        f"| Match | Team A | Team B | Pick | Confidence | Sources | Alert |",
        f"|-------|--------|--------|------|------------|---------|-------|",
    ]

    for r in records:
        alert = "⚠" if r.contrarian_flag else ""
        tier = _TIER_EMOJI.get(r.confidence_tier, r.confidence_tier.upper())
        lines.append(
            f"| {r.match_id} | {r.team_a} | {r.team_b} | **{r.consensus_outcome}** "
            f"| {tier} ({r.weighted_confidence:.0%}) | {r.source_count} | {alert} |"
        )

    contrarian = [r for r in records if r.contrarian_flag]
    lines += ["", "## Contrarian Watchlist", ""]
    if contrarian:
        lines.append("Picks where prediction markets diverge from expert consensus by >15pp:\n")
        for r in contrarian:
            lines.append(f"- **{r.match_id}** ({r.team_a} vs {r.team_b}): {r.contrarian_detail}")
    else:
        lines.append("No significant contrarian signals detected.")

    return "\n".join(lines)
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_report.py -v
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/report.py tests/test_report.py
git commit -m "feat: report renderer — markdown table with contrarian watchlist"
```

---

## Task 12: Squad Info Gatherer

**Files:**
- Create: `src/stats/squads.py`
- Create: `tests/test_squads.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_squads.py
from unittest.mock import MagicMock
from src.stats.squads import fetch_squad_flags

MOCK_RESPONSE = '{"Brazil": ["Vinicius Jr fit", "Rodrygo questionable"], "Germany": ["Müller retired"]}'

def test_fetch_squad_flags_returns_dict(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_RESPONSE)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.stats.squads.anthropic.Anthropic", return_value=mock_client)

    flags = fetch_squad_flags(["Brazil", "Germany"], api_key="test")
    assert isinstance(flags, dict)
    assert "Brazil" in flags
    assert isinstance(flags["Brazil"], list)

def test_fetch_squad_flags_missing_team_returns_empty(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text='{"Brazil": ["Neymar retired"]}')]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.stats.squads.anthropic.Anthropic", return_value=mock_client)

    flags = fetch_squad_flags(["Brazil", "Germany"], api_key="test")
    assert flags.get("Germany", []) == []
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_squads.py -v
```

Expected: `ImportError: cannot import name 'fetch_squad_flags'`

- [ ] **Step 3: Implement squads.py**

```python
# src/stats/squads.py
import json
import anthropic

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a football injury and squad news researcher for WC2026.
Given a list of national teams, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep flags brief (max 10 words each). Return ONLY valid JSON. No markdown fences."""

def fetch_squad_flags(teams: list[str], api_key: str) -> dict[str, list[str]]:
    client = anthropic.Anthropic(api_key=api_key)
    prompt = f"Get WC2026 squad news and injury flags for: {', '.join(teams)}"

    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}],
    )

    text = ""
    for block in response.content:
        if hasattr(block, "type") and block.type == "text":
            text = block.text
            break

    try:
        data = json.loads(text.strip())
        return {team: data.get(team, []) for team in teams}
    except json.JSONDecodeError:
        return {team: [] for team in teams}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pytest tests/test_squads.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/stats/squads.py tests/test_squads.py
git commit -m "feat(stats): squad flag gatherer via Claude API + web search"
```

---

## Task 13: Pipeline CLI — Integration

**Files:**
- Create: `src/pipeline.py`
- Verify: all modules importable and wired correctly

- [ ] **Step 1: Create pipeline.py**

```python
# src/pipeline.py
"""
Quiniela 2026 Prediction Pipeline
Usage: python src/pipeline.py
Env: ANTHROPIC_API_KEY, FOOTBALL_DATA_API_KEY, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET
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
from src.stats.prior import compute_prior
from src.research.analysts import fetch_analyst_predictions
from src.research.markets import fetch_market_predictions
from src.research.forums import fetch_forum_predictions
from src.normalize import normalize_predictions
from src.consensus import build_consensus
from src.report import render_report
from src.models import TeamStats, RecentForm

def run():
    anthropic_key = os.environ["ANTHROPIC_API_KEY"]
    fd_key = os.environ["FOOTBALL_DATA_API_KEY"]
    reddit_cid = os.environ["REDDIT_CLIENT_ID"]
    reddit_csec = os.environ["REDDIT_CLIENT_SECRET"]

    run_date = date.today().isoformat()
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    print("=== Phase 1: GATHER ===")

    print("[1/6] Fetching WC2026 fixtures...")
    fixtures = fetch_fixtures(api_key=fd_key)
    if not fixtures:
        print("  WARNING: No fixtures from football-data.org. Check API key and competition code.")
        return
    print(f"  {len(fixtures)} fixtures loaded.")

    all_teams = list({t for f in fixtures for t in (f.team_a, f.team_b)})

    print("[2/6] Fetching Elo ratings...")
    elo_ratings = fetch_elo_ratings()

    print("[3/6] Fetching recent form + squad flags...")
    stats: dict[str, TeamStats] = {}
    squad_flags = fetch_squad_flags(all_teams, api_key=anthropic_key)
    for team in all_teams:
        form = fetch_recent_form(team, api_key=fd_key)
        elo = elo_ratings.get(team, 1700)
        stats[team] = TeamStats(
            team=team,
            elo_rating=elo,
            fifa_rank=0,  # not critical for model
            recent_form=form,
            squad_flags=squad_flags.get(team, []),
        )
    print(f"  Stats built for {len(stats)} teams.")

    print("[4/6] Fetching analyst predictions...")
    analyst_records = fetch_analyst_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(analyst_records)} analyst records.")

    print("[5/6] Fetching market predictions...")
    market_records = fetch_market_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(market_records)} market records.")

    print("[6/6] Fetching forum predictions (quality-filtered Reddit)...")
    forum_records = fetch_forum_predictions(
        fixtures,
        reddit_client_id=reddit_cid,
        reddit_client_secret=reddit_csec,
        anthropic_api_key=anthropic_key,
    )
    print(f"  {len(forum_records)} forum records passed quality filter.")

    print("\n=== Phase 2: MODEL ===")

    all_records = normalize_predictions(analyst_records + market_records + forum_records)
    print(f"  {len(all_records)} normalized records.")

    consensus = build_consensus(fixtures, all_records, stats)
    print(f"  {len(consensus)} consensus picks generated.")
    contrarians = sum(1 for c in consensus if c.contrarian_flag)
    print(f"  {contrarians} contrarian alerts.")

    print("\n=== Phase 3: OUTPUT ===")

    raw_path = output_dir / f"{run_date}_raw_data.json"
    with open(raw_path, "w") as f:
        json.dump([asdict(r) for r in all_records], f, indent=2)
    print(f"  {raw_path}")

    consensus_path = output_dir / f"{run_date}_consensus.json"
    with open(consensus_path, "w") as f:
        json.dump([asdict(c) for c in consensus], f, indent=2)
    print(f"  {consensus_path}")

    report_path = output_dir / f"{run_date}_quiniela_report.md"
    report_path.write_text(render_report(consensus, run_date=run_date))
    print(f"  {report_path}")

    print("\nDone. Open the report:")
    print(f"  {report_path}")

if __name__ == "__main__":
    run()
```

- [ ] **Step 2: Run all tests to verify nothing broken**

```bash
pytest tests/ -v
```

Expected: all tests pass (no new failures).

- [ ] **Step 3: Smoke-test pipeline import**

```bash
python -c "from src.pipeline import run; print('import OK')"
```

Expected: `import OK`

- [ ] **Step 4: Create .env from .env.example**

```bash
cp .env.example .env
# Fill in your keys:
# ANTHROPIC_API_KEY=sk-ant-...
# FOOTBALL_DATA_API_KEY=...  (free at https://www.football-data.org/client/register)
# REDDIT_CLIENT_ID=...       (free at https://www.reddit.com/prefs/apps)
# REDDIT_CLIENT_SECRET=...
```

- [ ] **Step 5: Run pipeline**

```bash
python src/pipeline.py
```

Expected: creates `output/YYYY-MM-DD_raw_data.json`, `output/YYYY-MM-DD_consensus.json`, `output/YYYY-MM-DD_quiniela_report.md`.

If football-data.org has no WC2026 fixtures yet, check `https://api.football-data.org/v4/competitions` for correct competition code and update `BASE_URL` usage in `src/stats/form.py:fetch_fixtures()`.

- [ ] **Step 6: Commit**

```bash
git add src/pipeline.py
git commit -m "feat: pipeline CLI entrypoint — full Phase 1→2→3 orchestration"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Stats layer: Elo (Task 3), form (Task 4), squads (Task 12), prior (Task 5)
- ✅ Analyst research: Task 6
- ✅ Market research: Task 7
- ✅ Forum scraper + quality filter: Task 8
- ✅ Normalizer: Task 9
- ✅ Bayesian blend + coverage weighting: Task 10
- ✅ Contrarian detection (>15pp threshold): Task 10
- ✅ Confidence tiers (high/medium/low): Task 10
- ✅ Output: raw_data.json, consensus.json, quiniela_report.md: Tasks 11 + 13
- ✅ Contrarian Watchlist in report: Task 11
- ✅ Re-runnable CLI: Task 13
- ⚠ **Winner + Golden Boot predictions**: spec mentions these in report structure. Tasks 6–7 use `prediction_type` field which supports `"winner"` and `"golden_boot"` — add explicit prompts for these in `analysts.py` and `markets.py` if desired. Minimum viable: the report's Contrarian Watchlist will surface winner/golden boot divergence if records exist.

**Type consistency:** `PredictionRecord`, `ConsensusRecord`, `TeamStats`, `RecentForm`, `MatchFixture` defined once in `src/models.py` and imported consistently across all tasks. No drift detected.

**Placeholder scan:** No TBD/TODO. All steps contain exact commands and code.
