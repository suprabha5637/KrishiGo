import React, { useEffect, useState } from 'react';
import { Header } from '../../components/krishigo/Header';
import { CartDrawer } from '../../components/krishigo/CartDrawer';
import { WalletModal } from '../../components/krishigo/WalletModal';
import { AuthModal } from '../../components/auth/AuthModal';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, ArrowLeft, RefreshCw } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders();
      setOrders(res || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col font-sans">
      <Header onToggleSidebar={() => navigate('/')} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Market
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-green-700" />
              My Orders & Deliveries
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track farm-fresh deliveries, view invoices, and reorder quickly.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-1/2" />
                <div className="h-16 bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No orders placed yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Your cart is waiting! Add farm-fresh vegetables, dairy, and fruits with 10-15 minute delivery.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-5 py-2.5 bg-[#008037] hover:bg-[#00682e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs hover:border-green-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">Order #{order.order_number}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-green-700">₹{order.total_amount.toFixed(0)}</div>
                    <p className="text-[10px] text-gray-400">
                      Paid via {order.payment_method?.toUpperCase() || 'WALLET'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{item.product_name}</span>
                        <span className="text-gray-400">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking & ETA */}
                <div className="bg-[#f8faf8] p-3 rounded-xl border border-green-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-700" />
                    <div>
                      <span className="font-bold text-gray-800">Estimated Delivery:</span>{' '}
                      <span className="text-green-700 font-semibold">{order.estimated_eta_mins || 15} mins</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500">Address: {order.delivery_address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartDrawer />
      <WalletModal />
      <AuthModal />
    </div>
  );
};
