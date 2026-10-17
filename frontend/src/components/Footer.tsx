import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050711] border-t border-slate-800/80 py-10 mt-auto text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-bold text-white tracking-tight">HYDROSYNC AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono">
                IBM Z Datathon 2026
              </span>
            </div>
            <p className="text-slate-400 mb-3 text-xs leading-relaxed max-w-md">
              "Predict the Heat. Detect the Loss. Protect the Future."
              An AI-powered climate intelligence and municipal water conservation platform unifying HeatShield AI and AquaTrace.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Challenge Track: Real-Time AI for Critical Decisions</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Core Capabilities</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• NOAA Heat Index & Wet-Bulb Engine</li>
              <li>• Isolation Forest Burst Anomaly Detection</li>
              <li>• Explainable Multi-Hazard Prioritization</li>
              <li>• DMA Water Loss Estimation (L/hr)</li>
              <li>• Linux on IBM Z / LinuxONE Containerization</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Responsible AI & Safety</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Advisory decision-support system only. HydroSync AI does not diagnose clinical heat illness or guarantee exact underground leak coordinates without acoustic ground verification.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px]">Deterministic, Explainable Machine Learning</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 HYDROSYNC AI. Designed for IBM Z Datathon 2026. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-red-400 inline" /> for resilient urban infrastructure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
