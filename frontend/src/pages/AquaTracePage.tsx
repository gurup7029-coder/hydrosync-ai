import React, { useState } from 'react';
import { WaterAnalysis } from '../types';
import { api } from '../services/api';
import {
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Gauge,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface AquaTracePageProps {
  currentWaterAnalysis: WaterAnalysis | null;
}

export const AquaTracePage: React.FC<AquaTracePageProps> = ({ currentWaterAnalysis }) => {
  const [flow, setFlow] = useState<number>(currentWaterAnalysis?.flow_rate_lpm || 80.0);
  const [pressure, setPressure] = useState<number>(currentWaterAnalysis?.pressure_bar || 4.2);
  const [customResult, setCustomResult] = useState<WaterAnalysis | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const activeData = customResult || currentWaterAnalysis;

  const handleTestAnomaly = async (testFlow: number, testPressure: number) => {
    setFlow(testFlow);
    setPressure(testPressure);
    setIsEvaluating(true);
    try {
      const res = await api.analyzeWater(testFlow, testPressure);
      setCustomResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCustomEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await api.analyzeWater(flow, pressure);
      setCustomResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetToLive = () => {
    setCustomResult(null);
    if (currentWaterAnalysis) {
      setFlow(currentWaterAnalysis.flow_rate_lpm);
      setPressure(currentWaterAnalysis.pressure_bar);
    }
  };

  // Synthetic DMA Comparison Stream
  const hydraulicTrend = [
    { time: '00:00', baselineFlow: 55, actualFlow: 54, baselineP: 4.3, actualP: 4.32 },
    { time: '04:00', baselineFlow: 45, actualFlow: 46, baselineP: 4.4, actualP: 4.38 },
    { time: '08:00', baselineFlow: 85, actualFlow: 87, baselineP: 4.1, actualP: 4.09 },
    { time: '12:00', baselineFlow: 90, actualFlow: 92, baselineP: 4.0, actualP: 3.98 },
    { time: '16:00', baselineFlow: 82, actualFlow: activeData?.anomaly_detected ? flow : 81, baselineP: 4.2, actualP: activeData?.anomaly_detected ? pressure : 4.18 },
  ];

  return (
    <div className="w-full flex flex-col gap-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-[#070914] border border-cyan-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            AquaTrace Pipeline Leak Detection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DMA Hydraulic Anomaly & Water Loss Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Unsupervised Isolation Forest ML coupled with physical mass-balance rules. Accurately spots main bursts and nocturnal leaks before catastrophic street flooding occurs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {customResult && (
            <button
              onClick={handleResetToLive}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Live Feed
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Hydraulic Simulator Panel */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Hydraulic Flow & Pressure Controls
            </h2>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-400 block mb-2 font-mono">Test Telemetry Presets:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleTestAnomaly(80.5, 4.22)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 text-[11px] transition"
                >
                  Nominal State
                </button>
                <button
                  onClick={() => handleTestAnomaly(188.0, 1.82)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-red-400 hover:bg-slate-800 text-[11px] transition"
                >
                  Severe Burst Leak
                </button>
                <button
                  onClick={() => handleTestAnomaly(115.0, 3.4)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800 text-[11px] transition"
                >
                  Gradual Nocturnal Leak
                </button>
                <button
                  onClick={() => handleTestAnomaly(75.0, 0.15)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-purple-400 hover:bg-slate-800 text-[11px] transition"
                >
                  Pressure Drop Sensor Fault
                </button>
              </div>
            </div>

            {/* Slider 1: Flow Rate */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Flow Rate:</span>
                <span className="font-bold text-white font-mono">{flow.toFixed(1)} L/min</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="1"
                value={flow}
                onChange={(e) => setFlow(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>30 L/m (Low Demand)</span>
                <span>Baseline: 80 L/m</span>
                <span>250 L/m (Burst)</span>
              </div>
            </div>

            {/* Slider 2: Pressure */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Hydraulic Pressure:</span>
                <span className="font-bold text-white font-mono">{pressure.toFixed(2)} bar</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.05"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>0.5 bar (Collapse)</span>
                <span>Baseline: 4.2 bar</span>
                <span>6.0 bar (Surge)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCustomEvaluate}
            disabled={isEvaluating}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
          >
            {isEvaluating ? 'Evaluating Isolation Forest...' : 'Evaluate Hydraulic State →'}
          </button>
        </div>

        {/* Results & Leak Diagnosis */}
        {activeData && (
          <div className="lg:col-span-2 rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">Detection Pipeline Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-2xl font-black uppercase font-mono px-2.5 py-1 rounded ${
                        activeData.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : activeData.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {activeData.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Anomaly Score: {(activeData.anomaly_score * 100).toFixed(0)}/100
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-mono">Estimated Loss Rate</span>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {activeData.estimated_loss_l_per_hr.toLocaleString()} <span className="text-xs text-slate-400">L/hr</span>
                  </div>
                </div>
              </div>

              {/* Anomaly Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Flow Rate</span>
                  <span className="text-sm font-bold text-white font-mono">{activeData.flow_rate_lpm} L/min</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Pressure</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">{activeData.pressure_bar} bar</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Burst Probability</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">{activeData.confidence_pct}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Sensor Health</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{activeData.sensor_health.status}</span>
                </div>
              </div>

              {/* Explanations List */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Hydraulic Root-Cause & Anomaly Explanations:
                </h3>
                <div className="space-y-1.5">
                  {activeData.explanations.map((exp, i) => (
                    <div key={i} className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensor Health Diagnostic */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400 font-mono">Sensor Diagnostic Detail:</span>
                <span className="text-slate-200 font-medium">{activeData.sensor_health.detail}</span>
              </div>
            </div>

            {/* Assumptions & Physical Limitations Note */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 leading-relaxed flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{activeData.assumptions}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hydraulic Trend Graph */}
      <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Diurnal Flow Baseline vs. Actual Telemetry Stream
            </h3>
            <p className="text-[11px] text-slate-400">Comparing expected diurnal demand curve with sensor observation</p>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">DMA District Meter #1</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hydraulicTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d30" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[30, 220]} unit=" L/m" />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d21', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="baselineFlow" stroke="#64748b" strokeDasharray="5 5" strokeWidth={2} name="Baseline Expected Flow (L/min)" />
              <Line type="monotone" dataKey="actualFlow" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Measured Flow (L/min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
