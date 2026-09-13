"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Product } from '@/types';



export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setWishlistItems(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center">Loading your wishlist...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="w-24 h-24 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8">Save items you love and buy them later when you're ready.</p>
        <Button asChild size="lg" className="w-full">
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-muted-foreground font-medium">{wishlistItems.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product.id} className="bg-card rounded-xl border overflow-hidden shadow-sm relative group">
            
            <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-destructive hover:bg-destructive hover:text-white transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            
            <Link href={`/products/${product.slug}`} className="block">
              <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60'} 
                  alt={product.name} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                  <Star className="w-4 h-4 fill-current" /> {product.rating || 0}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{product.category?.name || 'Category'}</p>
              
              <div className="flex flex-col gap-3">
                <span className="font-bold text-lg">₹{product.variants?.[0]?.price || 0}<span className="text-sm font-normal text-muted-foreground">/{product.unit || 'kg'}</span></span>
                <Button className="w-full" variant="secondary">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Move to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
