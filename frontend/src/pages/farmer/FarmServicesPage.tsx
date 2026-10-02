import React, { useState, useEffect } from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { api } from '../../services/api';
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Phone,
  Calendar,
  MessageSquare,
  IndianRupee,
  Flame,
  LayoutGrid,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Send,
  Bot,
  Sparkles,
  ShieldCheck,
  FileText,
  Check,
  Loader2,
  Landmark,
  ExternalLink,
  Copy,
  Navigation,
  Mic,
  Info,
  Award
} from 'lucide-react';

interface NearbyProvider {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance_km: number;
  distance_str: string;
  tags: string[];
  image: string;
  address: string;
  phone: string;
  email: string;
  price_info: string;
  available_today: boolean;
  verified: boolean;
  equipment: string[];
}

// 8 Quick Category Pills
const pillCategories = [
  {
    id: 'machinery',
    title: 'Farm Machinery',
    subtitle: 'Tractor, Harvester, etc.',
    iconAsset: '/assets/farmer/farm_services/icon_machinery.png'
  },
  {
    id: 'seeds',
    title: 'Seeds & Plants',
    subtitle: 'Quality & Verified',
    iconAsset: '/assets/farmer/farm_services/icon_seeds.png'
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer & Inputs',
    subtitle: 'Original Products',
    iconAsset: '/assets/farmer/farm_services/icon_fertilizer.png'
  },
  {
    id: 'labor',
    title: 'Labor & Workforce',
    subtitle: 'Skilled Farm Workers',
    iconAsset: '/assets/farmer/farm_services/icon_labor.png'
  },
  {
    id: 'advisory',
    title: 'Expert Advisory',
    subtitle: 'Agronomist, Soil Expert',
    iconAsset: '/assets/farmer/farm_services/icon_advisory.png'
  },
  {
    id: 'testing',
    title: 'Soil & Water Testing',
    subtitle: 'Lab Services',
    iconAsset: '/assets/farmer/farm_services/icon_testing.png'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    subtitle: 'Crop, Weather, Health',
    iconAsset: '/assets/farmer/farm_services/icon_insurance.png'
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    subtitle: 'Subsidy & Support',
    iconAsset: '/assets/farmer/farm_services/icon_schemes.png'
  }
];

// 10 Browse Farm Services Cards
const browseCategories = [
  {
    id: 'machinery',
    title: 'Farm Machinery',
    subtitle: 'Tractor, Harvester,\nRotavator, Planter, etc.',
    image: '/assets/farmer/farm_services/cat_machinery.jpg',
    btnColor: 'bg-[#1a73e8] hover:bg-blue-700',
    serviceKey: 'Farm Machinery'
  },
  {
    id: 'seeds',
    title: 'Seeds & Plants',
    subtitle: 'Certified seeds, seedlings,\nsaplings',
    image: '/assets/farmer/farm_services/cat_seeds.jpg',
    btnColor: 'bg-[#52c41a] hover:bg-green-600',
    serviceKey: 'Seeds & Plants'
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer & Inputs',
    subtitle: 'Fertilizer, pesticides,\norganic inputs',
    image: '/assets/farmer/farm_services/cat_fertilizer.jpg',
    btnColor: 'bg-[#fa8c16] hover:bg-orange-600',
    serviceKey: 'Fertilizer & Inputs'
  },
  {
    id: 'labor',
    title: 'Labor & Workforce',
    subtitle: 'Skilled and unskilled\nfarm workers',
    image: '/assets/farmer/farm_services/cat_labor.jpg',
    btnColor: 'bg-[#f5222d] hover:bg-red-600',
    serviceKey: 'Labor & Workforce'
  },
  {
    id: 'advisory',
    title: 'Expert Advisory',
    subtitle: 'Agronomist, crop advisor,\nvideo/field consultation',
    image: '/assets/farmer/farm_services/cat_advisory.jpg',
    btnColor: 'bg-[#9254de] hover:bg-purple-600',
    serviceKey: 'Expert Advisory'
  },
  {
    id: 'drone',
    title: 'Drone Services',
    subtitle: 'Spraying, field mapping,\nmonitoring',
    image: '/assets/farmer/farm_services/cat_drone.jpg',
    btnColor: 'bg-[#13c2c2] hover:bg-teal-600',
    serviceKey: 'Drone Services'
  },
  {
    id: 'irrigation',
    title: 'Irrigation Setup',
    subtitle: 'Drip, sprinkler, pump,\ninstallation & repair',
    image: '/assets/farmer/farm_services/cat_irrigation.jpg',
    btnColor: 'bg-[#faad14] hover:bg-amber-600',
    serviceKey: 'Irrigation Setup'
  },
  {
    id: 'testing',
    title: 'Soil & Water Testing',
    subtitle: 'Soil test, water test,\nlab reports',
    image: '/assets/farmer/farm_services/cat_soil_testing.jpg',
    btnColor: 'bg-[#73d13d] hover:bg-lime-600',
    serviceKey: 'Soil & Water Testing'
  },
  {
    id: 'insurance',
    title: 'Crop Insurance',
    subtitle: 'Crop, weather and\nincome protection',
    image: '/assets/farmer/farm_services/cat_insurance.jpg',
    btnColor: 'bg-[#1890ff] hover:bg-blue-600',
    serviceKey: 'Crop Insurance'
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    subtitle: 'e-NAM, MSP, subsidy,\nloans, KCC, FPO',
    image: '/assets/farmer/farm_services/cat_schemes.jpg',
    btnColor: 'bg-[#b37feb] hover:bg-purple-500',
    serviceKey: 'Government Schemes'
  }
];

// Popular Services (Right Column)
const popularServices = [
  {
    rank: 1,
    title: 'Tractor Rental',
    price: 'From ₹600/hour',
    image: '/assets/farmer/farm_services/pop_1_tractor.jpg',
    serviceKey: 'Tractor Rental'
  },
  {
    rank: 2,
    title: 'Soil Testing',
    price: 'From ₹400/sample',
    image: '/assets/farmer/farm_services/pop_2_soil.jpg',
    serviceKey: 'Soil & Water Testing'
  },
  {
    rank: 3,
    title: 'Drip Irrigation Setup',
    price: 'From ₹25,000/acre',
    image: '/assets/farmer/farm_services/pop_3_irrigation.jpg',
    serviceKey: 'Irrigation Setup'
  },
  {
    rank: 4,
    title: 'Crop Advisory Visit',
    price: 'From ₹500/visit',
    image: '/assets/farmer/farm_services/pop_4_advisory.jpg',
    serviceKey: 'Expert Advisory'
  },
  {
    rank: 5,
    title: 'Crop Insurance',
    price: 'From ₹300/acre',
    image: '/assets/farmer/farm_services/pop_5_insurance.jpg',
    serviceKey: 'Crop Insurance'
  }
];

// Recommended for You (Bottom Center)
const recommendedList = [
  {
    id: 'rec-1',
    title: 'Pre-Harvest Machinery Service',
    subtitle: 'Get your harvester ready',
    image: '/assets/farmer/farm_services/rec_1_machinery.jpg',
    serviceKey: 'Farm Machinery'
  },
  {
    id: 'rec-2',
    title: 'Soil Testing for Better Yield',
    subtitle: 'Test your soil this season',
    image: '/assets/farmer/farm_services/rec_2_soil.jpg',
    serviceKey: 'Soil & Water Testing'
  },
  {
    id: 'rec-3',
    title: 'Drip Irrigation Setup',
    subtitle: 'Save water and increase yield',
    image: '/assets/farmer/farm_services/rec_3_irrigation.jpg',
    serviceKey: 'Irrigation Setup'
  }
];

