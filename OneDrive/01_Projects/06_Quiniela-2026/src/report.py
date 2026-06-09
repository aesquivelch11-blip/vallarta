# src/report.py
from src.models import ConsensusRecord

_TIER_LABEL = {"high": "HIGH", "medium": "MED", "low": "LOW"}

def render_report(records: list[ConsensusRecord], run_date: str) -> str:
    total_sources = sum(r.source_count for r in records)
    lines = [
        f"# Quiniela 2026 — Recommendations ({run_date})",
        "",
        f"> Generated from {total_sources} source predictions across {len(records)} matches.",
        "",
        "## Group Stage Picks",
        "",
        "| Match | Team A | Team B | Pick | Confidence | Sources | Alert |",
        "|-------|--------|--------|------|------------|---------|-------|",
    ]

    for r in records:
        tier = _TIER_LABEL.get(r.confidence_tier, r.confidence_tier.upper())
        alert = "⚠" if r.contrarian_flag else ""
        lines.append(
            f"| {r.match_id} | {r.team_a} | {r.team_b} "
            f"| **{r.consensus_outcome}** "
            f"| {tier} ({r.weighted_confidence:.0%}) "
            f"| {r.source_count} | {alert} |"
        )

    contrarians = [r for r in records if r.contrarian_flag]
    lines += ["", "## Contrarian Watchlist", ""]
    if contrarians:
        lines.append("Picks where the leading market-implied outcome differs from expert consensus (market confidence ≥ 40%):\n")
        for r in contrarians:
            lines.append(f"- **{r.match_id}** ({r.team_a} vs {r.team_b}): {r.contrarian_detail}")
    else:
        lines.append("No significant contrarian signals detected.")

    return "\n".join(lines)
