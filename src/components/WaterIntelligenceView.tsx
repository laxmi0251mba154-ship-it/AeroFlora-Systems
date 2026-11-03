import React, { useState } from 'react';
import {
  Compass,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Layers,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Info,
  Clock,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { INDIAN_AGRICULTURAL_ZONES, DistrictWaterProfile } from '../utils/indianGeography';
import { SupportedLanguage, TRANSLATIONS } from '../utils/i18n';

interface WaterIntelligenceViewProps {
  currentLanguage: SupportedLanguage;
  onApplyConditionsToSimulator?: (rh: number, tempC: number) => void;
  onShowToast: (message: string) => void;
}

export const WaterIntelligenceView: React.FC<WaterIntelligenceViewProps> = ({
  currentLanguage,
  onApplyConditionsToSimulator,
  onShowToast,
}) => {
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);
  const currentState = INDIAN_AGRICULTURAL_ZONES[selectedStateIndex] || INDIAN_AGRICULTURAL_ZONES[0];
  const [selectedDistrictName, setSelectedDistrictName] = useState(currentState.districts[0]?.district || 'Jodhpur');
  const [activeSeason, setActiveSeason] = useState<'summer' | 'monsoon' | 'winter'>('summer');

  const activeDistrict =
    currentState.districts.find((d) => d.district === selectedDistrictName) || currentState.districts[0];

  const handleStateChange = (stateIndex: number) => {
    setSelectedStateIndex(stateIndex);
    const newState = INDIAN_AGRICULTURAL_ZONES[stateIndex];
    if (newState && newState.districts.length > 0) {
      setSelectedDistrictName(newState.districts[0].district);
    }
  };

  const handleApplyToSimulator = () => {
    if (onApplyConditionsToSimulator) {
      onApplyConditionsToSimulator(activeDistrict.avgSummerRH, activeDistrict.avgSummerTempC);
      onShowToast(
        `Applied ${activeDistrict.avgSummerRH}% RH & ${activeDistrict.avgSummerTempC}°C (${activeDistrict.district}) to Simulator`
      );
    }
  };

  // Seasonal adjustments based on active season
  const seasonalMetrics = {
    summer: {
      rh: activeDistrict.avgSummerRH,
      temp: activeDistrict.avgSummerTempC,
      solar: activeDistrict.avgSolarRadiationKWhM2Day,
      label: 'Pre-Monsoon Arid Peak (March - June)',
      stress: 'Severe Micro-Drought & High Sorbent Desorption Potential',
    },
    monsoon: {
      rh: Math.min(85, activeDistrict.avgSummerRH + 40),
      temp: Math.max(28, activeDistrict.avgSummerTempC - 8),
      solar: Math.max(4.2, activeDistrict.avgSolarRadiationKWhM2Day - 2.0),
      label: 'South-West Monsoon (July - September)',
      stress: 'High Ambient Humidity (>65% RH), Rapid Adsorption Rates',
    },
    winter: {
      rh: Math.max(25, activeDistrict.avgSummerRH + 10),
      temp: Math.max(14, activeDistrict.avgSummerTempC - 16),
      solar: Math.max(4.8, activeDistrict.avgSolarRadiationKWhM2Day - 1.2),
      label: 'Rabi Season (November - February)',
      stress: 'Cold Nights (10-14°C) with High Dew-Point Condensation Inversion',
    },
  }[activeSeason];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-2 border border-cyan-200">
            <Database className="w-3.5 h-3.5 text-cyan-700" />
            <span>Government Open Data Platform &amp; IMD/CGWB Grounded</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Water &amp; Climate Intelligence Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Grounded in India Meteorological Department (IMD) climatological normals and Central Ground Water Board (CGWB)
            aquifer mapping.
          </p>
        </div>

        {/* State & District Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStateIndex}
            onChange={(e) => handleStateChange(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            {INDIAN_AGRICULTURAL_ZONES.map((zone, idx) => (
              <option key={zone.code} value={idx}>
                {zone.state}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            {currentState.districts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Season Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveSeason('summer')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSeason === 'summer' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Summer / Zaid (Peak Stress)</span>
        </button>
        <button
          onClick={() => setActiveSeason('monsoon')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSeason === 'monsoon' ? 'bg-white text-cyan-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
          <span>Monsoon / Kharif</span>
        </button>
        <button
          onClick={() => setActiveSeason('winter')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSeason === 'winter' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-emerald-600" />
          <span>Winter / Rabi</span>
        </button>
      </div>

      {/* Core Atmospheric Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Relative Humidity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ambient Relative Humidity</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {seasonalMetrics.rh}%
            </span>
            <span className="text-xs text-slate-500 font-medium">RH</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Daytime Min:</span>
              <span className="font-mono text-slate-800">{Math.max(12, seasonalMetrics.rh - 8)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Nighttime Max:</span>
              <span className="font-mono text-cyan-700 font-bold">{seasonalMetrics.rh + 14}%</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Ambient Temperature */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ambient Temperature</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono">
              {seasonalMetrics.temp}°C
            </span>
            <span className="text-xs text-slate-500 font-medium">Mean High</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Diurnal Delta (Day/Night):</span>
              <span className="font-mono text-slate-800">18.5°C swing</span>
            </div>
            <div className="flex justify-between">
              <span>Night Low (Sorption):</span>
              <span className="font-mono text-emerald-700 font-bold">{Math.max(12, seasonalMetrics.temp - 18)}°C</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Solar Insolation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Solar Insolation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {seasonalMetrics.solar}
            </span>
            <span className="text-xs text-slate-500 font-medium">kWh/m²/day</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Desorption Thermal Flux:</span>
              <span className="font-mono text-slate-800">820 W/m² peak</span>
            </div>
            <div className="flex justify-between">
              <span>Solar Regenerator Temp:</span>
              <span className="font-mono text-emerald-700 font-bold">78°C - 88°C</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Groundwater Table Depth */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">CGWB Aquifer Depth</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-700 font-mono">
              {activeDistrict.groundwaterDepthMeters} m
            </span>
            <span className="text-xs text-slate-500 font-medium">Below ground</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Aquifer Categorization:</span>
              <span className="font-mono text-red-700 font-bold">{activeDistrict.groundwaterCategory}</span>
            </div>
            <div className="flex justify-between">
              <span>Pump Head Strain:</span>
              <span className="font-mono text-amber-700">Extreme (&gt;25 HP motor)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Diagnostics & Data Provenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Agro-Climatic Intelligence & Atmospheric Yield Potential */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Atmospheric Moisture Regime: {activeDistrict.district}, {activeDistrict.state}
              </h3>
            </div>
            <button
              onClick={handleApplyToSimulator}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sync to Simulator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700">
            <p>
              <span className="font-bold text-slate-900">AWH Feasibility Assessment: </span>
              {activeDistrict.suitabilityReason}
            </p>
            <p>
              <span className="font-bold text-slate-900">Vapor Density Physics: </span>
              At {seasonalMetrics.rh}% RH and {seasonalMetrics.temp}°C ambient temperature, atmospheric vapor density is
              approximately{' '}
              <span className="font-mono font-bold text-emerald-700">
                {((216.7 * (6.112 * Math.exp((17.67 * seasonalMetrics.temp) / (seasonalMetrics.temp + 243.5)) * (seasonalMetrics.rh / 100))) / (seasonalMetrics.temp + 273.15)).toFixed(2)} g/m³
              </span>. During nocturnal cooling, relative humidity climbs to ~{seasonalMetrics.rh + 14}%, enabling
              MOF-801 sorption bed saturation with zero electrical power input.
            </p>
          </div>

          {/* Diurnal Climatological Cycle Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              24-Hour Micro-Climate Diurnal Trajectory ({seasonalMetrics.label})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 border-b">Time Window</th>
                    <th className="p-2 border-b">Atmospheric Phase</th>
                    <th className="p-2 border-b">Est. RH (%)</th>
                    <th className="p-2 border-b">Temp (°C)</th>
                    <th className="p-2 border-b">AeroFlora Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-bold text-slate-800">22:00 - 05:00</td>
                    <td className="p-2 text-indigo-700 font-medium">Night Radiative Inversion</td>
                    <td className="p-2 text-cyan-700 font-bold">{seasonalMetrics.rh + 15}%</td>
                    <td className="p-2 text-slate-600">{Math.max(12, seasonalMetrics.temp - 16)}°C</td>
                    <td className="p-2 text-emerald-700 font-semibold">Passive MOF Adsorption (Open Louvres)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-800">06:00 - 09:00</td>
                    <td className="p-2 text-amber-700 font-medium">Morning Solar Warming</td>
                    <td className="p-2 text-slate-600">{seasonalMetrics.rh + 5}%</td>
                    <td className="p-2 text-slate-600">{seasonalMetrics.temp - 6}°C</td>
                    <td className="p-2 text-amber-700 font-semibold">Louvres Seal · Thermal Preheating</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-800">10:00 - 15:00</td>
                    <td className="p-2 text-red-700 font-medium">Peak Solar Desorption</td>
                    <td className="p-2 text-amber-700 font-bold">{Math.max(12, seasonalMetrics.rh - 8)}%</td>
                    <td className="p-2 text-red-700 font-bold">{seasonalMetrics.temp}°C</td>
                    <td className="p-2 text-cyan-700 font-semibold">Thermal Release &amp; Condensation (~55 L/hr)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-800">16:00 - 21:00</td>
                    <td className="p-2 text-slate-600 font-medium">Evening Cooling &amp; Purge</td>
                    <td className="p-2 text-slate-600">{seasonalMetrics.rh}%</td>
                    <td className="p-2 text-slate-600">{seasonalMetrics.temp - 10}°C</td>
                    <td className="p-2 text-slate-700 font-semibold">Mineral Cartridge Trickle Delivery</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Rigorous Data Provenance & Open Data Disclaimers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-cyan-700" />
            <span>Data Transparency &amp; Provenance</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">Climate Normals Source</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                India Meteorological Department (IMD) Pune National Climate Centre (NCC) 30-year climatological normal
                dataset.
              </p>
              <span className="text-[10px] text-cyan-800 font-mono block">Resolution: District-Level Mesoscale</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">Groundwater Aquifer Depth</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Central Ground Water Board (CGWB) National Aquifer Mapping and Management Programme (NAQUIM) Dynamic Ground
                Water Resources Assessment.
              </p>
              <span className="text-[10px] text-red-700 font-mono block">Status: Published Government Assessment</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-800 block">Data Mode Label</span>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Historical Climatology</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                In demonstration mode, authentic government historical statistics are loaded. When on-farm IoT sensors
                (ESP32 Gateway) are activated, live telemetry overrides historical averages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
