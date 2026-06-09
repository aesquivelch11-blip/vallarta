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

@dataclass
class TeamStats:
    team: str
    elo_rating: int
    fifa_rank: int
    recent_form: RecentForm
    squad_flags: list[str] = field(default_factory=list)

@dataclass
class PredictionRecord:
    source_id: str
    source_type: Literal["analyst", "informed_fan", "prediction_market"]
    source_url: str
    timestamp: str
    prediction_type: Literal["group_match", "bracket", "winner", "golden_boot"]
    match_id: str
    team_a: str
    team_b: str
    outcome: Literal["W", "D", "L"]
    confidence_pct: float
    raw_text: str

@dataclass
class ConsensusRecord:
    match_id: str
    team_a: str
    team_b: str
    consensus_outcome: Literal["W", "D", "L"]
    confidence_tier: Literal["high", "medium", "low"]
    weighted_confidence: float
    source_count: int
    contrarian_flag: bool
    contrarian_detail: str

@dataclass
class MatchFixture:
    match_id: str
    group: str
    team_a: str
    team_b: str
    date: str
