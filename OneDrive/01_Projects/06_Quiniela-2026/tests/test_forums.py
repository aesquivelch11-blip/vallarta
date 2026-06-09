import pytest
from unittest.mock import MagicMock
from src.research.forums import fetch_forum_predictions, _score_post_quality
from src.models import MatchFixture, PredictionRecord

FIXTURE = MatchFixture(match_id="A1", group="A", team_a="Mexico", team_b="Poland", date="2026-06-11")


def _make_mock_client(text):
    mock_response = MagicMock()
    mock_response.text = text
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response
    return mock_client


def test_score_post_quality_returns_int():
    client = _make_mock_client("8")
    score = _score_post_quality(client, "Mexico looks great this tournament")
    assert score == 8


def test_score_post_quality_invalid_response_returns_zero():
    client = _make_mock_client("not a number")
    score = _score_post_quality(client, "some text")
    assert score == 0


def test_fetch_forum_predictions_filters_low_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_post = MagicMock()
    mock_post.id = "abc123"
    mock_post.selftext = "Mexico will win"
    mock_post.score = 50
    mock_sub.hot.return_value = [mock_post]
    mock_reddit.subreddit.return_value = mock_sub
    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)

    mock_record = MagicMock(spec=PredictionRecord)
    score_side_effect = [8, 2, 8, 2, 8, 2]
    mocker.patch("src.research.forums._score_post_quality", side_effect=score_side_effect)
    mocker.patch("src.research.forums._post_to_prediction", return_value=mock_record)
    mocker.patch("src.research.forums.genai.Client", return_value=MagicMock())

    records = fetch_forum_predictions(
        [FIXTURE],
        reddit_client_id="id",
        reddit_client_secret="secret",
        gemini_api_key="key",
        quality_threshold=7,
        posts_per_subreddit=1,
    )
    assert len(records) >= 1


def test_fetch_forum_predictions_all_fail_quality(mocker):
    mock_reddit = MagicMock()
    mock_sub = MagicMock()
    mock_post = MagicMock()
    mock_post.id = "abc123"
    mock_post.selftext = "meh"
    mock_post.score = 1
    mock_sub.hot.return_value = [mock_post]
    mock_reddit.subreddit.return_value = mock_sub
    mocker.patch("src.research.forums.praw.Reddit", return_value=mock_reddit)
    mocker.patch("src.research.forums._score_post_quality", return_value=2)
    mocker.patch("src.research.forums.genai.Client", return_value=MagicMock())

    records = fetch_forum_predictions(
        [FIXTURE],
        reddit_client_id="id",
        reddit_client_secret="secret",
        gemini_api_key="key",
        quality_threshold=7,
        posts_per_subreddit=1,
    )
    assert records == []
