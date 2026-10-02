import React from 'react';

interface CategoryRibbonProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory: string;
}

export const RIBBON_CATEGORIES = [
  {
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    image: '/assets/ecommerce/cat_icon_0.png'
  },
  {
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    image: '/assets/ecommerce/cat_icon_1.png'
  },
  {
    name: 'Dairy & Milk',
    slug: 'dairy-milk',
    image: '/assets/ecommerce/cat_icon_2.png'
  },
  {
    name: 'Grocery & Staples',
    slug: 'grocery-staples',
    image: '/assets/ecommerce/cat_icon_3.png'
  },
  {
    name: 'Snacks & Beverages',
    slug: 'snacks-beverages',
    image: '/assets/ecommerce/cat_icon_4.png'
  },
  {
    name: 'Meat, Egg & Seafood',
    slug: 'meat-egg-seafood',
    image: '/assets/ecommerce/cat_icon_5.png'
  },
  {
    name: 'Bakery & Sweets',
    slug: 'bakery-sweets',
    image: '/assets/ecommerce/cat_icon_6.png'
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    image: '/assets/ecommerce/cat_icon_7.png'
  },
  {
    name: 'Home Essentials',
    slug: 'home-essentials',
    image: '/assets/ecommerce/cat_icon_8.png'
  },
  {
    name: 'Seeds & Fertilizers',
    slug: 'seeds-fertilizers',
    image: '/assets/ecommerce/cat_icon_9.png'
  },
  {
    name: 'Farm Tools',
    slug: 'farm-tools',
    image: '/assets/ecommerce/cat_icon_10.png'
  },
  {
    name: 'Study',
    slug: 'study-essentials',
    image: '/assets/ecommerce/cat_icon_11.png'
  },
  {
    name: 'Clothing',
    slug: 'clothing-fashion',
    image: '/assets/ecommerce/cat_icon_12.png'
  },
  {
    name: 'Pharmacy',
    slug: 'pharmacy-health',
    image: '/assets/ecommerce/cat_icon_13.png'
  },
  {
    name: 'All Categories',
    slug: 'all-categories',
    isAll: true
  }
];

export const CategoryRibbon: React.FC<CategoryRibbonProps> = ({ onSelectCategory, selectedCategory }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-3 min-w-max px-1">
        {RIBBON_CATEGORIES.map((item) => {
          const isSelected = selectedCategory === item.slug;
          return (
            <button
              key={item.slug}
              onClick={() => onSelectCategory(item.slug)}
              className={`flex flex-col items-center group cursor-pointer transition-all ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 transition-all shadow-xs border ${
                  isSelected
                    ? 'border-[#008037] ring-2 ring-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                {item.isAll ? (
                  <div className="w-full h-full rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                    <div className="grid grid-cols-2 gap-1 w-6 h-6">
                      <div className="bg-[#008037] rounded-xs"></div>
                      <div className="bg-[#008037] rounded-xs"></div>
                      <div className="bg-[#008037] rounded-xs"></div>
                      <div className="bg-[#008037] rounded-xs"></div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-xl drop-shadow-xs"
                    loading="lazy"
                  />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 text-center font-medium max-w-[68px] leading-tight truncate ${
                  isSelected ? 'text-[#008037] font-bold' : 'text-gray-700 group-hover:text-green-700'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
