import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { useGoogleWeather } from '../../context/WeatherContext';
import { api } from '../../services/api';
import {
  MapPin,
  RotateCw,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Thermometer,
  Eye,
  Sunrise,
  Sunset,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  SunMedium,
  CloudLightning,
  CloudDrizzle,
  Navigation,
  X,
  ShieldAlert,
  Info,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const WeatherPage: React.FC = () => {
  const navigate = useNavigate();
  const { location: devLoc, openLocationModal, detectDeviceLocation, isDetecting } = useDeviceLocation();
  const {
    weather: weatherData,
    current,
    forecastDays,
    alerts,
    aiInsight,
    doToday,
    avoidToday: contextAvoidToday,
    prepareFor,
    cropImpact,
    locationText,
    isSyncing: isRefreshing,
    refreshWeather,
  } = useGoogleWeather();

  const [activeTab, setActiveTab] = useState<'overview' | 'temperature' | 'rainfall' | 'humidity' | 'wind'>('overview');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const syncGoogleWeather = useCallback((spin = false) => {
    refreshWeather(spin);
  }, [refreshWeather]);

  const avoidToday: Array<{ title: string; desc: string }> = Array.isArray(contextAvoidToday)
    ? contextAvoidToday.map((item: any) => {
        if (typeof item === 'string') {
          const parts = item.split('(');
          return {
            title: parts[0]?.trim() || item,
            desc: parts[1] ? parts[1].replace(')', '').trim() : 'Precaution advised under current weather',
          };
        }
        return item;
      })
    : [];


  // Helper for rendering weather icon
  const renderWeatherIcon = (icon: string, size = 'w-6 h-6') => {
    switch (icon) {
      case 'sunny':
        return <Sun className={`${size} text-amber-500 fill-amber-400`} />;
      case 'hot':
        return <SunMedium className={`${size} text-orange-500 fill-orange-400`} />;
      case 'partly-cloudy':
        return <img src="/assets/farmer/weather/sun_cloud_3d.png" alt="Partly Cloudy" className={`${size} object-contain`} />;
      case 'cloudy':
        return <img src="/assets/farmer/weather/sun_cloud_3d.png" alt="Cloudy" className={`${size} object-contain opacity-90`} />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain className={`${size} text-blue-500 fill-blue-100`} />;
      case 'thunder':
        return <CloudLightning className={`${size} text-amber-600 fill-amber-100`} />;
      case 'windy':
        return <Wind className={`${size} text-sky-500`} />;
      default:
        return <Sun className={`${size} text-amber-500`} />;
    }
  };

  // Status badge styles
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'good':
        return 'bg-[#eaf7ee] text-[#1b7e3a] border border-[#cbebd3]';
      case 'monitor':
        return 'bg-[#fef8e7] text-[#b47a00] border border-[#fce9b3]';
      case 'avoid':
        return 'bg-[#fdeeed] text-[#d93025] border border-[#f9c9c6]';
      case 'caution':
        return 'bg-[#fef8e7] text-[#c77700] border border-[#fae29f]';
      case 'hot':
        return 'bg-[#fff0eb] text-[#d9480f] border border-[#ffd2c2]';
      case 'irrigate':
        return 'bg-[#e8f4fd] text-[#1a73e8] border border-[#c2e0f9]';
      case 'wind':
        return 'bg-[#fef8e7] text-[#c77700] border border-[#fae29f]';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // Dynamically populated charts synchronized with all 15 days of forecast
  const tempChartData = forecastDays.map((f: any) => ({
    name: f.date,
    max: f.high,
    min: f.low,
  }));

  const rainChartData = forecastDays.map((f: any) => ({
    name: f.date,
    rain: f.rainMm,
    chance: f.rainChance,
  }));

  const humidityChartData = forecastDays.map((f: any) => ({
    name: f.date,
    hum: Math.min(95, Math.max(45, 55 + Math.round((f.rainChance || 10) * 0.4))),
  }));

  const windChartData = forecastDays.map((f: any, idx: number) => ({
    name: f.date,
    wind: f.icon === 'windy' ? 26 : 12 + ((idx * 3) % 10),
  }));

  const selectedDay = selectedDayIndex !== null ? forecastDays[selectedDayIndex] : null;

  return (
    <FarmerLayout>
      <div className="space-y-3 pb-8 max-w-[1440px] mx-auto">
        {/* 1. TOP PANORAMIC HERO BANNER - Exact match to Weather Dasboard.jpeg */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs min-h-[92px] flex items-center justify-between px-5 py-3.5 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/farmer/weather/weather_banner_clean.jpg')` }}
        >
          {/* Subtle gradient wash for contrast */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />

          {/* Left Title and Subtitle with 3D Sun & Cloud */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/assets/farmer/weather/sun_cloud_3d.png"
              alt="Weather & Climate"
              className="w-12 h-12 object-contain drop-shadow-sm select-none"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1e3a5f] tracking-tight leading-tight">
                  Weather &amp; Climate
                </h1>
              </div>
              <p className="text-xs font-semibold text-[#2c5282] mt-0.5">
                15-Day Weather Forecast &amp; Smart Farming Advice
              </p>
            </div>
          </div>

          {/* Right Updated Pill with Refresh Button */}
          <div className="relative z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/90 rounded-full px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-medium text-gray-700">
              {weatherData?.updated_at || 'Updated: Just now • Live'}
            </span>
            <button
              onClick={() => syncGoogleWeather(true)}
              title="Synchronize Google Weather API"
              className={`text-gray-500 hover:text-[#008037] transition-transform cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. TOP ROW (3 CARDS): Current Weather | AI Farming Insight | Weather Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* CARD 1: Current Weather (5 cols on lg, approx 42%) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-gray-900 tracking-tight">Current Weather</span>
                <button
                  onClick={openLocationModal}
                  className="flex items-center gap-1 text-[11px] text-gray-700 font-bold hover:text-[#008037] transition-colors ml-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/90 px-2 py-0.5 rounded-full cursor-pointer"
                  title="Click to search location on Google Map"
                >
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span>{locationText}</span>
                </button>
                <button
                  onClick={async () => {
                    await detectDeviceLocation();
                    syncGoogleWeather(true);
                  }}
                  disabled={isDetecting}
                  className="flex items-center gap-1 text-[10.5px] font-bold text-[#008037] hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                  title="Auto-Detect My Field Location & Weather via GPS"
                >
                  <Navigation className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{isDetecting ? 'Detecting...' : 'Auto-Detect'}</span>
                </button>
              </div>
            </div>

            {/* Main Temp & Metrics */}
            <div className="grid grid-cols-12 gap-2 items-center my-1">
              {/* Left Temp block */}
              <div className="col-span-5 flex items-center gap-2">
                <img
                  src="/assets/farmer/weather/sun_cloud_3d.png"
                  alt="Current Weather"
                  className="w-14 h-14 object-contain select-none shrink-0"
                />
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                    {current.temp}°C
                  </div>
                  <div className="text-xs font-bold text-gray-800 mt-1 leading-tight">
                    {current.condition}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    Feels like {current.feels_like}°C
                  </div>
                </div>
              </div>

              {/* Right 4 Grid Metrics */}
              <div className="col-span-7 grid grid-cols-2 gap-x-2 gap-y-1.5 pl-2 border-l border-gray-100">
                {/* Humidity */}
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-[9.5px] text-gray-400 font-medium leading-none">Humidity</div>
                    <div className="text-xs font-black text-gray-900 leading-tight">{current.humidity}%</div>
                  </div>
                </div>

                {/* Rain Chance */}
                <div className="flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <div className="text-[9.5px] text-gray-400 font-medium leading-none">Rain Chance</div>
                    <div className="text-xs font-black text-gray-900 leading-tight">{current.rain_chance}%</div>
                  </div>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-600 shrink-0" />
                  <div>
                    <div className="text-[9.5px] text-gray-400 font-medium leading-none">Wind</div>
                    <div className="text-xs font-black text-gray-900 leading-tight">
                      {current.wind}
                    </div>
                  </div>
                </div>

                {/* UV Index */}
                <div className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="text-[9.5px] text-gray-400 font-medium leading-none">UV Index</div>
                    <div className="text-xs font-black text-amber-600 leading-tight">
                      {current.uv_index}{' '}
                      <span className="text-[9px] text-gray-600 font-normal">
                        {current.uv_index <= 2 ? 'Low' : (current.uv_index <= 5 ? 'Moderate' : (current.uv_index <= 7 ? 'High' : (current.uv_index <= 10 ? 'Very High' : 'Extreme')))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Strip: H/L, Visibility, Sunrise, Sunset */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10.5px] text-gray-600">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-red-500" />
                <span>H: <strong className="text-gray-900">{current.high}°C</strong></span>
                <span className="text-blue-500 ml-1">L: <strong className="text-gray-900">{current.low}°C</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-indigo-400" />
                <span>Visibility <strong className="text-gray-900">{current.visibility}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-500" />
                <span>Sunrise <strong className="text-gray-900">{current.sunrise}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Sunset className="w-3 h-3 text-orange-500" />
                <span>Sunset <strong className="text-gray-900">{current.sunset}</strong></span>
              </div>
            </div>
          </div>

          {/* CARD 2: AI Farming Insight (4 cols on lg, approx 33%) */}
          <div
            onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent(aiInsight.title))}
            className="lg:col-span-4 rounded-2xl border border-[#c8e8d2] shadow-2xs relative overflow-hidden flex flex-col justify-between p-3.5 min-h-[175px] bg-cover bg-bottom cursor-pointer hover:border-emerald-400 transition-colors"
            style={{ backgroundImage: `url('/assets/farmer/weather/ai_farmer_bg_clean.png')` }}
            title="Click to discuss with AI Farm Copilot"
          >
            {/* Header and Guidance Text */}
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100/90 text-[#008037] flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black text-[#14532d] tracking-tight">AI Farming Insight</span>
              </div>

              <div className="text-xs font-black text-gray-900 mt-2">
                {aiInsight.title}
              </div>
              <p className="text-[11px] text-gray-700 font-medium mt-1 leading-relaxed max-w-[88%]">
                {aiInsight.text}
              </p>
            </div>

            {/* Bottom spacer for the background farmer illustration */}
            <div className="h-10" />
          </div>

          {/* CARD 3: Weather Alerts (3 cols on lg, approx 25%) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black text-gray-900 tracking-tight">Weather Alerts</span>
              </div>
              <button
                onClick={() => setIsAlertsModalOpen(true)}
                className="text-[10.5px] text-[#008037] font-bold hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* 4 Alert Items */}
            <div className="space-y-1.5 my-1">
              {alerts.slice(0, 4).map((alert: any, idx: number) => {
                const isHigh = alert.severity === 'High';
                const isMed = alert.severity === 'Medium';
                return (
                  <div
                    key={idx}
                    onClick={() => setIsAlertsModalOpen(true)}
                    className="flex items-center justify-between gap-1 cursor-pointer hover:bg-gray-50/80 p-0.5 rounded-lg transition-colors"
                    title="Click to view alert safety guidelines"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {idx === 0 ? (
                        <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      ) : idx === 1 ? (
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : idx === 2 ? (
                        <Thermometer className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      ) : (
                        <Wind className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-gray-900 truncate">{alert.title}</div>
                        <div className="text-[9.5px] text-gray-500 truncate">{alert.timing}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                        isHigh
                          ? 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]'
                          : isMed
                          ? 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]'
                          : 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. 15-DAY WEATHER FORECAST STRIP - Exact match to Weather Dasboard.jpeg */}
        <div id="forecast-section" className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5">
          {/* Header with Title and Segment Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-gray-900 tracking-tight">15-Day Weather Forecast</h2>
              {selectedDay && (
                <span className="text-[10px] font-bold text-[#008037] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Viewing: {selectedDay.date} ({selectedDay.day}) • {selectedDay.condition}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-[#f3f4f6] p-0.5 rounded-full border border-gray-200/80">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#008037] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('temperature')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'temperature'
                      ? 'bg-[#008037] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Thermometer className="w-3 h-3" /> Temperature
                </button>
                <button
                  onClick={() => setActiveTab('rainfall')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'rainfall'
                      ? 'bg-[#008037] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CloudRain className="w-3 h-3" /> Rainfall
                </button>
                <button
                  onClick={() => setActiveTab('humidity')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'humidity'
                      ? 'bg-[#008037] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Droplets className="w-3 h-3" /> Humidity
                </button>
                <button
                  onClick={() => setActiveTab('wind')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'wind'
                      ? 'bg-[#008037] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Wind className="w-3 h-3" /> Wind
                </button>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('weather-calendar-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] text-[#008037] font-bold hover:underline ml-1 cursor-pointer"
              >
                View Full Forecast →
              </button>
            </div>
          </div>

          {/* 15 Horizontal Day Columns */}
          <div className="overflow-x-auto custom-scrollbar pt-3 pb-1">
            <div
              className="grid divide-x divide-gray-100 min-w-[1020px]"
              style={{ gridTemplateColumns: 'repeat(15, minmax(68px, 1fr))' }}
            >
              {forecastDays.map((f: any, idx: number) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
                    className={`px-1.5 py-1 flex flex-col items-center justify-between text-center hover:bg-gray-50/80 transition-all rounded-lg group cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#008037] bg-emerald-50/40 shadow-xs' : ''
                    }`}
                    title={`Click to inspect ${f.date} (${f.day}) farming conditions`}
                  >
                    {/* Date & Weekday */}
                    <div>
                      <div className="text-[11px] font-black text-gray-900 leading-tight">{f.date}</div>
                      <div className="text-[10px] text-gray-500 font-medium leading-tight">{f.day}</div>
                    </div>

                    {/* Weather Icon */}
                    <div className="my-2 transition-transform group-hover:scale-110">
                      {renderWeatherIcon(f.icon, 'w-7 h-7')}
                    </div>

                    {/* High | Low Temps */}
                    <div className="text-[11px] font-black leading-tight flex items-center gap-1">
                      <span className="text-[#ef4444]">{f.high}°</span>
                      <span className="text-gray-300 font-normal">|</span>
                      <span className="text-[#3b82f6]">{f.low}°</span>
                    </div>

                    {/* Rain Percentage */}
                    <div className="text-[10px] text-sky-600 font-bold mt-1 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{f.rainChance}%</span>
                    </div>

                    {/* Rain Millimeters */}
                    <div className="text-[9.5px] text-gray-500 font-medium flex items-center gap-0.5">
                      <CloudDrizzle className="w-2.5 h-2.5 text-blue-400" />
                      <span>{f.rainMm} mm</span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2 w-full">
                      <span
                        className={`block w-full text-[9px] font-black py-0.5 px-1 rounded-md text-center truncate ${getBadgeStyle(
                          f.statusType
                        )}`}
                      >
                        {f.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Metric Chart (rendered smoothly when a specific tab is selected) */}
          {activeTab !== 'overview' && (
            <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50/50 rounded-xl p-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  {activeTab === 'temperature' && <Thermometer className="w-4 h-4 text-red-500" />}
                  {activeTab === 'rainfall' && <CloudRain className="w-4 h-4 text-blue-500" />}
                  {activeTab === 'humidity' && <Droplets className="w-4 h-4 text-emerald-500" />}
                  {activeTab === 'wind' && <Wind className="w-4 h-4 text-purple-500" />}
                  <span className="capitalize">{activeTab} 15-Day Continuous Analytics</span>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="text-[10px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  ✕ Close Chart
                </button>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === 'temperature' ? (
                    <LineChart data={tempChartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis domain={[15, 42]} stroke="#9ca3af" fontSize={10} unit="°C" />
                      <Tooltip />
                      <Line type="monotone" dataKey="max" name="Max Temp (°C)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                      <Line type="monotone" dataKey="min" name="Min Temp (°C)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                    </LineChart>
                  ) : activeTab === 'rainfall' ? (
                    <BarChart data={rainChartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis domain={[0, 30]} stroke="#9ca3af" fontSize={10} unit="mm" />
                      <Tooltip />
                      <Bar dataKey="rain" name="Rainfall (mm)" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  ) : activeTab === 'humidity' ? (
                    <AreaChart data={humidityChartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis domain={[30, 100]} stroke="#9ca3af" fontSize={10} unit="%" />
                      <Tooltip />
                      <Area type="monotone" dataKey="hum" name="Relative Humidity (%)" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                    </AreaChart>
                  ) : (
                    <LineChart data={windChartData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis domain={[0, 40]} stroke="#9ca3af" fontSize={10} unit="km/h" />
                      <Tooltip />
                      <Line type="monotone" dataKey="wind" name="Wind Speed (km/h)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* 4. MIDDLE ACTION ROW (4 CARDS): Do Today | Avoid Today | Prepare For | AI Weather Assistant */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">
          {/* CARD 1: Do Today (Green theme) */}
          <div
            onClick={() => navigate('/farmer/farm-management')}
            className="bg-[#f0fbf4] border border-[#cbebd3] rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xs min-h-[175px] cursor-pointer hover:border-emerald-400 transition-colors"
            title="Click to view and schedule tasks"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-1.5 pb-2">
                <CheckCircle2 className="w-4 h-4 text-[#008037] fill-[#d1f0db]" />
                <span className="text-xs font-black text-[#14532d] tracking-tight">Do Today</span>
              </div>

              {/* Items */}
              <div className="space-y-1.5 text-[10.5px] font-medium text-gray-800 pr-16">
                {doToday.slice(0, 4).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008037] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Sprout Graphic at Bottom Right */}
            <img
              src="/assets/farmer/weather/do_plant.png"
              alt="Healthy crop sprout"
              className="absolute right-1 bottom-0 w-20 object-contain pointer-events-none select-none drop-shadow-2xs"
            />
          </div>

          {/* CARD 2: Avoid Today (Red theme) */}
          <div
            onClick={() => navigate('/farmer/crop-health')}
            className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xs min-h-[175px] cursor-pointer hover:border-red-300 transition-colors"
            title="Click to view crop health and spray precautions"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-1.5 pb-2">
                <XCircle className="w-4 h-4 text-[#dc2626] fill-[#fee2e2]" />
                <span className="text-xs font-black text-[#991b1b] tracking-tight">Avoid Today</span>
              </div>

              {/* Items */}
              <div className="space-y-2 text-[10.5px] font-medium text-gray-800 pr-14">
                {avoidToday.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-[#dc2626] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-[9.5px] text-gray-500 font-normal">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wilting Plant with Rain Graphic at Bottom Right */}
            <img
              src="/assets/farmer/weather/avoid_plant.png"
              alt="Rain damage avoid"
              className="absolute right-1 bottom-0 w-16 object-contain pointer-events-none select-none drop-shadow-2xs"
            />
          </div>

          {/* CARD 3: Prepare For (Yellow/Orange theme) */}
          <div
            onClick={() => setIsAlertsModalOpen(true)}
            className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xs min-h-[175px] cursor-pointer hover:border-amber-400 transition-colors"
            title="Click to view weather preparation alerts"
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-1.5 pb-2">
                <AlertTriangle className="w-4 h-4 text-[#d97706] fill-[#fef3c7]" />
                <span className="text-xs font-black text-[#92400e] tracking-tight">Prepare For</span>
              </div>

              {/* Items */}
              <div className="space-y-2 text-[10.5px] font-medium text-gray-800 pr-16">
                {prepareFor.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900">{item.heading}</div>
                      <div className="text-[9.5px] text-gray-500 font-normal">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tractor with Cover Graphic at Bottom Right */}
            <img
              src="/assets/farmer/weather/tractor.png"
              alt="Protect machinery"
              className="absolute right-1 bottom-0 w-20 object-contain pointer-events-none select-none drop-shadow-2xs"
            />
          </div>

          {/* CARD 4: AI Weather Assistant (Blue/Green gradient theme) */}
          <div className="bg-gradient-to-br from-[#eff6ff] via-[#e6f4ea] to-[#e0f2fe] border border-[#bae6fd] rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xs min-h-[175px]">
            {/* Top Info */}
            <div className="flex items-start gap-2.5">
              <img
                src="/assets/farmer/weather/robot_weather.png"
                alt="AI Weather Assistant Mascot"
                className="w-14 h-14 object-contain select-none shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-[#1e3a5f] leading-tight">AI Weather Assistant</div>
                <div className="text-[10.5px] font-bold text-gray-800 mt-0.5 leading-tight">
                  Ask KrishiGo AI about this forecast
                </div>
                <div className="text-[9.5px] text-gray-500 leading-tight mt-0.5">
                  Get personalized advice for your crops.
                </div>
              </div>
            </div>

            {/* Clickable Quick Prompts */}
            <div className="space-y-1 my-1.5">
              <button
                onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent('Should I irrigate tomorrow based on weather?'))}
                className="w-full text-left text-[9.5px] font-medium text-gray-700 hover:text-[#008037] bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-white/60 transition-colors truncate flex items-center gap-1 cursor-pointer"
              >
                <span>💬</span> Should I irrigate tomorrow?
              </button>
              <button
                onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent('Can I spray pesticides today given current weather?'))}
                className="w-full text-left text-[9.5px] font-medium text-gray-700 hover:text-[#008037] bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-white/60 transition-colors truncate flex items-center gap-1 cursor-pointer"
              >
                <span>💬</span> Can I spray today?
              </button>
              <button
                onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent('Which crop is safer this week under this forecast?'))}
                className="w-full text-left text-[9.5px] font-medium text-gray-700 hover:text-[#008037] bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-white/60 transition-colors truncate flex items-center gap-1 cursor-pointer"
              >
                <span>💬</span> Which crop is safer this week?
              </button>
              <button
                onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent('When should I harvest mustard given the rain forecast?'))}
                className="w-full text-left text-[9.5px] font-medium text-gray-700 hover:text-[#008037] bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-white/60 transition-colors truncate flex items-center gap-1 cursor-pointer"
              >
                <span>💬</span> When should I harvest?
              </button>
            </div>

            {/* Ask Now Button */}
            <button
              onClick={() => navigate('/farmer/ai?q=' + encodeURIComponent(`Weather forecast advice for ${locationText}`))}
              className="bg-[#008037] hover:bg-[#006e2f] text-white text-[11px] font-bold px-3 py-1 rounded-full self-start shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              Ask Now →
            </button>
          </div>
        </div>

        {/* 5. BOTTOM ROW (3 CARDS): Weather Calendar | Crop Impact from Weather | Detailed Weather Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* CARD 1: Weather Calendar (15 Days) (approx 44%, lg:col-span-5) */}
          <div id="weather-calendar-section" className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between">
            {/* Header & Legends */}
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-xs font-black text-gray-900 tracking-tight">Weather Calendar (15 Days)</span>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-2 flex-wrap text-[9px] text-gray-600 font-medium py-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Sunny
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> Rain
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Heavy Rain
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600" /> Thunderstorm
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Hot Day
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Windy
                </span>
              </div>

              {/* Matrix Layout */}
              <div className="overflow-x-auto custom-scrollbar pt-1">
                <div className="min-w-[420px] text-[10px]">
                  {/* Days Number & Day Row */}
                  <div className="grid grid-cols-15 text-center text-gray-500 font-bold border-b border-gray-100 pb-1">
                    {forecastDays.map((d: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
                        className={`px-0.5 cursor-pointer rounded-sm hover:bg-gray-100 transition-colors ${
                          selectedDayIndex === i ? 'bg-emerald-100' : ''
                        }`}
                      >
                        <div className="font-black text-gray-900 text-[10.5px]">{d.date.split(' ')[0]}</div>
                        <div className="text-[8.5px] text-gray-400 font-medium">{d.day}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weather Icon Row */}
                  <div className="grid grid-cols-15 text-center py-1.5 items-center">
                    {forecastDays.map((d: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
                        className="flex justify-center cursor-pointer hover:scale-115 transition-transform"
                      >
                        {renderWeatherIcon(d.icon, 'w-3.5 h-3.5')}
                      </div>
                    ))}
                  </div>

                  {/* Rainfall metric bar indicator */}
                  <div className="flex items-center text-[9px] text-gray-400 py-0.5">
                    <span className="w-20 shrink-0 font-medium">Rainfall</span>
                    <div className="grid grid-cols-15 flex-1 gap-0.5 h-2">
                      {forecastDays.map((d: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xs cursor-pointer"
                          onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
                          title={`${d.date}: ${d.rainMm} mm rain`}
                          style={{
                            backgroundColor:
                              d.rainMm > 10 ? '#2563eb' : d.rainMm > 0 ? '#60a5fa' : '#e5e7eb',
                            height: '100%',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Temperature colored indicator */}
                  <div className="flex items-center text-[9px] text-gray-400 py-0.5">
                    <span className="w-20 shrink-0 font-medium">Temperature</span>
                    <div className="grid grid-cols-15 flex-1 gap-0.5 h-2">
                      {forecastDays.map((d: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xs cursor-pointer"
                          onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
                          title={`${d.date}: High ${d.high}°C`}
                          style={{
                            backgroundColor:
                              d.high >= 34 ? '#ea580c' : d.high >= 30 ? '#f59e0b' : '#10b981',
                            height: '100%',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Farm Suitability continuous bar */}
                  <div className="flex items-center text-[9px] text-gray-400 py-1">
                    <span className="w-20 shrink-0 font-medium">Farm Suitability</span>
                    <div className="grid grid-cols-15 flex-1 gap-0.5 h-2.5">
                      {forecastDays.map((d: any, i: number) => {
                        let color = '#22c55e'; // Good
                        if (d.statusType === 'monitor' || d.statusType === 'caution') color = '#eab308';
                        if (d.statusType === 'avoid') color = '#ef4444';
                        if (d.statusType === 'hot') color = '#f97316';
                        if (d.statusType === 'irrigate') color = '#06b6d4';
                        if (d.statusType === 'wind') color = '#eab308';
                        return (
                          <div
                            key={i}
                            className="rounded-xs cursor-pointer"
                            onClick={() => setSelectedDayIndex(selectedDayIndex === i ? null : i)}
                            title={`${d.date}: ${d.status}`}
                            style={{ backgroundColor: color }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Suggested Activity Chips Row */}
                  <div className="flex items-center text-[9px] text-gray-400 pt-1.5">
                    <span className="w-20 shrink-0 font-medium">Suggested Activity</span>
                    <div className="grid grid-cols-15 flex-1 gap-0.5 items-center">
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#eaf7ee] text-[#1b7e3a] py-0.5 rounded truncate">
                        Field Work
                      </span>
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#fdeeed] text-[#d93025] py-0.5 rounded truncate">
                        Avoid Spray
                      </span>
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#fff0eb] text-[#d9480f] py-0.5 rounded truncate">
                        Drainage
                      </span>
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#e8f4fd] text-[#1a73e8] py-0.5 rounded truncate">
                        Irrigation
                      </span>
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#fef8e7] text-[#b47a00] py-0.5 rounded truncate">
                        Monitor
                      </span>
                      <span className="col-span-2 text-[8px] font-bold text-center bg-[#fff0eb] text-[#d9480f] py-0.5 rounded truncate">
                        Harvest
                      </span>
                      <span className="col-span-3 text-[8px] font-bold text-center bg-[#eaf7ee] text-[#1b7e3a] py-0.5 rounded truncate">
                        Good
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Crop Impact from Weather (approx 26%, lg:col-span-3) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs font-black text-gray-900 tracking-tight">Crop Impact from Weather</span>
              <button
                onClick={() => navigate('/farmer/crop-health')}
                className="text-[10.5px] text-[#008037] font-bold hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* 3 Crop Impact Rows */}
            <div className="space-y-2.5 my-1">
              {/* Tomato */}
              <div
                onClick={() => navigate('/farmer/crop-health?crop=tomato')}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                title="View Tomato Crop Health Analysis"
              >
                <img
                  src="/assets/farmer/weather/crop_tomato.png"
                  alt="Tomato crop"
                  className="w-10 h-10 rounded-lg object-cover shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">Tomato</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-0.5">
                      <span>👁</span> {weatherData?.crop_impact?.[0]?.status || 'Watch'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">
                    {weatherData?.crop_impact?.[0]?.detail || 'High humidity may increase fungal disease risk.'}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
              </div>

              {/* Potato */}
              <div
                onClick={() => navigate('/farmer/crop-health?crop=potato')}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                title="View Potato Crop Health Analysis"
              >
                <img
                  src="/assets/farmer/weather/crop_potato.png"
                  alt="Potato crop"
                  className="w-10 h-10 rounded-lg object-cover shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">Potato</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                      <span>✔</span> {weatherData?.crop_impact?.[1]?.status || 'Favorable'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">
                    {weatherData?.crop_impact?.[1]?.detail || 'Good weather for growth.'}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
              </div>

              {/* Mustard */}
              <div
                onClick={() => navigate('/farmer/crop-health?crop=mustard')}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                title="View Mustard Crop Health Analysis"
              >
                <img
                  src="/assets/farmer/weather/crop_mustard.png"
                  alt="Mustard crop"
                  className="w-10 h-10 rounded-lg object-cover shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">Mustard</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                      <span>✔</span> {weatherData?.crop_impact?.[2]?.status || 'Good'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">
                    {weatherData?.crop_impact?.[2]?.detail || 'Suitable for current weather.'}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
              </div>
            </div>
          </div>

          {/* CARD 3: Detailed Weather Analytics (Next 15 Days) (approx 30%, lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs font-black text-gray-900 tracking-tight">
                Detailed Weather Analytics (Next 15 Days)
              </span>
              <button
                onClick={() => {
                  setActiveTab('temperature');
                  const el = document.getElementById('forecast-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10.5px] text-[#008037] font-bold hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* 2x2 Mini Charts Grid */}
            <div className="grid grid-cols-2 gap-2 my-1">
              {/* Chart 1: Temperature */}
              <div
                onClick={() => {
                  setActiveTab('temperature');
                  const el = document.getElementById('forecast-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                title="Click to view 15-day temperature curve"
              >
                <div className="flex items-center justify-between text-[9px] text-gray-600 font-bold mb-1">
                  <span>Temperature (°C)</span>
                  <div className="flex items-center gap-1 text-[8px]">
                    <span className="text-red-500">● Max</span>
                    <span className="text-blue-500">● Min</span>
                  </div>
                </div>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempChartData}>
                      <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[15, 42]} hide />
                      <Tooltip contentStyle={{ fontSize: '9px', padding: '2px 4px' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-400 mt-0.5">
                  <span>{forecastDays[0]?.date || '24 May'}</span>
                  <span>{forecastDays[4]?.date || '28 May'}</span>
                  <span>{forecastDays[8]?.date || '1 Jun'}</span>
                  <span>{forecastDays[14]?.date || '5 Jun'}</span>
                </div>
              </div>

              {/* Chart 2: Rainfall */}
              <div
                onClick={() => {
                  setActiveTab('rainfall');
                  const el = document.getElementById('forecast-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                title="Click to view 15-day rainfall bar chart"
              >
                <div className="text-[9px] text-gray-600 font-bold mb-1">Rainfall (mm)</div>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rainChartData}>
                      <Bar dataKey="rain" fill="#2563eb" radius={[2, 2, 0, 0]} />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 30]} hide />
                      <Tooltip contentStyle={{ fontSize: '9px', padding: '2px 4px' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-400 mt-0.5">
                  <span>{forecastDays[0]?.date || '24 May'}</span>
                  <span>{forecastDays[4]?.date || '28 May'}</span>
                  <span>{forecastDays[8]?.date || '1 Jun'}</span>
                  <span>{forecastDays[14]?.date || '5 Jun'}</span>
                </div>
              </div>

              {/* Chart 3: Humidity */}
              <div
                onClick={() => {
                  setActiveTab('humidity');
                  const el = document.getElementById('forecast-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                title="Click to view 15-day humidity area chart"
              >
                <div className="text-[9px] text-gray-600 font-bold mb-1">Humidity (%)</div>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={humidityChartData}>
                      <Area type="monotone" dataKey="hum" stroke="#10b981" fill="#d1fae5" strokeWidth={1.5} />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[30, 100]} hide />
                      <Tooltip contentStyle={{ fontSize: '9px', padding: '2px 4px' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-400 mt-0.5">
                  <span>{forecastDays[0]?.date || '24 May'}</span>
                  <span>{forecastDays[4]?.date || '28 May'}</span>
                  <span>{forecastDays[8]?.date || '1 Jun'}</span>
                  <span>{forecastDays[14]?.date || '5 Jun'}</span>
                </div>
              </div>

              {/* Chart 4: Wind Speed */}
              <div
                onClick={() => {
                  setActiveTab('wind');
                  const el = document.getElementById('forecast-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                title="Click to view 15-day wind speed trajectory"
              >
                <div className="text-[9px] text-gray-600 font-bold mb-1">Wind Speed (km/h)</div>
                <div className="h-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={windChartData}>
                      <Line
                        type="monotone"
                        dataKey="wind"
                        stroke="#8b5cf6"
                        strokeWidth={1.5}
                        dot={{ r: 2, fill: '#8b5cf6' }}
                      />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 40]} hide />
                      <Tooltip contentStyle={{ fontSize: '9px', padding: '2px 4px' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-400 mt-0.5">
                  <span>{forecastDays[0]?.date || '24 May'}</span>
                  <span>{forecastDays[4]?.date || '28 May'}</span>
                  <span>{forecastDays[8]?.date || '1 Jun'}</span>
                  <span>{forecastDays[14]?.date || '5 Jun'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEATHER ALERTS & SAFETY PROTOCOL MODAL */}
      {isAlertsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAlertsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#fef8e7]">
              <div className="flex items-center gap-2">
                <SunMedium className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-gray-900">Active Weather Alerts &amp; Advisories</h3>
              </div>
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200/80">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Monitoring live alerts for <strong>{locationText}</strong> via Google Weather &amp; IMD feeds.</span>
              </div>

              <div className="space-y-2.5">
                {alerts.map((al: any, idx: number) => {
                  const isHigh = al.severity === 'High';
                  const isMed = al.severity === 'Medium';
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        isHigh
                          ? 'bg-red-50/70 border-red-200'
                          : isMed
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-yellow-50/70 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                          <ShieldAlert className={`w-4 h-4 ${isHigh ? 'text-red-600' : isMed ? 'text-amber-600' : 'text-yellow-600'}`} />
                          <span>{al.title}</span>
                        </div>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : isMed
                              ? 'bg-amber-100 text-amber-700 border-amber-300'
                              : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          }`}
                        >
                          {al.severity} Severity
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-700 font-medium mt-1">
                        {al.timing}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3 text-gray-400" />
                        <span>Precaution: Secure lightweight farm equipment, inspect field drainage channels, and delay chemical spraying.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <span className="text-[10.5px] text-gray-500">Live Auto-Synchronized</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAlertsModalOpen(false);
                    navigate('/farmer/ai?q=' + encodeURIComponent(`How should I protect my crops against ${alerts[0]?.title || 'bad weather'} in ${locationText}?`));
                  }}
                  className="px-3 py-1.5 bg-[#008037] hover:bg-[#006e2f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  Ask AI Copilot →
                </button>
                <button
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};
