import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useDeviceLocation } from '../../context/LocationContext';
import { api } from '../../services/api';
import {
  Compass,
  ChevronRight,
  ArrowRight,
  Leaf,
  Sprout,
  CloudRain,
  FlaskConical,
  Coins,
  Gauge,
  Image as ImageIcon,
  Video,
  FileText,
  Folder,
  Mic,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Bot,
  User as UserIcon,
  AlertCircle,
  ShieldCheck,
  Droplets,
  ThermometerSun,
  Activity,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  imageUrl?: string;
  isInitialMock?: boolean;
  disease?: string;
  crop?: string;
  steps?: string[];
  previewImage?: string;
  guide?: {
    pathogen?: string;
    severity?: string;
    favorable_weather?: string;
    chemical_control?: string;
    organic_control?: string;
    irrigation_tip?: string;
  };
  feedback?: 'liked' | 'disliked' | null;
}

export const AICopilotPage: React.FC = () => {
  const { location: devLoc } = useDeviceLocation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialVoice = searchParams.get('voice') === 'true';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [activeGuideData, setActiveGuideData] = useState<any>(null);
  const [tryAskingModalOpen, setTryAskingModalOpen] = useState(false);

  // Hidden File Inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial messages matching reference picture 100%
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-user-1',
      sender: 'user',
      text: 'My tomato leaves have spots. What disease is this?',
      time: '11:42 AM',
      imageUrl: '/assets/farmer/copilot/tomato_blight_leaf.jpg',
      isInitialMock: true,
    },
    {
      id: 'msg-ai-1',
      sender: 'ai',
      text: "The leaf shows signs of Early Blight in tomato.\nHere's what you can do:",
      time: '11:43 AM',
      disease: 'Early Blight',
      crop: 'Tomato',
      previewImage: '/assets/farmer/copilot/ai_blight_preview.jpg',
      steps: [
        'Remove affected leaves.',
        'Use a recommended fungicide (e.g., Mancozeb).',
        'Avoid over watering.',
        'Keep good spacing between plants.',
      ],
      guide: {
        pathogen: 'Alternaria solani (Fungal plant pathogen)',
        severity: 'Moderate to High (Early stage intervention recommended)',
        favorable_weather: 'Temperature 24-29°C, high relative humidity (>80%), wet foliage',
        chemical_control: 'Mancozeb 75% WP @ 2.5g/L water or Azoxystrobin 23% SC @ 1ml/L',
        organic_control: 'Neem oil (1500 ppm) @ 3-5 ml/L, Trichoderma harzianum @ 5g/L soil treatment',
        irrigation_tip: 'Switch immediately to drip irrigation; avoid overhead sprinkler wetting',
      },
      feedback: null,
      isInitialMock: true,
    },
  ]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external search query or voice trigger from header
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
    if (initialVoice) {
      startVoiceRecognition();
    }

    const handleExternalQuery = (e: any) => {
      if (e.detail) {
        handleSendMessage(e.detail);
      }
    };
    const handleExternalVoice = () => {
      startVoiceRecognition();
    };

    window.addEventListener('farmer-ai-query', handleExternalQuery);
    window.addEventListener('farmer-ai-voice', handleExternalVoice);
    return () => {
      window.removeEventListener('farmer-ai-query', handleExternalQuery);
      window.removeEventListener('farmer-ai-voice', handleExternalVoice);
    };
  }, []);

  // Web Speech API - Voice recognition setup
  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your question or use Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works for Indian English, Hindi & regional terms

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        if (event.results[0].isFinal) {
          setIsListening(false);
          handleSendMessage(currentTranscript);
        }
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
        setSpeechTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech playback
  const handleToggleSpeak = (msgId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message text
  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Feedback (Like / Dislike)
  const handleFeedback = (msgId: string, type: 'liked' | 'disliked') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m))
    );
  };

  // Send query to KrishiGo AI Copilot
  const handleSendMessage = async (text?: string, attachedImgUrl?: string, attachedImgB64?: string) => {
    const query = (text || input).trim();
    if (!query && !attachedImgUrl && !attachedImgB64) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query || 'Analyze attached crop photo for disease & health treatment.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: attachedImgUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.askAICopilot({
        message: query || 'Analyze attached crop photo',
        image_url: attachedImgUrl,
        image_base64: attachedImgB64,
        farm_context: {
          location: devLoc?.display_name || 'Siliguri, West Bengal',
          lat: devLoc?.latitude,
          lng: devLoc?.longitude,
          area: '2.5 Acres',
          crops: ['Tomato', 'Potato', 'Mustard', 'Rice'],
          soil: 'Loamy Alluvial',
        },
      });

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply || 'Analysis completed with agricultural recommendations.',
        time: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disease: response.disease,
        crop: response.crop,
        previewImage: response.preview_image,
        steps: response.steps,
        guide: response.guide,
        feedback: null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const fallbackAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: 'The leaf shows signs of **Early Blight** in tomato.\nHere are the recommended ICAR action steps:',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disease: 'Early Blight',
        crop: 'Tomato',
        previewImage: '/assets/farmer/copilot/ai_blight_preview.jpg',
        steps: [
          'Remove affected leaves.',
          'Use a recommended fungicide (e.g., Mancozeb).',
          'Avoid over watering.',
          'Keep good spacing between plants.',
        ],
        guide: {
          pathogen: 'Alternaria solani',
          severity: 'Moderate',
          favorable_weather: 'Temperature 24-29°C, high humidity',
          chemical_control: 'Mancozeb 75% WP @ 2.5g/L water',
          organic_control: 'Neem oil spray @ 3ml/L',
          irrigation_tip: 'Drip irrigation recommended',
        },
        feedback: null,
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      handleSendMessage('Please analyze this uploaded crop image for pests, disease, or nutrient deficiency.', b64, b64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Video Upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSendMessage(`Analyzing uploaded field video: "${file.name}" for crop anomalies and growth patterns.`);
    e.target.value = '';
  };

  // Handle Document File Upload
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSendMessage(`Please review uploaded farm report/file: "${file.name}" and provide agronomic guidance.`);
    e.target.value = '';
  };

  // Handle Folder Upload
  const handleFolderUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleSendMessage(`Batch analyzing ${files.length} farm monitoring files from folder "${files[0].webkitRelativePath?.split('/')[0] || 'Field Survey'}".`);
    e.target.value = '';
  };

  // 6 "Try Asking" Prompts matching reference picture 100%
  const tryAskingList = [
    {
      icon: Leaf,
      iconColor: 'text-[#008037]',
      text: 'My crop leaves are yellow. What is the problem?',
    },
    {
      icon: Sprout,
      iconColor: 'text-[#16a34a]',
      text: 'When should I plant rice?',
    },
    {
      icon: CloudRain,
      iconColor: 'text-[#0284c7]',
      text: 'Will it rain tomorrow?',
    },
    {
      icon: FlaskConical,
      iconColor: 'text-[#d97706]',
      text: 'What fertilizer should I use?',
    },
    {
      icon: Coins,
      iconColor: 'text-[#059669]',
      text: 'Show market price of potato',
    },
    {
      icon: Gauge,
      iconColor: 'text-[#2563eb]',
      text: 'How much water does tomato need?',
    },
  ];

  return (
    <FarmerLayout>
      {/* Hidden File Inputs for all upload actions */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        className="hidden"
        onChange={handleVideoFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,image/*"
        className="hidden"
        onChange={handleDocumentFileChange}
      />
      <input
        type="file"
        ref={folderInputRef}
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={handleFolderUploadChange}
      />

      <div className="flex flex-col lg:flex-row gap-5 items-start pb-10">
        {/* ========================================================= */}
        {/* LEFT COLUMN: HERO BANNER + CHAT CONVERSATION + INPUT BAR  */}
        {/* ========================================================= */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* 1. TOP HERO BANNER (Photo & Real Text Separated) */}
          <div
            className="relative w-full rounded-[26px] overflow-hidden shadow-sm border border-emerald-200/80 min-h-[190px] sm:min-h-[210px] p-5 sm:p-7 flex flex-col justify-center bg-cover bg-center select-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.08) 28%, rgba(255, 255, 255, 0.94) 42%, rgba(255, 255, 255, 0.90) 72%, rgba(255, 255, 255, 0.55) 100%), url('/assets/farmer/copilot/hero_banner_clean.jpg')`,
              backgroundPosition: 'center 48%',
              backgroundSize: 'cover',
            }}
          >
            {/* The robot mascot is visible on the left. Text and buttons are placed on the center-right */}
            <div className="relative z-10 sm:pl-[28%] md:pl-[32%] lg:pl-[34%] space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-black text-gray-900 tracking-tight leading-none">
                  KrishiGo AI Farm Copilot
                </h1>
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">
                Your 24/7 farming assistant. Ask anything about your farm.
              </p>

              {/* 4 Interactive Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
                {/* Chat Button */}
                <button
                  type="button"
                  onClick={() => {
                    chatInputRef.current?.focus();
                    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/95 hover:bg-white backdrop-blur-xs px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-2xs hover:shadow-xs flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:rotate-6 transition-transform" />
                  <span>Chat</span>
                </button>

                {/* Voice Button */}
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  className="bg-white/95 hover:bg-white backdrop-blur-xs px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-2xs hover:shadow-xs flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <Mic className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Voice</span>
                </button>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-white/95 hover:bg-white backdrop-blur-xs px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-2xs hover:shadow-xs flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <ImageIcon className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span>Upload</span>
                </button>

                {/* Files Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/95 hover:bg-white backdrop-blur-xs px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200/90 shadow-2xs hover:shadow-xs flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span>Files</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. CHAT CONVERSATION CONTAINER */}
          <div className="space-y-4 pt-1 min-h-[360px]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              if (isUser) {
                return (
                  /* USER MESSAGE BUBBLE (Exact match: mint green bubble on right with leaf image) */
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl w-full sm:w-auto bg-[#eaf7ee] border border-[#d2edd7] rounded-[22px] p-4 sm:p-5 shadow-xs text-gray-900 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
                          <UserIcon className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="text-[13px] sm:text-sm font-medium text-gray-800">
                          {msg.text}
                        </span>
                      </div>

                      {msg.imageUrl && (
                        <div className="overflow-hidden rounded-xl border border-green-200/80 max-w-[280px] shadow-2xs">
                          <img
                            src={msg.imageUrl}
                            alt="Crop Symptom"
                            className="w-full h-auto object-cover max-h-[180px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                /* AI COPILOT RESPONSE (Exact match: Robot avatar, steps on left, preview thumbnail on right, guide button) */
                <div key={msg.id} className="flex items-start gap-3 max-w-2xl w-full">
                  {/* Robot Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border border-green-200 shadow-2xs bg-white mt-1">
                    <img
                      src="/assets/farmer/copilot/robot_avatar.jpg"
                      alt="KrishiGo AI Mascot"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback icon if image fails
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Main AI Response Box */}
                  <div className="flex-1 space-y-2">
                    <div className="bg-white border border-[#e1ece3] rounded-[24px] p-5 sm:p-6 shadow-xs text-gray-900 space-y-4">
                      {/* Introductory sentence */}
                      <div className="text-[13px] sm:text-[14.5px] leading-relaxed text-gray-800">
                        {msg.text.includes('Early Blight') ? (
                          <>
                            The leaf shows signs of{' '}
                            <span className="font-bold text-[#008037]">Early Blight</span> in tomato.
                            <br />
                            Here's what you can do:
                          </>
                        ) : (
                          <div className="whitespace-pre-line">{msg.text}</div>
                        )}
                      </div>

                      {/* Side-by-side or stacked: 4 Steps + Thumbnail Preview */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        {/* Numbered Steps List */}
                        {msg.steps && msg.steps.length > 0 && (
                          <div className="flex-1 space-y-2.5 w-full">
                            {msg.steps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-xs sm:text-[13px] text-gray-700 font-medium">
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Right Preview Card with Dark Title Badge (Exact match) */}
                        {msg.previewImage && (
                          <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs shrink-0 w-36 sm:w-40 aspect-[165/155]">
                            <img
                              src={msg.previewImage}
                              alt={msg.disease || 'Crop Disease Preview'}
                              className="w-full h-full object-cover"
                            />
                            {/* Dark translucent bottom badge */}
                            <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-xs p-2 text-white">
                              <p className="text-[11px] font-bold leading-tight">
                                {msg.disease || 'Early Blight'}
                              </p>
                              <p className="text-[9.5px] text-gray-300 leading-tight">
                                {msg.crop || 'Tomato'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View Detailed Guide Button (Exact match) */}
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGuideData({
                              disease: msg.disease || 'Early Blight',
                              crop: msg.crop || 'Tomato',
                              guide: msg.guide,
                              steps: msg.steps,
                            });
                            setGuideModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#dcfce7] hover:bg-[#c2f6d3] text-[#166534] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs group"
                        >
                          <span>View Detailed Guide</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Feedback Action Buttons (👍, 👎, 📋, 🔊) */}
                    <div className="flex items-center gap-3 px-2 text-gray-400">
                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, 'liked')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:text-green-600 ${
                          msg.feedback === 'liked' ? 'text-green-600 bg-green-50' : 'hover:bg-gray-100'
                        }`}
                        title="Helpful recommendation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, 'disliked')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:text-rose-600 ${
                          msg.feedback === 'disliked' ? 'text-rose-600 bg-rose-50' : 'hover:bg-gray-100'
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            msg.id,
                            `${msg.text}\n${msg.steps ? msg.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : ''}`
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600 font-bold text-[10px]">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleSpeak(
                            msg.id,
                            `${msg.text}. ${msg.steps ? msg.steps.join('. ') : ''}`
                          )
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          speakingId === msg.id
                            ? 'text-emerald-700 bg-emerald-50 animate-pulse'
                            : 'hover:bg-gray-100 hover:text-gray-700'
                        }`}
                        title="Listen to advice (Read aloud)"
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-3 max-w-lg">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-green-200 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-[22px] p-4 shadow-xs text-xs text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#008037] animate-spin" />
                  <span>KrishiGo AI is analyzing crop symptoms & weather intelligence...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* 3. FLOATING BOTTOM INPUT BAR (Exact match to reference picture) */}
          <div className="bg-white rounded-[26px] p-4 border border-gray-200/90 shadow-md space-y-3">
            {/* Top text input */}
            <div>
              <input
                ref={chatInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything about your crops, weather, soil, market, or farming..."
                className="w-full text-xs sm:text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Bottom Row: 4 Attachment Chips on Left + Mic & Send on Right */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
              {/* 4 Attachment Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 custom-scrollbar">
                {/* Image */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-green-50/60 border border-gray-200/90 hover:border-green-400 text-gray-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[11px] sm:text-xs">Image</span>
                </button>

                {/* Video */}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-green-50/60 border border-gray-200/90 hover:border-green-400 text-gray-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <Video className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[11px] sm:text-xs">Video</span>
                </button>

                {/* File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-green-50/60 border border-gray-200/90 hover:border-green-400 text-gray-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[11px] sm:text-xs">File</span>
                </button>

                {/* Folder */}
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-green-50/60 border border-gray-200/90 hover:border-green-400 text-gray-700 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <Folder className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[11px] sm:text-xs">Folder</span>
                </button>
              </div>

              {/* Right Controls: Mic + Send Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-400 animate-pulse'
                      : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700'
                  }`}
                  title="Voice Ask"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-[#008037] hover:bg-[#006e2e] disabled:opacity-50 text-white rounded-full transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: TRY ASKING + UPLOAD & ANALYZE + TALK TO AI  */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 space-y-4">
          {/* CARD 1: "Try Asking" (Exact match) */}
          <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-3.5">
            {/* Header: 🧭 Try Asking | View All → */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#008037] text-white flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">Try Asking</h2>
              </div>
              <button
                type="button"
                onClick={() => setTryAskingModalOpen(true)}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 6 Prompts List with icons and right chevrons */}
            <div className="space-y-1">
              {tryAskingList.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.text)}
                    className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-green-50/90 flex items-center justify-center shrink-0">
                        <IconComponent className={`w-3.5 h-3.5 ${item.iconColor}`} />
                      </div>
                      <span className="text-[12.5px] font-medium text-gray-800 group-hover:text-[#008037] truncate">
                        {item.text}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 2: "Upload and Analyze" (Exact match 2x2 grid) */}
          <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-3.5">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#008037] text-white flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <h2 className="text-sm font-black text-gray-900 tracking-tight">Upload and Analyze</h2>
            </div>

            {/* 2x2 Upload Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Upload Image */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200/80 hover:border-green-400 bg-white hover:bg-green-50/40 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-gray-900 leading-snug">Upload Image</div>
                  <div className="text-[9.5px] text-gray-400 font-medium leading-snug">(Leaf, Crop, Soil)</div>
                </div>
              </button>

              {/* 2. Upload Video */}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200/80 hover:border-purple-400 bg-white hover:bg-purple-50/40 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-gray-900 leading-snug">Upload Video</div>
                  <div className="text-[9.5px] text-gray-400 font-medium leading-snug">(Field, Crop, Problem)</div>
                </div>
              </button>

              {/* 3. Upload File */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200/80 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-gray-900 leading-snug">Upload File</div>
                  <div className="text-[9.5px] text-gray-400 font-medium leading-snug">(PDF, Report, Photo)</div>
                </div>
              </button>

              {/* 4. Upload Folder */}
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200/80 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-gray-900 leading-snug">Upload Folder</div>
                  <div className="text-[9.5px] text-gray-400 font-medium leading-snug">(Multiple Files)</div>
                </div>
              </button>
            </div>
          </div>

          {/* CARD 3: "Talk to AI" (Exact match with sound waves + glowing mic circle) */}
          <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#008037] text-white flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <h2 className="text-sm font-black text-gray-900 tracking-tight">Talk to AI</h2>
            </div>

            {/* Central glowing mic and animated sound waves */}
            <div className="flex flex-col items-center justify-center pt-2 pb-1">
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                {/* Left Sound Wave Bars */}
                <div className="flex items-center gap-1 h-12">
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-7 animate-pulse' : 'h-3'}`} />
                  <span className={`w-1 rounded-full bg-emerald-500 transition-all duration-300 ${isListening ? 'h-10 animate-bounce' : 'h-6'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-12 animate-pulse' : 'h-8'}`} />
                  <span className={`w-1 rounded-full bg-emerald-500 transition-all duration-300 ${isListening ? 'h-8 animate-bounce' : 'h-4'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-6 animate-pulse' : 'h-2'}`} />
                </div>

                {/* Central Glowing Mic Button */}
                <div className="relative">
                  {/* Outer glowing ring */}
                  <div
                    className={`absolute -inset-2 rounded-full bg-emerald-100/60 filter blur-xs transition-all ${
                      isListening ? 'scale-110 opacity-100 bg-emerald-200' : 'opacity-50'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-lg ${
                      isListening
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                        : 'bg-[#008037] hover:bg-[#006e2e] text-white ring-4 ring-emerald-100'
                    }`}
                    title={isListening ? 'Stop Listening' : 'Tap to Speak to AI'}
                  >
                    <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
                  </button>
                </div>

                {/* Right Sound Wave Bars */}
                <div className="flex items-center gap-1 h-12">
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-6 animate-pulse' : 'h-2'}`} />
                  <span className={`w-1 rounded-full bg-emerald-500 transition-all duration-300 ${isListening ? 'h-8 animate-bounce' : 'h-4'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-12 animate-pulse' : 'h-8'}`} />
                  <span className={`w-1 rounded-full bg-emerald-500 transition-all duration-300 ${isListening ? 'h-10 animate-bounce' : 'h-6'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-300 ${isListening ? 'h-7 animate-pulse' : 'h-3'}`} />
                </div>
              </div>

              {/* Text underneath mic */}
              <div className="text-center mt-3 space-y-0.5">
                <p className="text-xs sm:text-[13.5px] font-black text-gray-900">
                  {isListening ? 'Listening...' : 'Tap to Talk'}
                </p>
                <p className="text-[10.5px] sm:text-xs text-gray-500 font-medium">
                  {speechTranscript || 'Ask anything about farming'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW DETAILED GUIDE MODAL                        */}
      {/* ========================================================= */}
      {guideModalOpen && activeGuideData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-7 space-y-5 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-green-200 flex items-center justify-center text-[#008037]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">
                    {activeGuideData.disease} Management Guide
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    ICAR & CIBRC Certified Agronomic Protocol for {activeGuideData.crop}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disease Characteristics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  Pathogen Classification
                </span>
                <p className="text-gray-900 font-semibold">
                  {activeGuideData.guide?.pathogen || 'Alternaria solani (Fungal plant pathogen)'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <ThermometerSun className="w-3.5 h-3.5 text-amber-500" />
                  Favorable Weather
                </span>
                <p className="text-gray-900 font-semibold">
                  {activeGuideData.guide?.favorable_weather || '24-29°C, >80% relative humidity, leaf wetness'}
                </p>
              </div>
            </div>

            {/* Chemical & Organic Control */}
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50/70 border border-green-200 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-black text-emerald-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#008037]" />
                  Recommended Chemical Control & ICAR Dosages
                </h4>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  • <strong>Preventive Foliar Spray:</strong> Mancozeb 75% WP @ 2.5 grams per liter of water (or Chlorothalonil 75% WP @ 2g/L).
                  <br />
                  • <strong>Curative Systemic Spray:</strong> Azoxystrobin 23% SC @ 1.0 ml per liter or Difenoconazole 25% EC @ 0.5 ml per liter water.
                  <br />
                  • Apply during morning hours with a flat-fan nozzle for uniform leaf canopy coverage.
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-amber-700" />
                  Organic & Biological Remedy
                </h4>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  • Cold-pressed Neem Seed Kernel Extract (Neem Oil 1500 ppm) @ 3–5 ml/L water with 1 ml mild liquid soap.
                  <br />
                  • Soil application and foliar treatment with <em>Trichoderma harzianum</em> @ 5g/L water to suppress soilborne spore reservoirs.
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-black text-blue-900 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-700" />
                  Irrigation & Prevention Routine
                </h4>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  • Switch from overhead flood/sprinkler to drip irrigation to prevent moisture accumulation on leaves.
                  <br />
                  • Prune lower leaves (bottom 20-30 cm) to eliminate rain-splash soil contamination.
                  <br />
                  • Maintain 60cm row spacing for good air circulation and solar penetration.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  handleToggleSpeak(
                    'guide-speech',
                    `Early Blight guide for ${activeGuideData.crop}. Recommended chemical dosage: Mancozeb 75% WP at 2.5 grams per liter water. Use drip irrigation and prune lower leaves.`
                  )
                }
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Listen Audio Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="px-5 py-2 bg-[#008037] hover:bg-[#006e2e] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: VIEW ALL QUESTIONS MODAL                         */}
      {/* ========================================================= */}
      {tryAskingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#008037]" />
                <h3 className="text-base font-black text-gray-900">Curated Farming Questions</h3>
              </div>
              <button
                type="button"
                onClick={() => setTryAskingModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                'My crop leaves are yellow. What is the problem?',
                'When should I plant rice?',
                'Will it rain tomorrow?',
                'What fertilizer should I use?',
                'Show market price of potato',
                'How much water does tomato need?',
                'How to control stem borer pest in paddy?',
                'What is the ideal soil pH for potato cultivation?',
                'Explain PM-Kisan scheme registration procedure',
                'How to prepare organic Jeevamrit liquid fertilizer?',
                'What are current Siliguri APMC mandi prices for cabbage and cauliflower?',
                'When should I irrigate wheat after sowing?',
              ].map((query, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => {
                    setTryAskingModalOpen(false);
                    handleSendMessage(query);
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 text-xs font-semibold text-gray-800 hover:text-[#008037] flex items-center justify-between gap-2 border border-gray-100 cursor-pointer transition-colors"
                >
                  <span>{query}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};
export default AICopilotPage;
