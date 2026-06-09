# tests/test_forums.py
from unittest.mock import MagicMock
from src.research.forums import fetch_forum_predictions, _score_post_quality
from src.models import PredictionRecord, MatchFixture

SAMPLE_FIXTURES = [
    MatchFixture(match_id="A1", group="A", team_a="USA", team_b="Mexico", date="2026-06-11"),
]

def test_score_post_quality_returns_int(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="8")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "USA 4-3-3 press vs Mexico 5-4-1. Pulisic xG 0.62/90.")
    assert score == 8

def test_score_post_quality_invalid_response_returns_zero(mocker):
    mock_client = MagicMock()
    mock_message = MagicMock()
    mock_message.content = [MagicMock(type="text", text="not a number")]
    mock_client.messages.create.return_value = mock_message

    score = _score_post_quality(mock_client, "some text")
    assert score == 0

def test_fetch_forum_predictions_filters_low_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_reddit.subreddit.return_value = mock_sub

    expert_post = MagicMock()
    expert_post.title = "USA vs Mexico tactical breakdown"
    expert_post.selftext = "PPDA 18, xGA 2.1, squad depth analysis..."
    expert_post.url = "https://reddit.com/r/soccer/1"

    noise_post = MagicMock()
    noise_post.title = "USA gonna crush it!!!"
    noise_post.selftext = "they're the best team lol"
    noise_post.url = "https://reddit.com/r/soccer/2"

    mock_sub.search.return_value = [expert_post, noise_post]

    call_count = 0
    def score_side_effect(client, text):
        nonlocal call_count
        call_count += 1
        return 8 if call_count == 1 else 2

    mock_record = MagicMock(spec=PredictionRecord)

    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", side_effect=score_side_effect)
    mocker.patch("src.research.forums._post_to_prediction", return_value=mock_record)

    records = fetch_forum_predictions(
        SAMPLE_FIXTURES,
        reddit_client_id="cid",
        reddit_client_secret="csec",
        anthropic_api_key="akey",
        quality_threshold=7,
    )
    assert len(records) == 1

def test_fetch_forum_predictions_all_fail_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_reddit.subreddit.return_value = mock_sub
    mock_sub.search.return_value = [MagicMock(title="hype", selftext="lol", url="x")]

    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", return_value=3)

    records = fetch_forum_predictions(
        SAMPLE_FIXTURES,
        reddit_client_id="cid",
        reddit_client_secret="csec",
        anthropic_api_key="akey",
        quality_threshold=7,
    )
    assert records == []
