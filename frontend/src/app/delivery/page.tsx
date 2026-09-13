"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/shared/stat-card';
import { Home, Truck } from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/delivery' },
  { icon: Truck, label: 'Assignments', href: '/delivery/assignments' },
];

export default function DeliveryDashboard() {
  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Delivery Portal">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard title="Pending Deliveries" value="18" icon={Truck} />
        <StatCard title="Completed Today" value="42" icon={Home} />
      </div>
    </DashboardLayout>
  );
}
