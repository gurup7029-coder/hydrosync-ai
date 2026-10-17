"""
HeatShield AI - Scientific Heat Risk Calculation and Safety Advisory Engine.

Methodology:
- National Oceanic and Atmospheric Administration (NOAA) / Rothfusz Regression for Heat Index.
- Stull Formula for Wet-Bulb Temperature (Twb) estimation from dry-bulb temperature and relative humidity.
- Categorization aligned with National Weather Service (NWS) and NIOSH Occupational Safety thresholds.
- Actionable preventive guidance and feature attribution.
"""

import math
from typing import Dict, Any, List

def calculate_wet_bulb_temperature(temp_c: float, rh_pct: float) -> float:
    """
    Estimate Wet-Bulb Temperature (Twb in °C) using Stull's empirical formula.
    Valid for RH between 5% and 99%, and temperatures between -20°C and 50°C.
    """
    t = temp_c
    rh = max(1.0, min(99.0, rh_pct))
    
    tw = (
        t * math.atan(0.151977 * math.sqrt(rh + 8.313659))
        + math.atan(t + rh)
        - math.atan(rh - 1.676331)
        + 0.00391838 * (rh ** 1.5) * math.atan(0.023101 * rh)
        - 4.686035
    )
    return round(tw, 2)


def calculate_heat_index(temp_c: float, rh_pct: float) -> float:
    """
    Calculate the Heat Index (°C) based on NOAA NWS Rothfusz polynomial equation.
    Converts to Fahrenheit for calculation and back to Celsius.
    """
    rh = max(0.0, min(100.0, rh_pct))
    t_f = (temp_c * 9.0 / 5.0) + 32.0

    # Steadman's preliminary simple formula
    hi_simple = 0.5 * (t_f + 61.0 + ((t_f - 68.0) * 1.2) + (rh * 0.094))
    
    if hi_simple < 80.0:
        hi_f = hi_simple
    else:
        # Full Rothfusz regression equation
        hi_f = (
            -42.379
            + 2.04901523 * t_f
            + 10.14333127 * rh
            - 0.22475541 * t_f * rh
            - 0.00683783 * (t_f ** 2)
            - 0.05481717 * (rh ** 2)
            + 0.00122874 * (t_f ** 2) * rh
            + 0.00085282 * t_f * (rh ** 2)
            - 0.00000199 * (t_f ** 2) * (rh ** 2)
        )
        
        # Adjustments if applicable
        if rh < 13.0 and 80.0 <= t_f <= 112.0:
            adj = ((13.0 - rh) / 4.0) * math.sqrt((17.0 - abs(t_f - 95.0)) / 17.0)
            hi_f -= adj
        elif rh > 85.0 and 80.0 <= t_f <= 87.0:
            adj = ((rh - 85.0) / 10.0) * ((87.0 - t_f) / 5.0)
            hi_f += adj

    # Convert back to Celsius
    hi_c = (hi_f - 32.0) * 5.0 / 9.0
    return round(hi_c, 2)


