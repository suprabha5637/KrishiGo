"use client";

import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import api from '@/lib/api';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('Premium');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${params.slug}`);
        setProduct(res.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center">Loading product details...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-24 text-center">Product not found.</div>;
  }

  // Ensure images array exists
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60'];
  const variants = product.variants || [];
  const currentVariant = variants.find(v => v.quality === selectedQuality) || variants[0] || { id: 'mock-var', quality: 'Standard', price: 0, stock: 100, sku: 'MOCK' };
  const qualities = ['Premium', 'Standard', 'Value'];

  const handleAddToCart = () => {
    addItem(product, currentVariant as any, quantity);
    alert('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden border">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current text-muted" />
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} reviews)</span>
            </div>
            <p className="text-3xl font-bold text-primary">₹{currentVariant.price}<span className="text-lg text-muted-foreground font-normal">/{product.unit || 'kg'}</span></p>
          </div>

          <p className="text-muted-foreground mb-8">{product.description}</p>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Quality Grade</h3>
              <div className="flex gap-3">
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuality(q)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${selectedQuality === q ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground hover:bg-muted'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg p-1 bg-card">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground text-sm">{product.unit || 'kg'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-full text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-full text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Quality Assured</p>
                <p className="text-xs text-muted-foreground">Farm fresh guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
