import React, { useState } from 'react';
import { Header } from '../../components/krishigo/Header';
import { Sidebar } from '../../components/krishigo/Sidebar';
import { CategoryRibbon } from '../../components/krishigo/CategoryRibbon';
import { HeroBanner } from '../../components/krishigo/HeroBanner';
import { PromoCardsRow } from '../../components/krishigo/PromoCardsRow';
import { TrustStrip } from '../../components/krishigo/TrustStrip';
import { FreshVegetablesSection } from '../../components/krishigo/FreshVegetablesSection';
import { BottomProductGrids } from '../../components/krishigo/BottomProductGrids';
import { CartDrawer } from '../../components/krishigo/CartDrawer';
import { WalletModal } from '../../components/krishigo/WalletModal';
import { AuthModal } from '../../components/auth/AuthModal';

export const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col font-sans selection:bg-green-100 selection:text-green-800">
      {/* KrishiGo Global Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Layout Body */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto flex overflow-x-hidden">
        {/* Left Categories Sidebar (Collapsible on mobile/tablet, fixed desktop) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Center / Main Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 space-y-6">
          {/* Top Category Ribbon matching screenshot */}
          <CategoryRibbon
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => setSelectedCategory(slug)}
          />

          {/* Hero Banner with Farmer produce & trust metrics */}
          <HeroBanner />

          {/* Promotional 5-Cards Row */}
          <PromoCardsRow />

          {/* Trust Guarantees Strip */}
          <TrustStrip />

          {/* Fresh Vegetables Section + Straight from Farm to Home Banner */}
          <FreshVegetablesSection />

          {/* 3-Column Bottom Grids: Study Essentials, Clothing & Fashion, Pharmacy & Health */}
          <BottomProductGrids />

          {/* Footer note */}
          <footer className="pt-8 pb-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p className="font-semibold text-gray-700">KrishiGo — India's Premier Direct-From-Farm Marketplace & Intelligence Ecosystem</p>
            <p className="mt-1 text-[11px] text-gray-400">
              © {new Date().getFullYear()} KrishiGo. 100% Verified Fresh & Organic. Powered by Farmers Across India.
            </p>
          </footer>
        </main>
      </div>

      {/* Modals & Drawers */}
      <CartDrawer />
      <WalletModal />
      <AuthModal />
    </div>
  );
};
