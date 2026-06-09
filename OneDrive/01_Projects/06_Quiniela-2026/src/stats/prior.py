from src.models import TeamStats

def compute_prior(team_a: TeamStats, team_b: TeamStats) -> dict[str, float]:
    """
    Compute {W, D, L} prior from Elo + recent form.
    W = team_a wins, L = team_a loses.
    """
    a_form = _form_score(team_a)
    b_form = _form_score(team_b)

    elo_delta = team_a.elo_rating - team_b.elo_rating
    base_win = 1.0 / (1.0 + 10 ** (-elo_delta / 400))
    form_adj = (a_form - b_form) * 0.05  # max ±5pp

    # Closer Elo → higher draw probability (max 0.30), larger gap → lower (min 0.18)
    draw = 0.25 + max(-0.07, min(0.05, -abs(elo_delta) / 3000))

    w = base_win + form_adj
    l = 1.0 - w - draw

    # Apply floor constraint with iterative normalization
    floor = 0.05
    for _ in range(10):  # Iterate until convergence
        w = max(floor, w)
        l = max(floor, l)
        draw = max(floor, draw)

        # Normalize to sum to 1.0
        total = w + draw + l
        w /= total
        l /= total
        draw /= total

    return {
        "W": round(w, 4),
        "D": round(draw, 4),
        "L": round(l, 4),
    }

def _form_score(team: TeamStats) -> float:
    """Points-based form score 0.0–1.0."""
    f = team.recent_form
    if f.matches == 0:
        return 0.5
    return (f.wins * 3 + f.draws) / (f.matches * 3)
