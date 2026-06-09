# src/consensus.py
from src.models import PredictionRecord, ConsensusRecord, MatchFixture, TeamStats
from src.stats.prior import compute_prior

_WEIGHTS: dict[str, float] = {"analyst": 1.0, "informed_fan": 0.6}
_CONTRARIAN_THRESHOLD = 0.40

def build_consensus(
    fixtures: list[MatchFixture],
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> list[ConsensusRecord]:
    return [_for_match(f, records, stats) for f in fixtures]

def _for_match(
    fixture: MatchFixture,
    records: list[PredictionRecord],
    stats: dict[str, TeamStats],
) -> ConsensusRecord:
    match_records = [r for r in records if r.match_id == fixture.match_id]
    voting = [r for r in match_records if r.source_type != "prediction_market"]
    market = [r for r in match_records if r.source_type == "prediction_market"]

    prior = _prior(fixture, stats)
    prior_w, qual_w = _blend_weights(len(voting))

    scores: dict[str, float] = {"W": 0.0, "D": 0.0, "L": 0.0}
    for r in voting:
        scores[r.outcome] += _WEIGHTS.get(r.source_type, 0.5) * r.confidence_pct
    total_qual = sum(scores.values()) or 1.0
    qual_probs = {k: v / total_qual for k, v in scores.items()}

    blended = {
        o: prior_w * prior.get(o, 0.33) + qual_w * qual_probs.get(o, 0.0)
        for o in ("W", "D", "L")
    }
    total = sum(blended.values()) or 1.0
    blended = {k: v / total for k, v in blended.items()}

    outcome = max(blended, key=blended.__getitem__)
    conf = blended[outcome]
    contrarian_flag, contrarian_detail = _contrarian(outcome, conf, market)

    return ConsensusRecord(
        match_id=fixture.match_id,
        team_a=fixture.team_a,
        team_b=fixture.team_b,
        consensus_outcome=outcome,
        confidence_tier=_tier(conf),
        weighted_confidence=round(conf, 4),
        source_count=len(voting),
        contrarian_flag=contrarian_flag,
        contrarian_detail=contrarian_detail,
    )

def _prior(fixture: MatchFixture, stats: dict[str, TeamStats]) -> dict[str, float]:
    a, b = stats.get(fixture.team_a), stats.get(fixture.team_b)
    return compute_prior(a, b) if a and b else {"W": 0.34, "D": 0.33, "L": 0.33}

def _blend_weights(source_count: int) -> tuple[float, float]:
    if source_count <= 2:
        return 0.80, 0.20
    if source_count <= 7:
        return 0.55, 0.45
    return 0.30, 0.70

def _tier(conf: float) -> str:
    if conf >= 0.70:
        return "high"
    if conf >= 0.50:
        return "medium"
    return "low"

def _contrarian(
    consensus_outcome: str,
    consensus_conf: float,
    market_records: list[PredictionRecord],
) -> tuple[bool, str]:
    if not market_records:
        return False, ""
    best = max(market_records, key=lambda r: r.confidence_pct)
    if best.outcome != consensus_outcome and best.confidence_pct >= _CONTRARIAN_THRESHOLD:
        detail = (f"Markets favor {best.outcome} ({best.confidence_pct:.0%}) "
                  f"vs expert consensus {consensus_outcome} ({consensus_conf:.0%})")
        return True, detail
    return False, ""
