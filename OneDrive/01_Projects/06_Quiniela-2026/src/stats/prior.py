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

    # Scale win/loss by (1-draw) so w_raw + l_raw + draw_raw = 1 and l_raw(A,B) = w_raw(B,A)
    # This is the only construction that guarantees exact symmetry after floor redistribution.
    p_win = base_win + form_adj
    vals = [p_win * (1.0 - draw_raw), draw_raw, (1.0 - p_win) * (1.0 - draw_raw)]
    keys = ["W", "D", "L"]

    # Proportional floor redistribution: raise below-floor values to FLOOR,
    # reduce above-floor values proportionally. Preserves symmetry and sums to 1.
    for _ in range(20):
        below = [v < FLOOR for v in vals]
        if not any(below):
            break
        deficit = sum(FLOOR - v for v, b in zip(vals, below) if b)
        above_total = sum(v for v, b in zip(vals, below) if not b)
        vals = [
            FLOOR if b else v - deficit * v / above_total
            for v, b in zip(vals, below)
        ]

    total = sum(vals)
    return {k: round(v / total, 4) for k, v in zip(keys, vals)}


def _form_score(team: TeamStats) -> float:
    """Points-based form score clamped to 0.0–1.0."""
    f = team.recent_form
    if f.matches == 0:
        return 0.5
    raw = (f.wins * 3 + f.draws) / (f.matches * 3)
    return min(1.0, max(0.0, raw))
