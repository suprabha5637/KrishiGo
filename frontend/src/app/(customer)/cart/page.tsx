"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal, deliveryFee, total, itemCount } = getTotals();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="w-24 h-24 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any fresh produce to your cart yet.</p>
        <Button asChild size="lg" className="w-full">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-2xl">
              <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden shrink-0">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Quality: {item.variant.quality}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border rounded-lg p-1 bg-background">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-lg">₹{item.variant.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-card border rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="text-foreground font-medium">
                  {deliveryFee === 0 ? <span className="text-primary">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Free delivery on orders over ₹500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
