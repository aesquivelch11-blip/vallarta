import pytest
from unittest.mock import MagicMock
from src.research.analysts import fetch_analyst_predictions
from src.models import MatchFixture

MOCK_LLM_JSON = '''[
  {"match_id": "A1", "team_a": "Mexico", "team_b": "Poland",
   "outcome": "W", "confidence_pct": 0.6, "source_url": "http://x.com", "raw_text": "Mexico win"},
  {"match_id": "A1", "team_a": "Mexico", "team_b": "Poland",
   "outcome": "X", "confidence_pct": 0.3, "source_url": "", "raw_text": "invalid"}
]'''

FIXTURE = MatchFixture(match_id="A1", group="A", team_a="Mexico", team_b="Poland", date="2026-06-11")


def _mock_client(mocker, text):
    mock_response = MagicMock()
    mock_response.text = text
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response
    mocker.patch("src.research.analysts.genai.Client", return_value=mock_client)
    return mock_client


def test_fetch_analyst_predictions_returns_records(mocker):
    _mock_client(mocker, MOCK_LLM_JSON)
    records = fetch_analyst_predictions([FIXTURE], api_key="test")
    assert len(records) == 1  # "X" outcome filtered


def test_fetch_analyst_predictions_source_type(mocker):
    _mock_client(mocker, MOCK_LLM_JSON)
    records = fetch_analyst_predictions([FIXTURE], api_key="test")
    assert all(r.source_type == "analyst" for r in records)


def test_fetch_analyst_predictions_valid_outcome(mocker):
    _mock_client(mocker, MOCK_LLM_JSON)
    records = fetch_analyst_predictions([FIXTURE], api_key="test")
    assert all(r.outcome in ("W", "D", "L") for r in records)
    assert all(0.0 <= r.confidence_pct <= 1.0 for r in records)


def test_fetch_analyst_predictions_skips_invalid_outcome(mocker):
    bad_json = '[{"match_id":"A1","team_a":"Mexico","team_b":"Poland","outcome":"X","confidence_pct":0.5,"source_url":"","raw_text":"bad"}]'
    _mock_client(mocker, bad_json)
    records = fetch_analyst_predictions([FIXTURE], api_key="test")
    assert records == []
