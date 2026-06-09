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
