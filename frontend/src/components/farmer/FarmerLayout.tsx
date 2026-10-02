import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  CloudSun,
  CalendarDays,
  ShieldAlert,
  Layers,
  Droplets,
  CalendarCheck,
  TrendingUp,
  Video,
  Handshake,
  Settings,
  Bot,
  Search,
  Mic,
  MapPin,
  Globe,
  Bell,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Wheat,
  Leaf,
  Sprout,
  ThermometerSun,
  Tractor,
  FlaskConical,
  BarChart3,
  ArrowRight,
  CloudRain,
  CloudLightning,
  Sun,
  Wind,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { useDeviceLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGoogleWeather } from '../../context/WeatherContext';

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR WIDTH — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
const SIDEBAR_W  = 'w-64 xl:w-72';
const SIDEBAR_ML = 'lg:ml-64 xl:ml-72';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SEARCH INDEX — every searchable item in the webapp
// ─────────────────────────────────────────────────────────────────────────────
interface SearchItem {
  label: string;
  sublabel?: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  action: (navigate: (p: string) => void, query: string) => void;
  keywords: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  // ── Features / Pages ──────────────────────────────────────────────────────
  { label: 'Weather & Climate', sublabel: 'Real-time forecast, rain, humidity', category: 'Features', icon: CloudSun, iconColor: 'text-amber-500', keywords: ['weather', 'climate', 'rain', 'forecast', 'temperature', 'humidity', 'wind', 'mausam', 'barish'], action: (nav) => nav('/farmer/weather') },
  { label: 'Crop Planner', sublabel: 'Plan crops by season & soil', category: 'Features', icon: CalendarDays, iconColor: 'text-emerald-600', keywords: ['crop planner', 'planner', 'season', 'schedule', 'calendar', 'kharif', 'rabi', 'sow'], action: (nav) => nav('/farmer/crop-planner') },
  { label: 'Crop Health & Disease', sublabel: 'Detect diseases, pests, treatments', category: 'Features', icon: ShieldAlert, iconColor: 'text-rose-500', keywords: ['disease', 'pest', 'health', 'fungus', 'blight', 'virus', 'treatment', 'spray', 'leaf', 'spot', 'wilt'], action: (nav) => nav('/farmer/crop-health') },
  { label: 'Soil & Field', sublabel: 'Soil test, NPK, pH, fertility', category: 'Features', icon: Layers, iconColor: 'text-amber-700', keywords: ['soil', 'npk', 'ph', 'fertility', 'field', 'test', 'nitrogen', 'potassium', 'phosphorus', 'organic'], action: (nav) => nav('/farmer/soil-field') },
  { label: 'Water & Irrigation', sublabel: 'Drip, sprinkler, water requirements', category: 'Features', icon: Droplets, iconColor: 'text-cyan-500', keywords: ['water', 'irrigation', 'drip', 'sprinkler', 'pump', 'canal', 'flood', 'moisture', 'paani'], action: (nav) => nav('/farmer/irrigation') },
  { label: 'Farm Management', sublabel: 'Tasks, workers, expenses, records', category: 'Features', icon: CalendarCheck, iconColor: 'text-rose-500', keywords: ['farm management', 'tasks', 'workers', 'expenses', 'records', 'labour', 'cost', 'budget'], action: (nav) => nav('/farmer/farm-management') },
  { label: 'Market Price & Profit', sublabel: 'Live mandi prices, MSP, profit calc', category: 'Features', icon: TrendingUp, iconColor: 'text-emerald-600', keywords: ['market', 'price', 'mandi', 'msp', 'profit', 'sell', 'rate', 'bazaar', 'apmc', 'bhav'], action: (nav) => nav('/farmer/market-profit') },
  { label: 'Farm Monitoring', sublabel: 'CCTV, field cameras, live view', category: 'Features', icon: Video, iconColor: 'text-cyan-600', keywords: ['monitoring', 'cctv', 'camera', 'live', 'field', 'watch', 'surveillance'], action: (nav) => nav('/farmer/monitoring') },
  { label: 'Farm Services', sublabel: 'Tractor, seeds, fertilizer, experts', category: 'Features', icon: Handshake, iconColor: 'text-emerald-600', keywords: ['services', 'tractor', 'seeds', 'fertilizer', 'expert', 'mechanic', 'soil test', 'insurance', 'rental'], action: (nav) => nav('/farmer/services') },
  { label: 'AI Farm Copilot', sublabel: 'Ask anything, voice & photo support', category: 'Features', icon: Bot, iconColor: 'text-purple-600', keywords: ['ai', 'copilot', 'ask', 'chat', 'help', 'gemini', 'assistant', 'advice', 'question'], action: (nav) => nav('/farmer/ai') },
  { label: 'Settings', sublabel: 'Profile, notifications, preferences', category: 'Features', icon: Settings, iconColor: 'text-slate-600', keywords: ['settings', 'profile', 'notification', 'language', 'account', 'preferences'], action: (nav) => nav('/farmer/settings') },

