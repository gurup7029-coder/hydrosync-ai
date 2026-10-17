"""
Unified Climate Intelligence Router.
Provides multi-hazard prioritization, explainable factor ranking, and single-silo vs unified comparison.
"""

from fastapi import APIRouter, HTTPException
from ..schemas import ClimatePrioritizationRequest, ClimatePrioritizationResponse
from ..services.climate_service import climate_service
from ..services.simulation_service import simulation_engine

router = APIRouter()

@router.post("/climate/prioritize", response_model=ClimatePrioritizationResponse)
def prioritize_sector(req: ClimatePrioritizationRequest):
    try:
        result = climate_service.prioritize(
            location_id=req.location_id,
            location_name=req.location_name,
            heat_severity=req.heat_severity,
            water_severity=req.water_severity,
            vulnerability_score=req.vulnerability_score or 50.0,
            data_freshness_min=req.data_freshness_min or 2.0,
            sensor_confidence=req.sensor_confidence or 95.0
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prioritization calculation error: {str(e)}")

@router.get("/climate/rankings")
def get_climate_rankings():
    state = simulation_engine.get_current_state()
    return {
        "scenario": state["scenario"],
        "top_priority": state["top_priority"],
        "rankings": state["location_rankings"],
        "total_monitored": len(state["location_rankings"])
    }
