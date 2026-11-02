/**
 * AeroFlora Systems - Farm Configuration & Input Control
 * Provides input variables for grower credentials, business financials, and environmental state
 */

import React from 'react';
import {
  BusinessInputs,
  CropType,
  EnvironmentalConditions,
  FarmProfile,
} from '../types/aeroflora';
import { Sliders, RefreshCw, BookmarkCheck } from 'lucide-react';

interface FarmConfigurationFormProps {
  farmProfile: FarmProfile;
  onChangeFarmProfile: (profile: FarmProfile) => void;
  businessInputs: BusinessInputs;
  onChangeBusinessInputs: (inputs: BusinessInputs) => void;
  environmentalConditions: EnvironmentalConditions;
  onChangeEnvironmentalConditions: (env: EnvironmentalConditions) => void;
  onSaveScenario: () => void;
  onResetDefaults: () => void;
}

export const FarmConfigurationForm: React.FC<FarmConfigurationFormProps> = ({
  farmProfile,
  onChangeFarmProfile,
  businessInputs,
  onChangeBusinessInputs,
  environmentalConditions,
  onChangeEnvironmentalConditions,
  onSaveScenario,
  onResetDefaults,
}) => {
  const cropLabels: Record<CropType, string> = {
    organic_pecan: 'Organic Pecans (High Canopy Demand)',
    pistachio: 'Pistachios (Deep-Root Salinity Sensitive)',
    specialty_citrus: 'Specialty Citrus & Meyer Lemons',
    olive: 'High-Density Arbequina Olives',
    pomegranate: 'Arid Specialty Pomegranates',
  };

  const applyPreset = (preset: 'willcox' | 'pinal' | 'sansimon') => {
    if (preset === 'willcox') {
      onChangeFarmProfile({
        growerName: 'Laxmi Kumari',
        farmName: 'Willcox Basin Pecan Ranch',
        location: 'Cochise County, Southern Arizona',
        acreage: 45,
        cropType: 'organic_pecan',
        soilType: 'Arid Sandy Loam with Caliche Sub-layer',
      });
      onChangeBusinessInputs({
        monthlyHaulingExpense: 4800,
        haulingCostPerThousandGallons: 92,
        drySeasonMonths: 5,
        dieselPumpingCostMonthly: 1250,
      });
      onChangeEnvironmentalConditions({
        ambientRelativeHumidity: 18,
        daytimePeakTempC: 41,
        nighttimeMinTempC: 17,
        towerUnits: 3,
        dailyTargetLiters: 1500,
      });
    } else if (preset === 'pinal') {
      onChangeFarmProfile({
        growerName: 'Marcus Vance',
        farmName: 'Picacho Peak Nut Orchards',
        location: 'Pinal County, Southern Arizona',
        acreage: 75,
        cropType: 'pistachio',
        soilType: 'Alluvial Desert Clay',
      });
      onChangeBusinessInputs({
        monthlyHaulingExpense: 6800,
        haulingCostPerThousandGallons: 105,
        drySeasonMonths: 6,
        dieselPumpingCostMonthly: 1800,
      });
      onChangeEnvironmentalConditions({
        ambientRelativeHumidity: 16,
        daytimePeakTempC: 43,
        nighttimeMinTempC: 19,
        towerUnits: 5,
        dailyTargetLiters: 2400,
      });
    } else if (preset === 'sansimon') {
      onChangeFarmProfile({
        growerName: 'Elena Rostova',
        farmName: 'San Simon Hyper-Arid Grove',
        location: 'San Simon Valley, AZ',
        acreage: 30,
        cropType: 'organic_pecan',
        soilType: 'Coarse Desert Sand & Caliche',
      });
      onChangeBusinessInputs({
        monthlyHaulingExpense: 4200,
        haulingCostPerThousandGallons: 98,
        drySeasonMonths: 4,
        dieselPumpingCostMonthly: 950,
      });
      onChangeEnvironmentalConditions({
        ambientRelativeHumidity: 15,
        daytimePeakTempC: 44,
        nighttimeMinTempC: 16,
        towerUnits: 2,
        dailyTargetLiters: 900,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      {/* Header with Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Venture Parameters
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Grower Profile & Arid Simulation Variables
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('willcox')}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Willcox 45-Ac
          </button>
          <button
            type="button"
            onClick={() => applyPreset('pinal')}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Pinal 75-Ac
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sansimon')}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            San Simon 15% RH
          </button>
          <button
            type="button"
            onClick={onResetDefaults}
            title="Reset to defaults"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Farm & Grower Identity */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono border-b border-slate-100 pb-1">
            01. Grower Credentials
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Grower / Operator Name
            </label>
            <input
              type="text"
              value={farmProfile.growerName}
              onChange={(e) =>
                onChangeFarmProfile({ ...farmProfile, growerName: e.target.value })
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Farm & Basin Location
            </label>
            <input
              type="text"
              value={farmProfile.location}
              onChange={(e) =>
                onChangeFarmProfile({ ...farmProfile, location: e.target.value })
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Crop Classification
            </label>
            <select
              value={farmProfile.cropType}
              onChange={(e) =>
                onChangeFarmProfile({
                  ...farmProfile,
                  cropType: e.target.value as CropType,
                })
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-cyan-700"
            >
              {Object.entries(cropLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
              <span>Farm Acreage (20–100 Acres)</span>
              <span className="font-mono font-semibold text-slate-900">{farmProfile.acreage} Acres</span>
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
              className="w-full accent-cyan-800 cursor-pointer"
            />
          </div>
        </div>

        {/* Column 2: Business & Trucking Costs */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono border-b border-slate-100 pb-1">
            02. Water Trucking Expenses
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
              <span>Peak Monthly Water Hauling</span>
              <span className="font-mono font-bold text-rose-700">
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
            <div className="text-[11px] text-slate-400 mt-0.5">
              Brief requirement: $3,000–$8,000/month during peak micro-drought
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Hauler Delivery Cost ($ / 1,000 Gal)
            </label>
            <div className="flex items-center">
              <span className="px-2.5 py-2 text-xs bg-slate-100 border border-r-0 border-slate-200 rounded-l-md text-slate-500 font-mono">
                $
              </span>
              <input
                type="number"
                min={50}
                max={150}
                value={businessInputs.haulingCostPerThousandGallons}
                onChange={(e) =>
                  onChangeBusinessInputs({
                    ...businessInputs,
                    haulingCostPerThousandGallons: Number(e.target.value),
                  })
                }
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-r-md font-mono focus:outline-none focus:ring-1 focus:ring-cyan-700"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
              <span>Dry Season Peak Months</span>
              <span className="font-mono font-semibold text-slate-900">
                {businessInputs.drySeasonMonths} Months / Year
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              step={1}
              value={businessInputs.drySeasonMonths}
              onChange={(e) =>
                onChangeBusinessInputs({
                  ...businessInputs,
                  drySeasonMonths: Number(e.target.value),
                })
              }
              className="w-full accent-cyan-800 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Supplemental Diesel Pumping Cost ($ / mo)
            </label>
            <input
              type="number"
              min={400}
              max={3000}
              step={50}
              value={businessInputs.dieselPumpingCostMonthly}
              onChange={(e) =>
                onChangeBusinessInputs({
                  ...businessInputs,
                  dieselPumpingCostMonthly: Number(e.target.value),
                })
              }
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-cyan-700"
            />
          </div>
        </div>

        {/* Column 3: Hyper-Arid Environmental Controls */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono border-b border-slate-100 pb-1">
            03. Environmental & Tower Array
          </div>

          <div className="p-3 bg-cyan-50/50 border border-cyan-200 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-cyan-950">
              <span>Ambient Relative Humidity (RH)</span>
              <span className="font-mono text-sm text-cyan-900">
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
              className="w-full accent-cyan-800 cursor-pointer"
            />
            <div className="text-[11px] text-cyan-900/80 leading-tight">
              Brief specification: Validated between 15%–25% RH in Southern Arizona summer.
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
              <span>AeroFlora Harvesting Towers Installed</span>
              <span className="font-mono font-bold text-slate-900">
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
              className="w-full accent-cyan-800 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Daytime Peak Temp
              </label>
              <div className="flex items-center text-xs font-mono">
                <input
                  type="number"
                  min={35}
                  max={48}
                  value={environmentalConditions.daytimePeakTempC}
                  onChange={(e) =>
                    onChangeEnvironmentalConditions({
                      ...environmentalConditions,
                      daytimePeakTempC: Number(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-l-md"
                />
                <span className="px-2 py-1.5 bg-slate-100 border border-l-0 border-slate-200 rounded-r-md text-slate-500">
                  °C
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Night Min Temp
              </label>
              <div className="flex items-center text-xs font-mono">
                <input
                  type="number"
                  min={12}
                  max={26}
                  value={environmentalConditions.nighttimeMinTempC}
                  onChange={(e) =>
                    onChangeEnvironmentalConditions({
                      ...environmentalConditions,
                      nighttimeMinTempC: Number(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-l-md"
                />
                <span className="px-2 py-1.5 bg-slate-100 border border-l-0 border-slate-200 rounded-r-md text-slate-500">
                  °C
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onSaveScenario}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-cyan-800" />
              <span>Save Scenario to Persistent Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
