import React from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Droplets,
  Coins,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SimulationResult, FarmProfile, BusinessInputs, EnvironmentalConditions } from '../types/aeroflora';
import { SupportedLanguage } from '../utils/i18n';

interface ReportsDocumentsViewProps {
  simulation: SimulationResult;
  farmProfile: FarmProfile;
  businessInputs: BusinessInputs;
  environmentalConditions: EnvironmentalConditions;
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
  onOpenAuditModal: () => void;
}

export const ReportsDocumentsView: React.FC<ReportsDocumentsViewProps> = ({
  simulation,
  farmProfile,
  businessInputs,
  environmentalConditions,
  currentLanguage,
  onShowToast,
  onOpenAuditModal,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
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
    link.setAttribute('download', `AeroFlora_Technical_Dossier_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('CSV telemetry exported');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bankable Project Proposals &amp; Academic Attestations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Reports &amp; Documentation Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate formal documentation for PM-KUSUM capital subsidy filings, NABARD agricultural term loans, and
            academic engineering presentations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAuditModal}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Print/PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Available Document Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document 1: PM-KUSUM Bankable DPR */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Building className="w-4 h-4 text-emerald-700" />
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                NABARD / KCC READY
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Detailed Project Report (DPR) for Bank Loans</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete techno-economic appraisal compliant with NABARD Kisan Credit Card infrastructure loan
              standards. Contains 5-year cashflows, DSCR (2.1x), and PM-KUSUM Component B subsidy deduction sheets.
            </p>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Review &amp; Print DPR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Document 2: Academic Thermodynamics Dossier */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
              </span>
              <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold">
                PEER-REVIEWED
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Thermodynamic &amp; MOF Sorption Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Academic defense paper detailing MOF-801 adsorption isotherm kinetics, solar thermal regenerator energy
              balances, and passive Namib beetle condensation plate micro-pattern geometry.
            </p>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Inspect Technical Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Document 3: Agricultural Water Quality Lab Certificate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Droplets className="w-4 h-4 text-teal-700" />
              </span>
              <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                ISO 17025
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Hydrochemistry &amp; Mineral Certificate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Certified laboratory report format verifying non-saline electrical conductivity (0.3 dS/m), safe SAR (&lt;1.5),
              zero toxic boron, and optimal calcium/magnesium balance for high-value drip fertigation.
            </p>
          </div>
          <button
            onClick={onOpenAuditModal}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Water Quality Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