  // ── Crops ─────────────────────────────────────────────────────────────────
  { label: 'Rice (Paddy) Price', sublabel: 'Live market rates & MSP', category: 'Crops', icon: Wheat, iconColor: 'text-yellow-600', keywords: ['rice', 'paddy', 'dhan', 'chawal'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Rice' })), 300); } },
  { label: 'Wheat Price', sublabel: 'Live market rates & MSP', category: 'Crops', icon: Wheat, iconColor: 'text-amber-500', keywords: ['wheat', 'gehu', 'atta'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Wheat' })), 300); } },
  { label: 'Maize Price', sublabel: 'Live market rates & MSP', category: 'Crops', icon: Wheat, iconColor: 'text-yellow-500', keywords: ['maize', 'corn', 'makka'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Maize' })), 300); } },
  { label: 'Tomato Price', sublabel: 'Live market rates', category: 'Crops', icon: Leaf, iconColor: 'text-red-500', keywords: ['tomato', 'tamatar'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Tomato' })), 300); } },
  { label: 'Potato Price', sublabel: 'Live market rates', category: 'Crops', icon: Leaf, iconColor: 'text-amber-700', keywords: ['potato', 'aloo', 'alu'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Potato' })), 300); } },
  { label: 'Onion Price', sublabel: 'Live market rates', category: 'Crops', icon: Leaf, iconColor: 'text-purple-500', keywords: ['onion', 'pyaz', 'piaz'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Onion' })), 300); } },
  { label: 'Soybean Price', sublabel: 'Live market rates & MSP', category: 'Crops', icon: Sprout, iconColor: 'text-green-600', keywords: ['soybean', 'soya', 'soy'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Soybean' })), 300); } },
  { label: 'Mustard Price', sublabel: 'Live market rates & MSP', category: 'Crops', icon: Sprout, iconColor: 'text-yellow-600', keywords: ['mustard', 'sarson', 'rapeseed'], action: (nav) => { nav('/farmer/market-profit'); setTimeout(() => window.dispatchEvent(new CustomEvent('market-commodity-change', { detail: 'Mustard' })), 300); } },

  // ── Disease / Health ───────────────────────────────────────────────────────
  { label: 'Rice Blast Disease', sublabel: 'Symptoms, treatment & prevention', category: 'Crop Health', icon: ShieldAlert, iconColor: 'text-rose-500', keywords: ['rice blast', 'blast', 'fungal'], action: (nav, q) => { nav('/farmer/crop-health'); setTimeout(() => window.dispatchEvent(new CustomEvent('crop-health-search', { detail: q || 'rice blast' })), 300); } },
  { label: 'Tomato Leaf Curl', sublabel: 'Virus detection & management', category: 'Crop Health', icon: ShieldAlert, iconColor: 'text-rose-500', keywords: ['tomato leaf', 'curl', 'virus', 'yellow'], action: (nav, q) => { nav('/farmer/crop-health'); setTimeout(() => window.dispatchEvent(new CustomEvent('crop-health-search', { detail: q || 'tomato leaf curl' })), 300); } },
  { label: 'Wheat Rust', sublabel: 'Rust disease control', category: 'Crop Health', icon: ShieldAlert, iconColor: 'text-rose-500', keywords: ['wheat rust', 'rust', 'stem'], action: (nav, q) => { nav('/farmer/crop-health'); setTimeout(() => window.dispatchEvent(new CustomEvent('crop-health-search', { detail: q || 'wheat rust' })), 300); } },

  // ── Services ───────────────────────────────────────────────────────────────
  { label: 'Tractor Rental', sublabel: 'Find tractor services near you', category: 'Services', icon: Tractor, iconColor: 'text-orange-500', keywords: ['tractor', 'rental', 'hire', 'machine', 'plough', 'harvester'], action: (nav, q) => { nav('/farmer/services'); setTimeout(() => window.dispatchEvent(new CustomEvent('farm-services-search', { detail: q || 'tractor' })), 300); } },
  { label: 'Soil Testing Lab', sublabel: 'Get your soil tested', category: 'Services', icon: FlaskConical, iconColor: 'text-blue-500', keywords: ['soil test', 'lab', 'testing', 'analysis', 'npk'], action: (nav, q) => { nav('/farmer/services'); setTimeout(() => window.dispatchEvent(new CustomEvent('farm-services-search', { detail: q || 'soil test' })), 300); } },
  { label: 'Crop Insurance', sublabel: 'Pradhan Mantri Fasal Bima Yojana', category: 'Services', icon: BarChart3, iconColor: 'text-indigo-500', keywords: ['insurance', 'bima', 'fasal', 'pmfby', 'claim'], action: (nav, q) => { nav('/farmer/services'); setTimeout(() => window.dispatchEvent(new CustomEvent('farm-services-search', { detail: q || 'insurance' })), 300); } },
  { label: 'Fertilizer Shop', sublabel: 'DAP, Urea, NPK, organic near you', category: 'Services', icon: FlaskConical, iconColor: 'text-green-600', keywords: ['fertilizer', 'dap', 'urea', 'npk', 'manure', 'khad'], action: (nav, q) => { nav('/farmer/services'); setTimeout(() => window.dispatchEvent(new CustomEvent('farm-services-search', { detail: q || 'fertilizer' })), 300); } },
  { label: 'Agriculture Expert', sublabel: 'Consult a local farming expert', category: 'Services', icon: ThermometerSun, iconColor: 'text-teal-600', keywords: ['expert', 'krishi', 'officer', 'consultant', 'advice', 'consult'], action: (nav, q) => { nav('/farmer/services'); setTimeout(() => window.dispatchEvent(new CustomEvent('farm-services-search', { detail: q || 'expert' })), 300); } },
];

interface FarmerLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
}

export const FarmerLayout: React.FC<FarmerLayoutProps> = ({ children, hideSidebar, hideHeader }) => {
  const { location: devLoc, isDetecting, openLocationModal } = useDeviceLocation();
  const { currentLanguage, supportedLanguages, setLanguage, isTranslating } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // ── Page-type flags ────────────────────────────────────────────────────────
  const isFarmManagement = location.pathname.startsWith('/farmer/farm-management');
  const isMarketProfit   = location.pathname.startsWith('/farmer/market-profit');
  const isMonitoring     = location.pathname.startsWith('/farmer/monitoring');
  const isFarmServices   = location.pathname.startsWith('/farmer/services');
  const isCropHealth     = location.pathname.startsWith('/farmer/crop-health');
  const isSoilField      = location.pathname.startsWith('/farmer/soil-field');
  const isIrrigation     = location.pathname.startsWith('/farmer/irrigation');

  // ── Global Smart Search ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchOpen, setSearchOpen]           = useState(false);
  const [searchResults, setSearchResults]     = useState<SearchItem[]>([]);
  const [isListening, setIsListening]         = useState(false);
  const searchRef                             = useRef<HTMLDivElement>(null);
  const inputRef                              = useRef<HTMLInputElement>(null);

  // ── Global Synchronized Google Weather ───────────────────────────────────
  const {
    current: weatherCurrent,
    alerts: weatherAlerts,
    isSyncing: weatherSyncing,
    refreshWeather,
  } = useGoogleWeather();
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const weatherDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (weatherDropdownRef.current && !weatherDropdownRef.current.contains(e.target as Node)) {
        setWeatherDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const computeResults = useCallback((q: string): SearchItem[] => {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return SEARCH_INDEX.filter((item) =>
      item.label.toLowerCase().includes(query) ||
      item.sublabel?.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.includes(query) || query.includes(k))
    ).slice(0, 8);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const results = computeResults(value);
    setSearchResults(results);
    setSearchOpen(value.trim().length > 0);
  };

  const executeSearch = (query: string) => {
    if (!query.trim()) return;
    const results = computeResults(query);
    setSearchOpen(false);
    setSearchQuery('');

    if (results.length > 0) {
      // Route to the best match
      results[0].action(navigate, query);
    } else {
      // Fallback: if on a specific page dispatch to that page; else send to AI
      if (isCropHealth)      { window.dispatchEvent(new CustomEvent('crop-health-search',     { detail: query })); nav(query); }
      else if (isFarmServices)    { window.dispatchEvent(new CustomEvent('farm-services-search',   { detail: query })); nav(query); }
      else if (isSoilField)       { window.dispatchEvent(new CustomEvent('soil-field-search',      { detail: query })); nav(query); }
      else if (isIrrigation)      { window.dispatchEvent(new CustomEvent('irrigation-search',      { detail: query })); nav(query); }
      else if (isFarmManagement)  { window.dispatchEvent(new CustomEvent('farm-management-search', { detail: query })); nav(query); }
      else if (isMonitoring)      { window.dispatchEvent(new CustomEvent('farm-monitoring-search', { detail: query })); nav(query); }
      else if (isMarketProfit)    { window.dispatchEvent(new CustomEvent('market-commodity-change',{ detail: query })); nav(query); }
      else { navigate(`/farmer/ai?q=${encodeURIComponent(query)}`); }
    }
  };

  // helper to also dispatch to active page
  const nav = (query: string) => { /* already dispatched above */ };

  const handleResultClick = (item: SearchItem) => {
    item.action(navigate, searchQuery);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  // Voice input
  const handleVoiceInput = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.lang = 'en-IN';
      setIsListening(true);
      recognition.onend   = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        handleSearchChange(transcript);
        inputRef.current?.focus();
      };
      recognition.start();
    } else {
      navigate('/farmer/ai?voice=true');
    }
  };

  // ── Navigation items ───────────────────────────────────────────────────────
  const navItems = [
    { to: '/farmer', exact: true,  title: 'Home / Dashboard',     icon: Home,        iconColor: 'text-white' },
    { to: '/farmer/weather',        title: 'Weather & Climate',    icon: CloudSun,    iconColor: 'text-amber-500' },
    { to: '/farmer/crop-planner',   title: 'Crop Planner',         icon: CalendarDays, iconColor: 'text-emerald-600' },
    { to: '/farmer/crop-health',    title: 'Crop Health & Disease',icon: ShieldAlert, iconColor: 'text-rose-500' },
    { to: '/farmer/soil-field',     title: 'Soil & Field',         icon: Layers,      iconColor: 'text-amber-700' },
    { to: '/farmer/irrigation',     title: 'Water & Irrigation',   icon: Droplets,    iconColor: 'text-cyan-500' },
    { to: '/farmer/farm-management',title: 'Farm Management',      icon: CalendarCheck,iconColor: 'text-rose-500' },
    { to: '/farmer/market-profit',  title: 'Market Price & Profit',icon: TrendingUp,  iconColor: 'text-emerald-600' },
    { to: '/farmer/monitoring',     title: 'Farm Monitoring',      icon: Video,       iconColor: 'text-cyan-600' },
    { to: '/farmer/services',       title: 'Farm Services',        icon: Handshake,   iconColor: 'text-emerald-600' },
    { to: '/farmer/ai',             title: 'AI Farm Copilot',      icon: Bot,         iconColor: 'text-cyan-600' },
    { to: '/farmer/settings',       title: 'Settings',             icon: Settings,    iconColor: 'text-slate-600' },
  ];

  // ── Category colour map ────────────────────────────────────────────────────
  const catColor: Record<string, string> = {
    Features:     'bg-emerald-50 text-emerald-700',
    Crops:        'bg-amber-50 text-amber-700',
    'Crop Health':'bg-rose-50 text-rose-700',
    Services:     'bg-blue-50 text-blue-700',
  };

  // ── Group results by category ──────────────────────────────────────────────
  const grouped = searchResults.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // ── SIDEBAR NODE ──────────────────────────────────────────────────────────
  const sidebarNode = !hideSidebar && (
    <>
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden" />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          ${SIDEBAR_W}
          bg-white border-r border-[#dbe3db]
          flex flex-col shadow-xs
          transition-transform duration-300
          lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ overflow: 'hidden' }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div onClick={() => { navigate('/farmer'); setMobileMenuOpen(false); }} className="cursor-pointer group flex items-center gap-2">
            <img src="/assets/brands/farmer-logo.jpeg" alt="Farmer Powered by KrishiGo" className="h-14 xl:h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5" style={{ overflow: 'hidden' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = (item as any).exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'bg-[#008037] text-white font-bold shadow-xs' : 'text-gray-800 hover:bg-[#eef4ee] hover:text-[#008037]'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : item.iconColor || 'text-[#008037]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom cards */}
        <div className="px-2.5 pb-2.5 pt-2 border-t border-gray-100 space-y-2 bg-[#f9fbf9] shrink-0" style={{ overflow: 'hidden' }}>
          <div className="p-2.5 bg-gradient-to-br from-[#ebf5ee] to-[#d6ebd9] rounded-2xl border border-green-200/80 shadow-2xs relative overflow-hidden">
            <div className="flex items-start gap-2">
              <img src="/assets/farmer/dashboard/sidebar_ai_bot.png" alt="AI Farm Copilot" className="w-12 h-14 object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-gray-900 leading-tight">AI Farm Copilot</h4>
                <p className="text-[10px] text-emerald-800 font-semibold leading-tight">Your Smart Farming Assistant</p>
                <div className="mt-1 space-y-0.5 text-[9px] text-gray-600 font-medium">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Chat</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" /><span>Voice</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" /><span>Photo</span>
                  </div>
                  <div className="flex items-center gap-1 text-[8px] text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Multiple Languages</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/farmer/ai')} className="w-full mt-2 py-1 px-3 bg-[#008037] hover:bg-[#00682e] text-white text-[10px] font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer">
              Start Chatting →
            </button>
          </div>
          <div className="p-2 bg-white rounded-xl border border-gray-200/90 flex items-center gap-2">
            <img src="/assets/farmer/dashboard/sidebar_farmer_couple.png" alt="Farmer Couple" className="w-12 h-12 object-contain shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black text-gray-900 leading-tight">Growing Together</p>
              <p className="text-[9px] text-gray-500 leading-tight">for a Better Tomorrow</p>
              <div className="mt-1 text-[7.5px] font-bold text-emerald-700 tracking-wider leading-tight">✓ Farmers |<br />✓ Technology | Prosperity</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // ── MAIN LAYOUT ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef3ee] text-gray-900 font-sans selection:bg-green-100 selection:text-green-800">
      {sidebarNode}

      <div className={`flex flex-col min-h-screen ${!hideSidebar ? SIDEBAR_ML : ''}`}>
        {/* HEADER */}
        {!hideHeader && (
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dbe3db] px-4 lg:px-6 py-2.5 shadow-xs flex items-center justify-between gap-3">

            {/* Left: hamburger + market switch */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/')} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf4ec] hover:bg-[#d8edd9] text-[#008037] text-xs font-bold rounded-xl transition-all border border-green-200 cursor-pointer shadow-xs" title="Switch back to Customer E-Commerce Marketplace">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>KrishiGo Market</span>
              </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                GLOBAL SMART SEARCH BAR
                Works from ANY page — routes intelligently based on query
            ═══════════════════════════════════════════════════════════════ */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit}>
                <div className={`w-full relative flex items-center rounded-full border transition-all ${searchOpen ? 'bg-white border-[#008037] ring-2 ring-green-100 shadow-md' : 'bg-[#f4f7f4] border-gray-200 hover:border-green-400'}`}>
                  <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => { if (searchQuery.trim()) setSearchOpen(true); }}
                    placeholder="Search anything — crop, disease, price, service, feature..."
                    className="w-full py-2 px-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-1 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="button" onClick={handleVoiceInput} className={`p-1.5 rounded-full transition-colors mr-2 cursor-pointer ${isListening ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-[#008037]'}`} title={isListening ? 'Listening...' : 'Voice Search'}>
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* ── Smart Search Dropdown ── */}
              {searchOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">

                  {searchResults.length === 0 ? (
                    /* No results — offer AI fallback */
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">Ask AI: "<span className="text-[#008037]">{searchQuery}</span>"</p>
                        <p className="text-xs text-gray-500">Get an intelligent answer from KrishiGo AI Copilot</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { navigate(`/farmer/ai?q=${encodeURIComponent(searchQuery)}`); setSearchQuery(''); setSearchOpen(false); }}
                        className="shrink-0 p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-1.5 max-h-[420px] overflow-y-auto">
                      {Object.entries(grouped).map(([category, items]) => (
                        <div key={category}>
                          {/* Category header */}
                          <div className="px-4 py-1 flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${catColor[category] || 'bg-gray-100 text-gray-500'}`}>{category}</span>
                          </div>
                          {/* Items */}
                          {items.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleResultClick(item)}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f0f9f0] transition-colors cursor-pointer group text-left"
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gray-50 group-hover:bg-white border border-gray-100 ${item.iconColor}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#008037]">{item.label}</p>
                                  {item.sublabel && <p className="text-xs text-gray-500 truncate">{item.sublabel}</p>}
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#008037] transition-colors shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      ))}

                      {/* Always offer AI at the bottom */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => { navigate(`/farmer/ai?q=${encodeURIComponent(searchQuery)}`); setSearchQuery(''); setSearchOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-purple-50 transition-colors cursor-pointer group text-left"
                        >
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 group-hover:bg-purple-100 text-purple-600 border border-purple-100">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">Ask AI: "<span className="text-[#008037]">{searchQuery}</span>"</p>
                            <p className="text-xs text-gray-500">Get a detailed AI answer from KrishiGo Copilot</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-600 transition-colors shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Location */}
              <button onClick={openLocationModal} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f4f7f4] hover:bg-emerald-50 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#008037] transition-all cursor-pointer border border-gray-200/60 hover:border-emerald-300 shadow-2xs group" title="Click to auto-detect or change location">
                <MapPin className={`w-3.5 h-3.5 ${isDetecting ? 'text-amber-500 animate-pulse' : 'text-[#008037]'}`} />
                <span className="hidden md:inline font-bold text-gray-800 group-hover:text-[#008037]">
                  {isDetecting ? 'Locating...' : (devLoc?.display_name || 'Siliguri, West Bengal')}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* ═══════════════════════════════════════════════════════════
                  LIVE SYNCHRONIZED GOOGLE WEATHER BADGE (VISIBLE EVERYWHERE)
                  Provides real-time Google temperature, rain, condition & alerts
              ═══════════════════════════════════════════════════════════ */}
              <div ref={weatherDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setWeatherDropdownOpen(!weatherDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f4f8fa] hover:bg-sky-50 rounded-xl text-xs font-semibold text-gray-800 hover:text-sky-800 transition-all cursor-pointer border border-sky-200/70 hover:border-sky-300 shadow-2xs group"
                  title="Click to view live Google Weather details & 15-day agricultural forecast"
                >
                  {/* Dynamic weather icon */}
                  {weatherCurrent.rain_chance >= 60 || weatherCurrent.condition.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-4 h-4 text-blue-500 animate-pulse" />
                  ) : weatherCurrent.condition.toLowerCase().includes('thunder') ? (
                    <CloudLightning className="w-4 h-4 text-purple-600" />
                  ) : weatherCurrent.condition.toLowerCase().includes('cloud') ? (
                    <CloudSun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
                  )}

                  {/* Live temperature */}
                  <span className="font-black text-gray-900 leading-none">
                    {weatherCurrent.temp}°C
                  </span>

                  {/* Status / rain probability */}
                  <span className="hidden sm:inline text-[11px] font-bold text-gray-600 group-hover:text-sky-800">
                    {weatherCurrent.rain_chance >= 50
                      ? `${weatherCurrent.rain_chance}% Rain`
                      : weatherCurrent.condition}
                  </span>

                  {/* Google sync indicator badge */}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-[#008037] border border-emerald-200">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${weatherSyncing ? 'animate-ping' : ''}`} />
                    <span className="hidden md:inline">Google Synced</span>
                  </span>

                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* Quick Google Weather Dropdown Popover */}
                {weatherDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <CloudSun className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-gray-900">Google Weather Intelligence</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); refreshWeather(true); }}
                        className="p-1 text-gray-400 hover:text-green-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                        title="Force refresh Google weather"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${weatherSyncing ? 'animate-spin text-green-600' : ''}`} />
                      </button>
                    </div>

                    {/* Main weather preview */}
                    <div className="flex items-center justify-between my-3">
                      <div>
                        <div className="text-2xl font-black text-gray-900 leading-none">
                          {weatherCurrent.temp}°C
                        </div>
                        <div className="text-xs font-bold text-gray-600 mt-1">
                          {weatherCurrent.condition} • Feels {weatherCurrent.feels_like}°C
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium">
                          H: {weatherCurrent.high}°C • L: {weatherCurrent.low}°C
                        </div>
                      </div>
                      <div className="text-right space-y-1 text-[10px] font-bold text-gray-700 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-end gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span>Rain: {weatherCurrent.rain_chance}%</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <Wind className="w-3 h-3 text-slate-500" />
                          <span>Wind: {weatherCurrent.wind}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <Droplets className="w-3 h-3 text-teal-500" />
                          <span>Humidity: {weatherCurrent.humidity}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Active severe weather alert if any */}
                    {weatherAlerts && weatherAlerts.length > 0 && (
                      <div className="mb-2.5 p-2 bg-amber-50 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                        <span className="font-black">⚠️</span>
                        <div>
                          <div className="font-bold">{weatherAlerts[0].title}</div>
                          <div className="text-[10px] text-amber-700">{weatherAlerts[0].timing}</div>
                        </div>
                      </div>
                    )}

                    {/* Location line & Attribution */}
                    <div className="text-[10px] text-gray-400 font-medium mb-2.5 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">📍 {weatherCurrent.location}</span>
                      <span className="text-emerald-700 font-bold">● Google Live Synced</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setWeatherDropdownOpen(false); navigate('/farmer/weather'); }}
                      className="w-full py-2 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Open 15-Day Weather & Climate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f4f7f4] hover:bg-emerald-50 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#008037] transition-all cursor-pointer border border-gray-200/60 hover:border-emerald-300">
                  <Globe className={`w-3.5 h-3.5 ${isTranslating ? 'text-amber-500 animate-spin' : 'text-[#008037]'}`} />
                  <span className="hidden sm:inline font-bold">{currentLanguage.nativeName || currentLanguage.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                      <span>Google Translate</span>
                      <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">All App</span>
                    </div>
                    <div className="py-1">
                      {supportedLanguages.map((lang) => (
                        <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${currentLanguage.code === lang.code ? 'bg-emerald-50 text-[#008037] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span className="font-semibold">{lang.nativeName}</span>
                            <span className="text-[10px] text-gray-400">({lang.name})</span>
                          </span>
                          {currentLanguage.code === lang.code && <span className="text-[#008037] font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button onClick={() => navigate('/farmer/farm-management')} className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors cursor-pointer" title="Notifications & Alerts">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
              </button>

              {/* User */}
              <div onClick={() => navigate('/farmer/settings')} className="flex items-center gap-2 pl-1 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline text-xs font-bold text-gray-800 group-hover:text-green-700">User</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <main className={`flex-1 ${hideSidebar ? 'p-0 space-y-0 w-full' : 'p-3 sm:p-5 lg:p-6 space-y-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
