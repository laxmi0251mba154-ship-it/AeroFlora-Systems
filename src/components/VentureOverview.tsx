/**
 * AeroFlora Systems - Venture Overview & Problem Framing
 * Directly maps the Venture App Build Brief (Assignment 2)
 */

import React from 'react';
import {
  Droplets,
  Sun,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface VentureOverviewProps {
  onStartSimulation: () => void;
  onOpenReport: () => void;
}

export const VentureOverview: React.FC<VentureOverviewProps> = ({
  onStartSimulation,
  onOpenReport,
}) => {
  return (
    <div className="space-y-12">
      {/* Editorial Academic & Venture Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <span>DGU VENTURE QUEST</span>
              <span aria-hidden="true">·</span>
              <span>Entrepreneurship & Innovation</span>
              <span aria-hidden="true">·</span>
              <span>DBS Global University</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Assignment 2 — Venture App Build Brief
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="font-semibold text-slate-900">Student:</span> Laxmi Kumari (0251MBA154)
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div>
              <span className="font-semibold text-slate-900">Email:</span> laxmi.0251mba154@dgu.ac.in
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-1 font-mono text-cyan-800">
              <span>https://aeroflora-systems.ai.studio/</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-cyan-800 tracking-wider uppercase font-mono">
              Off-Grid Agronomic Water Security
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Biomimetic Passive Condensation for Hyper-Arid Tree-Nut Agriculture
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Targeted at independent, off-grid organic tree-nut (pecans, pistachios) and specialty crop growers
              in Southern Arizona managing 20–100 acres who currently spend over <strong className="text-slate-900">$4,000 monthly</strong> on
              trucked water during dry season peaks. AeroFlora Systems extracts daily operational irrigation water
              from 15%–30% relative humidity ambient air with zero grid electricity.
            </p>

            {/* Validation Objective Strip */}
            <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 font-mono uppercase">
                <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                <span>Core Validation Objective (Brief Mandate)</span>
              </div>
              <p className="text-xs text-cyan-900 leading-relaxed">
                The core biomimetic atmospheric water harvesting tower can reliably extract at least{' '}
                <strong className="font-bold underline decoration-cyan-400">450 liters of pure water daily</strong> in
                hyper-arid conditions (15%–25% relative humidity) on an off-grid farm site without fouling or performance drop.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onStartSimulation}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cyan-800 hover:bg-cyan-900 rounded-lg transition-colors shadow-sm"
              >
                <span>Launch Tower Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenReport}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                View Venture Brief & Report
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video lg:aspect-4/3 bg-slate-900">
              <img
                src="/src/assets/images/aeroflora_tower_desert_1793610371842.jpg"
                alt="AeroFlora Biomimetic Atmospheric Water Harvesting Tower in Southern Arizona Desert"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="text-xs font-mono text-cyan-300">Biomimetic Harvester Unit #01</div>
                <div className="text-sm font-semibold text-white">Willcox Basin Field Station, Cochise County, AZ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards: Problem, Technical Solution, Economic Relief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">The Problem in Southern AZ</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Extended micro-droughts cause agricultural water tables to drop below well pump intakes. During dry season peaks,
            growers face extreme crop loss risks and pay $3,000–$8,000 monthly for emergency water trucking. Standard AWGs fail
            at low humidity (below 40% RH) and demand excessive electrical wattage.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Biomimetic Condensation</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Engineered with micro-grooved hydrophobic ridges and hydrophilic condensation points modeled after desert beetles.
            Nocturnal MOF sorption captures sparse atmospheric moisture at 15%–25% RH, released during morning solar thermal
            desorption without grid electrical connection.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Solar Mineralization</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pure atmospheric condensate lacks essential soil nutrients. AeroFlora’s integrated passive solar mineralization module
            naturally infuses bioavailable calcium and magnesium through volcanic basalt and calcite beds, balancing irrigation water
            to pH 7.6 and 190+ TDS to prevent nut-splitting.
          </p>
        </div>
      </div>

      {/* Target Grower Profile & Field Context with Real Image */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
              <img
                src="/src/assets/images/arizona_orchard_drought_1793610371789.jpg"
                alt="Off-Grid Pecan Orchard in Cochise County Arizona"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Target geography: Willcox Basin, San Simon, and Pinal County, Arizona</span>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Target User & Economics
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Built Specifically for 20–100 Acre Off-Grid Growers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Target Acreage</div>
                <div className="text-xl font-bold text-slate-900 font-mono">20–100</div>
                <div className="text-xs text-slate-500">Pecans & Pistachios</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Peak Trucking Cost</div>
                <div className="text-xl font-bold text-rose-700 font-mono">$4,000+</div>
                <div className="text-xs text-slate-500">Per month / dry season</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Validation Yield</div>
                <div className="text-xl font-bold text-cyan-800 font-mono">≥ 450 L</div>
                <div className="text-xs text-slate-500">Daily per tower at 15–25% RH</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tree-nut crops in Southern Arizona represent high-value multi-decade capital investments. Losing even 10% of mature
              pecan or pistachio trees to micro-drought can devastate a family-run farm. AeroFlora provides a baseline of daily
              high-purity mineralized water to maintain root hydration during 90-to-180-day micro-drought intervals.
            </p>
          </div>
        </div>
      </div>

      {/* Scope Boundary: What Will NOT Be Included in Version 1 */}
      <div className="p-6 bg-slate-100/70 border border-slate-300 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>Venture Quest V1 Scope Boundary & Discipline</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          As specified in Assignment 2, to prevent CapEx bloat and developmental delays, Version 1 strictly focuses on the core
          differentiator: <strong>Biomimetic Passive Condensation & Solar Mineralization</strong>. Integrated automated crop-scheduling AI software,
          multi-tower synchronized mesh networking, custom aesthetic casing, and ultra-high-capacity multi-thousand gallon storage vaults
          are explicitly excluded from Version 1.
        </p>
      </div>
    </div>
  );
};
