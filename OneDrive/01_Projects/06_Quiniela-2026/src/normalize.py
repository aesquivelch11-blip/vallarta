# src/normalize.py
from dataclasses import replace
from src.models import PredictionRecord

def normalize_predictions(records: list[PredictionRecord]) -> list[PredictionRecord]:
    """Deduplicate by source_id+match_id+outcome. Clip confidence to [0, 1]."""
    seen: set[str] = set()
    result: list[PredictionRecord] = []
    for r in records:
        key = f"{r.source_id}|{r.match_id}|{r.outcome}"
        if key in seen:
            continue
        seen.add(key)
        clipped = min(1.0, max(0.0, r.confidence_pct))
        if clipped != r.confidence_pct:
            r = replace(r, confidence_pct=clipped)
        result.append(r)
    return result
