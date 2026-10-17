"""
Simulation Control API Router.
Controls the 4 live demonstration scenarios with Start, Pause, and Reset functionality.
"""

from fastapi import APIRouter
from ..schemas import SimulationScenarioRequest
from ..services.simulation_service import simulation_engine

router = APIRouter()

@router.post("/simulation/start")
def start_simulation():
    simulation_engine.is_running = True
    return {"status": "SUCCESS", "message": "Simulation stream resumed.", "is_running": True}

@router.post("/simulation/pause")
def pause_simulation():
    simulation_engine.is_running = False
    return {"status": "SUCCESS", "message": "Simulation stream paused.", "is_running": False}

@router.post("/simulation/reset")
def reset_simulation():
    simulation_engine.set_scenario("normal")
    simulation_engine.is_running = True
    return {"status": "SUCCESS", "message": "Simulation reset to baseline normal conditions.", "scenario": "normal"}

@router.post("/simulation/scenario")
def set_scenario(req: SimulationScenarioRequest):
    simulation_engine.set_scenario(req.scenario)
    return {
        "status": "SUCCESS",
        "scenario": req.scenario,
        "message": f"Switched live simulation scenario to '{req.scenario}'."
    }

@router.get("/simulation/status")
def get_simulation_status():
    return simulation_engine.get_current_state()
