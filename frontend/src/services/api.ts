import { DashboardSummary, SimulationState, HeatAnalysis, WaterAnalysis, AlertItem } from '../types';

const API_BASE = '/api';

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  async getSimulationStatus(): Promise<SimulationState> {
    const res = await fetch(`${API_BASE}/simulation/status`);
    if (!res.ok) throw new Error('Failed to fetch simulation status');
    return res.json();
  },

  async setScenario(scenario: string): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
    });
    return res.json();
  },

  async startSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
    return res.json();
  },

  async pauseSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/pause`, { method: 'POST' });
    return res.json();
  },

  async resetSimulation(): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    return res.json();
  },

  async analyzeHeat(temp: number, rh: number, wind: number = 0, solar: number = 0): Promise<HeatAnalysis> {
    const res = await fetch(`${API_BASE}/heat/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temperature_c: temp,
        relative_humidity_pct: rh,
        wind_speed_kmh: wind,
        solar_radiation_wm2: solar,
      }),
    });
    return res.json();
  },

  async analyzeWater(flow: number, pressure: number, baselineFlow: number = 80, baselinePressure: number = 4.2): Promise<WaterAnalysis> {
    const res = await fetch(`${API_BASE}/water/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flow_rate: flow,
        pressure: pressure,
        baseline_flow: baselineFlow,
        baseline_pressure: baselinePressure,
      }),
    });
    return res.json();
  },

  async getAlerts(status?: string): Promise<AlertItem[]> {
    const url = status ? `${API_BASE}/alerts?status=${status}` : `${API_BASE}/alerts`;
    const res = await fetch(url);
    return res.json();
  },

  async acknowledgeAlert(alertId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'POST' });
    return res.json();
  },

  async resolveAlert(alertId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, { method: 'POST' });
    return res.json();
  },

  async getMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/models/metrics`);
    return res.json();
  },

  async uploadData(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/data/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  async getSampleData(sampleName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/data/samples/${sampleName}`);
    return res.json();
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }
};
