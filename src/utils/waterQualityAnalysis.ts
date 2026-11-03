/**
 * AeroFlora Systems - Agricultural Water Quality & Chemistry Laboratory Engine
 * Calculates Sodium Adsorption Ratio (SAR), Residual Sodium Carbonate (RSC),
 * Salinity Hazard (EC/TDS), and crop specific ion toxicity
 */

export interface WaterQualitySample {
  id: string;
  sourceName: string;
  sampleType: 'simulated_condensate' | 'mineralized_aeroflora' | 'local_borewell' | 'canal_water' | 'tanker_water';
  isLaboratoryCertified: boolean;
  labCertificateNumber?: string;
  testDate: string;
  ph: number;
  ecDecisiemensPerMeter: number; // dS/m
  tdsPpm: number; // mg/L
  calciumMgL: number; // mg/L
  magnesiumMgL: number; // mg/L
  sodiumMgL: number; // mg/L
  potassiumMgL: number; // mg/L
  chlorideMgL: number; // mg/L
  bicarbonateMgL: number; // mg/L
  carbonateMgL: number; // mg/L
  boronMgL: number; // mg/L
  nitrateMgL: number; // mg/L
}

export interface WaterQualityAssessment {
  sample: WaterQualitySample;
  sar: number; // Sodium Adsorption Ratio
  rscMeqL: number; // Residual Sodium Carbonate in meq/L
  salinityHazard: 'None' | 'Slight to Moderate' | 'Severe';
  infiltrationHazard: 'None' | 'Slight to Moderate' | 'Severe';
  sodiumToxicity: 'None' | 'Moderate' | 'Severe';
  chlorideToxicity: 'None' | 'Moderate' | 'Severe';
  boronToxicity: 'None' | 'Moderate' | 'Severe';
  overallCropSuitability: 'Excellent' | 'Good with Leaching' | 'Questionable' | 'Unsuitable';
  agronomicRecommendation: string;
}

/**
 * Converts mg/L to milli-equivalents per liter (meq/L)
 * meq/L = mg/L / equivalent weight
 */
export const EQUIVALENT_WEIGHTS = {
  Ca: 20.04, // 40.08 / 2
  Mg: 12.15, // 24.31 / 2
  Na: 23.00, // 23.00 / 1
  K: 39.10, // 39.10 / 1
  Cl: 35.45, // 35.45 / 1
  HCO3: 61.02, // 61.02 / 1
  CO3: 30.00, // 60.01 / 2
  SO4: 48.03, // 96.06 / 2
};

export function calculateWaterQualityAssessment(sample: WaterQualitySample): WaterQualityAssessment {
  // Convert ions to meq/L
  const caMeq = sample.calciumMgL / EQUIVALENT_WEIGHTS.Ca;
  const mgMeq = sample.magnesiumMgL / EQUIVALENT_WEIGHTS.Mg;
  const naMeq = sample.sodiumMgL / EQUIVALENT_WEIGHTS.Na;
  const hco3Meq = sample.bicarbonateMgL / EQUIVALENT_WEIGHTS.HCO3;
  const co3Meq = (sample.carbonateMgL || 0) / EQUIVALENT_WEIGHTS.CO3;
  const clMeq = sample.chlorideMgL / EQUIVALENT_WEIGHTS.Cl;

  // 1. SAR = Na / sqrt((Ca + Mg) / 2) in meq/L
  const caPlusMg = (caMeq + mgMeq) / 2;
  const sar = caPlusMg > 0 ? Math.round((naMeq / Math.sqrt(caPlusMg)) * 10) / 10 : 0;

  // 2. RSC = (CO3 + HCO3) - (Ca + Mg) in meq/L
  const rscMeqL = Math.round(((co3Meq + hco3Meq) - (caMeq + mgMeq)) * 10) / 10;

  // 3. Salinity Hazard (EC)
  let salinityHazard: WaterQualityAssessment['salinityHazard'] = 'None';
  if (sample.ecDecisiemensPerMeter > 3.0 || sample.tdsPpm > 2000) {
    salinityHazard = 'Severe';
  } else if (sample.ecDecisiemensPerMeter > 0.75 || sample.tdsPpm > 500) {
    salinityHazard = 'Slight to Moderate';
  }

  // 4. Infiltration Hazard (SAR combined with EC)
  let infiltrationHazard: WaterQualityAssessment['infiltrationHazard'] = 'None';
  if (sar > 9 && sample.ecDecisiemensPerMeter < 0.5) {
    infiltrationHazard = 'Severe';
  } else if (sar > 6) {
    infiltrationHazard = 'Slight to Moderate';
  }

  // 5. Specific Ion Toxicities
  const sodiumToxicity: WaterQualityAssessment['sodiumToxicity'] = sar > 9 ? 'Severe' : sar > 3 ? 'Moderate' : 'None';
  const chlorideToxicity: WaterQualityAssessment['chlorideToxicity'] = sample.chlorideMgL > 350 ? 'Severe' : sample.chlorideMgL > 140 ? 'Moderate' : 'None';
  const boronToxicity: WaterQualityAssessment['boronToxicity'] = sample.boronMgL > 2.0 ? 'Severe' : sample.boronMgL > 0.7 ? 'Moderate' : 'None';

  // Overall Verdict
  let overallCropSuitability: WaterQualityAssessment['overallCropSuitability'] = 'Excellent';
  let recommendation = 'High-purity water. Balanced mineral content suitable for sensitive horticultural crops including pomegranate, grapes, and citrus.';

  if (salinityHazard === 'Severe' || sar > 10 || rscMeqL > 2.5) {
    overallCropSuitability = 'Unsuitable';
    recommendation = 'High salinity and sodicity risk. Will cause soil hardpan sealing and leaf tip necrosis without gypsum or blending.';
  } else if (salinityHazard === 'Slight to Moderate' || sar > 4 || rscMeqL > 1.25) {
    overallCropSuitability = 'Good with Leaching';
    recommendation = 'Requires periodic leaching fraction and regular soil EC monitoring.';
  }

  return {
    sample,
    sar,
    rscMeqL,
    salinityHazard,
    infiltrationHazard,
    sodiumToxicity,
    chlorideToxicity,
    boronToxicity,
    overallCropSuitability,
    agronomicRecommendation: recommendation,
  };
}