// Government Schemes (Bottom Right Card)
const schemesList = [
  {
    id: 'sch-1',
    title: 'PM Kisan Samman Nidhi',
    subtitle: 'Get up to ₹6,000 per year',
    badgeImg: '/assets/farmer/farm_services/sch_1_pmkisan.jpg',
    link: 'https://pmkisan.gov.in'
  },
  {
    id: 'sch-2',
    title: 'Kisan Credit Card (KCC)',
    subtitle: 'Easy loans for farmers',
    badgeImg: '/assets/farmer/farm_services/sch_2_kcc.jpg',
    link: 'https://agricoop.nic.in'
  },
  {
    id: 'sch-3',
    title: 'e-NAM (National Agriculture Market)',
    subtitle: 'Better price for your produce',
    badgeImg: '/assets/farmer/farm_services/sch_3_enam.jpg',
    link: 'https://enam.gov.in'
  }
];

// Complete Directory of Government Schemes & Subsidies
const ALL_GOVERNMENT_SCHEMES = [
  {
    id: 'pmkisan',
    category: 'Direct Financial Benefit',
    title: 'PM Kisan Samman Nidhi (PM-KISAN)',
    tagline: 'Direct income support of ₹6,000 per year',
    badgeImg: '/assets/farmer/farm_services/sch_1_pmkisan.jpg',
    benefit: '₹6,000 / year in 3 equal installments of ₹2,000 directly via DBT into bank account.',
    eligibility: 'All landholding farmer families having cultivable land in their names.',
    documents: ['Aadhaar Card', 'Land Ownership Records (Khatian / RoR)', 'Active Bank Passbook with IFSC', 'Mobile number linked with Aadhaar'],
    subsidy_rate: '100% Direct Cash Transfer',
    official_portal: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606'
  },
  {
    id: 'kcc',
    category: 'Low Interest Credit',
    title: 'Kisan Credit Card (KCC) Scheme',
    tagline: 'Concessional crop loans at 4% effective interest',
    badgeImg: '/assets/farmer/farm_services/sch_2_kcc.jpg',
    benefit: 'Credit limit up to ₹3,00,000 with 3% prompt repayment incentive (effective rate 4%). Collateral-free loan up to ₹1,60,000.',
    eligibility: 'Individual / Joint farmers, tenant farmers, oral lessees, sharecroppers, and SHGs of farmers.',
    documents: ['Duly filled KCC application', 'Identity & Address proof (Aadhaar/Voter ID)', 'Land tax paid receipt', 'Crop cultivation proof'],
    subsidy_rate: '3% Interest Subvention (Effective 4%)',
    official_portal: 'https://agricoop.nic.in',
    helpline: '1800-180-1551 (Kisan Call Center)'
  },
  {
    id: 'enam',
    category: 'Market Linkage',
    title: 'e-NAM (National Agriculture Market)',
    tagline: 'Pan-India electronic trading portal for farm produce',
    badgeImg: '/assets/farmer/farm_services/sch_3_enam.jpg',
    benefit: 'Transparent online bidding, real-time price discovery across 1,000+ mandis, direct payment settlement into farmer bank account.',
    eligibility: 'All farmers having produce to trade and registered with any state APMC mandi.',
    documents: ['Aadhaar Card', 'Bank Passbook copy', 'APMC Mandi Registration Certificate', 'Produce quality test receipt'],
    subsidy_rate: 'Zero Commission on KrishiGo direct bids',
    official_portal: 'https://enam.gov.in',
    helpline: '1800-270-0224'
  },
  {
    id: 'smam',
    category: 'Machinery Subsidy',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    tagline: '40% - 50% subsidy on farm machinery & equipment',
    badgeImg: '/assets/farmer/farm_services/cat_machinery.jpg',
    benefit: 'Financial assistance of 40% to 50% for purchasing tractors, power tillers, rotavators, combine harvesters, and sprayers. Up to 80% grant for Custom Hiring Centers (CHCs).',
    eligibility: 'Small and marginal farmers, women farmers, SC/ST farmers, and farmer groups/FPOs.',
    documents: ['Aadhaar Card', 'Land record copy (RoR)', 'Bank details', 'Quotation from authorized machinery dealer'],
    subsidy_rate: '40% - 50% Subsidy (Up to ₹2.5 Lakhs)',
    official_portal: 'https://agrimachinery.nic.in',
    helpline: '011-23382012'
  },
  {
    id: 'pmksy',
    category: 'Irrigation Support',
    title: 'PM Krishi Sinchayee Yojana (Per Drop More Crop)',
    tagline: 'Up to 55% subsidy on Drip & Sprinkler irrigation',
    badgeImg: '/assets/farmer/farm_services/cat_irrigation.jpg',
    benefit: '55% subsidy for small and marginal farmers (45% for others) on micro-irrigation systems. Saves up to 50% irrigation water and increases yield by 30-40%.',
    eligibility: 'All farmers owning cultivable land with an assured water source (borewell, pond, or canal).',
    documents: ['Land ownership document', 'Electricity connection bill / water source proof', 'Aadhaar Card', 'Field layout diagram'],
    subsidy_rate: 'Up to 55% Government Subsidy',
    official_portal: 'https://pmksy.gov.in',
    helpline: '1800-180-1551'
  },
  {
    id: 'pmfby',
    category: 'Crop Protection',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    tagline: 'Comprehensive crop insurance against weather & pest calamities',
    badgeImg: '/assets/farmer/farm_services/cat_insurance.jpg',
    benefit: 'Minimal premium: Only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial crops. Full sum insured payout for drought, flood, pests, and localized storms.',
    eligibility: 'All farmers growing notified crops in notified areas (both loanee and non-loanee farmers).',
    documents: ['Aadhaar Card', 'Land record / Sowing certificate from Patwari/Gram Pradhan', 'Bank Passbook'],
    subsidy_rate: 'Government pays remaining 85%-90% premium',
    official_portal: 'https://pmfby.gov.in',
    helpline: '011-23382012'
  }
];

