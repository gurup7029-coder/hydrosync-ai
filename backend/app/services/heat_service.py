"""
HeatShield AI Service Wrapper.
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from ml.heat_risk_model import analyze_heat_risk
from typing import Dict, Any

class HeatService:
    def evaluate(
        self,
        temperature_c: float,
        relative_humidity_pct: float,
        wind_speed_kmh: float = 0.0,
        solar_radiation_wm2: float = 0.0
    ) -> Dict[str, Any]:
        return analyze_heat_risk(
            temp_c=temperature_c,
            rh_pct=relative_humidity_pct,
            wind_speed_kmh=wind_speed_kmh,
            solar_radiation_wm2=solar_radiation_wm2
        )

heat_service = HeatService()
