# Quiniela 2026 — Phase 3: Research Layer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three qualitative prediction gatherers — analyst research, prediction market odds, and quality-filtered Reddit posts. All three produce `PredictionRecord` lists using the same schema from Phase 1.

**Architecture:** Three independent modules under `src/research/`. Each calls Claude API (`claude-sonnet-4-6`) with `web_search_20250305` tool or PRAW. All return `list[PredictionRecord]`. No module knows about the others.

**Tech Stack:** `anthropic` SDK, `praw`, `pytest`, `pytest-mock`

**Prerequisite phases:** Phase 1 complete. `src/models.py` exists with `PredictionRecord`, `MatchFixture`.

**Phase exit criteria:** `pytest tests/test_analysts.py tests/test_markets.py tests/test_forums.py` all pass. All three modules importable. No live API calls in tests (all mocked).

---

## File Map

```
src/research/
  analysts.py     # Claude API + web_search → analyst PredictionRecords
  markets.py      # Claude API + web_search → Polymarket/Kalshi PredictionRecords
  forums.py       # PRAW + Claude quality filter → informed_fan PredictionRecords
tests/
  test_analysts.py
  test_markets.py
  test_forums.py
```

---

## Task 1: Analyst Research

**Files:**
- Create: `src/research/analysts.py`
- Create: `tests/test_analysts.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_analysts.py
from unittest.mock import MagicMock
from src.research.analysts import fetch_analyst_predictions
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
    MatchFixture(match_id="B1", group="B", team_a="Brazil", team_b="Germany", date="2026-06-12"),
]

MOCK_LLM_JSON = """
[
  {
    "match_id": "A1", "team_a": "USA", "team_b": "Mexico",
    "outcome": "W", "confidence_pct": 0.55,
    "source_url": "https://espn.com/wc2026",
    "raw_text": "USA expected to win at home"
  },
  {
    "match_id": "B1", "team_a": "Brazil", "team_b": "Germany",
    "outcome": "W", "confidence_pct": 0.70,
    "source_url": "https://bbc.com/sport/wc2026",
    "raw_text": "Brazil clear favorites"
  }
]
"""

def test_fetch_analyst_predictions_returns_records(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_LLM_JSON)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    assert len(records) == 2
    assert all(isinstance(r, PredictionRecord) for r in records)

def test_fetch_analyst_predictions_source_type(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_LLM_JSON)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    assert all(r.source_type == "analyst" for r in records)

def test_fetch_analyst_predictions_valid_outcome(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=MOCK_LLM_JSON)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    for r in records:
        assert r.outcome in ("W", "D", "L")
        assert 0.0 <= r.confidence_pct <= 1.0

def test_fetch_analyst_predictions_skips_invalid_outcome(mocker):
    bad_json = '[{"match_id":"A1","team_a":"USA","team_b":"Mexico","outcome":"X","confidence_pct":0.5,"source_url":"","raw_text":""}]'
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=bad_json)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.analysts.anthropic.Anthropic", return_value=mock_client)

    records = fetch_analyst_predictions(SAMPLE_FIXTURES, api_key="test")
    assert len(records) == 0
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
BATCH_SIZE = 6  # one group per API call

_SYSTEM = """You are a football analytics researcher aggregating expert predictions for WC2026.
Given group stage matches, search for analyst and expert predictions from reputable sources
(ESPN, BBC Sport, The Athletic, Sky Sports, Guardian, FiveThirtyEight, etc.).

For each match return a JSON array. Each element must have:
  match_id, team_a, team_b, outcome (W/D/L from team_a perspective),
  confidence_pct (0.0-1.0), source_url, raw_text (brief quote or summary).

Return ONLY valid JSON array. No markdown fences. No explanation outside the array."""

def fetch_analyst_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = anthropic.Anthropic(api_key=api_key)
    all_records: list[PredictionRecord] = []
    for i in range(0, len(fixtures), BATCH_SIZE):
        batch = fixtures[i:i + BATCH_SIZE]
        all_records.extend(_fetch_batch(client, batch))
    return all_records

def _fetch_batch(client: anthropic.Anthropic, fixtures: list[MatchFixture]) -> list[PredictionRecord]:
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": f"Research analyst predictions for:\n{match_list}"}],
    )
    text = next((b.text for b in response.content if getattr(b, "type", None) == "text"), "")
    return _parse(text)

def _parse(text: str) -> list[PredictionRecord]:
    try:
        data = json.loads(text.strip())
    except json.JSONDecodeError:
        return []
    ts = datetime.now(timezone.utc).isoformat()
    records = []
    for item in data:
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
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
                confidence_pct=min(1.0, max(0.0, float(item.get("confidence_pct", 0.5)))),
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

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/research/analysts.py tests/test_analysts.py
git commit -m "feat(research): analyst predictions via Claude API + web search"
```

---

## Task 2: Markets Research

