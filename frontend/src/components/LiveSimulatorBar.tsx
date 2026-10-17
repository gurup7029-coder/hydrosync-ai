import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Activity, ShieldCheck, Flame, Droplets, Zap } from 'lucide-react';

interface LiveSimulatorBarProps {
  currentScenario: string;
  isRunning: boolean;
  tick: number;
  onSelectScenario: (scenario: string) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const LiveSimulatorBar: React.FC<LiveSimulatorBarProps> = ({
  currentScenario,
  isRunning,
  tick,
  onSelectScenario,
  onTogglePlay,
  onReset,
}) => {
  const scenarios = [
    { id: 'normal', name: 'Normal Seasonal', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'extreme_heat', name: 'Extreme Heatwave', icon: Flame, color: 'text-amber-400' },
    { id: 'sudden_leak', name: 'Sudden Pipe Rupture', icon: Droplets, color: 'text-cyan-400' },
    { id: 'compound_crisis', name: 'Compound Multi-Hazard', icon: Zap, color: 'text-red-400' },
  ];

  return (
    <div className="w-full bg-[#0a0e24]/90 border-b border-purple-500/20 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-40 sticky top-0 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-semibold tracking-wide uppercase text-[10px]">
          <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
          Live Demonstration Engine
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          SIMULATED SENSOR DATA
        </span>
        <span className="text-slate-400 hidden sm:inline-block font-mono">
          Tick: <span className="text-white font-bold">{tick}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 text-[11px] font-medium mr-1 hidden md:inline">Select Scenario:</span>
        <div className="flex items-center bg-[#070914] p-1 rounded-lg border border-slate-800 gap-1">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const active = currentScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  active
                    ? 'bg-purple-600/30 text-white border border-purple-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? sc.color : 'text-slate-400'}`} />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={onTogglePlay}
            title={isRunning ? 'Pause Simulation' : 'Start Simulation'}
            className={`p-1.5 rounded-md border flex items-center gap-1 font-semibold transition ${
              isRunning
                ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30'
                : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline text-[11px]">{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={onReset}
            title="Reset Simulation to Normal"
            className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
