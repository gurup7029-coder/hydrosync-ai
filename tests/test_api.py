"""
Integration tests for FastAPI application endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "linuxone_compatible" in data
    assert data["service"] == "HYDROSYNC AI"

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "overall_community_risk_score" in data
    assert "current_heat_risk_level" in data
    assert "water_network_status" in data
    assert "monitored_locations_count" in data

def test_heat_analyze_api():
    payload = {
        "temperature_c": 36.5,
        "relative_humidity_pct": 60.0,
        "wind_speed_kmh": 10.0
    }
    response = client.post("/api/heat/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["heat_index_c"] > 40.0
    assert "recommendations" in data["classification"]

def test_water_analyze_api():
    payload = {
        "flow_rate": 185.0,
        "pressure": 1.9,
        "baseline_flow": 80.0,
        "baseline_pressure": 4.2
    }
    response = client.post("/api/water/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["anomaly_detected"] is True
    assert data["estimated_loss_l_per_hr"] > 0

def test_climate_prioritize_api():
    payload = {
        "location_id": "LOC-CTR",
        "location_name": "Central District",
        "heat_severity": 80.0,
        "water_severity": 85.0,
        "vulnerability_score": 60.0
    }
    response = client.post("/api/climate/prioritize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["unified_priority_score"] >= 70.0
    assert "comparison_mode" in data

def test_simulation_scenario_switch():
    response = client.post("/api/simulation/scenario", json={"scenario": "extreme_heat"})
    assert response.status_code == 200
    assert response.json()["scenario"] == "extreme_heat"

    status_resp = client.get("/api/simulation/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["scenario"] == "extreme_heat"

def test_models_metrics_endpoint():
    response = client.get("/api/models/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "aquatrace_water_model" in data
    assert "heatshield_ai_model" in data
    assert data["aquatrace_water_model"]["metrics"]["f1_score"] > 0.8
