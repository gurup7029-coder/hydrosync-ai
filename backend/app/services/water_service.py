"""
AquaTrace Service Wrapper.
Integrates Isolation Forest model artifact and domain hydraulic baseline rules.
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from ml.water_anomaly_detector import WaterAnomalyDetector
from backend.app.config import settings
from typing import Dict, Any, List, Optional

class WaterService:
    def __init__(self):
        self.detector = WaterAnomalyDetector()
        artifact_path = settings.MODEL_ARTIFACT_PATH
        if os.path.exists(artifact_path):
            try:
                self.detector.load_model(artifact_path)
            except Exception:
                pass

    def evaluate(
        self,
        flow_rate: float,
        pressure: float,
        baseline_flow: float = 80.0,
        baseline_pressure: float = 4.2,
        inlet_flow: Optional[float] = None,
        outlet_flow: Optional[float] = None,
        recent_flows: Optional[List[float]] = None,
        recent_pressures: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        return self.detector.predict_sample(
            flow_rate=flow_rate,
            pressure=pressure,
            baseline_flow=baseline_flow,
            baseline_pressure=baseline_pressure,
            inlet_flow=inlet_flow,
            outlet_flow=outlet_flow,
            recent_flows=recent_flows,
            recent_pressures=recent_pressures
        )

water_service = WaterService()
