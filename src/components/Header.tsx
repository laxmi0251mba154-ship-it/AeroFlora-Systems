/**
 * AeroFlora Systems - Top Bar Component
 * Clean, modern 3-zone live operational navigation
 */

import React from 'react';
import { CloudUpload, FileText, Scale } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDeployModal: () => void;
  onOpenReportModal: () => void;
  onOpenArrayMatrix: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenDeployModal,
  onOpenReportModal,
  onOpenArrayMatrix,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#live"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('live');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-cyan-900 transition-colors"
          >
            AeroFlora Systems
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Field Telemetry</span>
          </span>
        </div>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('live')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'live'
                ? 'text-cyan-900 font-bold border-b-2 border-cyan-800'
                : 'hover:text-slate-900'
            }`}
          >
            Live Console
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('cycle')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'cycle'
                ? 'text-cyan-900 font-bold border-b-2 border-cyan-800'
                : 'hover:text-slate-900'
            }`}
          >
            Biomimetic Engine
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('mineralization')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'mineralization'
                ? 'text-cyan-900 font-bold border-b-2 border-cyan-800'
                : 'hover:text-slate-900'
            }`}
          >
            Solar Mineralization
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('roi')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'roi'
                ? 'text-cyan-900 font-bold border-b-2 border-cyan-800'
                : 'hover:text-slate-900'
            }`}
          >
            Financial Pro-Forma
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('scenarios')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'scenarios'
                ? 'text-cyan-900 font-bold border-b-2 border-cyan-800'
                : 'hover:text-slate-900'
            }`}
          >
            Trial Logs
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-950 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition-colors cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-cyan-900 text-white flex items-center justify-center text-[10px]">?</span>
            <span>How to Use</span>
          </button>
          <button
            type="button"
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit PDF</span>
          </button>
          <button
            type="button"
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-cyan-950 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Cloud Deployment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
