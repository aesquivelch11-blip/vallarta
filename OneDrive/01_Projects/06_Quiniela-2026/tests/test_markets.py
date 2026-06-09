import pytest
from unittest.mock import MagicMock
from src.research.markets import fetch_market_predictions
from src.models import MatchFixture

MOCK_MARKET_JSON = '''[
  {"match_id": "A1", "team_a": "Mexico", "team_b": "Poland",
   "outcome": "W", "confidence_pct": 0.65, "source_url": "http://polymarket.com", "raw_text": "65% Mexico"},
  {"match_id": "A1", "team_a": "Mexico", "team_b": "Poland",
   "outcome": "?", "confidence_pct": 0.1, "source_url": "", "raw_text": "invalid"}
]'''

FIXTURE = MatchFixture(match_id="A1", group="A", team_a="Mexico", team_b="Poland", date="2026-06-11")


def _mock_client(mocker, text):
    mock_response = MagicMock()
    mock_response.text = text
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response
    mocker.patch("src.research.markets.genai.Client", return_value=mock_client)
    return mock_client


def test_fetch_market_predictions_source_type(mocker):
    _mock_client(mocker, MOCK_MARKET_JSON)
    records = fetch_market_predictions([FIXTURE], api_key="test")
    assert all(r.source_type == "prediction_market" for r in records)


def test_fetch_market_predictions_returns_records(mocker):
    _mock_client(mocker, MOCK_MARKET_JSON)
    records = fetch_market_predictions([FIXTURE], api_key="test")
    assert len(records) >= 1


def test_fetch_market_predictions_skips_invalid(mocker):
    bad_json = '[{"match_id":"A1","team_a":"Mexico","team_b":"Poland","outcome":"?","confidence_pct":0.5,"source_url":"","raw_text":"bad"}]'
    _mock_client(mocker, bad_json)
    records = fetch_market_predictions([FIXTURE], api_key="test")
    assert records == []


def test_fetch_market_predictions_confidence_bounds(mocker):
    _mock_client(mocker, MOCK_MARKET_JSON)
    records = fetch_market_predictions([FIXTURE], api_key="test")
    assert all(0.0 <= r.confidence_pct <= 1.0 for r in records)
    assert all(r.outcome in ("W", "D", "L") for r in records)
