import React, { useState } from 'react';
import {
  Users,
  Building,
  ShieldCheck,
  Coins,
  Bell,
  MessageSquare,
  CheckCircle2,
  Droplets,
  Calendar,
  Layers,
  ArrowRight,
  Send,
} from 'lucide-react';
import { FPONetworkProfile } from '../types/aeroflora';
import { SupportedLanguage } from '../utils/i18n';

interface CommunityFPONetworkViewProps {
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

const DEFAULT_FPO: FPONetworkProfile = {
  id: 'fpo-deesa-01',
  fpoName: 'Banaskantha Arid Farmers Producer Co. Ltd.',
  registrationNumber: 'CIN-U01100GJ2022PTC134890',
  district: 'Banaskantha',
  state: 'Gujarat',
  activeFarmersCount: 42,
  sharedTowersCount: 6,
  communalTankCapacityLitres: 40000,
  totalWaterDisbursedThisSeasonLiters: 182400,
  waterTokenBalanceLiters: 4800,
  announcements: [
    {
      id: 'ann-1',
      date: '28-Oct-2026',
      author: 'Dr. V. K. Sharma (KVK Agronomist)',
      role: 'Krishi Vigyan Kendra Advisory',
      title: 'Pomegranate Fruit Development Water Alert',
      body: 'High temperatures expected next week (41°C). Maintain minimum 8 L/tree daily root zone hydration to prevent fruit cracking. AeroFlora communal tower reserves are allocated preferentially to orchards with developing fruit.',
      isUrgent: true,
    },
    {
      id: 'ann-2',
      date: '20-Oct-2026',
      author: 'Secretary, Patel Cooperative',
      role: 'FPO Executive Committee',
      title: 'Scheduled Sorbent Bed Dust Maintenance',
      body: 'Tower Unit #3 and #4 solar glazing will undergo cleaning this Saturday morning at 07:00 AM. Water output will temporarily pause for 2 hours.',
      isUrgent: false,
    },
  ],
};

export const CommunityFPONetworkView: React.FC<CommunityFPONetworkViewProps> = ({
  currentLanguage,
  onShowToast,
}) => {
  const [fpo, setFpo] = useState<FPONetworkProfile>(DEFAULT_FPO);
  const [requestLiters, setRequestLiters] = useState<number>(500);
  const [requestPlot, setRequestPlot] = useState<string>('Plot 1 - North Orchard');

  const handleRequestWater = () => {
    onShowToast(`Dispatched water allocation token request for ${requestLiters} L to ${fpo.fpoName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Building className="w-3.5 h-3.5 text-teal-700" />
            <span>FPO Cooperative &amp; Gram Panchayat Network</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Community &amp; FPO Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cooperative water token allocation, shared atmospheric harvesting arrays, and Krishi Vigyan Kendra (KVK)
            advisories.
          </p>
        </div>

        <div className="text-xs font-mono bg-slate-100 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Registration CIN:</span>
          <span className="font-bold text-slate-800">{fpo.registrationNumber}</span>
        </div>
      </div>

      {/* FPO Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Active Member Farmers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {fpo.activeFarmersCount}
            </span>
            <span className="text-xs font-semibold text-slate-600">Holdings</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Across 5 adjoining villages
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Shared AeroFlora Towers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {fpo.sharedTowersCount}
            </span>
            <span className="text-xs font-semibold text-slate-600">Towers</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            ~2,700 L/day combined harvest
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Communal Tank Storage</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-700 font-mono">
              {(fpo.communalTankCapacityLitres / 1000).toFixed(0)} kL
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Gravity-fed distribution loop
          </span>
        </div>

        <div className="bg-emerald-950 text-white rounded-xl border border-emerald-800 p-5 shadow-sm space-y-2">
          <span className="text-xs text-emerald-300 font-medium">Your Water Token Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {fpo.waterTokenBalanceLiters.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-300">Litres</span>
          </div>
          <span className="text-[11px] text-emerald-300/80 block pt-1 border-t border-emerald-800">
            Entitlement for current fortnight
          </span>
        </div>
      </div>

      {/* Grid: Water Token Allocation Request & KVK Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Request Water Token Disbursal */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Redeem Communal Water Tokens</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Farm Plot</label>
              <select
                value={requestPlot}
                onChange={(e) => setRequestPlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium cursor-pointer"
              >
                <option value="Plot 1 - North Orchard">Plot 1 - North Orchard (Pomegranate)</option>
                <option value="Plot 2 - Cash Crop Block">Plot 2 - Cash Crop Block (Bt Cotton)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-700 font-semibold">Volume to Redeem (Litres)</label>
                <span className="font-mono font-bold text-emerald-700">{requestLiters} L</span>
              </div>
              <input
                type="range"
                min="100"
                max={fpo.waterTokenBalanceLiters}
                step="50"
                value={requestLiters}
                onChange={(e) => setRequestLiters(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Automated Dispatch</span>
              <p className="text-[11px]">
                Upon submission, the automated solar manifold valve at the communal tank opens at 05:00 AM tomorrow
                to deliver {requestLiters} L of mineralized water directly into your plot drip mainline.
              </p>
            </div>

            <button
              onClick={handleRequestWater}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Water Token Request</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Agronomist & KVK Announcements */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Krishi Vigyan Kendra &amp; FPO Agronomic Bulletin
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Advisory Board</span>
          </div>

          <div className="space-y-3">
            {fpo.announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border space-y-2 text-xs ${
                  ann.isUrgent
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ann.isUrgent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-600 text-white font-bold uppercase">
                        Urgent Moisture Advisory
                      </span>
                    )}
                    <span className="font-bold text-slate-900 text-sm">{ann.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{ann.date}</span>
                </div>

                <p className="text-slate-700 leading-relaxed">{ann.body}</p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Author: <strong className="text-slate-800">{ann.author}</strong> ({ann.role})</span>
                  <span className="text-emerald-700 font-semibold">Verified Krishi Advisor</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
