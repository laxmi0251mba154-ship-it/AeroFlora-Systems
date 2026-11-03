/**
 * AeroFlora Systems - FAO-56 Crop Evapotranspiration & Water Requirement Engine
 * Implements standard FAO Irrigation and Drainage Paper 56 methodologies
 * Calibrated for Indian agro-climatic conditions
 */

export interface CropGrowthStage {
  stage: 'initial' | 'development' | 'mid_season' | 'late_season';
  name: string;
  durationDays: number;
  kc: number; // Crop coefficient
}

export interface IndianCropProfile {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  category: 'Cereals' | 'Cash Crops' | 'Horticulture Fruits' | 'Oilseeds' | 'Vegetables' | 'Medicinal';
  typicalDurationDays: number;
  stages: CropGrowthStage[];
  criticalDeficitStage: string;
  salinitySensitivity: 'Sensitive' | 'Moderately Sensitive' | 'Moderately Tolerant' | 'Tolerant';
  maxTdsPpm: number;
  maxBoronMgL: number;
  description: string;
}

export const INDIAN_CROPS: IndianCropProfile[] = [
  {
    id: 'pomegranate',
    name: 'Pomegranate (Bhagwa/Arakta)',
    scientificName: 'Punica granatum',
    hindiName: 'अनार (भगवा)',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Rest / Bahar Preparation', durationDays: 60, kc: 0.5 },
      { stage: 'development', name: 'Flowering & Fruit Setting', durationDays: 75, kc: 0.75 },
      { stage: 'mid_season', name: 'Fruit Development & Sizing', durationDays: 120, kc: 0.95 },
      { stage: 'late_season', name: 'Fruit Maturity & Harvest', durationDays: 110, kc: 0.65 },
    ],
    criticalDeficitStage: 'Fruit Development & Sizing (Water stress causes fruit cracking)',
    salinitySensitivity: 'Moderately Sensitive',
    maxTdsPpm: 1200,
    maxBoronMgL: 1.5,
    description: 'High-value arid horticulture crop in Solapur, Barmer, Kutch, and Bijapur. Severe yield loss occurs if root hydration drops during high-temperature fruit enlargement.',
  },
  {
    id: 'cotton',
    name: 'Bt Cotton (Long Staple)',
    scientificName: 'Gossypium hirsutum',
    hindiName: 'कपास',
    category: 'Cash Crops',
    typicalDurationDays: 165,
    stages: [
      { stage: 'initial', name: 'Germination & Seedling', durationDays: 30, kc: 0.45 },
      { stage: 'development', name: 'Vegetative & Squaring', durationDays: 45, kc: 0.75 },
      { stage: 'mid_season', name: 'Boll Formation & Flowering', durationDays: 55, kc: 1.15 },
      { stage: 'late_season', name: 'Boll Opening & Maturity', durationDays: 35, kc: 0.65 },
    ],
    criticalDeficitStage: 'Boll Formation & Flowering (Mid-season)',
    salinitySensitivity: 'Tolerant',
    maxTdsPpm: 2500,
    maxBoronMgL: 3.0,
    description: 'Extensively cultivated in Gujarat, Maharashtra, Telangana, and Punjab. Water deficit at peak flowering causes square shedding.',
  },
  {
    id: 'wheat',
    name: 'Wheat (Rabi / Sharbati)',
    scientificName: 'Triticum aestivum',
    hindiName: 'गेहूं',
    category: 'Cereals',
    typicalDurationDays: 130,
    stages: [
      { stage: 'initial', name: 'Crown Root Initiation (CRI)', durationDays: 25, kc: 0.4 },
      { stage: 'development', name: 'Tillering to Jointing', durationDays: 35, kc: 0.8 },
      { stage: 'mid_season', name: 'Booting, Heading & Milking', durationDays: 45, kc: 1.15 },
      { stage: 'late_season', name: 'Dough & Maturity', durationDays: 25, kc: 0.45 },
    ],
    criticalDeficitStage: 'Crown Root Initiation (21 days post-sowing)',
    salinitySensitivity: 'Moderately Tolerant',
    maxTdsPpm: 1800,
    maxBoronMgL: 2.0,
    description: 'Core North and Central Indian food crop. Irrigation at Crown Root Initiation is universally essential for tiller survival.',
  },
  {
    id: 'grapes',
    name: 'Table & Export Grapes (Thomson Seedless)',
    scientificName: 'Vitis vinifera',
    hindiName: 'अंगूर',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Back Pruning to Bud Break', durationDays: 50, kc: 0.4 },
      { stage: 'development', name: 'Shoot Growth & Flowering', durationDays: 70, kc: 0.7 },
      { stage: 'mid_season', name: 'Berry Development & Veraison', durationDays: 130, kc: 0.85 },
      { stage: 'late_season', name: 'Harvest & Post-Harvest Rest', durationDays: 115, kc: 0.45 },
    ],
    criticalDeficitStage: 'Berry Cell Division to Veraison',
    salinitySensitivity: 'Sensitive',
    maxTdsPpm: 900,
    maxBoronMgL: 0.8,
    description: 'Intensively cultivated in Nashik, Sangli, and Solapur. Extremely sensitive to chloride toxicity and salinity.',
  },
  {
    id: 'citrus',
    name: 'Sweet Orange / Mosambi & Kinnow',
    scientificName: 'Citrus sinensis',
    hindiName: 'मौसमी / किन्नू',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Flush Initiation', durationDays: 60, kc: 0.65 },
      { stage: 'development', name: 'Fruit Set & Early Sizing', durationDays: 90, kc: 0.75 },
      { stage: 'mid_season', name: 'Rapid Fruit Growth', durationDays: 120, kc: 0.8 },
      { stage: 'late_season', name: 'Maturation & Color Break', durationDays: 95, kc: 0.7 },
    ],
    criticalDeficitStage: 'Fruit Set & Early Sizing',
    salinitySensitivity: 'Sensitive',
    maxTdsPpm: 1100,
    maxBoronMgL: 0.7,
    description: 'Grown across Punjab, Rajasthan, and Telangana. Boron or sodium excess causes premature yellowing and leaf burn.',
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut (Kharif / Summer)',
    scientificName: 'Arachis hypogaea',
    hindiName: 'मूंगफली',
    category: 'Oilseeds',
    typicalDurationDays: 115,
    stages: [
      { stage: 'initial', name: 'Emergence & Early Vegetative', durationDays: 20, kc: 0.4 },
      { stage: 'development', name: 'Pegging & Early Podding', durationDays: 35, kc: 0.8 },
      { stage: 'mid_season', name: 'Pod Sizing & Nut Filling', durationDays: 40, kc: 1.05 },
      { stage: 'late_season', name: 'Maturity & Harvest', durationDays: 20, kc: 0.6 },
    ],
    criticalDeficitStage: 'Peg Penetration into Soil (Pegging stage)',
    salinitySensitivity: 'Moderately Sensitive',
    maxTdsPpm: 1300,
    maxBoronMgL: 1.5,
    description: 'Major oilseed in Gujarat (Saurashtra), Rajasthan, and Andhra Pradesh. Hard-baked soil from dry spells prevents pegs from entering ground.',
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (Adsali / Seasonal)',
    scientificName: 'Saccharum officinarum',
    hindiName: 'गन्ना',
    category: 'Cash Crops',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Germination & Formative', durationDays: 80, kc: 0.5 },
      { stage: 'development', name: 'Tillering & Grand Growth', durationDays: 110, kc: 0.9 },
      { stage: 'mid_season', name: 'Cane Elongation & Sucrose Accumulation', durationDays: 125, kc: 1.25 },
      { stage: 'late_season', name: 'Ripening & Harvest', durationDays: 50, kc: 0.75 },
    ],
    criticalDeficitStage: 'Grand Growth Period (Maximum biomass)',
    salinitySensitivity: 'Moderately Sensitive',
    maxTdsPpm: 1400,
    maxBoronMgL: 2.0,
    description: 'Highest volumetric water consumer in Maharashtra, UP, and Karnataka. AeroFlora provides nursery and drip stabilization during acute canal cutoffs.',
  },
  {
    id: 'rice',
    name: 'Paddy / Basmati Rice',
    scientificName: 'Oryza sativa',
    hindiName: 'धान (बासमती)',
    category: 'Cereals',
    typicalDurationDays: 135,
    stages: [
      { stage: 'initial', name: 'Nursery & Transplanting', durationDays: 25, kc: 1.05 },
      { stage: 'development', name: 'Tillering & Panicle Initiation', durationDays: 35, kc: 1.15 },
      { stage: 'mid_season', name: 'Flowering & Grain Filling', durationDays: 45, kc: 1.25 },
      { stage: 'late_season', name: 'Grain Hardening & Maturation', durationDays: 30, kc: 0.9 },
    ],
    criticalDeficitStage: 'Panicle Initiation to Flowering',
    salinitySensitivity: 'Sensitive',
    maxTdsPpm: 1000,
    maxBoronMgL: 1.0,
    description: 'High-consumption cereal. Atmospheric water harvesting targets nursery bed protection and seed-plot preservation during monsoon delays.',
  },
  {
    id: 'maize',
    name: 'Maize / Corn (Kharif/Rabi)',
    scientificName: 'Zea mays',
    hindiName: 'मक्का',
    category: 'Cereals',
    typicalDurationDays: 105,
    stages: [
      { stage: 'initial', name: 'Seedling & Early Whorl', durationDays: 20, kc: 0.4 },
      { stage: 'development', name: 'Late Whorl to Tasseling', durationDays: 30, kc: 0.85 },
      { stage: 'mid_season', name: 'Silking & Grain Filling', durationDays: 35, kc: 1.2 },
      { stage: 'late_season', name: 'Maturity', durationDays: 20, kc: 0.6 },
    ],
    criticalDeficitStage: 'Tasseling & Silking',
    salinitySensitivity: 'Moderately Sensitive',
    maxTdsPpm: 1200,
    maxBoronMgL: 1.5,
    description: 'Important fodder and feed grain in Karnataka, MP, and Bihar. Drought stress at silking causes poorly filled cobs.',
  },
  {
    id: 'millet',
    name: 'Pearl Millet / Bajra',
    scientificName: 'Pennisetum glaucum',
    hindiName: 'बाजरा',
    category: 'Cereals',
    typicalDurationDays: 85,
    stages: [
      { stage: 'initial', name: 'Establishment', durationDays: 15, kc: 0.35 },
      { stage: 'development', name: 'Tillering & Stem Elongation', durationDays: 25, kc: 0.7 },
      { stage: 'mid_season', name: 'Flowering & Grain Setting', durationDays: 30, kc: 0.95 },
      { stage: 'late_season', name: 'Ripening', durationDays: 15, kc: 0.5 },
    ],
    criticalDeficitStage: 'Flowering',
    salinitySensitivity: 'Tolerant',
    maxTdsPpm: 2800,
    maxBoronMgL: 3.5,
    description: 'Climate-resilient nutri-cereal in arid Western Rajasthan. Requires minimal water, making AeroFlora supplemental irrigation transformative.',
  },
  {
    id: 'mango',
    name: 'Mango (Alphonso / Kesar / Dasheri)',
    scientificName: 'Mangifera indica',
    hindiName: 'आम',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Vegetative Rest', durationDays: 90, kc: 0.55 },
      { stage: 'development', name: 'Flowering & Fruit Setting', durationDays: 75, kc: 0.7 },
      { stage: 'mid_season', name: 'Fruit Enlargement', durationDays: 110, kc: 0.8 },
      { stage: 'late_season', name: 'Harvest & Flush', durationDays: 90, kc: 0.65 },
    ],
    criticalDeficitStage: 'Fruit Enlargement (March to May)',
    salinitySensitivity: 'Sensitive',
    maxTdsPpm: 1000,
    maxBoronMgL: 0.8,
    description: 'Grown in Konkan, Gujarat, and Andhra Pradesh. Water stress in April-May causes massive fruit drop.',
  },
  {
    id: 'guava',
    name: 'Guava (Allahabad Safeda / VNR Bihi)',
    scientificName: 'Psidium guajava',
    hindiName: 'अमरूद',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Pruning & Stressing', durationDays: 45, kc: 0.5 },
      { stage: 'development', name: 'Flowering', durationDays: 60, kc: 0.65 },
      { stage: 'mid_season', name: 'Fruit Development', durationDays: 120, kc: 0.75 },
      { stage: 'late_season', name: 'Harvesting', durationDays: 140, kc: 0.6 },
    ],
    criticalDeficitStage: 'Mrig Bahar Fruit Enlargement',
    salinitySensitivity: 'Moderately Tolerant',
    maxTdsPpm: 1600,
    maxBoronMgL: 2.0,
    description: 'Hardy fruit tree popular in MP, UP, and Maharashtra; responds exceptionally well to ultra-pure drip irrigation.',
  },
  {
    id: 'coconut',
    name: 'Coconut Palm (Tall / Hybrid)',
    scientificName: 'Cocos nucifera',
    hindiName: 'नारियल',
    category: 'Horticulture Fruits',
    typicalDurationDays: 365,
    stages: [
      { stage: 'initial', name: 'Inflorescence Opening', durationDays: 90, kc: 0.75 },
      { stage: 'development', name: 'Button Setting', durationDays: 90, kc: 0.8 },
      { stage: 'mid_season', name: 'Nut Development & Meat Formation', durationDays: 120, kc: 0.85 },
      { stage: 'late_season', name: 'Harvest Cycle', durationDays: 65, kc: 0.8 },
    ],
    criticalDeficitStage: 'Button Setting (Button shedding occurs in severe dry spells)',
    salinitySensitivity: 'Tolerant',
    maxTdsPpm: 3000,
    maxBoronMgL: 3.0,
    description: 'Coastal and southern plantation crop in Karnataka, Tamil Nadu, and Kerala; requires steady 50-80 Litres/palm/day.',
  },
  {
    id: 'vegetables',
    name: 'High-Value Vegetables (Tomato / Chilli / Capsicum)',
    scientificName: 'Solanaceae Family',
    hindiName: 'सब्जियां (टमाटर / शिमला मिर्च)',
    category: 'Vegetables',
    typicalDurationDays: 120,
    stages: [
      { stage: 'initial', name: 'Transplant & Establishment', durationDays: 20, kc: 0.45 },
      { stage: 'development', name: 'Vegetative & Early Flower', durationDays: 35, kc: 0.8 },
      { stage: 'mid_season', name: 'Continuous Flowering & Fruiting', durationDays: 45, kc: 1.15 },
      { stage: 'late_season', name: 'Final Picking', durationDays: 20, kc: 0.8 },
    ],
    criticalDeficitStage: 'Flowering & Fruit Sizing',
    salinitySensitivity: 'Moderately Sensitive',
    maxTdsPpm: 1200,
    maxBoronMgL: 1.2,
    description: 'Polyhouse and drip-fertigated cash crops in Kolar, Pune, and Nashik; requires daily precise micro-irrigation.',
  },
  {
    id: 'medicinal',
    name: 'Medicinal Plants (Ashwagandha / Aloe Vera)',
    scientificName: 'Withania somnifera / Aloe barbadensis',
    hindiName: 'औषधीय पौधे (अश्वगंधा / एलोवेरा)',
    category: 'Medicinal',
    typicalDurationDays: 160,
    stages: [
      { stage: 'initial', name: 'Establishment', durationDays: 25, kc: 0.35 },
      { stage: 'development', name: 'Root & Leaf Biomass Growth', durationDays: 65, kc: 0.6 },
      { stage: 'mid_season', name: 'Active Alkaloid Synthesis', durationDays: 50, kc: 0.75 },
      { stage: 'late_season', name: 'Maturity & Drying', durationDays: 20, kc: 0.4 },
    ],
    criticalDeficitStage: 'Early Root Formation',
    salinitySensitivity: 'Moderately Tolerant',
    maxTdsPpm: 2000,
    maxBoronMgL: 2.5,
    description: 'Dryland high-return crops in Neemuch, Mandsaur (MP), and Nagaur (Rajasthan); thrives on deficit irrigation.',
  },
];