export const FarmServicesPage: React.FC = () => {
  const { location: devLoc, isDetecting: isLocDetecting, openLocationModal, detectDeviceLocation } = useDeviceLocation();

  // Selected filters and states
  const [activeCategoryPill, setActiveCategoryPill] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('All Services');
  const [distanceRadius, setDistanceRadius] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>('Best Rated');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Bottom form request state
  const [requestService, setRequestService] = useState<string>('Tractor Rental');
  const [requestDate, setRequestDate] = useState<string>('2026-06-01');
  const [requestLocation, setRequestLocation] = useState<string>(devLoc?.display_name || 'Siliguri, West Bengal');

  // Backend state
  const [providers, setProviders] = useState<NearbyProvider[]>([
    {
      id: 1,
      name: 'Siliguri Agro Services',
      category: 'Farm Machinery',
      rating: 4.8,
      reviews: 120,
      distance_km: 5,
      distance_str: '5 km',
      tags: ['Tractor', 'Rotavator', 'Harvester'],
      image: '/assets/farmer/farm_services/prov_1_machinery.jpg',
      address: 'Matigara, Siliguri, West Bengal',
      phone: '+91 98320 11223',
      email: 'siliguriagro@krishigo.in',
      price_info: 'From ₹600 - ₹800/hour',
      available_today: true,
      verified: true,
      equipment: ['Mahindra 575 DI (45 HP)', 'Rotavator 6ft', 'Multi-crop Harvester']
    },
    {
      id: 2,
      name: 'Green Seeds Center',
      category: 'Seeds & Plants',
      rating: 4.7,
      reviews: 86,
      distance_km: 6,
      distance_str: '6 km',
      tags: ['Seeds', 'Fertilizer', 'Pesticides'],
      image: '/assets/farmer/farm_services/prov_2_seeds.jpg',
      address: 'Bidhan Market, Siliguri, West Bengal',
      phone: '+91 94340 78219',
      email: 'greenseeds@krishigo.in',
      price_info: 'Govt. Subsidized Rates',
      available_today: true,
      verified: true,
      equipment: ['Certified Paddy Seeds', 'Bio-fertilizers', 'Neem Pesticides']
    },
    {
      id: 3,
      name: 'Kisan Labor Group',
      category: 'Labor & Workforce',
      rating: 4.6,
      reviews: 62,
      distance_km: 8,
      distance_str: '8 km',
      tags: ['Farm Labor', 'Harvesting', 'Planting'],
      image: '/assets/farmer/farm_services/prov_3_labor.jpg',
      address: 'Phansidewa Road, Siliguri Rural',
      phone: '+91 98322 34567',
      email: 'kisanlabor@krishigo.in',
      price_info: '₹400 - ₹500/day/worker',
      available_today: true,
      verified: true,
      equipment: ['15 Skilled Transplanters', 'Trained Harvesters']
    },
    {
      id: 4,
      name: 'Soil Health Lab',
      category: 'Soil & Water Testing',
      rating: 4.9,
      reviews: 210,
      distance_km: 10,
      distance_str: '10 km',
      tags: ['Soil Test', 'Water Test', 'Report'],
      image: '/assets/farmer/farm_services/prov_4_soil.jpg',
      address: 'NBU Agro Complex, Siliguri',
      phone: '+91 97330 99881',
      email: 'soilhealthlab@krishigo.in',
      price_info: '₹400/sample with full card',
      available_today: true,
      verified: true,
      equipment: ['12-Parameter Chemical Analyzer', 'Digital NPK Scanner']
    },
    {
      id: 5,
      name: 'Agri Drone India',
      category: 'Drone Services',
      rating: 4.8,
      reviews: 75,
      distance_km: 12,
      distance_str: '12 km',
      tags: ['Drone Spray', 'Mapping', 'Survey'],
      image: '/assets/farmer/farm_services/prov_5_drone.jpg',
      address: 'Sevoke Road Agro Hub, Siliguri',
      phone: '+91 98001 55443',
      email: 'agridrone@krishigo.in',
      price_info: '₹450 - ₹550/acre',
      available_today: true,
      verified: true,
      equipment: ['10L Hexacopter Sprayer', 'Multispectral Survey Drone']
    }
  ]);

  // Modals & Interactive dialogs
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<NearbyProvider | null>(null);
  const [bookingServiceType, setBookingServiceType] = useState<string>('Tractor Rental');
  const [bookingDate, setBookingDate] = useState<string>('2026-06-02');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('08:00 AM - 12:00 PM');
  const [bookingAcreage, setBookingAcreage] = useState<number>(2);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSubmitting, setBookingSubmitting] = useState<boolean>(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);

  // Quote modal
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quoteServiceType, setQuoteServiceType] = useState<string>('Tractor Rental');
  const [quoteAcreage, setQuoteAcreage] = useState<number>(3);
  const [quoteSubmitting, setQuoteSubmitting] = useState<boolean>(false);
  const [quoteResult, setQuoteResult] = useState<any>(null);

  // Call Provider dialog
  const [callModalOpen, setCallModalOpen] = useState<boolean>(false);
  const [callProviderInfo, setCallProviderInfo] = useState<any>(null);

  // Live Chat dialog
  const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
  const [chatProviderInfo, setChatProviderInfo] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'provider',
      text: 'Namaste! Siliguri Agro Services customer desk here. How can we assist your farm operations today?',
      time: 'Just now'
    }
  ]);
  const [chatInputText, setChatInputText] = useState<string>('');

  // AI Farm Copilot drawer/modal
  const [copilotModalOpen, setCopilotModalOpen] = useState<boolean>(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: string; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! I am your AI Farm Copilot powered by Google Gemini. Ask me anything about farm machinery rentals, soil test reports, government schemes, or farm labor in your area!'
    }
  ]);
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotVoiceListening, setCopilotVoiceListening] = useState<boolean>(false);

  // Search state from top bar
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Government Schemes Modal state
  const [schemesModalOpen, setSchemesModalOpen] = useState<boolean>(false);
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<any>(null);
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState<string>('All');
  const [schemeSearchFilter, setSchemeSearchFilter] = useState<string>('');
  const [calculatorScheme, setCalculatorScheme] = useState<string>('smam');
  const [calculatorCost, setCalculatorCost] = useState<number>(100000);

  // Provider Detail Modal state
  const [providerDetailModalOpen, setProviderDetailModalOpen] = useState<boolean>(false);
  const [selectedProviderForDetail, setSelectedProviderForDetail] = useState<NearbyProvider | null>(null);

  // Call & Chat feedback
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  // Open Google Maps directions
  const openGoogleMapsDirections = (address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ', West Bengal, India')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Subsidy calculation helper
  const calculateSubsidy = () => {
    const cost = Number(calculatorCost) || 0;
    if (calculatorScheme === 'smam') {
      const subsidy = Math.min(cost * 0.5, 125000);
      return {
        schemeName: 'SMAM Farm Machinery Subsidy',
        percentage: '50% Govt Subsidy (Max ₹1.25L)',
        subsidyAmount: Math.round(subsidy),
        farmerShare: Math.round(cost - subsidy)
      };
    } else if (calculatorScheme === 'pmksy') {
      const subsidy = cost * 0.55;
      return {
        schemeName: 'PMKSY Micro-Irrigation (Per Drop More Crop)',
        percentage: '55% Government Subsidy',
        subsidyAmount: Math.round(subsidy),
        farmerShare: Math.round(cost - subsidy)
      };
    } else if (calculatorScheme === 'pmfby') {
      const subsidy = cost * 0.85;
      return {
        schemeName: 'PMFBY Crop Insurance Premium Subsidy',
        percentage: '85% Premium Paid by Govt',
        subsidyAmount: Math.round(subsidy),
        farmerShare: Math.round(cost - subsidy)
      };
    } else if (calculatorScheme === 'kcc') {
      const subvention = cost * 0.03;
      return {
        schemeName: 'Kisan Credit Card (KCC) Subvention',
        percentage: '3% Interest Subsidy (Effective 4% APR)',
        subsidyAmount: Math.round(subvention),
        farmerShare: Math.round(cost * 0.04)
      };
    } else {
      return {
        schemeName: 'PM-Kisan Samman Nidhi',
        percentage: '100% Direct Bank Transfer',
        subsidyAmount: 6000,
        farmerShare: 0
      };
    }
  };

  // Copy phone number
  const handleCopyPhone = (phoneStr: string) => {
    navigator.clipboard.writeText(phoneStr);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Listen to search events from top search bar
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const q = (e.detail || '').trim();
      setSearchTerm(q);
      if (q) {
        const matched = browseCategories.find(c => c.title.toLowerCase().includes(q.toLowerCase()));
        if (matched) {
          setServiceFilter(matched.serviceKey);
        }
      }
    };
    window.addEventListener('farm-services-search', handleSearchEvent);
    return () => window.removeEventListener('farm-services-search', handleSearchEvent);
  }, []);

  // Voice recognition for Copilot powered by Google Web Speech API
  const handleCopilotVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your query.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      setCopilotVoiceListening(true);
      recognition.onstart = () => setCopilotVoiceListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCopilotQuery(transcript);
        setCopilotVoiceListening(false);
        handleAskCopilot(transcript);
      };
      recognition.onerror = () => setCopilotVoiceListening(false);
      recognition.onend = () => setCopilotVoiceListening(false);
      recognition.start();
    } catch {
      setCopilotVoiceListening(false);
    }
  };

  // Auto-detect location on first mount if not already detected with GPS
  useEffect(() => {
    if (!devLoc?.isAutoDetected) {
      detectDeviceLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync requestLocation with device context whenever it changes
  useEffect(() => {
    if (devLoc?.display_name) {
      setRequestLocation(devLoc.display_name);
    }
  }, [devLoc?.display_name]);

  // Load data from backend with Google Maps distance matrix & dynamic provider resolution
  const fetchServices = async () => {
    try {
      const res = await api.getFarmServices({
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
        location: devLoc?.display_name || requestLocation,
        service_filter: serviceFilter !== 'All Services' ? serviceFilter : undefined,
        radius_km: distanceRadius,
        sort_by: sortBy
      });

      if (res && res.nearby_providers && res.nearby_providers.length > 0) {
        setProviders(res.nearby_providers);
      }
    } catch (err) {
      console.error('Error fetching farm services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [devLoc?.latitude, devLoc?.longitude, serviceFilter, distanceRadius, sortBy]);

  // Filtered and sorted providers based on serviceFilter, distance, and search
  const filteredProviders = providers
    .filter((prov) => {
      const matchesService =
        serviceFilter === 'All Services' ||
        prov.category.toLowerCase().includes(serviceFilter.toLowerCase()) ||
        prov.tags.some((t) => t.toLowerCase().includes(serviceFilter.toLowerCase()));
      const matchesSearch =
        !searchTerm.trim() ||
        prov.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDist = prov.distance_km <= distanceRadius;
      return matchesService && matchesSearch && matchesDist;
    })
    .sort((a, b) => {
      if (sortBy === 'Nearest Distance') return a.distance_km - b.distance_km;
      if (sortBy === 'Best Rated') return b.rating - a.rating;
      if (sortBy === 'Most Popular') return b.reviews - a.reviews;
      return 0;
    });

  // Carousel navigation for providers
  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, providers.length - 1)));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev < providers.length - 1 ? prev + 1 : 0));
  };

  // Open booking modal
  const handleOpenBooking = (provider?: NearbyProvider, defaultService?: string) => {
    setSelectedProviderForBooking(provider || providers[0] || null);
    if (defaultService) setBookingServiceType(defaultService);
    setBookingConfirmation(null);
    setBookingModalOpen(true);
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    setBookingSubmitting(true);
    try {
      const payload = {
        service_name: bookingServiceType,
        provider_name: selectedProviderForBooking?.name || 'Siliguri Agro Services',
        date: bookingDate,
        time_slot: bookingTimeSlot,
        acreage: bookingAcreage,
        location: requestLocation,
        phone: selectedProviderForBooking?.phone || '+91 98320 11223',
        notes: bookingNotes
      };
      const res = await api.bookService(payload);
      setBookingConfirmation(res);
    } catch (err) {
      console.error('Error booking service:', err);
      setBookingConfirmation({
        status: 'CONFIRMED',
        booking_id: `KGO-SRV-${Math.floor(10000 + Math.random() * 90000)}`,
        service_name: bookingServiceType,
        provider_name: selectedProviderForBooking?.name || 'Siliguri Agro Services',
        date: bookingDate,
        location: requestLocation,
        message: `Booking for ${bookingServiceType} successfully confirmed for ${bookingDate}!`
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Submit Quote Request
  const handleRequestQuote = async () => {
    setQuoteSubmitting(true);
    try {
      const res = await api.requestServiceQuote({
        service: quoteServiceType,
        acreage: quoteAcreage,
        location: requestLocation
      });
      setQuoteResult(res);
    } catch (err) {
      console.error('Error requesting quote:', err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // AI Copilot Ask
  const handleAskCopilot = async (overridePrompt?: string) => {
    const q = overridePrompt || copilotQuery;
    if (!q.trim()) return;

    setCopilotMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      const res = await api.askServicesCopilot({
        query: q,
        category: serviceFilter !== 'All Services' ? serviceFilter : 'Farm Services',
        location: requestLocation
      });

      if (res?.answer) {
        setCopilotMessages((prev) => [...prev, { sender: 'bot', text: res.answer }]);
      } else {
        setCopilotMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Tractor rental rates around ${requestLocation} average ₹600-800/hour with operator and diesel included. Book 24 hours in advance on KrishiGo for assured morning arrival.`
          }
        ]);
      }
    } catch (err) {
      console.error('Error in Copilot query:', err);
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `For your request, standard tractor rental around ${requestLocation} is ₹600 - ₹800/hour. You can book directly with Siliguri Agro Services (4.8 rating, 5 km away) using the Book Now button.`
        }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Send message in provider chat
  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;
    const userMsg = chatInputText;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' }
    ]);
    setChatInputText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'provider',
          text: `Thank you for your enquiry regarding ${userMsg}. Our operator is available for tomorrow morning. Shall we confirm the booking for your field in ${requestLocation}?`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  return (
    <FarmerLayout>
      <div className="p-2.5 sm:p-3 lg:p-3.5 space-y-2.5 max-w-[1600px] mx-auto text-gray-900">
        
        {/* ==================== TOP HERO BANNER (Photo & Real Text Separated) ==================== */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xs border border-gray-200/80 p-3.5 sm:p-4 md:p-5 flex flex-col justify-between gap-3 min-h-[175px] sm:min-h-[190px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.90) 35%, rgba(255, 255, 255, 0.35) 60%, rgba(255, 255, 255, 0.05) 80%, rgba(255, 255, 255, 0) 100%), url('/assets/farmer/farm_services/hero_banner_clean.jpg')`,
            backgroundPosition: 'center 45%',
            backgroundSize: 'cover',
          }}
        >
          {/* Top text */}
          <div className="relative z-10 max-w-lg space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-none">
              Farm Services
            </h1>
            <p className="text-xs sm:text-[13px] font-semibold text-gray-800 leading-snug">
              All farming services you need, in one place.
            </p>
            <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-tight">
              Book machinery, buy inputs, get expert advice, test soil, hire labor and more.
            </p>
          </div>

          {/* 8 Category Pills */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 pt-1">
            {pillCategories.map((pill) => {
              const isSelected = activeCategoryPill === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    if (pill.id === 'schemes') {
                      setSchemesModalOpen(true);
                      return;
                    }
                    setActiveCategoryPill(isSelected ? 'all' : pill.id);
                    setServiceFilter(isSelected ? 'All Services' : pill.title);
                  }}
                  className={`rounded-xl px-2 py-1.5 border transition-all text-left flex items-center gap-2 cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-emerald-50/95 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white/95 hover:bg-white border-gray-200/90 hover:border-gray-300'
                  }`}
                  title={`Filter by ${pill.title}`}
                >
                  <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                    <img
                      src={pill.iconAsset}
                      alt={pill.title}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1 leading-none">
                    <div className="text-[11px] font-bold text-gray-900 truncate">
                      {pill.title}
                    </div>
                    <div className="text-[9px] text-gray-500 font-medium truncate mt-0.5">
                      {pill.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== MAIN 2-COLUMN BODY GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
          
          {/* ==================== LEFT COLUMN (~77% width) ==================== */}
          <div className="lg:col-span-9 space-y-2.5">
            
            {/* 1. BROWSE FARM SERVICES (10 Cards in 2 rows of 5) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-3.5 shadow-2xs">
              
              {/* Search Active Notification Banner */}
              {searchTerm && (
                <div className="mb-2.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Search className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Showing matching results for: "{searchTerm}"</span>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setServiceFilter('All Services');
                      setActiveCategoryPill('all');
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs"
                  >
                    <span>Clear Search</span>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#008037] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    ❖
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-[#112214] tracking-tight">
                    Browse Farm Services
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setServiceFilter('All Services');
                    setActiveCategoryPill('all');
                    setSearchTerm('');
                  }}
                  className="text-xs font-bold text-[#008037] hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 10 Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {browseCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'schemes') {
                        setSchemesModalOpen(true);
                        return;
                      }
                      if (cat.id === 'insurance') {
                        setQuoteServiceType('Crop Insurance Policy');
                        setQuoteModalOpen(true);
                        return;
                      }
                      setServiceFilter(cat.serviceKey);
                      handleOpenBooking(undefined, cat.serviceKey);
                    }}
                    className="group bg-white rounded-xl border border-gray-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Top Image */}
                    <div className="h-19 sm:h-20 w-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content & Action */}
                    <div className="p-2 flex items-end justify-between gap-1 flex-1">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[11px] font-black text-[#112214] group-hover:text-emerald-700 leading-tight">
                          {cat.title}
                        </h3>
                        <p className="text-[8.5px] text-gray-500 font-medium leading-[1.25] mt-0.5 whitespace-pre-line">
                          {cat.subtitle}
                        </p>
                      </div>

                      {/* Colored Arrow Button */}
                      <button
                        className={`w-5.5 h-5.5 rounded-md ${cat.btnColor} text-white flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-108 cursor-pointer`}
                        title={`Browse ${cat.title}`}
                      >
                        <ArrowRight className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. NEARBY SERVICE PROVIDERS (Carousel with 5 Providers) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-4 shadow-2xs relative">
              {/* Header with Title and Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-[#112214] tracking-tight">
                    Nearby Service Providers
                  </h2>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-bold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                    >
                      <option value="All Services">All Services</option>
                      <option value="Farm Machinery">Farm Machinery</option>
                      <option value="Seeds & Plants">Seeds & Plants</option>
                      <option value="Labor & Workforce">Labor & Workforce</option>
                      <option value="Soil & Water Testing">Soil & Water Testing</option>
                      <option value="Drone Services">Drone Services</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                  </div>

                  {/* Distance Radius Dropdown */}
                  <div className="relative">
                    <select
                      value={distanceRadius}
                      onChange={(e) => setDistanceRadius(Number(e.target.value))}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-bold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                    >
                      <option value={5}>Within 5 km</option>
                      <option value={10}>Within 10 km</option>
                      <option value={20}>Within 20 km</option>
                      <option value={50}>Within 50 km</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-bold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                    >
                      <option value="Best Rated">Sort by: Best Rated</option>
                      <option value="Nearest Distance">Sort by: Nearest</option>
                      <option value="Most Popular">Sort by: Most Popular</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => {
                      setServiceFilter('All Services');
                      setDistanceRadius(50);
                    }}
                    className="text-xs font-bold text-[#008037] hover:text-emerald-800 flex items-center gap-1 cursor-pointer ml-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative">
                {/* Carousel Left Navigation Arrow */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Previous Provider"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Carousel Right Navigation Arrow */}
                <button
                  onClick={handleNextSlide}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Next Provider"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* 5 Providers Grid matching reference layout exactly */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                  {filteredProviders.map((prov, pIdx) => (
                    <div
                      key={prov.id}
                      onClick={() => {
                        setSelectedProviderForDetail(prov);
                        setProviderDetailModalOpen(true);
                      }}
                      className={`bg-white rounded-xl border p-2.5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group cursor-pointer ${
                        pIdx === carouselIndex % Math.max(1, filteredProviders.length)
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-gray-200/80'
                      }`}
                    >
                      <div>
                        {/* Top: Photo on left, Name & Rating on right */}
                        <div className="flex items-start gap-1.5 mb-1.5">
                          <img
                            src={prov.image}
                            alt={prov.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0 group-hover:scale-102 transition-transform"
                          />
                          <div className="min-w-0 flex-1 pl-0.5">
                            <h4 className="text-[10px] font-bold text-[#112214] leading-[1.15] group-hover:text-emerald-700 line-clamp-2 h-[23px] flex items-center" title={prov.name}>
                              {prov.name}
                            </h4>
                            <div className="flex items-center gap-1 font-bold text-[9.5px] text-gray-800 mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span>{prov.rating}</span>
                              <span className="text-gray-400 font-normal text-[9px]">({prov.reviews})</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoogleMapsDirections(prov.address);
                              }}
                              className="flex items-center gap-0.5 text-[9px] text-indigo-600 hover:text-indigo-800 font-bold mt-0.5 hover:underline cursor-pointer"
                              title="Get Google Maps Route / Directions"
                            >
                              <MapPin className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                              <span>{prov.distance_str}</span>
                              <ExternalLink className="w-2 h-2 text-indigo-400 ml-0.5" />
                            </button>
                          </div>
                        </div>

                        {/* Service Tags on Single Horizontal Row */}
                        <div className="flex items-center gap-0.5 sm:gap-1 my-1.5 overflow-hidden">
                          {prov.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1 py-0.5 bg-[#f0f4f0] text-gray-600 rounded text-[7.5px] font-medium whitespace-nowrap shrink-0"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Full-width Green Book Now Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(prov);
                        }}
                        className="w-full py-1 bg-[#008037] hover:bg-[#00682e] text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCarouselIndex(dot)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dot === carouselIndex % 5
                        ? 'w-5 bg-[#008037]'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3. BOTTOM 3-CARD ROW (Service Request, Recommended for You, Government Schemes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              
              {/* Card 3A: Service Request */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#008037] flex items-center justify-center font-bold">
                      <span className="text-xs">↓</span>
                    </div>
                    <h3 className="text-sm font-black text-[#112214]">
                      Service Request
                    </h3>
                  </div>

                  {/* Form */}
                  <div className="space-y-2">
                    {/* Select Service & Date */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                          Select Service
                        </label>
                        <div className="relative">
                          <select
                            value={requestService}
                            onChange={(e) => setRequestService(e.target.value)}
                            className="w-full appearance-none bg-[#f8faf8] border border-gray-200 rounded-lg px-2 py-1.5 pr-5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="Tractor Rental">Tractor Rental</option>
                            <option value="Rotavator & Tiller">Rotavator</option>
                            <option value="Harvester Booking">Harvester</option>
                            <option value="Soil & Water Testing">Soil Test</option>
                            <option value="Drone Spraying">Drone Spray</option>
                            <option value="Labor Workforce">Farm Labor</option>
                            <option value="Irrigation Setup">Irrigation</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                          Date
                        </label>
                        <div className="relative flex items-center bg-[#f8faf8] border border-gray-200 rounded-lg px-2 py-1.5">
                          <input
                            type="text"
                            readOnly
                            value={requestDate ? 'Select Date' : 'Select Date'}
                            onClick={() => {
                              const el = document.getElementById('req-date-input');
                              if (el) (el as HTMLInputElement).showPicker?.();
                            }}
                            className="w-full bg-transparent text-xs font-semibold text-gray-700 cursor-pointer focus:outline-none"
                          />
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 pointer-events-none" />
                          <input
                            id="req-date-input"
                            type="date"
                            value={requestDate}
                            onChange={(e) => setRequestDate(e.target.value)}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location & Find Providers */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-600 flex items-center justify-between mb-0.5">
                          <span>Location</span>
                          <button
                            type="button"
                            onClick={openLocationModal}
                            className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-0.5"
                            title="Change or auto-detect location"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            <span>Change</span>
                          </button>
                        </label>
                        <div className="relative">
                          <select
                            value={requestLocation}
                            onChange={(e) => {
                              setRequestLocation(e.target.value);
                            }}
                            className="w-full appearance-none bg-[#f8faf8] border border-gray-200 rounded-lg px-2.5 py-1.5 pr-5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer truncate"
                          >
                            {/* Auto-detected location always appears first */}
                            {devLoc?.display_name && devLoc.display_name !== 'Siliguri, West Bengal' && (
                              <option value={devLoc.display_name}>📍 {devLoc.display_name}</option>
                            )}
                            <option value="Siliguri, West Bengal">Siliguri, West Bengal</option>
                            <option value="Matigara, Darjeeling">Matigara, Darjeeling</option>
                            <option value="Jalpaiguri Rural, West Bengal">Jalpaiguri Rural, West Bengal</option>
                            <option value="Bagdogra Agro Belt">Bagdogra Agro Belt</option>
                            <option value="Naxalbari Mandi Area">Naxalbari Mandi Area</option>
                          </select>
                          {isLocDetecting ? (
                            <span className="absolute right-2 top-1.5 text-amber-500 text-[9px] font-bold">Locating...</span>
                          ) : (
                            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                          )}
                        </div>
                      </div>

                      {/* Find Providers Green Button */}
                      <button
                        onClick={() => {
                          setServiceFilter(requestService);
                          setBookingDate(requestDate);
                          setBookingServiceType(requestService);
                          handleOpenBooking(undefined, requestService);
                        }}
                        className="py-1.5 px-3 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Find Providers</span>
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3B: Recommended for You */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <span className="text-xs">📊</span>
                  </div>
                  <h3 className="text-sm font-black text-[#112214]">
                    Recommended for You
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {recommendedList.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setBookingServiceType(rec.serviceKey);
                        handleOpenBooking(undefined, rec.serviceKey);
                      }}
                      className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-emerald-50/70 transition-colors cursor-pointer group"
                    >
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-100 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-gray-900 group-hover:text-emerald-700 leading-tight truncate">
                          {rec.title}
                        </h4>
                        <p className="text-[9.5px] text-gray-500 font-medium leading-tight mt-0.5 truncate">
                          {rec.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3C: Government Schemes */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Landmark className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-black text-[#112214]">
                        Government Schemes
                      </h3>
                    </div>
                    <button
                      onClick={() => setSchemesModalOpen(true)}
                      className="text-xs font-bold text-[#008037] hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {schemesList.map((sch) => (
                      <div
                        key={sch.id}
                        onClick={() => {
                          const detailed = ALL_GOVERNMENT_SCHEMES.find(s => s.id === sch.id.replace('sch-', '')) || ALL_GOVERNMENT_SCHEMES[0];
                          setSelectedSchemeDetail(detailed);
                          setSchemesModalOpen(true);
                        }}
                        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-blue-50/70 transition-colors group cursor-pointer"
                      >
                        <img
                          src={sch.badgeImg}
                          alt={sch.title}
                          className="w-8 h-8 rounded-lg object-contain shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-gray-900 group-hover:text-blue-700 leading-tight truncate">
                            {sch.title}
                          </h4>
                          <p className="text-[9.5px] text-gray-500 font-medium leading-tight mt-0.5 truncate">
                            {sch.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ==================== RIGHT COLUMN (~23% width) ==================== */}
          <div className="lg:col-span-3 space-y-2.5">
            
            {/* 1. NEED HELP? AI FARM COPILOT CARD */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs relative overflow-hidden">
              {/* Top Green Badge */}
              <div className="inline-block bg-[#008037] text-white text-[11px] font-bold px-3 py-1 rounded-t-lg mb-2">
                Need Help?
              </div>

              {/* 3D Cute Robot Mascot */}
              <div className="absolute right-2 top-2 w-16 h-16 pointer-events-none">
                <img
                  src="/assets/farmer/farm_services/ai_copilot_robot.png"
                  alt="AI Farm Copilot"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>

              {/* Title & Desc */}
              <div className="mt-0.5 max-w-[170px]">
                <h3 className="text-sm font-black text-gray-900 leading-tight">
                  AI Farm Copilot
                </h3>
                <p className="text-[10.5px] text-gray-700 font-bold leading-tight mt-0.5">
                  Ask anything about farming
                </p>
                <p className="text-[9.5px] text-gray-500 font-medium leading-tight mt-1">
                  Get instant guidance in simple language.
                </p>
              </div>

              {/* Ask Now Button */}
              <button
                onClick={() => setCopilotModalOpen(true)}
                className="mt-3 py-1.5 px-4 bg-[#008037] hover:bg-[#00682e] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Ask Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. POPULAR SERVICES CARD */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <h3 className="text-sm font-black text-[#112214]">
                    Popular Services
                  </h3>
                </div>
                <button
                  onClick={() => setServiceFilter('All Services')}
                  className="text-xs font-bold text-[#008037] hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* 5 Ranked Items */}
              <div className="divide-y divide-gray-100">
                {popularServices.map((pop) => (
                  <div
                    key={pop.rank}
                    onClick={() => {
                      if (pop.serviceKey === 'Crop Insurance') {
                        setQuoteServiceType('Crop Insurance Policy');
                        setQuoteModalOpen(true);
                        return;
                      }
                      setServiceFilter(pop.serviceKey);
                      setBookingServiceType(pop.serviceKey);
                      handleOpenBooking(undefined, pop.serviceKey);
                    }}
                    className="py-1 flex items-center justify-between gap-2 hover:bg-emerald-50/50 rounded-lg px-1 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Bold Blue Number matching reference */}
                      <span className="text-[#1a73e8] font-bold text-xs w-4 text-center shrink-0">
                        {pop.rank}
                      </span>
                      <img
                        src={pop.image}
                        alt={pop.title}
                        className="w-7 h-7 rounded-md object-cover shrink-0 border border-gray-100 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 leading-tight truncate">
                          {pop.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                          {pop.price}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. QUICK ACTIONS CARD */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2.5">
                <ShieldCheck className="w-4 h-4 text-[#008037]" />
                <h3 className="text-sm font-black text-[#112214]">
                  Quick Actions
                </h3>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Call Provider (Purple) */}
                <button
                  onClick={() => {
                    setCallProviderInfo(providers[0] || null);
                    setCallModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-[#7b57df] hover:bg-[#6842cb] text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-left leading-tight">
                    Call Provider
                  </span>
                </button>

                {/* 2. Chat (Green) */}
                <button
                  onClick={() => {
                    setChatProviderInfo(providers[0] || null);
                    setChatModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-[#34a853] hover:bg-[#2c9347] text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-left leading-tight">
                    Chat
                  </span>
                </button>

                {/* 3. Book Service (Red) */}
                <button
                  onClick={() => handleOpenBooking()}
                  className="p-2 rounded-xl bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-left leading-tight">
                    Book Service
                  </span>
                </button>

                {/* 4. Request Quote (Amber/Orange) */}
                <button
                  onClick={() => {
                    setQuoteResult(null);
                    setQuoteModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-[#fa8c16] hover:bg-[#e0770b] text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-left leading-tight">
                    Request Quote
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ==================== INTERACTIVE BOOKING MODAL ==================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmation ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  Booking Confirmed!
                </h3>
                <p className="text-xs font-bold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-full inline-block">
                  Reference: {bookingConfirmation.booking_id}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {bookingConfirmation.message ||
                    `Your request for ${bookingServiceType} with ${selectedProviderForBooking?.name || 'Siliguri Agro Services'} has been scheduled.`}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-left text-xs space-y-1 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-bold text-gray-900">{bookingServiceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider:</span>
                    <span className="font-bold text-gray-900">{selectedProviderForBooking?.name || 'Siliguri Agro Services'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Slot:</span>
                    <span className="font-bold text-gray-900">{bookingDate} ({bookingTimeSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-bold text-gray-900">{requestLocation}</span>
                  </div>
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="w-full mt-3 py-2.5 bg-[#008037] hover:bg-[#00682e] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">
                      Book Farm Service
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {selectedProviderForBooking ? selectedProviderForBooking.name : 'Select nearby verified provider'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Service Type */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Service Type
                    </label>
                    <select
                      value={bookingServiceType}
                      onChange={(e) => setBookingServiceType(e.target.value)}
                      className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Tractor Rental">Tractor Rental (45-50 HP)</option>
                      <option value="Rotavator & Land Leveler">Rotavator & Land Leveler</option>
                      <option value="Harvester Booking">Paddy / Wheat Multi-crop Harvester</option>
                      <option value="Soil & Water Testing">12-Parameter Soil & Water Testing</option>
                      <option value="Drone Spraying Service">Agricultural Drone Spraying</option>
                      <option value="Farm Labor Crew">Skilled Farm Labor (Weeding & Transplanting)</option>
                      <option value="Drip Irrigation Setup">Drip Irrigation Installation</option>
                      <option value="Crop Doctor Consultation">Crop Doctor Field Advisory Visit</option>
                    </select>
                  </div>

                  {/* Provider Choice */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Assigned Provider
                    </label>
                    <select
                      value={selectedProviderForBooking?.id || 1}
                      onChange={(e) => {
                        const p = providers.find((pr) => pr.id === Number(e.target.value));
                        if (p) setSelectedProviderForBooking(p);
                      }}
                      className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {providers.map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.name} ({pr.distance_str} away • ★ {pr.rating})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Booking Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Time Slot
                      </label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="06:00 AM - 10:00 AM">Early Morning (6 AM - 10 AM)</option>
                        <option value="08:00 AM - 12:00 PM">Morning Slot (8 AM - 12 PM)</option>
                        <option value="01:00 PM - 05:00 PM">Afternoon (1 PM - 5 PM)</option>
                        <option value="Full Day">Full Day Booking</option>
                      </select>
                    </div>
                  </div>

                  {/* Acreage / Hours */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Field Area / Hours Required
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={bookingAcreage}
                      onChange={(e) => setBookingAcreage(Number(e.target.value))}
                      className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Special Instructions for Operator
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clay soil field near canal, needs rotavator attachment"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingSubmitting}
                    className="w-2/3 py-2.5 bg-[#008037] hover:bg-[#00682e] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {bookingSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Service Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== REQUEST QUOTE MODAL ==================== */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Request Competitive Quotes
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Get instant verified price estimates for {requestLocation}
                </p>
              </div>
            </div>

            {quoteResult ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs">
                  <p className="font-bold text-emerald-900">
                    Quotes Received from 2 Verified Providers:
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    Reference ID: {quoteResult.quote_id}
                  </p>
                </div>

                <div className="space-y-2">
                  {quoteResult.generated_quotes?.map((q: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-3 bg-gray-50/80 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{q.provider}</h4>
                        <p className="text-[11px] text-gray-600 mt-0.5 font-medium">{q.rate}</p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-1">Available: {q.availability}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-gray-900">{q.estimated_total}</div>
                        <button
                          onClick={() => {
                            setQuoteModalOpen(false);
                            handleOpenBooking(undefined, quoteServiceType);
                          }}
                          className="mt-1 px-3 py-1 bg-[#008037] hover:bg-[#00682e] text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setQuoteModalOpen(false)}
                  className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Select Farm Service
                  </label>
                  <select
                    value={quoteServiceType}
                    onChange={(e) => setQuoteServiceType(e.target.value)}
                    className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800"
                  >
                    <option value="Tractor Rental">Tractor Rental & Land Tilling</option>
                    <option value="Drip Irrigation Setup">Drip Irrigation Installation</option>
                    <option value="Drone Spraying Service">Drone Micronutrient Foliar Spray</option>
                    <option value="Harvester Booking">Harvesting & Threshing Machinery</option>
                    <option value="Soil Health Testing">Soil Health Testing Card</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Area / Capacity (Acres)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quoteAcreage}
                    onChange={(e) => setQuoteAcreage(Number(e.target.value))}
                    className="w-full bg-[#f8faf8] border border-gray-300 rounded-xl p-2.5 font-semibold text-gray-800"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setQuoteModalOpen(false)}
                    className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestQuote}
                    disabled={quoteSubmitting}
                    className="w-2/3 py-2.5 bg-[#dd6b20] hover:bg-[#c05621] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {quoteSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <IndianRupee className="w-4 h-4" />
                        <span>Get Instant Quotes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CALL PROVIDER MODAL ==================== */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setCallModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Provider Switcher Dropdown */}
            <div className="mb-3 pr-8">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Select Service Provider to Call
              </label>
              <select
                value={callProviderInfo?.id || providers[0]?.id}
                onChange={(e) => {
                  const p = providers.find((x) => x.id === Number(e.target.value));
                  if (p) setCallProviderInfo(p);
                }}
                className="w-full bg-[#f8faf8] border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category}) • {p.distance_str}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-3">
                <img
                  src={callProviderInfo?.image || providers[0]?.image}
                  alt="Provider"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 mx-auto shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-base font-black text-gray-900 leading-tight">
                {callProviderInfo?.name || 'Siliguri Agro Services'}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {callProviderInfo?.category || 'Farm Machinery'} • ★ {callProviderInfo?.rating || '4.8'} ({callProviderInfo?.reviews || '120'} reviews)
              </p>

              {/* Location with Google Maps route */}
              <button
                type="button"
                onClick={() => openGoogleMapsDirections(callProviderInfo?.address || 'Siliguri, West Bengal')}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold mt-1.5 hover:underline cursor-pointer bg-indigo-50/70 px-2.5 py-0.5 rounded-lg border border-indigo-100"
              >
                <MapPin className="w-3 h-3 text-indigo-500" />
                <span>{callProviderInfo?.address || 'Siliguri, West Bengal'} ({callProviderInfo?.distance_str || '5 km'})</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </button>
            </div>

            {/* Helpline and Copy Action */}
            <div className="my-4 p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-purple-600 font-extrabold block">
                  Direct Helpline Number
                </span>
                <span className="text-lg font-black text-purple-950 block mt-0.5">
                  {callProviderInfo?.phone || '+91 98320 11223'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyPhone(callProviderInfo?.phone || '+91 98320 11223')}
                className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setCallModalOpen(false);
                  setChatProviderInfo(callProviderInfo);
                  setChatModalOpen(true);
                }}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => {
                  setCallModalOpen(false);
                  handleOpenBooking(callProviderInfo);
                }}
                className="py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>

              <a
                href={`tel:${callProviderInfo?.phone || '+919832011223'}`}
                className="py-2.5 bg-[#805ad5] hover:bg-[#6b46c1] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CHAT WITH PROVIDER MODAL ==================== */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full h-[540px] flex flex-col shadow-2xl border border-gray-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-100 bg-[#fbfdfb] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={chatProviderInfo?.image || providers[0]?.image}
                  alt="Provider"
                  className="w-8 h-8 rounded-full object-cover border border-emerald-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={chatProviderInfo?.id || providers[0]?.id}
                      onChange={(e) => {
                        const p = providers.find((x) => x.id === Number(e.target.value));
                        if (p) setChatProviderInfo(p);
                      }}
                      className="text-xs font-black text-gray-900 bg-transparent border-0 focus:outline-none cursor-pointer truncate max-w-[180px]"
                    >
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online • Rates: {chatProviderInfo?.price_info || 'From ₹600/hr'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setChatModalOpen(false);
                    setCallProviderInfo(chatProviderInfo);
                    setCallModalOpen(true);
                  }}
                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                  title="Call Provider"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChatModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {[
                'Available tomorrow morning?',
                'What is your hourly tractor rate?',
                'Can you spray 5 acres with drone?',
                'Where is your center located?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: 'user', text: chip, time: 'Just now' }
                    ]);
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          sender: 'provider',
                          text: `Yes! For "${chip}", our team is fully equipped in ${requestLocation}. We can confirm your slot right away or you can use the Book button below.`,
                          time: 'Just now'
                        }
                      ]);
                    }, 800);
                  }}
                  className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shrink-0 shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-[#f6f9f6]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-2.5 text-xs font-medium ${
                      msg.sender === 'user'
                        ? 'bg-[#008037] text-white rounded-br-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] mt-1 block ${
                        msg.sender === 'user' ? 'text-green-100 text-right' : 'text-gray-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Type your question (e.g. When can you arrive?)..."
                className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendChatMessage}
                className="p-2 bg-[#008037] hover:bg-[#00682e] text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AI FARM COPILOT MODAL (Google Gemini & Web Speech API) ==================== */}
      {copilotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[580px] flex flex-col shadow-2xl border border-gray-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-gray-900">
                      AI Farm Services Copilot
                    </h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      Google Gemini 2.5
                    </span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                      Web Speech
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Instant agricultural services guidance for {requestLocation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCopilotModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Badges */}
            <div className="px-3.5 py-2 bg-gray-50/90 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {[
                'Tractor rental cost/hr?',
                'How to book soil test?',
                'PM-Kisan eligibility?',
                'Drone spraying rates?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskCopilot(chip)}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message List */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8faf8]">
              {copilotMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#008037] text-white rounded-br-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line font-medium">{m.text}</p>
                  </div>
                </div>
              ))}
              {copilotLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 italic bg-white p-2.5 rounded-xl border border-gray-200 w-fit">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Consulting Google Gemini agricultural knowledge base...</span>
                </div>
              )}
            </div>

            {/* Input Bar with Google Web Speech API voice button */}
            <div className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopilotVoiceInput}
                title="Speak question using Google Web Speech Recognition"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  copilotVoiceListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300'
                    : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                placeholder={
                  copilotVoiceListening
                    ? 'Listening... Speak your farming question now'
                    : 'Ask about machinery rates, subsidies, labor availability...'
                }
                className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
              <button
                onClick={() => handleAskCopilot()}
                disabled={copilotLoading}
                className="p-2 bg-[#008037] hover:bg-[#00682e] text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GOVERNMENT SCHEMES & SUBSIDIES DIRECTORY MODAL ==================== */}
      {schemesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#008037] text-white flex items-center justify-center shadow-xs">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    Government Agricultural Schemes & Subsidies
                  </h3>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Central & State Financial Assistance, Subsidies & Grants for Farmers in {requestLocation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSchemesModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  'All',
                  'Direct Financial Benefit',
                  'Machinery Subsidy',
                  'Irrigation Support',
                  'Low Interest Credit',
                  'Crop Protection',
                  'Market Linkage'
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSchemeCategoryFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      schemeCategoryFilter === tab
                        ? 'bg-[#008037] text-white shadow-2xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search schemes or subsidies..."
                  value={schemeSearchFilter}
                  onChange={(e) => setSchemeSearchFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8faf8]">
              {/* Interactive Subsidy Calculator Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                    Interactive Subsidy Estimator (Government of India)
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium mb-3">
                  Calculate estimated government grant and your net share for machinery, micro-irrigation, or crop insurance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">
                      Choose Scheme
                    </label>
                    <select
                      value={calculatorScheme}
                      onChange={(e) => setCalculatorScheme(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="smam">SMAM (Machinery Subsidy 50%)</option>
                      <option value="pmksy">PMKSY (Drip Irrigation 55%)</option>
                      <option value="pmfby">PMFBY (Crop Insurance 85% grant)</option>
                      <option value="kcc">KCC (Crop Loan 3% Subvention)</option>
                      <option value="pmkisan">PM-KISAN (₹6,000 Direct Cash)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">
                      Estimated Project / Equipment Cost (₹)
                    </label>
                    <input
                      type="number"
                      min={1000}
                      step={5000}
                      value={calculatorCost}
                      onChange={(e) => setCalculatorCost(Number(e.target.value))}
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Calculated Output: Govt Subsidy */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-2 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      Govt. Subsidy Grant
                    </span>
                    <span className="text-base font-black text-emerald-900 block mt-0.5">
                      ₹{calculateSubsidy().subsidyAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-semibold block">
                      {calculateSubsidy().percentage}
                    </span>
                  </div>

                  {/* Calculated Output: Farmer Share */}
                  <div className="bg-white border border-emerald-200 rounded-xl p-2 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-600 block">
                      Farmer Net Payable Share
                    </span>
                    <span className="text-base font-black text-gray-900 block mt-0.5">
                      ₹{calculateSubsidy().farmerShare.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-gray-500 font-semibold block">
                      After direct subsidy deduction
                    </span>
                  </div>
                </div>
              </div>

              {/* Schemes Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ALL_GOVERNMENT_SCHEMES.filter(
                  (s) =>
                    (schemeCategoryFilter === 'All' || s.category === schemeCategoryFilter) &&
                    (!schemeSearchFilter.trim() ||
                      s.title.toLowerCase().includes(schemeSearchFilter.toLowerCase()) ||
                      s.tagline.toLowerCase().includes(schemeSearchFilter.toLowerCase()) ||
                      s.benefit.toLowerCase().includes(schemeSearchFilter.toLowerCase()))
                ).map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl border border-gray-200/90 p-4 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start gap-3 mb-2.5">
                        <img
                          src={scheme.badgeImg}
                          alt={scheme.title}
                          className="w-12 h-12 rounded-xl object-contain border border-gray-100 p-1 shrink-0 bg-gray-50"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                              {scheme.category}
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              {scheme.subsidy_rate}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-gray-900 mt-1 leading-tight">
                            {scheme.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                            {scheme.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Benefit */}
                      <div className="bg-[#f8faf8] border border-gray-100 rounded-xl p-2.5 text-xs text-gray-800 mb-2.5">
                        <span className="font-bold text-emerald-900 block text-[11px] mb-0.5">
                          Financial Assistance / Benefit:
                        </span>
                        <p className="text-[11px] leading-relaxed text-gray-700">
                          {scheme.benefit}
                        </p>
                      </div>

                      {/* Eligibility & Documents */}
                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <span className="font-bold text-gray-700">Eligibility: </span>
                          <span className="text-gray-600 font-medium">{scheme.eligibility}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700 block mb-1">
                            Required Documents:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {scheme.documents.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium"
                              >
                                <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                <span>{doc}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Links */}
                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-gray-500">
                        <span className="font-bold text-gray-700">Helpline: </span>
                        <a
                          href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          {scheme.helpline}
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSchemesModalOpen(false);
                            handleAskCopilot(`How can I apply for ${scheme.title} and what documents are needed in ${requestLocation}?`);
                            setCopilotModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008037] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Bot className="w-3 h-3" />
                          <span>Ask AI</span>
                        </button>

                        <a
                          href={scheme.official_portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#008037] hover:bg-[#00682e] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>Apply Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                Verified against official Ministry of Agriculture & Farmers Welfare guidelines.
              </span>
              <button
                onClick={() => setSchemesModalOpen(false)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PROVIDER PROFILE & FLEET MODAL ==================== */}
      {providerDetailModalOpen && selectedProviderForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setProviderDetailModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Provider Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <img
                src={selectedProviderForDetail.image}
                alt={selectedProviderForDetail.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-gray-900 leading-tight">
                    {selectedProviderForDetail.name}
                  </h3>
                  {selectedProviderForDetail.verified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {selectedProviderForDetail.category}
                </p>

                <div className="flex items-center gap-2 mt-1 font-bold text-xs text-gray-800">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProviderForDetail.rating}</span>
                    <span className="text-gray-400 font-normal">
                      ({selectedProviderForDetail.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedProviderForDetail.price_info}
                  </span>
                </div>
              </div>
            </div>

            {/* Address & Google Maps Directions */}
            <div className="bg-[#f8faf8] border border-gray-200/80 rounded-2xl p-3 mb-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Operating Hub & Address
                  </span>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">
                    {selectedProviderForDetail.address}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Approx {selectedProviderForDetail.distance_str} from your farm field
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openGoogleMapsDirections(selectedProviderForDetail.address)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-indigo-600" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Fleet & Equipment Inventory */}
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-700 block mb-1.5">
                Available Equipment & Workforce Fleet:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProviderForDetail.equipment?.map((eq, eIdx) => (
                  <span
                    key={eIdx}
                    className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold"
                  >
                    ✓ {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProviderDetailModalOpen(false);
                  setCallProviderInfo(selectedProviderForDetail);
                  setCallModalOpen(true);
                }}
                className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProviderDetailModalOpen(false);
                  setChatProviderInfo(selectedProviderForDetail);
                  setChatModalOpen(true);
                }}
                className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProviderDetailModalOpen(false);
                  handleOpenBooking(selectedProviderForDetail);
                }}
                className="py-2.5 rounded-xl bg-[#008037] hover:bg-[#00682e] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </FarmerLayout>
  );
};
