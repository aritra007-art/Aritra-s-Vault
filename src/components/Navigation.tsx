import React from 'react';
import { LayoutDashboard, HardDrive, Server, ListFilter, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab = 'dashboard' | 'objects' | 'nodes' | 'activity' | 'demotour';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  objectCount: number;
  nodeCount: number;
  healthyNodeCount: number;
  repairCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  objectCount,
  nodeCount,
  healthyNodeCount,
  repairCount,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: repairCount > 0 ? `${repairCount} repairs` : undefined,
      badgeColor: isLight
        ? 'bg-amber-100 text-amber-800 border-amber-300'
        : 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
    },
    {
      id: 'objects' as ActiveTab,
      label: 'Objects',
      icon: HardDrive,
      badge: `${objectCount}`,
      badgeColor: isLight
        ? 'bg-slate-100 text-slate-700 border-slate-300'
        : 'bg-[#18181B] text-slate-300 border-white/10',
    },
    {
      id: 'nodes' as ActiveTab,
      label: 'Storage Nodes',
      icon: Server,
      badge: `${healthyNodeCount}/${nodeCount}`,
      badgeColor: healthyNodeCount === nodeCount
        ? isLight
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
        : isLight
        ? 'bg-rose-100 text-rose-800 border-rose-300'
        : 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
    },
    {
      id: 'activity' as ActiveTab,
      label: 'Activity Log',
      icon: ListFilter,
    },
    {
      id: 'demotour' as ActiveTab,
      label: 'Demo Walkthrough',
      icon: Sparkles,
      badge: 'Interactive',
      badgeColor: isLight
        ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
        : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)] animate-pulse',
    },
  ];

  return (
    <nav
      className="transition-colors"
      style={{
        background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(10, 10, 11, 0.65)',
        backdropFilter: 'blur(16px)',
        borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'text-cyan-900 bg-cyan-50 shadow-sm'
                      : 'text-white bg-[#141417] shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.04]'
                }`}
                style={{
                  border: isActive
                    ? isLight
                      ? '1px solid rgba(6, 182, 212, 0.6)'
                      : '1px solid rgba(6, 182, 212, 0.4)'
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? isLight
                      ? '0 2px 10px rgba(6, 182, 212, 0.15)'
                      : '0 0 16px rgba(6, 182, 212, 0.15)'
                    : 'none',
                }}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-cyan-600'
                      : isLight
                      ? 'text-slate-400 group-hover:text-cyan-600'
                      : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                <span className={isActive ? 'font-semibold' : ''}>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full border transition-all ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
