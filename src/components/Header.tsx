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
import { AuthUser } from '../types/auth';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  currentRole: UserRole;
  onOpenReportModal: () => void;
  onOpenGuide: () => void;
  onOpenAssistant: () => void;
  authUser?: AuthUser | null;
  onOpenAuthModal?: (mode?: 'signin' | 'signup') => void;
  onLogout?: () => void;
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
  authUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  const getInitials = (name?: string) => {
    if (!name) return 'AF';
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      {/* Upper Brand & Quick Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-xs">
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                AeroFlora Systems
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 -mt-0.5 font-medium">
                Farm Water Intelligence · Designed for India
              </span>
            </div>
          </button>

          <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
            <span>PM-KUSUM Ready</span>
          </span>
        </div>

        {/* Action Controls & Language Selector & User Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAssistant}
            className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden md:inline">Kisan Jal Saathi (AI)</span>
            <span className="md:hidden">AI Saathi</span>
          </button>

          {/* Guide Playbook */}
          <button
            onClick={onOpenGuide}
            className="hidden sm:flex px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Guide</span>
          </button>

          {/* Indian Language Selector */}
          <div className="relative flex items-center">
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-800/90 text-slate-200 text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
              aria-label="Select Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.nativeName} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* User Authentication Chip / Sign In Button */}
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs transition cursor-pointer"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                    {getInitials(authUser.fullName)}
                  </div>
                  {authUser.authProvider === 'google' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center border border-slate-900" title="Google Authenticated">
                      <svg className="w-2 h-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[11px] text-slate-200 max-w-[110px] truncate">
                      {authUser.fullName}
                    </span>
                    <span className="text-[9px] bg-slate-900 text-sky-400 font-mono px-1 py-0.2 rounded border border-slate-700">
                      ID: {authUser.loginId || '0251MBA154'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono max-w-[150px] truncate">
                    {authUser.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 text-xs space-y-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="border-b border-slate-800 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{authUser.fullName}</span>
                      {authUser.authProvider === 'google' ? (
                        <span className="text-[10px] bg-sky-950/80 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800 flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                          Google
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded border border-slate-700">
                          ID Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] bg-slate-950 p-1.5 rounded-lg border border-slate-800 font-mono text-sky-300">
                      <span className="text-slate-400">Login ID:</span>
                      <span className="font-bold">{authUser.loginId || '0251MBA154'}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate mt-1">{authUser.email}</p>
                    <p className="text-sky-400/90 text-[10px] mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Role: <span className="font-bold capitalize">{authUser.role.replace('_', ' ')}</span>
                    </p>
                    {authUser.organization && (
                      <p className="text-slate-400 text-[10px] truncate">{authUser.organization}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onSelectTab('farmer_farm');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer transition"
                    >
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>My Farm Details</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Security & Roles</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 flex items-center justify-between cursor-pointer transition"
                    >
                      <span>Sign Out</span>
                      <span className="text-[10px] text-rose-400 font-mono">End Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal?.('signin')}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / ID</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Tab Bar for Desktop */}
      <div className="hidden lg:block bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
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
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-3 animate-in slide-in-from-top-4">
          {/* Mobile Auth Bar */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
            {authUser ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 font-black text-xs flex items-center justify-center">
                  {getInitials(authUser.fullName)}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{authUser.fullName}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{authUser.email}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-white">Guest Session</span>
                <p className="text-[10px] text-slate-500">Sign in to sync farm data</p>
              </div>
            )}

            {authUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="px-2.5 py-1 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded-lg border border-rose-800 transition cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal?.('signin');
                }}
                className="px-3 py-1.5 bg-sky-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-sky-400 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Navigation Links in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-1.5 pt-2">
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
                  className={`px-3 py-2.5 rounded-lg text-left text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
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
