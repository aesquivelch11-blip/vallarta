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
