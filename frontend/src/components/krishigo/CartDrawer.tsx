import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const CartDrawer: React.FC = () => {
  const { cart, cartDrawerOpen, closeCartDrawer, updateCartItem, deleteCartItem, walletBalance, refreshCart, refreshUser } = useAuth();
  const [useWallet, setUseWallet] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  if (!cartDrawerOpen) return null;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.checkout({
        delivery_address: {
          city: 'Siliguri',
          state: 'West Bengal',
          address: 'Flat 4B, Green Terrace'
        },
        payment_method: 'UPI',
        use_wallet: useWallet
      });
      setOrderSuccess(res);
      await refreshCart();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-green-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#008037]" />
              <h2 className="text-base font-bold text-gray-900">
                My Shopping Cart ({cart?.item_count || 0})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderSuccess ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Order Confirmed!</h3>
                <p className="text-xs text-gray-600 font-medium">Order Number: <span className="font-bold text-green-700">{orderSuccess.order_number}</span></p>
                <p className="text-xs text-gray-500">Estimated delivery in <span className="font-bold text-gray-800">{orderSuccess.estimated_delivery_minutes} mins</span> from our nearest farm fulfillment center.</p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setOrderSuccess(null);
                      closeCartDrawer();
                    }}
                    className="bg-[#008037] text-white text-xs font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-green-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="text-center py-16 text-gray-500 space-y-2">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="font-medium text-sm">Your cart is empty</p>
                <p className="text-xs text-gray-400">Add fresh vegetables, fruits or groceries to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'}
                      alt={item.product_name}
                      className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{item.product_name}</h4>
                      <p className="text-[10px] text-gray-500">{item.unit}</p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-black text-gray-900">₹{item.price.toFixed(0)}</span>
                        {item.mrp > item.price && (
                          <span className="text-[10px] text-gray-400 line-through">₹{item.mrp.toFixed(0)}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-2xs">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCartItem(item.id, item.quantity - 1);
                          } else {
                            deleteCartItem(item.id);
                          }
                        }}
                        className="p-0.5 text-gray-500 hover:text-red-600 cursor-pointer"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="p-0.5 text-gray-500 hover:text-green-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Wallet Balance Usage Toggle */}
                {walletBalance > 0 && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">Use KrishiGo Wallet</p>
                        <p className="text-[10px] text-amber-700">Available balance: ₹{walletBalance.toFixed(0)}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cart && cart.items.length > 0 && !orderSuccess && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-green-700">
                    {cart.delivery_fee === 0 ? 'FREE' : `₹${cart.delivery_fee.toFixed(2)}`}
                  </span>
                </div>
                {useWallet && walletBalance > 0 && (
                  <div className="flex justify-between text-amber-700 font-semibold">
                    <span>Wallet Applied</span>
                    <span>-₹{Math.min(cart.total, walletBalance).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-extrabold text-gray-900">
                  <span>Total Pay</span>
                  <span>
                    ₹{Math.max(0, cart.total - (useWallet ? Math.min(cart.total, walletBalance) : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full bg-[#008037] hover:bg-[#00682e] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Processing Order...' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