export const BENCHMARK_WATER_SAMPLES: WaterQualitySample[] = [
  {
    id: 's-aeroflora-mineralized',
    sourceName: 'AeroFlora Mineralized Water (Volcanic Basalt + Calcite Bed)',
    sampleType: 'mineralized_aeroflora',
    isLaboratoryCertified: true,
    labCertificateNumber: 'AFT-LAB-2026-IN-4891',
    testDate: '15/10/2026',
    ph: 7.6,
    ecDecisiemensPerMeter: 0.31,
    tdsPpm: 199.2,
    calciumMgL: 54.2,
    magnesiumMgL: 18.6,
    sodiumMgL: 4.8,
    potassiumMgL: 11.4,
    chlorideMgL: 6.2,
    bicarbonateMgL: 115.0,
    carbonateMgL: 0.0,
    boronMgL: 0.05,
    nitrateMgL: 1.2,
  },
  {
    id: 's-raw-condensate',
    sourceName: 'Raw Atmospheric Condensate (Pre-Mineralization)',
    sampleType: 'simulated_condensate',
    isLaboratoryCertified: false,
    testDate: '20/10/2026',
    ph: 5.8,
    ecDecisiemensPerMeter: 0.02,
    tdsPpm: 12.0,
    calciumMgL: 0.4,
    magnesiumMgL: 0.1,
    sodiumMgL: 0.8,
    potassiumMgL: 0.2,
    chlorideMgL: 1.1,
    bicarbonateMgL: 4.5,
    carbonateMgL: 0.0,
    boronMgL: 0.01,
    nitrateMgL: 0.3,
  },
  {
    id: 's-borewell-solapur',
    sourceName: 'Deep Agricultural Borewell (Solapur, Maharashtra)',
    sampleType: 'local_borewell',
    isLaboratoryCertified: true,
    labCertificateNumber: 'MH-KVK-SOL-7721',
    testDate: '02/09/2026',
    ph: 8.4,
    ecDecisiemensPerMeter: 2.45,
    tdsPpm: 1560.0,
    calciumMgL: 125.0,
    magnesiumMgL: 65.0,
    sodiumMgL: 280.0,
    potassiumMgL: 8.5,
    chlorideMgL: 390.0,
    bicarbonateMgL: 340.0,
    carbonateMgL: 15.0,
    boronMgL: 1.85,
    nitrateMgL: 45.0,
  },
  {
    id: 's-tanker-barmer',
    sourceName: 'Private Water Tanker (Barmer, Rajasthan - ₹1,400/5kL)',
    sampleType: 'tanker_water',
    isLaboratoryCertified: false,
    testDate: '12/10/2026',
    ph: 8.6,
    ecDecisiemensPerMeter: 3.10,
    tdsPpm: 1980.0,
    calciumMgL: 140.0,
    magnesiumMgL: 85.0,
    sodiumMgL: 380.0,
    potassiumMgL: 12.0,
    chlorideMgL: 520.0,
    bicarbonateMgL: 410.0,
    carbonateMgL: 22.0,
    boronMgL: 2.4,
    nitrateMgL: 55.0,
  },
];
