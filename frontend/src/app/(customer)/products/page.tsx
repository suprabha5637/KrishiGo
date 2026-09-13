"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

import api from '@/lib/api';
import { Product, Category } from '@/types';

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fallback to mock data if API fails to avoid breaking UI during testing
        const [prodRes, catRes] = await Promise.all([
          api.get('/products').catch(() => ({ data: { data: [] } })),
          api.get('/categories').catch(() => ({ data: { data: [] } }))
        ]);
        
        const fetchedProducts = prodRes.data?.data || [];
        const fetchedCategories = catRes.data?.data || [];
        
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'All' || p.category?.name === selectedCategory
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h3>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Categories</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedCategory === 'All'}
                  onChange={() => setSelectedCategory('All')}
                />
                <span className="text-sm">All</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedCategory === cat.name}
                    onChange={() => setSelectedCategory(cat.name)}
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Price Range</h4>
            <input type="range" className="w-full accent-primary" min="0" max="500" />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>₹0</span>
              <span>₹500+</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Our Products</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              Sort by: Recommended <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">No products found.</div>
            ) : filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60'} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                        <Star className="w-4 h-4 fill-current" /> {product.rating || 0}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{product.category?.name || 'Category'}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">₹{product.variants?.[0]?.price || 0}<span className="text-sm font-normal text-muted-foreground">/{product.unit || 'kg'}</span></span>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
