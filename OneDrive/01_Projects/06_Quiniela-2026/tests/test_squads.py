from unittest.mock import MagicMock
import anthropic
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

def test_fetch_squad_flags_handles_markdown_fenced_json(mocker):
    fenced = '```json\n{"Brazil": ["Vinicius fit"]}\n```'
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text=fenced)]
    mock_client.messages.create.return_value = mock_message
    mocker.patch("src.stats.squads.anthropic.Anthropic", return_value=mock_client)

    flags = fetch_squad_flags(["Brazil"], api_key="test")
    assert flags["Brazil"] == ["Vinicius fit"]

def test_fetch_squad_flags_api_error_returns_empty(mocker):
    mocker.patch("src.stats.squads.anthropic.Anthropic",
                 side_effect=anthropic.APIConnectionError(request=MagicMock()))
    flags = fetch_squad_flags(["Brazil", "Germany"], api_key="test")
    assert flags == {"Brazil": [], "Germany": []}
