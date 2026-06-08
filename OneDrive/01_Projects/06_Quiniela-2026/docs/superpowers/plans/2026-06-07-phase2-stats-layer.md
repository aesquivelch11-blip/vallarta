# Quiniela 2026 — Phase 2: Stats Layer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the quantitative baseline — Elo ratings, recent form, WC2026 fixtures, squad flags, and the prior probability calculator. Every match gets a principled W/D/L prior even with zero analyst coverage.

**Architecture:** Four focused modules under `src/stats/`. No LLM calls except `squads.py` (Claude API + web search). Everything else is pure HTTP + math.

**Tech Stack:** `requests`, `beautifulsoup4`, `anthropic` SDK (squads only), `pytest`, `pytest-mock`

**Prerequisite phases:** Phase 1 complete. `src/models.py` exists with `TeamStats`, `RecentForm`, `MatchFixture`.

**Phase exit criteria:** `pytest tests/test_elo.py tests/test_form.py tests/test_prior.py tests/test_squads.py` all pass. `python -c "from src.stats.prior import compute_prior; print('OK')"` prints OK.

---

## File Map

```
src/stats/
  elo.py        # scrape eloratings.net → {team_name: elo_rating}
  form.py       # football-data.org API → RecentForm per team + MatchFixture list
  prior.py      # Elo + form → {W, D, L} prior per match
  squads.py     # Claude API + web_search → squad flags per team
tests/
  test_elo.py
  test_form.py
  test_prior.py
  test_squads.py
```

---

## Task 1: Elo Scraper

**Files:**
- Create: `src/stats/elo.py`
- Create: `tests/test_elo.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_elo.py
from unittest.mock import MagicMock
from src.stats.elo import fetch_elo_ratings

SAMPLE_HTML = """
<html><body>
<table>
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
    resp = requests.get(ELO_URL, timeout=15,
                        headers={"User-Agent": "quiniela2026/1.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    ratings: dict[str, int] = {}
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

## Task 2: Form Fetcher + Fixture Loader

**Files:**
- Create: `src/stats/form.py`
- Create: `tests/test_form.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_form.py
from unittest.mock import MagicMock
from src.stats.form import fetch_recent_form, fetch_fixtures
from src.models import RecentForm, MatchFixture

SAMPLE_MATCHES_RESPONSE = {
    "matches": [
        {"homeTeam": {"name": "Brazil"}, "awayTeam": {"name": "Germany"},
         "score": {"fullTime": {"home": 2, "away": 0}}, "status": "FINISHED"},
        {"homeTeam": {"name": "France"}, "awayTeam": {"name": "Brazil"},
         "score": {"fullTime": {"home": 1, "away": 1}}, "status": "FINISHED"},
        {"homeTeam": {"name": "Argentina"}, "awayTeam": {"name": "Brazil"},
         "score": {"fullTime": {"home": 0, "away": 1}}, "status": "FINISHED"},
    ]
}

SAMPLE_TEAMS_RESPONSE = {"teams": [{"id": 42, "name": "Brazil"}]}

SAMPLE_FIXTURES_RESPONSE = {
    "matches": [
        {"homeTeam": {"name": "USA"}, "awayTeam": {"name": "Mexico"},
         "group": "GROUP_A", "utcDate": "2026-06-11T18:00:00Z"},
        {"homeTeam": {"name": "Brazil"}, "awayTeam": {"name": "Germany"},
         "group": "GROUP_B", "utcDate": "2026-06-12T18:00:00Z"},
    ]
}

def test_fetch_recent_form_returns_recent_form(mocker):
    mocker.patch("src.stats.form.requests.get", side_effect=[
        MagicMock(json=lambda: SAMPLE_TEAMS_RESPONSE, raise_for_status=MagicMock()),
        MagicMock(json=lambda: SAMPLE_MATCHES_RESPONSE, raise_for_status=MagicMock()),
    ])
    form = fetch_recent_form("Brazil", api_key="test")
    assert isinstance(form, RecentForm)
    assert form.wins + form.draws + form.losses == form.matches

def test_fetch_recent_form_correct_record(mocker):
    mocker.patch("src.stats.form.requests.get", side_effect=[
        MagicMock(json=lambda: SAMPLE_TEAMS_RESPONSE, raise_for_status=MagicMock()),
        MagicMock(json=lambda: SAMPLE_MATCHES_RESPONSE, raise_for_status=MagicMock()),
    ])
    form = fetch_recent_form("Brazil", api_key="test")
    # Brazil: 2-0 win (home), 1-1 draw (away), 0-1 win (away) → W=2, D=1, L=0
    assert form.wins == 2
    assert form.draws == 1
    assert form.losses == 0

def test_fetch_fixtures_returns_match_fixtures(mocker):
    mocker.patch("src.stats.form.requests.get",
                 return_value=MagicMock(json=lambda: SAMPLE_FIXTURES_RESPONSE,
                                        raise_for_status=MagicMock()))
    fixtures = fetch_fixtures(api_key="test")
    assert len(fixtures) == 2
    assert all(isinstance(f, MatchFixture) for f in fixtures)
    assert fixtures[0].team_a == "USA"
    assert fixtures[0].team_b == "Mexico"
    assert fixtures[0].group == "A"
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
    """Fetch last n_matches results for team via football-data.org."""
    headers = {"X-Auth-Token": api_key}
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
        gh = score.get("home") or 0
        ga = score.get("away") or 0
        gs, gc = (gh, ga) if home == team_name else (ga, gh)
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
        match_id = f"{group}{i + 1}"
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

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/stats/form.py tests/test_form.py
git commit -m "feat(stats): form fetcher and fixture loader (football-data.org)"
```

---

## Task 3: Prior Calculator

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
    Compute {W, D, L} prior from Elo + recent form.
    W = team_a wins, L = team_a loses.
    """
    a_form = _form_score(team_a)
    b_form = _form_score(team_b)

    elo_delta = team_a.elo_rating - team_b.elo_rating
    base_win = 1.0 / (1.0 + 10 ** (-elo_delta / 400))
    form_adj = (a_form - b_form) * 0.05  # max ±5pp

    # Closer Elo → higher draw probability (max 0.30), larger gap → lower (min 0.18)
    draw = 0.25 + max(-0.07, min(0.05, -abs(elo_delta) / 3000))

    w = max(0.05, base_win + form_adj)
    l = max(0.05, 1.0 - w - draw)
    draw = max(0.05, draw)

    total = w + draw + l
    return {
        "W": round(w / total, 4),
        "D": round(draw / total, 4),
        "L": round(l / total, 4),
    }

def _form_score(team: TeamStats) -> float:
    """Points-based form score 0.0–1.0."""
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
git commit -m "feat(stats): Bayesian prior from Elo + form"
```

---

## Task 4: Squad Flags

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

_SYSTEM = """You are a football squad researcher for WC2026.
Given national team names, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep each flag under 10 words. Return ONLY valid JSON. No markdown fences."""

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

- [ ] **Step 5: Run full phase test suite**

```bash
pytest tests/test_elo.py tests/test_form.py tests/test_prior.py tests/test_squads.py -v
```

Expected: 12 passed, 0 failed.

- [ ] **Step 6: Commit**

```bash
git add src/stats/squads.py tests/test_squads.py
git commit -m "feat(stats): squad flag gatherer via Claude API + web search"
```

---

**Phase 2 complete.** Hand off to Phase 3 once all 12 stats tests pass green.
