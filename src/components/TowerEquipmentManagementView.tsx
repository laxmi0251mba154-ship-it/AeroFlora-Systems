import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Droplets,
  Thermometer,
  Wrench,
  CheckCircle2,
  HardDrive,
  Activity,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { EquipmentTower } from '../types/aeroflora';
import { SupportedLanguage } from '../utils/i18n';

interface TowerEquipmentManagementViewProps {
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

const INITIAL_FLEET: EquipmentTower[] = [
  {
    id: 'tower-01',
    serialNumber: 'AF-MK4-RJ-001',
    nickname: 'North Orchard Tower A',
    villageLocation: 'Rajpur Village, Deesa',
    district: 'Banaskantha',
    state: 'Gujarat',
    installationDate: '12-Jan-2025',
    sorbentMaterial: 'MOF-801',
    sorbentMassKg: 200,
    status: 'condensation',
    coreTemperatureC: 78.4,
    sorbentBedRHPct: 18.2,
    dailyYieldLiters: 462.5,
    targetDailyYieldLiters: 450,
    lifetimeAccumulatedLiters: 14280,
    condenserPlateTempC: 16.8,
    esp32Telemetry: {
      status: 'online',
      signalRssi: -64,
      firmwareVersion: 'v2.4.1-esp32-in',
      solarVolts: 21.4,
      batteryPct: 94,
      lastPing: '2 mins ago',
    },
    filterCartridgeDaysRemaining: 184,
    nextDesorptionScheduled: 'Tomorrow 09:30 IST',
  },
  {
    id: 'tower-02',
    serialNumber: 'AF-MK4-RJ-002',
    nickname: 'South Pomegranate Tower B',
    villageLocation: 'Barmer Rural Pilot Bed',
    district: 'Barmer',
    state: 'Rajasthan',
    installationDate: '08-Mar-2025',
    sorbentMaterial: 'MOF-801',
    sorbentMassKg: 200,
    status: 'adsorbing',
    coreTemperatureC: 24.1,
    sorbentBedRHPct: 28.5,
    dailyYieldLiters: 438.0,
    targetDailyYieldLiters: 450,
    lifetimeAccumulatedLiters: 9850,
    condenserPlateTempC: 18.2,
    esp32Telemetry: {
      status: 'online',
      signalRssi: -71,
      firmwareVersion: 'v2.4.1-esp32-in',
      solarVolts: 18.8,
      batteryPct: 88,
      lastPing: '4 mins ago',
    },
    filterCartridgeDaysRemaining: 240,
    nextDesorptionScheduled: 'Tomorrow 09:30 IST',
  },
];

export const TowerEquipmentManagementView: React.FC<TowerEquipmentManagementViewProps> = ({
  currentLanguage,
  onShowToast,
}) => {
  const [fleet, setFleet] = useState<EquipmentTower[]>(INITIAL_FLEET);
  const [selectedTowerId, setSelectedTowerId] = useState<string>(INITIAL_FLEET[0].id);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'gateway_specs' | 'maintenance'>('telemetry');

  const selectedTower = fleet.find((t) => t.id === selectedTowerId) || fleet[0];

  const handleTriggerCalibration = () => {
    onShowToast(`Dispatched sensor re-calibration ping to ${selectedTower.serialNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            <span>ESP32-Powered Telemetry Fleet Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Tower &amp; Equipment Management (IoT)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time sensor streams, sorbent chamber diagnostics, condensation thermals, and low-power ESP32 edge
            gateway configurations.
          </p>
        </div>

        <button
          onClick={handleTriggerCalibration}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Fleet Telemetry</span>
        </button>
      </div>

      {/* Fleet Overview Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fleet.map((tower) => (
          <div
            key={tower.id}
            onClick={() => setSelectedTowerId(tower.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTowerId === tower.id
                ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-slate-900">{tower.nickname}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">{tower.serialNumber}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Yield Today</span>
                <span className="font-bold text-emerald-700">{tower.dailyYieldLiters} L</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Core Temp</span>
                <span className="font-bold text-amber-700">{tower.coreTemperatureC}°C</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">IoT Status</span>
                <span className="font-bold text-cyan-700 capitalize">{tower.esp32Telemetry.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Tabs: Telemetry vs ESP32 Specs vs Maintenance */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'telemetry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-700" />
          <span>Real-Time Sensor Streams</span>
        </button>
        <button
          onClick={() => setActiveTab('gateway_specs')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'gateway_specs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-700" />
          <span>ESP32 Hardware Pinout &amp; Gateway Setup</span>
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'maintenance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-700" />
          <span>Preventive Maintenance Checklist</span>
        </button>
      </div>

      {/* Tab Content 1: Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-medium">Sorbent Chamber Temp</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-700 font-mono">
                {selectedTower.coreTemperatureC}°C
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
              Desorption Phase Nominal (Target &gt; 70°C)
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-medium">Internal Chamber RH</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-700 font-mono">
                {selectedTower.sorbentBedRHPct}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
              Sealed Desorption Vapor Pressure
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-medium">Biomimetic Condenser Plate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-700 font-mono">
                {selectedTower.condenserPlateTempC}°C
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-100">
              Sub-surface Passive Radiative Sink
            </span>
          </div>

          <div className="bg-emerald-950 text-white rounded-xl border border-emerald-800 p-5 shadow-sm space-y-2">
            <span className="text-xs text-emerald-300 font-medium">Lifetime Yield Harvest</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {selectedTower.lifetimeAccumulatedLiters.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-300 font-semibold">Litres</span>
            </div>
            <span className="text-[11px] text-emerald-300/80 block pt-1 border-t border-emerald-800">
              {(selectedTower.lifetimeAccumulatedLiters / 1000).toFixed(1)} kL since deployment
            </span>
          </div>
        </div>
      )}

      {/* Tab Content 2: ESP32 Gateway Hardware Specs */}
      {activeTab === 'gateway_specs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Cpu className="w-4 h-4 text-cyan-700" />
            <span>ESP32-S3 Edge Gateway Circuit &amp; Pinout Blueprint</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800">Hardware Component Topology</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block font-mono">Microcontroller: ESP32-S3 WROOM-1</strong>
                  Dual-core Xtensa 240 MHz, 8MB Flash, 512KB SRAM, hardware deep-sleep timer (consumption &lt;15 µA).
                </li>
                <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block font-mono">Sensors: SHT45 (High Accuracy RH/Temp)</strong>
                  Connected via I2C (GPIO 21 SDA, GPIO 22 SCL). Accuracy: ±1.0% RH, ±0.1°C inside sorbent core.
                </li>
                <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block font-mono">Liquid Flow Meter: Sensirion SLF3S</strong>
                  Thermal flow sensor for micro-liter condensate rate metering down to 0.1 mL/min.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800">Telemetry Communication &amp; Offline Cache</h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1.5 text-slate-700">
                <span className="font-bold text-slate-900 block">Protocol Configuration</span>
                <p>• Transmit: MQTT over TLS (Port 8883) or HTTP/2 POST to AeroFlora Cloud</p>
                <p>• Backup Network: 4G LTE-M / NB-IoT SIM7080G fallback if Wi-Fi absent</p>
                <p>• Local Storage: 16MB SPIFFS circular buffer holds 90 days of offline telemetry</p>
                <p>• Deep Sleep Cycle: Wakes for 4 seconds every 15 minutes to take readings</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Maintenance Checklist */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Preventive Maintenance &amp; Field Servicing Protocol</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 block">Solar Glazing Dust Wipe (Bi-Weekly)</strong>
                <p className="text-emerald-800 text-[11px]">
                  Dry wipe external anti-reflective borosilicate glass hood with microfiber cloth to maintain &gt;80%
                  solar transmission in dusty arid zones.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Calcite &amp; Dolomite Filter Cartridge (Annual)</strong>
                <p className="text-slate-600 text-[11px]">
                  Next servicing scheduled in {selectedTower.filterCartridgeDaysRemaining} days. Unscrew lower 10-inch
                  housing and replace certified food-grade mineral media.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Thermal Damper Silicone Gasket Inspection (Every 6 Months)</strong>
                <p className="text-slate-600 text-[11px]">
                  Inspect perimeter silicone seal around nocturnal natural-convection louvers to ensure zero vapor leakage
                  during daytime desorption sealing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
