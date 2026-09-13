import { Sidebar } from './sidebar';
import { Header } from './header';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title?: string;
}

export function DashboardLayout({ children, sidebarItems, title }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} title={title} />
        <main className="flex-1 p-4 md:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
