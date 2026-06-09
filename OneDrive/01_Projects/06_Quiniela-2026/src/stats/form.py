import requests
from src.models import RecentForm, MatchFixture

BASE_URL = "https://api.football-data.org/v4"

def fetch_recent_form(team_name: str, api_key: str, n_matches: int = 10) -> RecentForm:
    """Fetch last n_matches results for team via football-data.org."""
    headers = {"X-Auth-Token": api_key}
    try:
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
    except requests.exceptions.RequestException as e:
        print(f"Warning: Failed to fetch form for {team_name}: {e}")
        return _empty_form()

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
    try:
        resp = requests.get(f"{BASE_URL}/competitions/WC/matches",
                            headers=headers,
                            params={"stage": "GROUP_STAGE"},
                            timeout=15)
        resp.raise_for_status()
        raw = resp.json().get("matches", [])
    except requests.exceptions.RequestException as e:
        print(f"Warning: Failed to fetch fixtures: {e}")
        return []

    fixtures = []
    group_counters: dict[str, int] = {}
    for m in raw:
        group = m.get("group", "?").replace("GROUP_", "")
        group_counters[group] = group_counters.get(group, 0) + 1
        match_id = f"{group}{group_counters[group]}"
        fixtures.append(MatchFixture(
            match_id=match_id,
            group=group,
            team_a=m["homeTeam"]["name"],
            team_b=m["awayTeam"]["name"],
            date=m.get("utcDate", "")[:10],
        ))
    return fixtures

def _empty_form() -> RecentForm:
    # Sentinel: phantom draw keeps __post_init__ valid and gives neutral priors
    return RecentForm(matches=1, wins=0, draws=1, losses=0,
                      goals_scored_avg=0.0, goals_conceded_avg=0.0)