export type IrrigationMethodType = 'drip' | 'sprinkler' | 'furrow_flood';

export interface IrrigationMethodEfficiency {
  name: string;
  efficiency: number; // 0.0 - 1.0
  description: string;
}

export const IRRIGATION_METHODS: Record<IrrigationMethodType, IrrigationMethodEfficiency> = {
  drip: {
    name: 'Precision Drip Irrigation',
    efficiency: 0.90, // 90% water directly reaches root zone
    description: 'High efficiency; minimizes evaporation and runoff. Recommended pairing for AeroFlora harvesting towers.',
  },
  sprinkler: {
    name: 'Micro-Sprinkler / Overhead',
    efficiency: 0.75, // 75%
    description: 'Moderate efficiency; prone to wind drift and midday evaporation losses.',
  },
  furrow_flood: {
    name: 'Traditional Furrow / Flood',
    efficiency: 0.50, // 50%
    description: 'Low efficiency; high percolation and surface runoff losses.',
  },
};

export interface CropWaterCalculationResult {
  crop: IndianCropProfile;
  stage: CropGrowthStage;
  areaAcres: number;
  areaHectares: number;
  et0MmDay: number; // Reference Evapotranspiration
  kc: number; // Crop coefficient
  etcMmDay: number; // Crop Evapotranspiration ETc = Kc * ET0
  effectiveRainfallMmDay: number;
  netIrrigationDepthMmDay: number; // ETc - Pe
  grossDailyLiters: number; // Accounting for irrigation method efficiency
  grossDailyKiloliters: number;
  monthlyKiloliters: number;
  aerofloraDailyOffsetLiters: number;
  remainingDeficitLiters: number;
  offsetPercentage: number;
  suggestedStorageKiloliters: number;
}

