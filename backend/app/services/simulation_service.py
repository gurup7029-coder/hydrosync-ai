"""
Simulation Engine for Live Deterministic Demonstration.
Implements the 4 competition scenarios:
1. 'normal': Baseline seasonal climate & stable hydraulic conditions.
2. 'extreme_heat': Dangerous heatwave (42.5°C, 62% RH, Heat Index 58.6°C).
3. 'sudden_leak': Pipe rupture in DMA-Central (pressure drops to 1.8 bar, flow 188 LPM, ~6,480 L/h loss).
4. 'compound_crisis': Simultaneous heatwave + water main burst, crippling municipal cooling & medical centers.
"""

import time
from datetime import datetime, timezone
from typing import Dict, Any, List
from .heat_service import heat_service
from .water_service import water_service
from .climate_service import climate_service
from ..database import insert_alert, get_alerts

class SimulationEngine:
    def __init__(self):
        self.is_running = True
        self.current_scenario = "normal"
        self.tick_count = 0
        self.cumulative_water_loss_litres = 0.0
        self.locations = [
            {
                "id": "LOC-CTR",
                "name": "Central Downtown DMA",
                "lat": 28.6139,
                "lng": 77.2090,
                "vulnerability": 65.0,
                "critical_facility": "Metropolitan General Hospital"
            },
            {
                "id": "LOC-NORTH",
                "name": "North District DMA",
                "lat": 28.6500,
                "lng": 77.2200,
                "vulnerability": 45.0,
                "critical_facility": "North Transit Hub & High Schools"
            },
            {
                "id": "LOC-IND",
                "name": "Industrial Park DMA",
                "lat": 28.5800,
                "lng": 77.3000,
                "vulnerability": 40.0,
                "critical_facility": "Power Substation & Chemical Terminal"
            },
            {
                "id": "LOC-SOUTH",
                "name": "South Residential DMA",
                "lat": 28.5200,
                "lng": 77.1800,
                "vulnerability": 55.0,
                "critical_facility": "Senior Living Communities & Public Clinic"
            }
        ]

    def set_scenario(self, scenario: str):
        if scenario in ["normal", "extreme_heat", "sudden_leak", "compound_crisis"]:
            self.current_scenario = scenario
            self.tick_count = 0
            # Reset or adjust cumulative loss if normal
            if scenario in ["normal", "extreme_heat"]:
                self.cumulative_water_loss_litres = 0.0
            
            # Auto-generate contextual alert for the scenario
            self._generate_scenario_alerts(scenario)

    def _generate_scenario_alerts(self, scenario: str):
        now_str = datetime.now(timezone.utc).isoformat()
        if scenario == "extreme_heat":
            insert_alert({
                "alert_type": "HEAT_RISK",
                "location_id": "LOC-CTR",
                "location_name": "Central Downtown DMA",
                "severity": "CRITICAL",
                "title": "Severe Heatwave Emergency: Heat Index 58.6°C",
                "message": "Dangerous thermal index exceeds safe metabolic limits. Immediate cooling center activation required.",
                "status": "ACTIVE",
                "timestamp": now_str,
                "meta": {"scenario": scenario, "heat_index_c": 58.6}
            })
        elif scenario == "sudden_leak":
            insert_alert({
                "alert_type": "WATER_BURST",
                "location_id": "LOC-CTR",
                "location_name": "Central Downtown DMA",
                "severity": "CRITICAL",
                "title": "Sudden Pipeline Main Rupture Detected",
                "message": "Major pressure plunge to 1.8 bar with +135% flow surge. Estimated water loss: 6,480 L/hr.",
                "status": "ACTIVE",
                "timestamp": now_str,
                "meta": {"scenario": scenario, "loss_lph": 6480.0}
            })
        elif scenario == "compound_crisis":
            insert_alert({
                "alert_type": "COMPOUND_CRISIS",
                "location_id": "LOC-CTR",
                "location_name": "Central Downtown DMA",
                "severity": "CRITICAL",
                "title": "Compound Multi-Hazard Emergency (Heatwave + Main Rupture)",
                "message": "Simultaneous 43.5°C heat emergency and water distribution loss. Metropolitan General Hospital chillers at risk.",
                "status": "ACTIVE",
                "timestamp": now_str,
                "meta": {"scenario": scenario, "priority_score": 94.2}
            })

    def tick(self):
        if not self.is_running:
            return
        self.tick_count += 1
        
        # Accumulate water loss if in leak scenario
        if self.current_scenario in ["sudden_leak", "compound_crisis"]:
            # Ticking ~5s represents 5 minutes in demo time
            # 6,480 L/hr = 108 L/min => ~540 L per 5 min interval
            self.cumulative_water_loss_litres += 540.0

    def get_current_state(self) -> Dict[str, Any]:
        self.tick()
        
        # Determine telemetry based on scenario
        if self.current_scenario == "normal":
            temp_c = 27.8
            rh_pct = 52.0
            flow_lpm = 81.2
            pressure_bar = 4.22
            baseline_flow = 80.0
            baseline_pressure = 4.20
            loss_rate_lph = 0.0
            event_text = "System nominal: Weather benign, water network pressures balanced across all DMAs."
        
        elif self.current_scenario == "extreme_heat":
            temp_c = 42.5
            rh_pct = 62.0
            flow_lpm = 86.4  # Slightly elevated due to air conditioning / drinking demand
            pressure_bar = 4.08
            baseline_flow = 80.0
            baseline_pressure = 4.20
            loss_rate_lph = 0.0
            event_text = "HeatShield AI Triggered: Extreme danger heatwave. Urban thermal stress at peak."

        elif self.current_scenario == "sudden_leak":
            temp_c = 28.5
            rh_pct = 50.0
            flow_lpm = 188.0
            pressure_bar = 1.82
            baseline_flow = 80.0
            baseline_pressure = 4.20
            loss_rate_lph = 6480.0
            event_text = "AquaTrace Alert: High-confidence pipe fracture in Central Downtown DMA-01."

        else: # compound_crisis
            temp_c = 43.5
            rh_pct = 64.0
            flow_lpm = 195.2
            pressure_bar = 1.65
            baseline_flow = 80.0
            baseline_pressure = 4.20
            loss_rate_lph = 6912.0
            event_text = "CRITICAL MULTI-HAZARD: Coinciding deadly heat index (59.8°C) and water grid collapse."

        # Compute ML evaluations
        heat_res = heat_service.evaluate(
            temperature_c=temp_c,
            relative_humidity_pct=rh_pct,
            wind_speed_kmh=12.0,
            solar_radiation_wm2=750.0 if temp_c > 35 else 400.0
        )

        water_res = water_service.evaluate(
            flow_rate=flow_lpm,
            pressure=pressure_bar,
            baseline_flow=baseline_flow,
            baseline_pressure=baseline_pressure,
            inlet_flow=flow_lpm + 25.0 if self.current_scenario in ["sudden_leak", "compound_crisis"] else flow_lpm + 1.2,
            outlet_flow=flow_lpm - 15.0 if self.current_scenario in ["sudden_leak", "compound_crisis"] else flow_lpm - 0.8
        )

        # Multi-location ranking calculation
        location_rankings = []
        for loc in self.locations:
            is_target_dma = (loc["id"] == "LOC-CTR")
            
            loc_heat_sev = heat_res["classification"]["severity_score"]
            if not is_target_dma:
                # Other locations experience slightly milder localized conditions
                loc_heat_sev = max(10.0, loc_heat_sev - 8.0)
                loc_water_sev = 12.0
            else:
                loc_water_sev = 88.0 if self.current_scenario in ["sudden_leak", "compound_crisis"] else 8.0

            loc_priority = climate_service.prioritize(
                location_id=loc["id"],
                location_name=loc["name"],
                heat_severity=loc_heat_sev,
                water_severity=loc_water_sev,
                vulnerability_score=loc["vulnerability"],
                data_freshness_min=1.2,
                sensor_confidence=98.0
            )
            loc_priority["lat"] = loc["lat"]
            loc_priority["lng"] = loc["lng"]
            loc_priority["critical_facility"] = loc["critical_facility"]
            location_rankings.append(loc_priority)

        # Sort by unified priority score descending
        location_rankings.sort(key=lambda x: x["unified_priority_score"], reverse=True)

        # Get overall community score (top ranked location)
        top_priority = location_rankings[0]

        active_alerts = get_alerts(status="ACTIVE", limit=10)

        return {
            "is_simulated": True,
            "scenario": self.current_scenario,
            "tick": self.tick_count,
            "telemetry": {
                "temperature_c": temp_c,
                "relative_humidity_pct": rh_pct,
                "flow_rate_lpm": flow_lpm,
                "pressure_bar": pressure_bar,
                "loss_rate_lph": loss_rate_lph,
                "cumulative_water_loss_litres": round(self.cumulative_water_loss_litres, 1)
            },
            "heat_analysis": heat_res,
            "water_analysis": water_res,
            "top_priority": top_priority,
            "location_rankings": location_rankings,
            "active_alerts": active_alerts,
            "latest_event": event_text,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

simulation_engine = SimulationEngine()
