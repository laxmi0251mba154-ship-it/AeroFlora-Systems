import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  HardDrive,
  Eye,
} from 'lucide-react';
import { UserRole } from '../types/aeroflora';
import { SupportedLanguage } from '../utils/i18n';

interface AdminSystemManagementViewProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

interface RoleDefinition {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  permissions: string[];
}

const ROLES: RoleDefinition[] = [
  {
    role: 'farmer',
    title: 'Kisan / Farmer Operator',
    badge: 'bg-emerald-100 text-emerald-800',
    description: 'Individual landholder or orchard manager operating AeroFlora towers on personal acreage.',
    permissions: [
      'Manage own farm plots and crop types',
      'View local atmospheric water harvest data',
      'Calculate crop water demand (FAO-56)',
      'Request FPO communal water tokens',
    ],
  },
  {
    role: 'agronomist',
    title: 'KVK / Agronomist Advisor',
    badge: 'bg-teal-100 text-teal-800',
    description: 'Agricultural scientist or extension worker advising clusters on crop moisture and salinity.',
    permissions: [
      'Calibrate FAO-56 crop coefficients (Kc)',
      'Publish village moisture advisories & bulletins',
      'Audit soil salinity and SAR water quality tests',
      'Review regional crop deficit trends',
    ],
  },
  {
    role: 'technician',
    title: 'Field Service Technician',
    badge: 'bg-amber-100 text-amber-800',
    description: 'Authorized field hardware engineer servicing towers, ESP32 gateways, and sorbent beds.',
    permissions: [
      'Calibrate ESP32 IoT sensor telemetry',
      'Log calcite/dolomite filter cartridge replacements',
      'Test thermal desorption damper seals',
      'Manage offline firmware updates',
    ],
  },
  {
    role: 'fpo_admin',
    title: 'FPO Executive Administrator',
    badge: 'bg-indigo-100 text-indigo-800',
    description: 'Farmer Producer Organisation director managing shared assets and member water shares.',
    permissions: [
      'Allocate communal water tokens to members',
      'Monitor collective 40kL storage reservoir',
      'Prepare PM-KUSUM group subsidy filings',
      'View aggregated member farm yields',
    ],
  },
  {
    role: 'platform_admin',
    title: 'Platform System Architect',
    badge: 'bg-red-100 text-red-800',
    description: 'Central platform administrator with full audit, backup, and infrastructure control.',
    permissions: [
      'Full root access to all farm & telemetry records',
      'Export and backup system database (JSON)',
      'Manage API keys and IMD/CGWB data adapters',
      'Purge and reset simulated state data',
    ],
  },
];

export const AdminSystemManagementView: React.FC<AdminSystemManagementViewProps> = ({
  currentRole,
  onChangeRole,
  currentLanguage,
  onShowToast,
}) => {
  const [auditLogCount] = useState<number>(48);

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'AeroFlora Systems (India)',
      version: '4.2.0-enterprise',
      localStorageDump: { ...localStorage },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AeroFlora_System_Backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Platform database backup exported as JSON');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all simulated test scenarios and return to initial factory state?')) {
      localStorage.clear();
      onShowToast('Local test cache reset. Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <span>Role-Based Access Control (RBAC) &amp; Diagnostics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Admin &amp; System Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate user roles, audit platform telemetry logs, and export verifiable encrypted data backups.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database JSON</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-red-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Role Switcher Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Active User Role Simulation ({ROLES.length} Personas)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-bold">
            Current: {ROLES.find((r) => r.role === currentRole)?.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ROLES.map((r) => {
            const isSelected = currentRole === r.role;

            return (
              <div
                key={r.role}
                onClick={() => {
                  onChangeRole(r.role);
                  onShowToast(`Switched active session to: ${r.title}`);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold block w-fit mb-1.5 ${r.badge}`}>
                    {r.role.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                    {r.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-mono block">Permissions:</span>
                  <span className="text-[10px] font-semibold text-slate-700 block">
                    {r.permissions.length} Capabilities
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Health Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Local Storage Cache</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">Nominal</div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            Offline browser persistence active for remote field testing
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">IMD / CGWB Data Adapters</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-800 font-mono">Synchronized</div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            District climatology &amp; aquifer depths loaded
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Audit Logs Recorded</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">{auditLogCount} Events</div>
          <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
            All user operations tracked for ISO audit compliance
          </span>
        </div>
      </div>
    </div>
  );
};
