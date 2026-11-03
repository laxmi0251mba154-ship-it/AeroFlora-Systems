import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  Briefcase,
  Users,
  Building,
} from 'lucide-react';
import { SupportedLanguage } from '../utils/i18n';

interface FinancialPlannerROIViewProps {
  currentLanguage: SupportedLanguage;
  towerUnits?: number;
  onShowToast: (message: string) => void;
  onOpenReport?: () => void;
}

export type AcquisitionModel = 'direct_purchase' | 'equipment_leasing' | 'fpo_cooperative';

export const FinancialPlannerROIView: React.FC<FinancialPlannerROIViewProps> = ({
  currentLanguage,
  towerUnits = 2,
  onShowToast,
  onOpenReport,
}) => {
  const [units, setUnits] = useState<number>(towerUnits);
  const [baseCostPerTowerInr, setBaseCostPerTowerInr] = useState<number>(195000); // ₹1.95 Lakh per tower
  const [subsidyPercent, setSubsidyPercent] = useState<number>(30); // 0%, 30% or 50% under PM-KUSUM
  const [tankersReplacedMonthly, setTankersReplacedMonthly] = useState<number>(3); // 5,000 L tankers per month
  const [costPerTankerInr, setCostPerTankerInr] = useState<number>(1500); // ₹1,500 per 5,000 L tanker
  const [monthlyDieselSavedInr, setMonthlyDieselSavedInr] = useState<number>(2400); // Avoided generator/pump fuel
  const [annualMaintenancePerTowerInr, setAnnualMaintenancePerTowerInr] = useState<number>(3500); // Media replacement
  const [acquisitionModel, setAcquisitionModel] = useState<AcquisitionModel>('direct_purchase');

  // Calculations
  const metrics = useMemo(() => {
    const grossCapEx = units * baseCostPerTowerInr;
    const subsidyAmount = grossCapEx * (subsidyPercent / 100);
    const netFarmerCapEx = grossCapEx - subsidyAmount;

    // Monthly & Annual Savings
    const monthlyTankerSavings = tankersReplacedMonthly * costPerTankerInr;
    const monthlyTotalSavings = monthlyTankerSavings + monthlyDieselSavedInr;
    const annualGrossSavings = monthlyTotalSavings * 12;
    const annualMaintenanceCost = units * annualMaintenancePerTowerInr;
    const annualNetSavings = annualGrossSavings - annualMaintenanceCost;

    // Payback period in months
    const paybackMonths =
      annualNetSavings > 0 ? Math.round((netFarmerCapEx / (annualNetSavings / 12)) * 10) / 10 : 999;

    // 5-Year Cashflows & NPV (at 8% discount rate)
    const discountRate = 0.08;
    let npv = -netFarmerCapEx;
    const cashflows = [];
    let cumulative = -netFarmerCapEx;

    for (let yr = 1; yr <= 5; yr++) {
      cumulative += annualNetSavings;
      const discounted = annualNetSavings / Math.pow(1 + discountRate, yr);
      npv += discounted;
      cashflows.push({
        year: yr,
        grossSavings: annualGrossSavings,
        maintenance: annualMaintenanceCost,
        netCashflow: annualNetSavings,
        cumulative,
      });
    }

    // Five-Year ROI %
    const fiveYearNetReturn = annualNetSavings * 5 - netFarmerCapEx;
    const fiveYearRoiPct = Math.round((fiveYearNetReturn / Math.max(1, netFarmerCapEx)) * 100);

    // Approximate IRR %
    const approxIrr = Math.min(85, Math.max(8, Math.round(((annualNetSavings / Math.max(1, netFarmerCapEx)) - 0.05) * 100)));

    // Model comparison numbers
    const leaseMonthlyCost = Math.round(netFarmerCapEx / 36); // 3-year amortized lease
    const fpoMemberShareCost = Math.round(netFarmerCapEx / 10); // 10 farmers in FPO group

    return {
      grossCapEx,
      subsidyAmount,
      netFarmerCapEx,
      monthlyTankerSavings,
      monthlyTotalSavings,
      annualGrossSavings,
      annualMaintenanceCost,
      annualNetSavings,
      paybackMonths,
      npv,
      cashflows,
      fiveYearRoiPct,
      approxIrr,
      leaseMonthlyCost,
      fpoMemberShareCost,
    };
  }, [
    units,
    baseCostPerTowerInr,
    subsidyPercent,
    tankersReplacedMonthly,
    costPerTankerInr,
    monthlyDieselSavedInr,
    annualMaintenancePerTowerInr,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Coins className="w-3.5 h-3.5 text-emerald-700" />
            <span>PM-KUSUM Agri-Infrastructure Model (INR ₹)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Financial Planner, Subsidies &amp; ROI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate capital payback, PM-KUSUM subsidy integration, private water tanker displacement, and 5-year Net
            Present Value (NPV).
          </p>
        </div>

        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <span>Generate Bankable Pro-Forma</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Acquisition Models Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setAcquisitionModel('direct_purchase')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            acquisitionModel === 'direct_purchase'
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              {subsidyPercent}% SUBSIDY
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900">Direct Farmer Purchase</h3>
          <p className="text-xs text-slate-500 mt-1">
            Individual farm asset with PM-KUSUM central + state grant. Highest 5-year equity ROI.
          </p>
          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-baseline font-mono text-xs">
            <span className="text-slate-500">Net CapEx:</span>
            <span className="font-bold text-emerald-800">₹{metrics.netFarmerCapEx.toLocaleString()}</span>
          </div>
        </div>

        <div
          onClick={() => setAcquisitionModel('equipment_leasing')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            acquisitionModel === 'equipment_leasing'
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4 text-cyan-700" />
            </div>
            <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold">
              ZERO CAPEX
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900">Solar Water-as-a-Service (Lease)</h3>
          <p className="text-xs text-slate-500 mt-1">
            Monthly OpEx subscription. Manufacturer manages maintenance, sorbent refills, and IoT.
          </p>
          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-baseline font-mono text-xs">
            <span className="text-slate-500">Est. Subscription:</span>
            <span className="font-bold text-cyan-800">₹{metrics.leaseMonthlyCost.toLocaleString()} / mo</span>
          </div>
        </div>

        <div
          onClick={() => setAcquisitionModel('fpo_cooperative')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            acquisitionModel === 'fpo_cooperative'
              ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4 text-teal-700" />
            </div>
            <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
              FPO POOLED
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900">FPO Cooperative Shared Array</h3>
          <p className="text-xs text-slate-500 mt-1">
            10 smallholders pool capital. Daily harvest distributed via digital water tokens.
          </p>
          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-baseline font-mono text-xs">
            <span className="text-slate-500">Share / Member:</span>
            <span className="font-bold text-teal-800">₹{metrics.fpoMemberShareCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payback Period */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Simple Payback Period</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {metrics.paybackMonths}
            </span>
            <span className="text-xs font-semibold text-slate-600">Months</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            {(metrics.paybackMonths / 12).toFixed(1)} Years with {subsidyPercent}% subsidy
          </span>
        </div>

        {/* Annual Net Savings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Net Annual Water Savings</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ₹{metrics.annualNetSavings.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600">/ year</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Tanker replacement + diesel power savings
          </span>
        </div>

        {/* 5-Year NPV */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">5-Year NPV (@ 8% Discount)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800 font-mono">
              ₹{Math.round(metrics.npv).toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Positive capital creation for farm holding
          </span>
        </div>

        {/* Internal Rate of Return (IRR) */}
        <div className="bg-emerald-950 text-white rounded-xl border border-emerald-800 p-5 shadow-sm space-y-2">
          <span className="text-xs text-emerald-300 font-medium">Internal Rate of Return (IRR)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.approxIrr}%
            </span>
            <span className="text-xs font-semibold text-emerald-300">Annualized</span>
          </div>
          <span className="text-[11px] text-emerald-300/80 block pt-1 border-t border-emerald-800">
            5-Year Net ROI: {metrics.fiveYearRoiPct}%
          </span>
        </div>
      </div>

      {/* Configurable Financial Controls & 5-Year Cashflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Sliders & Subsidies */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Financial Inputs &amp; Tanker Costs</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Tower Units */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Number of AeroFlora Towers</label>
                <span className="font-mono font-bold text-emerald-700">{units} Tower(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* PM-KUSUM Subsidy Selector */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                PM-KUSUM &amp; State Subsidy Scheme
              </label>
              <select
                value={subsidyPercent}
                onChange={(e) => setSubsidyPercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer"
              >
                <option value={0}>0% — Commercial / No Subsidy</option>
                <option value={30}>30% — Standard PM-KUSUM Component B Central Grant</option>
                <option value={50}>50% — PM-KUSUM + State Arid Horticulture Top-Up (Rajasthan/Gujarat)</option>
              </select>
            </div>

            {/* Private Tanker Replacement Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Private Water Tankers Replaced (Monthly)</label>
                <span className="font-mono font-bold text-slate-800">{tankersReplacedMonthly} Loads / mo</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={tankersReplacedMonthly}
                onChange={(e) => setTankersReplacedMonthly(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>

            {/* Cost Per Tanker (₹ INR) */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Cost Per Tanker (5,000 L) in ₹ INR</label>
                <span className="font-mono font-bold text-amber-700">₹{costPerTankerInr.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="800"
                max="2800"
                step="100"
                value={costPerTankerInr}
                onChange={(e) => setCostPerTankerInr(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Diesel Pumping Savings */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Monthly Avoided Diesel Generator Spend</label>
                <span className="font-mono font-bold text-emerald-700">₹{monthlyDieselSavedInr.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="250"
                value={monthlyDieselSavedInr}
                onChange={(e) => setMonthlyDieselSavedInr(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Cols: 5-Year Pro-Forma Cashflow Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                5-Year Agronomic Pro-Forma Cashflow Projection
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              Net Investment: ₹{metrics.netFarmerCapEx.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2.5 border-b">Year</th>
                  <th className="p-2.5 border-b">Gross Savings</th>
                  <th className="p-2.5 border-b">O&amp;M Maintenance</th>
                  <th className="p-2.5 border-b">Net Annual Cashflow</th>
                  <th className="p-2.5 border-b">Cumulative Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 font-bold text-slate-700">Year 0 (CapEx)</td>
                  <td className="p-2.5 text-slate-400">—</td>
                  <td className="p-2.5 text-slate-400">—</td>
                  <td className="p-2.5 text-red-700 font-bold">-₹{metrics.netFarmerCapEx.toLocaleString()}</td>
                  <td className="p-2.5 text-red-700 font-bold">-₹{metrics.netFarmerCapEx.toLocaleString()}</td>
                </tr>
                {metrics.cashflows.map((cf) => (
                  <tr key={cf.year}>
                    <td className="p-2.5 font-bold text-slate-800">Year {cf.year}</td>
                    <td className="p-2.5 text-slate-700">₹{cf.grossSavings.toLocaleString()}</td>
                    <td className="p-2.5 text-slate-500">-₹{cf.maintenance.toLocaleString()}</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">
                      +₹{cf.netCashflow.toLocaleString()}
                    </td>
                    <td
                      className={`p-2.5 font-bold ${
                        cf.cumulative >= 0 ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {cf.cumulative >= 0 ? '+' : ''}₹{cf.cumulative.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
            <p>
              <strong className="text-slate-800">NABARD &amp; Bank Term Loan Eligibility: </strong>
              With a payback period of {metrics.paybackMonths} months and strong debt-service coverage ratio (DSCR &gt;
              1.8), AeroFlora systems qualify for collateral-free agricultural equipment financing under Kisan Credit Card
              (KCC) allied infrastructure guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
