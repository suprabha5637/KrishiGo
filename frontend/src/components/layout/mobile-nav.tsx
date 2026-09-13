'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore((state) => ({ itemCount: state.items.length }));

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/products' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: itemCount },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
