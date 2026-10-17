"""
Unit tests for AquaTrace Anomaly Detection and Loss Estimation.
"""

import pytest
import numpy as np
import pandas as pd
from ml.water_anomaly_detector import WaterAnomalyDetector

def test_water_detector_normal():
    detector = WaterAnomalyDetector()
    res = detector.predict_sample(
        flow_rate=80.5,
        pressure=4.22,
        baseline_flow=80.0,
        baseline_pressure=4.20
    )
    assert res["severity"] == "NORMAL"
    assert res["anomaly_detected"] is False
    assert res["estimated_loss_l_per_hr"] == 0.0

def test_water_detector_burst_leak():
    detector = WaterAnomalyDetector()
    # High flow surge + sharp pressure plunge
    res = detector.predict_sample(
        flow_rate=190.0,
        pressure=1.8,
        baseline_flow=80.0,
        baseline_pressure=4.20,
        recent_pressures=[4.1, 4.0, 3.8, 1.8],
        recent_flows=[80.0, 82.0, 85.0, 190.0]
    )
    assert res["anomaly_detected"] is True
    assert res["severity"] == "CRITICAL"
    assert res["estimated_loss_l_per_hr"] > 5000.0
    assert any("burst" in exp.lower() for exp in res["explanations"])

def test_sensor_health_check_flatline():
    detector = WaterAnomalyDetector()
    # Identical 5 readings = sensor flatline
    res = detector.predict_sample(
        flow_rate=75.0,
        pressure=4.0,
        recent_flows=[75.0, 75.0, 75.0, 75.0, 75.0]
    )
    assert res["sensor_health"]["status"] == "DEGRADED"
    assert "Flatline" in res["sensor_health"]["detail"]
