# src/pipeline.py
"""
Quiniela 2026 — end-to-end prediction pipeline

Usage:  python src/pipeline.py
Env:    ANTHROPIC_API_KEY, FOOTBALL_DATA_API_KEY, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET
Output: output/YYYY-MM-DD_raw_data.json
        output/YYYY-MM-DD_consensus.json
        output/YYYY-MM-DD_quiniela_report.md
"""
import json
import os
from dataclasses import asdict
from datetime import date
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from src.stats.elo import fetch_elo_ratings
from src.stats.form import fetch_recent_form, fetch_fixtures
from src.stats.squads import fetch_squad_flags
from src.research.analysts import fetch_analyst_predictions
from src.research.markets import fetch_market_predictions
from src.research.forums import fetch_forum_predictions
from src.normalize import normalize_predictions
from src.consensus import build_consensus
from src.report import render_report
from src.models import TeamStats


def run() -> None:
    anthropic_key = os.environ["ANTHROPIC_API_KEY"]
    fd_key        = os.environ["FOOTBALL_DATA_API_KEY"]
    reddit_cid    = os.environ["REDDIT_CLIENT_ID"]
    reddit_csec   = os.environ["REDDIT_CLIENT_SECRET"]

    run_date   = date.today().isoformat()
    output_dir = Path("output")
    output_dir.mkdir(parents=True, exist_ok=True)

    # ── Phase 1: GATHER ───────────────────────────────────────────────────────

    print("=== Phase 1: GATHER ===")

    print("[1/6] Fetching WC2026 fixtures from football-data.org...")
    fixtures = fetch_fixtures(api_key=fd_key)
    if not fixtures:
        print("ERROR: No fixtures returned. Verify FOOTBALL_DATA_API_KEY.")
        raise SystemExit(1)
    print(f"  {len(fixtures)} fixtures loaded.")

    all_teams = sorted({t for f in fixtures for t in (f.team_a, f.team_b)})

    print("[2/6] Fetching Elo ratings from eloratings.net...")
    elo_ratings = fetch_elo_ratings()
    print(f"  {len(elo_ratings)} teams rated.")

    print("[3/6] Fetching recent form and squad flags...")
    squad_flags = fetch_squad_flags(all_teams, api_key=anthropic_key)
    stats: dict[str, TeamStats] = {}
    for team in all_teams:
        form = fetch_recent_form(team, api_key=fd_key)
        stats[team] = TeamStats(
            team=team,
            elo_rating=elo_ratings.get(team, 1700),
            recent_form=form,
            squad_flags=squad_flags.get(team, []),
        )
    print(f"  Stats built for {len(stats)} teams.")

    print("[4/6] Fetching analyst predictions via Claude + web search...")
    analyst_records = fetch_analyst_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(analyst_records)} analyst records.")

    print("[5/6] Fetching prediction market odds...")
    market_records = fetch_market_predictions(fixtures, api_key=anthropic_key)
    print(f"  {len(market_records)} market records.")

    print("[6/6] Fetching forum predictions...")
    forum_records = fetch_forum_predictions(
        fixtures,
        reddit_client_id=reddit_cid,
        reddit_client_secret=reddit_csec,
        anthropic_api_key=anthropic_key,
    )
    print(f"  {len(forum_records)} forum records.")

    # ── Phase 2: MODEL ────────────────────────────────────────────────────────

    print("\n=== Phase 2: MODEL ===")
    all_records = normalize_predictions(analyst_records + market_records + forum_records)
    consensus = build_consensus(fixtures, all_records, stats)

    # ── Phase 3: OUTPUT ───────────────────────────────────────────────────────

    print("\n=== Phase 3: OUTPUT ===")
    report = render_report(consensus, run_date=run_date)
    print(report[:500])  # preview

    raw_path = output_dir / f"{run_date}_raw_data.json"
    consensus_path = output_dir / f"{run_date}_consensus.json"
    report_path = output_dir / f"{run_date}_quiniela_report.md"

    raw_path.write_text(json.dumps([asdict(r) for r in all_records], indent=2))
    consensus_path.write_text(json.dumps([asdict(c) for c in consensus], indent=2))
    report_path.write_text(report)

    print(f"\nDone. Open your report:\n  {report_path}")


if __name__ == "__main__":
    run()
