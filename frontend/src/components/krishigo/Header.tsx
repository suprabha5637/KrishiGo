import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, Search, Mic, MapPin, Wallet, Bell, ShoppingCart, User as UserIcon, ChevronDown, ChevronRight, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDeviceLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, isFarmer, walletBalance, cartCount, openCartDrawer, openWalletModal, openAuthModal } = useAuth();
  const { location: devLoc, isDetecting, openLocationModal } = useDeviceLocation();
  const { currentLanguage, supportedLanguages, setLanguage, isTranslating } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleFarmerClick = () => {
    if (isFarmer) {
      navigate('/farmer');
    } else {
      navigate('/farmer');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Toggle Categories Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/assets/brands/krishigo-logo.jpeg"
              alt="KrishiGo"
              className="h-10 w-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[#008037] flex items-center">
              Krishi<span className="text-[#10b981]">Go</span>
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl relative flex items-center"
        >
          <div className="w-full relative flex items-center bg-[#f4f7f4] rounded-full border border-gray-200 hover:border-green-500 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for fresh vegetables, fruits, groceries, dairy, seeds, fertilizers, study items..."
              className="w-full py-2.5 px-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-green-600 transition-colors mr-1 cursor-pointer"
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="bg-[#008037] hover:bg-[#00682e] text-white p-2.5 rounded-full mr-1 cursor-pointer transition-colors shadow-xs"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right: Location, Wallet, Notifications, Cart, User, Farmer Button */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {/* Location Center Selector: Opens Google Map & 2-Option Selector */}
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1.5 text-left text-xs text-gray-500 hover:text-green-700 cursor-pointer p-1.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all group"
            title="Click to check location details, auto-detect, or enter manually & mark on Google Map"
          >
            <MapPin className={`w-4 h-4 shrink-0 ${isDetecting ? 'text-amber-500 animate-pulse' : 'text-[#008037]'}`} />
            <div>
              <span className="block text-[10px] text-gray-400 leading-tight">Deliver to</span>
              <span className="font-bold text-gray-800 flex items-center text-xs group-hover:text-[#008037]">
                {isDetecting ? 'Locating...' : devLoc.city || 'Siliguri'}
                {devLoc.isAutoDetected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 ml-1.5" title="GPS Live" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ring-2 ring-amber-200 ml-1.5" title="Marked on Map" />
                )}
              </span>
            </div>
          </button>


          <button
            onClick={openWalletModal}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
            title="View KrishiGo Wallet"
          >
            <Wallet className="w-4 h-4 text-amber-600" />
            <div className="text-left text-xs">
              <span className="block text-[10px] text-amber-700 leading-none">Wallet</span>
              <span className="font-bold text-gray-800 flex items-center text-xs">
                ₹{walletBalance.toFixed(0)} <ChevronRight className="w-3 h-3 ml-0.5 text-gray-500" />
              </span>
            </div>
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={openCartDrawer}
            className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount > 0 ? cartCount : 2}
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 text-xs font-semibold text-gray-700 hover:text-green-700 cursor-pointer rounded-lg hover:bg-gray-50"
            >
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                <UserIcon className="w-4 h-4" />
              </div>
              <span>{user?.name || 'User'}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-gray-500">{user?.email || 'user@krishigo.com'}</p>
                </div>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    navigate('/orders');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-green-50"
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    openWalletModal();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-green-50"
                >
                  My Wallet (₹{walletBalance})
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    navigate('/farmer');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-green-700 font-bold hover:bg-green-50"
                >
                  Switch to Farmer Platform →
                </button>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  Switch / Login Account
                </button>
              </div>
            )}
          </div>

          {/* EXACT Prominent Farmer Button matching screenshot */}
          <button
            onClick={handleFarmerClick}
            className="hover:scale-102 active:scale-98 transition-transform cursor-pointer shrink-0"
            title="Open Dedicated Farmer Agricultural Platform"
          >
            <img
              src="/assets/brands/farmer-button.jpeg"
              alt="Farmer Powered by KrishiGo"
              className="h-10 object-contain rounded-full shadow-xs border border-green-600/40"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
