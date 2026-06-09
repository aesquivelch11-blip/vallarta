import json
import re
import anthropic

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a football squad researcher for WC2026.
Given national team names, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep each flag under 10 words. Return ONLY valid JSON. No markdown fences."""

_BATCH_SIZE = 4

def _fetch_batch(client: anthropic.Anthropic, batch: list[str]) -> dict[str, list[str]]:
    prompt = f"Get WC2026 squad news and injury flags for: {', '.join(batch)}"
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
        messages=[{"role": "user", "content": prompt}],
        betas=["web-search-2025-03-05"],
    )
    text = ""
    for block in response.content:
        if hasattr(block, "type") and block.type == "text":
            text = block.text
            break
    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL)
    try:
        data = json.loads(clean)
        return {team: data.get(team, []) for team in batch}
    except json.JSONDecodeError:
        print("Warning: Could not parse squad flags JSON response")
        return {team: [] for team in batch}

def fetch_squad_flags(teams: list[str], api_key: str) -> dict[str, list[str]]:
    teams = list(dict.fromkeys(teams))  # deduplicate, preserve order
    client = anthropic.Anthropic(api_key=api_key)
    results: dict[str, list[str]] = {}
    for i in range(0, len(teams), _BATCH_SIZE):
        batch = teams[i : i + _BATCH_SIZE]
        try:
            results.update(_fetch_batch(client, batch))
        except anthropic.APIError as e:
            print(f"Warning: Failed to fetch squad flags for batch {batch}: {e}")
            results.update({team: [] for team in batch})
    return results
