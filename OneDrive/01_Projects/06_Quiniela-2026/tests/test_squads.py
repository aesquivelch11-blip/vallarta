import pytest
from unittest.mock import MagicMock
from src.stats.squads import fetch_squad_flags

MOCK_RESPONSE = '{"Germany": ["Key player: Musiala (fit)"], "Brazil": ["Key player: Vinicius (fit)"]}'


def _mock_client(mocker, text):
    mock_response = MagicMock()
    mock_response.text = text
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response
    mocker.patch("src.stats.squads.genai.Client", return_value=mock_client)
    return mock_client


def test_fetch_squad_flags_returns_dict(mocker):
    _mock_client(mocker, MOCK_RESPONSE)
    result = fetch_squad_flags(["Germany", "Brazil"], api_key="test")
    assert isinstance(result, dict)
    assert "Germany" in result
    assert isinstance(result["Germany"], list)


def test_fetch_squad_flags_missing_team_returns_empty(mocker):
    _mock_client(mocker, '{"Germany": ["Musiala fit"]}')
    result = fetch_squad_flags(["Germany", "France"], api_key="test")
    assert result.get("France", []) == []


def test_fetch_squad_flags_handles_markdown_fenced_json(mocker):
    fenced = '```json\n{"Germany": ["Musiala fit"]}\n```'
    _mock_client(mocker, fenced)
    result = fetch_squad_flags(["Germany"], api_key="test")
    assert "Germany" in result


def test_fetch_squad_flags_api_error_returns_empty(mocker):
    mocker.patch("src.stats.squads.genai.Client", side_effect=Exception("API error"))
    result = fetch_squad_flags(["Germany", "Brazil"], api_key="test")
    assert result == {"Germany": [], "Brazil": []}
