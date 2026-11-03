import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sprout,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  Gauge,
} from 'lucide-react';
import { INDIAN_CROPS, IndianCropProfile, CropGrowthStage } from '../utils/fao56CropWater';
import { INDIAN_AGRICULTURAL_ZONES } from '../utils/indianGeography';
import { SupportedLanguage } from '../utils/i18n';

interface CropWaterPlannerViewProps {
  currentLanguage: SupportedLanguage;
  onApplyTowerUnitsToSimulator?: (units: number) => void;
  onShowToast: (message: string) => void;
}

export const CropWaterPlannerView: React.FC<CropWaterPlannerViewProps> = ({
  currentLanguage,
  onApplyTowerUnitsToSimulator,
  onShowToast,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('pomegranate');
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<'initial' | 'development' | 'mid_season' | 'late_season'>('mid_season');
  const [cropAreaAcres, setCropAreaAcres] = useState<number>(2.0);
  const [irrigationMethod, setIrrigationMethod] = useState<'drip' | 'sprinkler' | 'flood'>('drip');
  const [existingWaterAvailableLiters, setExistingWaterAvailableLiters] = useState<number>(1500); // L/day from borewell
  const [referenceEt0MmDay, setReferenceEt0MmDay] = useState<number>(5.8); // mm/day (typical summer in semi-arid India)

  const activeCrop = INDIAN_CROPS.find((c) => c.id === selectedCropId) || INDIAN_CROPS[0];
  const activeStageObj =
    activeCrop.stages.find((s) => s.stage === selectedGrowthStage) || activeCrop.stages[2];

  // Irrigation efficiency factors
  const irrigationEfficiency = {
    drip: 0.90,
    sprinkler: 0.75,
    flood: 0.50,
  }[irrigationMethod];

  // Calculations based on FAO-56
  // ETc = Kc * ET0 (mm/day)
  // 1 mm of water over 1 acre = 4,046.86 Litres
  const results = useMemo(() => {
    const kc = activeStageObj.kc;
    const cropEtcMmDay = kc * referenceEt0MmDay;

    // Litres per acre per day = mm/day * 4046.86
    const netCropDemandLitersPerAcre = cropEtcMmDay * 4046.86;
    const totalNetCropDemandLiters = netCropDemandLitersPerAcre * cropAreaAcres;

    // Gross irrigation demand taking application efficiency into account
    const grossIrrigationRequiredLiters = totalNetCropDemandLiters / irrigationEfficiency;

    // Deficit calculation
    const waterDeficitLiters = Math.max(0, grossIrrigationRequiredLiters - existingWaterAvailableLiters);
    const deficitPercentage = Math.min(100, Math.round((waterDeficitLiters / grossIrrigationRequiredLiters) * 100));

    // AeroFlora Tower offset sizing (assume nominal ~450 L/day validation benchmark per tower)
    const towerLitersAssumed = 450;
    const towersNeededForZeroDeficit = Math.ceil(waterDeficitLiters / towerLitersAssumed);
    const offsetPercentageWithTwoTowers = Math.min(100, Math.round(((towerLitersAssumed * 2) / Math.max(1, waterDeficitLiters)) * 100));

    return {
      kc,
      cropEtcMmDay,
      netCropDemandLitersPerAcre,
      totalNetCropDemandLiters,
      grossIrrigationRequiredLiters,
      waterDeficitLiters,
      deficitPercentage,
      towersNeededForZeroDeficit,
      offsetPercentageWithTwoTowers,
    };
  }, [
    activeStageObj,
    referenceEt0MmDay,
    cropAreaAcres,
    irrigationEfficiency,
    existingWaterAvailableLiters,
  ]);

  const handleApplyTowers = () => {
    if (onApplyTowerUnitsToSimulator) {
      onApplyTowerUnitsToSimulator(results.towersNeededForZeroDeficit);
      onShowToast(`Configured ${results.towersNeededForZeroDeficit} AeroFlora Towers to offset crop water deficit`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Sprout className="w-3.5 h-3.5 text-teal-700" />
            <span>FAO Irrigation &amp; Drainage Paper 56 Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Crop Evapotranspiration &amp; Water Deficit Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate precise crop water requirements ($ET_c$) across growth stages and size AeroFlora towers to
            protect high-value orchards from moisture stress.
          </p>
        </div>

        {results.waterDeficitLiters > 0 && (
          <button
            onClick={handleApplyTowers}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <span>Size {results.towersNeededForZeroDeficit} Towers for Deficit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Crop Demand */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Gross Irrigation Required</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {Math.round(results.grossIrrigationRequiredLiters).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600">L / day</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Across {cropAreaAcres} Acres ({(cropAreaAcres * 0.404686).toFixed(2)} ha)
          </span>
        </div>

        {/* Existing Water Available */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Borewell / Source Supply</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-700 font-mono">
              {existingWaterAvailableLiters.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600">L / day</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Current Farm Borewell Pumping
          </span>
        </div>

        {/* Critical Net Deficit */}
        <div className={`rounded-xl border p-5 shadow-sm space-y-2 ${
          results.waterDeficitLiters > 0 ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Net Moisture Deficit</span>
            {results.waterDeficitLiters > 0 ? (
              <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                DROUGHT RISK
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                SURPLUS
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              results.waterDeficitLiters > 0 ? 'text-red-700' : 'text-emerald-700'
            }`}>
              {Math.round(results.waterDeficitLiters).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600">L / day deficit</span>
          </div>
          <span className="text-[11px] text-slate-600 block pt-1 border-t border-slate-200/60">
            {results.waterDeficitLiters > 0
              ? `${results.deficitPercentage}% deficit during critical stage`
              : 'Existing supply satisfies crop demand'}
          </span>
        </div>

        {/* AeroFlora Sizing Recommendation */}
        <div className="bg-emerald-950 text-white rounded-xl border border-emerald-800 p-5 shadow-sm space-y-2">
          <span className="text-xs text-emerald-300 font-medium">AeroFlora Offset Required</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {results.towersNeededForZeroDeficit}
            </span>
            <span className="text-xs font-semibold text-emerald-300">Tower Unit(s)</span>
          </div>
          <span className="text-[11px] text-emerald-300/80 block pt-1 border-t border-emerald-800">
            Replaces {(results.waterDeficitLiters / 5000 * 30).toFixed(1)} water tankers/month
          </span>
        </div>
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Crop & Agronomic Inputs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Select Indian Crop &amp; Growth Stage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Crop Selector */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Crop Selection ({INDIAN_CROPS.length} Crops Available)
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer focus:ring-2 focus:ring-emerald-600"
              >
                {INDIAN_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.hindiName} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Growth Stage Selector */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Crop Growth Stage</label>
              <select
                value={selectedGrowthStage}
                onChange={(e) =>
                  setSelectedGrowthStage(
                    e.target.value as 'initial' | 'development' | 'mid_season' | 'late_season'
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer focus:ring-2 focus:ring-emerald-600"
              >
                {activeCrop.stages.map((stage) => (
                  <option key={stage.stage} value={stage.stage}>
                    {stage.name} (Kc = {stage.kc}, {stage.durationDays} days)
                  </option>
                ))}
              </select>
            </div>

            {/* Acreage Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Planted Area (Acres)</label>
                <span className="font-mono font-bold text-emerald-700">
                  {cropAreaAcres} Acres ({(cropAreaAcres * 0.404686).toFixed(2)} ha)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={cropAreaAcres}
                onChange={(e) => setCropAreaAcres(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Irrigation Method */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Irrigation Method &amp; Efficiency</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as 'drip' | 'sprinkler' | 'flood')}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer focus:ring-2 focus:ring-emerald-600"
              >
                <option value="drip">Drip Irrigation (90% Application Efficiency)</option>
                <option value="sprinkler">Micro-Sprinkler (75% Application Efficiency)</option>
                <option value="flood">Flood / Furrow (50% Application Efficiency - High Losses)</option>
              </select>
            </div>

            {/* Reference ET0 Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Reference Evapotranspiration ($ET_0$)</label>
                <span className="font-mono font-bold text-amber-700">{referenceEt0MmDay} mm/day</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="9.0"
                step="0.1"
                value={referenceEt0MmDay}
                onChange={(e) => setReferenceEt0MmDay(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Indian summer averages: 5.5 - 7.5 mm/day
              </span>
            </div>

            {/* Existing Borewell Pumping Supply */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Existing Farm Water Supply (L/day)</label>
                <span className="font-mono font-bold text-cyan-700">
                  {existingWaterAvailableLiters.toLocaleString()} L/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="250"
                value={existingWaterAvailableLiters}
                onChange={(e) => setExistingWaterAvailableLiters(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Scientific Agronomic Notes */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Agronomic Vulnerability: {activeCrop.name}</span>
            </div>
            <p className="leading-relaxed">{activeCrop.description}</p>
            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-emerald-700 block text-[10px]">Critical Water Stress Stage:</span>
                <span className="font-bold text-emerald-950">{activeCrop.criticalDeficitStage}</span>
              </div>
              <div>
                <span className="text-emerald-700 block text-[10px]">Salinity Sensitivity:</span>
                <span className="font-bold text-emerald-950">{activeCrop.salinitySensitivity}</span>
              </div>
              <div>
                <span className="text-emerald-700 block text-[10px]">Max Soil TDS Tolerated:</span>
                <span className="font-bold text-emerald-950">{activeCrop.maxTdsPpm} ppm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FAO-56 Methodology & Tower Deficit Offset */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-cyan-700" />
            <span>FAO-56 Methodology &amp; Offset</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <span className="font-bold text-slate-800 block">Calculation Formula</span>
              <p>ETc = Kc × ET0 (mm/day)</p>
              <p>Gross = (ETc × 4046.86 × Acres) / Irrigation Efficiency</p>
              <div className="pt-1 text-[10px] text-slate-500">
                Current Kc = {results.kc} · ETc = {results.cropEtcMmDay.toFixed(2)} mm/day
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">Why AeroFlora Offset Matters</span>
              <p className="text-[11px]">
                In deep borewell zones where water tables exceed 60m, pump failure during the 45-day flowering/fruit
                setting stage causes irreversible flower drop and fruit cracking.
              </p>
              <p className="text-[11px] text-emerald-800 font-medium">
                AeroFlora provides autonomous, guaranteed moisture directly connected to high-precision root drippers
                independent of grid power.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
