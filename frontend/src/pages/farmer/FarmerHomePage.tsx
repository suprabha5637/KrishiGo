import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CloudSun,
  Bot,
  Mic,
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Video,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Sprout,
  Droplet,
  Send,
  Eye,
  CheckCircle2,
  Check,
  Play,
  Sun,
  X,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useDeviceLocation } from '../../context/LocationContext';
import { useGoogleWeather } from '../../context/WeatherContext';
import { MapContainer, TileLayer, Polygon, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const FarmerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: devLoc, isDetecting: isLocDetecting, openLocationModal, detectDeviceLocation } = useDeviceLocation();
  const { current: liveWeather, alerts: liveAlerts } = useGoogleWeather();
  const [copilotInput, setCopilotInput] = useState('');

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeCctvModal, setActiveCctvModal] = useState<any>(null);

  // Default tasks fallback matching screenshot
  const defaultActivities = [
    { id: 1, date: '25', month: 'May', title: 'Apply Urea in Wheat Field', sub: 'Tomorrow', icon: '/assets/farmer/dashboard/act_urea.png', is_completed: false },
    { id: 2, date: '27', month: 'May', title: 'Irrigate Potato Field', sub: 'In 2 Days', icon: '/assets/farmer/dashboard/act_water.png', is_completed: false },
    { id: 3, date: '30', month: 'May', title: 'Pesticide Spray (Tomato)', sub: 'In 5 Days', icon: '/assets/farmer/dashboard/act_spray.png', is_completed: false },
    { id: 4, date: '02', month: 'Jun', title: 'Harvest Mustard', sub: 'In 8 Days', icon: '/assets/farmer/dashboard/act_harvest.png', is_completed: false },
  ];
  const [activities, setActivities] = useState<any[]>(defaultActivities);

  // Auto-detect location on initial load if not yet detected
  useEffect(() => {
    if (!devLoc?.isAutoDetected && navigator.geolocation) {
      detectDeviceLocation().catch(() => {});
    }
  }, []);

  // Continuous Auto-Synchronization: fetches immediately and auto-syncs every 30 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async (silent = false) => {
      try {
        const res = await api.getFarmerDashboard({
          location: devLoc?.display_name,
          lat: devLoc?.latitude,
          lng: devLoc?.longitude,
        });
        if (isMounted && res) {
          setDashboardData(res);
          if (res.upcoming_activities?.length) {
            setActivities(res.upcoming_activities);
          }
        }
      } catch (err) {
        if (!silent) {
          console.warn('Dashboard live weather sync error:', err);
        }
      }
    };

    fetchDashboard(false);

    // Auto-sync polling every 30 seconds
    const syncTimer = setInterval(() => {
      fetchDashboard(true);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(syncTimer);
    };
  }, [devLoc?.latitude, devLoc?.longitude, devLoc?.display_name]);

  // Dynamic greeting based on time of day
  const getGreetingSalutation = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good Morning';
    if (hr >= 12 && hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.name && user.name !== 'User' ? user.name : (dashboardData?.hero?.user_name || 'Ramesh Kumar');
  const greetingText = dashboardData?.hero?.greeting || `${getGreetingSalutation()}, ${displayName}! 👋`;

  const heroWeather = dashboardData?.hero?.weather;
  const currentTemp = liveWeather?.temp ?? heroWeather?.temperature ?? 26;
  const currentCondition = liveWeather?.condition ?? heroWeather?.condition ?? 'Sunny';
  const currentHigh = liveWeather?.high ?? heroWeather?.high ?? 31;
  const currentLow = liveWeather?.low ?? heroWeather?.low ?? 25;
  const currentRainChance = liveWeather?.rain_chance ?? heroWeather?.rain_chance ?? 75;

  const topWeatherAlert = liveAlerts?.[0] || dashboardData?.alerts?.[0];
  const weatherAlertTitle = topWeatherAlert?.title ?? 'Moderate to heavy rain expected';
  const weatherAlertDesc = (topWeatherAlert as any)?.timing || ((topWeatherAlert as any)?.desc ?? 'Avoid spraying. Consider drainage.');

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    navigate(`/farmer/ai?q=${encodeURIComponent(copilotInput)}`);
  };

  const handleQuickQuestion = (q: string) => {
    navigate(`/farmer/ai?q=${encodeURIComponent(q)}`);
  };

  // Recharts profit trend data matching screenshot with dynamic backend binding
  const profitTrendData = dashboardData?.profit_trend?.trend_data?.length
    ? dashboardData.profit_trend.trend_data
    : [
      { month: 'Jan', profit: 24000 },
      { month: 'Feb', profit: 26500 },
      { month: 'Mar', profit: 28200 },
      { month: 'Apr', profit: 31000 },
      { month: 'May', profit: 34500 },
      { month: 'Jun', profit: 38450 },
    ];

  // Market prices matching screenshot with live backend binding
  const defaultMarketPrices = [
    { commodity: 'Tomato', price: '₹ 18.50', unit: '/kg', change: '↑ 5.2%', is_positive: true, icon: '/assets/farmer/dashboard/commodity_tomato.png', route: '/farmer/market-profit?crop=tomato' },
    { commodity: 'Potato', price: '₹ 16.20', unit: '/kg', change: '↑ 3.1%', is_positive: true, icon: '/assets/farmer/dashboard/commodity_potato.png', route: '/farmer/market-profit?crop=potato' },
    { commodity: 'Mustard', price: '₹ 48.30', unit: '/kg', change: '↑ 4.7%', is_positive: true, icon: '/assets/farmer/dashboard/commodity_mustard.png', route: '/farmer/market-profit?crop=mustard' },
    { commodity: 'Onion', price: '₹ 20.10', unit: '/kg', change: '↓ 1.3%', is_positive: false, icon: '/assets/farmer/dashboard/commodity_onion.png', route: '/farmer/market-profit?crop=onion' },
  ];

  const marketPrices = (dashboardData?.market_prices?.length)
    ? dashboardData.market_prices.map((m: any, idx: number) => ({
        commodity: m.commodity,
        price: m.price || defaultMarketPrices[idx]?.price || '₹ 20.00',
        unit: m.unit || '/kg',
        change: m.change || defaultMarketPrices[idx]?.change || '↑ 2.0%',
        is_positive: m.is_positive !== undefined ? m.is_positive : true,
        icon: defaultMarketPrices.find(d => d.commodity.toLowerCase() === m.commodity.toLowerCase())?.icon || defaultMarketPrices[idx]?.icon || '/assets/farmer/dashboard/commodity_tomato.png',
        route: `/farmer/market-profit?crop=${m.commodity.toLowerCase()}`
      }))
    : defaultMarketPrices;

  // Toggle task completion
  const handleToggleTask = async (e: React.MouseEvent, taskId: string | number) => {
    e.stopPropagation();
    setActivities(prev =>
      prev.map(t => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t))
    );
    try {
      await api.toggleTask(taskId);
    } catch (err) {
      console.warn('Failed to toggle task:', err);
    }
  };

  // Live CCTV camera feeds matching screenshot
  const cctvCameras = dashboardData?.field_monitoring || [
    {
      id: 'cam_1',
      name: 'Field Camera',
      status: 'Live',
      badge: 'Field 1',
      location: 'Field 1 - North Boundary',
      image: '/assets/farmer/dashboard/cctv_field_camera.jpg',
      resolution: '1080p FHD • 30fps'
    },
    {
      id: 'cam_2',
      name: 'Storage',
      status: 'Live',
      badge: 'Storage',
      location: 'Barn & Supply Storage',
      image: '/assets/farmer/dashboard/cctv_storage.jpg',
      resolution: '1080p FHD • 25fps'
    },
    {
      id: 'cam_3',
      name: 'Entrance',
      status: 'Live',
      badge: 'Main Gate',
      location: 'Main Gate & Access Road',
      image: '/assets/farmer/dashboard/cctv_entrance.jpg',
      resolution: '1080p FHD • 30fps'
    }
  ];

  return (
    <FarmerLayout>
      <div className="space-y-3.5">
        {/* TOP HERO BANNER - Exact match to Farmer Dasboard.jpeg */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xs border border-gray-200/90 min-h-[148px] p-4 lg:p-5 flex items-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.84) 38%, rgba(255, 255, 255, 0.12) 58%, rgba(255, 255, 255, 0) 100%), url('/assets/farmer/dashboard/hero_banner.jpg')`,
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            {/* Left: Greeting & Farm Specs */}
            <div className="space-y-1.5 max-w-xl">
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                {greetingText}
              </h1>
              <p className="text-xs font-semibold text-gray-600">
                Your farm is looking great. Let's make today productive.
              </p>

              {/* 4 Info Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Hero Current Location - Clickable to check all about location & Google Map pin */}
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-[11px] font-bold text-gray-700 hover:text-[#008037] shadow-2xs border border-gray-200/80 hover:border-emerald-400 transition-all cursor-pointer group"
                  title="Click to check all details about location, auto-detect, or mark on Google Map"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isLocDetecting ? 'text-amber-500 animate-pulse' : 'text-red-500 group-hover:scale-110 transition-transform'}`} />
                  <span>{isLocDetecting ? 'Locating...' : (devLoc?.display_name || dashboardData?.hero?.location || 'Siliguri, West Bengal')}</span>
                  <span className="text-[9.5px] font-bold text-[#008037] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 ml-0.5 group-hover:bg-emerald-100 flex items-center gap-1">
                    Check Location 📍
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/monitoring')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-[11px] font-bold text-gray-700 hover:text-green-800 shadow-2xs border border-gray-200/80 hover:border-green-300 transition-all cursor-pointer"
                  title="View Farm Overview & Acreage"
                >
                  <Layers className="w-3.5 h-3.5 text-green-600" />
                  {dashboardData?.hero?.total_area || '2.5 Acres'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/crop-planner')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-[11px] font-bold text-gray-700 hover:text-emerald-800 shadow-2xs border border-gray-200/80 hover:border-emerald-300 transition-all cursor-pointer"
                  title="View Active Crops & Planning"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  {dashboardData?.hero?.active_crops_count ? `${dashboardData.hero.active_crops_count} Active Crops` : '3 Active Crops'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/soil-field')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white backdrop-blur-md text-[11px] font-bold text-gray-700 hover:text-amber-800 shadow-2xs border border-gray-200/80 hover:border-amber-300 transition-all cursor-pointer"
                  title="View Soil Test & Field Health"
                >
                  <Droplet className="w-3.5 h-3.5 text-amber-700" />
                  {dashboardData?.hero?.soil_type || 'Soil: Loamy'}
                </button>
              </div>
            </div>

            {/* Right: Weather Card & Healthy Soil Banner */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Weather Widget Card */}
              <div
                onClick={() => navigate('/farmer/weather')}
                className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-xs hover:border-green-400 transition-all cursor-pointer min-w-[170px]"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/farmer/dashboard/hero_weather_sun.png"
                    alt={`${currentTemp}°C ${currentCondition}`}
                    className="w-10 h-10 object-contain shrink-0"
                  />
                  <div>
                    <div className="text-xl font-black text-gray-900 leading-none">{currentTemp}°C</div>
                    <div className="text-[11px] font-bold text-gray-600 mt-0.5">{currentCondition}</div>
                  </div>
                </div>
                <div className="mt-1.5 text-[10px] text-gray-500 font-medium border-t border-gray-100 pt-1 flex items-center justify-between">
                  <span>H: {currentHigh}°C L: {currentLow}°C</span>
                  <span>Rain chance: {currentRainChance}%</span>
                </div>
                <div className="mt-1 text-[10px] text-[#008037] font-bold flex items-center gap-0.5">
                  View Details →
                </div>
              </div>

              {/* Green Healthy Soil Card */}
              <div
                onClick={() => navigate('/farmer/soil-field')}
                className="hidden sm:flex flex-col justify-center bg-[#13783b] hover:bg-[#0f602f] text-white p-3.5 rounded-2xl shadow-xs text-xs font-black leading-tight border border-green-700 min-w-[130px] cursor-pointer transition-colors"
                title="View Soil Health & Field Tests"
              >
                <Sprout className="w-5 h-5 text-green-200 mb-1" />
                <span className="text-white text-[13px] font-black">Healthy Soil</span>
                <span className="text-green-100 text-[11px] font-bold">Healthy Crops</span>
                <span className="text-green-200 text-[10px] font-medium mt-0.5">Better Tomorrow</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 1: AI FARM COPILOT + TODAY'S ALERTS + MY FARM OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Card 1: KrishiGo AI Farm Copilot (~46% width -> 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-black text-gray-900">KrishiGo AI Farm Copilot</h2>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">Your 24/7 farming assistant. Ask anything about your farm.</p>
                  </div>
                </div>
              </div>

              {/* 3 Action Buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => navigate('/farmer/ai')}
                  className="py-1 px-3 bg-[#008037] hover:bg-[#00682e] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3 h-3" /> Chat
                </button>
                <button
                  onClick={() => navigate('/farmer/ai?voice=true')}
                  className="py-1 px-3 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5 border border-gray-200 shadow-2xs cursor-pointer transition-colors"
                >
                  <Mic className="w-3 h-3 text-emerald-700" /> Voice
                </button>
                <button
                  onClick={() => navigate('/farmer/crop-health')}
                  className="py-1 px-3 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5 border border-gray-200 shadow-2xs cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-3 h-3 text-emerald-700" /> Upload Photo
                </button>
              </div>

              {/* Input Bar */}
              <form onSubmit={handleCopilotSubmit} className="mt-2.5 relative max-w-md">
                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask about weather, crops, disease, market price, irrigation..."
                  className="w-full py-2 pl-3 pr-14 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-[#008037] focus:outline-hidden"
                />
                <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => navigate('/farmer/ai?voice=true')}
                    className="p-1 text-gray-400 hover:text-green-700 cursor-pointer"
                    title="Speak to Copilot"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="submit"
                    className="p-1.5 bg-[#008037] text-white rounded-full hover:bg-[#00682e] cursor-pointer flex items-center justify-center shadow-xs"
                    title="Send Question"
                  >
                    <Send className="w-2.5 h-2.5 rotate-45" />
                  </button>
                </div>
              </form>

              {/* 6 Quick Questions Pills */}
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 max-w-md">
                {[
                  'What should I do today?',
                  'Will it rain tomorrow?',
                  'Check crop health',
                  'Market price for tomato',
                  'Can I grow kiwi?',
                  'Irrigation advice',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-2.5 py-1 bg-[#f0fbf3] hover:bg-emerald-100 text-gray-800 hover:text-green-900 text-[10px] font-semibold rounded-lg border border-emerald-200/60 transition-colors cursor-pointer text-left truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Mascot Illustration - Exact match to Farmer Dasboard.jpeg */}
            <div
              onClick={() => navigate('/farmer/ai')}
              className="absolute right-2 bottom-1 hidden sm:flex flex-col items-center cursor-pointer group"
              title="Click to launch AI Farm Copilot"
            >
              <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-xs border border-gray-200 text-[9px] font-bold text-gray-800 mb-1 leading-tight text-center group-hover:border-emerald-400 transition-colors">
                How can<br />I help you<br />today?
              </div>
              <img
                src="/assets/farmer/dashboard/ai_copilot_robot.png"
                alt="Robot Assistant"
                className="w-28 h-28 object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Card 2: Today's Farm Alerts (~32% width -> 3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <span className="text-amber-500">🔔</span>
                  <span>Today's Farm Alerts</span>
                </div>
                <button
                  onClick={() => navigate('/farmer/weather')}
                  className="text-[11px] font-bold text-[#008037] hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* 4 Alerts with exact screenshot icons & real data */}
              <div className="mt-2 space-y-2 text-xs">
                {/* Alert 1: Weather */}
                <div
                  onClick={() => navigate('/farmer/weather')}
                  className="flex items-center justify-between gap-2 p-1.5 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src="/assets/farmer/dashboard/alert_rain.png" alt="Rain" className="w-6 h-6 object-contain shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900 leading-tight">{weatherAlertTitle}</div>
                      <div className="text-[9px] text-gray-500">{weatherAlertDesc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                {/* Alert 2: Pest */}
                <div
                  onClick={() => navigate('/farmer/crop-health')}
                  className="flex items-center justify-between gap-2 p-1.5 hover:bg-red-50/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src="/assets/farmer/dashboard/alert_bug.png" alt="Pest" className="w-6 h-6 object-contain shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900 leading-tight">{dashboardData?.alerts?.[1]?.title || 'High pest risk in Tomato'}</div>
                      <div className="text-[9px] text-gray-500">{dashboardData?.alerts?.[1]?.desc || 'Inspect leaves for early signs.'}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                {/* Alert 3: Irrigation */}
                <div
                  onClick={() => navigate('/farmer/irrigation')}
                  className="flex items-center justify-between gap-2 p-1.5 hover:bg-cyan-50/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src="/assets/farmer/dashboard/alert_water.png" alt="Water" className="w-6 h-6 object-contain shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900 leading-tight">{dashboardData?.alerts?.[2]?.title || 'Irrigation needed in Field 2'}</div>
                      <div className="text-[9px] text-gray-500">{dashboardData?.alerts?.[2]?.desc || 'Soil moisture is below optimal level.'}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                {/* Alert 4: Market */}
                <div
                  onClick={() => navigate('/farmer/market-profit')}
                  className="flex items-center justify-between gap-2 p-1.5 hover:bg-green-50/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src="/assets/farmer/dashboard/alert_trend.png" alt="Market" className="w-6 h-6 object-contain shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-900 leading-tight">{dashboardData?.alerts?.[3]?.title || 'Tomato market price increased'}</div>
                      <div className="text-[9px] text-gray-500">{dashboardData?.alerts?.[3]?.desc || 'Current price is 18% higher than last week.'}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: My Farm Overview (~22% width -> 3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <h3 className="text-xs font-black text-gray-900">My Farm Overview</h3>
                <button
                  onClick={() => navigate('/farmer/monitoring')}
                  className="text-[11px] font-bold text-[#008037] hover:underline cursor-pointer"
                >
                  View Farm →
                </button>
              </div>

              {/* Live Google Map synchronized with auto-detected location */}
              <div
                className="mt-2 relative h-32 rounded-xl overflow-hidden border border-gray-200 shadow-2xs group bg-gray-100 flex items-center justify-center"
                title="Open Farm Satellite Map & Monitoring"
              >
                <MapContainer
                  center={[devLoc?.latitude || 26.7271, devLoc?.longitude || 88.3953]}
                  zoom={16}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    maxZoom={20}
                  />
                  <FarmBoundaries center={{ lat: devLoc?.latitude || 26.7271, lng: devLoc?.longitude || 88.3953 }} />
                </MapContainer>
                
                {/* Optional overlay navigation */}
                <div 
                  className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-white cursor-pointer hover:bg-black/80 transition-colors z-10"
                  onClick={() => navigate('/farmer/monitoring')}
                >
                  Expand Map ↗
                </div>
              </div>
            </div>

            {/* Farm Stats footer */}
            <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-1 text-center text-xs">
              <div
                onClick={() => navigate('/farmer/monitoring')}
                className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors"
              >
                <div className="text-[9px] text-gray-500 flex items-center justify-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" />
                  <span>Total Area</span>
                </div>
                <div className="text-[11px] font-black text-gray-900 mt-0.5">
                  {dashboardData?.farm_overview?.total_area || dashboardData?.hero?.total_area || '2.5 Acres'}
                </div>
              </div>
              <div
                onClick={() => navigate('/farmer/crop-planner')}
                className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors"
              >
                <div className="text-[9px] text-gray-500 flex items-center justify-center gap-1">
                  <Layers className="w-3 h-3 text-green-600" />
                  <span>Active Crops</span>
                </div>
                <div className="text-[11px] font-black text-gray-900 mt-0.5">
                  {dashboardData?.farm_overview?.active_crops || dashboardData?.hero?.active_crops_count || 3}
                </div>
              </div>
              <div
                onClick={() => navigate('/farmer/soil-field')}
                className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors"
              >
                <div className="text-[9px] text-gray-500 flex items-center justify-center gap-1">
                  <Droplet className="w-3 h-3 text-amber-700" />
                  <span>Soil Type</span>
                </div>
                <div className="text-[11px] font-black text-gray-900 mt-0.5">
                  {dashboardData?.farm_overview?.soil_type || 'Loamy'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN SPLIT: LEFT (10 Facilities + Bottom 3 Cards) & RIGHT (Upcoming + Smarter Farms) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
          {/* LEFT 9 COLS (~76% width): 10 FACILITIES + BOTTOM 3 CARDS */}
          <div className="xl:col-span-9 space-y-3.5">
            {/* 10 FEATURE CARDS (2 ROWS OF 5) - Exact Match with centered 3D illustrations */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                {
                  id: 1,
                  title: 'AI Farm Copilot',
                  line1: 'Chat, Voice, Image',
                  line2: 'Get instant advice',
                  route: '/farmer/ai',
                  img: '/assets/farmer/dashboard/icon_facility_1_robot.png',
                  bg: 'bg-[#ebf8ee]',
                  border: 'border-[#bde6c7]',
                  btn: 'bg-[#008037]',
                },
                {
                  id: 2,
                  title: 'Weather & Climate',
                  line1: 'Forecast, Alerts',
                  line2: 'Farming Recommendations',
                  route: '/farmer/weather',
                  img: '/assets/farmer/dashboard/icon_facility_2_sun_cloud.png',
                  bg: 'bg-[#f0f7ff]',
                  border: 'border-[#bae6fd]',
                  btn: 'bg-[#0284c7]',
                },
                {
                  id: 3,
                  title: 'Crop Planner',
                  line1: 'Best Crop, Calendar',
                  line2: 'Yield & Profit',
                  route: '/farmer/crop-planner',
                  img: '/assets/farmer/dashboard/icon_facility_3_sprout.png',
                  bg: 'bg-[#f0fbf3]',
                  border: 'border-[#bbf0cb]',
                  btn: 'bg-[#008037]',
                },
                {
                  id: 4,
                  title: 'Crop Health & Disease',
                  line1: 'Scan & Detect',
                  line2: 'Pest, Disease, Nutrient',
                  route: '/farmer/crop-health',
                  img: '/assets/farmer/dashboard/icon_facility_4_leaf_magnifier.png',
                  bg: 'bg-[#fff4f2]',
                  border: 'border-[#fecdd3]',
                  btn: 'bg-[#e23744]',
                },
                {
                  id: 5,
                  title: 'Soil & Field',
                  line1: 'Soil Test, Field Map',
                  line2: 'Soil Health Score',
                  route: '/farmer/soil-field',
                  img: '/assets/farmer/dashboard/icon_facility_5_soil_plant.png',
                  bg: 'bg-[#fbf7f0]',
                  border: 'border-[#fed7aa]',
                  btn: 'bg-[#965727]',
                },
                {
                  id: 6,
                  title: 'Water & Irrigation',
                  line1: 'Smart Irrigation',
                  line2: 'Save Water, Grow More',
                  route: '/farmer/irrigation',
                  img: '/assets/farmer/dashboard/icon_facility_6_water_drop.png',
                  bg: 'bg-[#f0f9ff]',
                  border: 'border-[#bae6fd]',
                  btn: 'bg-[#0284c7]',
                },
                {
                  id: 7,
                  title: 'Farm Management',
                  line1: 'Tasks, Calendar',
                  line2: 'Track All Activities',
                  route: '/farmer/farm-management',
                  img: '/assets/farmer/dashboard/icon_facility_7_calendar.png',
                  bg: 'bg-[#f7f0fc]',
                  border: 'border-[#e9d5ff]',
                  btn: 'bg-[#7a3ea2]',
                },
                {
                  id: 8,
                  title: 'Market Price & Profit',
                  line1: 'Price Checker, Predictor',
                  line2: 'Suggested Selling Price',
                  route: '/farmer/market-profit',
                  img: '/assets/farmer/dashboard/icon_facility_8_rupee_chart.png',
                  bg: 'bg-[#fffbf0]',
                  border: 'border-[#fef08a]',
                  btn: 'bg-[#e67e22]',
                },
                {
                  id: 9,
                  title: 'Farm Monitoring',
                  line1: 'Smart CCTV, Live View',
                  line2: 'AI Alerts, Field Monitoring',
                  route: '/farmer/monitoring',
                  img: '/assets/farmer/dashboard/icon_facility_9_cctv.png',
                  bg: 'bg-[#f0f8fb]',
                  border: 'border-[#bae6fd]',
                  btn: 'bg-[#0284c7]',
                },
                {
                  id: 10,
                  title: 'Farm Services',
                  line1: 'Schemes, Experts',
                  line2: 'Machinery, Support',
                  route: '/farmer/services',
                  img: '/assets/farmer/dashboard/icon_facility_10_handshake.png',
                  bg: 'bg-[#f0fbf5]',
                  border: 'border-[#a7f3d0]',
                  btn: 'bg-[#059669]',
                },
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className={`${card.bg} rounded-xl border ${card.border} p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all hover:scale-101 cursor-pointer group`}
                >
                  <div>
                    {/* Header: ID + Title */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-gray-500">{card.id}.</span>
                      <h3 className="text-[11px] font-black text-gray-900 leading-tight truncate">{card.title}</h3>
                    </div>

                    {/* Centered 3D Image Illustration */}
                    <div className="h-12 flex items-center justify-center my-1.5">
                      <img
                        src={card.img}
                        alt={card.title}
                        className="max-h-12 w-auto object-contain transition-transform group-hover:scale-108"
                      />
                    </div>

                    {/* Two-line descriptions */}
                    <div className="text-center">
                      <div className="text-[9.5px] font-bold text-gray-800 leading-tight truncate">
                        {card.line1}
                      </div>
                      <div className="text-[8.5px] text-gray-500 leading-tight mt-0.5 truncate">
                        {card.line2}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.route);
                    }}
                    className={`w-full mt-2 py-1 px-2 ${card.btn} text-white text-[10px] font-bold rounded-lg shadow-2xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer`}
                  >
                    Open →
                  </button>
                </div>
              ))}
            </div>

            {/* BOTTOM 3 CARDS ROW (Market Prices, Farm Profit Trend, Field Monitoring CCTV) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Card 1: Market Prices (Nearby) */}
              <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <h3 className="text-xs font-black text-gray-900">Market Prices (Nearby)</h3>
                    <button
                      onClick={() => navigate('/farmer/market-profit')}
                      className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                    {marketPrices.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => navigate(m.route)}
                        className="cursor-pointer hover:bg-gray-50/80 rounded-xl p-1 transition-all group"
                        title={`View ${m.commodity} Market Analytics`}
                      >
                        <img
                          src={m.icon}
                          alt={m.commodity}
                          className="w-7 h-7 mx-auto rounded-full object-cover shadow-2xs group-hover:scale-108 transition-transform"
                        />
                        <div className="text-[9px] font-bold text-gray-700 mt-1">{m.commodity}</div>
                        <div className="text-[10px] font-black text-gray-900 leading-tight">
                          {m.price} <span className="text-[8px] font-normal text-gray-500">{m.unit}</span>
                        </div>
                        <div className={`text-[8px] font-bold ${m.is_positive ? 'text-green-600' : 'text-red-500'}`}>
                          {m.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Farm Profit Trend (Est.) */}
              <div
                onClick={() => navigate('/farmer/market-profit')}
                className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-green-300 transition-colors"
                title="View Full Profit & Revenue Analytics"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-900">Farm Profit Trend (Est.)</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/farmer/farm-management');
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-green-700 cursor-pointer flex items-center gap-0.5"
                    >
                      <span>This Month</span>
                      <span className="text-[8px]">˅</span>
                    </button>
                  </div>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-black text-gray-900">
                      {dashboardData?.profit_trend?.current_month_profit || '₹ 38,450'}
                    </span>
                    <span className="text-[10px] font-bold text-green-600">
                      {dashboardData?.profit_trend?.growth || '↑ 12% from last month'}
                    </span>
                  </div>

                  <div className="h-16 mt-1 -ml-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={profitTrendData}>
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#008037"
                          strokeWidth={2}
                          dot={{ r: 2.5, fill: '#008037' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Card 3: Field Monitoring (CCTV) */}
              <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <h3 className="text-xs font-black text-gray-900">Field Monitoring (CCTV)</h3>
                    <button
                      onClick={() => navigate('/farmer/monitoring')}
                      className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {cctvCameras.map((cam: any) => (
                      <div
                        key={cam.id}
                        onClick={() => setActiveCctvModal(cam)}
                        className="relative rounded-lg overflow-hidden aspect-video bg-black/90 flex flex-col justify-between p-1 cursor-pointer group shadow-2xs hover:ring-2 hover:ring-emerald-500 transition-all"
                        title={`Click to preview ${cam.name} live`}
                      >
                        <img
                          src={cam.image}
                          alt={cam.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                        />
                        <div className="relative z-10 flex items-center justify-center h-full">
                          <Play className="w-3.5 h-3.5 text-white/90 fill-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="relative z-10 text-[8px] font-bold text-white leading-none truncate">
                          {cam.name}
                        </div>
                        <div className="relative z-10 text-[7px] text-green-400 font-bold leading-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 3 COLS (~24% width): UPCOMING ACTIVITIES + SMARTER FARMS BANNER */}
          <div className="xl:col-span-3 space-y-3.5">
            {/* UPCOMING ACTIVITIES CARD */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <h3 className="text-xs font-black text-gray-900">Upcoming Activities</h3>
                <button
                  onClick={() => navigate('/farmer/farm-management')}
                  className="text-[10px] font-bold text-[#008037] hover:underline cursor-pointer"
                >
                  View Calendar →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => navigate('/farmer/farm-management')}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                      act.is_completed ? 'bg-emerald-50/50 border-emerald-200/50 opacity-80' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 text-center shrink-0">
                        <div className="text-xs font-black text-gray-900 leading-none">{act.date}</div>
                        <div className="text-[9px] text-gray-400 font-semibold uppercase leading-none mt-0.5">
                          {act.month}
                        </div>
                      </div>
                      <img src={act.icon} alt={act.title} className="w-5 h-5 object-contain shrink-0" />
                      <div className="min-w-0">
                        <div className={`text-[11px] font-bold leading-tight truncate ${act.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {act.title}
                        </div>
                        <div className="text-[9px] text-gray-400 font-medium leading-tight">{act.sub}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleTask(e, act.id)}
                        className={`p-1 rounded-full hover:bg-gray-200/60 transition-colors ${
                          act.is_completed ? 'text-emerald-600' : 'text-gray-300 hover:text-emerald-500'
                        }`}
                        title={act.is_completed ? 'Completed (Click to uncheck)' : 'Mark task complete'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMARTER FARMS / SAFER FARMS BANNER */}
            <div className="bg-[#092e19] text-white rounded-2xl p-4 shadow-xs relative overflow-hidden space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-black text-white leading-tight">Smarter Farms</h3>
                  <h3 className="text-xs font-black text-white leading-tight">Safer Farms</h3>
                </div>
                {/* 3D CCTV camera graphic */}
                <div className="w-14 h-11 shrink-0 flex items-center justify-end">
                  <img
                    src="/assets/farmer/dashboard/smarter_farms_cctv.png"
                    alt="Smarter Farms CCTV"
                    className="w-12 h-auto object-contain"
                  />
                </div>
              </div>

              {/* 4 Checkmark bullets (2 cols) */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold text-green-100">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-400 shrink-0" />
                  <span>Live CCTV</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-400 shrink-0" />
                  <span>Intrusion Alerts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-400 shrink-0" />
                  <span>Animal Detection</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-400 shrink-0" />
                  <span>Crop Monitoring</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/farmer/monitoring')}
                className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-gray-100 text-[#092e19] text-[11px] font-black rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                View Farm Monitoring →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CCTV LIVE MODAL PREVIEW */}
      {activeCctvModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveCctvModal(null)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-400">LIVE FEED</span>
                <span className="text-gray-400 text-xs">•</span>
                <h3 className="text-xs font-black text-white">{activeCctvModal.name}</h3>
                <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] rounded-full font-semibold">
                  {activeCctvModal.badge}
                </span>
              </div>
              <button
                onClick={() => setActiveCctvModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stream Image / Feed Container */}
            <div className="relative aspect-video bg-black overflow-hidden group">
              <img
                src={activeCctvModal.image}
                alt={activeCctvModal.name}
                className="w-full h-full object-cover"
              />
              {/* Live Telemetry OSD */}
              <div className="absolute top-2.5 left-3 flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-md text-[10px] text-white font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                REC {activeCctvModal.resolution || '1080p FHD • 30fps'}
              </div>
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-gray-200 font-mono bg-black/60 px-2.5 py-1 rounded-md">
                <span>{activeCctvModal.location || 'Farm Boundary Zone'}</span>
                <span className="text-emerald-400 font-bold">AI Intrusion: Clean</span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-gray-950 flex items-center justify-between border-t border-gray-800">
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connected to Google Farm CCTV Hub</span>
              </div>
              <button
                onClick={() => {
                  setActiveCctvModal(null);
                  navigate('/farmer/monitoring');
                }}
                className="px-3 py-1.5 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                Full Monitoring Hub →
              </button>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};

// Component to draw farm boundaries around the user's location
const FarmBoundaries = ({ center }: { center: { lat: number; lng: number } }) => {
  // Create 3 polygon field boundaries around the center to simulate the farm map
  const offset1 = 0.0015; // ~150 meters
  const offset2 = 0.001;  // ~100 meters
  
  // Field 1 (Main crop)
  const field1Paths: [number, number][] = [
    [center.lat, center.lng],
    [center.lat + offset1, center.lng],
    [center.lat + offset1, center.lng + offset1],
    [center.lat, center.lng + offset1],
  ];

  // Field 2 (Secondary crop)
  const field2Paths: [number, number][] = [
    [center.lat, center.lng],
    [center.lat, center.lng - offset2],
    [center.lat - offset2, center.lng - offset2],
    [center.lat - offset2, center.lng],
  ];

  // Field 3 (Fallow/Rotation)
  const field3Paths: [number, number][] = [
    [center.lat, center.lng],
    [center.lat, center.lng + offset1],
    [center.lat - offset1, center.lng + offset1],
    [center.lat - offset1, center.lng],
  ];

  return (
    <>
      <CircleMarker 
        center={[center.lat, center.lng]} 
        radius={4} 
        pathOptions={{ color: 'white', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }} 
      />
      <Polygon 
        positions={field1Paths} 
        pathOptions={{ color: '#4ade80', weight: 2, fillColor: '#4ade80', fillOpacity: 0.35 }} 
      />
      <Polygon 
        positions={field2Paths} 
        pathOptions={{ color: '#60a5fa', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.35 }} 
      />
      <Polygon 
        positions={field3Paths} 
        pathOptions={{ color: '#facc15', weight: 2, fillColor: '#facc15', fillOpacity: 0.35 }} 
      />
    </>
  );
};
