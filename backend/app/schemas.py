"""
Pydantic Schemas for Request Validation and Typed API Responses.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# HeatShield AI Schemas
class HeatAnalysisRequest(BaseModel):
    temperature_c: float = Field(..., description="Air temperature in Celsius")
    relative_humidity_pct: float = Field(..., ge=0.0, le=100.0, description="Relative Humidity percentage (0-100)")
    wind_speed_kmh: Optional[float] = Field(0.0, ge=0.0, description="Wind speed in km/h")
    solar_radiation_wm2: Optional[float] = Field(0.0, ge=0.0, description="Solar irradiance W/m^2")
    location_id: Optional[str] = "LOC-DEFAULT"

class HeatClassification(BaseModel):
    category: str
    level: int
    severity_score: float
    color: str
    description: str
    recommendations: List[str]
    wet_bulb_alert: Optional[str] = None

class HeatAnalysisResponse(BaseModel):
    temperature_c: float
    relative_humidity_pct: float
    heat_index_c: float
    wet_bulb_c: float
    wind_speed_kmh: float
    solar_radiation_wm2: float
    classification: HeatClassification
    explainability: Dict[str, Any]
    disclaimer: str

# AquaTrace Schemas
class WaterAnalysisRequest(BaseModel):
    flow_rate: float = Field(..., ge=0.0, description="Current flow rate in L/min")
    pressure: float = Field(..., ge=0.0, description="Current water pressure in bar")
    baseline_flow: Optional[float] = Field(80.0, description="Expected normal flow rate")
    baseline_pressure: Optional[float] = Field(4.2, description="Expected normal pressure in bar")
    inlet_flow: Optional[float] = None
    outlet_flow: Optional[float] = None
    sensor_id: Optional[str] = "SEN-01"
    location_id: Optional[str] = "LOC-DMA-01"
    recent_flows: Optional[List[float]] = None
    recent_pressures: Optional[List[float]] = None

class SensorHealth(BaseModel):
    status: str
    detail: str

class WaterAnalysisResponse(BaseModel):
    flow_rate_lpm: float
    pressure_bar: float
    baseline_flow_lpm: float
    baseline_pressure_bar: float
    anomaly_detected: bool
    anomaly_score: float
    confidence_pct: float
    severity: str
    estimated_loss_l_per_hr: float
    sensor_health: SensorHealth
    explanations: List[str]
    assumptions: str

# Unified Climate Intelligence Schemas
class ClimatePrioritizationRequest(BaseModel):
    location_id: str
    location_name: str
    heat_severity: float = Field(..., ge=0.0, le=100.0)
    water_severity: float = Field(..., ge=0.0, le=100.0)
    vulnerability_score: Optional[float] = Field(50.0, ge=0.0, le=100.0)
    data_freshness_min: Optional[float] = Field(2.0, ge=0.0)
    sensor_confidence: Optional[float] = Field(95.0, ge=0.0, le=100.0)

class ComparisonMode(BaseModel):
    heat_only_score: float
    water_only_score: float
    unified_score: float
    unified_lift_delta: float

class ClimatePrioritizationResponse(BaseModel):
    location_id: str
    location_name: str
    unified_priority_score: float
    priority_tier: str
    color: str
    recommended_action: str
    is_compound_crisis: bool
    contributions: Dict[str, float]
    comparison_mode: ComparisonMode
    justifications: List[str]
    uncertainty_index: float

# Simulation Schemas
class SimulationScenarioRequest(BaseModel):
    scenario: str = Field(..., description="One of: 'normal', 'extreme_heat', 'sudden_leak', 'compound_crisis'")

class SimulationStatusResponse(BaseModel):
    is_running: bool
    current_scenario: str
    tick_count: int
    latest_event: str
    active_alerts_count: int

# Alert Schemas
class AlertItem(BaseModel):
    id: str
    alert_type: str
    location_id: str
    location_name: str
    severity: str
    title: str
    message: str
    status: str
    timestamp: str
    acknowledged_at: Optional[str] = None
    resolved_at: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None

# Dashboard Summary Schema
class DashboardSummaryResponse(BaseModel):
    overall_community_risk_score: float
    overall_risk_level: str
    current_heat_risk_level: str
    heat_index_c: float
    water_network_status: str
    estimated_water_loss_litres: float
    estimated_water_loss_rate_lph: float
    active_alerts_count: int
    monitored_locations_count: int
    recent_events: List[str]
    is_simulated: bool
