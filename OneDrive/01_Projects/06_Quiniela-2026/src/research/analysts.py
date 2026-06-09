# src/research/analysts.py
import json
import re
from google import genai
from google.genai import types
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "gemini-2.0-flash"
BATCH_SIZE = 6

_SYSTEM = """You are a football analytics researcher aggregating expert predictions for WC2026.
Given group stage matches, search for analyst and expert predictions from reputable sources
(ESPN, BBC Sport, The Athletic, Sky Sports, Guardian, FiveThirtyEight, etc.).

For each match return a JSON array. Each element must have:
  match_id, team_a, team_b, outcome (W/D/L from team_a perspective),
  confidence_pct (0.0-1.0), source_url, raw_text (brief quote or summary).

Return ONLY valid JSON array. No markdown fences. No explanation outside the array."""

def fetch_analyst_predictions(fixtures: list[MatchFixture], api_key: str) -> list[PredictionRecord]:
    client = genai.Client(api_key=api_key)
    all_records: list[PredictionRecord] = []
    for i in range(0, len(fixtures), BATCH_SIZE):
        batch = fixtures[i:i + BATCH_SIZE]
        try:
            all_records.extend(_fetch_batch(client, batch))
        except Exception as e:
            print(f"Warning: Failed to fetch analyst predictions for batch {[f.match_id for f in batch]}: {e}")
    return all_records

def _fetch_batch(client: genai.Client, fixtures: list[MatchFixture]) -> list[PredictionRecord]:
    match_list = "\n".join(
        f"- {f.match_id}: {f.team_a} vs {f.team_b} ({f.date})" for f in fixtures
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=f"Research analyst predictions for:\n{match_list}",
        config=types.GenerateContentConfig(
            system_instruction=_SYSTEM,
            tools=[types.Tool(google_search=types.GoogleSearch())],
            max_output_tokens=4096,
        )
    )
    text = response.text or ""
    if not text:
        print("Warning: No text in analyst API response")
        return []
    return _parse(text)

def _parse(text: str) -> list[PredictionRecord]:
    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL)
    try:
        data = json.loads(clean)
    except json.JSONDecodeError as e:
        print(f"Warning: Failed to parse analyst JSON: {e!r}")
        return []
    ts = datetime.now(timezone.utc).isoformat()
    ts_part = ts[:19].replace(':', '').replace('-', '').replace('T', '_')
    records = []
    for idx, item in enumerate(data):
        if item.get("outcome") not in ("W", "D", "L"):
            continue
        try:
            records.append(PredictionRecord(
                source_id=f"analyst_{item['match_id']}_{ts_part}_{idx}",
                source_type="analyst",
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
            print(f"Warning: Skipping malformed analyst record: {e!r}")
            continue
    return records
