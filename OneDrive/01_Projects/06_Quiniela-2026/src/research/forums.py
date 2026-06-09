# src/research/forums.py
import json
import re
import praw
import anthropic
from datetime import datetime, timezone
from src.models import PredictionRecord, MatchFixture

MODEL = "claude-sonnet-4-6"
SUBREDDITS = ["soccer", "WorldCup", "FIFA", "ussoccer", "brasil", "argentina"]

_QUALITY_SYSTEM = """Rate this Reddit post's football domain knowledge 0-10.
7-10: references specific stats, xG, tactical systems, squad depth, injuries, manager tendencies.
0-3: generic hype, vague claims, no evidence.
Reply with ONLY the integer score. Nothing else."""

_PREDICT_SYSTEM = """Given a Reddit post discussing a WC2026 match, extract the prediction.
Return JSON: {match_id, team_a, team_b, outcome (W/D/L from team_a), confidence_pct (0.0-1.0), raw_text}.
If no clear prediction exists, return null. No markdown fences."""

def fetch_forum_predictions(
    fixtures: list[MatchFixture],
    reddit_client_id: str,
    reddit_client_secret: str,
    anthropic_api_key: str,
    quality_threshold: int = 7,
    posts_per_match: int = 20,
) -> list[PredictionRecord]:
    reddit = praw.Reddit(
        client_id=reddit_client_id,
        client_secret=reddit_client_secret,
        user_agent="quiniela2026/1.0 (research pipeline)",
    )
    llm = anthropic.Anthropic(api_key=anthropic_api_key)
    records: list[PredictionRecord] = []

    for fixture in fixtures:
        query = f"{fixture.team_a} vs {fixture.team_b} World Cup 2026"
        for sub_name in SUBREDDITS:
            sub = reddit.subreddit(sub_name)
            try:
                posts = list(sub.search(query, limit=posts_per_match, sort="top"))
            except Exception:
                continue
            for post in posts:
                text = f"{post.title}\n{post.selftext}"
                if _score_post_quality(llm, text) >= quality_threshold:
                    record = _post_to_prediction(llm, post, fixture)
                    if record:
                        records.append(record)
    return records

def _score_post_quality(client: anthropic.Anthropic, text: str) -> int:
    resp = client.messages.create(
        model=MODEL,
        max_tokens=10,
        system=_QUALITY_SYSTEM,
        messages=[{"role": "user", "content": text[:2000]}],
    )
    try:
        return int(resp.content[0].text.strip())
    except (ValueError, IndexError):
        return 0

def _post_to_prediction(
    client: anthropic.Anthropic,
    post: object,
    fixture: MatchFixture,
) -> PredictionRecord | None:
    text = f"Match: {fixture.match_id} — {fixture.team_a} vs {fixture.team_b}\n\n{post.title}\n{post.selftext}"
    resp = client.messages.create(
        model=MODEL,
        max_tokens=256,
        system=_PREDICT_SYSTEM,
        messages=[{"role": "user", "content": text[:3000]}],
    )
    raw = resp.content[0].text.strip()
    if raw.lower() == "null":
        return None
    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw, flags=re.DOTALL)
    try:
        d = json.loads(clean)
        if d.get("outcome") not in ("W", "D", "L"):
            return None
        ts = datetime.now(timezone.utc).isoformat()
        return PredictionRecord(
            source_id=f"forum_{fixture.match_id}_{ts[:16].replace(':', '')}",
            source_type="informed_fan",
            source_url=getattr(post, "url", ""),
            timestamp=ts,
            prediction_type="group_match",
            match_id=fixture.match_id,
            team_a=fixture.team_a,
            team_b=fixture.team_b,
            outcome=d["outcome"],
            confidence_pct=min(1.0, max(0.0, float(d.get("confidence_pct", 0.5)))),
            raw_text=d.get("raw_text", "")[:500],
        )
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"Warning: Skipping malformed forum prediction: {e!r}")
        return None
