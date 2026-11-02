/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveOperationsConsole } from './components/LiveOperationsConsole';
import { BiomimeticSimulationView } from './components/BiomimeticSimulationView';
import { SolarMineralizationModule } from './components/SolarMineralizationModule';
import { FinancialMetricsView } from './components/FinancialMetricsView';
import { ActivityLogsAndScenarios } from './components/ActivityLogsAndScenarios';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { DeployVercelModal } from './components/DeployVercelModal';
import { ScenarioComparisonModal } from './components/ScenarioComparisonModal';
import { QuickGuideModal } from './components/QuickGuideModal';
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
  Scale,
} from 'lucide-react';

export default function App() {
  // Default to live operational view for testing
  const [activeTab, setActiveTab] = useState<string>('live');

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
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
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

  // Run thermodynamic calculations
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
        meetsValidation: simulation.meetsValidationObjective,
      },
    };

    setScenarios((prev) => [newScenario, ...prev]);
    showToast('Scenario saved to persistent storage');
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    setFarmProfile(scenario.farmProfile);
    setBusinessInputs(scenario.businessInputs);
    setEnvironmentalConditions(scenario.environmentalConditions);
    showToast(`Loaded "${scenario.name}"`);
    setActiveTab('live');
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
    showToast('Trial record logged');
  };

  const handleExportCSV = () => {
    const headers = [
      'Hour',
      'Phase',
      'Ambient RH (%)',
      'Tower Core Temp (°C)',
      'Absolute Humidity (g/m3)',
      'Extraction Rate (L/hr)',
      'Cumulative (L)',
    ];
    const rows = simulation.hourlyCycle.map((h) => [
      h.label,
      h.phase,
      h.ambientRH,
      h.towerTempC,
      h.absoluteHumidityGramsPerM3,
      h.extractionRateLitersPerHour,
      h.cumulativeLiters,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AeroFlora_Live_Telemetry_${farmProfile.farmName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Live Operational Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDeployModal={() => setShowDeployModal(true)}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenArrayMatrix={() => setShowComparisonModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Floating Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Operational Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Live Operations & Testing Console */}
        {activeTab === 'live' && (
          <LiveOperationsConsole
            simulation={simulation}
            farmProfile={farmProfile}
            onChangeFarmProfile={setFarmProfile}
            businessInputs={businessInputs}
            onChangeBusinessInputs={setBusinessInputs}
            environmentalConditions={environmentalConditions}
            onChangeEnvironmentalConditions={setEnvironmentalConditions}
            onOpenReport={() => setShowReportModal(true)}
            onOpenArrayMatrix={() => setShowComparisonModal(true)}
          />
        )}

        {/* Tab 2: Biomimetic Condensation Engine Deep-Dive */}
        {activeTab === 'cycle' && (
          <div className="space-y-6">
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

        {/* Tab 3: Solar Mineralization Module */}
        {activeTab === 'mineralization' && (
          <SolarMineralizationModule mineralProfile={simulation.mineralProfile} />
        )}

        {/* Tab 4: Financial Pro-Forma & Savings */}
        {activeTab === 'roi' && (
          <FinancialMetricsView
            simulation={simulation}
            businessInputs={businessInputs}
            farmProfile={farmProfile}
            environmentalConditions={environmentalConditions}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Tab 5: Saved Scenarios & Field Logs */}
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

      {/* Quiet Operational Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">AeroFlora Systems</span>
            <span>·</span>
            <span>Autonomous Off-Grid Atmospheric Water Harvesting</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Station ID: AZ-WILLCOX-01</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-cyan-800 hover:underline cursor-pointer"
            >
              Academic Attestation &amp; Audit
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowDeployModal(true)}
              className="text-cyan-800 hover:underline cursor-pointer"
            >
              Cloud Deployment
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

      <ScenarioComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        farmProfile={farmProfile}
        onSelectTowerUnits={(units) => {
          setEnvironmentalConditions((prev) => ({ ...prev, towerUnits: units }));
          showToast(`Configured array to ${units} harvesting towers`);
          setActiveTab('live');
        }}
      />

      <DeployVercelModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
      />

      <QuickGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onStartTest={() => {
          showToast('Live Extraction Test Triggered');
        }}
      />
    </div>
  );
}
