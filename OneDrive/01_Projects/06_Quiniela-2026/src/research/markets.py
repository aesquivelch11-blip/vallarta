# src/research/markets.py
import json
import re
from google import genai
from google.genai import types
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "gemini-2.0-flash"

_SYSTEM = """You are a prediction market researcher for WC2026.
Given matches, search Polymarket and Kalshi for current market-implied probabilities.

For each match return a JSON array. Each element:
  match_id, team_a, team_b,
  outcome (W/D/L — the highest-probability outcome from team_a perspective),
  confidence_pct (market-implied probability 0.0-1.0),
  source_url, raw_text (note thin liquidity or stale markets if present).

Return ONLY valid JSON array. No markdown fences."""


# Single-call design: markets data fetched in one request (no batching).
def fetch_market_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = genai.Client(api_key=api_key)
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=f"Find prediction market odds for:\n{match_list}",
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM,
                tools=[types.Tool(google_search=types.GoogleSearch())],
                max_output_tokens=4096,
            )
        )
    except Exception as e:
        print(f"Warning: Failed to fetch market predictions: {e}")
        return []
    text = response.text or ""
    if not text:
        print("Warning: No text in markets API response")
        return []
    return _parse(text)


def _parse(text: str) -> list[PredictionRecord]:
    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL)
    try:
        data = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"Warning: Failed to parse market JSON: {e!r}")
        return []
    ts = datetime.now(timezone.utc).isoformat()
    ts_part = ts[:19].replace(':', '').replace('-', '').replace('T', '_')
    records = []
    for idx, item in enumerate(data):
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
            records.append(PredictionRecord(
                source_id=f"market_{item['match_id']}_{ts_part}_{idx}",
                source_type="prediction_market",
                source_url=item.get("source_url", ""),
                timestamp=ts,
                prediction_type="group_match",
                match_id=item["match_id"],
                team_a=item["team_a"],
                team_b=item["team_b"],
                outcome=item["outcome"],
                confidence_pct=min(1.0, max(0.0, float(item.get("confidence_pct", 0.5)))),
                raw_text=item.get("raw_text", ""),
            ))
        except (KeyError, ValueError) as e:
            print(f"Warning: Skipping malformed market record: {e!r}")
            continue
    return records
