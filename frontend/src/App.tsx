import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { SimulationState, DashboardSummary } from './types';
import { LiveSimulatorBar } from './components/LiveSimulatorBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { MainDashboard } from './pages/MainDashboard';
import { HeatShieldPage } from './pages/HeatShieldPage';
import { AquaTracePage } from './pages/AquaTracePage';
import { UnifiedIntelligencePage } from './pages/UnifiedIntelligencePage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { ModelEvaluationPage } from './pages/ModelEvaluationPage';
import { AboutDocsPage } from './pages/AboutDocsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Poll state every 3.5 seconds
  useEffect(() => {
    fetchLatestState();

    const interval = setInterval(() => {
      if (isRunning) {
        fetchLatestState();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchLatestState = async () => {
    try {
      const [status, summ] = await Promise.all([
        api.getSimulationStatus(),
        api.getDashboardSummary(),
      ]);
      setSimState(status);
      setSummary(summ);
    } catch (err) {
      console.error('Failed to sync telemetry state:', err);
    }
  };

  const handleSelectScenario = async (scenario: string) => {
    try {
      await api.setScenario(scenario);
      await fetchLatestState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlay = async () => {
    try {
      if (isRunning) {
        await api.pauseSimulation();
        setIsRunning(false);
      } else {
        await api.startSimulation();
        setIsRunning(true);
      }
      await fetchLatestState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetSimulation();
      setIsRunning(true);
      await fetchLatestState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await api.acknowledgeAlert(id);
      await fetchLatestState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await api.resolveAlert(id);
      await fetchLatestState();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Persistent Live Demonstration Bar */}
      <LiveSimulatorBar
        currentScenario={simState?.scenario || 'normal'}
        isRunning={isRunning}
        tick={simState?.tick || 0}
        onSelectScenario={handleSelectScenario}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
      />

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlertsCount={simState?.active_alerts?.length || 0}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenDashboard={() => setActiveTab('dashboard')}
            onOpenHeatShield={() => setActiveTab('heatshield')}
            onOpenAquaTrace={() => setActiveTab('aquatrace')}
          />
        )}

        {activeTab === 'dashboard' && (
          <MainDashboard
            summary={summary}
            simState={simState}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {activeTab === 'heatshield' && (
          <HeatShieldPage currentHeatAnalysis={simState?.heat_analysis || null} />
        )}

        {activeTab === 'aquatrace' && (
          <AquaTracePage currentWaterAnalysis={simState?.water_analysis || null} />
        )}

        {activeTab === 'unified' && (
          <UnifiedIntelligencePage
            locations={simState?.location_rankings || []}
            currentScenario={simState?.scenario || 'normal'}
          />
        )}

        {activeTab === 'data' && <DataExplorerPage />}

        {activeTab === 'evaluation' && <ModelEvaluationPage />}

        {activeTab === 'about' && <AboutDocsPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
