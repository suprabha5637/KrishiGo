import React from 'react';
import {
  ShieldCheck, Ban, Sprout, HeartHandshake, Truck,
  LayoutGrid, Shield, RotateCcw
} from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const badges = [
    { label: '100% Organic', icon: ShieldCheck, color: 'text-green-600' },
    { label: 'No Harmful Chemicals', icon: Ban, color: 'text-emerald-600' },
    { label: 'Farm Fresh', icon: Sprout, color: 'text-green-600' },
    { label: 'Direct from Farmers', icon: HeartHandshake, color: 'text-green-600' },
    { label: 'Fast Delivery', icon: Truck, color: 'text-emerald-600' },
    { label: 'Wide Product Range', icon: LayoutGrid, color: 'text-green-600' },
    { label: 'Secure Payment', icon: Shield, color: 'text-emerald-600' },
    { label: 'Easy Returns', icon: RotateCcw, color: 'text-green-600' },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-4 border-y border-gray-100 bg-white/60">
      <div className="flex items-center justify-between min-w-max gap-4 px-2">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/60 border border-emerald-100 text-gray-700 text-xs font-semibold"
            >
              <Icon className={`w-3.5 h-3.5 ${b.color} shrink-0`} />
              <span className="whitespace-nowrap text-[11px]">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
