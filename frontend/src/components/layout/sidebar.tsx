'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export function Sidebar({ items, title = 'Dashboard' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-background min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 mb-6 px-2">
          <Image
            src="/logo.png"
            alt="KrishiGo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-bold text-primary">
            Krishi<span className="text-amber-500">Go</span>
          </span>
        </Link>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground px-2">{title}</h2>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
