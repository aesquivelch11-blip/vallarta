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

def test_prior_symmetry():
    """compute_prior(A,B)["W"] must equal compute_prior(B,A)["L"] (rounding tolerance only)."""
    a = _make_team("Brazil", 2100)
    b = _make_team("Minnow", 1500)
    ab = compute_prior(a, b)
    ba = compute_prior(b, a)
    assert abs(ab["W"] - ba["L"]) < 5e-4
    assert abs(ab["L"] - ba["W"]) < 5e-4
    assert abs(ab["D"] - ba["D"]) < 5e-4

def test_prior_weak_team_as_team_a():
    weak = _make_team("Minnow", 1500)
    strong = _make_team("Brazil", 2100)
    prior = compute_prior(weak, strong)
    assert prior["L"] > prior["W"]
    assert prior["W"] >= 0.05
