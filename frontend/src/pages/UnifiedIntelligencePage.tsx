import React, { useState } from 'react';
import { LocationRanking } from '../types';
import {
  Layers,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Building2,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface UnifiedIntelligencePageProps {
  locations: LocationRanking[];
  currentScenario: string;
}

export const UnifiedIntelligencePage: React.FC<UnifiedIntelligencePageProps> = ({
  locations,
  currentScenario,
}) => {
  const [activeMode, setActiveMode] = useState<'heat' | 'water' | 'unified'>('unified');

  // Comparison dataset for BarChart
  const comparisonData = locations.map((loc) => ({
    name: loc.location_name.replace(' DMA', ''),
    heatOnly: loc.comparison_mode.heat_only_score,
    waterOnly: loc.comparison_mode.water_only_score,
    unified: loc.comparison_mode.unified_score,
    lift: loc.comparison_mode.unified_lift_delta,
  }));

  return (
    <div className="w-full flex flex-col gap-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#070914] border border-purple-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Unified Climate Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Multi-Hazard Risk Synthesis & Priority Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesizes thermal stress severity, hydraulic leak loss, and demographic vulnerability into an explainable 0–100 municipal priority rank.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveMode('heat')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeMode === 'heat' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Heat-Only
          </button>
          <button
            onClick={() => setActiveMode('water')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeMode === 'water' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Water-Only
          </button>
          <button
            onClick={() => setActiveMode('unified')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeMode === 'unified' ? 'bg-purple-600/40 text-purple-200 border border-purple-400/50 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unified Intelligence
          </button>
        </div>
      </div>

      {/* Comparison Mode Visualizer (The Core Datathon Demonstration) */}
      <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Siloed Decision-Making vs. Unified Prioritization Comparison
            </h2>
            <p className="text-[11px] text-slate-400">
              Observe how single-silo systems miss compounding risks, whereas HYDROSYNC AI elevates priority when severe heat and water loss coincide.
            </p>
          </div>
          <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-2 py-1 rounded border border-purple-500/30">
            Compound Crisis Multiplier Active
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d30" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} unit=" pts" />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d21', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="heatOnly" name="Heat-Only Priority (Silo A)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waterOnly" name="Water-Only Priority (Silo B)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unified" name="HYDROSYNC Unified Priority" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Priority Ranking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc, idx) => (
          <div
            key={loc.location_id}
            className="rounded-xl bg-[#0b0e24]/80 border p-5 flex flex-col justify-between transition-all"
            style={{
              borderColor: idx === 0 ? `${loc.color}60` : '#1e293b',
              backgroundColor: idx === 0 ? `${loc.color}10` : '#0b0e24',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      {loc.location_name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">Critical: {loc.critical_facility}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
                    style={{ backgroundColor: `${loc.color}20`, color: loc.color, border: `1px solid ${loc.color}40` }}
                  >
                    {loc.priority_tier}
                  </span>
                  <div className="text-lg font-extrabold text-white font-mono mt-0.5">
                    {loc.unified_priority_score} <span className="text-[10px] text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Mathematical Contribution Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono mb-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Thermal (35%)</span>
                  <span className="text-amber-400 font-bold">+{loc.contributions.heat_contribution_pts}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Water (40%)</span>
                  <span className="text-cyan-400 font-bold">+{loc.contributions.water_contribution_pts}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Vuln (15%)</span>
                  <span className="text-purple-400 font-bold">+{loc.contributions.vulnerability_contribution_pts}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Synergy Bonus</span>
                  <span className="text-red-400 font-bold">+{loc.contributions.compound_synergy_bonus_pts}</span>
                </div>
              </div>

              {/* Justification Reasoning */}
              <div className="space-y-1 mb-3">
                {loc.justifications.map((jst, jIdx) => (
                  <p key={jIdx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{jst}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-purple-300 font-medium">Recommended Action:</span>
              <span className="text-slate-300 text-right max-w-xs truncate">{loc.recommended_action}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Explicit Scientific & Responsible AI Disclaimer */}
      <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-bold block mb-1">Causation vs. Correlation Transparency:</span>
          HYDROSYNC AI explicitly notes that a simultaneous heatwave and water pipe burst represent coincident compound climate-infrastructure stressors. The platform never asserts that high temperature physically caused the underground pipe fracture without soil-moisture and acoustic verification. Scores are prioritized to optimize human life safety and cooling readiness.
        </div>
      </div>
    </div>
  );
};
