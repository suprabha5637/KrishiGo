"use client";

import NextLink from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Search, MapPin, User, Menu } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useLocationStore } from '@/stores/location-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const itemCount = useCartStore((state) => state.items.length);
  const city = useLocationStore((state) => state.city);
  const area = useLocationStore((state) => state.area);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <NextLink href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="KrishiGo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
              <span className="text-xl font-bold text-primary hidden sm:inline-flex items-center">
                Krishi<span className="text-amber-500">Go</span>
              </span>
            </NextLink>
            
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer ml-4">
              <MapPin className="h-4 w-4" />
              <span>{area}, {city}</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for vegetables, fruits, dairy..."
                className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex relative">
              <Heart className="h-5 w-5" />
            </Button>
            <NextLink href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </NextLink>
            <NextLink href="/login">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </NextLink>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile below header */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9 bg-muted/50 border-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
