import React from 'react';
import {
  Flame,
  Droplets,
  Layers,
  BarChart3,
  Database,
  FileText,
  LayoutDashboard,
  Server,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, activeAlertsCount }) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'heatshield', label: 'HeatShield AI', icon: Flame },
    { id: 'aquatrace', label: 'AquaTrace', icon: Droplets },
    { id: 'unified', label: 'Unified Intelligence', icon: Layers },
    { id: 'data', label: 'Data Explorer', icon: Database },
    { id: 'evaluation', label: 'Model Metrics', icon: BarChart3 },
    { id: 'about', label: 'Architecture & Docs', icon: FileText },
  ];

  return (
    <header className="w-full bg-[#070914]/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-purple-900/30 group-hover:shadow-purple-700/50 transition">
              <div className="w-full h-full bg-[#090d21] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Flame className="w-4 h-4 text-amber-400 absolute -top-0.5 -right-0.5 opacity-80" />
                <Droplets className="w-5 h-5 text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full filter blur-[4px]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                  HYDROSYNC AI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Climate Intelligence & Water Conservation
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'dashboard' && activeAlertsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>IBM LinuxONE Ready</span>
            </div>

            {/* Mobile Tab Select Dropdown */}
            <div className="lg:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
