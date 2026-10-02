import React from 'react';
import {
  Home, Grid, Leaf, Apple, Milk, ShoppingBag, Coffee,
  Fish, Cake, Sparkles, SprayCan, Sprout, Wrench, ShieldCheck,
  BookOpen, Shirt, PlusSquare, HeartHandshake, Smile, Dog, Gift
} from 'lucide-react';

interface SidebarProps {
  activeCategory?: string;
  selectedCategory?: string;
  onSelectCategory: (slug: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SIDEBAR_ITEMS = [
  { id: 'home', name: 'Home', icon: Home, isHome: true },
  { id: 'all-categories', name: 'All Categories', icon: Grid },
  { id: 'fresh-vegetables', name: 'Fresh Vegetables', icon: Leaf, color: 'text-green-600' },
  { id: 'fresh-fruits', name: 'Fresh Fruits', icon: Apple, color: 'text-red-500' },
  { id: 'dairy-milk', name: 'Dairy & Milk', icon: Milk, color: 'text-blue-500' },
  { id: 'grocery-staples', name: 'Grocery & Staples', icon: ShoppingBag, color: 'text-amber-600' },
  { id: 'snacks-beverages', name: 'Snacks & Beverages', icon: Coffee, color: 'text-orange-500' },
  { id: 'meat-egg-seafood', name: 'Meat, Egg & Seafood', icon: Fish, color: 'text-rose-600' },
  { id: 'bakery-sweets', name: 'Bakery & Sweets', icon: Cake, color: 'text-amber-700' },
  { id: 'personal-care', name: 'Personal Care', icon: Sparkles, color: 'text-purple-600' },
  { id: 'home-essentials', name: 'Home Essentials', icon: SprayCan, color: 'text-cyan-600' },
  { id: 'seeds-fertilizers', name: 'Seeds & Fertilizers', icon: Sprout, color: 'text-emerald-600' },
  { id: 'farm-tools', name: 'Farm Tools', icon: Wrench, color: 'text-slate-600' },
  { id: 'organic-products', name: 'Organic Products', icon: ShieldCheck, color: 'text-green-700' },
  { id: 'study-essentials', name: 'Study Essentials', icon: BookOpen, color: 'text-indigo-600' },
  { id: 'clothing-fashion', name: 'Clothing & Fashion', icon: Shirt, color: 'text-pink-600' },
  { id: 'pharmacy-health', name: 'Pharmacy & Health', icon: PlusSquare, color: 'text-red-600' },
  { id: 'beauty-wellness', name: 'Beauty & Wellness', icon: HeartHandshake, color: 'text-rose-500' },
  { id: 'baby-care', name: 'Baby Care', icon: Smile, color: 'text-yellow-600' },
  { id: 'pet-care', name: 'Pet Care', icon: Dog, color: 'text-amber-800' },
  { id: 'offers-deals', name: 'Offers & Deals', icon: Gift, isOffer: true, color: 'text-red-500' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  selectedCategory,
  onSelectCategory,
  isOpen = true,
  onClose,
}) => {
  const current = selectedCategory || activeCategory || 'home';

  return (
    <aside
      className={`w-64 shrink-0 bg-white border-r border-gray-200 py-3 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className="px-3 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectCategory(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-green-50 text-[#008037] font-bold shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
              } ${item.isOffer ? 'text-red-600 hover:text-red-700 font-bold bg-red-50/40' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#008037]' : item.color || 'text-gray-500'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.isOffer && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                  HOT
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
