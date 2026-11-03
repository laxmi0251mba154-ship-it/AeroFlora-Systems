import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Languages,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sprout,
  Droplets,
  Coins,
  Warehouse,
  Shield,
  FileCheck,
} from 'lucide-react';
import { IndianFarmerProfile, PlotRecord } from '../types/aeroflora';
import { INDIAN_AGRICULTURAL_ZONES } from '../utils/indianGeography';
import { INDIAN_CROPS } from '../utils/fao56CropWater';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/i18n';

interface FarmerRegistrationMyFarmProps {
  farmerProfile: IndianFarmerProfile;
  onUpdateFarmerProfile: (profile: IndianFarmerProfile) => void;
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

const DEFAULT_PLOT: PlotRecord = {
  id: 'plot-1',
  name: 'Plot 1 - North Orchard',
  areaAcres: 2.5,
  cropCategory: 'Horticulture Fruits',
  cropId: 'pomegranate',
  cropVariety: 'Bhagwa (Sindhuri)',
  growthStage: 'mid_season',
  soilType: 'Sandy Loam',
  irrigationMethod: 'drip',
  existingWaterSource: 'deep_borewell',
  dailyWaterAvailabilityLiters: 1200,
  monthlyWaterExpenseInr: 8500,
  storageCapacityLiters: 10000,
  hasWaterQualityReport: true,
};

export const FarmerRegistrationMyFarm: React.FC<FarmerRegistrationMyFarmProps> = ({
  farmerProfile,
  onUpdateFarmerProfile,
  currentLanguage,
  onShowToast,
}) => {
  const [profile, setProfile] = useState<IndianFarmerProfile>(() => {
    if (farmerProfile && farmerProfile.fullName) {
      return farmerProfile;
    }
    return {
      id: 'farmer-101',
      fullName: 'Ramesh Patel',
      mobileNumber: '9825012345',
      email: 'ramesh.farmer@agroindia.org',
      preferredLanguage: currentLanguage || 'hi',
      state: 'Gujarat',
      district: 'Banaskantha',
      blockTehsil: 'Deesa',
      village: 'Rajpur',
      coordinatesConsent: false,
      latitude: 24.258,
      longitude: 72.181,
      farms: [
        {
          id: 'farm-1',
          farmName: 'Shree Krishna Krishi Farm',
          totalAcres: 5.0,
          plots: [
            DEFAULT_PLOT,
            {
              id: 'plot-2',
              name: 'Plot 2 - Cash Crop Block',
              areaAcres: 2.5,
              cropCategory: 'Cash Crops',
              cropId: 'cotton',
              cropVariety: 'Bt RCH-659',
              growthStage: 'development',
              soilType: 'Black Cotton Soil',
              irrigationMethod: 'drip',
              existingWaterSource: 'private_tanker',
              dailyWaterAvailabilityLiters: 800,
              monthlyWaterExpenseInr: 12000,
              storageCapacityLiters: 5000,
              hasWaterQualityReport: false,
            },
          ],
        },
      ],
    };
  });

  const [activeFarmIndex, setActiveFarmIndex] = useState(0);
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);

  // Current State & District choices
  const currentStateObj =
    INDIAN_AGRICULTURAL_ZONES.find((s) => s.state === profile.state) || INDIAN_AGRICULTURAL_ZONES[0];

  const handleStateChange = (stateName: string) => {
    const foundState = INDIAN_AGRICULTURAL_ZONES.find((s) => s.state === stateName);
    const newDistrict = foundState?.districts[0]?.district || '';
    setProfile((prev) => ({
      ...prev,
      state: stateName,
      district: newDistrict,
    }));
  };

  const handleSaveProfile = () => {
    onUpdateFarmerProfile(profile);
    onShowToast('Farmer & Farm profile saved successfully');
  };

  const currentFarm = profile.farms[activeFarmIndex] || profile.farms[0];

