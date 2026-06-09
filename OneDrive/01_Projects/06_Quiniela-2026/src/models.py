from dataclasses import dataclass, field
from typing import Literal

@dataclass
class RecentForm:
    matches: int
    wins: int
    draws: int
    losses: int
    goals_scored_avg: float
    goals_conceded_avg: float

    def __post_init__(self):
        """Validate that match counts sum to total matches."""
        assert (
            self.wins + self.draws + self.losses == self.matches
        ), f"Match counts do not sum: {self.wins} + {self.draws} + {self.losses} != {self.matches}"

@dataclass
class TeamStats:
    team: str
    elo_rating: float  # Changed from int to float for type safety (e.g. 2100.5)
    fifa_rank: int
    recent_form: RecentForm
    squad_flags: list[str] = field(default_factory=list)

@dataclass
class PredictionRecord:
    source_id: str
    source_type: Literal["analyst", "informed_fan", "prediction_market"]
    source_url: str
    timestamp: str  # ISO 8601 format, e.g. "2026-06-07T10:00:00Z"
    prediction_type: Literal["group_match", "bracket", "winner", "golden_boot"]
    match_id: str
    team_a: str
    team_b: str
    outcome: Literal["W", "D", "L"]  # "W" = team_a wins, "D" = draw, "L" = team_a loses
    confidence_pct: float  # Probability on 0–1 scale (not 0–100)
    raw_text: str

@dataclass
class ConsensusRecord:
    match_id: str
    team_a: str
    team_b: str
    consensus_outcome: Literal["W", "D", "L"]  # "W" = team_a wins, "D" = draw, "L" = team_a loses
    confidence_tier: Literal["high", "medium", "low"]
    weighted_confidence: float
    source_count: int
    contrarian_flag: bool
    contrarian_detail: str = ""  # Optional detail about contrarian consensus (default empty string)

@dataclass
class MatchFixture:
    match_id: str
    group: str
    team_a: str
    team_b: str
    date: str  # Format: "YYYY-MM-DD"
