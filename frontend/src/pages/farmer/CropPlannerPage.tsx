import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { useGoogleWeather } from '../../context/WeatherContext';
import { api } from '../../services/api';
import {
  CalendarDays,
  Sparkles,
  CloudSun,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Check,
  X,
  FileText,
  ChevronDown,
  Droplets,
  Wind,
  Layers,
  ArrowRight,
  Loader2,
  Sprout,
  Info,
  MapPin,
  Crosshair,
  Globe,
  Navigation
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LocationPickerModal } from '../../components/common/LocationPickerModal';

export const CropPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    location: devLoc,
    isDetecting,
    openLocationModal,
    detectDeviceLocation,
    setManualLocation,
  } = useDeviceLocation();
  const { current: liveWeather } = useGoogleWeather();

  // Filters
  const [selectedField, setSelectedField] = useState('All Fields');
  const [selectedSoil, setSelectedSoil] = useState('Loamy');
  const [selectedSeason, setSelectedSeason] = useState('Kharif (June - October)');
  const [selectedLocation, setSelectedLocation] = useState(devLoc?.display_name || 'Siliguri, West Bengal');
  const [selectedCrop, setSelectedCrop] = useState('Rice');

  // Calendar Tabs
  const [calendarTab, setCalendarTab] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [calendarCrop, setCalendarCrop] = useState('Rice');
  const [calendarField, setCalendarField] = useState('All Fields');

  // Market Demand Crop
  const [trendCrop, setTrendCrop] = useState('Rice');

  // Data & loading states
  const [loading, setLoading] = useState(false);
  const [plannerData, setPlannerData] = useState<any>(null);
  const [soilModalOpen, setSoilModalOpen] = useState(false);

  // Synchronize with backend Crop Planner & Google Maps/Gemini
  const syncCropPlanner = useCallback(async (cropOverride?: string, soilOverride?: string, seasonOverride?: string) => {
    try {
      const activeCrop = cropOverride || selectedCrop;
      const activeSoil = soilOverride || selectedSoil;
      const activeSeason = seasonOverride || selectedSeason;

      const res = await api.getCropPlanner({
        location: devLoc?.display_name || selectedLocation,
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
        field: selectedField,
        soil_type: activeSoil,
        season: activeSeason,
        crop: activeCrop,
      });
      if (res) {
        setPlannerData(res);
      }
    } catch (err) {
      console.warn('Crop planner synchronization error:', err);
    }
  }, [devLoc?.display_name, devLoc?.latitude, devLoc?.longitude, selectedLocation, selectedField, selectedSoil, selectedSeason, selectedCrop]);

  // Initial load auto-detection if not yet auto-detected
  useEffect(() => {
    if (!devLoc?.isAutoDetected && navigator.geolocation) {
      detectDeviceLocation().catch(() => {});
    }
  }, []);

  // Sync location display when device location updates
  useEffect(() => {
    if (devLoc?.display_name) {
      setSelectedLocation(devLoc.display_name);
    }
  }, [devLoc?.display_name]);

  // Continuous Auto-Synchronization: fetches immediately and auto-syncs every 30 seconds
  useEffect(() => {
    syncCropPlanner();

    const intervalTimer = setInterval(() => {
      syncCropPlanner();
    }, 30000);

    return () => {
      clearInterval(intervalTimer);
    };
  }, [syncCropPlanner]);

  // Handle "Get AI Crop Suggestions"
  const handleGetAISuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.getAICropSuggestions({
        field: selectedField,
        soil_type: selectedSoil,
        season: selectedSeason,
        location: selectedLocation || devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
        crop: selectedCrop,
      });
      if (res) {
        setPlannerData(res);
      }
    } catch (err) {
      console.error('Error fetching AI crop suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Weather suitability data synchronized with Google Weather API
  const weatherSuitability = {
    temp: liveWeather?.temp ?? plannerData?.weather_suitability?.temp ?? 26,
    condition: liveWeather?.condition ?? plannerData?.weather_suitability?.condition ?? 'Sunny',
    rain_chance: liveWeather?.rain_chance ?? plannerData?.weather_suitability?.rain_chance ?? 75,
    humidity: liveWeather?.humidity ?? plannerData?.weather_suitability?.humidity ?? 86,
    wind: liveWeather?.wind ?? plannerData?.weather_suitability?.wind ?? '10 km/h SE',
    scores: plannerData?.weather_suitability?.scores || [
      { name: 'Rice Suitability', score: 85, color: 'green', status: 'check' },
      { name: 'Maize', score: 72, color: 'amber', status: 'leaf' },
      { name: 'Potato', score: 65, color: 'orange', status: 'root' },
      { name: 'Tomato', score: 60, color: 'red', status: 'cross' },
    ],
  };

  // Recommended Crops
  const recommendedCrops = plannerData?.recommended_crops || [
    {
      name: 'Rice',
      badge: '✓ Highly Suitable',
      expected_yield: '40-50 Quintal/Acre',
      estimated_profit: '₹ 45,000/Acre',
      image: '/assets/farmer/crop_planner/crop_rice.jpg',
      suitability_score: 85,
    },
    {
      name: 'Maize',
      badge: '✓ Suitable',
      expected_yield: '25-35 Quintal/Acre',
      estimated_profit: '₹ 32,000/Acre',
      image: '/assets/farmer/crop_planner/crop_maize.jpg',
      suitability_score: 72,
    },
    {
      name: 'Tomato',
      badge: '✓ Highly Profitable',
      expected_yield: '150-200 Quintal/Acre',
      estimated_profit: '₹ 1,20,000/Acre',
      image: '/assets/farmer/crop_planner/crop_tomato.jpg',
      suitability_score: 60,
    },
    {
      name: 'Potato',
      badge: '✓ Suitable',
      expected_yield: '80-120 Quintal/Acre',
      estimated_profit: '₹ 70,000/Acre',
      image: '/assets/farmer/crop_planner/crop_potato.jpg',
      suitability_score: 65,
    },
  ];

  // Soil metrics & details (dynamically resolved for selected soil)
  const currentSoilProfile = plannerData?.soil_database?.[selectedSoil] || plannerData?.soil_suitability;
  const soilSuitability = currentSoilProfile || {
    soil_type: selectedSoil,
    last_test_date: '10 May 2026',
    thumbnail: '/assets/farmer/crop_planner/soil_thumb.jpg',
    metrics: [
      { label: 'pH', sub: '', value: '6.8', status: 'Good', color: 'green', icon: 'ph' },
      { label: 'Nitrogen', sub: '(N)', value: 'Medium', status: 'Medium', color: 'amber', icon: 'nitrogen' },
      { label: 'Phosphorus', sub: '(P)', value: 'Low', status: 'Low', color: 'red', icon: 'phosphorus' },
      { label: 'Potassium', sub: '(K)', value: 'Medium', status: 'Medium', color: 'amber', icon: 'potassium' },
      { label: 'Organic Matter', sub: '', value: 'Good', status: 'Good', color: 'green', icon: 'organic' },
    ],
  };

  const soilDetails = plannerData?.soil_database?.[selectedSoil]?.details || plannerData?.soil_details || {
    ph_text: '6.8 (Optimal)',
    organic_carbon: '0.62% (Good)',
    available_n: '285 kg/ha (Medium)',
    available_p: '12 kg/ha (Low)',
    available_k: '190 kg/ha (Medium)',
    ec: '0.35 dS/m (Normal)',
    ai_recommendation: 'Phosphorus is deficient. Apply Single Super Phosphate (SSP) @ 50 kg/Acre before sowing. Supplement with composted cow manure to sustain organic microbial activity.'
  };

  // Calendar activities & Gantt data (dynamically resolved for active calendarCrop and calendarTab)
  const activeCalendarCropData = plannerData?.crops_database?.[calendarCrop];
  const calendarMonths = calendarTab === 'Rabi'
    ? ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    : calendarTab === 'Zaid'
    ? ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    : ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  const calendarActivities = activeCalendarCropData?.calendar_activities || plannerData?.calendar?.activities || [
    { name: 'Land Preparation', start: 'Jun', end: 'Jun', color: '#c47d46' },
    { name: 'Seed Treatment', start: 'Jun', end: 'Jun', color: '#a855f7' },
    { name: 'Sowing', start: 'Jun', end: 'Jul', color: '#2dd4bf' },
    { name: 'Fertilization', start: 'Jul', end: 'Jul', color: '#38bdf8' },
    { name: 'Irrigation', start: 'Jul', end: 'Sep', color: '#eab308' },
    { name: 'Weed & Pest Control', start: 'Jul', end: 'Oct', color: '#f87171' },
    { name: 'Harvest', start: 'Oct', end: 'Nov', color: '#22c55e' },
  ];

  const importantDates = activeCalendarCropData?.important_dates || plannerData?.calendar?.important_dates || [
    { activity: 'Land Preparation', dates: '1 - 15 Jun', color: '#c47d46' },
    { activity: 'Seed Treatment', dates: '10 - 15 Jun', color: '#a855f7' },
    { activity: 'Sowing', dates: '15 Jun - 15 Jul', color: '#2dd4bf' },
    { activity: 'Fertilization', dates: '20 - 25 Jul', color: '#38bdf8' },
    { activity: 'First Irrigation', dates: '25 - 30 Jul', color: '#eab308' },
    { activity: 'Weed Control', dates: '15 - 20 Aug', color: '#f87171' },
    { activity: 'Harvest', dates: '15 - 30 Oct', color: '#22c55e' },
  ];

  // Step-by-step guides (dynamically resolved for active calendarCrop)
  const guideSteps = activeCalendarCropData?.guide_steps || plannerData?.step_by_step_guide?.steps || [
    {
      step: 1,
      title: 'Land Preparation',
      dates: '(1 - 15 Jun)',
      image: '/assets/farmer/crop_planner/guide_1_land_prep.jpg',
      bg: 'bg-[#f4f7f6]',
      points: ['Plough the field', 'Level the field', 'Make proper bunds'],
      isNegative: false,
    },
    {
      step: 2,
      title: 'Seed Treatment',
      dates: '(10 - 15 Jun)',
      image: '/assets/farmer/crop_planner/guide_2_seed_treatment.jpg',
      bg: 'bg-[#f6f4fa]',
      points: ['Treat seeds with fungicide', 'Use quality seeds', 'Follow correct dose'],
      isNegative: false,
    },
    {
      step: 3,
      title: 'Sowing',
      dates: '(15 Jun - 15 Jul)',
      image: '/assets/farmer/crop_planner/guide_3_sowing.jpg',
      bg: 'bg-[#f2f8f7]',
      points: ['Sow at proper spacing', 'Maintain uniform depth'],
      isNegative: false,
    },
    {
      step: 4,
      title: 'Fertilization',
      dates: '(20 - 25 Jul)',
      image: '/assets/farmer/crop_planner/guide_4_fertilization.jpg',
      bg: 'bg-[#f1f6fa]',
      points: ['Apply first dose of fertilizer', 'Irrigate immediately'],
      isNegative: false,
    },
    {
      step: 5,
      title: 'Weed & Pest Control',
      dates: '(25 - 30 Jul)',
      image: '/assets/farmer/crop_planner/guide_5_weed_pest.jpg',
      bg: 'bg-[#faf6f2]',
      points: ['Use Urea, DAP per Recommendation', 'Regular monitoring'],
      isNegative: false,
    },
    {
      step: 6,
      title: 'Harvesting',
      dates: '(15 - 30 Oct)',
      image: '/assets/farmer/crop_planner/guide_6_harvesting.jpg',
      bg: 'bg-[#faf3f4]',
      points: ['Harvest at right time', 'Avoid over-maturity'],
      isNegative: true,
    },
  ];

  // Cost & Profit metrics (dynamically resolved for selectedCrop)
  const activeSelectedCropData = plannerData?.crops_database?.[selectedCrop];
  const costProfit = activeSelectedCropData?.cost_and_profit || plannerData?.cost_and_profit || {
    crop: selectedCrop,
    total_cost: '₹ 18,000',
    total_cost_unit: '/Acre',
    expected_yield: '45',
    expected_yield_unit: 'Quintal/Acre',
    market_price: '₹ 2,050',
    market_price_unit: '/Quintal',
    estimated_revenue: '₹ 81,000',
    estimated_revenue_unit: '/Acre',
    net_profit: '₹ 63,000',
    net_profit_unit: '/Acre',
  };

  // Market Demand & Price Trend Data (dynamically resolved for trendCrop)
  const activeTrendCropData = plannerData?.crops_database?.[trendCrop]?.market_demand || plannerData?.market_demand;
  const trendData = activeTrendCropData?.chart_data || [
    { month: 'Jan', price: 1820 },
    { month: 'Feb', price: 1870 },
    { month: 'Mar', price: 1920 },
    { month: 'Apr', price: 1960 },
    { month: 'May', price: 2010 },
    { month: 'Jun', price: 2050 },
  ];
  const currentTrendPrice = activeTrendCropData?.current_price || '₹ 2,050';
  const currentTrendLabel = activeTrendCropData?.trend_label || '↑ 8% (from last month)';

  // Do's and Don'ts
  const dosList = [
    'Choose crop as per weather',
    'Test soil before cropping',
    'Use quality seeds',
    'Follow proper spacing',
    'Use fertilizer at right time',
    'Control weeds and pests regularly',
  ];

  const dontsList = [
    'Do not sow before suitable rain',
    'Do not overuse fertilizers',
    'Do not ignore weed control',
    'Do not use low quality seeds',
    'Do not delay pest control',
    'Do not harvest too early or late',
  ];


  return (
    <FarmerLayout>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-8 font-sans text-gray-900">
        
        {/* ==================== 1. HERO BANNER (Photo & Real Text Separated) ==================== */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-green-800/15 min-h-[140px] sm:min-h-[155px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.86) 38%, rgba(255, 255, 255, 0.25) 58%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.45) 100%), url('/assets/farmer/crop_planner/hero_banner_clean.jpg')`,
            backgroundPosition: 'center 38%',
            backgroundSize: 'cover',
          }}
        >
          {/* Left: Title, Subtitle, and AI Suggestion Button */}
          <div className="relative z-10 max-w-sm sm:max-w-md space-y-1.5">
            <h1 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-none">
              Crop Planner
            </h1>
            <p className="text-xs sm:text-[13px] font-semibold text-gray-700 leading-snug">
              Right Crop, Right Time, Higher Yield, Higher Profit
            </p>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleGetAISuggestions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#008037] hover:bg-emerald-800 text-white text-[11px] font-bold rounded-full shadow-xs transition-all hover:shadow-sm cursor-pointer group"
                title="Get AI based crop suggestions as per farm, weather, and soil"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>AI Based Suggestions as per Your Farm, Weather and Soil</span>
              </button>
            </div>
          </div>

          {/* Center: 4 Workflow Steps */}
          <div className="hidden xl:flex items-center gap-2.5 relative z-10">
            {/* Step 1: What to Grow? */}
            <div
              onClick={() => {
                const el = document.getElementById('ai-recommended-crops-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                What to Grow?
              </span>
            </div>

            <span className="text-gray-400 font-bold text-sm -mt-4 select-none">›</span>

            {/* Step 2: When to Grow? */}
            <div
              onClick={() => {
                const el = document.getElementById('crop-calendar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                When to Grow?
              </span>
            </div>

            <span className="text-gray-400 font-bold text-sm -mt-4 select-none">›</span>

            {/* Step 3: How to Grow? */}
            <div
              onClick={() => {
                const el = document.getElementById('step-by-step-guide-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                How to Grow?
              </span>
            </div>

            <span className="text-gray-400 font-bold text-sm -mt-4 select-none">›</span>

            {/* Step 4: How Much Profit? */}
            <div
              onClick={() => {
                const el = document.getElementById('profit-estimator-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                How Much Profit?
              </span>
            </div>
          </div>

          {/* Right: Smart Suggestions for My Farm Card */}
          <div className="hidden lg:block relative z-10 shrink-0">
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-white/80 shadow-md max-w-[245px] relative overflow-hidden">
              <h3 className="text-xs font-black text-gray-900 mb-1.5 flex items-center gap-1">
                <span>Smart Suggestions for My Farm</span>
              </h3>
              <ul className="space-y-1 text-[11px] text-gray-700 font-semibold">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Best crops as per weather</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Soil based recommendations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Market demand based plan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Lower cost, higher profit</span>
                </li>
              </ul>
              <Sprout className="w-8 h-8 text-emerald-100 absolute -bottom-1 -right-1 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ==================== 2. FILTER BAR ==================== */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* Select Field */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Select Field</label>
              <div className="relative">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full appearance-none px-3 py-2 text-xs font-semibold text-gray-800 bg-[#f8faf8] rounded-xl border border-gray-200 focus:outline-none focus:border-green-600 cursor-pointer"
                >
                  <option value="All Fields">All Fields</option>
                  <option value="Field 1 (Rice)">Field 1 (Rice)</option>
                  <option value="Field 2 (Tomato)">Field 2 (Tomato)</option>
                  <option value="Field 3 (Maize)">Field 3 (Maize)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Soil Type</label>
              <div className="relative">
                <select
                  value={selectedSoil}
                  onChange={(e) => {
                    const newSoil = e.target.value;
                    setSelectedSoil(newSoil);
                    syncCropPlanner(undefined, newSoil);
                  }}
                  className="w-full appearance-none px-3 py-2 text-xs font-semibold text-gray-800 bg-[#f8faf8] rounded-xl border border-gray-200 focus:outline-none focus:border-green-600 cursor-pointer"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Black Soil">Black Soil</option>
                  <option value="Red Soil">Red Soil</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Season */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Season</label>
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    const newSeason = e.target.value;
                    setSelectedSeason(newSeason);
                    if (newSeason.startsWith('Kharif')) setCalendarTab('Kharif');
                    else if (newSeason.startsWith('Rabi')) setCalendarTab('Rabi');
                    else if (newSeason.startsWith('Zaid')) setCalendarTab('Zaid');
                    syncCropPlanner(undefined, undefined, newSeason);
                  }}
                  className="w-full appearance-none px-3 py-2 text-xs font-semibold text-gray-800 bg-[#f8faf8] rounded-xl border border-gray-200 focus:outline-none focus:border-green-600 cursor-pointer"
                >
                  <option value="Kharif (June - October)">Kharif (June - October)</option>
                  <option value="Rabi (November - March)">Rabi (November - March)</option>
                  <option value="Zaid (March - June)">Zaid (March - June)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-500">Location</label>
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="text-[10px] font-bold text-[#008037] hover:underline flex items-center gap-0.5 cursor-pointer"
                  title="Open interactive Google Map to pin farm location"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#008037]" />
                  <span>Google Map</span>
                </button>
              </div>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__open_google_map__') {
                      openLocationModal();
                    } else if (val === '__redetect_gps__') {
                      detectDeviceLocation();
                    } else {
                      setSelectedLocation(val);
                      setManualLocation(val);
                    }
                  }}
                  className="w-full appearance-none px-3 py-2 text-xs font-semibold text-gray-800 bg-[#f8faf8] rounded-xl border border-gray-200 focus:outline-none focus:border-green-600 cursor-pointer truncate pr-7"
                >
                  {isDetecting ? (
                    <option value={selectedLocation}>⏳ Detecting via Google API...</option>
                  ) : (
                    <option value={devLoc?.display_name || selectedLocation}>
                      📍 {devLoc?.display_name || selectedLocation} {devLoc?.isAutoDetected ? '(Auto-Detected GPS)' : ''}
                    </option>
                  )}
                  <option value="__open_google_map__">🗺️ Open Interactive Google Map...</option>
                  <option value="__redetect_gps__">🎯 Re-Detect Live GPS Location</option>
                  <optgroup label="Preset Agricultural Regions">
                    <option value="Siliguri, West Bengal">Siliguri, West Bengal</option>
                    <option value="Kolkata, West Bengal">Kolkata, West Bengal</option>
                    <option value="Patna, Bihar">Patna, Bihar</option>
                    <option value="Burdwan, West Bengal">Burdwan, West Bengal</option>
                    <option value="Darjeeling, West Bengal">Darjeeling, West Bengal</option>
                    <option value="Malda, West Bengal">Malda, West Bengal</option>
                    <option value="Jalpaiguri, West Bengal">Jalpaiguri, West Bengal</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="mt-1 flex items-center justify-between text-[9px] px-0.5">
                <span className="flex items-center gap-1 text-[#008037] font-semibold truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {devLoc?.isAutoDetected ? 'Auto GPS' : 'Google API'}: {devLoc?.latitude ? `${devLoc.latitude.toFixed(2)}°N, ${devLoc.longitude.toFixed(2)}°E` : 'Connected'}
                </span>
                <button
                  type="button"
                  onClick={detectDeviceLocation}
                  disabled={isDetecting}
                  className="text-gray-400 hover:text-[#008037] font-medium hover:underline cursor-pointer"
                  title="Auto-detect again via GPS and Google Geolocation"
                >
                  {isDetecting ? 'Detecting...' : 'Re-Detect'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleGetAISuggestions}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Farm...</span>
                  </>
                ) : (
                  <>
                    <span>Get AI Crop Suggestions</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ==================== 3. ROW 1: TOP CROPS + WEATHER + SOIL ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card 1: AI Recommended Top Crops (6 cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-sm">☀️</span>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900">AI Recommended Top Crops</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#008037] px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>AI Powered</span>
                  </span>
                </div>
                <button
                  onClick={() => handleGetAISuggestions()}
                  className="text-xs font-bold text-[#008037] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <span>→</span>
                </button>
              </div>

              {/* 4 Crop Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {recommendedCrops.map((crop: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCrop(crop.name);
                      setCalendarCrop(crop.name);
                      setTrendCrop(crop.name);
                      syncCropPlanner(crop.name);
                    }}
                    className={`bg-[#f8faf8] rounded-xl border p-2 flex flex-col justify-between text-center transition-all cursor-pointer ${
                      selectedCrop === crop.name ? 'border-[#008037] ring-1 ring-[#008037]/20 shadow-xs' : 'border-gray-200/80 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-gray-900 mb-1.5">{crop.name}</h4>
                      <div className="h-16 w-full rounded-lg overflow-hidden mb-1.5 bg-gray-100">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="my-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block bg-[#eaf4ec] text-[#008037]">
                          {crop.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Expected Yield</div>
                      <div className="text-[10px] font-bold text-gray-900">{crop.expected_yield}</div>
                      <div className="text-[10px] text-gray-400 font-medium mt-1">Estimated Profit</div>
                      <div className="text-[10px] font-black text-gray-900">{crop.estimated_profit}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCrop(crop.name);
                        setCalendarCrop(crop.name);
                        setTrendCrop(crop.name);
                        syncCropPlanner(crop.name);
                      }}
                      className="w-full mt-2 py-1 bg-[#008037] hover:bg-[#00682e] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Grow</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Weather Suitability (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span className="text-amber-500">🏠</span>
                  <span>Weether Suitability</span>
                </h3>
                <button
                  onClick={openLocationModal}
                  className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer flex items-center gap-0.5"
                  title="View on Google Map"
                >
                  <span>Google Map</span>
                  <span>→</span>
                </button>
              </div>

              {/* Weather Summary Box */}
              <div className="mt-2.5 p-2 bg-[#f4f8fa] rounded-xl border border-blue-100/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <CloudSun className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <div
                      onClick={openLocationModal}
                      className="text-[9px] text-[#008037] font-bold flex items-center gap-0.5 cursor-pointer hover:underline mb-0.5"
                      title="Click to view/change on Google Map"
                    >
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{devLoc?.display_name || selectedLocation}</span>
                    </div>
                    <div className="text-lg font-black text-gray-900 leading-tight">
                      {weatherSuitability.temp}°C
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {weatherSuitability.condition}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1 text-[9px] font-semibold text-gray-700 bg-white/70 px-2 py-1.5 rounded-lg border border-blue-50">
                  <div className="flex items-center justify-end gap-1">
                    <Droplets className="w-2.5 h-2.5 text-blue-500" />
                    <span className="text-gray-500 font-normal">Rain Chance:</span>
                    <span className="font-bold">{weatherSuitability.rain_chance}%</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Droplets className="w-2.5 h-2.5 text-cyan-500" />
                    <span className="text-gray-500 font-normal">Humidity:</span>
                    <span className="font-bold">{weatherSuitability.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Wind className="w-2.5 h-2.5 text-slate-400" />
                    <span className="text-gray-500 font-normal">Wind:</span>
                    <span className="font-bold">{weatherSuitability.wind}</span>
                  </div>
                </div>
              </div>

              {/* Suitability Bars */}
              <div className="mt-3 space-y-2">
                {weatherSuitability.scores.map((item: any, i: number) => {
                  let barColor = 'bg-[#008037]';
                  let iconElement = <span className="w-3.5 h-3.5 rounded-full bg-[#008037] text-white flex items-center justify-center text-[8px] font-bold">✓</span>;
                  
                  if (item.status === 'cross' || item.name.includes('Tomato')) {
                    barColor = 'bg-red-500';
                    iconElement = <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] font-bold">✕</span>;
                  } else if (item.status === 'leaf' || item.name.includes('Maize')) {
                    barColor = 'bg-[#eab308]';
                    iconElement = <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">🌾</span>;
                  } else if (item.status === 'root' || item.name.includes('Potato')) {
                    barColor = 'bg-[#f97316]';
                    iconElement = <span className="w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px]">🥔</span>;
                  }

                  return (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                        <div className="flex items-center gap-1.5">
                          {iconElement}
                          <span className="text-[11px] font-bold text-gray-900">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 sm:w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} rounded-full transition-all duration-500`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-gray-900 w-7 text-right">{item.score}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Soil Suitability (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span className="text-[#008037]">🌱</span>
                  <span>Soil Suitability</span>
                </h3>
              </div>

              {/* Top thumbnail & info */}
              <div className="mt-2.5 flex items-center gap-2.5">
                <img
                  src={soilSuitability.thumbnail}
                  alt="Soil in Field"
                  className="w-14 h-10 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    My Soil: <span className="text-[#008037]">{soilSuitability.soil_type}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    Last Test Date: {soilSuitability.last_test_date}
                  </div>
                </div>
              </div>

              {/* 5 Column NPK and Organic Matter Matrix */}
              <div className="grid grid-cols-5 gap-1 mt-3 text-center">
                {soilSuitability.metrics.map((m: any, idx: number) => {
                  let badgeClass = 'bg-[#eaf4ec] text-[#008037]';
                  if (m.status === 'Medium') badgeClass = 'bg-[#fef3c7] text-[#d97706]';
                  if (m.status === 'Low') badgeClass = 'bg-[#fee2e2] text-[#dc2626]';

                  return (
                    <div key={idx} className="p-1 bg-[#fbfdfb] rounded-lg border border-gray-100 flex flex-col justify-between items-center">
                      <div className="text-[8.5px] font-bold text-gray-600 leading-tight">
                        {m.label} <span className="block text-[8px] text-gray-400 font-normal">{m.sub}</span>
                      </div>
                      
                      {/* Icon or Value */}
                      <div className="my-1 flex items-center justify-center">
                        {m.icon === 'ph' ? (
                          <div className="text-xs font-black text-gray-900">{m.value}</div>
                        ) : m.icon === 'nitrogen' ? (
                          <span className="text-xs">💧</span>
                        ) : m.icon === 'phosphorus' ? (
                          <span className="text-xs">🧪</span>
                        ) : m.icon === 'potassium' ? (
                          <span className="text-xs">🌾</span>
                        ) : (
                          <span className="text-xs">🌱</span>
                        )}
                      </div>

                      <div className={`text-[8px] font-bold px-1 py-0.2 rounded-md ${badgeClass}`}>
                        {m.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setSoilModalOpen(true)}
              className="w-full mt-3 py-2 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>View Soil Test Report</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ==================== 4. ROW 2: CROP CALENDAR + STEP-BY-STEP CROP GUIDE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card 1: Crop Calendar (June 2026 - May 2027) (6 cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header & Tabs */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">📅</span>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900">
                    Crop Calendar (June 2026 - May 2027)
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCalendarTab('Kharif');
                      setSelectedSeason('Kharif (June - October)');
                      syncCropPlanner(undefined, undefined, 'Kharif (June - October)');
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      calendarTab === 'Kharif' ? 'bg-[#008037] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Kharif (Jun - Oct)
                  </button>
                  <button
                    onClick={() => {
                      setCalendarTab('Rabi');
                      setSelectedSeason('Rabi (November - March)');
                      syncCropPlanner(undefined, undefined, 'Rabi (November - March)');
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      calendarTab === 'Rabi' ? 'bg-[#008037] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Rabi (Nov - Mar)
                  </button>
                  <button
                    onClick={() => {
                      setCalendarTab('Zaid');
                      setSelectedSeason('Zaid (March - June)');
                      syncCropPlanner(undefined, undefined, 'Zaid (March - June)');
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      calendarTab === 'Zaid' ? 'bg-[#008037] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Zaid (Mar - Jun)
                  </button>

                  <select
                    value={calendarCrop}
                    onChange={(e) => {
                      const cName = e.target.value;
                      setCalendarCrop(cName);
                      setSelectedCrop(cName);
                      setTrendCrop(cName);
                      syncCropPlanner(cName);
                    }}
                    className="text-[10px] font-bold text-gray-800 bg-[#f8faf8] border border-gray-200 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
                  >
                    <option value="Rice">Crop: Rice</option>
                    <option value="Maize">Crop: Maize</option>
                    <option value="Tomato">Crop: Tomato</option>
                    <option value="Potato">Crop: Potato</option>
                  </select>

                  <select
                    value={calendarField}
                    onChange={(e) => setCalendarField(e.target.value)}
                    className="text-[10px] font-bold text-gray-800 bg-[#f8faf8] border border-gray-200 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
                  >
                    <option value="All Fields">Field: All Fields</option>
                    <option value="Field 1">Field 1</option>
                    <option value="Field 2">Field 2</option>
                  </select>
                </div>
              </div>

              {/* Gantt Activity Table + Important Dates */}
              <div className="grid grid-cols-12 gap-2 mt-3">
                {/* Gantt Chart Matrix (8 cols) */}
                <div className="col-span-8 overflow-x-auto">
                  <table className="w-full text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-bold">
                        <th className="text-left py-1 w-24">Activity</th>
                        {calendarMonths.map((m) => (
                          <th key={m} className="text-center py-1 px-0.5 font-bold text-gray-600">
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {calendarActivities.map((act: any, idx: number) => (
                        <tr key={idx} className="h-6">
                          <td className="text-gray-800 font-semibold py-1 truncate pr-1">
                            {act.name}
                          </td>
                          {calendarMonths.map((m, mIdx) => {
                            const startIdx = calendarMonths.indexOf(act.start);
                            const endIdx = calendarMonths.indexOf(act.end);
                            const isActiveMonth = mIdx >= startIdx && mIdx <= endIdx;

                            return (
                              <td key={m} className="p-0.5 text-center relative">
                                {isActiveMonth && (
                                  <div
                                    className="h-3 rounded-md w-full transition-all"
                                    style={{ backgroundColor: act.color }}
                                    title={`${act.name}: ${act.start} - ${act.end}`}
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Important Dates List (4 cols) */}
                <div className="col-span-4 border-l border-gray-100 pl-2">
                  <h4 className="text-[10px] font-black text-gray-900 mb-1.5">Important Dates</h4>
                  <div className="space-y-1.5">
                    {importantDates.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-[8.5px] leading-tight">
                        <div className="flex items-center gap-1 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-gray-700 truncate">{item.activity}</span>
                        </div>
                        <span className="font-bold text-gray-900 shrink-0 ml-1">{item.dates}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Step-by-Step Crop Guide (Rice) (6 cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-1.5">
                  <span className="text-[#008037]">📋</span>
                  <span>Step-by-Step Crop Guide ({calendarCrop})</span>
                </h3>
                <span
                  onClick={() => navigate('/farmer/crop-health?crop=' + calendarCrop.toLowerCase())}
                  className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer"
                >
                  Full Guide →
                </span>
              </div>

              {/* Numbered Progress Flow Line */}
              <div className="flex items-center justify-between px-2 pt-2 pb-1 relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 border-t border-dashed border-gray-300 -translate-y-1/2 z-0" />
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="relative z-10 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#008037] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                      {num}
                    </div>
                  </div>
                ))}
              </div>

              {/* 6 Step Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                {guideSteps.map((step: any) => (
                  <div
                    key={step.step}
                    className={`${step.bg} rounded-xl border border-gray-200/80 p-1.5 flex flex-col justify-between text-left`}
                  >
                    <div>
                      <div className="h-12 w-full rounded-lg overflow-hidden mb-1 bg-gray-100">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[9.5px] font-black text-gray-900 leading-tight">
                        {step.title}
                      </div>
                      <div className="text-[8.5px] text-gray-400 font-medium mb-1">
                        {step.dates}
                      </div>

                      <div className="space-y-0.5 text-[8px] leading-tight">
                        {step.points.map((p: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-0.5">
                            {step.isNegative ? (
                              <span className="text-red-500 font-bold shrink-0">✕</span>
                            ) : (
                              <span className="text-[#008037] font-bold shrink-0">•</span>
                            )}
                            <span className="text-gray-700 font-medium">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 5. ROW 3: COST & PROFIT + MARKET DEMAND + DO'S & DON'TS ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card 1: Cost & Expected Profit (Rice) (4 cols) */}
          <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <span className="text-amber-500 text-sm">💰</span>
                <h3 className="text-xs font-black text-gray-900">
                  Cost & Expected Profit ({selectedCrop})
                </h3>
              </div>

              {/* 5 Stats Columns side-by-side matching screenshot */}
              <div className="grid grid-cols-5 gap-1.5 mt-3 text-center items-stretch">
                {/* Total Cost */}
                <div className="p-1.5 bg-[#f8faf8] rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="text-[8.5px] font-bold text-gray-500 leading-tight">Total Cost</div>
                  <div className="text-xs font-black text-gray-900 my-0.5">{costProfit.total_cost}</div>
                  <div className="text-[8px] text-gray-400 font-medium">{costProfit.total_cost_unit}</div>
                </div>

                {/* Expected Yield */}
                <div className="p-1.5 bg-[#f8faf8] rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="text-[8.5px] font-bold text-gray-500 leading-tight">Expected Yield</div>
                  <div className="text-xs font-black text-gray-900 my-0.5">{costProfit.expected_yield}</div>
                  <div className="text-[8px] text-gray-400 font-medium leading-none">{costProfit.expected_yield_unit}</div>
                </div>

                {/* Market Price (Est.) */}
                <div className="p-1.5 bg-[#f8faf8] rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="text-[8.5px] font-bold text-gray-500 leading-tight">Market Price (Est.)</div>
                  <div className="text-xs font-black text-gray-900 my-0.5">{costProfit.market_price}</div>
                  <div className="text-[8px] text-gray-400 font-medium">{costProfit.market_price_unit}</div>
                </div>

                {/* Estimated Revenue */}
                <div className="p-1.5 bg-[#f8faf8] rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="text-[8.5px] font-bold text-gray-500 leading-tight">Estimated Revenue</div>
                  <div className="text-xs font-black text-[#008037] my-0.5">{costProfit.estimated_revenue}</div>
                  <div className="text-[8px] text-gray-400 font-medium">{costProfit.estimated_revenue_unit}</div>
                </div>

                {/* Net Profit (Highlighted Green) */}
                <div className="p-1.5 bg-[#eaf4ec] rounded-xl border border-[#008037]/20 flex flex-col justify-between">
                  <div className="text-[8.5px] font-bold text-[#008037] leading-tight">Net Profit</div>
                  <div className="text-xs font-black text-[#008037] my-0.5">{costProfit.net_profit}</div>
                  <div className="text-[8px] text-[#008037]/80 font-medium">{costProfit.net_profit_unit}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Market Demand & Price Trend (4 cols) */}
          <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#008037] text-sm">📊</span>
                  <h3 className="text-xs font-black text-gray-900">Market Demand & Price Trend</h3>
                </div>
                <span
                  onClick={() => navigate('/farmer/market?crop=' + trendCrop.toLowerCase())}
                  className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer"
                >
                  View Details →
                </span>
              </div>

              {/* Dropdown, Price & Chart */}
              <div className="grid grid-cols-12 gap-2 mt-2 items-center">
                <div className="col-span-5 space-y-1">
                  <select
                    value={trendCrop}
                    onChange={(e) => setTrendCrop(e.target.value)}
                    className="text-xs font-bold text-gray-800 bg-[#f8faf8] border border-gray-200 rounded-lg px-2 py-1 outline-none w-full cursor-pointer"
                  >
                    <option value="Rice">Rice</option>
                    <option value="Maize">Maize</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                  </select>

                  <div className="pt-1">
                    <div className="text-base font-black text-gray-900 leading-tight">
                      {currentTrendPrice} <span className="text-[10px] text-gray-400 font-normal">/Quintal</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#008037] flex items-center gap-0.5 mt-0.5">
                      <span>{currentTrendLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="col-span-7 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" fontSize={8} stroke="#9ca3af" tickLine={false} />
                      <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip
                        contentStyle={{
                          fontSize: '10px',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}
                        formatter={(val: any) => [`₹ ${val}`, 'Price']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#008037"
                        strokeWidth={2}
                        dot={{ r: 2.5, fill: '#008037', stroke: '#008037' }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Do's & Don'ts Checklist (4 cols) */}
          <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3">
              {/* Do's Column */}
              <div>
                <div className="flex items-center gap-1 text-xs font-black text-[#008037] pb-1.5 border-b border-gray-100 mb-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#008037] text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                  <span>Do's</span>
                </div>
                <div className="space-y-1.5 text-[9px]">
                  {dosList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-tight text-gray-700">
                      <span className="text-[#008037] font-black shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don'ts Column */}
              <div>
                <div className="flex items-center gap-1 text-xs font-black text-red-600 pb-1.5 border-b border-gray-100 mb-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">✕</span>
                  <span>Don'ts</span>
                </div>
                <div className="space-y-1.5 text-[9px]">
                  {dontsList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-tight text-gray-700">
                      <span className="text-red-600 font-black shrink-0">✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SOIL TEST REPORT MODAL ==================== */}
        {soilModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">Laboratory Soil Health Card</h3>
                    <p className="text-[11px] text-gray-500">Government Soil Health Card Scheme & Google Gemini AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoilModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#f8faf8] p-3 rounded-2xl border border-gray-200/80 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Soil Classification:</span>
                  <span className="font-bold text-gray-900">{selectedSoil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sample Depth:</span>
                  <span className="font-bold text-gray-900">0 - 15 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location / Field:</span>
                  <span className="font-bold text-gray-900">{devLoc?.display_name || selectedLocation} ({selectedField})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GPS Coordinates:</span>
                  <span className="font-bold text-emerald-700">
                    {devLoc?.latitude ? `${devLoc.latitude.toFixed(4)}° N, ${devLoc.longitude.toFixed(4)}° E` : '26.7271° N, 88.3953° E'} (Google Maps API)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800">Nutrient Breakdown</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">pH Level:</span>
                    <span className="font-bold text-[#008037]">{soilDetails.ph_text}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">Organic Carbon:</span>
                    <span className="font-bold text-[#008037]">{soilDetails.organic_carbon}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">Available Nitrogen:</span>
                    <span className="font-bold text-amber-600">{soilDetails.available_n}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">Available Phosphorus:</span>
                    <span className="font-bold text-red-600">{soilDetails.available_p}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">Available Potassium:</span>
                    <span className="font-bold text-amber-600">{soilDetails.available_k}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                    <span className="text-gray-500">Electrical Cond. (EC):</span>
                    <span className="font-bold text-[#008037]">{soilDetails.ec}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google AI Fertilizer Recommendation</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {soilDetails.ai_recommendation}
                </p>
              </div>

              <button
                onClick={() => setSoilModalOpen(false)}
                className="w-full py-2.5 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};
export default CropPlannerPage;
