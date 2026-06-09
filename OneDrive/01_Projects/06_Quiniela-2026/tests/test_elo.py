from unittest.mock import MagicMock
from src.stats.elo import fetch_elo_ratings

SAMPLE_HTML = """
<html><body>
<table>
  <tr><td>1</td><td><a href="/brazil">Brazil</a></td><td>2089</td></tr>
  <tr><td>2</td><td><a href="/spain">Spain</a></td><td>2048</td></tr>
  <tr><td>3</td><td><a href="/france">France</a></td><td>2005</td></tr>
</table>
</body></html>
"""

def test_fetch_elo_ratings_parses_html(mocker):
    mock_resp = MagicMock()
    mock_resp.text = SAMPLE_HTML
    mock_resp.raise_for_status = MagicMock()
    mocker.patch("src.stats.elo.requests.get", return_value=mock_resp)

    ratings = fetch_elo_ratings()
    assert ratings["Brazil"] == 2089
    assert ratings["Spain"] == 2048
    assert ratings["France"] == 2005

def test_fetch_elo_ratings_handles_comma_formatted_rating(mocker):
    html = """<html><body><table>
      <tr><td>1</td><td><a href="/brazil">Brazil</a></td><td>2,089</td></tr>
    </table></body></html>"""
    mock_resp = MagicMock()
    mock_resp.text = html
    mock_resp.raise_for_status = MagicMock()
    mocker.patch("src.stats.elo.requests.get", return_value=mock_resp)
    ratings = fetch_elo_ratings()
    assert ratings["Brazil"] == 2089.0

def test_fetch_elo_ratings_skips_non_numeric_rating(mocker):
    html = """<html><body><table>
      <tr><td>1</td><td><a href="/brazil">Brazil</a></td><td>N/A</td></tr>
      <tr><td>2</td><td><a href="/spain">Spain</a></td><td>2048</td></tr>
    </table></body></html>"""
    mock_resp = MagicMock()
    mock_resp.text = html
    mock_resp.raise_for_status = MagicMock()
    mocker.patch("src.stats.elo.requests.get", return_value=mock_resp)
    ratings = fetch_elo_ratings()
    assert "Brazil" not in ratings
    assert ratings["Spain"] == 2048.0

def test_fetch_elo_ratings_returns_empty_on_network_error(mocker):
    import requests as req_lib
    mocker.patch("src.stats.elo.requests.get",
                 side_effect=req_lib.exceptions.ConnectionError("down"))
    ratings = fetch_elo_ratings()
    assert ratings == {}
