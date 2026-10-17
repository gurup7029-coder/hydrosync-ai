"""
Unit tests for Unified Climate Intelligence Prioritization Engine.
"""

import pytest
from ml.climate_prioritization import UnifiedPrioritizationEngine

def test_prioritization_engine_normal():
    engine = UnifiedPrioritizationEngine()
    res = engine.calculate_priority(
        location_id="LOC-01",
        location_name="North District",
        heat_severity=20.0,
        water_severity=15.0,
        vulnerability_score=40.0
    )
    assert res["priority_tier"] == "LOW"
    assert res["is_compound_crisis"] is False
    assert res["unified_priority_score"] < 40.0

def test_prioritization_engine_compound_crisis():
    engine = UnifiedPrioritizationEngine()
    # High heat (85) and High water burst (90)
    res = engine.calculate_priority(
        location_id="LOC-01",
        location_name="Downtown Metro",
        heat_severity=85.0,
        water_severity=90.0,
        vulnerability_score=75.0
    )
    assert res["is_compound_crisis"] is True
    assert res["priority_tier"] == "CRITICAL"
    assert res["unified_priority_score"] >= 80.0
    assert res["contributions"]["compound_synergy_bonus_pts"] > 0
    # Demonstrates unified priority lift over single-silo
    assert res["comparison_mode"]["unified_score"] >= res["comparison_mode"]["heat_only_score"]
