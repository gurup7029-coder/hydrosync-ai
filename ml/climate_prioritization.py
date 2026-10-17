"""
Unified Climate Intelligence & Decision Prioritization Engine.

Methodology:
Synthesizes concurrent thermal stress (HeatShield AI) and water distribution failure (AquaTrace)
with local vulnerability indicators to provide explainable municipal priority ranking.

Mathematical Formulation:
Composite Priority Score (P) ∈ [0, 100]:
P = (w_heat * S_heat + w_water * S_water + w_vuln * S_vuln + Compound_Bonus) * Freshness_Factor

Where:
- w_heat: 0.35 (Heat severity weight)
- w_water: 0.40 (Water loss & anomaly severity weight)
- w_vuln: 0.15 (Local demographic & critical infrastructure vulnerability)
- Compound_Bonus: Non-linear escalation (+10 to +15 pts) when BOTH extreme heat (S_heat >= 70)
  and severe water main breach (S_water >= 70) occur simultaneously, recognizing that water loss
  during a deadly heatwave cripples cooling centers, hospital chillers, and firefighting reserves.
- Freshness_Factor ∈ [0.85, 1.0] penalizing stale or interrupted sensor telemetry.
"""

from typing import Dict, Any, List

class UnifiedPrioritizationEngine:
    def __init__(
        self,
        weight_heat: float = 0.35,
        weight_water: float = 0.40,
        weight_vuln: float = 0.15,
        compound_bonus_max: float = 10.0
    ):
        self.w_heat = weight_heat
        self.w_water = weight_water
        self.w_vuln = weight_vuln
        self.compound_bonus_max = compound_bonus_max

    def calculate_priority(
        self,
        location_id: str,
        location_name: str,
        heat_severity: float,          # 0 - 100
        water_severity: float,         # 0 - 100
        vulnerability_score: float = 50.0,  # 0 - 100 (demographics, elderly density, hospital proximity)
        data_freshness_min: float = 2.0,   # minutes since last packet
        sensor_confidence: float = 95.0    # 0 - 100
    ) -> Dict[str, Any]:
        """
        Compute transparent multi-hazard priority score.
        """
        # Telemetry freshness factor: penalty after 30 minutes of stale data
        freshness_factor = 1.0
        if data_freshness_min > 60:
            freshness_factor = 0.85
        elif data_freshness_min > 30:
            freshness_factor = 0.92

        # Base weighted sum
        base_score = (
            (self.w_heat * heat_severity) +
            (self.w_water * water_severity) +
            (self.w_vuln * vulnerability_score)
        )

        # Compound hazard synergy bonus:
        # A simultaneous heatwave and water main burst poses exponential public health risk.
        compound_bonus = 0.0
        is_compound_crisis = False
        if heat_severity >= 65.0 and water_severity >= 65.0:
            is_compound_crisis = True
            severity_factor = ((heat_severity - 65.0) / 35.0 + (water_severity - 65.0) / 35.0) / 2.0
            compound_bonus = round(10.0 + 6.0 * severity_factor, 1)

        raw_score = (base_score + compound_bonus) * freshness_factor
        final_score = round(max(0.0, min(100.0, raw_score)), 1)

        # Priority Tier
        if final_score >= 80.0 or (is_compound_crisis and final_score >= 75.0):
            priority_tier = "CRITICAL"
            color = "#ef4444"
            action = "Immediate multi-agency emergency deployment: Dispatch water repair crews and activate emergency cooling shelters."
        elif final_score >= 65.0:
            priority_tier = "HIGH"
            color = "#f97316"
            action = "Priority municipal dispatch: Investigate anomaly within 60 minutes and monitor regional cooling demand."
        elif final_score >= 40.0:
            priority_tier = "MODERATE"
            color = "#eab308"
            action = "Scheduled inspection: Monitor hydraulic pressure trends and distribute public heat advisories."
        else:
            priority_tier = "LOW"
            color = "#10b981"
            action = "Routine telemetry observation: Systems operating within nominal stability parameters."

        # Factor Contributions for Transparency
        contributions = {
            "heat_contribution_pts": round(self.w_heat * heat_severity * freshness_factor, 1),
            "water_contribution_pts": round(self.w_water * water_severity * freshness_factor, 1),
            "vulnerability_contribution_pts": round(self.w_vuln * vulnerability_score * freshness_factor, 1),
            "compound_synergy_bonus_pts": round(compound_bonus * freshness_factor, 1),
            "data_freshness_factor": freshness_factor
        }

        # Comparison Mode: Single-Silo vs Unified
        heat_only_priority = round(min(100.0, heat_severity * 0.85 + vulnerability_score * 0.15), 1)
        water_only_priority = round(min(100.0, water_severity * 0.85 + vulnerability_score * 0.15), 1)

        justifications = []
        if is_compound_crisis:
            justifications.append(
                "COMPOUND CRISIS DETECTED: Concurrent heatwave and water supply disruption mutually exacerbate community heat exhaustion and firefighting readiness."
            )
        if water_severity >= 70.0:
            justifications.append(f"Significant hydraulic anomaly in {location_name} requiring rapid acoustic/valving verification.")
        if heat_severity >= 70.0:
            justifications.append(f"Severe thermal hazard index in {location_name} threatening vulnerable demographics.")

        if not justifications:
            justifications.append("Telemetry metrics currently within baseline operational thresholds.")

        return {
            "location_id": location_id,
            "location_name": location_name,
            "unified_priority_score": final_score,
            "priority_tier": priority_tier,
            "color": color,
            "recommended_action": action,
            "is_compound_crisis": is_compound_crisis,
            "contributions": contributions,
            "comparison_mode": {
                "heat_only_score": heat_only_priority,
                "water_only_score": water_only_priority,
                "unified_score": final_score,
                "unified_lift_delta": round(final_score - max(heat_only_priority, water_only_priority), 1)
            },
            "justifications": justifications,
            "uncertainty_index": round(max(5.0, (100.0 - sensor_confidence) * 0.5 + (1.0 - freshness_factor) * 50.0), 1)
        }
