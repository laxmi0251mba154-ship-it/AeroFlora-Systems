/**
 * AeroFlora Systems - Top Bar & Navigation Component
 * Professional deep forest green branding with India-first language selector
 */

import React, { useState } from 'react';
import {
  Droplets,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Languages,
  Layers,
  ChevronDown,
  Building,
  User,
  ShieldCheck,
  TrendingUp,
  Cpu,
  FileText,
  Sliders,
  Compass,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, TRANSLATIONS } from '../utils/i18n';
import { UserRole } from '../types/aeroflora';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  currentRole: UserRole;
  onOpenReportModal: () => void;
  onOpenGuide: () => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentLanguage,
  onChangeLanguage,
  currentRole,
  onOpenReportModal,
  onOpenGuide,
  onOpenAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navItems = [
    { key: 'overview', label: t.nav_overview || 'Overview', icon: Compass },
    { key: 'farmer_farm', label: t.nav_farmer_farm || 'My Farm', icon: User },
    { key: 'water_intel', label: t.nav_water_intel || 'Water Intelligence', icon: Droplets },
    { key: 'simulator', label: t.nav_simulator || 'Simulator', icon: Sliders },
    { key: 'cycle', label: t.nav_biomimetic || '24h Biomimetic', icon: Layers },
    { key: 'crop_planner', label: t.nav_crop_planner || 'Crop Planner', icon: Layers },
    { key: 'mineralization', label: t.nav_water_quality || 'Water Quality', icon: ShieldCheck },
    { key: 'roi', label: t.nav_financial || 'Financial ROI', icon: TrendingUp },
    { key: 'equipment', label: t.nav_equipment || 'Towers & IoT', icon: Cpu },
    { key: 'community', label: t.nav_community || 'FPO Network', icon: Building },
    { key: 'reports', label: t.nav_reports || 'Reports', icon: FileText },
    { key: 'help', label: t.nav_help || 'Help & Support', icon: HelpCircle },
    { key: 'admin', label: t.nav_admin || 'Admin Roles', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950 text-white border-b border-emerald-900 shadow-md">
      {/* Upper Brand & Quick Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Droplets className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                AeroFlora Systems
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-300/80 -mt-0.5 font-medium">
                Farm Water Intelligence · Designed for India
              </span>
            </div>
          </button>

          <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PM-KUSUM Ready</span>
          </span>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAssistant}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">Kisan Jal Saathi (AI)</span>
            <span className="sm:hidden">AI Saathi</span>
          </button>

          {/* Guide Playbook */}
          <button
            onClick={onOpenGuide}
            className="px-2.5 py-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 text-xs font-medium rounded-lg border border-emerald-700/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">Quick Guide</span>
          </button>

          {/* Indian Language Selector */}
          <div className="relative flex items-center">
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
              className="bg-emerald-900/80 text-emerald-100 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-700/60 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.nativeName} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Tab Bar for Desktop */}
      <div className="hidden lg:block bg-emerald-900/60 border-t border-emerald-800/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-200/90 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 p-4 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectTab(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-emerald-900/50 text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
