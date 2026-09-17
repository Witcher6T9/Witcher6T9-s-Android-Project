/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  CheckSquare,
  Clock,
  Layers,
  Wrench,
  Calendar,
  FileSpreadsheet,
  Bell,
  Database,
  Settings,
  Wifi,
  UserCheck,
  Gauge,
  Sun
} from 'lucide-react';
import { UserProfile, SyncState } from '../types';
import { ROLE_TIERS } from '../mockData';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  profile: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenDatabase: () => void;
  onOpenSettings: () => void;
  onOpenUserModal: () => void;
  syncState: SyncState;
  checklistProgress: number; // e.g. 58%
  pendingTodosCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  profile,
  unreadCount,
  onOpenNotifications,
  onOpenDatabase,
  onOpenSettings,
  onOpenUserModal,
  syncState,
  checklistProgress,
  pendingTodosCount
}) => {
  const currentTier =
    ROLE_TIERS.find(t => t.id === (profile.tierId || 'tier_0')) || ROLE_TIERS[0];

  const navTabs = [
    { id: 'dashboard', label: 'Home', icon: Activity },
    {
      id: 'checklist',
      label: 'Daily',
      icon: CheckSquare,
      badge: `${checklistProgress}%`
    },
    {
      id: 'todo-schedule',
      label: 'To-Do',
      icon: Clock,
      badge: pendingTodosCount > 0 ? String(pendingTodosCount) : undefined
    },
    { id: 'linedata', label: 'Line', icon: Layers },
    { id: 'lean-toolkit', label: 'Lean', icon: Wrench },
    { id: 'monthly', label: 'Month', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9d2c2] bg-[#fbfaf6]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand matching screenshot */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-full bg-[#0c4a60] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:bg-[#083647] transition-colors">
                <Gauge className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#17343a] leading-none uppercase">
                    IE / DAILY
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#17343a] leading-none uppercase mt-0.5">
                    CONTROL
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  PROD
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f1eee6] p-1 rounded-2xl border border-[#d9d2c2]">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-[#176f78] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#176f78] hover:bg-[#e7e1d5]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-numbers font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#dceceb] text-[#176f78]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons matching screenshot */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => alert('Switched to high-contrast floor daylight mode')}
              title="Daylight Theme"
              className="w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* Database Button */}
            <button
              onClick={onOpenDatabase}
              title="Database & Storage Backup"
              className="w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              title="Notifications & Floor Alerts"
              className="relative w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Active System Role & Operational Tier Pill */}
            <button
              onClick={onOpenUserModal}
              title={`Active System Role: ${currentTier.name} (${currentTier.shortCode}) - Click to switch Operational Tiers`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#d9d2c2] bg-white hover:border-[#0e7490] hover:bg-[#f1eee6] transition-all text-xs font-bold text-[#17343a] shadow-2xs group"
            >
              <span
                className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0"
                style={{ backgroundColor: currentTier.color }}
              >
                {currentTier.shortCode}
              </span>
              <span className="hidden sm:inline font-mono uppercase text-[11px] font-extrabold text-[#17343a]">
                {currentTier.systemRole}
              </span>
            </button>

            {/* User Profile Avatar with Online Dot */}
            <button
              onClick={onOpenUserModal}
              title={`Active Engineer: ${profile.name} (${profile.jobTitle})`}
              className="relative w-9 h-9 rounded-full bg-[#dceceb] text-[#176f78] border border-[#d9d2c2] flex items-center justify-center font-bold text-xs hover:border-[#176f78] transition-colors shadow-2xs"
            >
              <span>
                {profile.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('') || 'EA'}
              </span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Settings & Appearance"
              className="w-9 h-9 rounded-xl border border-[#d9d2c2] bg-white text-slate-700 hover:text-[#176f78] hover:border-[#176f78] flex items-center justify-center transition-colors shadow-2xs"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
