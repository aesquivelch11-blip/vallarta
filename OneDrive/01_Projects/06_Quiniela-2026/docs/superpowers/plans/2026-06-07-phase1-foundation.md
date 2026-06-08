# Quiniela 2026 — Phase 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the project, install dependencies, and define all shared data models that every subsequent phase depends on.

**Architecture:** Python package under `src/`. All schema types defined once in `src/models.py` as dataclasses. No business logic here — just structure.

**Tech Stack:** Python 3.11+, `pytest`, `python-dotenv`, `pyyaml`

**Prerequisite phases:** None. Start here.

**Phase exit criteria:** `pytest tests/test_models.py` passes. All dirs and config files exist. `pip install -r requirements.txt` runs clean.

---

## File Map

```
src/
  __init__.py
  models.py               # ALL shared dataclasses — import from here, never redefine
  stats/__init__.py
  research/__init__.py
tests/
  __init__.py
  test_models.py
data/
  sources.yaml
  fixtures.yaml
requirements.txt
.env.example
.gitignore
output/                   # gitignored — pipeline writes here
```

---

## Task 1: Project Scaffold

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
# WC2026 Group Stage fixtures
# Populated automatically by Phase 2 (form.py:fetch_fixtures).
# If football-data.org has no WC2026 data yet, fill manually:
# matches:
#   - match_id: A1
#     group: A
#     team_a: Mexico
#     team_b: ...
#     date: "2026-06-11"
matches: []
```

- [ ] **Step 6: Create empty package init files**

Create each as a completely empty file:
- `src/__init__.py`
- `src/stats/__init__.py`
- `src/research/__init__.py`
- `tests/__init__.py`

- [ ] **Step 7: Create output/ directory with .gitkeep**

```bash
mkdir -p output
touch output/.gitkeep
```

Add to `.gitignore`:
```
output/*
!output/.gitkeep
```

- [ ] **Step 8: Install dependencies**

```bash
pip install -r requirements.txt
```

Expected: all packages install without error. Verify:
```bash
python -c "import anthropic, requests, bs4, praw, yaml, pytest; print('OK')"
```
Expected: `OK`

- [ ] **Step 9: Commit**

```bash
git add requirements.txt .env.example .gitignore data/ src/ tests/ output/
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

- [ ] **Step 3: Implement models.py**

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
git commit -m "feat: data models (TeamStats, PredictionRecord, ConsensusRecord, MatchFixture)"
```

---

**Phase 1 complete.** Hand off to Phase 2 once `pytest tests/` passes green.
