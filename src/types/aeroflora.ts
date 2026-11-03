/**
 * AeroFlora Systems - Core Data Types
 * DGU Venture Quest Assignment 2 - Professional Enterprise Specifications
 */

export type CropType = 'organic_pecan' | 'pistachio' | 'specialty_citrus' | 'olive' | 'pomegranate';

export interface FarmProfile {
  growerName: string;
  farmName: string;
  location: string;
  basin: string; // e.g. "Willcox Groundwater Basin", "Pinal Active Management Area"
  acreage: number; // 20 - 100 acres
  cropType: CropType;
  treeDensityPerAcre: number;
  soilType: string;
  wellWaterTableDepthFt: number; // e.g. 480 ft (showing pump failure risk)
}

export interface BusinessInputs {
  monthlyHaulingExpense: number; // $3,000 - $8,000
  haulingCostPerThousandGallons: number; // e.g. $85 - $125/k-gal
  drySeasonMonths: number; // 3 - 6 months peak micro-drought
  dieselPumpingCostMonthly: number; // $600 - $2,500
  cropYieldValuePerAcre: number; // e.g. $6,500/acre
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
  sodium: number; // mg/L (< 15 mg/L, ultra-low to prevent soil salinity)
  sulfate: number; // mg/L (15 - 30 mg/L)
  ph: number; // 7.4 - 7.8
  tds: number; // Total Dissolved Solids mg/L (180 - 220)
  ec: number; // Electrical Conductivity dS/m (~0.3 dS/m, non-saline)
}

export interface HourlyCyclePoint {
  hour: number; // 0 - 23
  label: string; // "00:00", "01:00", ...
  phase: 'sorption' | 'solar_desorption' | 'biomimetic_condensation' | 'mineralization_trickle';
  phaseTitle: string;
  ambientRH: number; // %
  towerTempC: number; // °C
  absoluteHumidityGramsPerM3: number; // g/m³
  extractionRateLitersPerHour: number; // L/hr
  cumulativeLiters: number; // L
}

export interface CashflowYear {
  year: number;
  haulingSavings: number;
  dieselSavings: number;
  maintenanceCost: number; // Minimal media top-up ~$350/yr
  netCashflow: number;
  cumulativeCashflow: number;
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
  fiveYearROI: number; // %
  npv8Percent: number; // Net Present Value at 8% discount rate
  irr: number; // Internal Rate of Return %
  gridPowerUsedKwh: number; // 0 kWh (passive solar)
  truckTripsAvoidedMonthly: number;
  carbonOffsetKgMonthly: number;
  mineralProfile: MineralProfile;
  hourlyCycle: HourlyCyclePoint[];
  fiveYearCashflows: CashflowYear[];
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
    meetsValidation: boolean;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'nominal' | 'calibrated' | 'verified' | 'warning';
}

export type UserRole = 'farmer' | 'agronomist' | 'technician' | 'fpo_admin' | 'platform_admin';

export interface PlotRecord {
  id: string;
  name: string;
  areaAcres: number;
  cropCategory: string;
  cropId: string;
  cropVariety: string;
  growthStage: 'initial' | 'development' | 'mid_season' | 'late_season';
  soilType: string;
  irrigationMethod: 'drip' | 'sprinkler' | 'flood_furrow' | 'micro_jet';
  existingWaterSource: 'deep_borewell' | 'open_dug_well' | 'canal' | 'private_tanker' | 'rainwater_pond';
  dailyWaterAvailabilityLiters: number;
  monthlyWaterExpenseInr: number;
  storageCapacityLiters: number;
  hasWaterQualityReport: boolean;
}

export interface IndianFarmerProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  preferredLanguage: string;
  state: string;
  district: string;
  blockTehsil: string;
  village: string;
  coordinatesConsent: boolean;
  latitude?: number;
  longitude?: number;
  farms: {
    id: string;
    farmName: string;
    totalAcres: number;
    plots: PlotRecord[];
  }[];
}

export interface EquipmentTower {
  id: string;
  serialNumber: string;
  nickname: string;
  villageLocation: string;
  district: string;
  state: string;
  installationDate: string;
  sorbentMaterial: 'MOF-801' | 'MIL-101(Cr)' | 'Aluminum Fumarate' | 'Zeolite 13X';
  sorbentMassKg: number;
  status: 'adsorbing' | 'desorbing' | 'condensation' | 'standby' | 'maintenance';
  coreTemperatureC: number;
  sorbentBedRHPct: number;
  dailyYieldLiters: number;
  targetDailyYieldLiters: number;
  lifetimeAccumulatedLiters: number;
  condenserPlateTempC: number;
  esp32Telemetry: {
    status: 'online' | 'offline' | 'degraded';
    signalRssi: number; // dBm
    firmwareVersion: string;
    solarVolts: number;
    batteryPct: number;
    lastPing: string;
  };
  filterCartridgeDaysRemaining: number;
  nextDesorptionScheduled: string;
}

export interface FPONetworkProfile {
  id: string;
  fpoName: string;
  registrationNumber: string;
  district: string;
  state: string;
  activeFarmersCount: number;
  sharedTowersCount: number;
  communalTankCapacityLitres: number;
  totalWaterDisbursedThisSeasonLiters: number;
  waterTokenBalanceLiters: number;
  announcements: {
    id: string;
    date: string;
    author: string;
    role: string;
    title: string;
    body: string;
    isUrgent: boolean;
  }[];
}

