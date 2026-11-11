/**
 * AeroFlora Systems - Core Application
 * India-First Farm Water Intelligence and Atmospheric Water Harvesting Platform
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { FarmerRegistrationMyFarm } from './components/FarmerRegistrationMyFarm';
import { WaterIntelligenceView } from './components/WaterIntelligenceView';
import { AeroFloraEngineeringSimulator } from './components/AeroFloraEngineeringSimulator';
import { BiomimeticSimulationView } from './components/BiomimeticSimulationView';
import { CropWaterPlannerView } from './components/CropWaterPlannerView';
import { WaterQualityMineralisationView } from './components/WaterQualityMineralisationView';
import { FinancialPlannerROIView } from './components/FinancialPlannerROIView';
import { TowerEquipmentManagementView } from './components/TowerEquipmentManagementView';
import { CommunityFPONetworkView } from './components/CommunityFPONetworkView';
import { ReportsDocumentsView } from './components/ReportsDocumentsView';
import { HelpSupportView } from './components/HelpSupportView';
import { AdminSystemManagementView } from './components/AdminSystemManagementView';
import { ResultsDisplayView } from './components/ResultsDisplayView';
import { LiveOperationsConsole } from './components/LiveOperationsConsole';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { DeployVercelModal } from './components/DeployVercelModal';
import { ScenarioComparisonModal } from './components/ScenarioComparisonModal';
import { QuickGuideModal } from './components/QuickGuideModal';
import { KisanJalSaathiModal } from './components/KisanJalSaathiModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { PasswordUnlockScreen } from './components/PasswordUnlockScreen';
import { useAuth } from './context/AuthContext';
import { AuthUser } from './types/auth';
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
  UserRole,
  IndianFarmerProfile,
} from './types/aeroflora';
import { SupportedLanguage } from './utils/i18n';
import { CheckCircle, RefreshCw, Droplets } from 'lucide-react';

const DEFAULT_INDIAN_FARMER: IndianFarmerProfile = {
  id: 'farmer-101',
  fullName: 'Ramesh Patel',
  mobileNumber: '9825012345',
  email: 'ramesh.patel@agroindia.org',
  preferredLanguage: 'en',
  state: 'Gujarat',
  district: 'Banaskantha',
  blockTehsil: 'Deesa',
  village: 'Rajpur',
  coordinatesConsent: true,
  latitude: 24.258,
  longitude: 72.181,
  farms: [
    {
      id: 'farm-1',
      farmName: 'Shree Krishna Krishi Farm',
      totalAcres: 5.0,
      plots: [
        {
          id: 'plot-1',
          name: 'Plot 1 - North Orchard',
          areaAcres: 2.5,
          cropCategory: 'Horticulture Fruits',
          cropId: 'pomegranate',
          cropVariety: 'Bhagwa (Sindhuri)',
          growthStage: 'mid_season',
          soilType: 'Sandy Loam',
          irrigationMethod: 'drip',
          existingWaterSource: 'deep_borewell',
          dailyWaterAvailabilityLiters: 1200,
          monthlyWaterExpenseInr: 8500,
          storageCapacityLiters: 10000,
          hasWaterQualityReport: true,
        },
      ],
    },
  ],
};

export default function App() {
  // Navigation State - defaults to 'overview'
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');

  // Core Persistent State
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() =>
    loadStoredData(STORAGE_KEYS.FARM_PROFILE, DEFAULT_FARM_PROFILE)
  );

  const [indianFarmerProfile, setIndianFarmerProfile] = useState<IndianFarmerProfile>(() =>
    loadStoredData('AEROFLORA_INDIAN_FARMER_PROFILE', DEFAULT_INDIAN_FARMER)
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
  const [showAssistantModal, setShowAssistantModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real Firebase Authentication Hook
  const {
    currentUser,
    loading: authLoading,
    needsEmailVerification,
    isSessionUnlocked,
    logout,
  } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Synchronize authenticated user profile to local farmer context
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role) {
        setCurrentRole(currentUser.role);
      }
      if (currentUser.fullName) {
        setIndianFarmerProfile((prev) => ({
          ...prev,
          fullName: currentUser.fullName,
          email: currentUser.email,
          state: currentUser.state || prev.state,
          district: currentUser.district || prev.district,
        }));
      }
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: AuthUser) => {
    showToast(`Verified: ${user.fullName} (${user.loginId})`);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of Firebase. Please sign in to re-enter.');
  };

  // Sync to local storage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.FARM_PROFILE, farmProfile);
  }, [farmProfile]);

  useEffect(() => {
    saveStoredData('AEROFLORA_INDIAN_FARMER_PROFILE', indianFarmerProfile);
  }, [indianFarmerProfile]);

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

  const handleExportCSV = () => {
    const headers = [
      'Hour',
      'Phase',
      'Ambient RH (%)',
      'Tower Temp (°C)',
      'Extraction Rate (L/hr)',
      'Cumulative (L)',
    ];
    const rows = simulation.hourlyCycle.map((h) => [
      h.label,
      h.phase,
      h.ambientRH,
      h.towerTempC,
      h.extractionRateLitersPerHour,
      h.cumulativeLiters,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AeroFlora_Live_Telemetry_${farmProfile.farmName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded');
  };

  // Firebase Authentication Loading Guard
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F6EF] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#173F32] flex items-center justify-center text-white shadow-lg animate-pulse mb-4">
          <Droplets className="w-6 h-6 text-[#A8D5BA]" />
        </div>
        <div className="flex items-center gap-2 text-[#173F32] font-bold text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-[#173F32]" />
          <span>Connecting to AeroFlora Firebase Security...</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-mono">256-bit Cloud Identity Authentication</p>
      </div>
    );
  }

  // Enforce Real Authentication & Email Verification Gate
  // Protected Dashboard is strictly accessible ONLY after real verified authentication
  if (!currentUser || (currentUser && needsEmailVerification)) {
    return (
      <LoginPage
        onSuccess={() => {
          showToast(`Welcome to AeroFlora Systems!`);
        }}
      />
    );
  }

  // Enforce Mandatory Password Security Gate:
  // When an account is selected (from Google, session, or returning after logout),
  // it MUST ask for the password before granting dashboard access!
  if (currentUser && !isSessionUnlocked) {
    return (
      <PasswordUnlockScreen
        user={currentUser}
        onUnlock={() => {
          showToast(`Welcome back, ${currentUser.fullName}!`);
        }}
        onCancel={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar with 13 Modules & Multi-Language Selector */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        currentRole={currentRole}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenAssistant={() => setShowAssistantModal(true)}
        authUser={currentUser}
        onOpenAuthModal={(mode = 'signin') => {
          setAuthModalMode(mode);
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
      />

      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Module 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            simulation={simulation}
            farmProfile={farmProfile}
            businessInputs={businessInputs}
            environmentalConditions={environmentalConditions}
            currentLanguage={currentLanguage}
            onNavigateTab={setActiveTab}
            onOpenAssistant={() => setShowAssistantModal(true)}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Module 2: Farmer Registration and My Farm */}
        {activeTab === 'farmer_farm' && (
          <FarmerRegistrationMyFarm
            farmerProfile={indianFarmerProfile}
            onUpdateFarmerProfile={setIndianFarmerProfile}
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Module 3: Water Intelligence */}
        {activeTab === 'water_intel' && (
          <WaterIntelligenceView
            currentLanguage={currentLanguage}
            onApplyConditionsToSimulator={(rh, tempC) => {
              setEnvironmentalConditions((prev) => ({
                ...prev,
                ambientRelativeHumidity: rh,
                daytimePeakTempC: tempC,
              }));
              setActiveTab('simulator');
            }}
            onShowToast={showToast}
          />
        )}

        {/* Module 4: AeroFlora Live Simulator */}
        {(activeTab === 'simulator' || activeTab === 'live') && (
          <AeroFloraEngineeringSimulator
            currentLanguage={currentLanguage}
            onShowToast={showToast}
            onApplyArrayUnitsToSystem={(units) => {
              setEnvironmentalConditions((prev) => ({ ...prev, towerUnits: units }));
            }}
          />
        )}

        {/* Module 5: Biomimetic 24-Hour Engine */}
        {activeTab === 'cycle' && (
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
        )}

        {/* Module 6: Crop Water Planner */}
        {activeTab === 'crop_planner' && (
          <CropWaterPlannerView
            currentLanguage={currentLanguage}
            onApplyTowerUnitsToSimulator={(units) => {
              setEnvironmentalConditions((prev) => ({ ...prev, towerUnits: units }));
              setActiveTab('simulator');
            }}
            onShowToast={showToast}
          />
        )}

        {/* Module 7: Water Quality and Mineralisation */}
        {activeTab === 'mineralization' && (
          <WaterQualityMineralisationView
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Module 8: Financial Planner and ROI */}
        {activeTab === 'roi' && (
          <FinancialPlannerROIView
            currentLanguage={currentLanguage}
            towerUnits={environmentalConditions.towerUnits}
            onShowToast={showToast}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Module 9: Tower and Equipment Management */}
        {activeTab === 'equipment' && (
          <TowerEquipmentManagementView
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Module 10: Community and FPO Network */}
        {activeTab === 'community' && (
          <CommunityFPONetworkView
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Module 11: Reports and Documents */}
        {activeTab === 'reports' && (
          <ReportsDocumentsView
            simulation={simulation}
            farmProfile={farmProfile}
            businessInputs={businessInputs}
            environmentalConditions={environmentalConditions}
            currentLanguage={currentLanguage}
            onShowToast={showToast}
            onOpenAuditModal={() => setShowReportModal(true)}
          />
        )}

        {/* Module 12: Help and Support */}
        {activeTab === 'help' && (
          <HelpSupportView
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Module 13: Admin and System Management */}
        {activeTab === 'admin' && (
          <AdminSystemManagementView
            currentRole={currentRole}
            onChangeRole={setCurrentRole}
            currentLanguage={currentLanguage}
            onShowToast={showToast}
          />
        )}

        {/* Specialized Results & Decisions View */}
        {activeTab === 'results' && (
          <ResultsDisplayView
            simulation={simulation}
            farmProfile={farmProfile}
            businessInputs={businessInputs}
            environmentalConditions={environmentalConditions}
            onOpenReport={() => setShowReportModal(true)}
            onExportCSV={handleExportCSV}
            onOpenArrayMatrix={() => setShowComparisonModal(true)}
            onSaveScenario={handleSaveScenario}
          />
        )}
      </main>

      {/* Operational Footer */}
      <footer className="mt-12 bg-emerald-950 text-white border-t border-emerald-900 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AeroFlora Systems</span>
            <span className="text-emerald-400">·</span>
            <span className="text-emerald-200">Farm Water Intelligence · Designed for India</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300 font-mono text-[11px]">
            <span>PM-KUSUM Agri-Infra</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Academic Dossier &amp; Audit
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowDeployModal(true)}
              className="text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Vercel Deployment
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
          setActiveTab('simulator');
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
          setActiveTab('simulator');
        }}
      />

      <KisanJalSaathiModal
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        currentLanguage={currentLanguage}
        contextData={{
          district: indianFarmerProfile.district,
          crop: indianFarmerProfile.farms[0]?.plots[0]?.cropId,
          acres: indianFarmerProfile.farms[0]?.totalAcres,
          dailyHarvestLiters: simulation.totalDailyLiters,
        }}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
        isMandatoryGate={false}
      />
    </div>
  );
}
