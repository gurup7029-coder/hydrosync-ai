import React, { useState } from 'react';
import { HeatAnalysis } from '../types';
import { api } from '../services/api';
import {
  Flame,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  Calculator,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

interface HeatShieldPageProps {
  currentHeatAnalysis: HeatAnalysis | null;
}

export const HeatShieldPage: React.FC<HeatShieldPageProps> = ({ currentHeatAnalysis }) => {
  // Manual interactive inputs
  const [temp, setTemp] = useState<number>(currentHeatAnalysis?.temperature_c || 38.0);
  const [rh, setRh] = useState<number>(currentHeatAnalysis?.relative_humidity_pct || 65.0);
  const [wind, setWind] = useState<number>(currentHeatAnalysis?.wind_speed_kmh || 12.0);
  const [solar, setSolar] = useState<number>(currentHeatAnalysis?.solar_radiation_wm2 || 750.0);
  const [customResult, setCustomResult] = useState<HeatAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const activeData = customResult || currentHeatAnalysis;

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await api.analyzeHeat(temp, rh, wind, solar);
      setCustomResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleResetToLive = () => {
    setCustomResult(null);
    if (currentHeatAnalysis) {
      setTemp(currentHeatAnalysis.temperature_c);
      setRh(currentHeatAnalysis.relative_humidity_pct);
      setWind(currentHeatAnalysis.wind_speed_kmh);
      setSolar(currentHeatAnalysis.solar_radiation_wm2);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-[#070914] border border-amber-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            HeatShield AI Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Thermal Risk & Wet-Bulb Safety Guidance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Validated NOAA National Weather Service Rothfusz polynomial regression and Stull Wet-Bulb formulation. Translates raw meteorological telemetry into actionable municipal safety directives.
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
        {/* Interactive Parameter Tuning Panel */}
        <div className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              Thermal Parameters & Scenario Testing
            </h2>

            {/* Slider 1: Temperature */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-red-400" /> Air Temperature:
                </span>
                <span className="font-bold text-white font-mono">{temp.toFixed(1)}°C ({((temp * 9) / 5 + 32).toFixed(1)}°F)</span>
              </div>
              <input
                type="range"
                min="20"
                max="52"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Relative Humidity */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Relative Humidity:
                </span>
                <span className="font-bold text-white font-mono">{rh.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="1"
                value={rh}
                onChange={(e) => setRh(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Slider 3: Wind Speed */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-slate-300" /> Wind Velocity:
                </span>
                <span className="font-bold text-white font-mono">{wind.toFixed(0)} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={wind}
                onChange={(e) => setWind(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Slider 4: Solar Radiation */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Irradiance:
                </span>
                <span className="font-bold text-white font-mono">{solar.toFixed(0)} W/m²</span>
              </div>
              <input
                type="range"
                min="0"
                max="1100"
                step="50"
                value={solar}
                onChange={(e) => setSolar(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
          >
            {isCalculating ? 'Computing Formula...' : 'Recalculate Heat Index →'}
          </button>
        </div>

        {/* Results & Health Category Assessment */}
        {activeData && (
          <div className="lg:col-span-2 rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">Assigned NWS Risk Category</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-2xl font-black uppercase font-mono px-2.5 py-1 rounded"
                      style={{
                        backgroundColor: `${activeData.classification.color}25`,
                        color: activeData.classification.color,
                        border: `1px solid ${activeData.classification.color}50`,
                      }}
                    >
                      {activeData.classification.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Level {activeData.classification.level}/5</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-mono">Perceived Heat Index</span>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {activeData.heat_index_c}°C
                  </div>
                </div>
              </div>

              {/* Wet-Bulb Warning Callout */}
              {activeData.classification.wet_bulb_alert && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{activeData.classification.wet_bulb_alert}</span>
                </div>
              )}

              {/* Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Ambient Temp</span>
                  <span className="text-sm font-bold text-white font-mono">{activeData.temperature_c}°C</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Rel. Humidity</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">{activeData.relative_humidity_pct}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Wet-Bulb (Twb)</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">{activeData.wet_bulb_c}°C</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Humidity Lift</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">+{activeData.explainability.humidity_amplification_c}°C</span>
                </div>
              </div>

              {/* Explainability Section */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 mb-4">
                <span className="text-amber-400 font-bold block mb-1">Explainable AI Attribution:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Ambient temperature accounts for {activeData.explainability.ambient_baseline_c}°C base thermal energy. Elevated relative humidity ({activeData.relative_humidity_pct}%) impairs evaporative sweat cooling, magnifying perceived thermal stress by an additional {activeData.explainability.humidity_amplification_c}°C. Wind interaction: {activeData.explainability.wind_interaction}.
                </p>
              </div>

              {/* Preventive Action Guidelines */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Municipal & Workplace Safety Actions (CDC / NIOSH):
                </h3>
                <ul className="space-y-1.5">
                  {activeData.classification.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/60">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 leading-relaxed flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{activeData.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
