import json
import re
import anthropic

MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a football squad researcher for WC2026.
Given national team names, search for their latest squad announcements,
key injuries, suspensions, and notable absences for the tournament.

Return JSON: {"TeamName": ["flag1", "flag2"], ...}
Keep each flag under 10 words. Return ONLY valid JSON. No markdown fences."""

def fetch_squad_flags(teams: list[str], api_key: str) -> dict[str, list[str]]:
    teams = list(dict.fromkeys(teams))  # deduplicate, preserve order
    try:
        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"Get WC2026 squad news and injury flags for: {', '.join(teams)}"

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

        # Strip markdown fences in case Claude wraps JSON despite instructions
        clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.DOTALL)

        try:
            data = json.loads(clean)
            return {team: data.get(team, []) for team in teams}
        except json.JSONDecodeError:
            print("Warning: Could not parse squad flags JSON response")
            return {team: [] for team in teams}

    except anthropic.APIError as e:
        print(f"Warning: Failed to fetch squad flags: {e}")
        return {team: [] for team in teams}
