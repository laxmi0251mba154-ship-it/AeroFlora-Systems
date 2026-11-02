/**
 * AeroFlora Systems - Live Operations & Field Testing Console
 * Real-time testing interface with live telemetry, sensor prober, and reservoir monitoring
 */

import React, { useState, useEffect } from 'react';
import {
  BusinessInputs,
  EnvironmentalConditions,
  FarmProfile,
  SimulationResult,
} from '../types/aeroflora';
import {
  Droplets,
  Play,
  Pause,
  RotateCcw,
  ZapOff,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Thermometer,
  Wind,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface LiveOperationsConsoleProps {
  simulation: SimulationResult;
  farmProfile: FarmProfile;
  onChangeFarmProfile: (profile: FarmProfile) => void;
  businessInputs: BusinessInputs;
  onChangeBusinessInputs: (inputs: BusinessInputs) => void;
  environmentalConditions: EnvironmentalConditions;
  onChangeEnvironmentalConditions: (env: EnvironmentalConditions) => void;
  onOpenReport: () => void;
  onOpenArrayMatrix: () => void;
}

export const LiveOperationsConsole: React.FC<LiveOperationsConsoleProps> = ({
  simulation,
  farmProfile,
  onChangeFarmProfile,
  businessInputs,
  onChangeBusinessInputs,
  environmentalConditions,
  onChangeEnvironmentalConditions,
  onOpenReport,
  onOpenArrayMatrix,
}) => {
  // Live Testing Simulation States
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [liveTicks, setLiveTicks] = useState(0);
  const [simulatedHour, setSimulatedHour] = useState(13); // 13:00 peak solar desorption
  const [liveFlowDelta, setLiveFlowDelta] = useState(0);
  const [tankLevelLiters, setTankLevelLiters] = useState(3420);
  const [isRunningTestRun, setIsRunningTestRun] = useState(false);
  const [testRunProgress, setTestRunProgress] = useState(0);

  // Live sensor ticker
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setLiveTicks((prev) => prev + 1);
      // subtle micro-fluctuations simulating real physical air sensors
      setLiveFlowDelta((Math.random() - 0.5) * 1.8);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handle Live Test Run execution
  const handleTriggerTestRun = () => {
    setIsRunningTestRun(true);
    setTestRunProgress(0);
    const interval = setInterval(() => {
      setTestRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningTestRun(false);
          setTankLevelLiters((curr) => Math.min(5000, curr + 120));
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const currentHourData = simulation.hourlyCycle[simulatedHour] || simulation.hourlyCycle[12];
  const liveExtractionRate = Math.max(
    0,
    Math.round((currentHourData.extractionRateLitersPerHour * environmentalConditions.towerUnits + liveFlowDelta) * 10) / 10
  );

  const tankPercentage = Math.min(100, Math.round((tankLevelLiters / 5000) * 100));

  return (
    <div className="space-y-6">
      {/* Top Telemetry Ribbon */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveStreaming ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {farmProfile.farmName} — Live Field Operations
                </h1>
                <span className="text-[11px] font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                  {farmProfile.basin}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Site ID: AZ-COCHISE-01 · {environmentalConditions.towerUnits} Biomimetic Towers Active · Off-Grid Autonomous
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                isLiveStreaming
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveStreaming ? 'Live Stream: Active' : 'Live Stream: Paused'}</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerTestRun}
              disabled={isRunningTestRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{isRunningTestRun ? `Testing (${testRunProgress}%)` : 'Run Live Extraction Test'}</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Live Output Velocity</div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-0.5">
              {liveExtractionRate} <span className="text-xs font-normal text-slate-400">L/hr</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              ~{Math.round(liveExtractionRate * 0.264)} GPH
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Daily Projected Yield</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
              {simulation.totalDailyLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">L/day</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 font-semibold">
              ✓ {simulation.dailyLitersPerTower} L/tower (≥450 L)
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Ambient Aridity (RH)</div>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-0.5">
              {environmentalConditions.ambientRelativeHumidity}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Vapor: {currentHourData.absoluteHumidityGramsPerM3} g/m³
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Tower Sorbent Core</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
              {currentHourData.towerTempC}°C
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Solar Desorption Peak
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Water Mineral Purity</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
              199.2 <span className="text-xs font-normal text-slate-400">TDS</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              pH 7.6 · Calibrated Ca²⁺/Mg²⁺
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Grid Draw / Pumping</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
              0.0 <span className="text-xs font-normal text-slate-400">kW</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              100% Passive Solar
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Live Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Interactive Harvester & Reservoir (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Harvester Live Visualizer Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-800" />
                <h3 className="text-base font-bold text-slate-900">
                  Biomimetic Condensation &amp; Storage Chamber
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Unit Status: <strong className="text-emerald-700">Online &amp; Harvesting</strong>
              </span>
            </div>

            {/* Visual Cross-Section & Reservoir Display */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-950">
                <img
                  src={IMAGES.towerDesert}
                  alt="AeroFlora Tower Desert Installation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700 rounded-lg p-2 text-white text-[11px] font-mono">
                  <div className="text-cyan-400 font-bold">Harvester #01 Telemetry</div>
                  <div>Condenser Fins: 24.6°C</div>
                  <div>Relative Airflow: 1.8 m/s</div>
                  <div>Droplet Velocity: 14 mm/s</div>
                </div>

                <div className="absolute bottom-3 right-3 bg-emerald-950/90 border border-emerald-700 rounded-lg px-2.5 py-1 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Condensation</span>
                </div>
              </div>

              {/* Live Reservoir / Holding Tank */}
              <div className="sm:col-span-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 font-mono flex justify-between items-center">
                  <span>Farm Buffer Reservoir</span>
                  <span className="text-cyan-900">{tankPercentage}%</span>
                </div>

                {/* Animated Tank Level Bar */}
                <div className="h-28 w-full bg-slate-200 rounded-lg overflow-hidden flex flex-col justify-end relative border border-slate-300">
                  <div
                    style={{ height: `${tankPercentage}%` }}
                    className="w-full bg-gradient-to-t from-cyan-800 to-cyan-500 transition-all duration-500 relative"
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2">
                    <span className="text-lg font-bold font-mono text-slate-900 drop-shadow-sm">
                      {tankLevelLiters.toLocaleString()} L
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      Capacity: 5,000 L
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Daily Runoff:</span>
                    <span className="font-bold text-slate-800">+{simulation.totalDailyLiters} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orchard Line Pressure:</span>
                    <span className="font-bold text-slate-800">42 PSI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Flow Test Bar (if running) */}
            {isRunningTestRun && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-cyan-950 font-mono">
                  <span>Executing 60-Second Condensate Yield Test...</span>
                  <span>{testRunProgress}% Complete</span>
                </div>
                <div className="w-full bg-cyan-200 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${testRunProgress}%` }}
                    className="bg-cyan-800 h-full transition-all duration-300"
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Live Psychrometric & Extraction Curve */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Live Psychrometric Extraction Velocity (24h Diurnal)
              </h3>
              <div className="text-xs font-mono text-slate-500">
                Selected Hour: <strong className="text-slate-900">{currentHourData.label}</strong>
              </div>
            </div>

            <div className="h-40 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-end gap-1 sm:gap-2">
              {simulation.hourlyCycle.map((pt) => {
                const maxRate = 120;
                const heightPercent = Math.min(100, Math.max(6, (pt.extractionRateLitersPerHour / maxRate) * 100));
                const isSelected = pt.hour === simulatedHour;
                return (
                  <button
                    type="button"
                    key={pt.hour}
                    onClick={() => setSimulatedHour(pt.hour)}
                    className="flex-1 flex flex-col items-center justify-end h-full group focus:outline-none cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all ${
                        isSelected
                          ? 'bg-cyan-900 ring-2 ring-cyan-500'
                          : pt.extractionRateLitersPerHour > 0
                          ? 'bg-cyan-700/80 group-hover:bg-cyan-800'
                          : 'bg-indigo-300/40 group-hover:bg-indigo-400'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono mt-1 ${
                        isSelected ? 'font-bold text-cyan-950' : 'text-slate-400'
                      }`}
                    >
                      {pt.hour % 4 === 0 ? pt.hour : ''}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>00:00 Night Sorption (0 L/hr)</span>
              <span>12:00 Diurnal Condensation Peak (~110 L/hr/tower)</span>
              <span>23:00 Cool Night</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Testing Controls & Parameter Adjustments (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Field Controls */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Live Field Test Parameters
              </h3>
              <span className="text-[11px] font-mono text-cyan-800 font-semibold">
                Instant Calibration
              </span>
            </div>

            {/* RH Slider */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Ambient Relative Humidity</span>
                <span className="font-mono text-cyan-900 font-extrabold text-sm">
                  {environmentalConditions.ambientRelativeHumidity}% RH
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={30}
                step={1}
                value={environmentalConditions.ambientRelativeHumidity}
                onChange={(e) =>
                  onChangeEnvironmentalConditions({
                    ...environmentalConditions,
                    ambientRelativeHumidity: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15% (Extreme Arid)</span>
                <span>20% (Typical Summer)</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tower Units */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Active Harvesting Towers</span>
                <span className="font-mono text-slate-900 font-extrabold text-sm">
                  {environmentalConditions.towerUnits} Units
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={environmentalConditions.towerUnits}
                onChange={(e) =>
                  onChangeEnvironmentalConditions({
                    ...environmentalConditions,
                    towerUnits: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-900 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500 font-mono">
                Installed array capacity: {simulation.totalDailyLiters.toLocaleString()} Liters / day
              </div>
            </div>

            {/* Monthly Trucking Cost */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Baseline Water Trucking Expense</span>
                <span className="font-mono text-rose-700 font-extrabold text-sm">
                  ${businessInputs.monthlyHaulingExpense.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={8000}
                step={200}
                value={businessInputs.monthlyHaulingExpense}
                onChange={(e) =>
                  onChangeBusinessInputs({
                    ...businessInputs,
                    monthlyHaulingExpense: Number(e.target.value),
                  })
                }
                className="w-full accent-rose-700 cursor-pointer"
              />
              <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                AeroFlora replaces ${simulation.haulingExpenseOffsetMonthly.toLocaleString()}/mo of hauling
              </div>
            </div>

            {/* Farm Acreage */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Farm Acreage</span>
                <span className="font-mono text-slate-900 font-extrabold text-sm">
                  {farmProfile.acreage} Acres
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={farmProfile.acreage}
                onChange={(e) =>
                  onChangeFarmProfile({
                    ...farmProfile,
                    acreage: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-900 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500 font-mono">
                {farmProfile.cropType.replace('_', ' ').toUpperCase()} · {farmProfile.location}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenArrayMatrix}
                className="w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Compare 2 vs 3 vs 5 Towers Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenReport}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Generate Official Feasibility Audit (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
