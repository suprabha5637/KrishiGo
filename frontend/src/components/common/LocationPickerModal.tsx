import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Navigation,
  Check,
  X,
  Loader2,
  Globe,
  Compass,
  Layers,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useDeviceLocation } from '../../context/LocationContext';

export const LocationPickerModal: React.FC = () => {
  const {
    location,
    isDetecting,
    isModalOpen,
    closeLocationModal,
    detectDeviceLocation,
    searchAndMarkLocation,
    setManualCoordinates,
  } = useDeviceLocation();

  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLat, setManualLat] = useState(location.latitude.toString());
  const [manualLng, setManualLng] = useState(location.longitude.toString());
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchFeedback(null);
    try {
      await searchAndMarkLocation(searchQuery.trim());
      setSearchFeedback(`Successfully marked location for "${searchQuery.trim()}"`);
    } catch (err: any) {
      setSearchFeedback('Location not found. Please try another address or city.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualCoordsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      setSearchFeedback('Please enter valid numeric latitude and longitude');
      return;
    }
    setIsSearching(true);
    try {
      await setManualCoordinates(lat, lng);
      setSearchFeedback(`Marked coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (err) {
      setSearchFeedback('Failed to mark coordinates.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAutoDetectClick = async () => {
    setSearchFeedback(null);
    await detectDeviceLocation();
  };

  // Google Maps Embed URL centered and marked with pin at location.latitude, location.longitude
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=14&output=embed`;
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-200/90 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-green-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#008037] text-white flex items-center justify-center shadow-md shadow-green-900/10 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>KrishiGo Location Center</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Google Maps API
                </span>
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Set and check all details about your farm & device location. Only 2 methods available:
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Option Tabs Selection */}
        <div className="p-4 border-b border-gray-100 bg-[#f9fbf9]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* OPTION 1: Automatic Device GPS Detection */}
            <button
              onClick={() => setActiveTab('auto')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activeTab === 'auto'
                  ? 'bg-white border-[#008037] shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'auto'
                    ? 'bg-[#008037] text-white'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <Crosshair className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900">
                    Option 1: Fetch Automatically
                  </span>
                  {activeTab === 'auto' && (
                    <span className="w-2 h-2 rounded-full bg-[#008037]" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  Uses device hardware GPS & Google Geocoding API to pinpoint exact location automatically.
                </p>
              </div>
            </button>

            {/* OPTION 2: Manual Enter & Mark on Google Map */}
            <button
              onClick={() => setActiveTab('manual')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activeTab === 'manual'
                  ? 'bg-white border-[#008037] shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'manual'
                    ? 'bg-[#008037] text-white'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900">
                    Option 2: Enter Manually & Mark on Map
                  </span>
                  {activeTab === 'manual' && (
                    <span className="w-2 h-2 rounded-full bg-[#008037]" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  Type any farm address, village, or town to mark and pin directly on Google Map.
                </p>
              </div>
            </button>
          </div>

          {/* Action Area based on Tab */}
          <div className="mt-3">
            {activeTab === 'auto' ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#008037] shrink-0" />
                  <span className="text-xs text-gray-700 font-medium">
                    Ready to query device coordinates & Google Geolocation API
                  </span>
                </div>
                <button
                  onClick={handleAutoDetectClick}
                  disabled={isDetecting}
                  className="w-full sm:w-auto py-2 px-4 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detecting Device GPS...</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-4 h-4" />
                      <span>Auto-Detect Current Location Now</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative flex items-center bg-white rounded-xl border border-gray-300 focus-within:border-[#008037] focus-within:ring-2 focus-within:ring-green-100 transition-all">
                    <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter city, village, mandi, farm address, or PIN code (e.g. Siliguri, Darjeeling)..."
                      className="w-full py-2 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="py-2 px-4 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Mark on Map</span>
                  </button>
                </form>

                {/* Direct coordinate input toggle */}
                <form
                  onSubmit={handleManualCoordsSubmit}
                  className="flex items-center gap-2 pt-1 text-[11px]"
                >
                  <span className="text-gray-500 font-medium shrink-0">Or Lat/Lng:</span>
                  <input
                    type="text"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Latitude (e.g. 26.7271)"
                    className="w-28 py-1 px-2 text-xs bg-white rounded-lg border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Longitude (e.g. 88.3953)"
                    className="w-28 py-1 px-2 text-xs bg-white rounded-lg border border-gray-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Pin Coords
                  </button>
                </form>
              </div>
            )}

            {searchFeedback && (
              <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {searchFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Body: Split View with Google Map & Detailed Location Metadata */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT 7 COLS: Interactive Google Map with Marked Pin */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <Globe className="w-4 h-4 text-[#008037]" />
                  <span>Marked on Google Map</span>
                </div>
                <a
                  href={googleMapsExternalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#008037] hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* The Google Map Container */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 h-64 sm:h-80 w-full group">
                <iframe
                  title="Google Map Location Marked"
                  src={googleMapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Floating Pin Overlay Indicator */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-gray-200 flex items-center gap-2 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-[11px] font-black text-gray-900">
                    📍 Pin Marked at: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: All Detailed Location Information Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#f4f8f4] rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>All About Current Location</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      location.isAutoDetected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {location.isAutoDetected ? '● GPS Auto-Detected' : '📌 Manually Marked'}
                  </span>
                </div>

                {/* Main Prominent Address */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    Identified Location
                  </div>
                  <div className="text-base font-black text-gray-900 leading-tight mt-0.5">
                    {location.display_name}
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium mt-1 leading-snug">
                    {location.formatted_address}
                  </p>
                </div>

                {/* Detailed Breakdown Grid */}
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">City / Town</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5 truncate">
                      {location.city || 'N/A'}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">State / Region</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5 truncate">
                      {location.state || 'N/A'}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">District</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5 truncate">
                      {location.district || location.city || 'N/A'}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">PIN / Postal</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5 truncate">
                      {location.postal_code || '734001'}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Country</div>
                    <div className="text-xs font-black text-gray-900 mt-0.5 truncate">
                      {location.country || 'India'}
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Coordinates</div>
                    <div className="text-[10.5px] font-black text-emerald-800 mt-0.5 truncate">
                      {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                    </div>
                  </div>
                </div>

                {/* Provider Note */}
                <div className="mt-3 p-2 rounded-xl bg-gray-50 border border-gray-200/80 text-[10px] text-gray-500 flex items-center justify-between">
                  <span>Geocoding Engine:</span>
                  <span className="font-bold text-gray-700 capitalize">
                    {location.provider.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Confirm / Close Button */}
              <button
                onClick={closeLocationModal}
                className="w-full py-2.5 px-4 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply Location</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
