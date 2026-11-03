import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Droplets,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { SupportedLanguage } from '../utils/i18n';

interface AeroFloraEngineeringSimulatorProps {
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
  onApplyArrayUnitsToSystem?: (units: number) => void;
}

export type SorbentMaterial = 'MOF-801' | 'MIL-101(Cr)' | 'Aluminum Fumarate' | 'Zeolite 13X';

interface SorbentSpec {
  name: SorbentMaterial;
  chemicalName: string;
  nominalCapacityLPerKg: number; // L water / kg sorbent at 20% RH
  desorptionMinTempC: number;
  enthalpyOfDesorptionKjPerKg: number;
  cycleStability: string;
  notes: string;
}

const SORBENT_CATALOG: Record<SorbentMaterial, SorbentSpec> = {
  'MOF-801': {
    name: 'MOF-801',
    chemicalName: 'Zr6O4(OH)4(fumarate)6 (Zirconium-fumarate MOF)',
    nominalCapacityLPerKg: 0.35,
    desorptionMinTempC: 65,
    enthalpyOfDesorptionKjPerKg: 2800,
    cycleStability: '>10,000 thermal cycles with <2% capacity loss',
    notes: 'Steep Type-IV isotherm under 20% RH. Ideal for hyper-arid desert regions (Thar, Kutch, Rayalaseema).',
  },
  'MIL-101(Cr)': {
    name: 'MIL-101(Cr)',
    chemicalName: 'Cr3O(F,OH)(H2O)2(terephthalate)3',
    nominalCapacityLPerKg: 0.42,
    desorptionMinTempC: 85,
    enthalpyOfDesorptionKjPerKg: 3100,
    cycleStability: 'Moderate (>5,000 cycles)',
    notes: 'Higher peak volumetric capacity at 40-60% RH. Requires higher solar desorption temperatures (85°C+).',
  },
  'Aluminum Fumarate': {
    name: 'Aluminum Fumarate',
    chemicalName: 'Al(OH)(fumarate) (Basolite A520 analogue)',
    nominalCapacityLPerKg: 0.28,
    desorptionMinTempC: 70,
    enthalpyOfDesorptionKjPerKg: 2650,
    cycleStability: 'High industrial scale availability',
    notes: 'Low-cost domestic Indian synthesizability. Good hydrothermal stability for horticulture.',
  },
  'Zeolite 13X': {
    name: 'Zeolite 13X',
    chemicalName: 'Na86[(AlO2)86(SiO2)106]·264H2O',
    nominalCapacityLPerKg: 0.22,
    desorptionMinTempC: 140,
    enthalpyOfDesorptionKjPerKg: 3600,
    cycleStability: 'Ultra-durable mineral',
    notes: 'Extremely high desorption heat required (>140°C), making passive solar desorption sub-optimal.',
  },
};

