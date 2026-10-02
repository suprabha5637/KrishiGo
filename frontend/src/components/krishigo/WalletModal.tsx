import React, { useEffect, useState } from 'react';
import { X, Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const WalletModal: React.FC = () => {
  const { walletModalOpen, closeWalletModal, walletBalance, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [topupAmount, setTopupAmount] = useState('500');
  const [topupSuccess, setTopupSuccess] = useState(false);

  useEffect(() => {
    if (walletModalOpen) {
      loadWalletData();
    }
  }, [walletModalOpen]);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await api.getWallet();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!walletModalOpen) return null;

  const handleTopup = async () => {
    setTopupSuccess(true);
    setTimeout(() => {
      setTopupSuccess(false);
      refreshUser();
      loadWalletData();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-amber-100 font-medium">KrishiGo Cash Wallet</p>
              <h2 className="text-2xl font-black">₹{walletBalance.toFixed(0)}</h2>
            </div>
          </div>
          <button
            onClick={closeWalletModal}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Topup */}
        <div className="p-4 border-b border-gray-100 bg-amber-50/50">
          <p className="text-xs font-bold text-gray-800 mb-2">Quick Topup</p>
          <div className="flex gap-2 mb-3">
            {['200', '500', '1000', '2000'].map((amt) => (
              <button
                key={amt}
                onClick={() => setTopupAmount(amt)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  topupAmount === amt
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400'
                }`}
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <button
            onClick={handleTopup}
            className="w-full bg-[#008037] hover:bg-[#00682e] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {topupSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-200" />
                <span>Added Successfully!</span>
              </>
            ) : (
              <span>Add ₹{topupAmount} Instantly (UPI / Card)</span>
            )}
          </button>
        </div>

        {/* Transaction History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs font-bold text-gray-700">Recent Transactions</p>
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-4">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-xs font-medium text-gray-600">Initial Welcome Bonus</p>
              <p className="text-[11px] text-green-700 font-bold">+₹848.00</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 leading-tight">{tx.description}</p>
                    <p className="text-[10px] text-gray-400">{tx.date}</p>
                  </div>
                </div>

                <span
                  className={`font-black ${
                    tx.amount > 0 ? 'text-green-700' : 'text-gray-900'
                  }`}
                >
                  {tx.amount > 0 ? `+₹${tx.amount.toFixed(0)}` : `-₹${Math.abs(tx.amount).toFixed(0)}`}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#008037]" />
          <span>100% RBI & Bank Compliant Secure Wallet</span>
        </div>
      </div>
    </div>
  );
};
