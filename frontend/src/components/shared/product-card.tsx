"use client";

import { Product, ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { Heart, Plus, Zap } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const defaultVariant = product.variants[0];

  return (
    <div className="group relative rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="h-4 w-4" />
      </Button>
      
      <div className="relative aspect-square mb-4 rounded-lg bg-muted/50 overflow-hidden">
        {product.isQuickDelivery && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            <Zap className="h-3 w-3" />
            10 MINS
          </div>
        )}
        {product.isOrganic && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            ORGANIC
          </div>
        )}
        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-sm">
          {/* Fallback image block since we don't have real images */}
          <span className="opacity-50 text-4xl">{product.name.charAt(0)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{product.unit}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">₹{defaultVariant.price}</div>
            {defaultVariant.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">₹{defaultVariant.originalPrice}</div>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="rounded-full"
            onClick={() => addItem(product, defaultVariant, 1)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