def classify_heat_risk(heat_index_c: float, wet_bulb_c: float) -> Dict[str, Any]:
    """
    Assign standard NWS risk categories and health recommendations.
    """
    if heat_index_c < 27.0:
        category = "Low / Normal"
        severity_score = min(25.0, max(5.0, (heat_index_c / 27.0) * 25.0))
        color = "#10b981"  # Emerald
        level = 1
        description = "Minimal thermal stress for general population during ordinary activities."
        recommendations = [
            "Normal hydration routines recommended.",
            "Standard outdoor activity is safe for all age groups.",
            "Monitor municipal temperature forecasts for sudden shifts."
        ]
    elif heat_index_c < 32.0:
        category = "Caution"
        severity_score = 25.0 + ((heat_index_c - 27.0) / 5.0) * 25.0
        color = "#eab308"  # Yellow/Amber
        level = 2
        description = "Fatigue possible with prolonged exposure and sustained physical exertion."
        recommendations = [
            "Maintain consistent hydration (200-250 mL water per hour of light exertion).",
            "Take scheduled rest breaks in shaded or ventilated areas.",
            "Check on elderly individuals and pets."
        ]
    elif heat_index_c < 41.0:
        category = "Extreme Caution"
        severity_score = 50.0 + ((heat_index_c - 32.0) / 9.0) * 25.0
        color = "#f97316"  # Orange
        level = 3
        description = "Heat cramps and heat exhaustion possible with prolonged exposure."
        recommendations = [
            "Drink at least 500 mL water per hour of outdoor activity.",
            "Limit intense direct sun exposure between 11:00 AM and 4:00 PM.",
            "Activate municipal shaded misting stations and hydration points.",
            "Workplace supervisors should enforce 15-minute rest rotations."
        ]
    elif heat_index_c < 54.0:
        category = "Danger"
        severity_score = 75.0 + ((heat_index_c - 41.0) / 13.0) * 20.0
        color = "#ef4444"  # Red
        level = 4
        description = "Heat cramps or exhaustion likely; heat stroke possible with continued activity."
        recommendations = [
            "Curtail strenuous outdoor labor; schedule critical tasks before 09:00 AM.",
            "Open public air-conditioned cooling centers.",
            "Ensure emergency medical services (EMS) are on elevated alert for heat exhaustion calls.",
            "Advise vulnerable residents to stay indoors with active ventilation."
        ]
    else:
        category = "Extreme Danger"
        severity_score = min(100.0, 95.0 + ((heat_index_c - 54.0) / 6.0) * 5.0)
        color = "#b91c1c"  # Dark Red
        level = 5
        description = "Heat stroke imminent with prolonged exposure. Life-threatening conditions."
        recommendations = [
            "Issue high-priority municipal heat emergency broadcast.",
            "Suspend all non-essential outdoor construction and municipal maintenance.",
            "Deploy mobile emergency hydration units to public transit hubs.",
            "Direct welfare checks for isolated elderly and unhoused populations."
        ]

    # Additional check: Wet-Bulb threshold warning (human physiological survivability limit ~35°C Twb)
    wet_bulb_alert = None
    if wet_bulb_c >= 31.0:
        wet_bulb_alert = "CRITICAL: Wet-bulb temperature exceeds 31°C. Evaporative sweat cooling severely impaired."
    elif wet_bulb_c >= 28.0:
        wet_bulb_alert = "ELEVATED: Wet-bulb temperature exceeds 28°C. Sweating efficiency diminished."

    return {
        "category": category,
        "level": level,
        "severity_score": round(severity_score, 1),
        "color": color,
        "description": description,
        "recommendations": recommendations,
        "wet_bulb_alert": wet_bulb_alert
    }


def analyze_heat_risk(temp_c: float, rh_pct: float, wind_speed_kmh: float = 0.0, solar_radiation_wm2: float = 0.0) -> Dict[str, Any]:
    """
    Comprehensive heat-risk evaluation with factor breakdown and explainability.
    """
    heat_index_c = calculate_heat_index(temp_c, rh_pct)
    wet_bulb_c = calculate_wet_bulb_temperature(temp_c, rh_pct)
    classification = classify_heat_risk(heat_index_c, wet_bulb_c)
    
    # Feature attribution breakdown
    temp_contrib = round(temp_c, 1)
    humidity_delta = round(heat_index_c - temp_c, 2)
    
    # Wind cooling effect indicator (advisory)
    wind_effect = "Neutral"
    if wind_speed_kmh > 20.0 and temp_c < 36.0:
        wind_effect = "Mild convective cooling (-0.5°C to -1.2°C perceived)"
    elif wind_speed_kmh > 20.0 and temp_c >= 38.0:
        wind_effect = "Hot convective wind exacerbating body heat gain"

    return {
        "temperature_c": temp_c,
        "relative_humidity_pct": rh_pct,
        "heat_index_c": heat_index_c,
        "wet_bulb_c": wet_bulb_c,
        "wind_speed_kmh": wind_speed_kmh,
        "solar_radiation_wm2": solar_radiation_wm2,
        "classification": classification,
        "explainability": {
            "ambient_baseline_c": temp_contrib,
            "humidity_amplification_c": humidity_delta,
            "wind_interaction": wind_effect,
            "primary_driver": "High Humidity Magnification" if humidity_delta > 3.0 else "Ambient Heat Dominance"
        },
        "disclaimer": "HeatShield AI advisory decision-support metric only. Not a medical diagnostic device or official emergency declaration."
    }
