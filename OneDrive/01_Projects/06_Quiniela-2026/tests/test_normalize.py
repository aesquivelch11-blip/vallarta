# tests/test_normalize.py
from src.normalize import normalize_predictions
from src.models import PredictionRecord

def _rec(source_type: str, outcome: str, confidence: float,
         source_id: str = "test", match_id: str = "A1") -> PredictionRecord:
    return PredictionRecord(
        source_id=source_id,
        source_type=source_type,
        source_url="https://example.com",
        timestamp="2026-06-07T10:00:00Z",
        prediction_type="group_match",
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        outcome=outcome,
        confidence_pct=confidence,
        raw_text="test",
    )

def test_normalize_deduplicates_same_source_id():
    records = [
        _rec("analyst", "W", 0.65, source_id="espn_A1"),
        _rec("analyst", "W", 0.65, source_id="espn_A1"),  # exact duplicate
    ]
    result = normalize_predictions(records)
    assert len(result) == 1

def test_normalize_keeps_different_sources():
    records = [
        _rec("analyst", "W", 0.65, source_id="espn_A1"),
        _rec("analyst", "D", 0.50, source_id="bbc_A1"),
    ]
    result = normalize_predictions(records)
    assert len(result) == 2

def test_normalize_clips_confidence_above_one():
    records = [_rec("analyst", "W", 1.5)]
    result = normalize_predictions(records)
    assert result[0].confidence_pct == 1.0

def test_normalize_clips_confidence_below_zero():
    records = [_rec("analyst", "W", -0.1)]
    result = normalize_predictions(records)
    assert result[0].confidence_pct == 0.0

def test_normalize_preserves_market_source_type():
    records = [_rec("prediction_market", "D", 0.45)]
    result = normalize_predictions(records)
    assert result[0].source_type == "prediction_market"

def test_normalize_empty_input():
    assert normalize_predictions([]) == []
