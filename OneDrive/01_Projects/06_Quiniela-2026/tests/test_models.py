from src.models import RecentForm, TeamStats, PredictionRecord, ConsensusRecord, MatchFixture

def test_recent_form_fields():
    f = RecentForm(matches=10, wins=6, draws=2, losses=2,
                   goals_scored_avg=1.8, goals_conceded_avg=0.9)
    assert f.matches == 10
    assert f.wins == 6

def test_team_stats_squad_flags_default_empty():
    f = RecentForm(matches=10, wins=6, draws=2, losses=2,
                   goals_scored_avg=1.8, goals_conceded_avg=0.9)
    ts = TeamStats(team="Brazil", elo_rating=2100, fifa_rank=1, recent_form=f)
    assert ts.squad_flags == []

def test_prediction_record_fields():
    pr = PredictionRecord(
        source_id="espn_2026-06-07",
        source_type="analyst",
        source_url="https://espn.com",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id="A1",
        team_a="USA",
        team_b="Mexico",
        outcome="W",
        confidence_pct=0.65,
        raw_text="USA edge Mexico in opener"
    )
    assert pr.outcome == "W"
    assert pr.confidence_pct == 0.65

def test_consensus_record_fields():
    cr = ConsensusRecord(
        match_id="A1",
        team_a="USA",
        team_b="Mexico",
        consensus_outcome="W",
        confidence_tier="medium",
        weighted_confidence=0.62,
        source_count=5,
        contrarian_flag=False,
        contrarian_detail=""
    )
    assert cr.confidence_tier == "medium"

def test_match_fixture_fields():
    mf = MatchFixture(match_id="A1", group="A", team_a="USA",
                      team_b="Mexico", date="2026-06-11")
    assert mf.group == "A"

def test_recent_form_integrity_check():
    import pytest
    with pytest.raises(AssertionError):
        RecentForm(matches=10, wins=6, draws=2, losses=3,  # 6+2+3=11 != 10
                   goals_scored_avg=1.8, goals_conceded_avg=0.9)
