/**
 * AeroFlora Systems - Solar Mineralization Module
 * Demonstrates the post-condensation solar mineralization pass-through
 */

import React from 'react';
import { MineralProfile } from '../types/aeroflora';
import { Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';
import { IMAGES } from '../assets/images';

interface SolarMineralizationModuleProps {
  mineralProfile: MineralProfile;
}

export const SolarMineralizationModule: React.FC<SolarMineralizationModuleProps> = ({
  mineralProfile,
}) => {
  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>CORE TECHNICAL DIFFERENTIATOR · PART 2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Passive Solar Mineralization Chamber
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Distilled atmospheric condensate lacks vital electrolytes and can deplete soil microbiome.
              AeroFlora passes condensed water through natural volcanic and calcite strata heated by ambient solar energy.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Organic Certified Mineral Media</span>
          </div>
        </div>

        {/* 2-Column Module Cutaway & Mineral Chemistry HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white aspect-4/3 relative">
              <img
                src={IMAGES.solarMineralization}
                alt="Solar Mineralization Chamber Cutaway Diagram"
                className="w-full h-full object-contain p-2"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-2 text-center font-mono">
              Passive gravity-flow contact column with food-grade glass and solar thermal jacket
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Calibrated Water Chemistry Telemetry
            </div>

            {/* Mineral KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-mono text-slate-500">Calcium (Ca²⁺)</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {mineralProfile.calcium} <span className="text-xs font-normal text-slate-500">mg/L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Prevents pecan hull split</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-mono text-slate-500">Magnesium (Mg²⁺)</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {mineralProfile.magnesium} <span className="text-xs font-normal text-slate-500">mg/L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Chlorophyll catalyst for AZ sun</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-mono text-slate-500">Solution pH</div>
                <div className="text-xl font-bold font-mono text-cyan-900 mt-0.5">
                  {mineralProfile.ph}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Optimal neutral-alkaline</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-mono text-slate-500">Total Dissolved Solids</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {mineralProfile.tds} <span className="text-xs font-normal text-slate-500">mg/L</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Agronomic sweet spot</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-800 font-mono">
                Agronomic Significance for Southern Arizona Soils
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Southern Arizona soils in Cochise and Pinal counties frequently suffer from caliche hardpan and high salinity.
                Standard unmineralized condensate acts as an aggressive osmotic solvent that leaches vital potassium and zinc
                away from tree roots. By maintaining 199.2 mg/L TDS and a stable pH of 7.6, AeroFlora water fosters mycorrhizal
                fungi health and protects nut kernel oil density.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table: Raw Condensate vs AeroFlora Mineralized Water */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Water Quality Comparison Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold text-slate-700">Water Source</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">TDS (mg/L)</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">pH Level</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">Ca &amp; Mg Balance</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">Agronomic Suitability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                  Standard AWG Raw Condensate
                </td>
                <td className="py-2.5 px-3 text-slate-600">~10 mg/L</td>
                <td className="py-2.5 px-3 text-rose-700">5.5 – 6.2 (Acidic)</td>
                <td className="py-2.5 px-3 text-slate-400">Zero minerals</td>
                <td className="py-2.5 px-3 text-rose-700 font-sans">
                  Poor (causes soil nutrient leaching)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                  Municipal Trucked Water (Well)
                </td>
                <td className="py-2.5 px-3 text-slate-600">650 – 1,100 mg/L</td>
                <td className="py-2.5 px-3 text-amber-700">8.2 – 8.8 (Hard)</td>
                <td className="py-2.5 px-3 text-amber-700">Excess sodium &amp; carbonates</td>
                <td className="py-2.5 px-3 text-amber-700 font-sans">
                  Moderate ($4k+/mo hauling expense)
                </td>
              </tr>
              <tr className="bg-cyan-50/60 font-semibold">
                <td className="py-2.5 px-3 font-sans text-cyan-950 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-700" />
                  <span>AeroFlora Solar Mineralized</span>
                </td>
                <td className="py-2.5 px-3 text-cyan-950">199.2 mg/L</td>
                <td className="py-2.5 px-3 text-cyan-950">7.6 (Buffered)</td>
                <td className="py-2.5 px-3 text-cyan-950">54.2 Ca / 18.6 Mg</td>
                <td className="py-2.5 px-3 text-emerald-800 font-sans">
                  Optimal for Tree-Nut Irrigation
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
