"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NAVIGATION_ITEMS } from '@/constants';
import { Users, DollarSign, Activity, CheckCircle, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 8000 },
  { name: 'Jul', revenue: 7500 },
];

const productData = [
  { name: 'Wheat', sales: 400 },
  { name: 'Rice', sales: 300 },
  { name: 'Tomatoes', sales: 200 },
  { name: 'Potatoes', sales: 278 },
  { name: 'Onions', sales: 189 },
];

export default function AdminAnalytics() {
  return (
    <DashboardLayout sidebarItems={NAVIGATION_ITEMS.admin} title="Admin Dashboard">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor business health, revenue, and platform users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value="₹12,45,000" icon={DollarSign} change={{ value: 24.5, trend: 'up' }} />
        <StatCard title="Active Users" value="8,234" icon={Users} change={{ value: 5.2, trend: 'up' }} />
        <StatCard title="Platform Activity" value="98.2%" icon={Activity} change={{ value: 1.1, trend: 'up' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue generated across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products by Volume</CardTitle>
            <CardDescription>Highest selling agricultural commodities.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending User Verifications</CardTitle>
          <CardDescription>Review and approve new farmers and buyers on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">USR-4921</TableCell>
                <TableCell>Manish Tiwari</TableCell>
                <TableCell><Badge variant="outline">Farmer</Badge></TableCell>
                <TableCell>Aadhaar, Land Registry</TableCell>
                <TableCell>Oct 24, 2026</TableCell>
                <TableCell className="text-right space-x-2">
                  <button className="p-2 bg-green-500/10 text-green-600 rounded-md hover:bg-green-500/20 transition-colors" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20 transition-colors" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">USR-4922</TableCell>
                <TableCell>AgroFresh Industries</TableCell>
                <TableCell><Badge variant="secondary">Buyer</Badge></TableCell>
                <TableCell>GSTIN, Trade License</TableCell>
                <TableCell>Oct 24, 2026</TableCell>
                <TableCell className="text-right space-x-2">
                  <button className="p-2 bg-green-500/10 text-green-600 rounded-md hover:bg-green-500/20 transition-colors" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20 transition-colors" title="Reject">
                    <XCircle className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
