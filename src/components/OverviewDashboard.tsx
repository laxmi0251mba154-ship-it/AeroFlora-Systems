import React, { useState } from 'react';
import {
  Droplets,
  Sun,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Compass,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { SimulationResult, FarmProfile, BusinessInputs, EnvironmentalConditions } from '../types/aeroflora';
import { INDIAN_AGRICULTURAL_ZONES, DistrictWaterProfile } from '../utils/indianGeography';
import { IMAGES } from '../assets/images';
import { SupportedLanguage, TRANSLATIONS } from '../utils/i18n';

interface OverviewDashboardProps {
  simulation: SimulationResult;
  farmProfile: FarmProfile;
  businessInputs: BusinessInputs;
  environmentalConditions: EnvironmentalConditions;
  currentLanguage: SupportedLanguage;
  onNavigateTab: (tabKey: string) => void;
  onSelectDistrictProfile?: (district: DistrictWaterProfile) => void;
  onOpenAssistant: () => void;
  onOpenReport: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  simulation,
  farmProfile,
  businessInputs,
  environmentalConditions,
  currentLanguage,
  onNavigateTab,
  onSelectDistrictProfile,
  onOpenAssistant,
  onOpenReport,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);
  const [selectedDistrictName, setSelectedDistrictName] = useState('Barmer');

  const currentState = INDIAN_AGRICULTURAL_ZONES[selectedStateIndex] || INDIAN_AGRICULTURAL_ZONES[0];
  const activeDistrict =
    currentState.districts.find((d) => d.district === selectedDistrictName) || currentState.districts[0];

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrictName(districtName);
    const dist = currentState.districts.find((d) => d.district === districtName);
    if (dist && onSelectDistrictProfile) {
      onSelectDistrictProfile(dist);
    }
  };

  const handleStateChange = (stateIndex: number) => {
    setSelectedStateIndex(stateIndex);
    const newState = INDIAN_AGRICULTURAL_ZONES[stateIndex];
    if (newState && newState.districts.length > 0) {
      setSelectedDistrictName(newState.districts[0].district);
      if (onSelectDistrictProfile) {
        onSelectDistrictProfile(newState.districts[0]);
      }
    }
  };

  // 450 Litres validation ratio
  const validationPct = Math.min(100, Math.round((simulation.dailyLitersPerTower / 450) * 100));

  return (
    <div className="space-y-6">
      {/* Hero Banner: India-First Water Intelligence Platform */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-sky-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>India-First AgriTech &amp; WaterTech Intelligence</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-mono">PM-KUSUM Compatible</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>AeroFlora Systems</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">Mk-IV OS</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Autonomous, solar-thermal atmospheric water harvesting designed for arid and semi-arid Indian
              agriculture. Powered by advanced metal-organic frameworks (MOFs), passive condensation, and balanced
              solar remineralization.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('simulator')}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Engineering Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenAssistant}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-sky-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Ask Kisan Jal Saathi (AI)</span>
              </button>
              <button
                onClick={onOpenReport}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Audit Report &amp; Dossier</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Real-Time Metric Block */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 min-w-[280px] lg:w-80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                <Droplets className="w-4 h-4 text-sky-400" />
                Today's AWH Generation
              </span>
              <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                TELEMETRY ACTIVE
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {simulation.totalDailyLiters.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-sky-400">Litres/day</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From {environmentalConditions.towerUnits} tower unit(s) ·{' '}
                <span className="text-slate-200 font-mono font-medium">{(simulation.totalDailyLiters / 1000).toFixed(2)} kL/day</span>
              </p>
            </div>

            {/* Validation Target Progress (450 L/day target) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Per-Tower Validation Target</span>
                <span className="font-mono font-bold text-sky-300">
                  {simulation.dailyLitersPerTower.toFixed(1)} / 450 L ({validationPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    validationPct >= 100
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                      : 'bg-gradient-to-r from-amber-400 to-sky-400'
                  }`}
                  style={{ width: `${validationPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                {validationPct >= 100
                  ? '✓ Meets 450 L/day validation benchmark under current psychrometric regime.'
                  : '! Sorbent mass or desorption cycle can be tuned in the simulator.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agro-Climatic Zone & Groundwater Intelligence Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              India Agro-Climatic Zone &amp; Groundwater Status
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              CGWB / IMD Grounded
            </span>
          </div>

          {/* State & District Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStateIndex}
              onChange={(e) => handleStateChange(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {INDIAN_AGRICULTURAL_ZONES.map((zone, idx) => (
                <option key={zone.code} value={idx}>
                  {zone.state}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrictName}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {currentState.districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected District Real Intelligence Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block">Summer Ambient RH</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {activeDistrict.avgSummerRH}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">IMD Pune Normal</span>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block">Peak Temperature</span>
            <span className="text-lg font-bold text-amber-600 font-mono">
              {activeDistrict.avgSummerTempC}°C
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">High Diurnal Swing</span>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block">Solar Irradiance</span>
            <span className="text-lg font-bold text-sky-700 font-mono">
              {activeDistrict.avgSolarRadiationKWhM2Day} <span className="text-xs font-normal">kWh/m²</span>
            </span>
            <span className="text-[10px] text-sky-600 font-medium block mt-0.5">Ideal for Desorption</span>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block">CGWB Water Table</span>
            <span className="text-lg font-bold text-rose-600 font-mono">
              {activeDistrict.groundwaterDepthMeters} m
            </span>
            <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
              {activeDistrict.groundwaterCategory}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium block">Monsoon Rainfall</span>
            <span className="text-lg font-bold text-cyan-700 font-mono">
              {activeDistrict.monsoonRainfallMm} mm
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Annual Precipitation</span>
          </div>

          <div className="bg-sky-50/70 rounded-lg p-3 border border-sky-200">
            <span className="text-[11px] text-sky-800 font-semibold block">AWH Suitability</span>
            <span className="text-lg font-extrabold text-sky-950 font-mono">
              {activeDistrict.awhSuitability}
            </span>
            <span className="text-[10px] text-sky-700 block mt-0.5 truncate" title={activeDistrict.suitabilityReason}>
              {activeDistrict.suitabilityReason.slice(0, 32)}...
            </span>
          </div>
        </div>

        <div className="text-xs bg-slate-50 text-slate-700 rounded-lg p-3 border border-slate-200/90 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-900">AgriTech Feasibility Note for {activeDistrict.district}, {activeDistrict.state}:</span>{' '}
            {activeDistrict.suitabilityReason} Primary crops cultivated in this belt include:{' '}
            <span className="font-semibold text-slate-800">{activeDistrict.primaryCrops.join(', ')}</span>.
          </p>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Water Harvesting */}
        <div
          onClick={() => onNavigateTab('simulator')}
          className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-sky-500 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Configure <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
              AeroFlora Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              MOF-801 sorption thermodynamics, solar regeneration core, and passive condenser yield sizing.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Net Array Output</span>
            <span className="font-bold text-sky-700">
              {simulation.totalDailyLiters} L/day
            </span>
          </div>
        </div>

        {/* Pillar 2: Crop Water Planner */}
        <div
          onClick={() => onNavigateTab('crop_planner')}
          className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Plan <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
              Crop Water Planner
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              FAO-56 Penman-Monteith crop coefficients (Kc) for 15 Indian crops across 4 growth stages.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Irrigation Mode</span>
            <span className="font-bold text-indigo-700">Precision Drip (90% Eff.)</span>
          </div>
        </div>

        {/* Pillar 3: Water Quality & Minerals */}
        <div
          onClick={() => onNavigateTab('mineralization')}
          className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-xs font-semibold text-cyan-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Analyze <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700">
              Water Quality &amp; Minerals
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sodium Adsorption Ratio (SAR), RSC, EC salinity hazards, and calcite/dolomite mineralization.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Output Salinity</span>
            <span className="font-bold text-cyan-700">Non-Saline (0.3 dS/m)</span>
          </div>
        </div>

        {/* Pillar 4: Financial ROI & Subsidies */}
        <div
          onClick={() => onNavigateTab('roi')}
          className="group bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Calculate <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              Financial ROI &amp; Subsidies
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              PM-KUSUM 30-50% subsidy deductions, private tanker replacement savings, and 5-yr NPV/IRR.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Payback Period</span>
            <span className="font-bold text-emerald-700">
              {simulation.paybackPeriodMonths} Months
            </span>
          </div>
        </div>
      </div>

      {/* Engineering Showcase & System Schematics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Precision Farmland Visual */}
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-48 bg-slate-950">
            <img
              src={IMAGES.farmAerial}
              alt="AeroFlora Precision Irrigated Farm Deployment"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/90 text-slate-950 font-bold uppercase tracking-wider">
                Precision Ag Network
              </span>
              <h4 className="text-sm font-bold mt-1">Smart Orchard &amp; Reservoir Array</h4>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Autonomous atmospheric moisture feeding central solar retention tanks. Monitored through low-power LoRaWAN field sensors for real-time root-zone moisture targeting.
            </p>
            <button
              onClick={() => onNavigateTab('equipment')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Tower Telemetry &amp; IoT</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Solar Mineralization & Condensation Core */}
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-48 bg-slate-950">
            <img
              src={IMAGES.solarTowerMacro}
              alt="AeroFlora Micro-Channel Heat Exchanger Core"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/90 text-slate-950 font-bold uppercase tracking-wider">
                Condensation Core
              </span>
              <h4 className="text-sm font-bold mt-1">Micro-Channel Sorbent Exchanger</h4>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Pure condensed atmospheric moisture has near-zero ionic content. The inline calcite &amp; dolomite bed enriches pure condensate with 55 mg/L Ca and 18 mg/L Mg for balanced crop osmotic health.
            </p>
            <button
              onClick={() => onNavigateTab('mineralization')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inspect Mineral Ionic Balances</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* FPO & Community Water Sharing */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Village &amp; FPO Cooperative Model</span>
            </div>
            <h4 className="text-base font-bold text-white mt-2">
              Community Water Token Distribution
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Designed for Indian Farmer Producer Organisations (FPOs) and Gram Panchayats. Smallholders pool resources to co-own an AeroFlora tower array, distributing daily harvest via transparent water tokens.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800 font-mono">
                <span className="text-slate-400">Target User Base</span>
                <span className="font-semibold text-white">Small &amp; Marginal Farmers (1-5 Ac)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800 font-mono">
                <span className="text-slate-400">PM-KUSUM Subsidy</span>
                <span className="font-semibold text-emerald-400">30% - 50% Component B</span>
              </div>
              <div className="flex items-center justify-between py-1.5 font-mono">
                <span className="text-slate-400">Private Tanker Replacement</span>
                <span className="font-semibold text-white">₹1,200 - ₹2,200 / 5kL</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('community')}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Explore FPO Cooperative Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
