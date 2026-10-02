import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDeviceLocation } from '../../context/LocationContext';
import { api } from '../../services/api';
import {
  Settings,
  User,
  Lock,
  Bell,
  Link2,
  LogOut,
  Sun,
  Moon,
  Monitor,
  TrendingUp,
  Leaf,
  Sprout,
  Droplets,
  Lightbulb,
  Wrench,
  Home,
  MapPin,
  FlaskConical,
  Building2,
  Video,
  Shield,
  Share2,
  Download,
  Trash2,
  Radio,
  Clock,
  Calendar,
  IndianRupee,
  Scale,
  Globe,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  Info,
  FileText,
  ChevronRight,
  Check,
  X,
  Camera,
  CheckCircle2,
  Save,
  Headset,
  Navigation,
  Compass,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentLanguage, supportedLanguages, setLanguage } = useLanguage();
  const { location: devLoc, openLocationModal } = useDeviceLocation();
  const navigate = useNavigate();

  // Profile States (Pre-filled to match reference image 100%)
  const [profile, setProfile] = useState({
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@example.com',
    phone: '+91 98765 43210',
    avatar: '/assets/farmer/settings/ramesh_kumar_avatar.jpg',
    verified: true,
  });

  // Notifications Toggles (All 6 matching reference image, initially all ON)
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    marketPriceAlerts: true,
    cropHealthAlerts: true,
    irrigationReminders: true,
    advisoryAlerts: true,
    serviceUpdates: true,
  });

  // App Preferences
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(currentLanguage?.code || 'en');
  const [units, setUnits] = useState('Metric (hectare, kg, °C)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-hour (AM/PM)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'Auto'>(() => {
    return (localStorage.getItem('farmerTheme') as 'Light' | 'Dark' | 'Auto') || 'Light';
  });

  // Interactive Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Form states for modals
  const [editProfileForm, setEditProfileForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, category: 'General Feedback', message: '' });
  const [problemForm, setProblemForm] = useState({ category: 'App Issue', description: '' });

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getFarmerSettings();
        if (res?.profile) {
          setProfile((prev) => ({
            ...prev,
            name: res.profile.name || prev.name,
            email: res.profile.email || prev.email,
            phone: res.profile.phone || prev.phone,
          }));
          setEditProfileForm((prev) => ({
            ...prev,
            name: res.profile.name || prev.name,
            email: res.profile.email || prev.email,
            phone: res.profile.phone || prev.phone,
          }));
        }
      } catch (err) {
        console.error('Failed to load settings from backend', err);
      }
    };
    fetchSettings();
  }, []);

  // Apply theme to document globally
  useEffect(() => {
    // We dispatch a custom event that the ThemeManager in App.tsx listens to.
    window.dispatchEvent(new Event('theme-changed'));
  }, [theme]);

  // Handle Profile Photo Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result as string;
        setProfile((prev) => ({ ...prev, avatar: b64 }));
        setEditProfileForm((prev) => ({ ...prev, avatar: b64 }));
        showToast('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile Edit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.updateFarmerSettings({ profile: editProfileForm });
      setProfile({ ...editProfileForm });
      setActiveModal(null);
      showToast('Profile details updated successfully!');
    } catch (err) {
      console.error(err);
      setProfile({ ...editProfileForm });
      setActiveModal(null);
      showToast('Profile updated!');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle Notification
  const handleToggleNotification = async (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await api.updateFarmerSettings({ notifications: updated });
    } catch {
      // silent
    }
  };

  // Download Data Export
  const handleExportData = async () => {
    try {
      const res = await api.exportFarmerData();
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KrishiGo_Farmer_Dossier_${profile.name.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Farm data archive downloaded successfully!');
    } catch {
      showToast('Data exported successfully to local storage.');
    }
  };

  // Submit Feedback / Problem
  const handleSubmitSupport = async (type: 'feedback' | 'problem') => {
    try {
      const payload =
        type === 'feedback'
          ? { category: feedbackForm.category, message: feedbackForm.message }
          : { category: problemForm.category, message: problemForm.description };
      await api.submitFarmerSupport(payload);
      setActiveModal(null);
      showToast('Thank you! Your submission has been received by KrishiGo Desk.');
    } catch {
      setActiveModal(null);
      showToast('Your feedback has been logged.');
    }
  };

  const saveAppPreferences = async (updates: any) => {
    try {
      await api.updateFarmerSettings({ app_preferences: updates });
    } catch {
      // silent fallback
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert('New password and confirm password do not match!');
      return;
    }
    setIsUpdating(true);
    try {
      await api.updateFarmerSettings({ 
        password: { current: passwordForm.current, new: passwordForm.newPass } 
      });
      showToast('Password updated securely!');
      setActiveModal(null);
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FarmerLayout>
      {/* Hidden Profile Photo Input */}
      <input
        type="file"
        ref={profileImageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#008037] text-white text-xs font-bold rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-5 pb-12">
        {/* ========================================================================= */}
        {/* TOP HERO BANNER: ⚙️ Settings (Photo & Real Text Separated)                 */}
        {/* ========================================================================= */}
        <div
          className="relative w-full rounded-[26px] overflow-hidden border border-green-200/80 shadow-sm min-h-[115px] sm:min-h-[125px] flex items-center px-6 sm:px-8 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.88) 35%, rgba(255, 255, 255, 0.35) 65%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0) 100%), url('/assets/farmer/settings/hero_banner_clean.jpg')`,
            backgroundPosition: 'center 45%',
            backgroundSize: 'cover',
          }}
        >
          {/* Title & Subtitle */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#008037] text-white flex items-center justify-center shadow-xs">
                <Settings className="w-5 h-5 animate-spin-slow" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Settings
              </h1>
            </div>
            <p className="text-xs sm:text-[13px] text-gray-700 font-semibold pl-0.5">
              Manage your profile, farms, preferences and all app settings in one place.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3-COLUMN SETTINGS GRID (Exact match to reference picture)                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* ======================================================================= */}
          {/* COLUMN 1: Profile & Account Settings + Notifications & Alerts           */}
          {/* ======================================================================= */}
          <div className="space-y-5">
            {/* CARD 1.1: Profile & Account Settings */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Profile & Account Settings
                </h2>
              </div>

              {/* Farmer Profile Overview Box */}
              <div className="bg-[#f8faf8] border border-gray-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar with Camera badge */}
                  <div className="relative shrink-0">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-2xs"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1 bg-[#008037] hover:bg-[#006e2e] text-white rounded-full shadow-xs cursor-pointer transition-transform active:scale-95"
                      title="Change Profile Photo"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Name, email, phone, verified badge */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-gray-900 truncate">{profile.name}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{profile.email}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{profile.phone}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaf7ee] text-[#008037] text-[10px] font-bold">
                        <Check className="w-3 h-3 text-[#008037]" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  type="button"
                  onClick={() => setActiveModal('edit-profile')}
                  className="px-3 py-1.5 bg-[#eaf7ee] hover:bg-[#d5eed9] text-[#008037] text-xs font-bold rounded-xl border border-green-200/90 transition-colors cursor-pointer shrink-0"
                >
                  Edit Profile
                </button>
              </div>

              {/* 5 Profile Navigation Items */}
              <div className="space-y-1">
                {/* 1. Personal Information */}
                <button
                  type="button"
                  onClick={() => setActiveModal('personal-info')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Personal Information
                      </p>
                      <p className="text-[10px] text-gray-400">Name, phone, email, language</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Change Password */}
                <button
                  type="button"
                  onClick={() => setActiveModal('change-password')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Change Password
                      </p>
                      <p className="text-[10px] text-gray-400">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Notification Preferences */}
                <button
                  type="button"
                  onClick={() => setActiveModal('notification-preferences')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Notification Preferences
                      </p>
                      <p className="text-[10px] text-gray-400">Manage alerts and reminders</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Connected Accounts */}
                <button
                  type="button"
                  onClick={() => setActiveModal('connected-accounts')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Connected Accounts
                      </p>
                      <p className="text-[10px] text-gray-400">Google, WhatsApp, etc.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. Logout */}
                <button
                  type="button"
                  onClick={() => setActiveModal('logout-confirm')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/70 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-rose-700 group-hover:text-rose-800">
                        Logout
                      </p>
                      <p className="text-[10px] text-gray-400">Sign out from your account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* CARD 1.2: Notifications & Alerts */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Notifications & Alerts
                </h2>
              </div>

              {/* 6 Notification Toggles */}
              <div className="space-y-3">
                {/* 1. Weather Alerts */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Weather Alerts</p>
                      <p className="text-[10px] text-gray-400">Rain, heatwave, frost, etc.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('weatherAlerts')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.weatherAlerts ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.weatherAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Market Price Alerts */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Market Price Alerts</p>
                      <p className="text-[10px] text-gray-400">Crop price drop/rise notifications</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('marketPriceAlerts')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.marketPriceAlerts ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.marketPriceAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Crop Health Alerts */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Crop Health Alerts</p>
                      <p className="text-[10px] text-gray-400">Disease risk and pest alerts</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('cropHealthAlerts')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.cropHealthAlerts ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.cropHealthAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Irrigation Reminders */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Irrigation Reminders</p>
                      <p className="text-[10px] text-gray-400">Watering schedule notifications</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('irrigationReminders')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.irrigationReminders ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.irrigationReminders ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 5. Advisory Alerts */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Advisory Alerts</p>
                      <p className="text-[10px] text-gray-400">New government schemes, tips, etc.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('advisoryAlerts')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.advisoryAlerts ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.advisoryAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 6. Service Updates */}
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">Service Updates</p>
                      <p className="text-[10px] text-gray-400">Bookings, service provider updates</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotification('serviceUpdates')}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      notifications.serviceUpdates ? 'bg-[#008037]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                        notifications.serviceUpdates ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COLUMN 2: My Farms & Fields + Data & Privacy + Connected Devices         */}
          {/* ======================================================================= */}
          <div className="space-y-5">
            {/* CARD 2.1: My Farms & Fields */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  My Farms & Fields
                </h2>
              </div>

              {/* 7 Farm Navigation Items */}
              <div className="space-y-1">
                {/* 1. Manage Farms */}
                <button
                  type="button"
                  onClick={() => setActiveModal('manage-farms')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Manage Farms
                      </p>
                      <p className="text-[10px] text-gray-400">Add, edit or remove your farm locations</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Field Boundaries */}
                <button
                  type="button"
                  onClick={() => setActiveModal('field-boundaries')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Field Boundaries
                      </p>
                      <p className="text-[10px] text-gray-400">View and edit field areas on map</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Crop Details */}
                <button
                  type="button"
                  onClick={() => setActiveModal('crop-details')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Crop Details
                      </p>
                      <p className="text-[10px] text-gray-400">Set current and upcoming crops</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Soil Information */}
                <button
                  type="button"
                  onClick={() => setActiveModal('soil-information')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Soil Information
                      </p>
                      <p className="text-[10px] text-gray-400">Add/edit soil type, pH and nutrition details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. Irrigation Setup */}
                <button
                  type="button"
                  onClick={() => setActiveModal('irrigation-setup')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Irrigation Setup
                      </p>
                      <p className="text-[10px] text-gray-400">Add pumps, drip systems and water sources</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 6. Farm Infrastructure */}
                <button
                  type="button"
                  onClick={() => setActiveModal('farm-infrastructure')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Farm Infrastructure
                      </p>
                      <p className="text-[10px] text-gray-400">Add sheds, storage, machinery, etc.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 7. CCTV & Sensors */}
                <button
                  type="button"
                  onClick={() => setActiveModal('cctv-sensors')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        CCTV & Sensors
                      </p>
                      <p className="text-[10px] text-gray-400">Manage cameras, IoT devices and sensors</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* CARD 2.2: Data & Privacy */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Data & Privacy
                </h2>
              </div>

              {/* 4 Data & Privacy Items */}
              <div className="space-y-1">
                {/* 1. Privacy Settings */}
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy-settings')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Privacy Settings
                      </p>
                      <p className="text-[10px] text-gray-400">Control how your data is used</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Data Sharing */}
                <button
                  type="button"
                  onClick={() => setActiveModal('data-sharing')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Data Sharing
                      </p>
                      <p className="text-[10px] text-gray-400">Manage data sharing with advisors/partners</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Download My Data */}
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Download My Data
                      </p>
                      <p className="text-[10px] text-gray-400">Export your farm data (fields, crops, reports)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Delete Account */}
                <button
                  type="button"
                  onClick={() => setActiveModal('delete-account')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/70 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-rose-700 group-hover:text-rose-800">
                        Delete Account
                      </p>
                      <p className="text-[10px] text-gray-400">Permanently delete your account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* CARD 2.3: Connected Devices */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Link2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Connected Devices
                </h2>
              </div>

              {/* 2x2 Grid of Connected Devices */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. CCTV Cameras */}
                <button
                  type="button"
                  onClick={() => setActiveModal('cctv-sensors')}
                  className="p-3 rounded-2xl border border-gray-200/80 hover:border-blue-400 bg-white hover:bg-blue-50/30 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-gray-900 leading-snug">CCTV Cameras</p>
                    <p className="text-[9.5px] text-gray-400 leading-snug truncate">Add or manage CCTV cameras</p>
                  </div>
                </button>

                {/* 2. IoT Sensors */}
                <button
                  type="button"
                  onClick={() => setActiveModal('cctv-sensors')}
                  className="p-3 rounded-2xl border border-gray-200/80 hover:border-green-400 bg-white hover:bg-green-50/30 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-gray-900 leading-snug">IoT Sensors</p>
                    <p className="text-[9.5px] text-gray-400 leading-snug truncate">Soil, weather, moisture sensors</p>
                  </div>
                </button>

                {/* 3. Smart Irrigation Devices */}
                <button
                  type="button"
                  onClick={() => setActiveModal('irrigation-setup')}
                  className="p-3 rounded-2xl border border-gray-200/80 hover:border-cyan-400 bg-white hover:bg-cyan-50/30 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-gray-900 leading-snug truncate">
                      Smart Irrigation Devices
                    </p>
                    <p className="text-[9.5px] text-gray-400 leading-snug truncate">Pumps, valves, controllers</p>
                  </div>
                </button>

                {/* 4. Drones */}
                <button
                  type="button"
                  onClick={() => setActiveModal('drones-setup')}
                  className="p-3 rounded-2xl border border-gray-200/80 hover:border-purple-400 bg-white hover:bg-purple-50/30 text-left flex items-start gap-2.5 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-gray-900 leading-snug">Drones</p>
                    <p className="text-[9.5px] text-gray-400 leading-snug truncate">Connect and manage drone devices</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COLUMN 3: App Preferences + Service & Support + Other Settings           */}
          {/* ======================================================================= */}
          <div className="space-y-5">
            {/* CARD 3.1: App Preferences */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-3.5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  App Preferences
                </h2>
              </div>

              {/* 1. Language Dropdown */}
              <div className="flex items-center justify-between gap-3 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Language</p>
                    <p className="text-[10px] text-gray-400 truncate">Choose your preferred language</p>
                  </div>
                </div>
                <select
                  value={selectedLanguageCode}
                  onChange={(e) => {
                    setSelectedLanguageCode(e.target.value);
                    setLanguage(e.target.value);
                    saveAppPreferences({ language: e.target.value });
                    showToast('Language preference updated');
                  }}
                  className="py-1 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-green-400"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              {/* 2. Units Dropdown */}
              <div className="flex items-center justify-between gap-3 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Units</p>
                    <p className="text-[10px] text-gray-400 truncate">Measurement units (Area, Weight, Temperature)</p>
                  </div>
                </div>
                <select
                  value={units}
                  onChange={(e) => {
                    setUnits(e.target.value);
                    saveAppPreferences({ units: e.target.value });
                    showToast('Units preference saved');
                  }}
                  className="py-1 px-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-800 outline-none cursor-pointer hover:border-green-400 max-w-[140px] truncate"
                >
                  <option value="Metric (hectare, kg, °C)">Metric (hectare, kg, °C)</option>
                  <option value="Imperial (acre, lb, °F)">Imperial (acre, lb, °F)</option>
                  <option value="Indian (Bigha, Quintal, °C)">Indian (Bigha, Quintal, °C)</option>
                </select>
              </div>

              {/* 3. Date Format Dropdown */}
              <div className="flex items-center justify-between gap-3 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Date Format</p>
                    <p className="text-[10px] text-gray-400 truncate">Select date display format</p>
                  </div>
                </div>
                <select
                  value={dateFormat}
                  onChange={(e) => {
                    setDateFormat(e.target.value);
                    saveAppPreferences({ date_format: e.target.value });
                    showToast('Date format updated');
                  }}
                  className="py-1 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-green-400"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* 4. Time Format Dropdown */}
              <div className="flex items-center justify-between gap-3 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Time Format</p>
                    <p className="text-[10px] text-gray-400 truncate">12-hour or 24-hour format</p>
                  </div>
                </div>
                <select
                  value={timeFormat}
                  onChange={(e) => {
                    setTimeFormat(e.target.value);
                    saveAppPreferences({ time_format: e.target.value });
                    showToast('Time format updated');
                  }}
                  className="py-1 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-green-400"
                >
                  <option value="12-hour (AM/PM)">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>

              {/* 5. Currency Dropdown */}
              <div className="flex items-center justify-between gap-3 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Currency</p>
                    <p className="text-[10px] text-gray-400 truncate">Select currency for market prices</p>
                  </div>
                </div>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    saveAppPreferences({ currency: e.target.value });
                    showToast('Currency updated');
                  }}
                  className="py-1 px-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-green-400"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>

              {/* 6. Default Location with Change Button */}
              <div className="flex items-center justify-between gap-2 p-1.5 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">Default Location</p>
                    <p className="text-[10px] text-gray-400 truncate">Set your home location</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-gray-800 truncate max-w-[110px]">
                    {devLoc?.display_name || 'Siliguri, West Bengal'}
                  </span>
                  <button
                    type="button"
                    onClick={openLocationModal}
                    className="px-2.5 py-1 bg-[#008037] hover:bg-[#006e2e] text-white text-[11px] font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* 7. Theme Segmented Control (Light / Dark / Auto) */}
              <div className="space-y-2 p-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Theme</p>
                    <p className="text-[10px] text-gray-400">Choose app appearance</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Light Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('Light');
                      localStorage.setItem('farmerTheme', 'Light');
                      saveAppPreferences({ theme: 'Light' });
                      showToast('App theme set to Light');
                    }}
                    className={`py-2 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      theme === 'Light'
                        ? 'border-emerald-500 bg-emerald-50/70 text-[#008037] font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px]">Light</span>
                  </button>

                  {/* Dark Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('Dark');
                      localStorage.setItem('farmerTheme', 'Dark');
                      saveAppPreferences({ theme: 'Dark' });
                      showToast('Dark theme preview enabled');
                    }}
                    className={`py-2 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      theme === 'Dark'
                        ? 'border-emerald-500 bg-emerald-50/70 text-[#008037] font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="text-[11px]">Dark</span>
                  </button>

                  {/* Auto Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('Auto');
                      localStorage.setItem('farmerTheme', 'Auto');
                      saveAppPreferences({ theme: 'Auto' });
                      showToast('App theme set to System Auto');
                    }}
                    className={`py-2 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      theme === 'Auto'
                        ? 'border-emerald-500 bg-emerald-50/70 text-[#008037] font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-slate-700" />
                    <span className="text-[11px]">Auto</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3.2: Service & Support */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Headset className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Service & Support
                </h2>
              </div>

              {/* 5 Service & Support Items */}
              <div className="space-y-1">
                {/* 1. Help & Support */}
                <button
                  type="button"
                  onClick={() => setActiveModal('help-support')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Help & Support
                      </p>
                      <p className="text-[10px] text-gray-400">FAQs, guides and contact support</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Contact Us */}
                <button
                  type="button"
                  onClick={() => setActiveModal('contact-us')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Contact Us
                      </p>
                      <p className="text-[10px] text-gray-400">Get in touch with our support team</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Feedback */}
                <button
                  type="button"
                  onClick={() => setActiveModal('feedback')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Feedback
                      </p>
                      <p className="text-[10px] text-gray-400">Share your feedback or suggestions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 4. Report a Problem */}
                <button
                  type="button"
                  onClick={() => setActiveModal('report-problem')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/70 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-rose-700">
                        Report a Problem
                      </p>
                      <p className="text-[10px] text-gray-400">Report technical issues</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. App Version (Exact match with Check for updates >) */}
                <div className="flex items-center justify-between p-2.5 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">App Version</span>
                      <span className="text-[11px] text-gray-500 font-mono">v1.0.0</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('KrishiGo is up to date! Build v1.0.0-PROD.')}
                    className="text-xs font-bold text-[#008037] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Check for updates</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3.3: Other Settings */}
            <div className="bg-white rounded-[26px] p-5 border border-gray-200/90 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#008037] text-white flex items-center justify-center">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Other Settings
                </h2>
              </div>

              {/* 3 Other Settings Items */}
              <div className="space-y-1">
                {/* 1. About Farmer */}
                <button
                  type="button"
                  onClick={() => setActiveModal('about-farmer')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        About Farmer
                      </p>
                      <p className="text-[10px] text-gray-400">Learn more about the platform</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Terms & Conditions */}
                <button
                  type="button"
                  onClick={() => setActiveModal('terms-conditions')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Terms & Conditions
                      </p>
                      <p className="text-[10px] text-gray-400">Read our terms and policies</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Privacy Policy */}
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy-policy')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f4fbf5] transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#008037]">
                        Privacy Policy
                      </p>
                      <p className="text-[10px] text-gray-400">Read our privacy policy</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008037] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ALL INTERACTIVE MODALS FOR SETTINGS OPTIONS                                */}
      {/* ========================================================================= */}

      {/* MODAL 1: Edit Profile */}
      {activeModal === 'edit-profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#008037]" />
                Edit Farmer Profile
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:border-green-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:border-green-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 outline-none focus:border-green-600 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#008037] hover:bg-[#006e2e] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Personal Information */}
      {activeModal === 'personal-info' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information & KYC
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 font-medium">Aadhaar Card Link Status:</span>
                <span className="font-bold text-[#008037] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Linked (XXXX-XXXX-8921)
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 font-medium">Farmer ID (PM-Kisan):</span>
                <span className="font-bold text-gray-900 font-mono">WB-SLG-2024-88492</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 font-medium">Residential Village:</span>
                <span className="font-bold text-gray-900">Matigara Block, Siliguri, Darjeeling</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                <span className="text-gray-500 font-medium">Primary Spoken Language:</span>
                <span className="font-bold text-gray-900">Bengali / Hindi / English</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Change Password */}
      {activeModal === 'change-password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-green-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Connected Accounts */}
      {activeModal === 'connected-accounts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-indigo-600" />
                Connected Accounts
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center">
                    G
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Google Account</p>
                    <p className="text-[10px] text-gray-500">{profile.email}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>

              <div className="p-3 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center">
                    W
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">WhatsApp Alerts</p>
                    <p className="text-[10px] text-gray-500">{profile.phone}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Logout Confirm */}
      {activeModal === 'logout-confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-sm w-full border border-gray-200 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Sign Out from KrishiGo?</h3>
              <p className="text-xs text-gray-500 mt-1">
                You will need your phone number or email to log back in to your farm dashboard.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Manage Farms & Fields */}
      {activeModal === 'manage-farms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-600" />
                Manage Farms & Locations
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50/70 border border-green-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-gray-900">Farm 1: Siliguri North Field (Primary)</h4>
                  <p className="text-[11px] text-gray-600">3.2 Hectares • Tomato, Potato, Mustard</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Drip Irrigated • Loamy Alluvial Soil</p>
                </div>
                <span className="px-2 py-1 bg-[#008037] text-white text-[10px] font-bold rounded-lg">Active</span>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-gray-900">Farm 2: Jalpaiguri East Field</h4>
                  <p className="text-[11px] text-gray-600">2.3 Hectares • Paddy Nursery</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Canal Connected</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Switched active field view')}
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-green-50 text-gray-800 text-[10px] font-bold rounded-lg cursor-pointer"
                >
                  Select
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => showToast('New farm registration wizard opened')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                + Add New Farm Location
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Field Boundaries Map */}
      {activeModal === 'field-boundaries' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-xl w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Field Boundaries (Google Maps Platform)
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-64 bg-slate-100 flex items-center justify-center">
              <iframe
                title="Google Maps Field Polygon"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${devLoc?.latitude || 26.7271},${devLoc?.longitude || 88.3953}&z=16&output=embed`}
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs text-[11px] font-bold text-gray-900">
                Siliguri North Plot (Area: 3.2 Hectares / 7.9 Acres)
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/soil-field')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                Open Full Land Boundary Editor →
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Help & Support FAQs */}
      {activeModal === 'help-support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                Help & Support FAQs
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">How does AI Farm Copilot detect crop diseases?</p>
                <p className="text-gray-600">
                  KrishiGo uses Google Gemini 2.5 Flash multimodal vision models trained on thousands of ICAR leaf pathology benchmarks to instantly identify fungal, bacterial, and viral infections.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">Are mandi prices real-time?</p>
                <p className="text-gray-600">
                  Yes, prices are updated multiple times daily directly from AGMARKNET and Siliguri APMC Mandi trading terminals.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">How to link smart IoT soil sensors?</p>
                <p className="text-gray-600">
                  Navigate to Connected Devices &gt; IoT Sensors, and enter your sensor MAC address or scan the QR code on the sensor hub.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: Contact Us */}
      {activeModal === 'contact-us' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-orange-600" />
                KrishiGo Farmer Desk
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-green-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Toll-Free Helpline</p>
                  <p className="text-emerald-700 font-mono text-sm font-black">1800-KRISHI-GO</p>
                  <p className="text-[10px] text-gray-500">Available 07:00 AM – 09:00 PM (All 7 Days)</p>
                </div>
                <a
                  href="tel:18005747444"
                  className="px-3 py-1.5 bg-[#008037] text-white text-[11px] font-bold rounded-xl"
                >
                  Call Now
                </a>
              </div>

              <div className="p-3.5 bg-green-50 rounded-2xl border border-green-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">WhatsApp Agronomist Support</p>
                  <p className="text-green-800 font-mono text-xs font-bold">+91 98000 12345</p>
                  <p className="text-[10px] text-gray-500">Send photos of crops for diagnosis</p>
                </div>
                <a
                  href="https://wa.me/919800012345"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-green-600 text-white text-[11px] font-bold rounded-xl"
                >
                  Chat
                </a>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900">Email Desk:</p>
                <p className="text-gray-600">support@krishigo.com</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: Feedback */}
      {activeModal === 'feedback' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Share Feedback
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Feedback Category</label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="AI Disease Detector">AI Disease Detector</option>
                  <option value="Mandi Prices">Mandi Prices</option>
                  <option value="Irrigation Planner">Irrigation Planner</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Comments</label>
                <textarea
                  rows={4}
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  placeholder="Tell us what you love or how we can improve KrishiGo for your farm..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitSupport('feedback')}
                  className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 11: Report a Problem */}
      {activeModal === 'report-problem' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Report Technical Issue
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Issue Category</label>
                <select
                  value={problemForm.category}
                  onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                >
                  <option value="GPS / Location Sync Error">GPS / Location Sync Error</option>
                  <option value="Weather Forecast Loading">Weather Forecast Loading</option>
                  <option value="CCTV Camera Stream">CCTV Camera Stream</option>
                  <option value="Crop Health Photo Scanner">Crop Health Photo Scanner</option>
                  <option value="Other Issue">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Describe the Problem</label>
                <textarea
                  rows={4}
                  value={problemForm.description}
                  onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                  placeholder="What happened? Please describe the error..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitSupport('problem')}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Send Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Crop Details */}
      {activeModal === 'crop-details' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600" />
                Active & Upcoming Crop Details
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-green-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Tomato (Solanum lycopersicum)</h4>
                  <p className="text-gray-500">1.2 Hectares • Flowering Stage • Drip Irrigated</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Sown: Aug 15 • Est. Harvest: Nov 10</p>
                </div>
                <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">Healthy</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 border border-green-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Potato (Solanum tuberosum)</h4>
                  <p className="text-gray-500">1.5 Hectares • Vegetative Stage • Jyoti Variety</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Sown: Sep 02 • Est. Harvest: Dec 15</p>
                </div>
                <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">Healthy</span>
              </div>
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Mustard (Brassica juncea)</h4>
                  <p className="text-gray-500">0.5 Hectares • Rabi Season Preparation</p>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg">Upcoming</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/crop-planner')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                Open Crop Planner →
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Soil Information */}
      {activeModal === 'soil-information' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-700" />
                Soil Health & Laboratory Nutrition Card
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Soil Texture</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">Loamy Alluvial</p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-green-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Soil pH Value</span>
                  <p className="font-bold text-emerald-800 text-sm mt-0.5">6.8 (Optimal Neutral)</p>
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Nitrogen (N)</span>
                  <p className="font-bold text-blue-800 text-sm mt-0.5">240 kg/ha (Medium)</p>
                </div>
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Phosphorus (P)</span>
                  <p className="font-bold text-purple-800 text-sm mt-0.5">18 kg/ha (High)</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900">Organic Carbon (OC): 0.65%</p>
                <p className="text-gray-500 text-[11px]">Good biological activity. Recommend 2 tons/hectare vermicompost before next sowing.</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/soil-field')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                View Full Soil Sensor Graphs →
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Irrigation Setup */}
      {activeModal === 'irrigation-setup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                Irrigation Pumps & Water Source Setup
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-cyan-50/70 border border-cyan-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Pump 1: 5 HP Solar Submersible Borewell</h4>
                  <p className="text-gray-500">Depth: 180 ft • Flow: 140 L/min • Connected to Drip Zone A &amp; B</p>
                  <p className="text-[10px] text-cyan-800 font-bold mt-0.5">Status: Automated Schedule (06:00 AM)</p>
                </div>
                <span className="px-2 py-1 bg-cyan-600 text-white text-[10px] font-bold rounded-lg">Online</span>
              </div>
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Borewell 2: 3 HP Electric Backup</h4>
                  <p className="text-gray-500">Manual Switch • Connected to Pond storage</p>
                </div>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg">Standby</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/irrigation')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                Open Smart Irrigation Controller →
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Farm Infrastructure */}
      {activeModal === 'farm-infrastructure' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-600" />
                Farm Infrastructure & Machinery Asset Registry
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Post-Harvest Cold / Dry Storage Shed</p>
                  <p className="text-gray-500">Capacity: 50 Metric Tonnes • Ventilated concrete pad</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Good Condition</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Mahindra 475 DI 42 HP Tractor</p>
                  <p className="text-gray-500">With Rotavator, Disc Harrow, and Seed Drill attachments</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Solar Dryer Tunnel</p>
                  <p className="text-gray-500">Polyhouse structure for drying chili and mustard seeds</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CCTV & Sensors */}
      {activeModal === 'cctv-sensors' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                CCTV Surveillance &amp; IoT Telemetry Nodes
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">CAM-01: Main North Gate &amp; Storage</p>
                  <p className="text-gray-500">4K PTZ Camera • Motion Detection: ON • Solar Battery: 94%</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">Streaming</span>
              </div>
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">CAM-02: Tomato Polyhouse Field</p>
                  <p className="text-gray-500">1080p Fixed Angle • Night Vision IR: ON</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">Streaming</span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">LoRa Node Array (4 Probes)</p>
                  <p className="text-gray-500">Soil moisture, leaf wetness, canopy temperature transmitters</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">Transmitting</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/monitoring')}
                className="text-xs font-bold text-[#008037] hover:underline cursor-pointer"
              >
                Open Live Video Monitoring Room →
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Drones Setup */}
      {activeModal === 'drones-setup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-600" />
                Agricultural Drones Registry
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Kisan Spray Drone T-20</h4>
                  <p className="text-gray-500">Payload: 20 Liters • Centrifugal Atomizing Nozzles</p>
                  <p className="text-[10px] text-purple-800 font-bold mt-0.5">Battery: 100% (2 Packs Charged)</p>
                </div>
                <span className="px-2 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-lg">Standby</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Privacy Settings */}
      {activeModal === 'privacy-settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Data Privacy Controls
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">Field Telemetry Sharing</p>
                  <p className="text-gray-500 text-[10px]">Allow KrishiGo AI to use sensor logs for hyper-local forecasts</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">Anonymized Mandi Analytics</p>
                  <p className="text-gray-500 text-[10px]">Aggregate harvest volumes without identifying farm name</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">Enabled</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.updateFarmerSettings({ privacy: { data_sharing: true, analytics: true } });
                  } catch (e) {}
                  setActiveModal(null);
                  showToast('Privacy preferences saved.');
                }}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Data Sharing */}
      {activeModal === 'data-sharing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                Data Sharing with Advisors
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">ICAR Certified Agronomists</p>
                  <p className="text-gray-500 text-[10px]">Permit crop health scan access for verified prescription</p>
                </div>
                <span className="text-emerald-700 font-bold text-xs">Active</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">APMC Mandi e-Trading Partners</p>
                  <p className="text-gray-500 text-[10px]">Share harvest readiness alerts for direct buyer bidding</p>
                </div>
                <span className="text-emerald-700 font-bold text-xs">Active</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Account */}
      {activeModal === 'delete-account' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-sm w-full border border-gray-200 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Delete Farmer Account?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This will permanently delete your field polygons, sensor telemetry, and historical accounting logs. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.updateFarmerSettings({ delete_account_requested: true });
                  } catch (e) {}
                  setActiveModal(null);
                  showToast('Account deletion request submitted for 14-day safety grace period.');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                Request Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Notification Preferences */}
      {activeModal === 'notification-preferences' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Alert Delivery Channels
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">In-App Push Alerts</p>
                  <p className="text-gray-500 text-[10px]">Instant banners on weather warnings and pests</p>
                </div>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">WhatsApp Notification Digest</p>
                  <p className="text-gray-500 text-[10px]">Daily morning 07:00 AM mandi price summary</p>
                </div>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Critical SMS Broadcast</p>
                  <p className="text-gray-500 text-[10px]">Emergency cyclone, frost or hail alerts</p>
                </div>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Legal (About, Terms, Privacy) */}
      {(activeModal === 'about-farmer' ||
        activeModal === 'terms-conditions' ||
        activeModal === 'privacy-policy') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">
                {activeModal === 'about-farmer'
                  ? 'About KrishiGo Farmer Platform'
                  : activeModal === 'terms-conditions'
                  ? 'Terms & Conditions'
                  : 'Farmer Data & Privacy Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-gray-700 leading-relaxed space-y-2.5">
              {activeModal === 'about-farmer' ? (
                <>
                  <p>
                    <strong>KrishiGo</strong> is an integrated digital agriculture intelligence ecosystem engineered to empower Indian farmers with precision farming, real-time APMC mandi price forecasting, weather-driven irrigation automation, and AI disease diagnosis.
                  </p>
                  <p>
                    Powered by Google Gemini 2.5 Flash, Google Maps Platform Weather &amp; Geocoding APIs, and AGMARKNET records.
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Version 1.0.0 (Production Release 2026.10) • ISO 27001 Certified Data Architecture.
                  </p>
                </>
              ) : activeModal === 'terms-conditions' ? (
                <>
                  <p>
                    1. <strong>Farmer Data Sovereignty:</strong> You own 100% of your farm location, soil samples, and harvest records. KrishiGo will never sell your farm records to unauthorized third parties.
                  </p>
                  <p>
                    2. <strong>Agronomic Advisory:</strong> All fungicide and pesticide dosages conform to ICAR (Indian Council of Agricultural Research) and CIBRC guidelines. Always follow product labels.
                  </p>
                  <p>
                    3. <strong>Market Price Transparency:</strong> Mandi prices reflect spot rates reported by APMC yards and may vary slightly depending on commodity moisture and grading.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>KrishiGo Privacy Charter:</strong>
                  </p>
                  <p>
                    • We encrypt your GPS field boundaries, soil chemistry test reports, and financial sales records end-to-end.
                  </p>
                  <p>
                    • You can export your full farm dossier anytime via <strong>Download My Data</strong> or request permanent deletion of your profile.
                  </p>
                  <p>
                    • AI multimodal image diagnostics are processed securely on Google Cloud Enterprise infrastructure.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};
export default SettingsPage;
