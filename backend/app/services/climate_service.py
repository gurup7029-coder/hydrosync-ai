"""
Unified Climate Intelligence Service Wrapper.
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from ml.climate_prioritization import UnifiedPrioritizationEngine
from typing import Dict, Any

class ClimateService:
    def __init__(self):
        self.engine = UnifiedPrioritizationEngine()

    def prioritize(
        self,
        location_id: str,
        location_name: str,
        heat_severity: float,
        water_severity: float,
        vulnerability_score: float = 50.0,
        data_freshness_min: float = 2.0,
        sensor_confidence: float = 95.0
    ) -> Dict[str, Any]:
        return self.engine.calculate_priority(
            location_id=location_id,
            location_name=location_name,
            heat_severity=heat_severity,
            water_severity=water_severity,
            vulnerability_score=vulnerability_score,
            data_freshness_min=data_freshness_min,
            sensor_confidence=sensor_confidence
        )

climate_service = ClimateService()
