import React, { useState } from 'react';
import { X, Sprout, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BecomeFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeFarmerModal: React.FC<BecomeFarmerModalProps> = ({ isOpen, onClose }) => {
  const { becomeFarmer } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Farm onboarding inputs
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [location, setLocation] = useState('Siliguri, West Bengal');
  const [totalArea, setTotalArea] = useState('2.5');
  const [soilType, setSoilType] = useState('Loamy');
  const [crops, setCrops] = useState('Tomato, Potato, Mustard');

  if (!isOpen) return null;

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await becomeFarmer();
      onClose();
      navigate('/farmer');
    } catch (err) {
      console.error('Failed to become farmer', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <span className="text-xl font-bold tracking-tight">Become a KrishiGo Farmer</span>
          </div>
          <p className="text-xs text-white/80 mt-1">
            Unlock agricultural command center, 15-day weather, disease AI, and farm profit analytics.
          </p>
        </div>

        {/* Step 1: Benefits Overview */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Why Upgrade to Farmer Intelligence?
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  15-Day Weather
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Actionable Do/Avoid/Prepare alerts for spraying & harvest.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  AI Crop Doctor
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Instant leaf disease diagnosis & verified treatment plans.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Market Predictor
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Mandis prices for tomato, potato & profitable selling range.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Smart CCTV & Field Map
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Field boundary mapping, moisture sensor & CCTV monitoring.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              Continue to Farm Setup
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Farm Profile Onboarding */}
        {step === 2 && (
          <form onSubmit={handleCompleteOnboarding} className="p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Quick Farm Setup
            </h3>
            <p className="text-xs text-gray-500 -mt-2">
              Provide basic information so our AI Copilot can personalize advice for your land.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Land Area (Acres)</label>
                <input
                  type="text"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none bg-white"
                >
                  <option value="Loamy">Loamy Soil</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Black Soil">Black Soil</option>
                  <option value="Alluvial">Alluvial Soil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Active Crops Growing</label>
              <div className="relative">
                <Layers className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={crops}
                  onChange={(e) => setCrops(e.target.value)}
                  placeholder="e.g. Tomato, Potato, Rice"
                  className="w-full pl-8 pr-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Activating Farmer Dashboard...' : 'Complete & Open Farmer Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role permissions updated securely on the backend</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
