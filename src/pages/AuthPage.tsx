import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Database,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  X,
  Mail,
  User,
  Shield,
  Loader2,
  ChevronRight,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ModalProvider = 'google' | 'github' | null;

export const AuthPage: React.FC = () => {
  const { loginUser, loginWithEmail } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Primary email & password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // OAuth Modal states
  const [activeModal, setActiveModal] = useState<ModalProvider>(null);
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthName, setOauthName] = useState('');
  const [oauthPassword, setOauthPassword] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthStep, setOauthStep] = useState<'email' | 'password'>('email');

  const isLight = theme === 'light';

  // Open Google OAuth flow
  const handleOpenGoogle = () => {
    setActiveModal('google');
    setOauthEmail('');
    setOauthName('');
    setOauthPassword('');
    setOauthStep('email');
    setAuthError(null);
  };

  // Open GitHub OAuth flow
  const handleOpenGitHub = () => {
    setActiveModal('github');
    setOauthEmail('');
    setOauthName('');
    setOauthPassword('');
    setOauthStep('email');
    setAuthError(null);
  };

  const handleCloseModal = () => {
    if (oauthLoading) return;
    setActiveModal(null);
  };

  // Submit OAuth prompt
  const handleOAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oauthEmail.trim()) return;

    if (activeModal === 'google' && oauthStep === 'email') {
      // Advance to password step like real Google sign-in
      setOauthStep('password');
      return;
    }

    setOauthLoading(true);
    await new Promise(r => setTimeout(r, 650));

    const enteredEmail = oauthEmail.trim();
    const derivedName =
      oauthName.trim() ||
      enteredEmail
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) ||
      'Storage Operator';

    if (activeModal === 'google') {
      loginUser({
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name: derivedName,
        email: enteredEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=0284c7,6366f1,06b6d4`,
        provider: 'google',
        role: 'Cluster Administrator',
      });
    } else if (activeModal === 'github') {
      loginUser({
        id: 'usr_gh_' + Math.random().toString(36).substring(2, 9),
        name: derivedName,
        email: enteredEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=1e293b,334155`,
        provider: 'github',
        role: 'DevOps Engineer',
      });
    }

    setOauthLoading(false);
    setActiveModal(null);
  };

  // Direct Operator Login Form
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter a valid work or engineering email address.');
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginWithEmail(email.trim());
    } catch (err: any) {
      setAuthError('Authentication failed. Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 relative overflow-hidden font-sans ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0A0A0B] text-white'
      }`}
    >
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${isLight ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Top Navbar with Theme Toggle */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl p-0.5 flex items-center justify-center shadow-sm"
            style={{
              background: 'linear-gradient(137deg, rgba(6, 182, 212, 0.8), rgba(99, 102, 241, 0.8))',
            }}
          >
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#111113]'}`}>
              <Database className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight font-sans">
                Aritra's Vault
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-[#161619] text-cyan-300 border-cyan-500/20'}`}>
                v1.2-distributed
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Distributed Object Storage & Consensus Engine
            </p>
          </div>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
              : 'bg-[#141416] hover:bg-[#1a1a1e] text-slate-300 border-white/[0.08]'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative p-6 sm:p-8 rounded-3xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-xl shadow-slate-200/50'
              : 'bg-[#111113] border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.7)]'
          }`}
        >
          {/* Subtle Ambient top edge glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #06B6D4, #6366F1, transparent)',
            }}
          />

          <div className="text-center mb-6">
            <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3.5 border ${
              isLight ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
            }`}>
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Cluster Authentication</h2>
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-[#9CA3AF]'}`}>
              Sign in to access distributed node telemetry, replica management, and quorum repair controls.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>{authError}</span>
            </div>
          )}

          {/* Social Sign-In: Google & GitHub */}
          <div className="space-y-2.5">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleOpenGoogle}
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm hover:border-slate-300'
                  : 'bg-[#161619] hover:bg-[#1C1C20] text-white border-white/[0.08] hover:border-white/20'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              onClick={handleOpenGitHub}
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 ${
                isLight
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                  : 'bg-[#1c1c20] hover:bg-[#222228] text-white border-white/[0.08]'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative my-5">
            <div className={`absolute inset-0 flex items-center ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
              <div className="w-full border-t border-inherit" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className={`px-2 ${isLight ? 'bg-white text-slate-400' : 'bg-[#111113] text-slate-500'}`}>
                Or with cluster credentials
              </span>
            </div>
          </div>

          {/* Email / Operator Login Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Operator Email
              </label>
              <input
                type="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={`w-full text-xs rounded-xl px-3 py-2 transition-all focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white'
                    : 'bg-[#0E0E11] border border-white/[0.08] text-white focus:border-cyan-500/60'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Access Key / Passphrase
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full text-xs rounded-xl px-3 py-2 transition-all focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white'
                    : 'bg-[#0E0E11] border border-white/[0.08] text-white focus:border-cyan-500/60'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Vault Cluster'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access Note */}
          <div className={`mt-5 pt-4 border-t text-[11px] flex items-center justify-between font-mono ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-slate-400'
          }`}>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Demo Mode Enabled</span>
            </span>
            <button
              type="button"
              onClick={() => loginWithEmail('guest.operator@vault.internal', 'Guest Operator')}
              className="text-cyan-500 hover:underline cursor-pointer font-medium"
            >
              1-Click Guest Access →
            </button>
          </div>
        </motion.div>
      </main>

      {/* OAUTH POPUP MODAL (Authentic Google / GitHub prompt) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className={`relative z-10 w-full max-w-sm rounded-2xl p-6 sm:p-7 border shadow-2xl transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151518] border-white/10 text-white'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                disabled={oauthLoading}
                className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {activeModal === 'google' ? (
                <div>
                  {/* Google Branding Header */}
                  <div className="text-center mb-6">
                    <svg className="w-7 h-7 mx-auto mb-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <h3 className="text-base font-bold tracking-tight">Sign in with Google</h3>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      to continue to <span className="font-semibold text-cyan-500">Aritra's Vault</span>
                    </p>
                  </div>

                  <form onSubmit={handleOAuthSubmit} className="space-y-4">
                    {oauthStep === 'email' ? (
                      <>
                        <div>
                          <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            Email or phone
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              autoFocus
                              placeholder="name@gmail.com"
                              value={oauthEmail}
                              onChange={e => setOauthEmail(e.target.value)}
                              className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all focus:outline-none pl-9 ${
                                isLight
                                  ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                                  : 'bg-[#0E0E11] border border-white/10 text-white focus:border-blue-500'
                              }`}
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            Full Name (Optional)
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={oauthName}
                              onChange={e => setOauthName(e.target.value)}
                              className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all focus:outline-none pl-9 ${
                                isLight
                                  ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                                  : 'bg-[#0E0E11] border border-white/10 text-white focus:border-blue-500'
                              }`}
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0E0E11] border-white/10'
                        }`}>
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-medium truncate">{oauthEmail}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOauthStep('email')}
                            className="text-[11px] text-blue-500 hover:underline cursor-pointer"
                          >
                            Change
                          </button>
                        </div>

                        <div>
                          <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            Enter your Google Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              autoFocus
                              placeholder="••••••••••••"
                              value={oauthPassword}
                              onChange={e => setOauthPassword(e.target.value)}
                              className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all focus:outline-none pl-9 ${
                                isLight
                                  ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'
                                  : 'bg-[#0E0E11] border border-white/10 text-white focus:border-blue-500'
                              }`}
                            />
                            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={oauthLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={oauthLoading || !oauthEmail.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {oauthLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : oauthStep === 'email' ? (
                          <>
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Sign in</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {/* GitHub Branding Header */}
                  <div className="text-center mb-6">
                    <svg className="w-7 h-7 mx-auto mb-2 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <h3 className="text-base font-bold tracking-tight">Sign in to GitHub</h3>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      to authorize <span className="font-semibold text-cyan-500">Aritra's Vault</span>
                    </p>
                  </div>

                  <form onSubmit={handleOAuthSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Username or email address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="your-github-username or email"
                          value={oauthEmail}
                          onChange={e => setOauthEmail(e.target.value)}
                          className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all focus:outline-none pl-9 ${
                            isLight
                              ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-slate-800 focus:bg-white'
                              : 'bg-[#0E0E11] border border-white/10 text-white focus:border-white/40'
                          }`}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Password / Personal Token
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={oauthPassword}
                          onChange={e => setOauthPassword(e.target.value)}
                          className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all focus:outline-none pl-9 ${
                            isLight
                              ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-slate-800 focus:bg-white'
                              : 'bg-[#0E0E11] border border-white/10 text-white focus:border-white/40'
                          }`}
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={oauthLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={oauthLoading || !oauthEmail.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {oauthLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Authorize Vault</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`py-4 text-center text-xs font-mono border-t ${
        isLight ? 'border-slate-200 bg-white/70 text-slate-500' : 'border-white/[0.06] bg-[#0A0A0B]/80 text-[#9CA3AF]'
      }`}>
        <p>Aritra's Vault • Cryptographic SHA-256 Quorum Consensus • Zero Trust Security</p>
      </footer>
    </div>
  );
};
