"""
Unit tests for HeatShield AI mathematical formulas and categorization.
"""

import pytest
import math
from ml.heat_risk_model import calculate_heat_index, calculate_wet_bulb_temperature, classify_heat_risk, analyze_heat_risk

def test_calculate_wet_bulb():
    # At 30°C and 50% RH, wet bulb is approximately 22°C - 23°C
    tw = calculate_wet_bulb_temperature(30.0, 50.0)
    assert 21.0 <= tw <= 24.0

def test_calculate_heat_index_low():
    # Low temperature: should be close to ambient
    hi = calculate_heat_index(22.0, 45.0)
    assert 20.0 <= hi <= 24.0

def test_calculate_heat_index_extreme():
    # 42°C and 60% RH produces extreme heat index > 55°C
    hi = calculate_heat_index(42.0, 60.0)
    assert hi > 54.0

def test_classify_heat_risk_categories():
    low_res = classify_heat_risk(25.0, 18.0)
    assert low_res["category"] == "Low / Normal"
    assert low_res["level"] == 1

    caution_res = classify_heat_risk(30.0, 22.0)
    assert caution_res["category"] == "Caution"
    assert caution_res["level"] == 2

    danger_res = classify_heat_risk(45.0, 28.0)
    assert danger_res["category"] == "Danger"
    assert danger_res["level"] == 4

    extreme_res = classify_heat_risk(58.0, 32.0)
    assert extreme_res["category"] == "Extreme Danger"
    assert extreme_res["level"] == 5
    assert extreme_res["wet_bulb_alert"] is not None

def test_analyze_heat_risk_full():
    res = analyze_heat_risk(38.0, 65.0, wind_speed_kmh=15.0)
    assert "classification" in res
    assert "explainability" in res
    assert "disclaimer" in res
    assert res["classification"]["severity_score"] > 60.0
