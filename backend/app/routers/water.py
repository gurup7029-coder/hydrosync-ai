"""
AquaTrace API Endpoints for Water Network Anomaly & Leak Detection.
"""

from fastapi import APIRouter, HTTPException
from ..schemas import WaterAnalysisRequest, WaterAnalysisResponse
from ..services.water_service import water_service
from ..services.simulation_service import simulation_engine

router = APIRouter()

@router.post("/water/analyze", response_model=WaterAnalysisResponse)
def analyze_water_network(req: WaterAnalysisRequest):
    try:
        result = water_service.evaluate(
            flow_rate=req.flow_rate,
            pressure=req.pressure,
            baseline_flow=req.baseline_flow or 80.0,
            baseline_pressure=req.baseline_pressure or 4.2,
            inlet_flow=req.inlet_flow,
            outlet_flow=req.outlet_flow,
            recent_flows=req.recent_flows,
            recent_pressures=req.recent_pressures
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Hydraulic anomaly calculation error: {str(e)}")

@router.get("/water/sensors")
def get_sensor_network():
    state = simulation_engine.get_current_state()
    water_eval = state["water_analysis"]
    telemetry = state["telemetry"]

    # Provide district status for network visualization
    return {
        "network_status": water_eval["severity"],
        "estimated_total_loss_litres": telemetry["cumulative_water_loss_litres"],
        "estimated_loss_rate_lph": telemetry["loss_rate_lph"],
        "sensors": [
            {
                "sensor_id": "SEN-DMA-01",
                "dma": "Central Downtown DMA",
                "location_id": "LOC-CTR",
                "flow_rate_lpm": telemetry["flow_rate_lpm"],
                "pressure_bar": telemetry["pressure_bar"],
                "status": water_eval["severity"],
                "anomaly_score": water_eval["anomaly_score"],
                "health": water_eval["sensor_health"]["status"]
            },
            {
                "sensor_id": "SEN-DMA-02",
                "dma": "North District DMA",
                "location_id": "LOC-NORTH",
                "flow_rate_lpm": 84.5,
                "pressure_bar": 4.18,
                "status": "NORMAL",
                "anomaly_score": 0.12,
                "health": "HEALTHY"
            },
            {
                "sensor_id": "SEN-DMA-03",
                "dma": "Industrial Park DMA",
                "location_id": "LOC-IND",
                "flow_rate_lpm": 96.0,
                "pressure_bar": 4.35,
                "status": "NORMAL",
                "anomaly_score": 0.15,
                "health": "HEALTHY"
            },
            {
                "sensor_id": "SEN-DMA-04",
                "dma": "South Residential DMA",
                "location_id": "LOC-SOUTH",
                "flow_rate_lpm": 66.2,
                "pressure_bar": 3.92,
                "status": "NORMAL",
                "anomaly_score": 0.18,
                "health": "HEALTHY"
            }
        ]
    }
