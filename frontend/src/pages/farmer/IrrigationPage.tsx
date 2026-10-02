import React, { useState, useEffect, useRef } from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { useGoogleWeather } from '../../context/WeatherContext';
import { api } from '../../services/api';
import {
  Droplets,
  Calendar,
  Sun,
  CloudRain,
  CloudSun,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Mic,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Folder,
  Calculator,
  Settings,
  BarChart2,
  IndianRupee,
  Lightbulb,
  Sprout,
  X,
  Sparkles,
  Check,
  AlertTriangle,
  Crosshair,
  ExternalLink,
  MapPin,
  Layers,
  Compass,
} from 'lucide-react';
import { GoogleFarmMap } from '../../components/farmer/GoogleFarmMap';

interface ScheduleDay {
  date: string;
  day: string;
  is_today?: boolean;
  need_mm: number;
  rain_mm: number;
  bar_type: 'need' | 'rain';
  weather: string;
  icon: 'sun' | 'rain' | 'cloud';
}

interface CropWaterItem {
  id: string;
  name: string;
  need_range: string;
  duration_type: string;
  badge_level: string;
  badge_color: string;
  thumb: string;
}

export const IrrigationPage: React.FC = () => {
  const { location: devLoc, isDetecting, detectDeviceLocation } = useDeviceLocation();
  const { current: liveWeather } = useGoogleWeather();

  // Selected Field state
  const [selectedField, setSelectedField] = useState('Field 1 (Rice)');
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);

  // Real Google Maps configuration ('s' = Satellite, 'y' = Hybrid Satellite + Roads/Labels)
  const [mapLayer, setMapLayer] = useState<'s' | 'y'>('y');
  const [mapViewMode, setMapViewMode] = useState<'selected' | 'all'>('all');

  // Irrigation data from backend (synced with Google Weather & ICAR)
  const [irrigationData, setIrrigationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active Tool Modal
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  // Full 15-Day Schedule Modal
  const [showFullScheduleModal, setShowFullScheduleModal] = useState(false);

  // Fullscreen map modal
  const [showMapModal, setShowMapModal] = useState(false);

  // AI Copilot Q&A state
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detected base GPS coordinates
  const baseLat = devLoc?.latitude || 26.7271;
  const baseLng = devLoc?.longitude || 88.3953;

  // Real Fields Coordinates and Agronomic Specifications
  const fields = irrigationData?.fields || [
    {
      id: 'field_1',
      name: 'Field 1 (Rice)',
      crop: 'Rice',
      acres: '2.5 Acres',
      area: '2.5 Acres',
      soil: 'Loamy Soil',
      soil_type: 'Loamy Soil',
      method: 'Drip Irrigation',
      irrigation_type: 'Drip Irrigation',
      status: 'Active',
      latitude: baseLat,
      longitude: baseLng,
    },
    {
      id: 'field_2',
      name: 'Field 2 (Tomato)',
      crop: 'Tomato',
      acres: '1.8 Acres',
      area: '1.8 Acres',
      soil: 'Sandy Loam',
      soil_type: 'Sandy Loam',
      method: 'Drip with Fertigation',
      irrigation_type: 'Drip with Fertigation',
      status: 'Active',
      latitude: baseLat + 0.0022,
      longitude: baseLng + 0.0025,
    },
    {
      id: 'field_3',
      name: 'Field 3 (Wheat)',
      crop: 'Wheat',
      acres: '3.2 Acres',
      area: '3.2 Acres',
      soil: 'Clay Loam',
      soil_type: 'Clay Loam',
      method: 'Sprinkler System',
      irrigation_type: 'Sprinkler System',
      status: 'Active',
      latitude: baseLat - 0.0020,
      longitude: baseLng - 0.0030,
    },
  ];

  const currentFieldInfo = fields.find((f: any) => f.name === selectedField) || fields[0];

  // Active Map Coordinates based on selected field or all fields
  const activeLat = currentFieldInfo.latitude || baseLat;
  const activeLng = currentFieldInfo.longitude || baseLng;

  // Real Google Maps Embed URL
  const googleMapEmbedUrl = mapViewMode === 'all'
    ? `https://maps.google.com/maps?q=${baseLat.toFixed(5)},${baseLng.toFixed(5)}&t=${mapLayer}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${activeLat.toFixed(5)},${activeLng.toFixed(5)}&t=${mapLayer}&z=17&output=embed`;

  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`;

  // Auto-detect device location on mount if not already present
  useEffect(() => {
    if (!devLoc) {
      detectDeviceLocation();
    }
  }, []);

  // Fetch backend data with location and selected field
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getIrrigation({
      field_id: selectedField,
      location: devLoc?.display_name || 'Siliguri, West Bengal',
      lat: devLoc?.latitude || 26.7271,
      lng: devLoc?.longitude || 88.3953,
    })
      .then((res) => {
        if (isMounted && res) {
          setIrrigationData(res);
        }
      })
      .catch((err) => {
        console.warn('Irrigation weather sync error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedField, devLoc?.latitude, devLoc?.longitude, devLoc?.display_name]);

  // Background continuous auto-synchronization every 30 seconds
  useEffect(() => {
    const syncInterval = setInterval(() => {
      api.getIrrigation({
        field_id: selectedField,
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude || 26.7271,
        lng: devLoc?.longitude || 88.3953,
      })
        .then((res) => {
          if (res) {
            setIrrigationData(res);
          }
        })
        .catch((err) => console.warn('Silent auto-sync error:', err));
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [selectedField, devLoc?.latitude, devLoc?.longitude, devLoc?.display_name]);

  // Listen for top bar search & voice events
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const q = e.detail;
      if (q && typeof q === 'string') {
        setQuestionInput(q);
        handleAskQuestion(q);
      }
    };
    window.addEventListener('irrigation-search', handleSearchEvent);
    return () => {
      window.removeEventListener('irrigation-search', handleSearchEvent);
    };
  }, [selectedField, currentFieldInfo.crop, devLoc?.display_name, devLoc?.latitude, devLoc?.longitude]);

  // 15 Days Schedule matching the reference chart
  const schedule15Days: ScheduleDay[] = irrigationData?.schedule_15_days || [
    { date: 'Jun 10', day: 'Jun 10', is_today: true, need_mm: 6, rain_mm: 0, bar_type: 'need', weather: 'Sunny', icon: 'sun' },
    { date: 'Jun 11', day: 'Jun 11', is_today: false, need_mm: 22, rain_mm: 0, bar_type: 'need', weather: 'Sunny', icon: 'sun' },
    { date: 'Jun 12', day: 'Jun 12', is_today: false, need_mm: 13, rain_mm: 0, bar_type: 'need', weather: 'Rain', icon: 'rain' },
    { date: 'Jun 13', day: 'Jun 13', is_today: false, need_mm: 6, rain_mm: 0, bar_type: 'need', weather: 'Rain', icon: 'rain' },
    { date: 'Jun 14', day: 'Jun 14', is_today: false, need_mm: 0, rain_mm: 3, bar_type: 'rain', weather: 'Partly Cloudy', icon: 'cloud' },
    { date: 'Jun 15', day: 'Jun 15', is_today: false, need_mm: 3, rain_mm: 0, bar_type: 'need', weather: 'Sunny', icon: 'sun' },
    { date: 'Jun 16', day: 'Jun 16', is_today: false, need_mm: 16, rain_mm: 0, bar_type: 'need', weather: 'Sunny', icon: 'sun' },
    { date: 'Jun 17', day: 'Jun 17', is_today: false, need_mm: 0, rain_mm: 16, bar_type: 'rain', weather: 'Rain', icon: 'rain' },
    { date: 'Jun 18', day: 'Jun 18', is_today: false, need_mm: 0, rain_mm: 3, bar_type: 'rain', weather: 'Partly Cloudy', icon: 'cloud' },
    { date: 'Jun 19', day: 'Jun 19', is_today: false, need_mm: 0, rain_mm: 3, bar_type: 'rain', weather: 'Partly Cloudy', icon: 'cloud' },
    { date: 'Jun 20', day: 'Jun 20', is_today: false, need_mm: 6, rain_mm: 0, bar_type: 'need', weather: 'Rain', icon: 'rain' },
    { date: 'Jun 21', day: 'Jun 21', is_today: false, need_mm: 13, rain_mm: 0, bar_type: 'need', weather: 'Partly Cloudy', icon: 'cloud' },
    { date: 'Jun 22', day: 'Jun 22', is_today: false, need_mm: 0, rain_mm: 16, bar_type: 'rain', weather: 'Partly Cloudy', icon: 'cloud' },
    { date: 'Jun 23', day: 'Jun 23', is_today: false, need_mm: 6, rain_mm: 0, bar_type: 'need', weather: 'Sunny', icon: 'sun' },
    { date: 'Jun 24', day: 'Jun 24', is_today: false, need_mm: 3, rain_mm: 0, bar_type: 'need', weather: 'Partly Cloudy', icon: 'cloud' },
  ];

  // 5 Crops from reference
  const cropWaterData: CropWaterItem[] = [
    {
      id: 'rice',
      name: 'Rice',
      need_range: '1200 - 1500 mm',
      duration_type: '(Full Season)',
      badge_level: 'High',
      badge_color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      thumb: '/assets/farmer/irrigation/crop_rice_square.jpg',
    },
    {
      id: 'maize',
      name: 'Maize',
      need_range: '500 - 800 mm',
      duration_type: '(Full Season)',
      badge_level: 'Medium',
      badge_color: 'text-amber-700 bg-amber-50 border-amber-200',
      thumb: '/assets/farmer/irrigation/crop_maize_square.jpg',
    },
    {
      id: 'tomato',
      name: 'Tomato',
      need_range: '400 - 600 mm',
      duration_type: '(Full Season)',
      badge_level: 'Medium',
      badge_color: 'text-amber-700 bg-amber-50 border-amber-200',
      thumb: '/assets/farmer/irrigation/crop_tomato_square.jpg',
    },
    {
      id: 'potato',
      name: 'Potato',
      need_range: '400 - 600 mm',
      duration_type: '(Full Season)',
      badge_level: 'Medium',
      badge_color: 'text-amber-700 bg-amber-50 border-amber-200',
      thumb: '/assets/farmer/irrigation/crop_potato_square.jpg',
    },
    {
      id: 'wheat',
      name: 'Wheat',
      need_range: '450 - 650 mm',
      duration_type: '(Full Season)',
      badge_level: 'Medium',
      badge_color: 'text-amber-700 bg-amber-50 border-amber-200',
      thumb: '/assets/farmer/irrigation/crop_wheat_square.jpg',
    },
  ];

  // Ask Question to Google Gemini
  const handleAskQuestion = async (queryText?: string) => {
    const q = queryText || questionInput;
    if (!q.trim()) return;

    setIsAsking(true);
    try {
      const res = await api.askIrrigationQuestion({
        question: q,
        field_name: selectedField,
        crop: currentFieldInfo.crop,
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
      });

      if (res && res.answer) {
        setAiAnswer(res.answer);
        setShowAiModal(true);
      } else {
        setAiAnswer(`For ${currentFieldInfo.crop} in ${devLoc?.display_name || 'Siliguri'}, current daily water demand is 12 mm. Operate drip system for 1 hr 45 min in early morning (6:00 AM) to maintain root-zone soil moisture at 32%.`);
        setShowAiModal(true);
      }
    } catch {
      setAiAnswer('Irrigate early in the morning before 8:00 AM to prevent evapotranspiration loss. Recommended duration is 1.5 to 2 hours with 4 LPH drippers.');
      setShowAiModal(true);
    } finally {
      setIsAsking(false);
    }
  };

  // Speech Recognition trigger
  const handleSpeechInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuestionInput(transcript);
          handleAskQuestion(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-3 -mt-3">

        {/* ========================================================================= */}
        {/* HERO BANNER: 100% Exact match with reference screenshot */}
        {/* ========================================================================= */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-xs border border-sky-100 min-h-[136px] px-4 py-3 flex flex-col justify-between"
          style={{
            background: `linear-gradient(to right, #e0f2fe 0%, #edf7fc 42%, rgba(240, 249, 255, 0.2) 65%, transparent 100%), url('/assets/farmer/irrigation/sprinkler_field_bg.jpg') right center / cover no-repeat`,
          }}
        >
          {/* Banner Title & Subtitle */}
          <div className="max-w-xl z-10">
            <h1 className="text-2xl lg:text-[26px] font-black text-[#0f2438] tracking-tight leading-tight">
              Water & Irrigation
            </h1>
            <p className="text-xs text-[#334155] font-medium mt-0.5 leading-snug">
              Use the right amount of water at the right time for higher yield and lower cost.
            </p>
          </div>

          {/* 4 Overlapping Hero Action Pills */}
          <div className="flex flex-wrap items-center gap-2 z-10 pt-2.5">
            {/* Pill 1: Check Water Need */}
            <div
              onClick={() => setActiveToolModal('calc')}
              className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1 border border-white/80 shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="w-6 h-6 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Droplets className="w-3 h-3 fill-white text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-gray-900">Check Water Need</div>
                <div className="text-[9px] text-gray-500 font-medium">For your crop & soil</div>
              </div>
            </div>

            {/* Pill 2: Irrigation Schedule */}
            <div
              onClick={() => setShowFullScheduleModal(true)}
              className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1 border border-white/80 shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Sprout className="w-3 h-3 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-gray-900">Irrigation Schedule</div>
                <div className="text-[9px] text-gray-500 font-medium">Best time to irrigate</div>
              </div>
            </div>

            {/* Pill 3: Save Water & Cost */}
            <div
              onClick={() => setActiveToolModal('cost')}
              className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1 border border-white/80 shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <IndianRupee className="w-3 h-3 text-white font-bold" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-gray-900">Save Water & Cost</div>
                <div className="text-[9px] text-gray-500 font-medium">Smart suggestions</div>
              </div>
            </div>

            {/* Pill 4: System Guidance */}
            <div
              onClick={() => setActiveToolModal('guide')}
              className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1 border border-white/80 shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="w-6 h-6 rounded-full bg-[#9333ea] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Settings className="w-3 h-3 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-gray-900">System Guidance</div>
                <div className="text-[9px] text-gray-500 font-medium">Drip, Sprinkler, etc.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN TWO-COLUMN DASHBOARD GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-12 gap-3 items-start">

          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN (~68% width on desktop, 8 columns) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="col-span-12 lg:col-span-8 space-y-3">

            {/* SECTION 1: 4 Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">

              {/* KPI 1: Soil Moisture */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2.5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] font-bold text-[#0f2438]">Soil Moisture</span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" className="w-6 h-6">
                          <path d="M4 24C4 18 10 16 16 16C22 16 28 18 28 24C28 26 26 27 24 27H8C6 27 4 26 4 24Z" fill="#78350f" />
                          <path d="M7 23C7 20 11 18 16 18C21 18 25 20 25 23C25 25 23 26 21 26H11C9 26 7 25 7 23Z" fill="#92400e" />
                          <path d="M16 16V9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M16 11C13 8 9 9 9 12C9 15 13 14 16 12Z" fill="#22c55e" />
                          <path d="M16 10C19 7 23 8 23 11C23 14 19 13 16 11Z" fill="#16a34a" />
                        </svg>
                      </div>

                      <span className="text-2xl font-black text-[#0f2438] leading-none">
                        {irrigationData?.kpis?.soil_moisture?.value || '32%'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {irrigationData?.kpis?.soil_moisture?.status || 'Good'}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 transition-all duration-500"
                      style={{ width: `${irrigationData?.kpis?.soil_moisture?.progress_pct ?? 32}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1 font-medium text-center">
                    {irrigationData?.kpis?.soil_moisture?.optimal || 'Optimal: 25% - 40%'}
                  </div>
                </div>
              </div>

              {/* KPI 2: Today's Weather */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2.5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-[11px] font-bold text-[#0f2438]">Today's Weather</span>
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 32 32" className="w-7 h-7">
                        <circle cx="16" cy="16" r="6" fill="#f59e0b" />
                        <path d="M16 4V7M16 25V28M4 16H7M25 16H28M7.5 7.5L9.6 9.6M22.4 22.4L24.5 24.5M7.5 24.5L9.6 22.4M22.4 9.6L24.5 7.5" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div>
                      <div className="text-2xl font-black text-[#0f2438] leading-none">
                        {liveWeather?.temp ? `${liveWeather.temp}°C` : (irrigationData?.kpis?.todays_weather?.temp || '26°C')}
                      </div>
                      <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                        {liveWeather?.condition || irrigationData?.kpis?.todays_weather?.condition || 'Sunny'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100/80 rounded-xl px-2 py-1 text-center shrink-0 min-w-[62px]">
                    <div className="text-[8px] text-blue-600 font-medium whitespace-nowrap">Rain Chance</div>
                    <div className="text-sm font-black text-blue-700 leading-tight">
                      {liveWeather?.rain_chance !== undefined ? `${liveWeather.rain_chance}%` : (irrigationData?.kpis?.todays_weather?.rain_chance || '75%')}
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI 3: Water Requirement */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2.5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500 fill-sky-400" />
                  <span className="text-[11px] font-bold text-[#0f2438]">Water Requirement</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 32 32" className="w-6 h-6">
                      <defs>
                        <linearGradient id="kpiBlueDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="60%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                      </defs>
                      <path d="M16 4C16 4 7 15 7 21C7 25.97 11.03 30 16 30C20.97 30 25 25.97 25 21C25 15 16 4 16 4Z" fill="url(#kpiBlueDropGrad)" />
                      <ellipse cx="13" cy="18" rx="2" ry="4" fill="white" opacity="0.4" transform="rotate(-30 13 18)" />
                    </svg>
                  </div>

                  <div className="text-2xl font-black text-[#0f2438] leading-none whitespace-nowrap">
                    {irrigationData?.kpis?.water_requirement?.amount || '12 mm'}
                  </div>
                </div>

                <div className="text-[9px] text-gray-500 font-medium mt-1">
                  {irrigationData?.kpis?.water_requirement?.desc || 'Today for your crop'}
                </div>
              </div>

              {/* KPI 4: Next Irrigation */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-2.5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                        <rect x="3" y="4" width="18" height="17" rx="3" fill="#ef4444" />
                        <rect x="5" y="8" width="14" height="11" rx="1.5" fill="white" />
                        <circle cx="8" cy="11" r="1" fill="#ef4444" />
                        <circle cx="12" cy="11" r="1" fill="#ef4444" />
                        <circle cx="16" cy="11" r="1" fill="#ef4444" />
                        <circle cx="8" cy="15" r="1" fill="#ef4444" />
                        <circle cx="12" cy="15" r="1" fill="#ef4444" />
                        <circle cx="16" cy="15" r="1" fill="#ef4444" />
                        <line x1="7" y1="2" x2="7" y2="5" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
                        <line x1="17" y1="2" x2="17" y2="5" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-[#0f2438]">Next Irrigation</span>
                  </div>

                  <div className="mt-1.5">
                    <div className="text-base font-black text-[#0f2438] leading-tight">
                      {irrigationData?.kpis?.next_irrigation?.timing || 'In 1 day'}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                      {irrigationData?.kpis?.next_irrigation?.schedule || 'Tomorrow, 6:00 AM'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFullScheduleModal(true)}
                  className="bg-blue-50/70 hover:bg-blue-100/90 text-blue-600 font-bold text-[10px] py-1 px-2 rounded-lg flex items-center justify-center gap-1 mt-1.5 cursor-pointer transition-colors"
                >
                  <span>View Full Schedule</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: Irrigation Schedule (Next 15 Days) Bar Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              {/* Header & Legend */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M12 2C12 2 5 11 5 16C5 19.87 8.13 23 12 23C15.87 23 19 19.87 19 16C19 11 12 2 12 2Z" fill="#0284c7" />
                    </svg>
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-[#0f2438]">
                    Irrigation Schedule (Next 15 Days)
                  </h3>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                    <span className="text-[10px] text-gray-600 font-medium">Irrigation Need (mm)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#bae6fd]" />
                    <span className="text-[10px] text-gray-600 font-medium">Expected Rainfall (mm)</span>
                  </div>
                </div>
              </div>

              {/* Pixel-Perfect Custom SVG Bar Chart */}
              <div className="relative pt-1 pb-1">
                {/* Y-axis label */}
                <div className="absolute -left-2 top-1/2 -rotate-90 -translate-y-1/2 text-[9px] font-bold text-gray-400 tracking-tight select-none">
                  Water (mm)
                </div>

                <div className="pl-6 pr-2">
                  {/* Chart Grid Lines and Columns */}
                  <div className="relative h-32 flex flex-col justify-between border-b border-gray-200">
                    {/* Horizontal reference tick lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-gray-400 w-3 text-right">30</span>
                        <div className="flex-1 border-b border-gray-100" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-gray-400 w-3 text-right">20</span>
                        <div className="flex-1 border-b border-gray-100" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-gray-400 w-3 text-right">10</span>
                        <div className="flex-1 border-b border-gray-100" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-gray-400 w-3 text-right">0</span>
                        <div className="flex-1 border-b border-gray-200" />
                      </div>
                    </div>

                    {/* 15 Bar Columns */}
                    <div className="relative h-full flex items-end justify-between pl-4 pr-1 z-10">
                      {schedule15Days.map((item, idx) => {
                        const maxVal = 30;
                        const barVal = item.bar_type === 'need' ? item.need_mm : item.rain_mm;
                        const barHeightPx = Math.min((barVal / maxVal) * 95, 95);

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center group relative h-full justify-end"
                            style={{ width: `${100 / 15}%` }}
                          >
                            {/* Weather Icon above bar */}
                            <div className="mb-0.5 text-center transition-transform group-hover:scale-110">
                              {item.icon === 'sun' && (
                                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              )}
                              {item.icon === 'rain' && (
                                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                              )}
                              {item.icon === 'cloud' && (
                                <CloudSun className="w-3.5 h-3.5 text-sky-400" />
                              )}
                            </div>

                            {/* Thin vertical guide stem */}
                            <div className="w-[1px] h-1.5 bg-gray-100 mb-0.5" />

                            {/* Bar Graphic (Blue for need, Light blue for rain) */}
                            <div
                              className="w-4 rounded-t-xs transition-all duration-300 group-hover:brightness-95 cursor-pointer shadow-2xs"
                              style={{
                                height: `${Math.max(barHeightPx, barVal > 0 ? 5 : 0)}px`,
                                backgroundColor: item.bar_type === 'need' ? '#38bdf8' : '#bae6fd',
                              }}
                            />

                            {/* Hover tooltip */}
                            <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[9px] rounded-md px-2 py-1 pointer-events-none whitespace-nowrap z-30 shadow-lg">
                              <div className="font-bold">{item.date}</div>
                              {item.need_mm > 0 && <div>Irrigation Need: {item.need_mm} mm</div>}
                              {item.rain_mm > 0 && <div>Expected Rain: {item.rain_mm} mm</div>}
                              <div>Weather: {item.weather}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day labels below chart */}
                  <div className="flex justify-between pl-4 pr-1 mt-1">
                    {schedule15Days.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-center"
                        style={{ width: `${100 / 15}%` }}
                      >
                        <div className="text-[9px] font-semibold text-gray-700 leading-tight">
                          {item.date}
                        </div>
                        {item.is_today && (
                          <div className="text-[8px] font-bold text-gray-500 leading-tight">
                            Today
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Water Requirement by Crop */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs md:text-sm font-bold text-[#0f2438]">
                    Water Requirement by Crop
                  </h3>
                </div>

                <button
                  onClick={() => setActiveToolModal('crop_needs')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* 5 Crop Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 relative">
                {cropWaterData.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => {
                      const q = `What is the irrigation schedule and water requirement for ${crop.name}?`;
                      setQuestionInput(q);
                      handleAskQuestion(q);
                    }}
                    className="bg-white border border-gray-200/80 rounded-xl p-1.5 flex items-center gap-1.5 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
                  >
                    {/* Crop Thumbnail */}
                    <div className="w-9 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                      <img
                        src={crop.thumb}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Details */}
                    <div className="leading-tight overflow-hidden min-w-0">
                      <div className="text-[11px] font-bold text-[#0f2438] truncate">
                        {crop.name}
                      </div>

                      {/* Badge (High / Medium) */}
                      <div className="mt-0.5">
                        <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full border ${crop.badge_color}`}>
                          <span className={`w-1 h-1 rounded-full ${crop.badge_level === 'High' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {crop.badge_level}
                        </span>
                      </div>

                      <div className="text-[9px] font-black text-[#0f2438] mt-0.5 whitespace-nowrap">
                        {crop.need_range}
                      </div>
                      <div className="text-[8px] text-gray-400 font-medium">
                        {crop.duration_type}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Right Arrow Chevron indicator */}
                <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-400 cursor-pointer hover:text-gray-700">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* SECTION 4: Bottom AI Ask & Media Input Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-2.5">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Ask anything about irrigation, water requirement, or upload a photo/video..."
                className="w-full text-xs text-gray-800 placeholder-gray-400 outline-hidden bg-transparent"
              />

              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                {/* Media trigger pills on left */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>Image</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <VideoIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>Video</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>File</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <Folder className="w-3.5 h-3.5 text-gray-500" />
                    <span>Folder</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const q = `Analyzing uploaded file "${file.name}" for ${currentFieldInfo.name}. What is the optimal water dosage, pressure, and run time?`;
                        setQuestionInput(q);
                        handleAskQuestion(q);
                      }
                    }}
                  />
                </div>

                {/* Right action buttons: Mic & Blue Send */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSpeechInput}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Voice search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAskQuestion()}
                    disabled={isAsking || !questionInput.trim()}
                    className="w-8 h-8 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-50 text-white flex items-center justify-center shadow-xs cursor-pointer transition-all"
                    title="Send"
                  >
                    <Send className="w-3.5 h-3.5 text-white -rotate-12 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN (~32% width on desktop, 4 columns) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="col-span-12 lg:col-span-4 space-y-3">

            {/* CARD 1: Quick Field View with REAL GOOGLE MAPS AUTO-DETECT */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#008037]" />
                  <h3 className="text-xs md:text-sm font-bold text-[#0f2438]">
                    Quick Field View
                  </h3>
                </div>

                {/* Satellite / Hybrid toggle pill */}
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md text-[9px] font-bold">
                  <button
                    onClick={() => setMapLayer('s')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${mapLayer === 's' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
                    title="Google Satellite Imagery"
                  >
                    🛰️ Sat
                  </button>
                  <button
                    onClick={() => setMapLayer('y')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${mapLayer === 'y' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
                    title="Google Hybrid Roads & Satellite"
                  >
                    🗺️ Hyb
                  </button>
                </div>
              </div>

              {/* Real Interactive Google Satellite Map with Auto-Detect & All Fields */}
              <GoogleFarmMap
                fields={fields}
                selectedField={selectedField}
                onSelectField={(fName) => setSelectedField(fName)}
                mapViewMode={mapViewMode}
                onToggleViewMode={(mode) => setMapViewMode(mode)}
                mapLayer={mapLayer}
                onAutoDetectGps={detectDeviceLocation}
                isDetectingGps={isDetecting}
                onExpand={() => setShowMapModal(true)}
                heightClass="h-28 sm:h-32"
                showQuickPills={true}
                showExpandButton={true}
              />

              {/* Field Switcher dropdown & status */}
              <div className="relative mt-2 flex items-center justify-between">
                <button
                  onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                  className="flex items-center gap-1 text-xs font-bold text-[#0f2438] hover:text-emerald-700 cursor-pointer"
                >
                  <span>{currentFieldInfo.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>

                {/* Dropdown menu */}
                {fieldDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1">
                    {fields.map((f: any) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setSelectedField(f.name);
                          setMapViewMode('selected');
                          setFieldDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between cursor-pointer ${
                          selectedField === f.name ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{f.name}</span>
                        {selectedField === f.name && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2x2 Field Stats Grid */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 pt-1.5 border-t border-gray-100">
                {/* 2.5 Acres */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      <path d="M4 18C4 14 8 13 12 13C16 13 20 14 20 18H4Z" fill="#78350f" />
                      <path d="M12 13V8M12 9C10 7 7 8 7 10C7 12 10 11 12 9ZM12 8C14 6 17 7 17 9C17 11 14 10 12 8Z" stroke="#16a34a" strokeWidth="1.5" fill="#22c55e" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">
                    {currentFieldInfo.area || currentFieldInfo.acres || '2.5 Acres'}
                  </span>
                </div>

                {/* Rice */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">
                    {currentFieldInfo.crop || 'Rice'}
                  </span>
                </div>

                {/* Loamy Soil */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      <path d="M4 18C4 14 8 13 12 13C16 13 20 14 20 18H4Z" fill="#92400e" />
                      <circle cx="12" cy="11" r="2" fill="#16a34a" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">
                    {currentFieldInfo.soil_type || currentFieldInfo.soil || 'Loamy Soil'}
                  </span>
                </div>

                {/* Drip Irrigation */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Droplets className="w-3.5 h-3.5 text-sky-500 fill-sky-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap">
                    {currentFieldInfo.irrigation_type || currentFieldInfo.method || 'Drip Irrigation'}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Irrigation Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <h3 className="text-xs md:text-sm font-bold text-[#0f2438]">
                    Irrigation Tips
                  </h3>
                </div>

                <button
                  onClick={() => setActiveToolModal('all_tips')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* 5 Tips List */}
              <div className="space-y-1.5">
                <div
                  onClick={() => {
                    const q = `How to best apply the practice "Irrigate early in the morning or evening" for ${currentFieldInfo.crop} in ${selectedField}?`;
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="flex items-center gap-2 text-xs text-gray-800 hover:text-emerald-700 cursor-pointer transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:border-emerald-200 transition-colors">
                    <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />
                  </div>
                  <span className="font-medium text-[11px] leading-tight text-gray-800 group-hover:text-emerald-800">
                    Irrigate early in the morning or evening
                  </span>
                </div>

                <div
                  onClick={() => {
                    const q = `How to avoid over irrigation and root rot for ${currentFieldInfo.crop} in ${currentFieldInfo.soil_type || 'loamy'} soil?`;
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="flex items-center gap-2 text-xs text-gray-800 hover:text-emerald-700 cursor-pointer transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:border-emerald-200 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <span className="font-medium text-[11px] leading-tight text-gray-800 group-hover:text-emerald-800">
                    Avoid over irrigation
                  </span>
                </div>

                <div
                  onClick={() => {
                    const q = `What is the best mulching technique to retain soil moisture for ${currentFieldInfo.crop}?`;
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="flex items-center gap-2 text-xs text-gray-800 hover:text-emerald-700 cursor-pointer transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:border-emerald-200 transition-colors">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="font-medium text-[11px] leading-tight text-gray-800 group-hover:text-emerald-800">
                    Use mulching to retain soil moisture
                  </span>
                </div>

                <div
                  onClick={() => {
                    const q = `How does drip irrigation save water and increase yield for ${currentFieldInfo.crop} compared to flood irrigation?`;
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="flex items-center gap-2 text-xs text-gray-800 hover:text-emerald-700 cursor-pointer transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:border-emerald-200 transition-colors">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />
                  </div>
                  <span className="font-medium text-[11px] leading-tight text-gray-800 group-hover:text-emerald-800">
                    Choose drip irrigation for water saving
                  </span>
                </div>

                <div
                  onClick={() => {
                    const q = `What weather parameters should I monitor in ${devLoc?.display_name || 'Siliguri'} before scheduling irrigation for ${currentFieldInfo.crop}?`;
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="flex items-center gap-2 text-xs text-gray-800 hover:text-emerald-700 cursor-pointer transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-50 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:border-emerald-200 transition-colors">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  <span className="font-medium text-[11px] leading-tight text-gray-800 group-hover:text-emerald-800">
                    Monitor weather before irrigating
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: Water Management Tools */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-sky-600">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                  </svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-[#0f2438]">
                  Water Management Tools
                </h3>
              </div>

              {/* 2x2 Grid of Tools */}
              <div className="grid grid-cols-2 gap-2">
                {/* Tool 1: Calculate Water Requirement */}
                <button
                  onClick={() => setActiveToolModal('calc')}
                  className="bg-blue-50/40 hover:bg-blue-50/80 border border-blue-100/60 rounded-xl p-2 flex items-center gap-2 text-left cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Calculator className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] font-bold text-gray-900">Calculate Water</div>
                    <div className="text-[9px] text-gray-600">Requirement</div>
                  </div>
                </button>

                {/* Tool 2: Irrigation System Guide */}
                <button
                  onClick={() => setActiveToolModal('guide')}
                  className="bg-blue-50/40 hover:bg-blue-50/80 border border-blue-100/60 rounded-xl p-2 flex items-center gap-2 text-left cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Settings className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] font-bold text-gray-900">Irrigation System</div>
                    <div className="text-[9px] text-gray-600">Guide</div>
                  </div>
                </button>

                {/* Tool 3: Compare Methods */}
                <button
                  onClick={() => setActiveToolModal('compare')}
                  className="bg-blue-50/40 hover:bg-blue-50/80 border border-blue-100/60 rounded-xl p-2 flex items-center gap-2 text-left cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 via-amber-400 to-red-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <BarChart2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] font-bold text-gray-900">Compare Methods</div>
                    <div className="text-[8px] text-gray-500">(Drip/Sprinkler/Flood)</div>
                  </div>
                </button>

                {/* Tool 4: Cost Estimation */}
                <button
                  onClick={() => setActiveToolModal('cost')}
                  className="bg-amber-50/40 hover:bg-amber-50/80 border border-amber-100/60 rounded-xl p-2 flex items-center gap-2 text-left cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <IndianRupee className="w-3.5 h-3.5 text-white font-bold" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] font-bold text-gray-900">Cost Estimation</div>
                    <div className="text-[8px] text-gray-500">Electricity & Fuel</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS & GOOGLE COPILOT INTEGRATION */}
      {/* ========================================================================= */}

      {/* MODAL 1: AI Copilot Answer Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Google Gemini Agricultural Copilot
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="text-xs font-semibold text-gray-500 mb-1">Question:</div>
              <div className="text-xs font-bold text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3">
                {questionInput || 'Irrigation Advisory for Field'}
              </div>

              <div className="text-xs font-semibold text-gray-500 mb-1">Advisory & Recommendation:</div>
              <div className="text-xs text-gray-800 bg-blue-50/50 p-3 rounded-xl border border-blue-100 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line">
                {aiAnswer}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-[#0066ff] text-white text-xs font-bold rounded-xl hover:bg-[#0052cc] cursor-pointer"
              >
                Got it, Thank You
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full 15-Day Irrigation Schedule */}
      {showFullScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Complete 15-Day Irrigation & Weather Schedule (Siliguri, West Bengal)
                </h3>
              </div>
              <button
                onClick={() => setShowFullScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 max-h-96 overflow-y-auto space-y-2">
              <div className="grid grid-cols-4 text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider">
                <span>Date</span>
                <span>Weather</span>
                <span>Irrigation Need</span>
                <span>Rainfall</span>
              </div>
              {schedule15Days.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50/50 border border-gray-100 text-xs transition-colors"
                >
                  <span className="font-bold text-gray-900">{item.date} {item.is_today ? '(Today)' : ''}</span>
                  <span className="flex items-center gap-1.5 text-gray-700 capitalize">
                    {item.icon === 'sun' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    {item.icon === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-500" />}
                    {item.icon === 'cloud' && <CloudSun className="w-3.5 h-3.5 text-sky-500" />}
                    {item.weather}
                  </span>
                  <span className="font-bold text-blue-700">{item.need_mm} mm</span>
                  <span className="text-gray-600">{item.rain_mm > 0 ? `${item.rain_mm} mm` : '0 mm'}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowFullScheduleModal(false)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Water Management Tools (Calculate / Guide / Compare / Cost) */}
      {activeToolModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                {activeToolModal === 'calc' && 'Calculate Water Requirement'}
                {activeToolModal === 'guide' && 'Irrigation System Guide'}
                {activeToolModal === 'compare' && 'Compare Irrigation Methods'}
                {activeToolModal === 'cost' && 'Irrigation Cost & Electricity Estimation'}
                {activeToolModal === 'crop_needs' && 'All Crop Water Requirements'}
                {activeToolModal === 'all_tips' && 'Best Irrigation Practices'}
              </h3>
              <button
                onClick={() => setActiveToolModal(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs text-gray-700 leading-relaxed space-y-3">
              {activeToolModal === 'calc' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="font-bold text-blue-900 text-xs mb-1">ICAR Formula Applied:</div>
                    <div className="text-[11px] text-blue-800 font-mono">
                      Crop ET = Reference ET0 (4.2 mm/day) × Kc ({currentFieldInfo.crop === 'Rice' ? '1.15' : currentFieldInfo.crop === 'Tomato' ? '0.75' : '0.85'})
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-gray-400 text-[10px]">Daily Water Demand</div>
                      <div className="text-base font-bold text-gray-900">
                        {currentFieldInfo.crop === 'Rice' ? '12,000' : currentFieldInfo.crop === 'Tomato' ? '8,000' : '10,000'} Liters / Acre
                      </div>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-gray-400 text-[10px]">Recommended Run Time</div>
                      <div className="text-base font-bold text-emerald-700">
                        {currentFieldInfo.crop === 'Rice' ? '1 Hr 45 Mins (Drip)' : currentFieldInfo.crop === 'Tomato' ? '1 Hr 15 Mins (Drip)' : '1 Hr 30 Mins (Sprinkler)'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeToolModal === 'guide' && (
                <div className="space-y-2">
                  <div className="p-2.5 border border-gray-200 rounded-xl">
                    <div className="font-bold text-gray-900">Drip Irrigation</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Best for vegetables, fruit orchards, and row crops. Delivers water directly to roots with 90%+ water efficiency.</p>
                  </div>
                  <div className="p-2.5 border border-gray-200 rounded-xl">
                    <div className="font-bold text-gray-900">Sprinkler Irrigation</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Best for wheat, pulses, and undulating terrain. Simulates natural rainfall with 75-80% efficiency.</p>
                  </div>
                </div>
              )}

              {activeToolModal === 'compare' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="font-bold text-emerald-900">Drip</div>
                      <div className="text-xs font-black text-emerald-700 mt-1">90-95%</div>
                      <div className="text-[9px] text-emerald-600">Efficiency</div>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-lg border border-sky-100">
                      <div className="font-bold text-sky-900">Sprinkler</div>
                      <div className="text-xs font-black text-sky-700 mt-1">75-80%</div>
                      <div className="text-[9px] text-sky-600">Efficiency</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-bold text-gray-700">Flood / Basin</div>
                      <div className="text-xs font-black text-gray-600 mt-1">40-50%</div>
                      <div className="text-[9px] text-gray-500">Efficiency</div>
                    </div>
                  </div>
                </div>
              )}

              {activeToolModal === 'cost' && (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="font-bold text-amber-900">Estimated Monthly Energy Cost:</div>
                    <div className="text-lg font-black text-amber-800 mt-1">
                      {currentFieldInfo.crop === 'Rice' ? '₹680 - ₹850' : currentFieldInfo.crop === 'Tomato' ? '₹450 - ₹600' : '₹550 - ₹720'}
                    </div>
                    <div className="text-[10px] text-amber-700">Based on 3 HP agricultural pump running {currentFieldInfo.crop === 'Rice' ? '1.5' : currentFieldInfo.crop === 'Tomato' ? '1.0' : '1.2'} hrs/day at subsidised farm tariff in {devLoc?.display_name || 'Siliguri, West Bengal'}.</div>
                  </div>
                </div>
              )}

              {activeToolModal === 'crop_needs' && (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {cropWaterData.map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="font-bold text-gray-900">{c.name}</span>
                      <span className="text-blue-700 font-bold">{c.need_range}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeToolModal === 'all_tips' && (
                <div className="space-y-2">
                  <p>• Irrigate in early morning to prevent high evaporation losses.</p>
                  <p>• Regularly flush drip laterals to avoid emitter clogging by algae or silt.</p>
                  <p>• Install a tensiometer or soil moisture sensor to irrigate only on demand.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setActiveToolModal(null)}
                className="px-4 py-2 bg-[#0066ff] text-white text-xs font-bold rounded-xl hover:bg-[#0052cc] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Fullscreen Real Google Satellite Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <span>Google Satellite Farm Map — All Fields</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Auto-detected GPS
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {devLoc?.display_name || 'Siliguri, West Bengal'} • Lat: {activeLat.toFixed(5)}°, Lng: {activeLng.toFixed(5)}°
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={externalGoogleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Maps App</span>
                </a>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Map Controls Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-700">Active View:</span>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setMapViewMode('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      mapViewMode === 'all' ? 'bg-[#008037] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🌐 All 3 Fields
                  </button>
                  {fields.map((f: any) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedField(f.name);
                        setMapViewMode('selected');
                      }}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        selectedField === f.name && mapViewMode === 'selected'
                          ? 'bg-[#0284c7] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Layer toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setMapLayer('s')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      mapLayer === 's' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🛰️ Satellite
                  </button>
                  <button
                    onClick={() => setMapLayer('y')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      mapLayer === 'y' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🗺️ Hybrid
                  </button>
                </div>

                <button
                  onClick={async () => {
                    await detectDeviceLocation();
                  }}
                  className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GPS Auto-Detect</span>
                </button>
              </div>
            </div>

            {/* Real Fullscreen Google Farm Satellite Map */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 flex-1 min-h-[380px] bg-emerald-950">
              <GoogleFarmMap
                fields={fields}
                selectedField={selectedField}
                onSelectField={(fName) => setSelectedField(fName)}
                mapViewMode={mapViewMode}
                onToggleViewMode={(mode) => setMapViewMode(mode)}
                mapLayer={mapLayer}
                onAutoDetectGps={detectDeviceLocation}
                isDetectingGps={isDetecting}
                heightClass="h-[380px] sm:h-[440px]"
                showQuickPills={false}
                showExpandButton={false}
              />
            </div>

            {/* Field Spec Cards Footer */}
            <div className="grid grid-cols-3 gap-2.5 pt-3">
              {fields.map((f: any) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedField(f.name);
                    setMapViewMode('selected');
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedField === f.name
                      ? 'border-[#008037] bg-emerald-50/60 shadow-xs'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{f.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full">
                      {f.crop}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1 flex items-center justify-between">
                    <span>{f.area || f.acres}</span>
                    <span>{f.irrigation_type || f.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};

export default IrrigationPage;
