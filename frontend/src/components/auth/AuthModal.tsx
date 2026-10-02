import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { auth, googleProvider } from '../../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, getIdToken, ConfirmationResult } from 'firebase/auth';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [method, setMethod] = useState<'phone' | 'email' | 'google'>('phone');

  // Phone OTP State
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Email/Pass State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerAsFarmer, setRegisterAsFarmer] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      if (!(window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
          });
        } catch (e) {
          console.error("Recaptcha Init Error", e);
        }
      }
    } else {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = undefined;
      }
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const phoneNumber = `+91${phone}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send OTP. Ensure Firebase config is valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the verification code');
      return;
    }
    if (!confirmationResult) {
      setError('Session expired. Please request a new OTP.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const idToken = await getIdToken(result.user);
      const res = await api.firebaseAuth(idToken, registerAsFarmer);
      localStorage.setItem('krishigo_token', res.access_token);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password, phone, register_as_farmer: registerAsFarmer });
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await getIdToken(result.user);
      const res = await api.firebaseAuth(idToken, registerAsFarmer);
      localStorage.setItem('krishigo_token', res.access_token);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google Authentication failed. Ensure Firebase config is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold tracking-tight">KrishiGo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">Eco Platform</span>
          </div>
          <h2 className="text-xl font-extrabold">
            {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'login'
              ? 'Sign in to access your orders, wallet, and farm intelligence.'
              : 'Join KrishiGo for farm-fresh shopping and agricultural AI.'}
          </p>

          {/* Toggle Login/Register */}
          <div className="flex mt-4 bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-emerald-800 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-emerald-800 shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Auth Body */}
        <div className="p-6">
          <div id="recaptcha-container"></div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Auth Method Selector */}
          <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => { setMethod('phone'); setOtpSent(false); setError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                method === 'phone' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => { setMethod('email'); setError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                method === 'email' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email & Password
            </button>
          </div>

          {/* Phone OTP Method */}
          {method === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                      <span className="inline-flex items-center px-3 bg-gray-50 text-gray-600 text-xs font-medium border-r border-gray-300">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={registerAsFarmer}
                          onChange={(e) => setRegisterAsFarmer(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-emerald-900">Register as a Farmer</div>
                          <div className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                            Get access to farm intelligence, crop planning, weather, irrigation, market insights and agricultural AI.
                          </div>
                        </div>
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>OTP sent to <strong>+91 {phone}</strong></span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-3 py-2.5 text-center text-lg tracking-widest font-bold text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                      required
                    />
                    <p className="text-[11px] text-gray-500 mt-1 text-center">
                      Demo verification code: any 4-6 digits accepted
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-xs text-gray-500 hover:text-emerald-700 text-center"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Email/Password Method */}
          {method === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@krishigo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              {mode === 'register' && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerAsFarmer}
                      onChange={(e) => setRegisterAsFarmer(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-emerald-900">Register as a Farmer</div>
                      <div className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                        Get access to farm intelligence, crop planning, weather, irrigation, market insights and agricultural AI.
                      </div>
                    </div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In to KrishiGo' : 'Create KrishiGo Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Social Sign-in Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 uppercase">
              <span className="bg-white px-2">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 shadow-sm transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Trust Banner */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official 256-bit SSL encrypted agricultural authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
