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

def test_fetch_recent_form_unknown_team_returns_empty(mocker):
    mocker.patch("src.stats.form.requests.get",
                 return_value=MagicMock(json=lambda: {"teams": []},
                                        raise_for_status=MagicMock()))
    form = fetch_recent_form("Atlantis FC", api_key="test")
    assert form.matches == 1 and form.draws == 1

def test_fetch_recent_form_network_error_returns_empty(mocker):
    import requests as req_lib
    mocker.patch("src.stats.form.requests.get",
                 side_effect=req_lib.exceptions.ConnectionError("down"))
    form = fetch_recent_form("Brazil", api_key="test")
    assert isinstance(form, RecentForm)
