/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { VentureOverview } from './components/VentureOverview';
import { FarmConfigurationForm } from './components/FarmConfigurationForm';
import { BiomimeticSimulationView } from './components/BiomimeticSimulationView';
import { SolarMineralizationModule } from './components/SolarMineralizationModule';
import { FinancialMetricsView } from './components/FinancialMetricsView';
import { ActivityLogsAndScenarios } from './components/ActivityLogsAndScenarios';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { DeployVercelModal } from './components/DeployVercelModal';
import { runSimulation } from './utils/thermodynamics';
import {
  DEFAULT_BUSINESS_INPUTS,
  DEFAULT_ENVIRONMENTAL_CONDITIONS,
  DEFAULT_FARM_PROFILE,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SAVED_SCENARIOS,
  STORAGE_KEYS,
  loadStoredData,
  saveStoredData,
} from './utils/storage';
import {
  ActivityLog,
  BusinessInputs,
  EnvironmentalConditions,
  FarmProfile,
  SavedScenario,
} from './types/aeroflora';
import {
  CheckCircle,
  FileText,
  Sliders,
  Wind,
  Layers,
  TrendingUp,
  BookmarkCheck,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Persistent State
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() =>
    loadStoredData(STORAGE_KEYS.FARM_PROFILE, DEFAULT_FARM_PROFILE)
  );

  const [businessInputs, setBusinessInputs] = useState<BusinessInputs>(() =>
    loadStoredData(STORAGE_KEYS.BUSINESS_INPUTS, DEFAULT_BUSINESS_INPUTS)
  );

  const [environmentalConditions, setEnvironmentalConditions] = useState<EnvironmentalConditions>(() =>
    loadStoredData(STORAGE_KEYS.ENV_CONDITIONS, DEFAULT_ENVIRONMENTAL_CONDITIONS)
  );

  const [scenarios, setScenarios] = useState<SavedScenario[]>(() =>
    loadStoredData(STORAGE_KEYS.SCENARIOS, INITIAL_SAVED_SCENARIOS)
  );

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    loadStoredData(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS)
  );

  // Modals & Feedback
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to storage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.FARM_PROFILE, farmProfile);
  }, [farmProfile]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.BUSINESS_INPUTS, businessInputs);
  }, [businessInputs]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ENV_CONDITIONS, environmentalConditions);
  }, [environmentalConditions]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.SCENARIOS, scenarios);
  }, [scenarios]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.LOGS, activityLogs);
  }, [activityLogs]);

  // Run thermodynamic simulation calculations
  const simulation = useMemo(
    () => runSimulation(businessInputs, environmentalConditions),
    [businessInputs, environmentalConditions]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveScenario = () => {
    const newScenario: SavedScenario = {
      id: `scen-${Date.now()}`,
      name: `${farmProfile.farmName} (${environmentalConditions.ambientRelativeHumidity}% RH, ${environmentalConditions.towerUnits} Towers)`,
      createdAt: new Date().toLocaleString(),
      farmProfile: { ...farmProfile },
      businessInputs: { ...businessInputs },
      environmentalConditions: { ...environmentalConditions },
      summaryMetrics: {
        dailyLiters: simulation.totalDailyLiters,
        annualSavings: simulation.netAnnualSavings,
        paybackMonths: simulation.paybackPeriodMonths,
      },
    };

    setScenarios((prev) => [newScenario, ...prev]);
    showToast('Scenario saved to persistent storage!');
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    setFarmProfile(scenario.farmProfile);
    setBusinessInputs(scenario.businessInputs);
    setEnvironmentalConditions(scenario.environmentalConditions);
    showToast(`Loaded "${scenario.name}"`);
    setActiveTab('simulator');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    showToast('Scenario deleted');
  };

  const handleAddLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action,
      details,
      status: 'nominal',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Trial log entry recorded');
  };

  const handleResetDefaults = () => {
    setFarmProfile(DEFAULT_FARM_PROFILE);
    setBusinessInputs(DEFAULT_BUSINESS_INPUTS);
    setEnvironmentalConditions(DEFAULT_ENVIRONMENTAL_CONDITIONS);
    showToast('Reset to default Willcox Basin parameters');
  };

  const handleExportCSV = () => {
    const headers = ['Hour', 'Phase', 'Ambient RH (%)', 'Tower Core Temp (°C)', 'Extraction Rate (L/hr)', 'Cumulative (L)'];
    const rows = simulation.hourlyCycle.map((h) => [
      h.label,
      h.phase,
      h.ambientRH,
      h.towerTempC,
      h.extractionRateLitersPerHour,
      h.cumulativeLiters,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AeroFlora_24h_Cycle_${farmProfile.farmName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar (adheres to 3-Zone contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDeployModal={() => setShowDeployModal(true)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Secondary Navigation Tabs for Deep Inspection */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg w-fit flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Venture Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Extraction Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cycle')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'cycle'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Biomimetic 24h Cycle
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mineralization')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'mineralization'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solar Mineralization
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'roi'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Financial ROI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'scenarios'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Scenarios &amp; Logs
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <VentureOverview
            onStartSimulation={() => setActiveTab('simulator')}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Tab 2: Full Simulator & Parameters */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <FarmConfigurationForm
              farmProfile={farmProfile}
              onChangeFarmProfile={setFarmProfile}
              businessInputs={businessInputs}
              onChangeBusinessInputs={setBusinessInputs}
              environmentalConditions={environmentalConditions}
              onChangeEnvironmentalConditions={setEnvironmentalConditions}
              onSaveScenario={handleSaveScenario}
              onResetDefaults={handleResetDefaults}
            />

            <BiomimeticSimulationView
              simulation={simulation}
              environmentalConditions={environmentalConditions}
              onUpdateRH={(rh) =>
                setEnvironmentalConditions((prev) => ({
                  ...prev,
                  ambientRelativeHumidity: rh,
                }))
              }
            />
          </div>
        )}

        {/* Tab 3: Biomimetic Cycle Deep Dive */}
        {activeTab === 'cycle' && (
          <div className="space-y-8">
            <BiomimeticSimulationView
              simulation={simulation}
              environmentalConditions={environmentalConditions}
              onUpdateRH={(rh) =>
                setEnvironmentalConditions((prev) => ({
                  ...prev,
                  ambientRelativeHumidity: rh,
                }))
              }
            />
          </div>
        )}

        {/* Tab 4: Solar Mineralization Module */}
        {activeTab === 'mineralization' && (
          <SolarMineralizationModule mineralProfile={simulation.mineralProfile} />
        )}

        {/* Tab 5: Financial Metrics & ROI */}
        {activeTab === 'roi' && (
          <FinancialMetricsView
            simulation={simulation}
            businessInputs={businessInputs}
            farmProfile={farmProfile}
            environmentalConditions={environmentalConditions}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Tab 6: Saved Scenarios & Validation Logs */}
        {activeTab === 'scenarios' && (
          <ActivityLogsAndScenarios
            scenarios={scenarios}
            onLoadScenario={handleLoadScenario}
            onDeleteScenario={handleDeleteScenario}
            activityLogs={activityLogs}
            onAddLog={handleAddLog}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* Quiet Editorial Academic Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-900">AeroFlora Systems</span> · DGU Venture Quest Assignment 2 Prototype
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Student: Laxmi Kumari (0251MBA154)</span>
            <span aria-hidden="true">·</span>
            <span>DBS Global University</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowDeployModal(true)}
              className="text-cyan-800 hover:underline"
            >
              Deploy to Vercel
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExecutiveReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        simulation={simulation}
        farmProfile={farmProfile}
        businessInputs={businessInputs}
        environmentalConditions={environmentalConditions}
      />

      <DeployVercelModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
      />
    </div>
  );
}
