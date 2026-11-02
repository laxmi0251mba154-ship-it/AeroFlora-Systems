/**
 * AeroFlora Systems - Multi-Scenario Comparison Engine
 * Allows agricultural enterprise evaluators to compare tower array sizing vs status-quo trucking
 */

import React from 'react';
import { X, Check, ArrowRight, ShieldAlert, ShieldCheck, ZapOff } from 'lucide-react';
import { FarmProfile } from '../types/aeroflora';

interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmProfile: FarmProfile;
  onSelectTowerUnits: (units: number) => void;
}

export const ScenarioComparisonModal: React.FC<ScenarioComparisonModalProps> = ({
  isOpen,
  onClose,
  farmProfile,
  onSelectTowerUnits,
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'status_quo',
      name: 'Status Quo: 100% Water Trucking',
      subtitle: 'Zero capital investment, recurring operational bleed',
      towerUnits: 0,
      dailyYield: 0,
      monthlyGallons: 0,
      haulingExpenseMonthly: 4800,
      annualCost: 24000,
      initialCapEx: 0,
      paybackMonths: 0,
      fiveYearExpense: 127400, // with 3% annual inflation
      riskRating: 'High Vulnerability',
      riskColor: 'text-rose-700 bg-rose-50 border-rose-200',
      highlights: [
        'Dependent on municipal water haulers',
        'Vulnerable to road washouts and supply cuts',
        'Ongoing diesel truck emissions on orchard roads',
        'No asset equity generated',
      ],
    },
    {
      id: 'tactical_buffer',
      name: 'Tactical Buffer: 2-Tower Array',
      subtitle: 'Emergency root-zone hydration for critical dry periods',
      towerUnits: 2,
      dailyYield: 1008,
      monthlyGallons: 8119,
      haulingExpenseMonthly: 2800,
      annualSavings: 19500,
      initialCapEx: 37000,
      paybackMonths: 22.8,
      fiveYearNetGain: 64200,
      riskRating: 'Moderate Protection',
      riskColor: 'text-amber-800 bg-amber-50 border-amber-200',
      highlights: [
        'Protects 30–45 acres of tree-nut root crowns',
        'Offsets ~42% of peak monthly hauling bills',
        '100% passive diurnal condensation',
        '22.8-month full capital payback',
      ],
    },
    {
      id: 'optimal_hybrid',
      name: 'Optimal Deployment: 3-Tower Array',
      subtitle: 'Recommended baseline for 45-acre pecan groves',
      towerUnits: 3,
      dailyYield: 1512,
      monthlyGallons: 12178,
      haulingExpenseMonthly: 1600,
      annualSavings: 29312,
      initialCapEx: 55500,
      paybackMonths: 22.7,
      fiveYearNetGain: 98400,
      riskRating: 'Optimal Water Security',
      riskColor: 'text-cyan-900 bg-cyan-50 border-cyan-200',
      recommended: true,
      highlights: [
        'Sustains mature 45-acre pecan orchard during peak heat',
        'Replaces 68% of commercial tanker deliveries',
        'Infuses 54 mg/L Ca²⁺ & 18 mg/L Mg²⁺ to stop nut split',
        'Zero grid or diesel generator power required',
      ],
    },
    {
      id: 'full_independence',
      name: 'Full Independence: 5-Tower Array',
      subtitle: 'Complete elimination of water hauling contracts',
      towerUnits: 5,
      dailyYield: 2520,
      monthlyGallons: 20297,
      haulingExpenseMonthly: 0,
      annualSavings: 48900,
      initialCapEx: 92500,
      paybackMonths: 22.7,
      fiveYearNetGain: 164500,
      riskRating: '100% Self-Sufficient',
      riskColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
      highlights: [
        'Total water sovereignty for 70–100 acre holdings',
        '100% elimination of emergency hauling contracts',
        'Eliminates ~62 tanker trips annually',
        'Generates surplus buffer for aquifer replenishment',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-cyan-800 font-bold uppercase">
              STRATEGIC SCENARIO ANALYSIS
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Array Sizing &amp; Economic Trade-Off Matrix for {farmProfile.farmName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Cards */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((scen) => (
              <div
                key={scen.id}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all relative ${
                  scen.recommended
                    ? 'border-cyan-800 ring-2 ring-cyan-700 bg-cyan-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {scen.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono">
                    Recommended Configuration
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {scen.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {scen.subtitle}
                  </p>

                  <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${scen.riskColor}`}>
                    {scen.riskRating}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Water:</span>
                      <span className="font-bold text-slate-900">{scen.dailyYield.toLocaleString()} L/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Initial CapEx:</span>
                      <span className="font-bold text-slate-900">${scen.initialCapEx.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Hauling:</span>
                      <span className="font-bold text-rose-700">${scen.haulingExpenseMonthly.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capital Payback:</span>
                      <span className="font-bold text-emerald-800">{scen.paybackMonths > 0 ? `${scen.paybackMonths} mo` : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                      Highlights
                    </div>
                    {scen.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-tight">
                        <Check className="w-3 h-3 text-cyan-800 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {scen.towerUnits > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTowerUnits(scen.towerUnits);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      scen.recommended
                        ? 'bg-cyan-900 hover:bg-cyan-950 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>Load {scen.towerUnits} Towers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-400 py-2">
                    Current Baseline
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
          <div>Modeled with 18% ambient relative humidity &amp; 0.0 kWh grid energy reliance</div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