**Files:**
- Create: `src/research/markets.py`
- Create: `tests/test_markets.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_markets.py
from unittest.mock import MagicMock
from src.research.markets import fetch_market_predictions
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
]

MOCK_MARKET_JSON = """
[
  {
    "match_id": "A1", "team_a": "USA", "team_b": "Mexico",
    "outcome": "D", "confidence_pct": 0.48,
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

def test_fetch_market_predictions_skips_invalid(mocker):
    bad = '[{"match_id":"A1","team_a":"USA","team_b":"Mexico","outcome":"?","confidence_pct":0.4,"source_url":"","raw_text":""}]'
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=bad)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.research.markets.anthropic.Anthropic", return_value=mock_client)

    records = fetch_market_predictions(SAMPLE_FIXTURES, api_key="test")
    assert len(records) == 0
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

_SYSTEM = """You are a prediction market researcher for WC2026.
Given matches, search Polymarket and Kalshi for current market-implied probabilities.

For each match return a JSON array. Each element:
  match_id, team_a, team_b,
  outcome (W/D/L — the highest-probability outcome from team_a perspective),
  confidence_pct (market-implied probability 0.0-1.0),
  source_url, raw_text (note thin liquidity or stale markets if present).

Return ONLY valid JSON array. No markdown fences."""

def fetch_market_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = anthropic.Anthropic(api_key=api_key)
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": f"Find prediction market odds for:\n{match_list}"}],
    )
    text = next((b.text for b in response.content if getattr(b, "type", None) == "text"), "")
    return _parse(text)

def _parse(text: str) -> list[PredictionRecord]:
    try:
        data = json.loads(text.strip())
    except json.JSONDecodeError:
        return []
    ts = datetime.now(timezone.utc).isoformat()
    records = []
    for item in data:
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
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
                confidence_pct=min(1.0, max(0.0, float(item.get("confidence_pct", 0.5)))),
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

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/research/markets.py tests/test_markets.py
git commit -m "feat(research): prediction market odds via Claude API + web search"
```

---

## Task 3: Forum Scraper + LLM Quality Filter

**Files:**
- Create: `src/research/forums.py`
- Create: `tests/test_forums.py`

- [ ] **Step 1: Write failing test**

```python
# tests/test_forums.py
from unittest.mock import MagicMock
from src.research.forums import fetch_forum_predictions, _score_post_quality
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
]

def test_score_post_quality_returns_int(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="8")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "USA 4-3-3 press vs Mexico 5-4-1. Pulisic xG 0.62/90.")
    assert score == 8

def test_score_post_quality_invalid_response_returns_zero(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="not a number")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "some text")
    assert score == 0

def test_fetch_forum_predictions_filters_low_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_reddit.subreddit.return_value = mock_sub

    expert_post = MagicMock()
    expert_post.title = "USA vs Mexico tactical breakdown"
    expert_post.selftext = "PPDA 18, xGA 2.1, squad depth analysis..."
    expert_post.url = "https://reddit.com/r/soccer/1"

    noise_post = MagicMock()
    noise_post.title = "USA gonna crush it!!!"
    noise_post.selftext = "they're the best team lol"
    noise_post.url = "https://reddit.com/r/soccer/2"

    mock_sub.search.return_value = [expert_post, noise_post]

    call_count = 0
    def score_side_effect(client, text):
        nonlocal call_count
        call_count += 1
        return 8 if call_count == 1 else 2

    mock_record = MagicMock(spec=PredictionRecord)

    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", side_effect=score_side_effect)
    mocker.patch("src.research.forums._post_to_prediction", return_value=mock_record)

    records = fetch_forum_predictions(
        SAMPLE_FIXTURES,
        reddit_client_id="cid",
        reddit_client_secret="csec",
        anthropic_api_key="akey",
        quality_threshold=7,
    )
    assert len(records) == 1

def test_fetch_forum_predictions_all_fail_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_reddit.subreddit.return_value = mock_sub
    mock_sub.search.return_value = [MagicMock(title="hype", selftext="lol", url="x")]

    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", return_value=3)

    records = fetch_forum_predictions(
        SAMPLE_FIXTURES,
        reddit_client_id="cid",
        reddit_client_secret="csec",
        anthropic_api_key="akey",
        quality_threshold=7,
    )
    assert records == []
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pytest tests/test_forums.py -v
```

Expected: `ImportError: cannot import name 'fetch_forum_predictions'`

- [ ] **Step 3: Implement forums.py**

```python
# src/research/forums.py
import json
import praw
import anthropic
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "claude-sonnet-4-6"
SUBREDDITS = ["soccer", "WorldCup", "FIFA", "ussoccer", "brasil", "argentina"]

_QUALITY_SYSTEM = """Rate this Reddit post's football domain knowledge 0-10.
7-10: references specific stats, xG, tactical systems, squad depth, injuries, manager tendencies.
0-3: generic hype, vague claims, no evidence.
Reply with ONLY the integer score. Nothing else."""

_PREDICT_SYSTEM = """Given a Reddit post discussing a WC2026 match, extract the prediction.
Return JSON: {match_id, team_a, team_b, outcome (W/D/L from team_a), confidence_pct (0.0-1.0), raw_text}.
If no clear prediction exists, return null. No markdown fences."""

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
                if _score_post_quality(llm, text) >= quality_threshold:
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

def _post_to_prediction(
    client: anthropic.Anthropic,
    post: object,
    fixture: MatchFixture,
) -> PredictionRecord | None:
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

Expected: 4 passed.

- [ ] **Step 5: Run full phase test suite**

```bash
pytest tests/test_analysts.py tests/test_markets.py tests/test_forums.py -v
```

Expected: 11 passed, 0 failed.

- [ ] **Step 6: Commit**

```bash
git add src/research/forums.py tests/test_forums.py
git commit -m "feat(research): forum scraper with LLM quality filter (PRAW + Claude)"
```

---

**Phase 3 complete.** Hand off to Phase 4 once all 11 research tests pass green.
