import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/krishigo/Header';
import { Sidebar } from '../../components/krishigo/Sidebar';
import { CartDrawer } from '../../components/krishigo/CartDrawer';
import { WalletModal } from '../../components/krishigo/WalletModal';
import { AuthModal } from '../../components/auth/AuthModal';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Plus, Check, Star, ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  // Filters
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const catRes = await api.getCategories();
        setCategories(catRes);
        const match = catRes.find((c: Category) => c.slug === slug);
        setCurrentCategory(match || null);

        const prodRes = await api.getProducts({
          category_slug: slug || undefined,
          limit: 40,
        });
        setProducts(prodRes.items || []);
      } catch (err) {
        console.error('Failed to load category products', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleAdd = async (productId: number) => {
    await addToCart(productId);
    setAddedMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  const filteredProducts = products
    .filter((p) => (organicOnly ? p.is_organic : true))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col font-sans">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 max-w-[1920px] w-full mx-auto flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={slug || 'all'}
          onSelectCategory={(newSlug) => navigate(`/category/${newSlug}`)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </button>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                {currentCategory?.name || 'All Categories'}
                <span className="text-xs px-2.5 py-0.5 bg-green-100 text-green-800 font-bold rounded-full">
                  {filteredProducts.length} items
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Handpicked farm-fresh items sourced directly from trusted regional producers.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                100% Organic Only
              </label>

              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                  <div className="w-full h-32 bg-gray-100 rounded-xl" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-base font-bold text-gray-700">No products found in this category.</p>
              <p className="text-xs text-gray-500 mt-1">Try relaxing filters or browse fresh vegetables.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-[#008037] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Back to Market
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredProducts.map((p) => {
                const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                const isAdded = addedMap[p.id];

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-3 hover:border-green-500 hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-[#e23744] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs z-10">
                        {discount}% OFF
                      </span>
                    )}

                    {p.is_organic && (
                      <span className="absolute top-3 right-3 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-10">
                        ORGANIC
                      </span>
                    )}

                    <div className="h-32 w-full flex items-center justify-center p-2 mb-2 bg-[#f9fbf9] rounded-xl overflow-hidden">
                      <img
                        src={p.images?.[0] || p.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200'}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200'; }}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 text-xs line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">{p.unit}</p>

                      <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{(p.rating || 4.5).toFixed(1)}</span>
                        <span className="text-gray-400">({p.review_count || 0})</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-gray-900">₹{p.price.toFixed(0)}</div>
                        {p.mrp > p.price && (
                          <div className="text-[10px] text-gray-400 line-through">₹{p.mrp.toFixed(0)}</div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAdd(p.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 text-green-700 hover:bg-[#008037] hover:text-white border border-green-200 hover:border-green-600'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> ADD
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <CartDrawer />
      <WalletModal />
      <AuthModal />
    </div>
  );
};
