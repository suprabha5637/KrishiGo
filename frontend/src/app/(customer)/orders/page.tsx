"use client";

import React, { useState, useEffect } from 'react';
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';



const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string, icon: any, label: string }> = {
    delivered: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2, label: 'Delivered' },
    processing: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock, label: 'Processing' },
    shipped: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Truck, label: 'Shipped' },
  };

  const c = config[status] || config.processing;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${c.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">You have no past orders.</div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{order.id}</h3>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-bold text-xl">₹{order.total}</p>
                <p className="text-xs text-muted-foreground">{order.items?.length || 0} items</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="truncate max-w-[200px] sm:max-w-md">
                  {order.items?.map(i => `${i.quantity}${i.unit || ''} ${i.name}`).join(', ')}
                </span>
              </div>
              <Link href={`/orders/${order.id}`} className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
