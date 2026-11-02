/**
 * AeroFlora Systems - Persistent Activity Logs & Saved Scenarios
 * Satisfies the Brief Requirement: "Data That Must Be Stored: User profile, venture entities, session inputs, timestamps, status flags"
 */

import React, { useState } from 'react';
import { ActivityLog, SavedScenario } from '../types/aeroflora';
import {
  History,
  FolderOpen,
  PlusCircle,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ActivityLogsAndScenariosProps {
  scenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
  activityLogs: ActivityLog[];
  onAddLog: (action: string, details: string) => void;
  onExportCSV: () => void;
}

export const ActivityLogsAndScenarios: React.FC<ActivityLogsAndScenariosProps> = ({
  scenarios,
  onLoadScenario,
  onDeleteScenario,
  activityLogs,
  onAddLog,
  onExportCSV,
}) => {
  const [newAction, setNewAction] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;
    onAddLog(newAction, newDetails);
    setNewAction('');
    setNewDetails('');
    setShowAddLogModal(false);
  };

  const statusIcons: Record<string, React.ReactNode> = {
    nominal: <span className="text-slate-500 font-mono text-[11px]">● Nominal</span>,
    calibrated: <span className="text-cyan-800 font-mono text-[11px]">● Calibrated</span>,
    verified: <span className="text-emerald-700 font-mono text-[11px]">● Verified</span>,
    warning: <span className="text-amber-700 font-mono text-[11px]">▲ Warning</span>,
  };

  return (
    <div className="space-y-8">
      {/* Saved Scenarios Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Persistent Records
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Saved Venture &amp; Farm Scenarios
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            {scenarios.length} Scenarios Stored in Local Registry
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{scen.name}</h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Saved: {scen.createdAt}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteScenario(scen.id)}
                  title="Delete scenario"
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 block">Daily Yield:</span>
                  <span className="font-bold text-cyan-900">{scen.summaryMetrics.dailyLiters} L</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Annual Savings:</span>
                  <span className="font-bold text-emerald-800">
                    ${scen.summaryMetrics.annualSavings.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Payback:</span>
                  <span className="font-bold text-slate-900">{scen.summaryMetrics.paybackMonths} mo</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {scen.farmProfile.acreage} ac · {scen.farmProfile.location}
                </span>
                <button
                  type="button"
                  onClick={() => onLoadScenario(scen)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-800" />
                  <span>Load Into Simulator</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity & Validation Logs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Field Validation Telemetry
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Activity Logs &amp; Calibration History
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddLogModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record New Trial</span>
            </button>
            <button
              type="button"
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-md transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-800" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Add Log Form Modal / Inset */}
        {showAddLogModal && (
          <form
            onSubmit={handleCreateLog}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
          >
            <div className="text-xs font-bold text-slate-800">Record Field Trial Observation</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Action / Test Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Willcox Station Unit 2 RH Desorption Run"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Observed Details &amp; Yield
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ambient 17% RH, harvested 492 L in 24 hours, zero fouling."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddLogModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-800 hover:bg-cyan-900 rounded-md"
              >
                Save Trial Entry
              </button>
            </div>
          </form>
        )}

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold text-slate-700">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">Action / Activity</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">Operational Detail</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {statusIcons[log.status] || log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
