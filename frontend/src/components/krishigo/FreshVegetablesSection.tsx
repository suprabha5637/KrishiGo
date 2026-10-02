import React, { useEffect, useState } from 'react';
import { Sprout, CheckCircle2, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface FreshVegetablesSectionProps {
  products?: Product[];
  onViewAll?: () => void;
  onProductClick?: (product: Product) => void;
}

export const FreshVegetablesSection: React.FC<FreshVegetablesSectionProps> = ({
  products: initialProducts,
  onViewAll,
  onProductClick,
}) => {
  const { addToCart } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      api.getFeaturedProducts().then((res) => {
        if (res?.fresh_vegetables?.length) {
          setProducts(res.fresh_vegetables);
        }
      }).catch((err) => console.error('Failed to load featured vegetables', err));
    }
  }, [initialProducts]);

  const displayList = products.length > 0 ? products : [
    { id: 1, name: 'Tomato', unit: '1 kg', price: 18, mrp: 30, discount_percent: 40, rating: 4.8, freshness_score: 98, is_organic: true, images: ['/assets/ecommerce/tomato.png'] },
    { id: 2, name: 'Potato', unit: '1 kg', price: 16, mrp: 26, discount_percent: 38, rating: 4.7, freshness_score: 95, is_organic: false, images: ['/assets/ecommerce/potato.png'] },
    { id: 3, name: 'Onion', unit: '1 kg', price: 20, mrp: 32, discount_percent: 38, rating: 4.9, freshness_score: 96, is_organic: true, images: ['/assets/ecommerce/onion.png'] },
    { id: 4, name: 'Carrot', unit: '500 g', price: 24, mrp: 40, discount_percent: 40, rating: 4.6, freshness_score: 94, is_organic: true, images: ['/assets/ecommerce/carrot.png'] },
    { id: 5, name: 'Capsicum', unit: '500 g', price: 28, mrp: 45, discount_percent: 38, rating: 4.8, freshness_score: 97, is_organic: true, images: ['/assets/ecommerce/capsicum.png'] },
    { id: 6, name: 'Spinach (Palak)', unit: '250 g', price: 12, mrp: 20, discount_percent: 40, rating: 4.9, freshness_score: 99, is_organic: true, images: ['/assets/ecommerce/spinach.png'] },
    { id: 7, name: 'Cauliflower', unit: '1 pc', price: 28, mrp: 45, discount_percent: 38, rating: 4.7, freshness_score: 95, is_organic: false, images: ['/assets/ecommerce/cauliflower.png'] },
    { id: 8, name: 'Brinjal', unit: '500 g', price: 18, mrp: 30, discount_percent: 40, rating: 4.6, freshness_score: 93, is_organic: true, images: ['/assets/ecommerce/brinjal.png'] },
  ];

  return (
    <section className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[#008037]" />
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">Fresh Vegetables</h2>
            <p className="text-xs text-gray-500 font-medium">Handpicked. Farm Fresh. 100% Organic.</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#008037] hover:text-[#00682e] flex items-center gap-1 cursor-pointer"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: 8 Vegetables + 1 Promo Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {displayList.slice(0, 8).map((product: any) => {
          const discount = product.mrp > product.price
            ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
            : 0;
          const imageUrl = product.images?.[0] || product.image_url || '/assets/ecommerce/tomato.png';

          return (
            <div
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="bg-white rounded-2xl border border-gray-200/80 p-3 hover:border-green-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
            >
              {product.is_organic && (
                <span className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-10">
                  ORGANIC
                </span>
              )}

              <div className="h-28 w-full flex items-center justify-center p-2 mb-2 bg-[#f9fbf9] rounded-xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-xs line-clamp-1 leading-tight group-hover:text-green-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">{product.unit}</p>
                {/* <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.2 rounded">
                    ★ {product.rating || 4.8}
                  </span>
                  <span className="text-[10px] text-gray-400">Freshness {product.freshness_score || 95}%</span>
                </div> */}
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-[10px] text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="text-[10px] font-bold text-[#008037] leading-tight">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  className="px-3 py-1.5 bg-[#008037] text-white hover:bg-[#00682e] border border-transparent rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          );
        })}

        {/* Straight from Farm to Your Home card matching screenshot */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs cursor-pointer hover:shadow-md transition-all">
          <img 
            src="/assets/ecommerce/straight_from_farm.jpg"
            alt="Straight from Farm to Your Home"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};
