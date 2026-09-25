import React from 'react';
import {
  Database,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  RotateCcw,
  Play,
  Activity,
  SlidersHorizontal,
  Sparkles,
  Cloud,
  HardDrive,
  Sun,
  Moon,
  LogOut,
  User,
} from 'lucide-react';
import { ClusterStats } from '../types/cluster';
import { BackendModeInfo } from '../services/backendService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  stats: ClusterStats;
  backendMode?: BackendModeInfo;
  autoRepair: boolean;
  onToggleAutoRepair: (enabled: boolean) => void;
  onSimulateNodeFailure: () => void;
  onSimulateCorruption: () => void;
  onVerifyAll: () => void;
  onRepairAll: () => void;
  onRebalance: () => void;
  onReset: () => void;
  onOpenDemoTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  backendMode,
  autoRepair,
  onToggleAutoRepair,
  onSimulateNodeFailure,
  onSimulateCorruption,
  onVerifyAll,
  onRepairAll,
  onRebalance,
  onReset,
  onOpenDemoTour,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isLight = theme === 'light';

  const isHealthy = stats.clusterHealth === 'HEALTHY';
  const isDegraded = stats.clusterHealth === 'DEGRADED';
  const isCritical = stats.clusterHealth === 'CRITICAL';
  const isCloud = backendMode?.isCloudMode;

  return (
    <header
      className="sticky top-0 z-30 transition-colors"
      style={{
        background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 10, 11, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            {/* Visual Anchor Logo with subtle ambient glow */}
            <div className="relative group">
              <div
                className="absolute -inset-1.5 rounded-2xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(137deg, #06B6D4 0%, #6366F1 50%, #A78BFA 100%)',
                  filter: 'blur(12px)',
                }}
              />
              <div
                className="relative w-10 h-10 rounded-xl p-0.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(137deg, rgba(6, 182, 212, 0.7), rgba(99, 102, 241, 0.7))',
                }}
              >
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center border ${isLight ? 'bg-white border-slate-200' : 'bg-[#111113] border-white/10'}`}>
                  <Database className="w-5 h-5 text-cyan-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-xl font-bold tracking-tight font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Aritra's Vault
                </h1>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${
                  isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-[#161619] text-cyan-300 border-cyan-500/20'
                }`}>
                  v1.2-distributed
                </span>

                {/* Architecture Mode Badge: LOCAL CLUSTER or CLOUD STORAGE */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border transition-all ${
                    isCloud
                      ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                      : isLight
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                      : 'bg-[#18181B] text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  }`}
                  title={
                    isCloud
                      ? 'Cloud Mode: Supabase PostgreSQL metadata + Supabase Storage (vault-objects) with 4 logical replica domains'
                      : 'Local Cluster Mode: SQLite metadata + 4 genuine independent HTTP storage node daemons'
                  }
                >
                  {isCloud ? <Cloud className="w-3 h-3 text-indigo-400" /> : <HardDrive className="w-3 h-3 text-cyan-400" />}
                  <span>{isCloud ? 'CLOUD STORAGE' : 'LOCAL CLUSTER'}</span>
                </div>
                
                {/* Cluster Health Status Indicator */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300"
                  style={{
                    backgroundColor: isHealthy
                      ? isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.12)'
                      : isDegraded
                      ? isLight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.12)'
                      : isLight ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    borderColor: isHealthy
                      ? 'rgba(16, 185, 129, 0.35)'
                      : isDegraded
                      ? 'rgba(245, 158, 11, 0.35)'
                      : 'rgba(239, 68, 68, 0.4)',
                    boxShadow: isHealthy
                      ? '0 0 12px rgba(16, 185, 129, 0.2)'
                      : isDegraded
                      ? '0 0 12px rgba(245, 158, 11, 0.2)'
                      : '0 0 16px rgba(239, 68, 68, 0.3)',
                    color: isHealthy ? '#059669' : isDegraded ? '#d97706' : '#dc2626',
                  }}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHealthy
                        ? 'bg-emerald-500 animate-pulse'
                        : isDegraded
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-rose-500 animate-ping'
                    }`}
                  />
                  <span className="font-mono tracking-wide">{stats.clusterHealth}</span>
                </div>
              </div>
              <p className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-[#9CA3AF]'}`}>
                Fault-Tolerant Distributed Object Storage & Consensus Engine
              </p>
            </div>
          </div>

          {/* Right Actions: Auto-repair toggle, Demo Scenario trigger, Theme Toggle, User, Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto-healing toggle */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs shadow-sm transition-colors ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#121214] border-white/[0.08]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Self-Healing</span>
              <button
                type="button"
                onClick={() => onToggleAutoRepair(!autoRepair)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoRepair ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : isLight ? 'bg-slate-300' : 'bg-slate-800'
                }`}
                title="When enabled, cluster repairs under-replicated or corrupted replicas automatically"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoRepair ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Guided Demo Scenario Button */}
            <div className="relative group">
              <div
                className="absolute -inset-0.5 rounded-xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(137deg, #06B6D4 0%, #6366F1 50%, #A78BFA 100%)',
                  filter: 'blur(10px)',
                }}
              />
              <button
                onClick={onOpenDemoTour}
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-800 border-cyan-400 shadow-sm'
                    : 'bg-[#121214] hover:bg-[#161619] text-white border-cyan-400/40 hover:border-cyan-400/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className={isLight ? 'text-cyan-700 font-bold' : 'bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent'}>
                  13-Step Demo
                </span>
              </button>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                  : 'bg-[#141416] hover:bg-[#1C1C20] text-slate-300 border-white/[0.08]'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Authenticated User / Logout */}
            {user && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#141416] border-white/[0.08] text-slate-300'
                }`}
                title={`Signed in as ${user.email}`}
              >
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-medium max-w-[90px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-500 ml-1 p-0.5 cursor-pointer transition-colors"
                  title="Sign out from Vault"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Reset button */}
            <button
              onClick={onReset}
              title="Reset cluster to pristine default state"
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                isLight
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#161619] border-transparent hover:border-white/10'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Controls Toolbar with subtle gradient borders & hover glow */}
        <div className={`mt-3 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 ${
          isLight ? 'border-slate-200' : 'border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
            <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Demo Controls:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Simulate Failure */}
            <button
              onClick={onSimulateNodeFailure}
              className={`group relative px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-[#141416] hover:bg-rose-950/40 text-rose-300 border-white/[0.08] hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-500" />
              <span>Simulate Node Failure</span>
            </button>

            {/* Simulate Corruption */}
            <button
              onClick={onSimulateCorruption}
              className={`group relative px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-[#141416] hover:bg-amber-950/40 text-amber-300 border-white/[0.08] hover:border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              }`}
            >
              <Activity className="w-3 h-3 text-amber-500" />
              <span>Simulate Corruption</span>
            </button>

            {/* Verify All */}
            <button
              onClick={onVerifyAll}
              className={`group relative px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-[#141416] hover:bg-emerald-950/40 text-emerald-300 border-white/[0.08] hover:border-emerald-500/50 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Verify All</span>
            </button>

            {/* Repair All */}
            <button
              onClick={onRepairAll}
              className={`group relative px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                  : 'bg-[#141416] hover:bg-cyan-950/40 text-cyan-300 border-white/[0.08] hover:border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              }`}
            >
              <Play className="w-3 h-3 text-cyan-500" />
              <span>Repair All</span>
            </button>

            {/* Rebalance Cluster */}
            <button
              onClick={onRebalance}
              className={`group relative px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                  : 'bg-[#141416] hover:bg-indigo-950/40 text-indigo-300 border-white/[0.08] hover:border-indigo-500/50 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]'
              }`}
            >
              <Database className="w-3 h-3 text-indigo-500" />
              <span>Rebalance Cluster</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
