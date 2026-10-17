import React, { useState } from 'react';
import { DashboardSummary, SimulationState, AlertItem } from '../types';
import { MapComponent } from '../components/MapComponent';
import {
  Flame,
  Droplets,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  TrendingDown,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

interface MainDashboardProps {
  summary: DashboardSummary | null;
  simState: SimulationState | null;
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  summary,
  simState,
  onAcknowledgeAlert,
  onResolveAlert,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  if (!simState || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <Activity className="w-6 h-6 animate-spin text-purple-500 mr-2" />
        Connecting to HYDROSYNC AI Telemetry Stream...
      </div>
    );
  }

  const { telemetry, heat_analysis, water_analysis, location_rankings, top_priority, active_alerts } = simState;

  // Real-time Trend Series based on current scenario
  const isHeat = simState.scenario === 'extreme_heat' || simState.scenario === 'compound_crisis';
  const isLeak = simState.scenario === 'sudden_leak' || simState.scenario === 'compound_crisis';

  const chartData = [
    { time: '10:00', temp: isHeat ? 33.2 : 25.1, rh: 68, flow: 78, pressure: 4.3 },
    { time: '11:00', temp: isHeat ? 36.8 : 26.5, rh: 64, flow: 81, pressure: 4.25 },
    { time: '12:00', temp: isHeat ? 39.5 : 27.2, rh: 60, flow: 84, pressure: 4.2 },
    { time: '13:00', temp: isHeat ? 41.2 : 28.0, rh: 58, flow: isLeak ? 120 : 82, pressure: isLeak ? 3.4 : 4.2 },
    { time: '14:00', temp: isHeat ? 42.5 : 28.4, rh: 62, flow: isLeak ? 188 : 80, pressure: isLeak ? 1.82 : 4.22 },
  ];

  return (
    <div className="w-full flex flex-col gap-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Critical Status Banner */}
      <div
        className="rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
        style={{
          backgroundColor: `${top_priority.color}15`,
          borderColor: `${top_priority.color}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: `${top_priority.color}30`, color: top_priority.color }}
          >
            {top_priority.is_compound_crisis ? <Zap className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: top_priority.color }}>
                {top_priority.priority_tier} PRIORITY ALERT
              </span>
              {top_priority.is_compound_crisis && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/40 animate-pulse">
                  COMPOUND MULTI-HAZARD
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {top_priority.location_name}: Unified Score {top_priority.unified_priority_score} / 100
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">{top_priority.recommended_action}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-300">
            Scenario: <span className="font-bold text-white capitalize">{simState.scenario.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (4 Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Heat Hazard Level */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">HeatShield AI Index</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{heat_analysis.heat_index_c}°C</span>
            <span className="text-xs text-slate-400 font-mono">({telemetry.temperature_c}°C / {telemetry.relative_humidity_pct}% RH)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span
              className="font-bold uppercase font-mono px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${heat_analysis.classification.color}20`, color: heat_analysis.classification.color }}
            >
              {heat_analysis.classification.category}
            </span>
            <span className="text-slate-400 font-mono">Wet-Bulb: {heat_analysis.wet_bulb_c}°C</span>
          </div>
        </div>

        {/* KPI 2: Water Pipeline Anomaly Status */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">AquaTrace Hydraulic Status</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{water_analysis.severity}</span>
            <span className="text-xs text-slate-400 font-mono">{telemetry.flow_rate_lpm} L/min</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Pressure: <span className="text-white font-bold">{telemetry.pressure_bar} bar</span></span>
            <span className={water_analysis.anomaly_detected ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {water_analysis.confidence_pct}% Conf.
            </span>
          </div>
        </div>

        {/* KPI 3: Estimated Water Loss */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">Estimated Water Loss</span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{telemetry.cumulative_water_loss_litres.toLocaleString()} L</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Current Rate:</span>
            <span className={telemetry.loss_rate_lph > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {telemetry.loss_rate_lph.toLocaleString()} L/hr
            </span>
          </div>
        </div>

        {/* KPI 4: Active Alerts & Monitored DMAs */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-mono">Operational Coverage</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{active_alerts.length}</span>
            <span className="text-xs text-slate-400 font-mono">Active Incidents</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Monitored DMAs:</span>
            <span className="text-white font-bold">4 Districts</span>
          </div>
        </div>
      </div>

      {/* Network Map Topology & District Priorities */}
      <MapComponent locations={location_rankings} currentScenario={simState.scenario} />

      {/* Real-Time Telemetry Trends (Heat & Flow Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Heat Trends */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Thermal Telemetry: Temperature vs. Heat Index
              </h3>
              <p className="text-[10px] text-slate-400">NOAA NWS validated polynomial curve</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Diurnal Window (5h)</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="heatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d30" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} unit="°C" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d21', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" fillOpacity={1} fill="url(#heatGrad)" name="Temperature (°C)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hydraulic Telemetry (Flow vs. Pressure) */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                AquaTrace Hydraulics: Flow (L/min) & Pressure (bar)
              </h3>
              <p className="text-[10px] text-slate-400">Isolation Forest real-time burst detector</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">DMA-01 Sensor Stream</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d30" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis yAxisId="left" stroke="#06b6d4" fontSize={10} domain={['auto', 'auto']} unit=" L/m" />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={10} domain={[1, 5]} unit=" bar" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d21', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Flow Rate (L/min)" />
                <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Pressure (bar)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Incident Alerts & Action Dispatch Table */}
      <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Active Municipal Alerts & Operational Dispatches ({active_alerts.length})
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">SQLite Persistent Alert Repository</span>
        </div>

        {active_alerts.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No active emergencies. All sector telemetries operating within nominal baselines.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase font-mono bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Incident Title</th>
                  <th className="py-2.5 px-3">Details / Explanation</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {active_alerts.map((alt) => (
                  <tr key={alt.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                        {alt.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{alt.location_name}</td>
                    <td className="py-3 px-3 text-slate-200">{alt.title}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{alt.message}</td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <button
                        onClick={() => onAcknowledgeAlert(alt.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => onResolveAlert(alt.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono transition"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
