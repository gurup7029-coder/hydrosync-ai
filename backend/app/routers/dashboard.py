"""
Dashboard Summary Router.
Aggregates key metrics for the unified climate decision control center.
"""

from fastapi import APIRouter
from ..services.simulation_service import simulation_engine
from ..database import get_alerts

router = APIRouter()

@router.get("/dashboard/summary")
def get_dashboard_summary():
    state = simulation_engine.get_current_state()
    top_p = state["top_priority"]
    heat_analysis = state["heat_analysis"]
    water_analysis = state["water_analysis"]
    telemetry = state["telemetry"]
    active_alerts = get_alerts(status="ACTIVE")

    return {
        "overall_community_risk_score": top_p["unified_priority_score"],
        "overall_risk_level": top_p["priority_tier"],
        "overall_color": top_p["color"],
        "recommended_action": top_p["recommended_action"],
        "current_heat_risk_level": heat_analysis["classification"]["category"],
        "heat_index_c": heat_analysis["heat_index_c"],
        "temperature_c": telemetry["temperature_c"],
        "relative_humidity_pct": telemetry["relative_humidity_pct"],
        "water_network_status": water_analysis["severity"],
        "flow_rate_lpm": telemetry["flow_rate_lpm"],
        "pressure_bar": telemetry["pressure_bar"],
        "estimated_water_loss_litres": telemetry["cumulative_water_loss_litres"],
        "estimated_water_loss_rate_lph": telemetry["loss_rate_lph"],
        "active_alerts_count": len(active_alerts),
        "monitored_locations_count": len(state["location_rankings"]),
        "recent_events": [
            state["latest_event"],
            f"Prioritized sector: {top_p['location_name']} (Priority Score: {top_p['unified_priority_score']}/100)",
            f"Hydraulic sensor health: {water_analysis['sensor_health']['status']}"
        ],
        "location_rankings": state["location_rankings"],
        "is_simulated": True,
        "current_scenario": state["scenario"]
    }
