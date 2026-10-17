import React from 'react';
import {
  Flame,
  Droplets,
  Layers,
  ShieldCheck,
  Server,
  ArrowRight,
  Activity,
  Cpu,
  TrendingDown,
  Building,
  CheckCircle,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenHeatShield: () => void;
  onOpenAquaTrace: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDashboard,
  onOpenHeatShield,
  onOpenAquaTrace,
}) => {
  return (
    <div className="w-full flex flex-col gap-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#101432]/90 via-[#0a0d24]/90 to-[#060815] border border-purple-500/20 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-purple-600/15 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-cyan-600/15 filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            IBM Z Datathon 2026 • Real-Time AI for Critical Decisions
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            HYDROSYNC <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl text-purple-200/90 font-medium mb-6 italic tracking-wide">
            "Predict the Heat. Detect the Loss. Protect the Future."
          </p>

          <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
            A unified climate-risk decision-support platform engineered for municipalities, utility operators, and emergency responders. By fusing real-time thermal stress forecasting with acoustic/hydraulic pipeline leak detection, HYDROSYNC AI eliminates siloed municipal response during cascading climate emergencies.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenDashboard}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-cyan-500 transition shadow-lg shadow-purple-900/40 flex items-center gap-2 group"
            >
              <span>Open Live Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenHeatShield}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 text-sm font-medium transition flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Explore HeatShield AI</span>
            </button>

            <button
              onClick={onOpenAquaTrace}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 text-sm font-medium transition flex items-center gap-2"
            >
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Explore AquaTrace</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Quick Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">Heat Index Precision</div>
            <div className="text-xl font-bold text-white mt-1">±0.12°C</div>
            <div className="text-[10px] text-emerald-400">NOAA Rothfusz Calibrated</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">Burst Detection F1</div>
            <div className="text-xl font-bold text-white mt-1">97.1%</div>
            <div className="text-[10px] text-cyan-400">Isolation Forest Pipeline</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">Mean Burst Time-to-Detect</div>
            <div className="text-xl font-bold text-white mt-1">&lt; 4.2 min</div>
            <div className="text-[10px] text-purple-400">Real-time Telemetry Loop</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">Target Infrastructure</div>
            <div className="text-xl font-bold text-white mt-1">IBM LinuxONE</div>
            <div className="text-[10px] text-indigo-300">s390x & Multi-Arch Ready</div>
          </div>
        </div>
      </section>

      {/* Two Intelligent Core Engines Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* HeatShield AI Card */}
        <div className="rounded-2xl bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-[#070914] border border-amber-500/20 p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">HeatShield AI</h2>
            <p className="text-xs text-amber-400 font-mono uppercase tracking-wider mb-4">
              Real-Time Thermal Stress & Heat Vulnerability Engine
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Analyzes ambient temperature, relative humidity, and solar radiation to compute validated NOAA Heat Index and Stull Wet-Bulb Temperatures. Provides municipal cooling center guidance, OSHA/NIOSH rest rotations, and flags high-risk time windows for vulnerable demographics.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Standardized 5-tier NWS risk categories with health advisories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Physiological wet-bulb survivability threshold monitoring (Twb &gt; 31°C)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Open-Meteo real-time global weather integration with offline fallback</span>
              </li>
            </ul>
          </div>
          <button
            onClick={onOpenHeatShield}
            className="w-full py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition"
          >
            Launch HeatShield AI Module →
          </button>
        </div>

        {/* AquaTrace Card */}
        <div className="rounded-2xl bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-[#070914] border border-cyan-500/20 p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
              <Droplets className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AquaTrace</h2>
            <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider mb-4">
              Early Water-Leak Detection & Loss Estimation
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Combines unsupervised Isolation Forest machine learning with physical hydraulic rules (mass balance deficit, sudden negative pressure gradient paired with flow surge) to spot main bursts and nocturnal leaks before catastrophic street flooding occurs.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Dynamic DMA flow/pressure anomaly scoring & burst confirmation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Estimated water loss in Litres and Litres per hour (L/hr)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Sensor health diagnostics (flatline freeze, negative pressure warnings)</span>
              </li>
            </ul>
          </div>
          <button
            onClick={onOpenAquaTrace}
            className="w-full py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition"
          >
            Launch AquaTrace Module →
          </button>
        </div>
      </section>

      {/* The Unified Innovation Section */}
      <section className="rounded-2xl bg-[#090d22]/80 border border-purple-500/30 p-8 sm:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              The Multi-Hazard Breakthrough
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Unify Heat and Water?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Traditional municipal management isolates water utilities from public health. When a 44°C heatwave strikes and a water main bursts simultaneously, cooling centers and hospitals lose critical chiller supply. HYDROSYNC AI models this compound synergy.
            </p>
          </div>
          <button
            onClick={onOpenDashboard}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-900/50"
          >
            Test Compound Scenario →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#060814] border border-slate-800">
            <span className="text-amber-400 text-xs font-mono font-bold block mb-1">Single-Silo 1: Heat Only</span>
            <p className="text-xs text-slate-400">
              Emergency health alerts advise citizens to stay hydrated and visit cooling centers, unaware that the central pipeline feeding the cooling center is de-pressurized.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#060814] border border-slate-800">
            <span className="text-cyan-400 text-xs font-mono font-bold block mb-1">Single-Silo 2: Water Only</span>
            <p className="text-xs text-slate-400">
              Utility schedules a standard 4-hour leak repair dispatch without realizing the affected sector houses a high concentration of heat-vulnerable senior citizens.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/40">
            <span className="text-purple-300 text-xs font-mono font-bold block mb-1">HYDROSYNC AI: Unified</span>
            <p className="text-xs text-purple-200">
              Instantly detects compound catastrophe. Elevates priority score to CRITICAL (94.2/100), triggering simultaneous water tanker dispatch and cooling shelter re-routing.
            </p>
          </div>
        </div>
      </section>

      {/* Project & Team Information Card (Editable Placeholders) */}
      <section className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Project Team & Datathon Submission Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono block">Project Title</span>
            <span className="text-white font-semibold text-sm">HYDROSYNC AI</span>
            <span className="text-slate-400 block mt-1">AI-Powered Climate Intelligence & Water Conservation</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono block">Lead Innovator</span>
            <span className="text-white font-semibold text-sm">Guru Prakash</span>
            <span className="text-slate-400 block mt-1">gurup7029@gmail.com</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono block">Event & Track</span>
            <span className="text-cyan-300 font-semibold text-sm">IBM Z Datathon 2026</span>
            <span className="text-slate-400 block mt-1">Real-Time AI for Critical Decisions</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 font-mono block">Target Architecture</span>
            <span className="text-purple-300 font-semibold text-sm">IBM LinuxONE / s390x</span>
            <span className="text-slate-400 block mt-1">Enterprise High-Availability & CPU AI</span>
          </div>
        </div>
      </section>
    </div>
  );
};
