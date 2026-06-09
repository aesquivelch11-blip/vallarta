import json
import anthropic

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a football squad researcher for WC2026.
Given national team names, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep each flag under 10 words. Return ONLY valid JSON. No markdown fences."""

def fetch_squad_flags(teams: list[str], api_key: str) -> dict[str, list[str]]:
    client = anthropic.Anthropic(api_key=api_key)
    prompt = f"Get WC2026 squad news and injury flags for: {', '.join(teams)}"

    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=_SYSTEM,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}],
    )

    text = ""
    for block in response.content:
        if hasattr(block, "type") and block.type == "text":
            text = block.text
            break

    try:
        data = json.loads(text.strip())
        return {team: data.get(team, []) for team in teams}
    except json.JSONDecodeError:
        return {team: [] for team in teams}
