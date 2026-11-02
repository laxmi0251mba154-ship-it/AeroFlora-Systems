/**
 * AeroFlora Systems - Persistent Storage & Calibrated Scenarios
 * Professional Version for Venture Quest Assignment 2
 */

import {
  ActivityLog,
  BusinessInputs,
  EnvironmentalConditions,
  FarmProfile,
  SavedScenario,
} from '../types/aeroflora';

export const DEFAULT_FARM_PROFILE: FarmProfile = {
  growerName: 'Laxmi Kumari',
  farmName: 'Willcox Basin Pecan Ranch',
  location: 'Cochise County, Southern Arizona',
  basin: 'Willcox Groundwater Basin (Unregulated Sub-basin)',
  acreage: 45,
  cropType: 'organic_pecan',
  treeDensityPerAcre: 27, // 1,215 mature Western Schley trees
  soilType: 'Arid Sandy Loam with Caliche Sub-layer',
  wellWaterTableDepthFt: 520, // 520 ft static water table (micro-drought drop)
};

export const DEFAULT_BUSINESS_INPUTS: BusinessInputs = {
  monthlyHaulingExpense: 4800,
  haulingCostPerThousandGallons: 92,
  drySeasonMonths: 5,
  dieselPumpingCostMonthly: 1250,
  cropYieldValuePerAcre: 6800,
};

export const DEFAULT_ENVIRONMENTAL_CONDITIONS: EnvironmentalConditions = {
  ambientRelativeHumidity: 18, // 18% RH within 15%-25% critical window
  daytimePeakTempC: 41, // 106°F Arizona summer peak
  nighttimeMinTempC: 17, // 62°F nocturnal cooling
  towerUnits: 3,
  dailyTargetLiters: 1500,
};

export const INITIAL_SAVED_SCENARIOS: SavedScenario[] = [
  {
    id: 'scen-1',
    name: 'Willcox Basin 45-Acre Pecan (Baseline 3-Tower Array)',
    createdAt: '2026-11-02 08:30 MST',
    farmProfile: DEFAULT_FARM_PROFILE,
    businessInputs: DEFAULT_BUSINESS_INPUTS,
    environmentalConditions: DEFAULT_ENVIRONMENTAL_CONDITIONS,
    summaryMetrics: {
      dailyLiters: 1512,
      annualSavings: 29312,
      paybackMonths: 22.7,
      meetsValidation: true,
    },
  },
  {
    id: 'scen-2',
    name: 'Pinal County 75-Acre Pistachio (High Aridity 5-Tower Array)',
    createdAt: '2026-10-28 14:15 MST',
    farmProfile: {
      growerName: 'Marcus Vance',
      farmName: 'Picacho Peak Nut Orchards',
      location: 'Pinal County, Southern Arizona',
      basin: 'Pinal Active Management Area (AMA)',
      acreage: 75,
      cropType: 'pistachio',
      treeDensityPerAcre: 130,
      soilType: 'Alluvial Desert Clay with Gypsum',
      wellWaterTableDepthFt: 610,
    },
    businessInputs: {
      monthlyHaulingExpense: 6800,
      haulingCostPerThousandGallons: 105,
      drySeasonMonths: 6,
      dieselPumpingCostMonthly: 1800,
      cropYieldValuePerAcre: 7400,
    },
    environmentalConditions: {
      ambientRelativeHumidity: 16,
      daytimePeakTempC: 43,
      nighttimeMinTempC: 19,
      towerUnits: 5,
      dailyTargetLiters: 2400,
    },
    summaryMetrics: {
      dailyLiters: 2355,
      annualSavings: 49980,
      paybackMonths: 22.2,
      meetsValidation: true,
    },
  },
  {
    id: 'scen-3',
    name: 'San Simon 30-Acre Specialty Citrus (Hyper-Arid 15% RH)',
    createdAt: '2026-10-22 11:20 MST',
    farmProfile: {
      growerName: 'Elena Rostova',
      farmName: 'San Simon Citrus & Olive Grove',
      location: 'San Simon Valley, AZ',
      basin: 'San Simon Artesian Basin',
      acreage: 30,
      cropType: 'specialty_citrus',
      treeDensityPerAcre: 150,
      soilType: 'Coarse Desert Sand & Caliche',
      wellWaterTableDepthFt: 460,
    },
    businessInputs: {
      monthlyHaulingExpense: 4200,
      haulingCostPerThousandGallons: 98,
      drySeasonMonths: 4,
      dieselPumpingCostMonthly: 950,
      cropYieldValuePerAcre: 8200,
    },
    environmentalConditions: {
      ambientRelativeHumidity: 15,
      daytimePeakTempC: 44,
      nighttimeMinTempC: 16,
      towerUnits: 2,
      dailyTargetLiters: 900,
    },
    summaryMetrics: {
      dailyLiters: 910,
      annualSavings: 20030,
      paybackMonths: 22.2,
      meetsValidation: true,
    },
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-02 01:00:00 MST',
    action: 'Tower Validation Objective Benchmark Run',
    details: 'Verified extraction threshold: 504 L/day per tower at 18% RH (exceeds mandatory 450 L/day requirement).',
    status: 'verified',
  },
  {
    id: 'log-2',
    timestamp: '2026-11-01 16:45:00 MST',
    action: 'Solar Mineralization Bed Calibration',
    details: 'Measured post-mineralization TDS: 199.2 mg/L, pH 7.6 with calcium (54.2 mg/L) & magnesium (18.6 mg/L) fortification.',
    status: 'calibrated',
  },
  {
    id: 'log-3',
    timestamp: '2026-11-01 07:15:00 MST',
    action: 'Field Telemetry Sync (Willcox Basin Unit 1)',
    details: 'Zero grid electricity drawn; 100% natural convection and diurnal solar thermal desorption active.',
    status: 'nominal',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-30 19:30:00 MST',
    action: 'Night Vapor Sorption Initiation',
    details: 'Ambient RH 18%, sorbent core temperature dropped to 17°C, initiating passive vapor uptake.',
    status: 'nominal',
  },
];

const STORAGE_KEYS = {
  FARM_PROFILE: 'aeroflora_farm_profile_v2',
  BUSINESS_INPUTS: 'aeroflora_business_inputs_v2',
  ENV_CONDITIONS: 'aeroflora_env_conditions_v2',
  SCENARIOS: 'aeroflora_saved_scenarios_v2',
  LOGS: 'aeroflora_activity_logs_v2',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export { STORAGE_KEYS };
