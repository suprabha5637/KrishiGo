import React, { useState, useEffect, useRef } from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { api } from '../../services/api';
import {
  Upload,
  Camera,
  Video,
  FileText,
  Folder,
  Send,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  HelpCircle,
  X,
  Play,
  MessageSquare,
  ArrowRight,
  Loader2,
  MapPin,
  Leaf,
  Pill,
  ShieldAlert,
  Printer,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CropHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    location: devLoc,
    isDetecting,
    openLocationModal,
    detectDeviceLocation
  } = useDeviceLocation();

  // Mode switcher tabs
  const [activeMode, setActiveMode] = useState<'image' | 'video' | 'chat' | 'voice'>('image');

  // Disease examples
  const diseaseExamples = [
    { id: 'leaf_spots', title: 'Leaf Spots', image: '/assets/farmer/crop_health/leaf_spots.png', crop: 'Tomato' },
    { id: 'powdery_mildew', title: 'Powdery Mildew', image: '/assets/farmer/crop_health/powdery_mildew.png', crop: 'Pea' },
    { id: 'yellowing', title: 'Yellowing', image: '/assets/farmer/crop_health/yellowing.png', crop: 'Chili' },
    { id: 'insect_damage', title: 'Insect Damage', image: '/assets/farmer/crop_health/insect_damage.png', crop: 'Maize' },
    { id: 'stem_rot', title: 'Stem Rot', image: '/assets/farmer/crop_health/stem_rot.png', crop: 'Potato' },
    { id: 'fruit_disease', title: 'Fruit Disease', image: '/assets/farmer/crop_health/fruit_disease.png', crop: 'Tomato' },
  ];

  // 8 Core Common Crops
  const commonCrops = [
    { name: 'Rice', image: '/assets/farmer/crop_health/crop_rice.png' },
    { name: 'Wheat', image: '/assets/farmer/crop_health/crop_wheat.png' },
    { name: 'Maize', image: '/assets/farmer/crop_health/crop_maize.png' },
    { name: 'Tomato', image: '/assets/farmer/crop_health/crop_tomato.png' },
    { name: 'Potato', image: '/assets/farmer/crop_health/crop_potato.png' },
    { name: 'Chili', image: '/assets/farmer/crop_health/crop_chili.png' },
    { name: 'Brinjal', image: '/assets/farmer/crop_health/crop_brinjal.png' },
    { name: 'Cotton', image: '/assets/farmer/crop_health/crop_cotton.png' },
  ];

  // Selection & diagnostic state
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [activeExampleId, setActiveExampleId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewAllModalOpen, setViewAllModalOpen] = useState<boolean>(false);
  const [allDiseasesCatalog, setAllDiseasesCatalog] = useState<any>(null);
  const [liveWeatherRisk, setLiveWeatherRisk] = useState<any>(null);
  const [, setLastSyncTime] = useState<Date>(new Date());
  const [, setIsSyncing] = useState<boolean>(false);

  // Chat / Question state
  const [questionInput, setQuestionInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatAnswer, setChatAnswer] = useState<any>(null);
  const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);

  // Voice recording state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);

  // File upload input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [, setUploadedVideoName] = useState<string | null>(null);

  // Auto-detect user location on mount for localized Google Weather disease risk
  useEffect(() => {
    if (!devLoc?.isAutoDetected) {
      detectDeviceLocation();
    }
  }, [detectDeviceLocation, devLoc?.isAutoDetected]);

  // Continuous 30s auto-synchronization for Google Maps Weather disease & microclimate risk
  const syncCropHealth = async () => {
    setIsSyncing(true);
    try {
      const res = await api.getCommonCropDiseases({
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
      });
      if (res) {
        setAllDiseasesCatalog(res);
        if (res.weather_risk) {
          setLiveWeatherRisk(res.weather_risk);
        }
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Error synchronizing crop health data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncCropHealth();
    const interval = setInterval(() => {
      syncCropHealth();
    }, 30000);
    return () => clearInterval(interval);
  }, [devLoc?.display_name, devLoc?.latitude, devLoc?.longitude]);

  // Listen to search queries from top header search bar
  useEffect(() => {
    const handleSearchEvent = (e: any) => {
      const query = e.detail;
      if (!query || typeof query !== 'string') return;
      const qLower = query.toLowerCase();

      // Check matching crop
      const matchedCrop = commonCrops.find((c) =>
        qLower.includes(c.name.toLowerCase())
      );
      if (matchedCrop) {
        handleSelectCrop(matchedCrop.name);
        return;
      }

      // Check matching disease example
      const matchedEx = diseaseExamples.find(
        (ex) =>
          qLower.includes(ex.title.toLowerCase()) ||
          qLower.includes(ex.id.replace('_', ' '))
      );
      if (matchedEx) {
        handleSelectExample(matchedEx.id);
        return;
      }

      // Check nutrient deficiency
      if (
        qLower.includes('nutrient') ||
        qLower.includes('deficiency') ||
        qLower.includes('fertilizer') ||
        qLower.includes('yellow')
      ) {
        handleQuickHelp('nutrients');
        return;
      }

      // Ask Gemini AI Doctor
      setQuestionInput(query);
      setChatLoading(true);
      setChatModalOpen(true);
      api
        .askCropHealthQuestion({
          question: query,
          crop_name: selectedCrop,
          location: devLoc?.display_name || 'Siliguri, West Bengal',
          lat: devLoc?.latitude,
          lng: devLoc?.longitude,
        })
        .then((res) => {
          setChatAnswer(res);
        })
        .finally(() => {
          setChatLoading(false);
        });
    };

    window.addEventListener('crop-health-search', handleSearchEvent);
    return () => window.removeEventListener('crop-health-search', handleSearchEvent);
  }, [selectedCrop, devLoc?.display_name, devLoc?.latitude, devLoc?.longitude]);

  // Execute AI Diagnosis via Google Gemini & ICAR pathology engine
  const runDiagnosis = async (params: {
    crop_name?: string;
    example_id?: string;
    image_base64?: string;
    symptoms?: string;
  }) => {
    setAnalyzing(true);
    setIsModalOpen(true);
    try {
      const res = await api.diagnoseCropHealth({
        crop_name: params.crop_name || selectedCrop,
        example_id: params.example_id,
        image_base64: params.image_base64,
        symptoms: params.symptoms,
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
      });
      if (res) {
        setDiagnosticResult(res);
      }
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Handler: Click an example card
  const handleSelectExample = (exId: string) => {
    setActiveExampleId(exId);
    setUploadedVideoUrl(null);
    setUploadedVideoName(null);
    const found = diseaseExamples.find((d) => d.id === exId);
    if (found) {
      setSelectedCrop(found.crop);
      setUploadedPreview(found.image);
    }
    runDiagnosis({ example_id: exId, crop_name: found?.crop || selectedCrop });
  };

  // Handler: Click a common crop
  const handleSelectCrop = (cropName: string) => {
    setSelectedCrop(cropName);
    setUploadedVideoUrl(null);
    setUploadedVideoName(null);
    const foundCrop = commonCrops.find((c) => c.name === cropName);
    if (foundCrop) {
      setUploadedPreview(foundCrop.image);
    }
    runDiagnosis({ crop_name: cropName });
  };

  // File upload processor supporting both images and video files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const vidUrl = URL.createObjectURL(file);
      setUploadedVideoUrl(vidUrl);
      setUploadedVideoName(file.name);
      setUploadedPreview(null);
      runDiagnosis({
        crop_name: selectedCrop,
        symptoms: `Foliar video recording of ${file.name}: evaluating canopy coverage, leaf spotting, and pest motion`,
      });
      return;
    }

    setUploadedVideoUrl(null);
    setUploadedVideoName(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPreview(result);
      const base64Data = result.split(',')[1] || result;
      runDiagnosis({
        crop_name: selectedCrop,
        image_base64: base64Data,
        symptoms: `Uploaded specimen analysis of ${file.name}`,
      });
    };
    reader.readAsDataURL(file);
  };

  // Question submission via Google Gemini AI
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    setChatLoading(true);
    setChatModalOpen(true);
    try {
      const res = await api.askCropHealthQuestion({
        question: questionInput.trim(),
        crop_name: selectedCrop,
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
      });
      setChatAnswer(res);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Quick Help items handler
  const handleQuickHelp = (type: string) => {
    if (type === 'photo') {
      imageInputRef.current?.click();
    } else if (type === 'treatment') {
      runDiagnosis({
        crop_name: selectedCrop,
        symptoms: `ICAR approved medicine dosage and curative treatment guidance for ${selectedCrop}`,
      });
    } else if (type === 'prevention') {
      runDiagnosis({
        crop_name: selectedCrop,
        symptoms: `Preventive agronomic measures, spacing, and crop rotation for ${selectedCrop}`,
      });
    } else if (type === 'nutrients') {
      runDiagnosis({
        crop_name: selectedCrop,
        example_id: 'nutrients',
        symptoms: `Nutritional deficiency chlorosis and NPK micronutrient rectifier for ${selectedCrop}`,
      });
    } else {
      setChatModalOpen(true);
    }
  };

  // Voice recognition toggle
  const handleVoiceToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    setIsListening(true);
    setVoiceModalOpen(true);
    setVoiceTranscript('Listening... Speak your crop problem now.');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setQuestionInput(transcript);
      setIsListening(false);

      // Auto ask Gemini
      api.askCropHealthQuestion({
        question: transcript,
        crop_name: selectedCrop,
        location: devLoc?.display_name || 'Siliguri, West Bengal',
        lat: devLoc?.latitude,
        lng: devLoc?.longitude,
      }).then((res) => {
        setChatAnswer(res);
        setChatModalOpen(true);
        setVoiceModalOpen(false);

        // Voice output
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(res.answer.replace(/[•\\*]/g, ''));
          utterance.lang = 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceTranscript('Could not capture audio. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <FarmerLayout>
      <div className="space-y-4 max-w-[1440px] mx-auto pb-10">
        
        {/* ==================== 1. HERO BANNER (Photo & Real Text Separated) ==================== */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-gray-200/80 min-h-[145px] sm:min-h-[155px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.88) 38%, rgba(255, 255, 255, 0.25) 58%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.45) 100%), url('/assets/farmer/crop_health/hero_banner_clean.jpg')`,
            backgroundPosition: 'center 45%',
            backgroundSize: 'cover',
          }}
        >
          {/* Left: Title, Subtitle, and 3 Action Pills */}
          <div className="relative z-10 max-w-xl space-y-2">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-none">
                Crop Health & Disease
              </h1>
              <p className="text-xs sm:text-[13px] font-semibold text-gray-700 mt-1 leading-snug">
                Identify crop problems instantly with images, videos or chat.
              </p>
            </div>

            {/* 3 Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* Pill 1: Detect Disease */}
              <div
                onClick={() => setActiveMode('image')}
                className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1.5 border border-gray-200/90 shadow-2xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-xs hover:border-emerald-300"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Leaf className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-gray-900">Detect Disease</div>
                  <div className="text-[9px] text-gray-500 font-medium">From leaf, stem, fruit</div>
                </div>
              </div>

              {/* Pill 2: Get Treatment */}
              <div
                onClick={() => setActiveMode('chat')}
                className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1.5 border border-gray-200/90 shadow-2xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-xs hover:border-amber-300"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-gray-900">Get Treatment</div>
                  <div className="text-[9px] text-gray-500 font-medium">Step by step guidance</div>
                </div>
              </div>

              {/* Pill 3: Keep Crops Healthy */}
              <div
                onClick={() => setActiveMode('voice')}
                className="bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl px-2.5 py-1.5 border border-gray-200/90 shadow-2xs flex items-center gap-2 cursor-pointer transition-all hover:shadow-xs hover:border-emerald-300"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-gray-900">Keep Crops Healthy</div>
                  <div className="text-[9px] text-gray-500 font-medium">Higher yield, lower loss</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Healthy Crops Card */}
          <div className="hidden lg:block relative z-10 shrink-0">
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-white/80 shadow-md max-w-[200px] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
                <Leaf className="w-5 h-5 fill-emerald-100 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-black text-gray-900 leading-tight">Healthy Crops</div>
                <div className="text-[10px] font-semibold text-gray-600 mt-0.5 leading-tight">Higher Yields</div>
                <div className="text-[10px] font-semibold text-gray-500 leading-tight">Better Tomorrow</div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. MAIN 2-COLUMN WORKSPACE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ==================== LEFT COLUMN (8 COLS) ==================== */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* 4 Mode Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <button
                onClick={() => setActiveMode('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeMode === 'image'
                    ? 'bg-[#008037] text-white'
                    : 'bg-[#f8faf8] hover:bg-emerald-50 text-gray-700 border border-gray-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Image Diagnosis</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('video');
                  videoInputRef.current?.click();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeMode === 'video'
                    ? 'bg-[#008037] text-white'
                    : 'bg-[#f8faf8] hover:bg-purple-50 text-gray-700 border border-gray-200'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Video Analysis</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('chat');
                  setChatModalOpen(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeMode === 'chat'
                    ? 'bg-[#008037] text-white'
                    : 'bg-[#f8faf8] hover:bg-blue-50 text-gray-700 border border-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask & Chat</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('voice');
                  handleVoiceToggle();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeMode === 'voice'
                    ? 'bg-[#008037] text-white'
                    : 'bg-[#f8faf8] hover:bg-amber-50 text-gray-700 border border-gray-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Voice Talk</span>
              </button>

              <div className="ml-auto hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[#008037] text-[10px] font-bold rounded-full border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008037] animate-pulse" />
                <span>Live • Auto-syncing</span>
              </div>
            </div>

            {/* Upload Drag & Drop Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    setUploadedPreview(result);
                    const base64Data = result.split(',')[1] || result;
                    runDiagnosis({
                      crop_name: selectedCrop,
                      image_base64: base64Data,
                      symptoms: `Dropped file analysis of ${file.name}`,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="bg-[#f4fbf7] border-2 border-dashed border-[#a7f3d0] rounded-2xl p-6 sm:p-7 text-center space-y-3.5 transition-colors hover:border-[#008037]/70"
            >
              {/* Green Glow Upload Icon */}
              <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto shadow-xs">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-[#00a84e] hover:bg-[#008037] text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105"
                  title="Upload Plant Photo or Video"
                >
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Upload a photo or video of the affected plant
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  You can also drag and drop files here
                </p>
              </div>

              {/* 4 Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {/* Upload Image */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-gray-800 border border-gray-200/90 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Upload Image</span>
                </button>

                {/* Upload Video */}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-purple-50 text-gray-800 border border-gray-200/90 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-purple-600 fill-current" />
                  <span>Upload Video</span>
                </button>

                {/* Choose File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50 text-gray-800 border border-gray-200/90 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Choose File</span>
                </button>

                {/* Choose Folder */}
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-amber-50 text-gray-800 border border-gray-200/90 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Folder className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Choose Folder</span>
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={folderInputRef}
                type="file"
                // @ts-ignore
                webkitdirectory=""
                directory=""
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Example: Click to Try Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900">
                  Example: Click to Try
                </h3>
                <span className="text-[10px] font-bold text-[#008037]">
                  Instant Google AI Diagnosis
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {diseaseExamples.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectExample(item.id)}
                    className={`bg-white rounded-xl border transition-all cursor-pointer overflow-hidden p-1 shadow-2xs group hover:border-[#008037] ${
                      activeExampleId === item.id
                        ? 'border-[#008037] ring-2 ring-emerald-500/20'
                        : 'border-gray-200/90'
                    }`}
                  >
                    <div className="h-16 sm:h-20 w-full rounded-lg overflow-hidden bg-gray-100 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="py-1 text-center">
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 block truncate">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Question & Chat Bar */}
            <form
              onSubmit={handleQuestionSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2"
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Type your question about crop health or upload a photo/video..."
                className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent outline-none px-1 py-1"
              />

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                {/* Left Attachments */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Attach Image"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Attach Video"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline text-[11px]">Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Attach File"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Attach Folder"
                  >
                    <Folder className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline text-[11px]">Folder</span>
                  </button>
                </div>

                {/* Right Mic & Send Button */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Voice Ask"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="p-2 bg-[#008037] hover:bg-[#00682e] text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                    title="Send Question"
                  >
                    {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ==================== RIGHT COLUMN (4 COLS) ==================== */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card 1: Common Crop Diseases */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900">
                  Common Crop Diseases
                </h3>
                <span
                  onClick={() => setViewAllModalOpen(true)}
                  className="text-[11px] font-bold text-[#008037] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <span>→</span>
                </span>
              </div>

              {/* 8 Crops in 4 cols x 2 rows */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {commonCrops.map((crop) => (
                  <div
                    key={crop.name}
                    onClick={() => handleSelectCrop(crop.name)}
                    className={`p-2 rounded-2xl bg-[#f4f9f6] hover:bg-emerald-50 transition-all cursor-pointer border flex flex-col items-center justify-center gap-1 group ${
                      selectedCrop === crop.name
                        ? 'border-[#008037] ring-1 ring-[#008037]'
                        : 'border-emerald-100/60'
                    }`}
                  >
                    <div className="w-9 h-9 flex items-center justify-center">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-800">
                      {crop.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Quick Help */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-100">
                <span className="text-amber-500">💡</span>
                <span>Quick Help</span>
              </h3>

              <div className="space-y-2 text-xs text-gray-700">
                <div
                  onClick={() => handleQuickHelp('photo')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-gray-800">Identify disease from photo</span>
                </div>

                <div
                  onClick={() => handleQuickHelp('treatment')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-gray-800">Get treatment & medicine suggestions</span>
                </div>

                <div
                  onClick={() => handleQuickHelp('prevention')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-gray-800">Know prevention methods</span>
                </div>

                <div
                  onClick={() => handleQuickHelp('nutrients')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-gray-800">Learn about nutrient deficiencies</span>
                </div>

                <div
                  onClick={() => setChatModalOpen(true)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-gray-800">Ask anything about crop health</span>
                </div>
              </div>
            </div>

            {/* Card 3: Need Expert Advice? */}
            <div className="bg-[#f0f8f5] p-3.5 rounded-2xl border border-emerald-100/90 shadow-2xs flex items-center gap-3">
              <img
                src="/assets/farmer/crop_health/expert_advisor.png"
                alt="KrishiGo Plant Doctor"
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white shadow-xs"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-xs font-black text-gray-900 leading-tight">
                  Need Expert Advice?
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Get detailed solutions for complex crop problems.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/services')}
                  className="mt-1 px-3 py-1 bg-[#008037] hover:bg-[#00682e] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Ask Now</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. CLINICAL DIAGNOSIS RESULT MODAL ==================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-green-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                      <span>Plant Health Diagnosis Report</span>
                      <span className="text-[9px] font-bold text-white bg-[#008037] px-2 py-0.5 rounded-full">
                        Google Gemini AI
                      </span>
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      Synchronized with Google Maps Platform Weather & ICAR Pathology Standards
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
                {analyzing ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#008037] mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Neural Plant Doctor analyzing symptoms...
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        Evaluating cellular patterns, local microclimate spore pressure, and ICAR diagnostic markers.
                      </p>
                    </div>
                  </div>
                ) : diagnosticResult ? (
                  <div className="space-y-4">
                    
                    {/* Top Diagnostic Banner */}
                    <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-700 text-white rounded-md">
                            {diagnosticResult.crop} Disease
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {diagnosticResult.confidence}% Accuracy Match
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            diagnosticResult.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {diagnosticResult.severity} Severity
                          </span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 mt-1">
                          {diagnosticResult.condition || diagnosticResult.possible_condition}
                        </h2>
                        {diagnosticResult.scientific_name && (
                          <p className="text-xs italic text-gray-500 font-medium">
                            Pathogen: {diagnosticResult.scientific_name}
                          </p>
                        )}
                      </div>

                      {uploadedVideoUrl ? (
                        <div className="w-24 h-16 rounded-xl overflow-hidden border border-emerald-300 shadow-xs shrink-0 bg-black">
                          <video
                            src={uploadedVideoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : uploadedPreview ? (
                        <img
                          src={uploadedPreview}
                          alt="Specimen"
                          className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shadow-xs shrink-0"
                        />
                      ) : null}
                    </div>

                    {/* Local Weather & Microclimate Risk */}
                    {diagnosticResult.weather_risk && (
                      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="font-bold text-gray-900">
                                {diagnosticResult.weather_risk.location}
                              </span>
                              <span className="text-gray-500 block text-[10px]">
                                Weather: {diagnosticResult.weather_risk.temp}°C • Humidity: {diagnosticResult.weather_risk.humidity}% • {diagnosticResult.weather_risk.risk_level}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsModalOpen(false);
                              openLocationModal();
                            }}
                            className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer shrink-0"
                          >
                            Google Map →
                          </button>
                        </div>
                        {diagnosticResult.weather_risk.advisory && (
                          <div className="text-[10px] text-blue-900 font-medium bg-blue-100/70 px-2 py-1 rounded-md mt-0.5">
                            ⚠️ {diagnosticResult.weather_risk.advisory}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Symptoms & Pathogen Cause */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                        <span className="font-bold text-gray-900 block mb-1">Observed Symptoms:</span>
                        <p className="text-gray-700 text-[11px] leading-relaxed">
                          {diagnosticResult.symptoms}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                        <span className="font-bold text-gray-900 block mb-1">Causes & Triggers:</span>
                        <p className="text-gray-700 text-[11px] leading-relaxed">
                          {diagnosticResult.causes || diagnosticResult.possible_cause}
                        </p>
                      </div>
                    </div>

                    {/* Recommended Medicines / Fungicides */}
                    {diagnosticResult.medicines && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Recommended Medicines & Dosages (ICAR Approved)</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {diagnosticResult.medicines.map((med: any, i: number) => (
                            <div key={i} className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px]">
                              <span className="font-bold text-emerald-950 block">{med.name}</span>
                              <span className="text-emerald-800 block text-[10px] mt-0.5">Dose: {med.dosage}</span>
                              <span className="text-gray-500 block text-[9px] mt-0.5">{med.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Management & Cultural Practices */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008037]" />
                        <span>Step-by-Step Treatment Guidance</span>
                      </h4>
                      <div className="space-y-1 text-[11px] text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                        {Array.isArray(diagnosticResult.management) ? (
                          diagnosticResult.management.map((step: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#008037] font-bold">{idx + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))
                        ) : (
                          <p>{diagnosticResult.management_guidance || diagnosticResult.management}</p>
                        )}
                      </div>
                    </div>

                    {/* Prevention */}
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">Preventive Practices:</span>
                      <p className="text-amber-800 text-[11px]">
                        {diagnosticResult.prevention}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6">No diagnostic information available.</p>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Prescription</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate('/farmer/services');
                    }}
                    className="px-3 py-1.5 bg-[#008037] hover:bg-[#00682e] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Consult Plant Doctor →
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. CHAT / QUESTION MODAL ==================== */}
        {chatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/70">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#008037]" />
                  <h3 className="text-sm font-black text-gray-900">
                    KrishiGo AI Crop Health Advisory
                  </h3>
                </div>
                <button
                  onClick={() => setChatModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                {chatLoading ? (
                  <div className="py-8 text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#008037] mx-auto" />
                    <p className="text-xs text-gray-600 font-semibold">Consulting Google Gemini AI Doctor...</p>
                  </div>
                ) : chatAnswer ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                      <span className="font-bold text-gray-500 block text-[10px]">Your Question:</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{chatAnswer.question}</p>
                    </div>

                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>Prescription & Solution</span>
                      </div>
                      <div className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-line">
                        {chatAnswer.answer}
                      </div>
                      <span className="block text-[9px] text-gray-400 pt-1">
                        Source: {chatAnswer.source} • Synced with {chatAnswer.location}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Type any question about plant disease, leaf spots, pest infestation, or fertilizer schedule:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                        placeholder="e.g. How to treat fruit rot in tomato?"
                        className="flex-1 p-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-green-600"
                      />
                      <button
                        onClick={handleQuestionSubmit}
                        className="px-4 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Ask
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 flex justify-end bg-gray-50">
                <button
                  onClick={() => setChatModalOpen(false)}
                  className="px-4 py-1.5 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. VOICE TALK MODAL ==================== */}
        {voiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-sm overflow-hidden p-6 text-center space-y-4 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#008037] mx-auto flex items-center justify-center relative">
                {isListening && (
                  <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                )}
                <Mic className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-sm font-black text-gray-900">Voice Plant Doctor</h3>
                <p className="text-xs text-gray-500 mt-1">{voiceTranscript}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsListening(false);
                  setVoiceModalOpen(false);
                }}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ==================== 6. VIEW ALL COMMON DISEASES MODAL ==================== */}
        {viewAllModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-3xl overflow-hidden flex flex-col max-h-[88vh] animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-green-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900">
                      Major Indian Crop Diseases & ICAR Prescriptions
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      Complete pathology database for 8 core agricultural commodities
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewAllModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commonCrops.map((crop) => {
                    const primary = allDiseasesCatalog?.crops_primary_diseases?.[crop.name];
                    const catalogInfo = allDiseasesCatalog?.crops?.[crop.name];
                    return (
                      <div
                        key={crop.name}
                        className="p-3 bg-[#f8faf8] rounded-2xl border border-emerald-100/80 hover:border-emerald-300 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <img src={crop.image} alt={crop.name} className="w-6 h-6 object-contain" />
                              <span className="font-extrabold text-xs text-gray-900">{crop.name}</span>
                            </div>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                              ICAR Verified
                            </span>
                          </div>

                          <div className="mt-2 space-y-1 text-[10px]">
                            <p className="font-bold text-gray-800">
                              {primary?.condition || catalogInfo?.primary_disease || 'Major Disease'}
                            </p>
                            <p className="text-gray-500 line-clamp-2">
                              {primary?.symptoms || catalogInfo?.symptoms}
                            </p>
                            <div className="pt-1 text-[9.5px]">
                              <span className="font-semibold text-emerald-900 block">Top Prescription:</span>
                              <span className="text-gray-700 block">
                                {primary?.medicines?.[0]?.name ? `${primary.medicines[0].name} (${primary.medicines[0].dosage})` : catalogInfo?.top_medicine}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setViewAllModalOpen(false);
                            handleSelectCrop(crop.name);
                          }}
                          className="mt-3 w-full py-1.5 bg-[#008037] hover:bg-[#00682e] text-white text-[10px] font-bold rounded-xl cursor-pointer shadow-2xs transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Diagnose {crop.name}</span>
                          <span>→</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 border-t border-gray-100 flex justify-end bg-gray-50">
                <button
                  onClick={() => setViewAllModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </FarmerLayout>
  );
};

export default CropHealthPage;
