/**
 * AeroFlora Systems - Indian Agricultural Geography, Climate & Groundwater Dataset
 * Covers major arid, semi-arid, and horticulture belts across India
 * Grounded in CGWB (Central Ground Water Board) & IMD (India Meteorological Dept) profiles
 */

export interface DistrictWaterProfile {
  district: string;
  state: string;
  avgSummerRH: number; // %
  avgSummerTempC: number; // °C
  avgSolarRadiationKWhM2Day: number; // kWh/m²/day
  monsoonRainfallMm: number; // mm
  groundwaterDepthMeters: number; // meters below ground level (CGWB)
  groundwaterCategory: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  primaryCrops: string[];
  awhSuitability: 'High' | 'Moderate' | 'Seasonal' | 'Low';
  suitabilityReason: string;
}

export interface StateDistrictMap {
  state: string;
  code: string;
  districts: DistrictWaterProfile[];
}

export const INDIAN_AGRICULTURAL_ZONES: StateDistrictMap[] = [
  {
    state: 'Rajasthan',
    code: 'RJ',
    districts: [
      {
        district: 'Jodhpur',
        state: 'Rajasthan',
        avgSummerRH: 22,
        avgSummerTempC: 42.5,
        avgSolarRadiationKWhM2Day: 6.8,
        monsoonRainfallMm: 310,
        groundwaterDepthMeters: 55,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Pomegranate', 'Millet', 'Moth Bean', 'Cumin'],
        awhSuitability: 'High',
        suitabilityReason: 'Extreme solar irradiance (6.8 kWh/m²/day) and sharp diurnal temp swing drive efficient solar thermal desorption despite 22% RH.',
      },
      {
        district: 'Barmer',
        state: 'Rajasthan',
        avgSummerRH: 18,
        avgSummerTempC: 44.0,
        avgSolarRadiationKWhM2Day: 7.0,
        monsoonRainfallMm: 240,
        groundwaterDepthMeters: 75,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Pomegranate', 'Date Palm', 'Bajra', 'Castor'],
        awhSuitability: 'High',
        suitabilityReason: 'Hyper-arid pilot target. Heavy reliance on expensive tanker water (₹1,500/tanker); high nighttime inversion.',
      },
      {
        district: 'Jaisalmer',
        state: 'Rajasthan',
        avgSummerRH: 16,
        avgSummerTempC: 45.0,
        avgSolarRadiationKWhM2Day: 7.2,
        monsoonRainfallMm: 160,
        groundwaterDepthMeters: 85,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Guar', 'Millet', 'Cluster Bean'],
        awhSuitability: 'Moderate',
        suitabilityReason: 'Lowest ambient RH (16%). Requires high-capacity MOF sorbents with desorption booster hoods.',
      },
      {
        district: 'Bikaner',
        state: 'Rajasthan',
        avgSummerRH: 20,
        avgSummerTempC: 43.0,
        avgSolarRadiationKWhM2Day: 6.9,
        monsoonRainfallMm: 260,
        groundwaterDepthMeters: 60,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Groundnut', 'Wheat', 'Mustard', 'Kinnow'],
        awhSuitability: 'High',
        suitabilityReason: 'Thriving Kinnow and Groundnut belts severely vulnerable to canal closure periods.',
      },
    ],
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    districts: [
      {
        district: 'Kutch',
        state: 'Gujarat',
        avgSummerRH: 32,
        avgSummerTempC: 39.5,
        avgSolarRadiationKWhM2Day: 6.5,
        monsoonRainfallMm: 380,
        groundwaterDepthMeters: 45,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Pomegranate', 'Date Palm', 'Mango', 'Cotton'],
        awhSuitability: 'High',
        suitabilityReason: 'Coastal-desert transition provides healthy night vapor density combined with high daytime solar flux.',
      },
      {
        district: 'Banaskantha',
        state: 'Gujarat',
        avgSummerRH: 28,
        avgSummerTempC: 41.0,
        avgSolarRadiationKWhM2Day: 6.6,
        monsoonRainfallMm: 490,
        groundwaterDepthMeters: 52,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Potato', 'Pomegranate', 'Castor', 'Mustard'],
        awhSuitability: 'High',
        suitabilityReason: 'Intense horticulture and dairy belt with heavy groundwater salinity (TDS > 1,800 ppm).',
      },
      {
        district: 'Rajkot',
        state: 'Gujarat',
        avgSummerRH: 35,
        avgSummerTempC: 40.0,
        avgSolarRadiationKWhM2Day: 6.3,
        monsoonRainfallMm: 580,
        groundwaterDepthMeters: 38,
        groundwaterCategory: 'Semi-Critical',
        primaryCrops: ['Cotton', 'Groundnut', 'Wheat'],
        awhSuitability: 'Moderate',
        suitabilityReason: 'Saurashtra plateau; good baseline RH for atmospheric harvesting during non-monsoon months.',
      },
    ],
  },
  {
    state: 'Maharashtra',
    code: 'MH',
    districts: [
      {
        district: 'Solapur',
        state: 'Maharashtra',
        avgSummerRH: 25,
        avgSummerTempC: 41.5,
        avgSolarRadiationKWhM2Day: 6.4,
        monsoonRainfallMm: 540,
        groundwaterDepthMeters: 32,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Pomegranate (Bhagwa)', 'Sugarcane', 'Grapes', 'Jowar'],
        awhSuitability: 'High',
        suitabilityReason: 'World-famous Bhagwa pomegranate belt; severely impacted by rain-shadow micro-droughts in May-June.',
      },
      {
        district: 'Ahmednagar',
        state: 'Maharashtra',
        avgSummerRH: 26,
        avgSummerTempC: 40.0,
        avgSolarRadiationKWhM2Day: 6.3,
        monsoonRainfallMm: 500,
        groundwaterDepthMeters: 28,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Sugarcane', 'Pomegranate', 'Onion', 'Soybean'],
        awhSuitability: 'High',
        suitabilityReason: 'Dry central plateau with active FPO networks and high willingness to adopt supplemental harvesting.',
      },
      {
        district: 'Nashik',
        state: 'Maharashtra',
        avgSummerRH: 30,
        avgSummerTempC: 38.0,
        avgSolarRadiationKWhM2Day: 6.1,
        monsoonRainfallMm: 720,
        groundwaterDepthMeters: 22,
        groundwaterCategory: 'Semi-Critical',
        primaryCrops: ['Grapes (Table & Export)', 'Onion', 'Tomato'],
        awhSuitability: 'Moderate',
        suitabilityReason: 'High-value export grape orchards sensitive to chloride and salinity in irrigation water.',
      },
    ],
  },
  {
    state: 'Karnataka',
    code: 'KA',
    districts: [
      {
        district: 'Vijayapura (Bijapur)',
        state: 'Karnataka',
        avgSummerRH: 26,
        avgSummerTempC: 41.0,
        avgSolarRadiationKWhM2Day: 6.4,
        monsoonRainfallMm: 560,
        groundwaterDepthMeters: 42,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Grapes', 'Pomegranate', 'Lemon', 'Sugarcane'],
        awhSuitability: 'High',
        suitabilityReason: 'Northern dry zone horticulture capital of Karnataka; frequent acute summer water distress.',
      },
      {
        district: 'Kolar',
        state: 'Karnataka',
        avgSummerRH: 38,
        avgSummerTempC: 36.5,
        avgSolarRadiationKWhM2Day: 5.9,
        monsoonRainfallMm: 740,
        groundwaterDepthMeters: 80,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Tomato', 'Mango', 'Mulberry', 'Vegetables'],
        awhSuitability: 'High',
        suitabilityReason: 'Depleted hard-rock borewells (80m-150m depth); high ambient RH provides strong baseline condensation.',
      },
      {
        district: 'Bagalkot',
        state: 'Karnataka',
        avgSummerRH: 29,
        avgSummerTempC: 40.0,
        avgSolarRadiationKWhM2Day: 6.2,
        monsoonRainfallMm: 520,
        groundwaterDepthMeters: 36,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Pomegranate', 'Maize', 'Sunflower', 'Bengal Gram'],
        awhSuitability: 'High',
        suitabilityReason: 'Semi-arid Krishna basin fringe with high solar insolation.',
      },
    ],
  },
  {
    state: 'Telangana',
    code: 'TG',
    districts: [
      {
        district: 'Mahabubnagar',
        state: 'Telangana',
        avgSummerRH: 28,
        avgSummerTempC: 42.0,
        avgSolarRadiationKWhM2Day: 6.3,
        monsoonRainfallMm: 620,
        groundwaterDepthMeters: 35,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Cotton', 'Castor', 'Groundnut', 'Mango'],
        awhSuitability: 'High',
        suitabilityReason: 'Drought-prone red sandy loam tracts; frequent power grid shedding for farm borewells.',
      },
      {
        district: 'Nalgonda',
        state: 'Telangana',
        avgSummerRH: 30,
        avgSummerTempC: 43.0,
        avgSolarRadiationKWhM2Day: 6.4,
        monsoonRainfallMm: 680,
        groundwaterDepthMeters: 29,
        groundwaterCategory: 'Critical',
        primaryCrops: ['Sweet Orange (Mosambi)', 'Cotton', 'Paddy'],
        awhSuitability: 'High',
        suitabilityReason: 'Heavy fluoride contamination in local wells makes atmospheric pure water highly valuable.',
      },
    ],
  },
  {
    state: 'Punjab',
    code: 'PB',
    districts: [
      {
        district: 'Bathinda',
        state: 'Punjab',
        avgSummerRH: 34,
        avgSummerTempC: 42.0,
        avgSolarRadiationKWhM2Day: 6.2,
        monsoonRainfallMm: 410,
        groundwaterDepthMeters: 48,
        groundwaterCategory: 'Over-Exploited',
        primaryCrops: ['Cotton', 'Wheat', 'Kinnow', 'Mustard'],
        awhSuitability: 'Seasonal',
        suitabilityReason: 'Southwestern Punjab belt with heavy groundwater depletion and canal tail-end shortages.',
      },
    ],
  },
  {
    state: 'Uttarakhand',
    code: 'UK',
    districts: [
      {
        district: 'Tehri Garhwal',
        state: 'Uttarakhand',
        avgSummerRH: 45,
        avgSummerTempC: 31.0,
        avgSolarRadiationKWhM2Day: 5.4,
        monsoonRainfallMm: 1200,
        groundwaterDepthMeters: 18,
        groundwaterCategory: 'Safe',
        primaryCrops: ['Apple', 'Peach', 'Medicinal Plants', 'Kidney Beans'],
        awhSuitability: 'Seasonal',
        suitabilityReason: 'Mountain ridge horticulture; abundant humidity in pre-monsoon, steep topography limits pump reach.',
      },
    ],
  },
];

export const ALL_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar', 'Chandigarh', 'Dadra and Nagar Haveli & Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export function findDistrictProfile(stateName: string, districtName: string): DistrictWaterProfile | undefined {
  const stateData = INDIAN_AGRICULTURAL_ZONES.find(
    (s) => s.state.toLowerCase() === stateName.toLowerCase()
  );
  if (!stateData) return undefined;
  return stateData.districts.find(
    (d) => d.district.toLowerCase() === districtName.toLowerCase()
  );
}
