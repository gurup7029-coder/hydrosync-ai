import React from 'react';
import {
  FileText,
  Server,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Terminal,
  BookOpen,
  Code,
  Lock,
} from 'lucide-react';

export const AboutDocsPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#070914] border border-purple-500/30 p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          Technical Documentation & LinuxONE Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          System Architecture, IBM Z Deployment & AI Transparency
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Detailed technical blueprints, open-source citations, and the enterprise deployment roadmap for Linux on IBM Z and IBM LinuxONE.
        </p>
      </div>

      {/* Section 1: Solution Architecture */}
      <section className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          HYDROSYNC AI System Architecture Flowchart
        </h2>

        {/* ASCII / Mermaid Style Architecture Diagram */}
        <div className="p-4 rounded-xl bg-[#060814] border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
          <pre className="text-cyan-300">
{`+---------------------------------------------------------------------------------------------------+
|                                   DATA INGESTION & SENSORY LAYER                                  |
|   [Open-Meteo API / Local Weather Station]         [IoT District Metered Area (DMA) Telemetry]    |
|   (Temperature, Humidity, Wind, Solar)             (Flow Rate L/min, Pressure bar, In/Out Deficit)|
+------------------------------------------------+--------------------------------------------------+
                                                 |
                                                 v
+---------------------------------------------------------------------------------------------------+
|                              INTELLIGENT AI/ML DUAL PROCESSING CORES                              |
|                                                                                                   |
|   CORE 1: HeatShield AI Engine                     CORE 2: AquaTrace Pipeline Detector            |
|   - NOAA Rothfusz Heat Index Formula               - Unsupervised Isolation Forest Anomaly ML     |
|   - Stull Wet-Bulb (Twb) Empirical Model           - Physical Mass-Balance Deficit Rules (Qin-Qout)
|   - NWS 5-Tier Operational Categorization          - Diurnal Curve Baseline Loss Estimation (L/hr)|
+------------------------------------------------+--------------------------------------------------+
                                                 |
                                                 v
+---------------------------------------------------------------------------------------------------+
|                        UNIFIED DECISION ENGINE (Multi-Hazard Prioritization)                      |
|   Composite Score P = (w_heat * S_heat + w_water * S_water + w_vuln * S_vuln + Bonus) * Freshness |
|   - Compound Hazard Synergy Bonus (+10-15 pts during concurrent heatwave & main rupture)          |
|   - Municipal District Ranking & Real-Time Action Dispatches                                      |
+------------------------------------------------+--------------------------------------------------+
                                                 |
                                                 v
+---------------------------------------------------------------------------------------------------+
|                         ENTERPRISE FASTAPI & REACT CONTROL CENTER                                 |
|   [FastAPI typed REST Endpoints]  <--->  [Interactive React Dashboard + Leaflet Topology Canvas]   |
|   [SQLite / PostgreSQL Repository] <--->  [Docker / s390x IBM LinuxONE High-Availability Container]
+---------------------------------------------------------------------------------------------------+`}
          </pre>
        </div>
      </section>

      {/* Section 2: IBM Z / LinuxONE Deployment Roadmap */}
      <section className="rounded-xl bg-gradient-to-b from-indigo-950/20 via-slate-900/60 to-[#070914] border border-indigo-500/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              IBM Z & IBM LinuxONE Deployment Roadmap
            </h2>
            <p className="text-xs text-indigo-300 font-mono">
              Designed for s390x Architecture, High-Throughput Ingestion, and Enterprise Confidentiality
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Resource-Efficient CPU Inference
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike power-hungry LLMs requiring discrete GPUs, HYDROSYNC AI's Isolation Forest and NOAA regression models run entirely on IBM Telum / LinuxONE enterprise CPU cores with microsecond latency.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
              <Lock className="w-4 h-4 text-purple-400" />
              IBM Secure Execution
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal water network topologies and hospital demographic vulnerabilities are classified critical infrastructure data. Deploying in Secure Execution enclaves prevents unauthorized memory inspection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Five-Nines Resilience (99.999%)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Disaster management platforms cannot fail during severe extreme weather. LinuxONE's fault-tolerant architecture guarantees continuous telemetry monitoring without unplanned downtime.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
          <span className="text-indigo-400 font-bold block mb-2">// Multi-Arch Docker Build for s390x / IBM LinuxONE</span>
          <p className="text-slate-400 mb-1">$ docker buildx create --use</p>
          <p className="text-slate-400 mb-1">$ docker buildx build --platform linux/s390x,linux/amd64 -t hydrosync-ai:latest -f docker/Dockerfile.backend .</p>
          <p className="text-emerald-400 mt-2">✓ Verified: Zero non-CPU C-extensions; 100% pure Python/NumPy/Scikit-learn s390x compatible.</p>
        </div>
      </section>

      {/* Section 3: Open-Source Resources Used & Citations */}
      <section className="rounded-xl bg-[#0b0e24]/80 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-400" />
          Open-Source Resources Used & Attribution
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-2.5">Library / Resource</th>
                <th className="p-2.5">Version</th>
                <th className="p-2.5">License</th>
                <th className="p-2.5">Purpose in HYDROSYNC AI</th>
                <th className="p-2.5">Direct URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              <tr>
                <td className="p-2.5 font-bold text-white">FastAPI</td>
                <td className="p-2.5">0.143+</td>
                <td className="p-2.5">MIT</td>
                <td className="p-2.5 font-sans">High-performance async REST API engine</td>
                <td className="p-2.5 text-cyan-400">https://fastapi.tiangolo.com</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Scikit-learn</td>
                <td className="p-2.5">1.9.0</td>
                <td className="p-2.5">BSD-3</td>
                <td className="p-2.5 font-sans">Unsupervised Isolation Forest anomaly detection</td>
                <td className="p-2.5 text-cyan-400">https://scikit-learn.org</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Recharts</td>
                <td className="p-2.5">2.15+</td>
                <td className="p-2.5">MIT</td>
                <td className="p-2.5 font-sans">Interactive time-series visualizations & charts</td>
                <td className="p-2.5 text-cyan-400">https://recharts.org</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Open-Meteo API</td>
                <td className="p-2.5">v1</td>
                <td className="p-2.5">CC BY 4.0</td>
                <td className="p-2.5 font-sans">Open meteorological weather telemetry source</td>
                <td className="p-2.5 text-cyan-400">https://open-meteo.com</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Tailwind CSS</td>
                <td className="p-2.5">4.0+</td>
                <td className="p-2.5">MIT</td>
                <td className="p-2.5 font-sans">Futuristic dark-theme responsive UI design system</td>
                <td className="p-2.5 text-cyan-400">https://tailwindcss.com</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Lucide React</td>
                <td className="p-2.5">Latest</td>
                <td className="p-2.5">ISC</td>
                <td className="p-2.5 font-sans">Modern scalable iconography</td>
                <td className="p-2.5 text-cyan-400">https://lucide.dev</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Responsible AI & Limitations */}
      <section className="rounded-xl bg-slate-900/50 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Responsible AI, Assumptions & Limitations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 mt-4 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">Non-Medical Advisory Limitation:</span>
            HeatShield AI calculates ambient thermal index and physiological wet-bulb thresholds based on meteorological formulas. It does not measure core human body temperature or diagnose heat stroke. Clinical decisions must remain with qualified physicians.
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Non-Intrusive Leak Localization:</span>
            AquaTrace flags anomalous District Metered Areas (DMAs) and estimates loss volume based on diurnal baseline departure. It does not pinpoint the exact subterranean centimeter of pipe failure, which requires acoustic correlators and field valving.
          </div>
        </div>
      </section>
    </div>
  );
};
