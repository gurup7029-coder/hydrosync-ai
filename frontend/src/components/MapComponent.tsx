import React, { useState } from 'react';
import { LocationRanking } from '../types';
import { AlertCircle, CheckCircle2, ShieldAlert, Building2, Droplets, Thermometer, Info } from 'lucide-react';

interface MapComponentProps {
  locations: LocationRanking[];
  currentScenario: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ locations, currentScenario }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationRanking | null>(locations[0] || null);

  // Fallback if empty
  const activeLoc = selectedLocation || locations[0];

  return (
    <div className="w-full bg-[#0b0e24]/70 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Metropolitan Climate & Water Distribution Network
          </h3>
          <p className="text-[11px] text-slate-400">
            Interactive District Metered Area (DMA) nodes and telemetry topology
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Nominal
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Caution
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Critical Anomaly
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Network Graphic Canvas */}
        <div className="lg:col-span-2 relative h-72 sm:h-80 bg-[#060814] rounded-lg border border-slate-850 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* District Pipeline Connections SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="pipeBurstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Pipelines connecting DMA nodes */}
            <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="url(#pipeGrad)" strokeWidth="3" strokeDasharray="4 2" />
            <line x1="75%" y1="30%" x2="50%" y2="50%" stroke="url(#pipeGrad)" strokeWidth="3" strokeDasharray="4 2" />
            <line
              x1="50%"
              y1="50%"
              x2="55%"
              y2="78%"
              stroke={currentScenario.includes('leak') || currentScenario.includes('crisis') ? 'url(#pipeBurstGrad)' : 'url(#pipeGrad)'}
              strokeWidth="4"
              strokeDasharray={currentScenario.includes('leak') ? 'none' : '4 2'}
              className={currentScenario.includes('leak') ? 'animate-pulse' : ''}
            />
          </svg>

          {/* Interactive DMA Nodes */}
          {/* 1. North District */}
          <div
            onClick={() => setSelectedLocation(locations.find((l) => l.location_id === 'LOC-NORTH') || locations[0])}
            className={`absolute top-[25%] left-[20%] p-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 border ${
              activeLoc?.location_id === 'LOC-NORTH'
                ? 'bg-purple-900/60 border-purple-400 shadow-lg shadow-purple-900/50'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-slate-200">North District</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">DMA-02 • Transit Hub</div>
          </div>

          {/* 2. Industrial Park */}
          <div
            onClick={() => setSelectedLocation(locations.find((l) => l.location_id === 'LOC-IND') || locations[0])}
            className={`absolute top-[20%] right-[15%] p-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 border ${
              activeLoc?.location_id === 'LOC-IND'
                ? 'bg-purple-900/60 border-purple-400 shadow-lg shadow-purple-900/50'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-slate-200">Industrial Park</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">DMA-03 • Power Grid</div>
          </div>

          {/* 3. Central Downtown (Main Alert Area) */}
          <div
            onClick={() => setSelectedLocation(locations.find((l) => l.location_id === 'LOC-CTR') || locations[0])}
            className={`absolute top-[42%] left-[40%] p-2.5 rounded-xl cursor-pointer transition-all transform hover:scale-110 border ${
              activeLoc?.location_id === 'LOC-CTR'
                ? 'bg-purple-900/80 border-cyan-400 shadow-xl shadow-cyan-950/70 ring-2 ring-purple-500/50'
                : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  currentScenario === 'normal'
                    ? 'bg-emerald-400'
                    : currentScenario === 'extreme_heat'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-red-500 animate-ping'
                }`}
              />
              <span className="text-xs font-extrabold text-white">Central Downtown</span>
            </div>
            <div className="text-[10px] text-cyan-300 font-mono mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Met. General Hospital
            </div>
            {currentScenario !== 'normal' && (
              <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-bold font-mono">
                {currentScenario === 'extreme_heat'
                  ? 'HEAT DANGER'
                  : currentScenario === 'sudden_leak'
                  ? 'PIPE RUPTURE'
                  : 'COMPOUND CRISIS'}
              </span>
            )}
          </div>

          {/* 4. South Residential */}
          <div
            onClick={() => setSelectedLocation(locations.find((l) => l.location_id === 'LOC-SOUTH') || locations[0])}
            className={`absolute bottom-[14%] left-[45%] p-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 border ${
              activeLoc?.location_id === 'LOC-SOUTH'
                ? 'bg-purple-900/60 border-purple-400 shadow-lg shadow-purple-900/50'
                : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-slate-200">South Residential</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">DMA-04 • Senior Communities</div>
          </div>
        </div>

        {/* Selected District Telemetry & Priority Breakdown */}
        {activeLoc && (
          <div className="bg-[#080b1a] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  {activeLoc.location_name}
                </h4>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono"
                  style={{ backgroundColor: `${activeLoc.color}20`, color: activeLoc.color, border: `1px solid ${activeLoc.color}50` }}
                >
                  {activeLoc.priority_tier} PRIORITY
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                Critical Facility: <span className="text-slate-200 font-medium">{activeLoc.critical_facility}</span>
              </p>

              {/* Priority Score Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-mono">Unified Priority Score:</span>
                  <span className="font-bold text-white font-mono">{activeLoc.unified_priority_score} / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeLoc.unified_priority_score}%`,
                      backgroundColor: activeLoc.color,
                    }}
                  />
                </div>
              </div>

              {/* Factor Contribution Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-3">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Thermal Stress</span>
                  <span className="text-amber-300 font-bold">+{activeLoc.contributions.heat_contribution_pts} pts</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Water Loss</span>
                  <span className="text-cyan-300 font-bold">+{activeLoc.contributions.water_contribution_pts} pts</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Vulnerability</span>
                  <span className="text-purple-300 font-bold">+{activeLoc.contributions.vulnerability_contribution_pts} pts</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">Compound Synergy</span>
                  <span className="text-red-400 font-bold">+{activeLoc.contributions.compound_synergy_bonus_pts} pts</span>
                </div>
              </div>

              {/* Justification Text */}
              <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/80 mb-2">
                <span className="text-purple-400 font-semibold block mb-0.5">Municipal Recommendation:</span>
                {activeLoc.recommended_action}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Freshness: 1.2m ago</span>
              <span>Uncertainty: ±{activeLoc.uncertainty_index}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
