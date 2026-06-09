from src.models import TeamStats

FLOOR = 0.05


def compute_prior(team_a: TeamStats, team_b: TeamStats) -> dict[str, float]:
    """
    Compute {W, D, L} prior from Elo + recent form.
    W = team_a wins, D = draw, L = team_a loses.
    Guaranteed: compute_prior(A,B)["W"] == compute_prior(B,A)["L"]
    """
    a_form = _form_score(team_a)
    b_form = _form_score(team_b)

    elo_delta = team_a.elo_rating - team_b.elo_rating
    base_win = 1.0 / (1.0 + 10 ** (-elo_delta / 400))
    form_adj = (a_form - b_form) * 0.05  # max ±5pp

    # Draw probability: closer Elo → higher (max 0.25 at delta=0, min 0.18 at |delta|>=210)
    draw_raw = 0.25 + max(-0.07, -abs(elo_delta) / 3000)

    # Compute raw values — l_raw MUST use raw w, not floored w, to preserve symmetry
    w_raw = base_win + form_adj
    l_raw = 1.0 - w_raw - draw_raw

    # Floor all three independently, then iteratively normalize with floor maintenance
    w = max(FLOOR, w_raw)
    d = max(FLOOR, draw_raw)
    l = max(FLOOR, l_raw)

    # Iteratively normalize while maintaining floor
    for _ in range(10):
        total = w + d + l
        w = max(FLOOR, w / total)
        d = max(FLOOR, d / total)
        l = max(FLOOR, l / total)

    total = w + d + l
    return {
        "W": round(w / total, 4),
        "D": round(d / total, 4),
        "L": round(l / total, 4),
    }


def _form_score(team: TeamStats) -> float:
    """Points-based form score clamped to 0.0–1.0."""
    f = team.recent_form
    if f.matches == 0:
        return 0.5
    raw = (f.wins * 3 + f.draws) / (f.matches * 3)
    return min(1.0, max(0.0, raw))
