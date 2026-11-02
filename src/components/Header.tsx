/**
 * AeroFlora Systems - Top Bar Component
 * Adheres strictly to the 3-Zone Top Bar Contract
 */

import React from 'react';
import { CloudUpload } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenDeployModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('overview');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-cyan-800 transition-colors"
        >
          AeroFlora Systems
        </a>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'overview'
                ? 'text-cyan-800 font-semibold border-b-2 border-cyan-700'
                : 'hover:text-slate-900'
            }`}
          >
            Venture Overview
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'simulator'
                ? 'text-cyan-800 font-semibold border-b-2 border-cyan-700'
                : 'hover:text-slate-900'
            }`}
          >
            Extraction Simulator
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('cycle')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'cycle'
                ? 'text-cyan-800 font-semibold border-b-2 border-cyan-700'
                : 'hover:text-slate-900'
            }`}
          >
            Biomimetic Cycle
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('mineralization')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'mineralization'
                ? 'text-cyan-800 font-semibold border-b-2 border-cyan-700'
                : 'hover:text-slate-900'
            }`}
          >
            Solar Mineralization
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('roi')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'roi'
                ? 'text-cyan-800 font-semibold border-b-2 border-cyan-700'
                : 'hover:text-slate-900'
            }`}
          >
            Financial ROI
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDeployModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-cyan-900 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Deploy to Vercel & Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
