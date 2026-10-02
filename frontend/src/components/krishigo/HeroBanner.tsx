import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Sprout, Truck, Sparkles, HeartHandshake } from 'lucide-react';

interface HeroBannerProps {
  onCtaClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCtaClick }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-green-200/80 shadow-xs mb-4 bg-[#e8f7ee]">
      {/* Background soft landscape styling */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent pointer-events-none"></div>

      <div className="relative px-6 py-5 lg:px-8 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Headlines & Benefits */}
        <div className="max-w-md shrink-0 text-left z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-[1.15] tracking-tight mb-3">
            <span className="text-[#008037] block">100% Fresh & Organic</span>
            From Our Farmers <br />
            to Your Home
          </h1>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-[#008037] shrink-0" />
              <span>Farm Fresh</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-[#008037] shrink-0" />
              <span>Direct from Farmers</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-[#008037] shrink-0" />
              <span>Pesticide-Safe</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-4 h-4 text-[#008037] shrink-0" />
              <span>Fast Delivery in 10–15 mins</span>
            </div>
          </div>

          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 bg-[#00682e] hover:bg-[#005224] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer hover:gap-3"
          >
            <span>Shop Fresh Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Produce Crate Image */}
        <div className="relative shrink-0 flex items-center justify-center my-2 lg:my-0">
          <div className="relative w-64 h-44 sm:w-72 sm:h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white/80 group">
            <img
              src="/assets/ecommerce/vegetable_crate.png"
              alt="100% Organic Farm Fresh Produce"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-2 left-2 bg-emerald-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 border border-emerald-500/30">
              <Sprout className="w-3.5 h-3.5 text-green-300" />
              <span>100% ORGANIC</span>
            </div>
          </div>
        </div>

        {/* Right Side: Farmer Portrait & Trust Column */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-white shadow-md mx-auto mb-1.5">
              <img
                src="/assets/ecommerce/farmer_portrait.png"
                alt="Farmer Partner"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-black text-gray-800 tracking-tight leading-tight">Good Food</p>
            <p className="text-[11px] font-bold text-[#008037] leading-tight">Stronger Farmers</p>
            <p className="text-[10px] text-gray-600 font-semibold leading-tight">Healthier India</p>
          </div>

          {/* Vertical Trust Box matching screenshot */}
          <div className="bg-emerald-950 text-white rounded-xl p-3 space-y-2 text-xs w-44 shadow-md border border-emerald-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">No Harmful Chemicals</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">Naturally Grown</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">Direct from Farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">Freshness Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium">Supports Local Farmers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
