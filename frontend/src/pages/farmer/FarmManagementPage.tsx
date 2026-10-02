import React, { useState, useEffect, useRef } from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { useGoogleWeather } from '../../context/WeatherContext';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  Wallet,
  Users,
  ChevronRight,
  Sun,
  Droplets,
  Wind,
  Bug,
  MoreVertical,
  FlaskConical,
  Mic,
  Upload,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Plus,
  Check,
  ArrowDown,
  ArrowUp,
  Send,
  Sparkles,
  X,
  Compass,
  ExternalLink,
  TrendingUp,
  BarChart2,
  Sprout,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const FarmManagementPage: React.FC = () => {
  const { location: devLoc, isDetecting, detectDeviceLocation } = useDeviceLocation();
  const { current: liveWeather, forecastDays: liveForecastDays } = useGoogleWeather();

  // Management data from backend
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // File and photo upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  // Crop Calendar season tab
  const [calendarSeason, setCalendarSeason] = useState<'Current Season' | 'Next Season' | 'All Crops'>('Current Season');

  // Fields state
  const [fields, setFields] = useState<any[]>([
    {
      id: 'field_1',
      name: 'Field 1',
      crop: 'Rice (Kharif)',
      area: '2.5 Acres',
      health_badge: '● Healthy',
      health_color: 'emerald',
      growth_stage: 'Vegetative',
      growth_percent: 45,
      photo: '/assets/farmer/farm_management/field1_rice_pure.jpg',
      latitude: 26.7291,
      longitude: 88.3973,
    },
    {
      id: 'field_2',
      name: 'Field 2',
      crop: 'Tomato',
      area: '1.2 Acres',
      health_badge: '● Good',
      health_color: 'emerald',
      growth_stage: 'Flowering',
      growth_percent: 70,
      photo: '/assets/farmer/farm_management/field2_tomato_pure.jpg',
      latitude: 26.7251,
      longitude: 88.3933,
    },
    {
      id: 'field_3',
      name: 'Field 3',
      crop: 'Maize',
      area: '1.0 Acre',
      health_badge: '● Needs Attention',
      health_color: 'amber',
      growth_stage: 'Early Growth',
      growth_percent: 30,
      photo: '/assets/farmer/farm_management/field3_maize_pure.jpg',
      latitude: 26.7265,
      longitude: 88.3985,
    },
  ]);
  const [selectedField, setSelectedField] = useState<any>(null);

  // Finance state
  const [finance, setFinance] = useState({
    total_expenses: 12500,
    total_income: 28000,
    total_expenses_formatted: '₹ 12,500',
    total_income_formatted: '₹ 28,000',
    expenses_trend: '12% vs last month',
    income_trend: '18% vs last month',
  });
  const [financeChartData, setFinanceChartData] = useState<any[]>([
    { month: 'Jan', income: 16000, expenses: 8000 },
    { month: 'Feb', income: 22000, expenses: 11000 },
    { month: 'Mar', income: 18000, expenses: 9500 },
    { month: 'Apr', income: 24000, expenses: 12000 },
    { month: 'May', income: 26000, expenses: 13500 },
    { month: 'Jun', income: 28000, expenses: 12500 },
  ]);

  // Tasks state
  const [tasks, setTasks] = useState<any[]>([
    {
      id: 'task_1',
      title: 'Irrigate Field 1 (Rice)',
      time: '6:00 AM – 8:00 AM',
      field_name: 'Field 1',
      crop: 'Rice',
      icon: Droplets,
      color: 'sky',
      is_completed: false,
    },
    {
      id: 'task_2',
      title: 'Apply fertilizer in Field 2',
      time: '10:00 AM – 12:00 PM',
      field_name: 'Field 2',
      crop: 'Tomato',
      icon: Sprout,
      color: 'emerald',
      is_completed: false,
    },
    {
      id: 'task_3',
      title: 'Check for pests (Tomato)',
      time: '2:00 PM – 3:00 PM',
      field_name: 'Field 2',
      crop: 'Tomato',
      icon: Bug,
      color: 'rose',
      is_completed: false,
    },
    {
      id: 'task_4',
      title: 'Weeding in Field 3 (Maize)',
      time: '4:00 PM – 5:00 PM',
      field_name: 'Field 3',
      crop: 'Maize',
      icon: Sprout,
      color: 'emerald',
      is_completed: false,
    },
  ]);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Weather forecast state
  const [weatherForecastList, setWeatherForecastList] = useState<any[]>([]);

  // AI Copilot state
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Form states for modals
  const [newCropName, setNewCropName] = useState('');
  const [newCropField, setNewCropField] = useState('Field 1 (2.5 Acres)');
  const [newCropSowingDate, setNewCropSowingDate] = useState('2026-10-15');
  const [newCropHarvestDate, setNewCropHarvestDate] = useState('2027-02-20');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldAcres, setNewFieldAcres] = useState('');
  const [newFieldSoil, setNewFieldSoil] = useState('Loamy Soil');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskField, setNewTaskField] = useState('Field 1 (Rice)');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Fertilizer & Nutrients');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomeSource, setNewIncomeSource] = useState('Tomato Harvest Sale (Mandi)');
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerWage, setNewWorkerWage] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('Weeding & Intercultural');

  // 1. Auto-detect GPS on mount
  useEffect(() => {
    if (!devLoc) {
      detectDeviceLocation();
    }
  }, []);

  // 2. Fetch backend data with location
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getFarmManagement({
      location: devLoc?.display_name || 'Siliguri, West Bengal',
      lat: devLoc?.latitude || 26.7271,
      lng: devLoc?.longitude || 88.3953,
    })
      .then((res) => {
        if (isMounted && res) {
          setData(res);
          if (res.fields && res.fields.length > 0) {
            setFields((prev) => {
              const userCustom = prev.filter((p) => !res.fields.some((rf: any) => rf.id === p.id));
              return [...res.fields, ...userCustom];
            });
          }
          if (res.finance) {
            setFinance(res.finance);
            if (res.finance.monthly_chart) {
              setFinanceChartData(res.finance.monthly_chart);
            }
          }
          if (res.tasks && res.tasks.length > 0) {
            setTasks(
              res.tasks.map((t: any) => ({
                ...t,
                icon: t.icon === 'droplet' ? Droplets : t.icon === 'bug' ? Bug : Sprout,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.warn('Farm management fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [devLoc?.latitude, devLoc?.longitude, devLoc?.display_name]);

  // 3. Continuous auto-synchronization every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      api.getFarmManagement({
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude || 26.7271,
        lng: devLoc?.longitude || 88.3953,
      })
        .then((res) => {
          if (res) {
            setData(res);
            if (res.weather) {
              setData((prev: any) => ({ ...prev, weather: res.weather }));
            }
          }
        })
        .catch((err) => console.warn('Background auto-sync notice:', err));
    }, 30000);
    return () => clearInterval(timer);
  }, [devLoc?.latitude, devLoc?.longitude, devLoc?.display_name]);

  // 4. Synchronize top global search events
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const q = e.detail;
      if (q) {
        setAiQuestion(q);
        setActiveModal('ai_chat');
        handleAskAi(q);
      }
    };
    window.addEventListener('farm-management-search', handleSearchEvent);
    return () => window.removeEventListener('farm-management-search', handleSearchEvent);
  }, [devLoc]);

  // Toggle Task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t))
    );
    api.toggleTask(taskId).catch((e) => console.warn(e));
  };

  // Ask AI Copilot with text, custom query, or uploaded image/document
  const handleAskAi = async (customQuery?: string, imageOverride?: string) => {
    const q = customQuery !== undefined ? customQuery : aiQuestion;
    const img = imageOverride !== undefined ? imageOverride : uploadedImage;
    if (!q.trim() && !img) return;
    setIsAskingAi(true);
    try {
      const res = await api.askFarmManagementAi({
        query: q || 'Analyze this crop sample and advise on farm management actions.',
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude || 26.7271,
        lng: devLoc?.longitude || 88.3953,
        image_base64: img || undefined,
        mime_type: 'image/jpeg',
      });
      if (res && res.answer) {
        setAiAnswer(res.answer);
      }
    } catch (err) {
      console.warn('AI copilot error:', err);
      setAiAnswer(
        `For your farm in ${devLoc?.display_name || 'Siliguri'}, focus on timely weeding in Field 3 (Maize) and drip fertigation in Field 2 (Tomato). Expected harvest for Tomato is approaching in late September.`
      );
    } finally {
      setIsAskingAi(false);
    }
  };

  // Photo upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setUploadedImage(base64);
        setActiveModal('ai_chat');
        const q = `Analyze this farm photo (${file.name}) and suggest operations for ${devLoc?.display_name || 'Siliguri'}.`;
        setAiQuestion(q);
        handleAskAi(q, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Doc/File upload handler
  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
      setActiveModal('ai_chat');
      const q = `Review farm record "${file.name}" for ${devLoc?.display_name || 'Siliguri'} farm and advise on planning and compliance.`;
      setAiQuestion(q);
      handleAskAi(q);
    }
  };

  // Open 15-day live weather forecast synchronized with Google Weather API
  const handleOpenWeatherForecast = async () => {
    setActiveModal('weather_forecast');
    if (weatherForecastList.length === 0) {
      if (liveForecastDays && liveForecastDays.length > 0) {
        setWeatherForecastList(liveForecastDays);
      } else {
        try {
          const wRes = await api.getWeather({
            location: devLoc?.display_name || 'Siliguri, West Bengal',
            lat: devLoc?.latitude || 26.7271,
            lng: devLoc?.longitude || 88.3953,
          });
          if (wRes && wRes.forecast_15_days) {
            setWeatherForecastList(wRes.forecast_15_days);
          }
        } catch (e) {
          console.warn('Weather forecast fetch error:', e);
        }
      }
    }
  };

  // Voice speech synthesis / recognition
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAiQuestion(transcript);
      setIsListening(false);
      setActiveModal('ai_chat');
      handleAskAi(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Weather synchronized with Google Weather API
  const weather = {
    temp_c: liveWeather?.temp ?? data?.weather?.temp_c ?? 26,
    condition: liveWeather?.condition ?? data?.weather?.condition ?? 'Sunny',
    rain_chance_pct: liveWeather?.rain_chance ?? data?.weather?.rain_chance_pct ?? 75,
    humidity_pct: liveWeather?.humidity ?? data?.weather?.humidity_pct ?? 86,
    wind_speed_kmh: liveWeather?.wind ? parseInt(liveWeather.wind) || 10 : (data?.weather?.wind_speed_kmh ?? 10),
  };

  // Crop Calendar Gantt rows
  const cropCalendar = data?.crop_calendar || {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    crops: [
      {
        crop: 'Rice',
        icon: '/assets/farmer/irrigation/crop_rice_square.jpg',
        stages: [
          { name: 'Land Prep', startIdx: 1, span: 2, bg: '#dcfce7', text: '#166534' },
          { name: 'Sowing', startIdx: 3, span: 1, bg: '#e0f2fe', text: '#0369a1' },
          { name: 'Growing', startIdx: 4, span: 3, bg: '#dcfce7', text: '#166534' },
          { name: 'Fertilizer', startIdx: 7, span: 1, bg: '#fee2e2', text: '#b91c1c' },
          { name: 'Harvest', startIdx: 8, span: 2, bg: '#fef3c7', text: '#b45309' },
        ],
      },
      {
        crop: 'Tomato',
        icon: '/assets/farmer/irrigation/crop_tomato_square.jpg',
        stages: [
          { name: 'Nursery', startIdx: 2, span: 2, bg: '#fee2e2', text: '#b91c1c' },
          { name: 'Transplant', startIdx: 4, span: 1, bg: '#fecdd3', text: '#be123c' },
          { name: 'Growing', startIdx: 5, span: 4, bg: '#ffe4e6', text: '#9f1239' },
          { name: 'Harvest', startIdx: 9, span: 2, bg: '#fef3c7', text: '#b45309' },
        ],
      },
      {
        crop: 'Maize',
        icon: '/assets/farmer/irrigation/crop_maize_square.jpg',
        stages: [
          { name: 'Land Prep', startIdx: 2, span: 1, bg: '#f3e8ff', text: '#7e22ce' },
          { name: 'Sowing', startIdx: 3, span: 2, bg: '#e0e7ff', text: '#4338ca' },
          { name: 'Growing', startIdx: 5, span: 2, bg: '#e0f2fe', text: '#0369a1' },
          { name: 'Harvest', startIdx: 7, span: 2, bg: '#fef3c7', text: '#b45309' },
        ],
      },
    ],
  };

  const displayedCrops =
    calendarSeason === 'Current Season'
      ? cropCalendar.crops.filter((c: any) => ['Rice', 'Tomato', 'Maize'].includes(c.crop))
      : calendarSeason === 'Next Season'
      ? [
          {
            crop: 'Wheat',
            icon: '/assets/farmer/irrigation/crop_rice_square.jpg',
            stages: [
              { name: 'Land Prep', startIdx: 9, span: 1, bg: '#f3e8ff', text: '#7e22ce' },
              { name: 'Sowing', startIdx: 10, span: 1, bg: '#e0e7ff', text: '#4338ca' },
              { name: 'Growing', startIdx: 11, span: 2, bg: '#dcfce7', text: '#166534' },
            ],
          },
          {
            crop: 'Mustard',
            icon: '/assets/farmer/irrigation/crop_maize_square.jpg',
            stages: [
              { name: 'Sowing', startIdx: 9, span: 1, bg: '#e0e7ff', text: '#4338ca' },
              { name: 'Flowering', startIdx: 10, span: 2, bg: '#fef3c7', text: '#b45309' },
            ],
          },
        ]
      : [
          ...cropCalendar.crops,
          {
            crop: 'Wheat',
            icon: '/assets/farmer/irrigation/crop_rice_square.jpg',
            stages: [
              { name: 'Land Prep', startIdx: 9, span: 1, bg: '#f3e8ff', text: '#7e22ce' },
              { name: 'Sowing', startIdx: 10, span: 1, bg: '#e0e7ff', text: '#4338ca' },
              { name: 'Growing', startIdx: 11, span: 2, bg: '#dcfce7', text: '#166534' },
            ],
          },
        ];

  // Recent Activities
  const recentActivities = data?.recent_activities || [
    {
      id: 'act_1',
      title: 'Irrigation Completed',
      detail: 'Field 1 • 2 hours ago',
      image: '/assets/farmer/farm_management/act_irrigation.jpg',
    },
    {
      id: 'act_2',
      title: 'Fertilizer Applied',
      detail: 'Field 2 • 1 day ago',
      image: '/assets/farmer/farm_management/act_fertilizer.jpg',
    },
    {
      id: 'act_3',
      title: 'Pest Check',
      detail: 'Field 3 • 2 days ago',
      image: '/assets/farmer/farm_management/act_pest.jpg',
    },
    {
      id: 'act_4',
      title: 'Harvested 50 kg',
      detail: 'Tomato • 3 days ago',
      image: '/assets/farmer/farm_management/act_harvest.jpg',
    },
  ];

  // Upcoming Activities
  const upcomingActivities = data?.upcoming_activities || [
    { id: 'up_1', day: '12', month: 'Sep', title: 'Irrigation', subtitle: 'Field 1 • Morning', icon: Droplets, color: 'sky' },
    { id: 'up_2', day: '14', month: 'Sep', title: 'Fertilizer Application', subtitle: 'Field 2 • 10:00 AM', icon: Sprout, color: 'emerald' },
    { id: 'up_3', day: '18', month: 'Sep', title: 'Pest Monitoring', subtitle: 'All Fields • 9:00 AM', icon: Bug, color: 'rose' },
    { id: 'up_4', day: '21', month: 'Sep', title: 'Soil Testing', subtitle: 'Field 3 • 11:00 AM', icon: FlaskConical, color: 'teal' },
    { id: 'up_5', day: '25', month: 'Sep', title: 'Expected Harvest', subtitle: 'Tomato • Field 2', icon: Sprout, color: 'amber' },
  ];

  return (
    <FarmerLayout>
      <div className="space-y-3 pb-8">

        {/* ----------------------------------------------------------------------- */}
        {/* 1. TOP HERO BANNER (FARMER IN CORN FIELD WITH 4 ACTION BUTTONS) */}
        {/* ----------------------------------------------------------------------- */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-100 min-h-[145px] sm:min-h-[155px] flex items-center p-4 sm:p-5"
          style={{
            background: `linear-gradient(to right, #ffffff 0%, #ffffff 32%, rgba(255, 255, 255, 0.85) 45%, rgba(255, 255, 255, 0.2) 65%, transparent 100%), url('/assets/farmer/farm_management/hero_farmer_clean.jpg') right 35% center / auto 100% no-repeat, #edf7ee`,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4 relative z-10">
            {/* Title & Copy */}
            <div className="max-w-md">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2438] tracking-tight">
                Farm Management
              </h1>
              <p className="text-xs font-semibold text-gray-700 mt-1">
                Plan, track and manage your entire farm in one place.
              </p>
              <p className="text-xs text-gray-600 font-medium">
                Grow smarter, save time and increase profit.
              </p>
            </div>

            {/* 4 Hero Action Pill Buttons in 2x2 Layout */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 shrink-0">
              <button
                onClick={() => setActiveModal('add_crop')}
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-2 px-3 sm:px-4 rounded-xl shadow-xs border border-gray-200/90 flex items-center gap-2 transition-all hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
                <span>Plan Your Crops</span>
              </button>

              <button
                onClick={() => setActiveModal('add_expense')}
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-2 px-3 sm:px-4 rounded-xl shadow-xs border border-gray-200/90 flex items-center gap-2 transition-all hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
                <span>Manage Costs</span>
              </button>

              <button
                onClick={() => setActiveModal('add_task')}
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-2 px-3 sm:px-4 rounded-xl shadow-xs border border-gray-200/90 flex items-center gap-2 transition-all hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>Track Activities</span>
              </button>

              <button
                onClick={() => setActiveModal('add_income')}
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-2 px-3 sm:px-4 rounded-xl shadow-xs border border-gray-200/90 flex items-center gap-2 transition-all hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Increase Profit</span>
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 2. SIX ACTION BUTTONS RIBBON */}
        {/* ----------------------------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {/* 1. Add Crop */}
          <button
            onClick={() => setActiveModal('add_crop')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">Add Crop</div>
              <div className="text-[10px] text-gray-500 font-medium">Plan new crop</div>
            </div>
          </button>

          {/* 2. Add Field */}
          <button
            onClick={() => setActiveModal('add_field')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">Add Field</div>
              <div className="text-[10px] text-gray-500 font-medium">Manage your fields</div>
            </div>
          </button>

          {/* 3. Add Task */}
          <button
            onClick={() => setActiveModal('add_task')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-rose-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ef4444] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-rose-700">Add Task</div>
              <div className="text-[10px] text-gray-500 font-medium">Create farm task</div>
            </div>
          </button>

          {/* 4. Add Expense */}
          <button
            onClick={() => setActiveModal('add_expense')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-blue-700">Add Expense</div>
              <div className="text-[10px] text-gray-500 font-medium">Track your cost</div>
            </div>
          </button>

          {/* 5. Add Income */}
          <button
            onClick={() => setActiveModal('add_income')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">Add Income</div>
              <div className="text-[10px] text-gray-500 font-medium">Record your sale</div>
            </div>
          </button>

          {/* 6. Add Worker */}
          <button
            onClick={() => setActiveModal('add_worker')}
            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 shadow-2xs hover:shadow-xs hover:border-sky-300 transition-all text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0ea5e9] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-sky-700">Add Worker</div>
              <div className="text-[10px] text-gray-500 font-medium">Manage workers</div>
            </div>
          </button>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. MAIN 2-COLUMN DASHBOARD GRID */}
        {/* ----------------------------------------------------------------------- */}
        <div className="grid grid-cols-12 gap-3">

          {/* --------------------------------------------------------------------- */}
          {/* LEFT / CENTER COLUMN (~68% width on desktop, 8 columns) */}
          {/* --------------------------------------------------------------------- */}
          <div className="col-span-12 lg:col-span-8 space-y-3">

            {/* CARD 1: My Fields */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sprout className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0f2438]">My Fields</h3>
                </div>
                <button
                  onClick={() => setActiveModal('all_fields')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Field Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {fields.map((field: any) => (
                  <div
                    key={field.id}
                    className="border border-gray-100 rounded-xl p-2.5 bg-gray-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-2xs transition-all relative flex flex-col justify-between"
                  >
                    {/* Field Photo with 3-dots top right */}
                    <div className="relative w-full h-[76px] rounded-lg overflow-hidden border border-gray-200/80 mb-2 bg-emerald-950">
                      <img
                        src={field.photo}
                        alt={field.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setSelectedField(field);
                          setActiveModal('field_details');
                        }}
                        className="absolute top-1 right-1 text-gray-700 bg-white/80 hover:bg-white p-0.5 rounded-md transition-colors cursor-pointer shadow-2xs"
                        title="Options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Field Title & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-[#0f2438]">{field.name}</div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          field.health_color === 'amber'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {field.health_badge}
                      </span>
                    </div>

                    {/* Area & Crop */}
                    <div className="text-[11px] text-gray-500 font-medium mt-0.5">{field.area}</div>
                    <div className="text-xs font-bold text-gray-800 mt-0.5">{field.crop}</div>

                    {/* Growth Stage & Progress */}
                    <div className="mt-2 pt-1 border-t border-gray-100">
                      <div className="flex items-center justify-between text-[10px] text-gray-600 font-semibold mb-1">
                        <span>Growth Stage: {field.growth_stage}</span>
                        <span className="font-bold text-[#0f2438]">{field.growth_percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#16a34a] transition-all duration-500"
                          style={{ width: `${field.growth_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: Two side-by-side cards (Crop Calendar & Farm Expenses & Income) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* CARD 2A: Crop Calendar Gantt */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <h3 className="text-xs font-bold text-[#0f2438]">Crop Calendar</h3>
                  </div>

                  {/* Season filter pills */}
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md text-[9px] font-bold">
                    {(['Current Season', 'Next Season', 'All Crops'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setCalendarSeason(s)}
                        className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          calendarSeason === s
                            ? 'bg-[#008037] text-white shadow-xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar Grid Header (Months) */}
                <div className="w-full">
                  <div className="flex items-center text-[8.5px] font-bold text-gray-400 py-1 border-b border-gray-100">
                    <div className="w-14 shrink-0 text-left pl-1"></div>
                    <div className="flex-1 grid grid-cols-12 text-center">
                      {cropCalendar.months.map((m: string) => (
                        <div key={m} className="truncate text-[8px]">{m}</div>
                      ))}
                    </div>
                  </div>

                  {/* Crop Gantt Rows */}
                  <div className="space-y-2 pt-2">
                    {displayedCrops.map((c: any) => (
                      <div key={c.crop} className="flex items-center text-[9px] py-0.5">
                        {/* Crop Name with Image Thumbnail */}
                        <div className="w-14 shrink-0 flex items-center gap-1.5 pr-1">
                          <img
                            src={c.icon}
                            alt={c.crop}
                            className="w-4 h-4 rounded-full border border-gray-200 object-cover shrink-0"
                          />
                          <span className="font-bold text-gray-800 text-[9.5px] truncate">{c.crop}</span>
                        </div>

                        {/* 12 Month Slots */}
                        <div className="flex-1 relative h-5 flex items-center">
                          {/* Grid vertical markers */}
                          <div className="absolute inset-0 grid grid-cols-12 divide-x divide-gray-100/60 pointer-events-none" />

                          {/* Render Stage Blocks */}
                          {c.stages.map((stage: any, sIdx: number) => {
                            const leftPercent = (stage.startIdx / 12) * 100;
                            const widthPercent = (stage.span / 12) * 100;
                            return (
                              <div
                                key={sIdx}
                                onClick={() => {
                                  const q = `Provide farming advisory and best practices for ${c.crop} during the "${stage.name}" stage in ${devLoc?.display_name || 'Siliguri'}. What fertilizers, irrigation, and pest precautions are needed?`;
                                  setAiQuestion(q);
                                  setActiveModal('ai_chat');
                                  handleAskAi(q);
                                }}
                                className="absolute h-4 rounded text-[6.5px] sm:text-[7px] font-bold flex items-center justify-center px-0.5 shadow-2xs whitespace-nowrap overflow-hidden transition-all hover:scale-105 z-10 cursor-pointer"
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`,
                                  backgroundColor: stage.bg,
                                  color: stage.text,
                                }}
                                title={`Click for AI guidance: ${c.crop} - ${stage.name}`}
                              >
                                {stage.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2B: Farm Expenses & Income */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <IndianRupee className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold text-[#0f2438]">Farm Expenses & Income</h3>
                  </div>
                  <button
                    onClick={() => setActiveModal('all_finances')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Two summary boxes */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Total Expenses */}
                  <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2">
                    <div className="text-[10px] font-semibold text-rose-800">Total Expenses</div>
                    <div className="text-sm sm:text-base font-black text-rose-900 mt-0.5">
                      {finance.total_expenses_formatted || data?.finance?.total_expenses_formatted || '₹ 12,500'}
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-0.5">
                      <span className="text-gray-500 font-medium">This Month</span>
                      <span className="text-rose-600 font-bold flex items-center">
                        <ArrowDown className="w-2.5 h-2.5 inline" /> {finance.expenses_trend || '12% vs last month'}
                      </span>
                    </div>
                  </div>

                  {/* Total Income */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2">
                    <div className="text-[10px] font-semibold text-emerald-800">Total Income</div>
                    <div className="text-sm sm:text-base font-black text-emerald-900 mt-0.5">
                      {finance.total_income_formatted || data?.finance?.total_income_formatted || '₹ 28,000'}
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-0.5">
                      <span className="text-gray-500 font-medium">This Month</span>
                      <span className="text-emerald-700 font-bold flex items-center">
                        <ArrowUp className="w-2.5 h-2.5 inline" /> {finance.income_trend || '18% vs last month'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grouped Bar Chart */}
                <div className="h-28 w-full">
                  <div className="flex items-center justify-end gap-3 text-[9px] font-bold mb-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-xs bg-[#10b981]" />
                      <span className="text-gray-600">Income</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-xs bg-[#f43f5e]" />
                      <span className="text-gray-600">Expenses</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={financeChartData} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 8, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `${val / 1000}K`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`₹ ${val.toLocaleString()}`]}
                        contentStyle={{ fontSize: 10, borderRadius: 8, padding: '4px 8px' }}
                      />
                      <Bar dataKey="income" fill="#10b981" radius={[3, 3, 0, 0]} barSize={8} isAnimationActive={false} />
                      <Bar dataKey="expenses" fill="#f43f5e" radius={[3, 3, 0, 0]} barSize={8} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* CARD 3: Recent Activities */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-[#0f2438]">Recent Activities</h3>
                </div>
                <button
                  onClick={() => setActiveModal('all_activities')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Activity Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {recentActivities.map((act: any) => (
                  <div
                    key={act.id}
                    onClick={() => {
                      const q = `Explain follow-up actions and agronomic best practices after "${act.title}" on ${act.detail} in ${devLoc?.display_name || 'Siliguri'}.`;
                      setAiQuestion(q);
                      setActiveModal('ai_chat');
                      handleAskAi(q);
                    }}
                    className="border border-gray-100 rounded-xl p-2 bg-gray-50/60 hover:bg-white hover:border-gray-200 transition-all flex items-center gap-2 cursor-pointer group"
                    title={`Click for AI advisory: ${act.title}`}
                  >
                    <div className="w-10 h-9 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-emerald-950">
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-gray-900 leading-tight">{act.title}</div>
                      <div className="text-[8.5px] text-gray-500 font-medium leading-tight mt-0.5 truncate">{act.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN (~32% width on desktop, 4 columns) */}
          {/* --------------------------------------------------------------------- */}
          <div className="col-span-12 lg:col-span-4 space-y-3">

            {/* CARD 1: Today's Weather with Google Maps Weather sync */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-[#0f2438]">Today's Weather</h3>
                </div>
                <button
                  onClick={handleOpenWeatherForecast}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View Forecast</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1 pb-1">
                <Sun className="w-8 h-8 text-amber-500 fill-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900 leading-tight">
                    {weather.temp_c || 28}°C
                  </span>
                  <span className="text-xs font-semibold text-gray-600 leading-tight">
                    {weather.condition || 'Sunny'}
                  </span>
                </div>
              </div>

              {/* 3 Metrics: Rain Chance, Humidity, Wind */}
              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-100 text-center">
                <div>
                  <div className="text-[9px] text-gray-500 font-medium">Rain Chance</div>
                  <div className="text-[11px] font-black text-gray-800">{weather.rain_chance_pct}%</div>
                </div>
                <div className="border-x border-gray-100">
                  <div className="text-[9px] text-gray-500 font-medium">Humidity</div>
                  <div className="text-[11px] font-black text-gray-800">{weather.humidity_pct}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 font-medium">Wind</div>
                  <div className="text-[11px] font-black text-gray-800">{weather.wind_speed_kmh} km/h</div>
                </div>
              </div>
            </div>

            {/* CARD 2: Today's Tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-[#0f2438]">Today's Tasks</h3>
                </div>
                <button
                  onClick={() => setActiveModal('all_tasks')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-2">
                {tasks.map((task: any) => {
                  const TaskIcon = task.icon || Sprout;
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        task.is_completed
                          ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                          : 'bg-gray-50/60 border-gray-100 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            task.color === 'sky'
                              ? 'bg-sky-100 text-sky-600'
                              : task.color === 'rose'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          <TaskIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-bold truncate ${
                              task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">{task.time}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold shrink-0 transition-colors cursor-pointer ${
                          task.is_completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#eef8ef] border border-[#a6d8ac] text-[#1e6a2b] hover:bg-emerald-100'
                        }`}
                      >
                        {task.is_completed ? '✓ Done' : 'Mark Done'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 3: Upcoming Activities */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-[#0f2438]">Upcoming Activities</h3>
                </div>
                <button
                  onClick={() => setActiveModal('all_upcoming')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upcoming List */}
              <div className="space-y-1.5">
                {upcomingActivities.map((item: any) => {
                  const ItemIcon =
                    item.icon === 'droplet'
                      ? Droplets
                      : item.icon === 'bug'
                      ? Bug
                      : item.icon === 'flask'
                      ? FlaskConical
                      : Sprout;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        const q = `Provide step-by-step preparation guidelines for upcoming activity "${item.title}" on ${item.subtitle} scheduled for ${item.day} ${item.month} in ${devLoc?.display_name || 'Siliguri'}.`;
                        setAiQuestion(q);
                        setActiveModal('ai_chat');
                        handleAskAi(q);
                      }}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      title={`Click for AI preparation advice: ${item.title}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Date badge */}
                        <div className="w-7 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-black text-gray-900 leading-none">{item.day}</span>
                          <span className="text-[9px] font-bold text-gray-500 uppercase leading-none mt-0.5">{item.month}</span>
                        </div>

                        {/* Icon */}
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                            item.color === 'sky'
                              ? 'bg-sky-100 text-sky-600'
                              : item.color === 'rose'
                              ? 'bg-rose-100 text-rose-600'
                              : item.color === 'teal'
                              ? 'bg-teal-100 text-teal-600'
                              : item.color === 'amber'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          <ItemIcon className="w-3 h-3" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate">{item.title}</div>
                          <div className="text-[10px] text-gray-500 font-medium truncate">{item.subtitle}</div>
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 4: Need Help? (KrishiGo AI Copilot) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-3 text-center">
              {/* Cute Mascot */}
              <div className="w-14 h-14 mx-auto mb-1.5 flex items-center justify-center">
                <img
                  src="/assets/farmer/farm_management/ai_mascot.png"
                  alt="KrishiGo AI Robot"
                  className="w-12 h-12 object-contain drop-shadow-sm"
                />
              </div>

              <h4 className="text-xs sm:text-sm font-black text-[#0f2438]">Need Help?</h4>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium max-w-[240px] mx-auto mt-0.5 mb-2.5">
                Ask AI about farm management, crop schedule, cost planning and more.
              </p>

              {/* 4 Action Pill Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setActiveModal('ai_chat')}
                  className="bg-[#008037] hover:bg-[#006e2e] text-white py-1.5 px-1 rounded-xl shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold">Chat</span>
                </button>

                <button
                  onClick={handleVoiceInput}
                  className={`bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                    isListening ? 'ring-2 ring-emerald-500 bg-emerald-50 text-emerald-800' : ''
                  }`}
                  title="Voice Query"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-emerald-600' : ''}`} />
                  <span className="text-[9px] font-bold">Voice</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors"
                  title="Upload Photo for AI Crop Diagnosis"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[9px] font-bold">Upload</span>
                </button>

                <button
                  onClick={() => docInputRef.current?.click()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors"
                  title="Attach Farm Record / Document"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold">File</span>
                </button>
              </div>

              {/* Hidden file inputs for Upload and File */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                ref={docInputRef}
                onChange={handleDocFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ----------------------------------------------------------------------- */}

      {/* MODAL 1: Add Crop */}
      {activeModal === 'add_crop' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Plan New Crop</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const cropName = newCropName.trim() || 'Mustard';
                await api.addCrop({
                  crop: cropName,
                  field: newCropField,
                  sowing_date: newCropSowingDate,
                  harvest_date: newCropHarvestDate,
                });
                setFields((prev) => {
                  const updated = [...prev];
                  const matchIdx = updated.findIndex((f) => newCropField.includes(f.name));
                  if (matchIdx >= 0) {
                    updated[matchIdx] = {
                      ...updated[matchIdx],
                      crop: `${cropName} (Planned)`,
                      growth_stage: 'Planned Sowing',
                      growth_percent: 5,
                    };
                  }
                  return updated;
                });
                setNewCropName('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mustard, Wheat, Potato"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Assigned Field</label>
                <select
                  value={newCropField}
                  onChange={(e) => setNewCropField(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={`${f.name} (${f.area})`}>
                      {f.name} ({f.area})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Sowing Date</label>
                  <input
                    type="date"
                    value={newCropSowingDate}
                    onChange={(e) => setNewCropSowingDate(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Harvest Date</label>
                  <input
                    type="date"
                    value={newCropHarvestDate}
                    onChange={(e) => setNewCropHarvestDate(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#008037] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                Save Planned Crop
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Field */}
      {activeModal === 'add_field' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Add New Field Parcel</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = newFieldName.trim() || `Field ${fields.length + 1}`;
                const acres = newFieldAcres.trim() ? `${newFieldAcres.trim()} Acres` : '1.5 Acres';
                const lat = Number(((devLoc?.latitude || 26.7271) + 0.002 * (fields.length + 1)).toFixed(5));
                const lng = Number(((devLoc?.longitude || 88.3953) + 0.002 * (fields.length + 1)).toFixed(5));
                const newFieldObj = {
                  id: `field_${Date.now()}`,
                  name: name,
                  crop: 'Unassigned',
                  area: acres,
                  health_badge: '● Good',
                  health_color: 'emerald',
                  growth_stage: 'Land Preparation',
                  growth_percent: 10,
                  photo: '/assets/farmer/farm_management/field1_rice_pure.jpg',
                  latitude: lat,
                  longitude: lng,
                  google_map_link: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                };
                setFields((prev) => [...prev, newFieldObj]);
                await api.addField({ name, acres, soil_type: newFieldSoil });
                setNewFieldName('');
                setNewFieldAcres('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Field Name</label>
                <input
                  type="text"
                  placeholder="e.g. Field 4 (North Parcel)"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Area (Acres)</label>
                  <input
                    type="text"
                    placeholder="1.5"
                    value={newFieldAcres}
                    onChange={(e) => setNewFieldAcres(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Soil Type</label>
                  <select
                    value={newFieldSoil}
                    onChange={(e) => setNewFieldSoil(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  >
                    <option>Loamy Soil</option>
                    <option>Sandy Loam</option>
                    <option>Clay Loam</option>
                    <option>Black Soil</option>
                  </select>
                </div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                <span>📍 Auto-detected GPS Coordinates:</span>
                <span className="font-bold">{devLoc?.latitude?.toFixed(4) || '26.7271'}°, {devLoc?.longitude?.toFixed(4) || '88.3953'}°</span>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#008037] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                Register Field
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Task */}
      {activeModal === 'add_task' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Create Farm Task</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const title = newTaskTitle.trim() || 'Fertilizer Top Dressing';
                const time = newTaskTime.trim() || '3:00 PM – 5:00 PM';
                const newTask = {
                  id: `task_${Date.now()}`,
                  title: title,
                  time: time,
                  field_name: newTaskField,
                  crop: newTaskField.includes('Tomato') ? 'Tomato' : newTaskField.includes('Maize') ? 'Maize' : 'Rice',
                  icon: Sprout,
                  color: 'emerald',
                  is_completed: false,
                };
                setTasks((prev) => [newTask, ...prev]);
                await api.createTask({
                  title: newTask.title,
                  scheduled_time: newTask.time,
                  field_name: newTask.field_name,
                  crop_name: newTask.crop,
                });
                setNewTaskTitle('');
                setNewTaskTime('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Spray bio-fungicide, Weeding"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Time Window</label>
                <input
                  type="text"
                  placeholder="e.g. 7:00 AM – 9:00 AM"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Assigned Field</label>
                <select
                  value={newTaskField}
                  onChange={(e) => setNewTaskField(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={`${f.name} (${f.crop})`}>
                      {f.name} ({f.crop})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#ef4444] text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Expense */}
      {activeModal === 'add_expense' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Record Expense</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const amt = parseFloat(newExpenseAmount || '1500') || 1500;
                await api.addExpense({ amount: amt, category: newExpenseCategory });
                setFinance((prev) => {
                  const newExp = prev.total_expenses + amt;
                  return {
                    ...prev,
                    total_expenses: newExp,
                    total_expenses_formatted: `₹ ${newExp.toLocaleString()}`,
                  };
                });
                setFinanceChartData((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx >= 0) {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      expenses: updated[lastIdx].expenses + amt,
                    };
                  }
                  return updated;
                });
                setNewExpenseAmount('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Category</label>
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                >
                  <option>Fertilizer & Nutrients</option>
                  <option>Seeds & Seedlings</option>
                  <option>Labor Wages</option>
                  <option>Diesel / Electricity for Irrigation</option>
                  <option>Pesticides / Bio-protection</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#3b82f6] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Income */}
      {activeModal === 'add_income' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Record Farm Income</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const amt = parseFloat(newIncomeAmount || '5000') || 5000;
                await api.addIncome({ amount: amt, source: newIncomeSource });
                setFinance((prev) => {
                  const newInc = prev.total_income + amt;
                  return {
                    ...prev,
                    total_income: newInc,
                    total_income_formatted: `₹ ${newInc.toLocaleString()}`,
                  };
                });
                setFinanceChartData((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx >= 0) {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      income: updated[lastIdx].income + amt,
                    };
                  }
                  return updated;
                });
                setNewIncomeAmount('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Amount Received (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newIncomeAmount}
                  onChange={(e) => setNewIncomeAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Income Source</label>
                <select
                  value={newIncomeSource}
                  onChange={(e) => setNewIncomeSource(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                >
                  <option>Tomato Harvest Sale (Mandi)</option>
                  <option>Direct Consumer Sale</option>
                  <option>Rice Paddy Advance</option>
                  <option>Government Subsidy / DBT</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#10b981] text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
              >
                Log Income
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Add Worker */}
      {activeModal === 'add_worker' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Add Farm Worker</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const name = newWorkerName.trim() || 'Ramesh Kumar';
                const wage = newWorkerWage.trim() || '400';
                await api.addWorker({ name, daily_wage: wage, role: newWorkerRole });
                setNewWorkerName('');
                setNewWorkerWage('');
                setActiveModal(null);
              }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs font-bold text-gray-700">Worker Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Daily Wage (₹)</label>
                  <input
                    type="number"
                    placeholder="400"
                    value={newWorkerWage}
                    onChange={(e) => setNewWorkerWage(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Role</label>
                  <select
                    value={newWorkerRole}
                    onChange={(e) => setNewWorkerRole(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  >
                    <option>Weeding & Intercultural</option>
                    <option>Irrigation Operator</option>
                    <option>Sprayer Operator</option>
                    <option>Harvest Labor</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#0ea5e9] text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-xs cursor-pointer"
              >
                Add Worker
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: KrishiGo AI Copilot Chat */}
      {activeModal === 'ai_chat' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/farmer/farm_management/ai_mascot.png"
                  alt="KrishiGo AI Mascot"
                  className="w-9 h-9 object-contain"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-1.5">
                    <span>KrishiGo Farm Copilot</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Google Gemini 2.5
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {devLoc?.display_name || 'Siliguri, West Bengal'} • Operations & Advisory
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Display */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[180px]">
              {/* Image preview badge */}
              {uploadedImage && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <img src={uploadedImage} alt="Uploaded sample" className="w-10 h-10 object-cover rounded-lg border border-emerald-300" />
                  <div className="text-[11px] text-emerald-900 font-semibold flex-1">
                    <span>Farm photo sample attached for Gemini 2.5 multimodal inspection</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Document preview badge */}
              {uploadedDocName && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px] text-blue-900 font-semibold truncate flex-1">{uploadedDocName}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedDocName(null)}
                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isAskingAi ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-gray-600">
                    Consulting Google Gemini 2.5 Agricultural Intelligence...
                  </p>
                </div>
              ) : aiAnswer ? (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-gray-800 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advisory Answer:</span>
                  </div>
                  <div className="whitespace-pre-line text-xs font-medium text-gray-800">
                    {aiAnswer}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <img
                    src="/assets/farmer/farm_management/ai_mascot.png"
                    alt="AI Mascot"
                    className="w-12 h-12 mx-auto mb-2 opacity-60 object-contain"
                  />
                  <p className="text-xs font-semibold text-gray-600">
                    Ask any question about your farm operations, crop schedule, cost planning and more.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {[
                      'When should I harvest Field 2 Tomato?',
                      'How to reduce fertilizer expenses?',
                      'Field 3 Maize weed management',
                      'Tomato flowering spray advice',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setAiQuestion(sample);
                          handleAskAi(sample);
                        }}
                        className="text-[11px] bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer transition-colors"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="pt-2 border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about crops, tasks, costs, labor..."
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer ${
                  isListening ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' : ''
                }`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isAskingAi}
                className="px-4 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isAskingAi ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: All Fields */}
      {activeModal === 'all_fields' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">All Field Parcels</h3>
                  <p className="text-[11px] text-gray-500">{fields.length} active registered parcels in {devLoc?.display_name || 'Siliguri'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-emerald-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={field.photo}
                      alt={field.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{field.name}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            field.health_color === 'amber'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {field.health_badge}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 font-semibold mt-0.5">
                        {field.crop} • {field.area}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Growth Stage: <b>{field.growth_stage}</b> ({field.growth_percent}%)
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${field.latitude || 26.7271},${field.longitude || 88.3953}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{field.latitude?.toFixed(4) || '26.7271'}°, {field.longitude?.toFixed(4) || '88.3953'}°</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => {
                        const q = `Give me an in-depth agronomic and profitability status review for ${field.name} growing ${field.crop} (${field.area}) at growth stage ${field.growth_stage}.`;
                        setAiQuestion(q);
                        setActiveModal('ai_chat');
                        handleAskAi(q);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Consult AI
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setActiveModal('add_field')}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Field</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: All Tasks */}
      {activeModal === 'all_tasks' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Today's Task Schedule</h3>
                  <p className="text-[11px] text-gray-500">{tasks.filter((t) => !t.is_completed).length} pending tasks remaining</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {tasks.map((task) => {
                const TaskIcon = task.icon || Sprout;
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      task.is_completed
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                        : 'bg-gray-50/60 border-gray-100 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          task.color === 'sky'
                            ? 'bg-sky-100 text-sky-600'
                            : task.color === 'rose'
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        <TaskIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate ${
                            task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {task.time} • {task.field_name}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`px-3 py-1 rounded-md text-[10px] font-semibold shrink-0 transition-colors cursor-pointer ${
                        task.is_completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#eef8ef] border border-[#a6d8ac] text-[#1e6a2b] hover:bg-emerald-100'
                      }`}
                    >
                      {task.is_completed ? '✓ Completed' : 'Mark Done'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setActiveModal('add_task')}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Task</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Farm Finances Details */}
      {activeModal === 'all_finances' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Farm Finances & Margins</h3>
                  <p className="text-[11px] text-gray-500">Live operational ledger for {devLoc?.display_name || 'Siliguri'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-3 overflow-y-auto">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                  <div className="text-[10px] text-emerald-800 font-semibold">Total Revenue</div>
                  <div className="text-sm font-black text-emerald-950 mt-0.5">{finance.total_income_formatted}</div>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                  <div className="text-[10px] text-rose-800 font-semibold">Total Costs</div>
                  <div className="text-sm font-black text-rose-950 mt-0.5">{finance.total_expenses_formatted}</div>
                </div>
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200 text-center">
                  <div className="text-[10px] text-sky-800 font-semibold">Net Profit</div>
                  <div className="text-sm font-black text-sky-950 mt-0.5">
                    +₹ {(Math.max(0, finance.total_income - finance.total_expenses)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 space-y-1.5 text-xs">
                <div className="font-bold text-gray-900 mb-1">Cost & Sales Highlights:</div>
                <div className="flex justify-between text-gray-600">
                  <span>Fertilizer & Nutrition:</span>
                  <span className="font-semibold text-gray-900">₹ 4,200</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Irrigation & Electricity:</span>
                  <span className="font-semibold text-gray-900">₹ 2,800</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Labor Wages (Weeding / Spraying):</span>
                  <span className="font-semibold text-gray-900">₹ 3,600</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Seeds & Protection:</span>
                  <span className="font-semibold text-gray-900">₹ 1,900</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModal('add_expense')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  + Add Expense
                </button>
                <button
                  onClick={() => setActiveModal('add_income')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  + Add Income
                </button>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: All Activities */}
      {activeModal === 'all_activities' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Recent Activity Log</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {recentActivities.map((act: any) => (
                <div
                  key={act.id}
                  onClick={() => {
                    const q = `Explain follow-up actions and agronomic best practices after "${act.title}" on ${act.detail} in ${devLoc?.display_name || 'Siliguri'}.`;
                    setAiQuestion(q);
                    setActiveModal('ai_chat');
                    handleAskAi(q);
                  }}
                  className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-200 transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{act.title}</div>
                      <div className="text-[11px] text-gray-500 font-medium mt-0.5">{act.detail}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 hover:underline">
                    Get Advisory →
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upcoming Activities */}
      {activeModal === 'all_upcoming' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Upcoming Agricultural Calendar</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {upcomingActivities.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const q = `Provide step-by-step preparation guidelines for upcoming activity "${item.title}" on ${item.subtitle} scheduled for ${item.day} ${item.month} in ${devLoc?.display_name || 'Siliguri'}.`;
                    setAiQuestion(q);
                    setActiveModal('ai_chat');
                    handleAskAi(q);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-gray-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-black text-gray-900 leading-none">{item.day}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase leading-none mt-0.5">{item.month}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{item.title}</div>
                      <div className="text-[10px] text-gray-500 font-medium">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 hover:underline">
                    Prepare with AI →
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Weather Forecast */}
      {activeModal === 'weather_forecast' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">15-Day Agricultural Weather Forecast</h3>
                  <p className="text-[11px] text-gray-500">Live Google Maps Platform Weather Telemetry for {devLoc?.display_name || 'Siliguri'}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {/* Current Overview */}
              <div className="bg-linear-to-r from-amber-50 to-emerald-50 rounded-2xl p-3 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-10 h-10 text-amber-500 fill-amber-400 shrink-0" />
                  <div>
                    <div className="text-xl font-black text-gray-900">{weather.temp_c}°C • {weather.condition}</div>
                    <div className="text-xs text-gray-600 font-medium">
                      Humidity: {weather.humidity_pct}% | Rain Probability: {weather.rain_chance_pct}% | Wind: {weather.wind_speed_kmh} km/h
                    </div>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Optimal Spray Window
                  </span>
                </div>
              </div>

              {/* 15 Days List or Fallback */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(weatherForecastList.length > 0
                  ? weatherForecastList.slice(0, 9)
                  : [
                      { day: 'Tomorrow', condition: 'Sunny', high: 32, low: 24, rain: 10 },
                      { day: 'Day 3', condition: 'Partly Cloudy', high: 31, low: 23, rain: 20 },
                      { day: 'Day 4', condition: 'Light Drizzle', high: 29, low: 22, rain: 60 },
                      { day: 'Day 5', condition: 'Sunny', high: 33, low: 24, rain: 15 },
                      { day: 'Day 6', condition: 'Clear', high: 34, low: 25, rain: 5 },
                      { day: 'Day 7', condition: 'Scattered Showers', high: 30, low: 23, rain: 45 },
                    ]
                ).map((f: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/80 flex flex-col justify-between">
                    <div className="text-xs font-bold text-gray-900">{f.day_name || f.day}</div>
                    <div className="text-[11px] text-gray-600 font-medium my-1">{f.condition}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-gray-900">{f.high_c || f.high}° / {f.low_c || f.low}°C</span>
                      <span className="text-blue-600 font-semibold">{f.rain_chance_pct || f.rain}% Rain</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Field Details */}
      {activeModal === 'field_details' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {(selectedField || fields[0]).name} Specification
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-3">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={(selectedField || fields[0]).photo}
                  alt={(selectedField || fields[0]).name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Crop:</span>
                  <div className="font-bold text-gray-900 mt-0.5">{(selectedField || fields[0]).crop}</div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Total Area:</span>
                  <div className="font-bold text-gray-900 mt-0.5">{(selectedField || fields[0]).area}</div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Growth Stage:</span>
                  <div className="font-bold text-gray-900 mt-0.5">{(selectedField || fields[0]).growth_stage}</div>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Health Status:</span>
                  <div className="font-bold text-emerald-700 mt-0.5">{(selectedField || fields[0]).health_badge}</div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${(selectedField || fields[0]).latitude || 26.7271},${(selectedField || fields[0]).longitude || 88.3953}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate on Google Maps Satellite</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  const targetField = selectedField || fields[0];
                  const q = `Provide tailored recommendations for ${targetField.name} currently in the ${targetField.growth_stage} stage with crop ${targetField.crop} in ${devLoc?.display_name || 'Siliguri'}.`;
                  setAiQuestion(q);
                  setActiveModal('ai_chat');
                  handleAskAi(q);
                }}
                className="w-full py-2.5 bg-[#008037] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Ask Farm Copilot About This Field
              </button>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};

export default FarmManagementPage;
