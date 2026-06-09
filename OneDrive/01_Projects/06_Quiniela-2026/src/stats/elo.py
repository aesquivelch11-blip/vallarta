import requests
from bs4 import BeautifulSoup

ELO_URL = "http://www.eloratings.net/"

def fetch_elo_ratings() -> dict[str, float]:
    """Scrape eloratings.net. Returns {team_name: elo_rating}."""
    resp = requests.get(ELO_URL, timeout=15,
                        headers={"User-Agent": "quiniela2026/1.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    ratings: dict[str, float] = {}
    for row in soup.select("table tr"):
        cells = row.find_all("td")
        if len(cells) < 3:
            continue
        team_cell = cells[1].find("a")
        rating_cell = cells[2]
        if team_cell and rating_cell:
            team = team_cell.get_text(strip=True)
            try:
                rating = float(rating_cell.get_text(strip=True).replace(",", ""))
                ratings[team] = rating
            except ValueError:
                continue
    return ratings