/**
 * Calculates crop water requirements using FAO-56 Penman-Monteith derived method
 */
export function calculateCropWaterRequirement(
  cropId: string,
  stageIndex: number,
  areaAcres: number,
  irrigationMethod: IrrigationMethodType,
  ambientTempC: number,
  ambientRH: number,
  effectiveRainfallMmDay: number = 0,
  towerUnits: number = 2,
  extractionPerTowerLiters: number = 450
): CropWaterCalculationResult {
  const crop = INDIAN_CROPS.find((c) => c.id === cropId) || INDIAN_CROPS[0];
  const stage = crop.stages[stageIndex] || crop.stages[0];

  const areaHectares = areaAcres * 0.404686;
  const areaSqMeters = areaAcres * 4046.86;

  // Approximate Hargreaves / FAO-56 ET0 derived from Temperature and Aridity
  // Base ET0 for Indian summer: 5.5 - 7.5 mm/day
  const tempFactor = Math.max(0.5, ambientTempC / 30);
  const aridityBonus = Math.max(0, (50 - ambientRH) * 0.04);
  const et0MmDay = Math.round((5.0 * tempFactor + aridityBonus) * 10) / 10;

  // ETc = Kc * ET0
  const etcMmDay = Math.round(et0MmDay * stage.kc * 10) / 10;

  // Net irrigation depth = max(0, ETc - Effective Rainfall)
  const netIrrigationDepthMmDay = Math.max(0, etcMmDay - effectiveRainfallMmDay);

  const methodEfficiency = IRRIGATION_METHODS[irrigationMethod].efficiency;

  // 1 mm depth on 1 sq meter = 1 Liter
  const netDailyLiters = netIrrigationDepthMmDay * areaSqMeters;
  const grossDailyLiters = Math.round(netDailyLiters / methodEfficiency);
  const grossDailyKiloliters = Math.round((grossDailyLiters / 1000) * 10) / 10;
  const monthlyKiloliters = Math.round(grossDailyKiloliters * 30.5);

  const aerofloraDailyOffsetLiters = towerUnits * extractionPerTowerLiters;
  const remainingDeficitLiters = Math.max(0, grossDailyLiters - aerofloraDailyOffsetLiters);
  const offsetPercentage = grossDailyLiters > 0
    ? Math.min(100, Math.round((aerofloraDailyOffsetLiters / grossDailyLiters) * 100))
    : 100;

  // Suggested on-farm storage buffer = 5 days of AeroFlora production
  const suggestedStorageKiloliters = Math.round(((aerofloraDailyOffsetLiters * 5) / 1000) * 10) / 10;

  return {
    crop,
    stage,
    areaAcres,
    areaHectares: Math.round(areaHectares * 100) / 100,
    et0MmDay,
    kc: stage.kc,
    etcMmDay,
    effectiveRainfallMmDay,
    netIrrigationDepthMmDay,
    grossDailyLiters,
    grossDailyKiloliters,
    monthlyKiloliters,
    aerofloraDailyOffsetLiters,
    remainingDeficitLiters,
    offsetPercentage,
    suggestedStorageKiloliters,
  };
}
