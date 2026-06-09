# src/stats/squads.py
import json
import re
from google import genai
from google.genai import types

MODEL = "gemini-2.0-flash"
_BATCH_SIZE = 4

_SYSTEM = """You are a football squad researcher for WC2026.
Given national team names, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep each flag under 10 words. Return ONLY valid JSON. No markdown fences."""


def fetch_squad_flags(teams: list[str], api_key: str) -> dict[str, list[str]]:
    teams = list(dict.fromkeys(teams))  # deduplicate, preserve order
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client for squad flags: {e}")
        return {team: [] for team in teams}

    results: dict[str, list[str]] = {}
    for i in range(0, len(teams), _BATCH_SIZE):
        batch = teams[i:i + _BATCH_SIZE]
        try:
            results.update(_fetch_batch(client, batch))
        except Exception as e:
            print(f"Warning: Failed to fetch squad flags for batch {batch}: {e}")
            results.update({team: [] for team in batch})
    return results


def _fetch_batch(client: genai.Client, batch: list[str]) -> dict[str, list[str]]:
    team_list = ", ".join(batch)
    response = client.models.generate_content(
        model=MODEL,
        contents=f"Get WC2026 squad news and injury flags for: {team_list}",
        config=types.GenerateContentConfig(
            system_instruction=_SYSTEM,
            tools=[types.Tool(google_search=types.GoogleSearch())],
            max_output_tokens=4096,
        )
    )
    text = response.text or ""
    if not text:
        return {team: [] for team in batch}
    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL)
    try:
        data = json.loads(clean)
    except json.JSONDecodeError:
        return {team: [] for team in batch}
    return {team: data.get(team, []) for team in batch}
