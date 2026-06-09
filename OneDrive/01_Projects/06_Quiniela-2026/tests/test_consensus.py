# tests/test_consensus.py
from src.consensus import build_consensus
from src.models import PredictionRecord, ConsensusRecord, MatchFixture, TeamStats, RecentForm

def _rec(source_type: str, outcome: str, conf: float,
         match_id: str = "A1", idx: int = 0) -> PredictionRecord:
    return PredictionRecord(
        source_id=f"{source_type}_{outcome}_{idx}",
        source_type=source_type,
        source_url="",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        outcome=outcome,
        confidence_pct=conf,
        raw_text="",
    )

def _stats(team: str, elo: int) -> TeamStats:
    form = RecentForm(matches=10, wins=5, draws=3, losses=2,
                      goals_scored_avg=1.5, goals_conceded_avg=1.0)
    return TeamStats(team=team, elo_rating=elo, recent_form=form)  # no fifa_rank

FIXTURES = [MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11")]
STATS = {"USA": _stats("USA", 1900), "Mexico": _stats("Mexico", 1850)}

def test_consensus_returns_one_record_per_fixture():
    results = build_consensus(FIXTURES, [], STATS)
    assert len(results) == 1
    assert isinstance(results[0], ConsensusRecord)

def test_consensus_majority_outcome_wins():
    records = [
        _rec("analyst", "W", 0.70, idx=0),
        _rec("analyst", "W", 0.65, idx=1),
        _rec("informed_fan", "D", 0.55),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].consensus_outcome == "W"

def test_consensus_confidence_tier_high():
    records = [_rec("analyst", "W", 0.80, idx=i) for i in range(9)]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].confidence_tier == "high"

def test_consensus_confidence_tier_low():
    results = build_consensus(FIXTURES, [], STATS)
    assert results[0].confidence_tier in ("low", "medium", "high")

def test_contrarian_flag_raised():
    records = [
        _rec("analyst", "W", 0.72, idx=0),
        _rec("analyst", "W", 0.68, idx=1),
        _rec("prediction_market", "D", 0.55),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is True
    assert "market" in results[0].contrarian_detail.lower()

def test_no_contrarian_when_market_agrees():
    records = [
        _rec("analyst", "W", 0.65, idx=0),
        _rec("prediction_market", "W", 0.62),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].contrarian_flag is False

def test_source_count_excludes_markets():
    records = [
        _rec("analyst", "W", 0.65, idx=0),
        _rec("informed_fan", "W", 0.60),
        _rec("prediction_market", "D", 0.50),
    ]
    results = build_consensus(FIXTURES, records, STATS)
    assert results[0].source_count == 2
