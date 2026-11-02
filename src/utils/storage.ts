/**
 * AeroFlora Systems - Persistent Storage & Default Scenarios
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
  acreage: 45,
  cropType: 'organic_pecan',
  soilType: 'Arid Sandy Loam with Caliche Sub-layer',
};

export const DEFAULT_BUSINESS_INPUTS: BusinessInputs = {
  monthlyHaulingExpense: 4800,
  haulingCostPerThousandGallons: 92,
  drySeasonMonths: 5,
  dieselPumpingCostMonthly: 1250,
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
    name: 'Willcox Basin Peak Dry Season (45 Acres)',
    createdAt: '2026-11-02 08:30 MST',
    farmProfile: DEFAULT_FARM_PROFILE,
    businessInputs: DEFAULT_BUSINESS_INPUTS,
    environmentalConditions: DEFAULT_ENVIRONMENTAL_CONDITIONS,
    summaryMetrics: {
      dailyLiters: 1512,
      annualSavings: 29312,
      paybackMonths: 22.7,
    },
  },
  {
    id: 'scen-2',
    name: 'Pinal County Pistachio Micro-Drought (75 Acres)',
    createdAt: '2026-10-28 14:15 MST',
    farmProfile: {
      growerName: 'Marcus Vance',
      farmName: 'Picacho Peak Nut Orchards',
      location: 'Pinal County, AZ',
      acreage: 75,
      cropType: 'pistachio',
      soilType: 'Alluvial Desert Clay',
    },
    businessInputs: {
      monthlyHaulingExpense: 6800,
      haulingCostPerThousandGallons: 105,
      drySeasonMonths: 6,
      dieselPumpingCostMonthly: 1800,
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
    },
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-02 01:00:00 MST',
    action: 'Tower Validation Objective Benchmark Run',
    details: 'Verified extraction threshold: 504 L/day per tower at 18% RH (exceeds 450 L/day requirement).',
    status: 'verified',
  },
  {
    id: 'log-2',
    timestamp: '2026-11-01 16:45:00 MST',
    action: 'Solar Mineralization Bed Calibration',
    details: 'Measured post-mineralization TDS: 199.2 mg/L, pH 7.6 with calcium & magnesium fortification.',
    status: 'calibrated',
  },
  {
    id: 'log-3',
    timestamp: '2026-11-01 07:15:00 MST',
    action: 'Field Telemetry Sync (Willcox Basin Unit 1)',
    details: 'Zero grid electricity drawn; 100% natural convection and solar thermal desorption active.',
    status: 'nominal',
  },
];

const STORAGE_KEYS = {
  FARM_PROFILE: 'aeroflora_farm_profile_v1',
  BUSINESS_INPUTS: 'aeroflora_business_inputs_v1',
  ENV_CONDITIONS: 'aeroflora_env_conditions_v1',
  SCENARIOS: 'aeroflora_saved_scenarios_v1',
  LOGS: 'aeroflora_activity_logs_v1',
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
