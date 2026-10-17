export interface HeatClassification {
  category: string;
  level: number;
  severity_score: number;
  color: string;
  description: string;
  recommendations: string[];
  wet_bulb_alert?: string | null;
}

export interface HeatAnalysis {
  temperature_c: number;
  relative_humidity_pct: number;
  heat_index_c: number;
  wet_bulb_c: number;
  wind_speed_kmh: number;
  solar_radiation_wm2: number;
  classification: HeatClassification;
  explainability: {
    ambient_baseline_c: number;
    humidity_amplification_c: number;
    wind_interaction: string;
    primary_driver: string;
  };
  disclaimer: string;
}

export interface SensorHealth {
  status: string;
  detail: string;
}

export interface WaterAnalysis {
  flow_rate_lpm: number;
  pressure_bar: number;
  baseline_flow_lpm: number;
  baseline_pressure_bar: number;
  anomaly_detected: boolean;
  anomaly_score: number;
  confidence_pct: number;
  severity: string;
  estimated_loss_l_per_hr: number;
  sensor_health: SensorHealth;
  explanations: string[];
  assumptions: string;
}

export interface LocationRanking {
  location_id: string;
  location_name: string;
  lat: number;
  lng: number;
  critical_facility: string;
  unified_priority_score: number;
  priority_tier: string;
  color: string;
  recommended_action: string;
  is_compound_crisis: boolean;
  contributions: {
    heat_contribution_pts: number;
    water_contribution_pts: number;
    vulnerability_contribution_pts: number;
    compound_synergy_bonus_pts: number;
    data_freshness_factor: number;
  };
  comparison_mode: {
    heat_only_score: number;
    water_only_score: number;
    unified_score: number;
    unified_lift_delta: number;
  };
  justifications: string[];
  uncertainty_index: number;
}

export interface AlertItem {
  id: string;
  alert_type: string;
  location_id: string;
  location_name: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  timestamp: string;
  acknowledged_at?: string;
  resolved_at?: string;
  meta?: any;
}

export interface DashboardSummary {
  overall_community_risk_score: number;
  overall_risk_level: string;
  overall_color: string;
  recommended_action: string;
  current_heat_risk_level: string;
  heat_index_c: number;
  temperature_c: number;
  relative_humidity_pct: number;
  water_network_status: string;
  flow_rate_lpm: number;
  pressure_bar: number;
  estimated_water_loss_litres: number;
  estimated_water_loss_rate_lph: number;
  active_alerts_count: number;
  monitored_locations_count: number;
  recent_events: string[];
  location_rankings: LocationRanking[];
  is_simulated: boolean;
  current_scenario: string;
}

export interface SimulationState {
  is_simulated: boolean;
  scenario: string;
  tick: number;
  telemetry: {
    temperature_c: number;
    relative_humidity_pct: number;
    flow_rate_lpm: number;
    pressure_bar: number;
    loss_rate_lph: number;
    cumulative_water_loss_litres: number;
  };
  heat_analysis: HeatAnalysis;
  water_analysis: WaterAnalysis;
  top_priority: LocationRanking;
  location_rankings: LocationRanking[];
  active_alerts: AlertItem[];
  latest_event: string;
  timestamp: string;
}
