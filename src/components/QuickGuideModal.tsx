/**
 * AeroFlora Systems - Quick User Guide & Testing Playbook Modal
 */

import React from 'react';
import { X, Play, Sliders, Droplets, FileText, CheckCircle2, Scale, ArrowRight } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
  onStartTest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-900 text-white flex items-center justify-center font-bold text-xs">
              ?
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                How to Use &amp; Test AeroFlora Systems
              </h3>
              <div className="text-xs text-slate-500 font-mono">
                Interactive Testing Playbook
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Run a Live Extraction Test
                </h4>
                <p className="text-slate-600">
                  Click the blue <strong>&quot;Run Live Extraction Test&quot;</strong> button at the top right of the console. Watch the test progress bar animate and observe the <strong>Farm Buffer Reservoir</strong> level fill up with freshly harvested water in real time.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Calibrate Field Aridity &amp; Tower Sizing
                </h4>
                <p className="text-slate-600">
                  Use the sliders under <strong>Live Field Test Parameters</strong>:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                  <li><strong>Ambient RH:</strong> Test between 15% (extreme micro-drought) and 25% RH. Confirm the single-tower extraction always exceeds the <strong>450 L/day</strong> validation objective.</li>
                  <li><strong>Towers Installed:</strong> Increase towers from 3 to 5 to watch the total daily output scale to 2,500+ L/day and completely replace water hauling expenses.</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Explore Specialized Tabs
                </h4>
                <p className="text-slate-600">
                  Click the navigation links at the top:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                  <li><strong>Biomimetic Engine:</strong> Examine how Stenocara beetle surface physics attract droplets and scrub the 24-hour diurnal cycle.</li>
                  <li><strong>Solar Mineralization:</strong> Inspect the volcanic basalt and calcite bed that enriches water with calcium and magnesium to prevent pecan hull splitting.</li>
                  <li><strong>Financial Pro-Forma:</strong> View the 5-year cashflow schedule showing an amortized 22.7-month payback.</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 mb-1">
                  Export Deliverables for Your Assignment
                </h4>
                <p className="text-emerald-900">
                  Click <strong>&quot;Audit PDF&quot;</strong> in the header at any time to open your formal Assignment 2 Executive Feasibility Report with your student details (Laxmi Kumari, 0251MBA154) and click <strong>&quot;Print / Save as PDF&quot;</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close Guide
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartTest();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-900 hover:bg-cyan-950 rounded-xl shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Try a Test Run Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
