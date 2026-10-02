import React, { useEffect, useState } from 'react';
import { BookOpen, Shirt, PlusSquare, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface BottomProductGridsProps {
  onSelectCategory?: (slug: string) => void;
  onProductClick?: (product: any) => void;
}

// Fallback images for each section if API images fail
const FALLBACK_STUDY = [
  { id: 101, name: 'Notebook', price: 40, mrp: 60, image: '/assets/ecommerce/study_1.png' },
  { id: 102, name: 'Pen Set', price: 99, mrp: 149, image: '/assets/ecommerce/study_2.png' },
  { id: 103, name: 'School Bag', price: 499, mrp: 799, image: '/assets/ecommerce/study_3.png' },
  { id: 104, name: 'Textbooks', price: 299, mrp: 399, image: '/assets/ecommerce/study_4.png' },
  { id: 105, name: 'Calculator', price: 499, mrp: 699, image: '/assets/ecommerce/study_5.png' },
  { id: 106, name: 'Study Table', price: 2999, mrp: 3999, image: '/assets/ecommerce/study_6.png' },
];
const FALLBACK_CLOTHING = [
  { id: 201, name: 'Men T-Shirt', price: 399, mrp: 599, image: '/assets/ecommerce/clothing_1.png' },
  { id: 202, name: 'Women Kurti', price: 699, mrp: 999, image: '/assets/ecommerce/clothing_2.png' },
  { id: 203, name: 'Kids Wear', price: 499, mrp: 699, image: '/assets/ecommerce/clothing_3.png' },
  { id: 204, name: 'Sports Shoes', price: 1299, mrp: 1999, image: '/assets/ecommerce/clothing_4.png' },
  { id: 205, name: 'Jeans', price: 899, mrp: 1499, image: '/assets/ecommerce/clothing_5.png' },
  { id: 206, name: 'Saree', price: 999, mrp: 1899, image: '/assets/ecommerce/clothing_6.png' },
];
const FALLBACK_PHARMACY = [
  { id: 301, name: 'Vitamin D', price: 299, mrp: 399, image: '/assets/ecommerce/pharmacy_1.png' },
  { id: 302, name: 'Pain Relief', price: 99, mrp: 149, image: '/assets/ecommerce/pharmacy_2.png' },
  { id: 303, name: 'Face Mask', price: 149, mrp: 199, image: '/assets/ecommerce/pharmacy_3.png' },
  { id: 304, name: 'Sanitizer', price: 99, mrp: 149, image: '/assets/ecommerce/pharmacy_4.png' },
  { id: 305, name: 'Thermometer', price: 249, mrp: 399, image: '/assets/ecommerce/pharmacy_5.png' },
  { id: 306, name: 'First Aid Kit', price: 499, mrp: 799, image: '/assets/ecommerce/pharmacy_6.png' },
];

export const BottomProductGrids: React.FC<BottomProductGridsProps> = ({
  onSelectCategory,
  onProductClick,
}) => {
  const { addToCart } = useAuth();
  const navigate = useNavigate();

  const [studyProducts, setStudyProducts] = useState<any[]>(FALLBACK_STUDY);
  const [clothingProducts, setClothingProducts] = useState<any[]>(FALLBACK_CLOTHING);
  const [pharmacyProducts, setPharmacyProducts] = useState<any[]>(FALLBACK_PHARMACY);

  // Load real product data from featured products API
  useEffect(() => {
    api.getFeaturedProducts().then((res) => {
      if (res?.study_essentials?.length) {
        setStudyProducts(res.study_essentials.map((p: any) => ({
          ...p,
          image: p.images?.[0] || '/assets/ecommerce/study_1.png',
        })));
      }
      if (res?.clothing_fashion?.length) {
        setClothingProducts(res.clothing_fashion.map((p: any) => ({
          ...p,
          image: p.images?.[0] || '/assets/ecommerce/clothing_1.png',
        })));
      }
      if (res?.pharmacy_health?.length) {
        setPharmacyProducts(res.pharmacy_health.map((p: any) => ({
          ...p,
          image: p.images?.[0] || '/assets/ecommerce/pharmacy_1.png',
        })));
      }
    }).catch(() => {
      // Silently keep fallback data — UI unchanged
    });
  }, []);

  const sections = [
    {
      title: 'Study Essentials',
      sub: 'Books, Stationery, Laptops & More',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      slug: 'study-essentials',
      products: studyProducts,
    },
    {
      title: 'Clothing & Fashion',
      sub: 'Men, Women & Kids',
      icon: Shirt,
      iconColor: 'text-pink-600',
      slug: 'clothing-fashion',
      products: clothingProducts,
    },
    {
      title: 'Pharmacy & Health',
      sub: 'Medicines, Health Care & Wellness',
      icon: PlusSquare,
      iconColor: 'text-red-600',
      slug: 'pharmacy-health',
      products: pharmacyProducts,
    },
  ];

  const handleNav = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      navigate(`/category/${slug}`);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {sections.map((sec) => {
        const Icon = sec.icon;

        return (
          <div
            key={sec.slug}
            className="bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-xs flex flex-col justify-between"
          >
            {/* Header matching screenshot */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${sec.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">{sec.title}</h3>
                  <p className="text-[10px] text-gray-400 font-medium">{sec.sub}</p>
                </div>
              </div>
              <button
                onClick={() => handleNav(sec.slug)}
                className="text-[11px] font-bold text-[#008037] hover:text-[#00682e] flex items-center gap-0.5 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 6 Mini Product Cards in horizontal grid matching screenshot */}
            <div className="grid grid-cols-6 gap-2">
              {sec.products.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onProductClick?.(item)}
                  className="flex flex-col justify-between items-center text-center p-1 rounded-xl bg-[#f9fbf9] hover:bg-gray-50 transition-colors border border-gray-100 group cursor-pointer"
                >
                  <div className="h-12 w-full flex items-center justify-center p-1 bg-white rounded-lg mb-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
                      }}
                    />
                  </div>

                  <div className="w-full">
                    <div className="text-[10px] font-bold text-gray-800 truncate leading-tight">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-black text-gray-900 mt-0.5">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id);
                    }}
                    className="w-full mt-1 py-0.5 bg-[#008037] hover:bg-[#00682e] text-white rounded-md text-[9px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-2.5 h-2.5" /> Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};