export const AeroFloraEngineeringSimulator: React.FC<AeroFloraEngineeringSimulatorProps> = ({
  currentLanguage,
  onShowToast,
  onApplyArrayUnitsToSystem,
}) => {
  // Environmental Inputs
  const [ambientRH, setAmbientRH] = useState<number>(25); // %
  const [ambientTempC, setAmbientTempC] = useState<number>(38); // °C
  const [solarIrradianceKwh, setSolarIrradianceKwh] = useState<number>(6.5); // kWh/m²/day

  // Sorbent Core Inputs
  const [sorbentMaterial, setSorbentMaterial] = useState<SorbentMaterial>('MOF-801');
  const [sorbentMassKg, setSorbentMassKg] = useState<number>(200); // 50 to 500 kg
  const [adsorptionCapacityLPerKg, setAdsorptionCapacityLPerKg] = useState<number>(0.35); // L/kg
  const [desorptionTempC, setDesorptionTempC] = useState<number>(80); // °C
  const [cyclesPerDay, setCyclesPerDay] = useState<number>(1.0); // 1 to 2 cycles

  // Tower Engineering & Efficiencies
  const [collectorEfficiencyPct, setCollectorEfficiencyPct] = useState<number>(82); // %
  const [condensationEfficiencyPct, setCondensationEfficiencyPct] = useState<number>(88); // %
  const [recoveryEfficiencyPct, setRecoveryEfficiencyPct] = useState<number>(94); // %
  const [towerCount, setTowerCount] = useState<number>(2); // 1 to 20 units
  const [reservoirCapacityL, setReservoirCapacityL] = useState<number>(10000); // Litres
  const [operatingDaysPerYear, setOperatingDaysPerYear] = useState<number>(330); // days

  // Configurable Validation Target
  const [validationTargetDailyLiters, setValidationTargetDailyLiters] = useState<number>(450);

  // Sync material defaults when material changes
  const handleMaterialChange = (mat: SorbentMaterial) => {
    setSorbentMaterial(mat);
    const spec = SORBENT_CATALOG[mat];
    setAdsorptionCapacityLPerKg(spec.nominalCapacityLPerKg);
    setDesorptionTempC(spec.desorptionMinTempC + 10);
  };

  // Physics Calculations
  const calculations = useMemo(() => {
    const spec = SORBENT_CATALOG[sorbentMaterial];

    // Humidity scaling factor for sorbent isotherm (e.g. lower RH reduces uptake non-linearly)
    // Sorbent saturation factor based on RH
    let rhFactor = 1.0;
    if (ambientRH < 20) {
      rhFactor = 0.75 + (ambientRH / 20) * 0.25;
    } else if (ambientRH > 50) {
      rhFactor = 1.15;
    }

    // Temperature desorption completeness factor
    let desorpFactor = 1.0;
    if (desorptionTempC < spec.desorptionMinTempC) {
      desorpFactor = Math.max(0.2, (desorptionTempC / spec.desorptionMinTempC) * 0.6);
    } else {
      desorpFactor = Math.min(1.05, 0.95 + ((desorptionTempC - spec.desorptionMinTempC) / 40) * 0.1);
    }

    // Theoretical maximum adsorption mass per tower per cycle (Litres = kg water)
    const theoreticalAdsorptionLiters = sorbentMassKg * adsorptionCapacityLPerKg * rhFactor;

    // Actual desorption after thermal effectiveness
    const actualDesorptionLiters = theoreticalAdsorptionLiters * desorpFactor * (collectorEfficiencyPct / 100);

    // Condensation yield after passive biomimetic condenser recovery
    const condensedLiters = actualDesorptionLiters * (condensationEfficiencyPct / 100);

    // Final recovered water after mineral bed filter losses
    const netRecoveredLitersPerTowerPerCycle = condensedLiters * (recoveryEfficiencyPct / 100);

    const dailyLitersPerTower = netRecoveredLitersPerTowerPerCycle * cyclesPerDay;
    const arrayDailyLiters = dailyLitersPerTower * towerCount;
    const arrayMonthlyLiters = arrayDailyLiters * 30;
    const arrayAnnualLiters = arrayDailyLiters * operatingDaysPerYear;

    // Water production per kg of sorbent
    const productionPerKgSorbent = dailyLitersPerTower / Math.max(1, sorbentMassKg);

    // Thermal energy balance
    // Latent heat of vaporization ~ 2260 kJ/kg + sorbent desorption heat
    const thermalEnergyRequiredPerTowerKwh =
      (dailyLitersPerTower * (spec.enthalpyOfDesorptionKjPerKg / 3600)) / (collectorEfficiencyPct / 100);

    // Solar collector aperture area required (m²) based on solar irradiance
    const collectorAreaRequiredM2 =
      thermalEnergyRequiredPerTowerKwh / Math.max(1, solarIrradianceKwh * (collectorEfficiencyPct / 100));

    // Three Scenario Bands (Worst, Expected, Best)
    const worstCaseDaily = dailyLitersPerTower * 0.72; // Dust accumulation, hazy sky, 15% RH
    const bestCaseDaily = dailyLitersPerTower * 1.28; // Cool night 35% RH, clear peak sun 7.5 kWh

    // Sizing for validation target (e.g. 450 L/day)
    const towersNeededForTarget = Math.ceil(validationTargetDailyLiters / Math.max(1, dailyLitersPerTower));
    const targetAttainmentPct = Math.min(150, Math.round((dailyLitersPerTower / validationTargetDailyLiters) * 100));

    // Warnings for unrealistic physics
    const warnings: string[] = [];
    if (desorptionTempC < spec.desorptionMinTempC) {
      warnings.push(
        `Desorption temperature (${desorptionTempC}°C) is below minimum required (${spec.desorptionMinTempC}°C) for ${spec.name}. Regeneration will be incomplete.`
      );
    }
    if (adsorptionCapacityLPerKg > 0.5) {
      warnings.push('Adsorption capacity above 0.50 L/kg exceeds current peer-reviewed MOF state of the art.');
    }
    if (collectorEfficiencyPct > 90) {
      warnings.push('Solar collector efficiency above 90% is overly optimistic for unpressurized passive solar hoods.');
    }
    if (sorbentMaterial === 'Zeolite 13X' && desorptionTempC < 130) {
      warnings.push('Zeolite 13X requires >130°C for desorption. Passive solar concentrators will produce very low yield.');
    }

    return {
      theoreticalAdsorptionLiters,
      actualDesorptionLiters,
      condensedLiters,
      netRecoveredLitersPerTowerPerCycle,
      dailyLitersPerTower,
      arrayDailyLiters,
      arrayMonthlyLiters,
      arrayAnnualLiters,
      productionPerKgSorbent,
      thermalEnergyRequiredPerTowerKwh,
      collectorAreaRequiredM2,
      worstCaseDaily,
      bestCaseDaily,
      towersNeededForTarget,
      targetAttainmentPct,
      warnings,
    };
  }, [
    ambientRH,
    ambientTempC,
    solarIrradianceKwh,
    sorbentMaterial,
    sorbentMassKg,
    adsorptionCapacityLPerKg,
    desorptionTempC,
    cyclesPerDay,
    collectorEfficiencyPct,
    condensationEfficiencyPct,
    recoveryEfficiencyPct,
    towerCount,
    operatingDaysPerYear,
    validationTargetDailyLiters,
  ]);

  const handleApplyToSystem = () => {
    if (onApplyArrayUnitsToSystem) {
      onApplyArrayUnitsToSystem(towerCount);
      onShowToast(`Array configured to ${towerCount} AeroFlora Tower(s) in system`);
    }
  };

  const handleResetDefaults = () => {
    setAmbientRH(25);
    setAmbientTempC(38);
    setSolarIrradianceKwh(6.5);
    setSorbentMaterial('MOF-801');
    setSorbentMassKg(200);
    setAdsorptionCapacityLPerKg(0.35);
    setDesorptionTempC(80);
    setCyclesPerDay(1.0);
    setCollectorEfficiencyPct(82);
    setCondensationEfficiencyPct(88);
    setRecoveryEfficiencyPct(94);
    setTowerCount(2);
    setValidationTargetDailyLiters(450);
    onShowToast('Simulator parameters reset to nominal baseline');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Thermodynamic &amp; Mass-Balance Physics Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            AeroFlora Engineering Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Scientifically transparent atmospheric water harvesting calculator. Sorbent sorption isotherms, solar
            desorption kinetics, and passive condensation recovery.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={handleApplyToSystem}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Sizing to Fleet</span>
          </button>
        </div>
      </div>

      {/* Physics Warnings if any */}
      {calculations.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Thermodynamic Boundary Discrepancies ({calculations.warnings.length})</span>
          </div>
          <ul className="text-xs text-amber-900 space-y-1 pl-6 list-disc">
            {calculations.warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3 Core Results Cards: Simulated Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Yield Per Tower */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Daily Yield Per Tower</span>
            <span className="text-[10px] font-mono bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded font-semibold">
              SIMULATED ESTIMATE
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-800 font-mono">
              {calculations.dailyLitersPerTower.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-600">Litres / day</span>
          </div>
          <div className="space-y-1 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between text-slate-500">
              <span>Specific Sorbent Productivity:</span>
              <span className="font-mono font-semibold text-slate-800">
                {calculations.productionPerKgSorbent.toFixed(3)} L/kg sorbent
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Validation Benchmark (450 L):</span>
              <span className="font-mono font-bold text-emerald-700">
                {calculations.targetAttainmentPct}% of target
              </span>
            </div>
          </div>
        </div>

        {/* Array Aggregate Total */}
        <div className="bg-emerald-950 text-white rounded-xl border border-emerald-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-medium">
              Total Array Yield ({towerCount} Towers)
            </span>
            <span className="text-[10px] font-mono bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-semibold">
              ANNUAL SCALED
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {calculations.arrayDailyLiters.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-emerald-300">Litres / day</span>
          </div>
          <div className="space-y-1 text-xs pt-2 border-t border-emerald-800 text-emerald-200">
            <div className="flex justify-between">
              <span>Monthly Production:</span>
              <span className="font-mono font-semibold text-white">
                {(calculations.arrayMonthlyLiters / 1000).toFixed(1)} kL (
                {calculations.arrayMonthlyLiters.toLocaleString()} L)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Annual Operational Yield:</span>
              <span className="font-mono font-bold text-emerald-300">
                {(calculations.arrayAnnualLiters / 1000).toFixed(1)} kL / year
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Scenario Range */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sensitivity Bands (Per Tower)</span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              3-TIER SCENARIO
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-red-50 text-red-900 rounded flex justify-between items-center">
              <span>Worst-Case (Dry Storm/Low Sun):</span>
              <span className="font-bold">{calculations.worstCaseDaily.toFixed(1)} L/d</span>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-900 rounded flex justify-between items-center">
              <span>Expected Baseline:</span>
              <span className="font-bold">{calculations.dailyLitersPerTower.toFixed(1)} L/d</span>
            </div>
            <div className="p-2 bg-cyan-50 text-cyan-900 rounded flex justify-between items-center">
              <span>Best-Case (Peak RH / High Sun):</span>
              <span className="font-bold">{calculations.bestCaseDaily.toFixed(1)} L/d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Form Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Environmental & Sorbent Core Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Droplets className="w-4 h-4 text-cyan-700" />
            <span>1. Atmospheric &amp; Sorbent Parameters</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sorbent Material Choice */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sorbent Material (अधिशोषक सामग्री)
              </label>
              <select
                value={sorbentMaterial}
                onChange={(e) => handleMaterialChange(e.target.value as SorbentMaterial)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer focus:ring-2 focus:ring-emerald-600"
              >
                {(Object.keys(SORBENT_CATALOG) as SorbentMaterial[]).map((mat) => (
                  <option key={mat} value={mat}>
                    {mat} — {SORBENT_CATALOG[mat].notes.slice(0, 50)}...
                  </option>
                ))}
              </select>
              <div className="mt-1 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-semibold text-slate-700">Chemical Formula: </span>
                {SORBENT_CATALOG[sorbentMaterial].chemicalName}
              </div>
            </div>

            {/* Sorbent Mass Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Sorbent Mass Per Tower (kg)</label>
                <span className="font-mono font-bold text-emerald-700">{sorbentMassKg} kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={sorbentMassKg}
                onChange={(e) => setSorbentMassKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50 kg (Compact)</span>
                <span>200 kg (Nominal)</span>
                <span>500 kg (Large Array)</span>
              </div>
            </div>

            {/* Measured Adsorption Capacity */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Adsorption Capacity (L / kg sorbent / cycle)
                </label>
                <span className="font-mono font-bold text-cyan-700">{adsorptionCapacityLPerKg} L/kg</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.48"
                step="0.01"
                value={adsorptionCapacityLPerKg}
                onChange={(e) => setAdsorptionCapacityLPerKg(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Lab measured water vapor uptake at specified nocturnal relative humidity.
              </p>
            </div>

            {/* Ambient Relative Humidity Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Ambient Nocturnal Relative Humidity (%)</label>
                <span className="font-mono font-bold text-cyan-700">{ambientRH}% RH</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                step="1"
                value={ambientRH}
                onChange={(e) => setAmbientRH(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Hyper-Arid)</span>
                <span>25% (Semi-Arid)</span>
                <span>75% (Monsoon)</span>
              </div>
            </div>

            {/* Solar Irradiance Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Solar Irradiance (kWh / m² / day)</label>
                <span className="font-mono font-bold text-amber-700">{solarIrradianceKwh} kWh/m²</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="8.0"
                step="0.1"
                value={solarIrradianceKwh}
                onChange={(e) => setSolarIrradianceKwh(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Desorption Thermal & Array Sizing Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>2. Solar Regeneration &amp; Hardware Efficiencies</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Desorption Temperature Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Desorption Core Temperature (°C)</label>
                <span className="font-mono font-bold text-amber-700">{desorptionTempC}°C</span>
              </div>
              <input
                type="range"
                min="50"
                max="110"
                step="2"
                value={desorptionTempC}
                onChange={(e) => setDesorptionTempC(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Minimum for {sorbentMaterial}: {SORBENT_CATALOG[sorbentMaterial].desorptionMinTempC}°C
              </span>
            </div>

            {/* Condensation Efficiency */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Condenser Recovery Efficiency (%)</label>
                <span className="font-mono font-bold text-slate-800">{condensationEfficiencyPct}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="98"
                step="1"
                value={condensationEfficiencyPct}
                onChange={(e) => setCondensationEfficiencyPct(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Biomimetic hydrophobic/hydrophilic micro-patterned condensation plates.
              </span>
            </div>

            {/* Number of Harvesting Towers */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Tower Units in Fleet / Array</label>
                <span className="font-mono font-bold text-emerald-700">{towerCount} Unit(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={towerCount}
                onChange={(e) => setTowerCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 Unit (Pilot)</span>
                <span>4 Units (Small Farm)</span>
                <span>12 Units (FPO Cluster)</span>
              </div>
            </div>

            {/* Validation Target Input */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-semibold mb-1">
                Configurable Validation Target (Litres / Day Benchmark)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="25"
                  value={validationTargetDailyLiters}
                  onChange={(e) => setValidationTargetDailyLiters(Number(e.target.value) || 100)}
                  className="w-36 bg-slate-50 border border-slate-300 rounded p-1.5 font-mono text-slate-800 font-bold"
                />
                <span className="text-[11px] text-slate-500">
                  Target: {validationTargetDailyLiters} L/day (Requires {calculations.towersNeededForTarget} tower(s) under current conditions)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thermodynamic Stage-by-Stage Mass Balance Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Stage-by-Stage Mass &amp; Energy Balance (Per Tower Per Day)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Stage 1: Sorption</span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {calculations.theoreticalAdsorptionLiters.toFixed(1)} L
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Moisture loaded onto {sorbentMassKg} kg sorbent during nocturnal passive convection.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Stage 2: Desorption</span>
            <span className="text-base font-bold text-amber-700 font-mono">
              {calculations.actualDesorptionLiters.toFixed(1)} L
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Vapor released inside sealed solar chamber at {desorptionTempC}°C.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Stage 3: Condensation</span>
            <span className="text-base font-bold text-cyan-700 font-mono">
              {calculations.condensedLiters.toFixed(1)} L
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Condensed onto sub-surface radiative cooling surface ({condensationEfficiencyPct}% efficiency).
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 text-[10px] uppercase font-mono block font-bold">
              Stage 4: Net Water Harvest
            </span>
            <span className="text-base font-bold text-emerald-900 font-mono">
              {calculations.dailyLitersPerTower.toFixed(1)} L
            </span>
            <p className="text-[10px] text-emerald-700 mt-1">
              Delivered through remineralization cartridge into farm storage reservoir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
