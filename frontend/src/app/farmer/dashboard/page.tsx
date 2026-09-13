"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NAVIGATION_ITEMS } from '@/constants';
import { DollarSign, Package, Sprout, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function FarmerDashboard() {
  return (
    <DashboardLayout sidebarItems={NAVIGATION_ITEMS.farmer} title="Farmer Portal">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your farm and orders.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Earnings" value="₹1,24,500" icon={DollarSign} change={{ value: 15.2, trend: 'up' }} />
        <StatCard title="Active Crops" value="8" icon={Sprout} change={{ value: 2, trend: 'up' }} />
        <StatCard title="Procurement Orders" value="14" icon={Package} change={{ value: 5, trend: 'up' }} />
        <StatCard title="Overall Yield Score" value="94%" icon={TrendingUp} change={{ value: 1.2, trend: 'up' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Crops</CardTitle>
            <CardDescription>Status of your currently growing crops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Expected Yield</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Wheat</TableCell>
                  <TableCell>5 Acres</TableCell>
                  <TableCell>200 Quintals</TableCell>
                  <TableCell><Badge variant="success">Healthy</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tomatoes</TableCell>
                  <TableCell>2 Acres</TableCell>
                  <TableCell>50 Quintals</TableCell>
                  <TableCell><Badge variant="warning">Needs Water</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rice (Paddy)</TableCell>
                  <TableCell>8 Acres</TableCell>
                  <TableCell>400 Quintals</TableCell>
                  <TableCell><Badge variant="success">Growing</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incoming Procurement Orders</CardTitle>
            <CardDescription>Recent requests from buyers for your produce.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "ORD-5091", buyer: "AgriCorp Foods", item: "Wheat", qty: "50 Qtl", status: "Pending", amount: "₹1,25,000", time: "2h ago", icon: Clock },
                { id: "ORD-5088", buyer: "FreshMart", item: "Tomatoes", qty: "10 Qtl", status: "Accepted", amount: "₹35,000", time: "1d ago", icon: CheckCircle },
                { id: "ORD-5082", buyer: "MegaRetail", item: "Rice", qty: "100 Qtl", status: "Accepted", amount: "₹3,00,000", time: "3d ago", icon: CheckCircle },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                      <order.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{order.buyer} <span className="text-muted-foreground text-sm font-normal">({order.id})</span></h4>
                      <p className="text-sm text-muted-foreground">{order.qty} of {order.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{order.amount}</div>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
