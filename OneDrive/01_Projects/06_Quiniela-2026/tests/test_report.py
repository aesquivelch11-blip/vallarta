# tests/test_report.py
from src.report import render_report
from src.models import ConsensusRecord

def _cr(match_id: str, outcome: str, tier: str, contrarian: bool = False) -> ConsensusRecord:
    return ConsensusRecord(
        match_id=match_id,
        team_a="USA",
        team_b="Mexico",
        consensus_outcome=outcome,
        confidence_tier=tier,
        weighted_confidence=0.65,
        source_count=8,
        contrarian_flag=contrarian,
        contrarian_detail="Markets favor D (48%) vs expert W (65%)" if contrarian else "",
    )

def test_render_report_contains_header():
    report = render_report([_cr("A1", "W", "high")], run_date="2026-06-07")
    assert "Quiniela 2026" in report
    assert "2026-06-07" in report

def test_render_report_contains_match_row():
    report = render_report([_cr("A1", "W", "high")], run_date="2026-06-07")
    assert "A1" in report
    assert "USA" in report
    assert "Mexico" in report
    assert "| **W**" in report
    assert "HIGH" in report

def test_render_report_contrarian_in_watchlist():
    report = render_report([_cr("A1", "W", "medium", contrarian=True)], run_date="2026-06-07")
    assert "Contrarian Watchlist" in report
    assert "Markets favor D" in report

def test_render_report_watchlist_empty_when_no_contrarian():
    report = render_report([_cr("A1", "W", "high", contrarian=False)], run_date="2026-06-07")
    assert "Contrarian Watchlist" in report
    assert "No significant contrarian signals" in report

def test_render_report_source_count_in_header():
    records = [_cr("A1", "W", "high"), _cr("B1", "L", "medium")]
    report = render_report(records, run_date="2026-06-07")
    assert "16" in report  # 8 sources × 2 records