  const handleAddPlot = () => {
    const newPlot: PlotRecord = {
      id: `plot-${Date.now()}`,
      name: `Plot ${currentFarm.plots.length + 1}`,
      areaAcres: 1.0,
      cropCategory: 'Horticulture Fruits',
      cropId: 'pomegranate',
      cropVariety: 'Standard Local',
      growthStage: 'initial',
      soilType: 'Sandy Loam',
      irrigationMethod: 'drip',
      existingWaterSource: 'deep_borewell',
      dailyWaterAvailabilityLiters: 500,
      monthlyWaterExpenseInr: 3000,
      storageCapacityLiters: 5000,
      hasWaterQualityReport: false,
    };

    setProfile((prev) => {
      const updatedFarms = [...prev.farms];
      updatedFarms[activeFarmIndex] = {
        ...updatedFarms[activeFarmIndex],
        plots: [...updatedFarms[activeFarmIndex].plots, newPlot],
        totalAcres: updatedFarms[activeFarmIndex].totalAcres + 1.0,
      };
      return { ...prev, farms: updatedFarms };
    });
    setEditingPlotId(newPlot.id);
    onShowToast('New plot added to farm');
  };

  const handleDeletePlot = (plotId: string) => {
    setProfile((prev) => {
      const updatedFarms = [...prev.farms];
      const remainingPlots = updatedFarms[activeFarmIndex].plots.filter((p) => p.id !== plotId);
      const newTotalAcres = remainingPlots.reduce((sum, p) => sum + p.areaAcres, 0);
      updatedFarms[activeFarmIndex] = {
        ...updatedFarms[activeFarmIndex],
        plots: remainingPlots,
        totalAcres: newTotalAcres,
      };
      return { ...prev, farms: updatedFarms };
    });
    onShowToast('Plot removed');
  };

  const handleUpdatePlot = (plotId: string, updates: Partial<PlotRecord>) => {
    setProfile((prev) => {
      const updatedFarms = [...prev.farms];
      const plots = updatedFarms[activeFarmIndex].plots.map((p) =>
        p.id === plotId ? { ...p, ...updates } : p
      );
      const newTotalAcres = plots.reduce((sum, p) => sum + p.areaAcres, 0);
      updatedFarms[activeFarmIndex] = {
        ...updatedFarms[activeFarmIndex],
        plots,
        totalAcres: newTotalAcres,
      };
      return { ...prev, farms: updatedFarms };
    });
  };

