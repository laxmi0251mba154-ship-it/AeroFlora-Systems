/**
 * AeroFlora Systems - Core Data Types
 * Assignment 2 - Venture App Build Brief
 */

export type CropType = 'organic_pecan' | 'pistachio' | 'specialty_citrus' | 'olive' | 'pomegranate';

export interface FarmProfile {
  growerName: string;
  farmName: string;
  location: string;
  acreage: number; // 20 - 100 acres
  cropType: CropType;
  soilType: string;
}

export interface BusinessInputs {
  monthlyHaulingExpense: number; // $3,000 - $8,000
  haulingCostPerThousandGallons: number; // e.g. $85/k-gal
  drySeasonMonths: number; // 3 - 6 months peak
  dieselPumpingCostMonthly: number; // $600 - $2,500
}

export interface EnvironmentalConditions {
  ambientRelativeHumidity: number; // 15% - 35% RH (hyper-arid)
  daytimePeakTempC: number; // 35 - 46 °C
  nighttimeMinTempC: number; // 14 - 24 °C
  towerUnits: number; // 1 - 10 units
  dailyTargetLiters: number;
}

export interface MineralProfile {
  calcium: number; // mg/L (target 45 - 65)
  magnesium: number; // mg/L (target 15 - 25)
  potassium: number; // mg/L (target 8 - 14)
  bicarbonate: number; // mg/L (target 90 - 140)
  ph: number; // 7.2 - 7.8
  tds: number; // Total Dissolved Solids mg/L (160 - 220)
}

export interface HourlyCyclePoint {
  hour: number; // 0 - 23
  label: string; // "00:00", "01:00", ...
  phase: 'sorption' | 'solar_desorption' | 'biomimetic_condensation' | 'mineralization_trickle';
  ambientRH: number; // %
  towerTempC: number; // °C
  extractionRateLitersPerHour: number; // L/hr
  cumulativeLiters: number; // L
}

export interface SimulationResult {
  dailyLitersPerTower: number;
  totalDailyLiters: number;
  monthlyLiters: number;
  monthlyGallons: number;
  meetsValidationObjective: boolean; // >= 450 Liters daily per tower at 15-25% RH
  haulingExpenseOffsetMonthly: number;
  haulingExpenseOffsetAnnual: number;
  dieselSavingsAnnual: number;
  netAnnualSavings: number;
  estimatedCapEx: number;
  paybackPeriodMonths: number;
  gridPowerUsedKwh: number; // 0 kWh (passive solar)
  truckTripsAvoidedMonthly: number;
  carbonOffsetKgMonthly: number;
  mineralProfile: MineralProfile;
  hourlyCycle: HourlyCyclePoint[];
}

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  farmProfile: FarmProfile;
  businessInputs: BusinessInputs;
  environmentalConditions: EnvironmentalConditions;
  summaryMetrics: {
    dailyLiters: number;
    annualSavings: number;
    paybackMonths: number;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'nominal' | 'calibrated' | 'verified' | 'warning';
}
