/**
 * AeroFlora Systems - Centralized Image Asset Resolver
 * Statically imported so Vite bundles and hashes them into dist/ for production Vercel deployment
 */

import towerDesertImg from './images/aeroflora_tower_desert_1793610371842.jpg';
import orchardDroughtImg from './images/arizona_orchard_drought_1793610371789.jpg';
import solarMineralizationImg from './images/solar_mineralization_module_1793610372248.jpg';

export const IMAGES = {
  towerDesert: towerDesertImg,
  orchardDrought: orchardDroughtImg,
  solarMineralization: solarMineralizationImg,
};