  const totalFarmAcreage = currentFarm.plots.reduce((sum, p) => sum + p.areaAcres, 0);
  const totalFarmHectares = (totalFarmAcreage * 0.404686).toFixed(2);
  const totalMonthlyWaterSpend = currentFarm.plots.reduce((sum, p) => sum + p.monthlyWaterExpenseInr, 0);
  const totalStorageCapacity = currentFarm.plots.reduce((sum, p) => sum + p.storageCapacityLiters, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kisan Onboarding &amp; Agronomic Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Farmer Registration &amp; My Farm
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your farm holdings, village hierarchy, soil conditions, and crop blocks to calibrate AeroFlora
            atmospheric water harvesting.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Farm Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Farmer Personal & Geographic Hierarchy */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-emerald-800 font-bold text-sm">
            <User className="w-4 h-4" />
            <span>Farmer Identification</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Full Name (किसान का पूरा नाम) *</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="e.g. Ramesh Patel"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Mobile Number (+91) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={profile.mobileNumber}
                  onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-12 pr-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="9825012345"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Used for SMS/WhatsApp moisture alert dispatches</p>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="ramesh@example.com"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Preferred Language (भाषा)</label>
              <select
                value={profile.preferredLanguage}
                onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Village Hierarchy (India)</span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">State (राज्य) *</label>
              <select
                value={profile.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {INDIAN_AGRICULTURAL_ZONES.map((zone) => (
                  <option key={zone.code} value={zone.state}>
                    {zone.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">District (जिला) *</label>
              <select
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {currentStateObj.districts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Block / Tehsil (तहसील) *</label>
                <input
                  type="text"
                  value={profile.blockTehsil}
                  onChange={(e) => setProfile({ ...profile, blockTehsil: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="e.g. Deesa"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Village (गाँव) *</label>
                <input
                  type="text"
                  value={profile.village}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="e.g. Rajpur"
                />
              </div>
            </div>

            {/* Optional Coordinates with Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.coordinatesConsent}
                  onChange={(e) => setProfile({ ...profile, coordinatesConsent: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-600">
                  Enable high-resolution GPS coordinates (requires consent for IMD micro-climate weather radar).
                </span>
              </label>

              {profile.coordinatesConsent && (
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Lat (e.g. 24.258)"
                    value={profile.latitude || ''}
                    onChange={(e) => setProfile({ ...profile, latitude: parseFloat(e.target.value) })}
                    className="bg-slate-50 border border-slate-300 rounded p-1.5"
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Long (e.g. 72.181)"
                    value={profile.longitude || ''}
                    onChange={(e) => setProfile({ ...profile, longitude: parseFloat(e.target.value) })}
                    className="bg-slate-50 border border-slate-300 rounded p-1.5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center & Right Columns: Farm & Plots Management */}
        <div className="lg:col-span-2 space-y-4">
          {/* Farm Aggregates Summary */}
          <div className="bg-emerald-950 text-white rounded-xl p-5 shadow-sm border border-emerald-800/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-emerald-300 font-mono uppercase tracking-wider block">
                Active Holding
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {currentFarm.farmName}
              </h2>
              <span className="text-xs text-emerald-200/80">
                {profile.village}, {profile.blockTehsil}, {profile.district} ({profile.state})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="bg-emerald-900/70 border border-emerald-700/50 rounded-lg px-3 py-2">
                <span className="text-emerald-300 block text-[10px]">Total Area</span>
                <span className="text-base font-bold text-white">
                  {totalFarmAcreage} Ac <span className="text-xs text-emerald-300 font-normal">({totalFarmHectares} ha)</span>
                </span>
              </div>
              <div className="bg-emerald-900/70 border border-emerald-700/50 rounded-lg px-3 py-2">
                <span className="text-emerald-300 block text-[10px]">Monthly Water Spend</span>
                <span className="text-base font-bold text-amber-300">
                  ₹{totalMonthlyWaterSpend.toLocaleString()}
                </span>
              </div>
              <div className="bg-emerald-900/70 border border-emerald-700/50 rounded-lg px-3 py-2">
                <span className="text-emerald-300 block text-[10px]">Storage Capacity</span>
                <span className="text-base font-bold text-cyan-300">
                  {(totalStorageCapacity / 1000).toFixed(1)} kL
                </span>
              </div>
            </div>
          </div>

          {/* Plots List & Editor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Farm Plots &amp; Crop Sub-Divisions ({currentFarm.plots.length})
                </h3>
              </div>

              <button
                onClick={handleAddPlot}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crop Plot</span>
              </button>
            </div>

            <div className="space-y-4">
              {currentFarm.plots.map((plot, pIdx) => {
                const isEditing = editingPlotId === plot.id;

                return (
                  <div
                    key={plot.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isEditing
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                          {pIdx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{plot.name}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {plot.areaAcres} Acres ({(plot.areaAcres * 0.404686).toFixed(2)} ha)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setEditingPlotId(isEditing ? null : plot.id)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isEditing ? 'Collapse' : 'Edit Plot'}</span>
                        </button>
                        {currentFarm.plots.length > 1 && (
                          <button
                            onClick={() => handleDeletePlot(plot.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            title="Delete plot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* View Details when collapsed */}
                    {!isEditing && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">Crop &amp; Variety</span>
                          <span className="font-semibold text-slate-800">
                            {INDIAN_CROPS.find((c) => c.id === plot.cropId)?.name || plot.cropId}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">{plot.cropVariety}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Stage &amp; Soil</span>
                          <span className="font-semibold text-slate-800 capitalize">
                            {plot.growthStage.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{plot.soilType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Water Source &amp; Spend</span>
                          <span className="font-semibold text-slate-800 capitalize">
                            {plot.existingWaterSource.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-amber-700 font-mono font-medium block">
                            ₹{plot.monthlyWaterExpenseInr.toLocaleString()}/mo
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Irrigation &amp; Lab Test</span>
                          <span className="font-semibold text-slate-800 capitalize">
                            {plot.irrigationMethod}
                          </span>
                          <span className={`text-[10px] font-medium block ${plot.hasWaterQualityReport ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {plot.hasWaterQualityReport ? '✓ Lab Tested' : 'No Lab Report'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Full Plot Editor Form */}
                    {isEditing && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Plot Name</label>
                          <input
                            type="text"
                            value={plot.name}
                            onChange={(e) => handleUpdatePlot(plot.id, { name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-1.5"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Area (Acres)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={plot.areaAcres}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, { areaAcres: parseFloat(e.target.value) || 0.1 })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                          />
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            = {(plot.areaAcres * 0.404686).toFixed(3)} Hectares
                          </span>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Crop Type</label>
                          <select
                            value={plot.cropId}
                            onChange={(e) => handleUpdatePlot(plot.id, { cropId: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 cursor-pointer"
                          >
                            {INDIAN_CROPS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Crop Variety</label>
                          <input
                            type="text"
                            value={plot.cropVariety}
                            onChange={(e) => handleUpdatePlot(plot.id, { cropVariety: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-1.5"
                            placeholder="e.g. Bhagwa, Sharbati"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Growth Stage</label>
                          <select
                            value={plot.growthStage}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                growthStage: e.target.value as PlotRecord['growthStage'],
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 cursor-pointer"
                          >
                            <option value="initial">Initial / Seedling (Kc ~0.4 - 0.5)</option>
                            <option value="development">Crop Development / Vegetative</option>
                            <option value="mid_season">Mid-Season / Fruit Setting (Peak Kc)</option>
                            <option value="late_season">Late Season / Maturity</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Soil Type</label>
                          <select
                            value={plot.soilType}
                            onChange={(e) => handleUpdatePlot(plot.id, { soilType: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-1.5 cursor-pointer"
                          >
                            <option value="Sandy Loam">Sandy Loam (Rapid drainage, low retention)</option>
                            <option value="Black Cotton Soil">Black Cotton / Vertisol (High moisture retention)</option>
                            <option value="Clay Loam">Clay Loam (Moderate retention)</option>
                            <option value="Alluvial Soil">Alluvial Soil (Gangetic &amp; coastal plains)</option>
                            <option value="Red Sandy Soil">Red Sandy Soil (Semi-arid Deccan)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Irrigation Method</label>
                          <select
                            value={plot.irrigationMethod}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                irrigationMethod: e.target.value as PlotRecord['irrigationMethod'],
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 cursor-pointer"
                          >
                            <option value="drip">Drip Irrigation (90% Efficiency)</option>
                            <option value="sprinkler">Micro-Sprinkler (75% Efficiency)</option>
                            <option value="flood_furrow">Furrow / Flood (50% Efficiency)</option>
                            <option value="micro_jet">Micro-Jet Spray (82% Efficiency)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Existing Water Source</label>
                          <select
                            value={plot.existingWaterSource}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                existingWaterSource: e.target.value as PlotRecord['existingWaterSource'],
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 cursor-pointer"
                          >
                            <option value="deep_borewell">Deep Borewell (Over-extracted)</option>
                            <option value="private_tanker">Private Tanker Water (₹1,000 - ₹2,000/load)</option>
                            <option value="open_dug_well">Open Dug Well (Seasonal)</option>
                            <option value="canal">Canal Irrigation (Rotational)</option>
                            <option value="rainwater_pond">Farm Pond / Rainwater Harvesting</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Monthly Water Spend (₹ INR)</label>
                          <input
                            type="number"
                            step="500"
                            value={plot.monthlyWaterExpenseInr}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                monthlyWaterExpenseInr: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-amber-800 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Storage Tank Capacity (L)</label>
                          <input
                            type="number"
                            step="1000"
                            value={plot.storageCapacityLiters}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                storageCapacityLiters: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Daily Water Avail. (L/day)</label>
                          <input
                            type="number"
                            step="100"
                            value={plot.dailyWaterAvailabilityLiters}
                            onChange={(e) =>
                              handleUpdatePlot(plot.id, {
                                dailyWaterAvailabilityLiters: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plot.hasWaterQualityReport}
                              onChange={(e) =>
                                handleUpdatePlot(plot.id, { hasWaterQualityReport: e.target.checked })
                              }
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-slate-700 font-medium">Has Lab Water Test Report</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
