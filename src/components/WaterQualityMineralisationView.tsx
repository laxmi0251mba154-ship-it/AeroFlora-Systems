import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Droplets,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
  Beaker,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  WaterQualitySample,
  calculateWaterQualityAssessment,
  BENCHMARK_WATER_SAMPLES,
  EQUIVALENT_WEIGHTS,
} from '../utils/waterQualityAnalysis';
import { SupportedLanguage } from '../utils/i18n';

interface WaterQualityMineralisationViewProps {
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

export const WaterQualityMineralisationView: React.FC<WaterQualityMineralisationViewProps> = ({
  currentLanguage,
  onShowToast,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('s-aeroflora-mineralized');
  const [sample, setSample] = useState<WaterQualitySample>(() => BENCHMARK_WATER_SAMPLES[0]);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = BENCHMARK_WATER_SAMPLES.find((s) => s.id === presetId);
    if (found) {
      setSample({ ...found });
      onShowToast(`Loaded "${found.sourceName}" preset`);
    }
  };

  // Run comprehensive assessment calculations
  const assessment = useMemo(() => calculateWaterQualityAssessment(sample), [sample]);

  const handleUpdateParameter = (param: keyof WaterQualitySample, val: number) => {
    setSample((prev) => ({
      ...prev,
      [param]: val,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-2 border border-cyan-200">
            <Beaker className="w-3.5 h-3.5 text-cyan-700" />
            <span>Agricultural Hydrochemistry Laboratory Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Water Quality &amp; Solar Mineralization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assess Sodium Adsorption Ratio (SAR), Residual Sodium Carbonate (RSC), and calibrate multi-stage calcite/dolomite
            remineralization to prevent soil sodicity and emitter clogging.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {BENCHMARK_WATER_SAMPLES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {preset.sourceName}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Assessment Status Banner */}
      <div
        className={`rounded-xl border p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
          assessment.overallCropSuitability === 'Excellent'
            ? 'bg-emerald-950 text-white border-emerald-800'
            : assessment.overallCropSuitability === 'Good with Leaching'
            ? 'bg-amber-950 text-white border-amber-800'
            : 'bg-red-950 text-white border-red-800'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-200 font-bold">
              Agronomic Suitability Rating
            </span>
            <span className="text-xs font-mono text-emerald-300">
              {sample.isLaboratoryCertified ? '✓ Lab Certified Sample' : 'Simulated Specimen'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold">{assessment.overallCropSuitability} for Arid Horticulture</h2>
          <p className="text-xs text-white/80 leading-relaxed max-w-2xl">
            {assessment.agronomicRecommendation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono shrink-0">
          <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10">
            <span className="text-white/70 block text-[10px]">SAR Ratio</span>
            <span className="text-lg font-bold text-white">{assessment.sar.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-300 block">{assessment.infiltrationHazard} hazard</span>
          </div>

          <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10">
            <span className="text-white/70 block text-[10px]">RSC Index</span>
            <span className="text-lg font-bold text-white">{assessment.rscMeqL.toFixed(2)} meq/L</span>
            <span className="text-[10px] text-emerald-300 block">
              {assessment.rscMeqL < 1.25 ? 'Safe (<1.25)' : 'Hazardous (>2.5)'}
            </span>
          </div>

          <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/10">
            <span className="text-white/70 block text-[10px]">Salinity (EC)</span>
            <span className="text-lg font-bold text-white">{sample.ecDecisiemensPerMeter} dS/m</span>
            <span className="text-[10px] text-emerald-300 block">{assessment.salinityHazard}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Parameter Adjustments & Remineralization Science */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Physicochemical Ion Balances */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Water Chemistry Parameters &amp; Ion Balance (mg/L)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              TDS: <strong className="text-slate-800">{sample.tdsPpm} ppm</strong> · pH:{' '}
              <strong className="text-slate-800">{sample.ph}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Calcium */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Calcium (Ca²⁺)</label>
              <input
                type="number"
                value={sample.calciumMgL}
                onChange={(e) => handleUpdateParameter('calciumMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.calciumMgL / EQUIVALENT_WEIGHTS.Ca).toFixed(2)} meq/L
              </span>
            </div>

            {/* Magnesium */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Magnesium (Mg²⁺)</label>
              <input
                type="number"
                value={sample.magnesiumMgL}
                onChange={(e) => handleUpdateParameter('magnesiumMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.magnesiumMgL / EQUIVALENT_WEIGHTS.Mg).toFixed(2)} meq/L
              </span>
            </div>

            {/* Sodium */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Sodium (Na⁺)</label>
              <input
                type="number"
                value={sample.sodiumMgL}
                onChange={(e) => handleUpdateParameter('sodiumMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-amber-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.sodiumMgL / EQUIVALENT_WEIGHTS.Na).toFixed(2)} meq/L
              </span>
            </div>

            {/* Potassium */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Potassium (K⁺)</label>
              <input
                type="number"
                value={sample.potassiumMgL}
                onChange={(e) => handleUpdateParameter('potassiumMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.potassiumMgL / EQUIVALENT_WEIGHTS.K).toFixed(2)} meq/L
              </span>
            </div>

            {/* Chloride */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Chloride (Cl⁻)</label>
              <input
                type="number"
                value={sample.chlorideMgL}
                onChange={(e) => handleUpdateParameter('chlorideMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.chlorideMgL / EQUIVALENT_WEIGHTS.Cl).toFixed(2)} meq/L
              </span>
            </div>

            {/* Bicarbonate */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Bicarbonate (HCO₃⁻)</label>
              <input
                type="number"
                value={sample.bicarbonateMgL}
                onChange={(e) => handleUpdateParameter('bicarbonateMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(sample.bicarbonateMgL / EQUIVALENT_WEIGHTS.HCO3).toFixed(2)} meq/L
              </span>
            </div>

            {/* Boron */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">Boron (B)</label>
              <input
                type="number"
                step="0.1"
                value={sample.boronMgL}
                onChange={(e) => handleUpdateParameter('boronMgL', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className={`text-[10px] mt-0.5 block font-semibold ${
                sample.boronMgL > 1.0 ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {sample.boronMgL > 1.0 ? 'Toxic for Citrus' : 'Safe (<1.0 mg/L)'}
              </span>
            </div>

            {/* pH */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-slate-500 font-medium block text-[11px]">pH Level</label>
              <input
                type="number"
                step="0.1"
                value={sample.ph}
                onChange={(e) => handleUpdateParameter('ph', parseFloat(e.target.value) || 7.0)}
                className="w-full bg-white border border-slate-300 rounded p-1 font-mono font-bold text-slate-800 mt-1"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Optimal: 6.5 - 7.5</span>
            </div>
          </div>

          {/* SAR & RSC Scientific Formula Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-mono space-y-2 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Standard Laboratory Formulas (USDA Handbook 60)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="font-bold text-slate-800">Sodium Adsorption Ratio (SAR):</span>
                <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  SAR = [Na⁺] / √(([Ca²⁺] + [Mg²⁺]) / 2)
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Current: <strong className="text-emerald-800">{assessment.sar.toFixed(2)}</strong> (Safe if &lt;3.0; Severe sodicity if &gt;9.0)
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-800">Residual Sodium Carbonate (RSC):</span>
                <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  RSC = ([CO₃²⁻] + [HCO₃⁻]) - ([Ca²⁺] + [Mg²⁺])
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Current: <strong className="text-emerald-800">{assessment.rscMeqL.toFixed(2)} meq/L</strong> (Safe if &lt;1.25 meq/L)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Calcite / Dolomite Remineralization Cartridge Reactor */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-cyan-700" />
            <span>Solar Remineralization Reactor</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <p>
              Condensed atmospheric moisture is naturally distilled with low TDS (&lt;15 ppm). Pure demineralized
              water can leach calcium and magnesium ions from tree-nut root systems and soil clays.
            </p>

            <div className="p-3 bg-cyan-50/60 rounded-lg border border-cyan-200/80 space-y-2">
              <span className="font-bold text-cyan-900 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                <span>3-Stage Mineral Cartridge Bed</span>
              </span>
              <ul className="space-y-1 text-[11px] text-cyan-950 list-disc pl-4">
                <li>
                  <strong className="text-slate-900">Bed A: High-Purity Calcite ($CaCO_3$):</strong> Dissolves ~45-55
                  mg/L calcium, neutralizing acidic dissolved carbonic acid and elevating pH to 7.4.
                </li>
                <li>
                  <strong className="text-slate-900">Bed B: Agricultural Dolomite ($CaMg(CO_3)_2$):</strong> Imparts
                  15-20 mg/L magnesium in a natural 3:1 Ca:Mg ratio.
                </li>
                <li>
                  <strong className="text-slate-900">Bed C: Micro-Carbon Polishing Matrix:</strong> Removes volatile
                  airborne organics and particulates down to 0.2 microns.
                </li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px]">
              <span className="font-bold text-slate-800 block">Cartridge Maintenance Cycle</span>
              <p className="text-slate-500">
                Calcite &amp; dolomite media require replacement every 12 months or ~1,60,000 Litres treated. Annual
                cartridge top-up cost is estimated at ₹3,200.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
