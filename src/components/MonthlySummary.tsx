/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Award,
  Layers,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';
import { LineEntry, ChecklistMap, UserProfile } from '../types';
import { MonthlyAuditCalendar } from './MonthlyAuditCalendar';
import { getTodayDateStr } from '../utils';

interface MonthlySummaryProps {
  lines: LineEntry[];
  checklists?: ChecklistMap;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onNavigate?: (tab: string) => void;
  profile?: UserProfile;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  lines,
  checklists = {},
  selectedDate = getTodayDateStr(),
  onSelectDate = () => {},
  onNavigate,
  profile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit_calendar' | 'efficiency_trends'>('audit_calendar');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');

  // Simulated 30 days efficiency history for the month
  const dailyHistory = [
    { day: 1, eff: 82.5, pcs: 4400 },
    { day: 2, eff: 84.0, pcs: 4520 },
    { day: 3, eff: 83.2, pcs: 4480 },
    { day: 4, eff: 85.5, pcs: 4650 },
    { day: 5, eff: 86.0, pcs: 4700 },
    { day: 6, eff: 87.2, pcs: 4780 },
    { day: 7, eff: 86.8, pcs: 4720 },
    { day: 8, eff: 88.0, pcs: 4850 },
    { day: 9, eff: 87.5, pcs: 4800 },
    { day: 10, eff: 88.4, pcs: 4890 },
    { day: 11, eff: 89.0, pcs: 4950 },
    { day: 12, eff: 88.2, pcs: 4880 },
    { day: 13, eff: 86.5, pcs: 4750 },
    { day: 14, eff: 87.0, pcs: 4800 },
    { day: 15, eff: 88.6, pcs: 4910 },
    { day: 16, eff: 87.4, pcs: 4840 }
  ];

  const buyersSummary = [
    { buyer: 'H&M', lines: 'L18, L21', totalPcs: 34500, avgEff: 87.5, smv: 0.88 },
    { buyer: 'Zara', lines: 'L19', totalPcs: 14200, avgEff: 82.0, smv: 1.25 },
    { buyer: 'Gap', lines: 'L20', totalPcs: 19800, avgEff: 90.0, smv: 0.95 },
    { buyer: 'Uniqlo', lines: 'L24', totalPcs: 23600, avgEff: 92.0, smv: 0.80 }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[#d9d2c2] pb-3">
        <div className="flex items-center gap-2 bg-[#f1eee6] p-1.5 rounded-2xl border border-[#d9d2c2]">
          <button
            onClick={() => setActiveSubTab('audit_calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'audit_calendar'
                ? 'bg-white text-[#17343a] shadow-xs'
                : 'text-[#527078] hover:text-[#17343a]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#176f78]" />
            <span>Activity & Audit Log (Calendar UI)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('efficiency_trends')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'efficiency_trends'
                ? 'bg-white text-[#17343a] shadow-xs'
                : 'text-[#527078] hover:text-[#17343a]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#176f78]" />
            <span>Efficiency & Output Trends</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#527078]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>IE Daily Control Protocol Active</span>
        </div>
      </div>

      {/* Content depending on selected sub-tab */}
      {activeSubTab === 'audit_calendar' ? (
        <MonthlyAuditCalendar
          checklists={checklists}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onNavigate={onNavigate}
          profile={profile}
        />
      ) : (
        <>
          {/* Header */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                    Executive IE Performance
                  </span>
                  <span className="text-xs text-[#527078]">Monthly Factory Benchmark</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#17343a] tracking-tight">
                  Monthly Efficiency & Output Analysis
                </h1>
                <p className="text-xs sm:text-sm text-[#527078] mt-1">
                  Historical trends, buyer performance matrix, line balance stability, and monthly learning curves.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#f1eee6] p-1.5 rounded-2xl border border-[#d9d2c2]">
                <button className="p-1.5 rounded-xl hover:bg-[#e7e1d5] text-[#17343a]">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 text-xs font-bold text-[#17343a] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#176f78]" />
                  {selectedMonth}
                </span>
                <button className="p-1.5 rounded-xl hover:bg-[#e7e1d5] text-[#17343a]">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Monthly KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#e7e1d5]">
              <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                <span className="text-[10px] text-[#527078] font-bold uppercase">Monthly Avg Efficiency</span>
                <div className="font-display text-2xl font-bold text-[#176f78]">86.8%</div>
                <span className="text-[10px] text-emerald-600 font-bold">+1.8% vs Target</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                <span className="text-[10px] text-[#527078] font-bold uppercase">Monthly Output MTD</span>
                <div className="font-display text-2xl font-bold text-[#17343a]">92,100</div>
                <span className="text-[10px] text-[#527078]">Finished Garments</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                <span className="text-[10px] text-[#527078] font-bold uppercase">Avg Absenteeism</span>
                <div className="font-display text-2xl font-bold text-rose-600">5.8%</div>
                <span className="text-[10px] text-emerald-600 font-bold">Within 7% threshold</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
                <span className="text-[10px] text-[#527078] font-bold uppercase">Top Line Benchmark</span>
                <div className="font-display text-2xl font-bold text-[#17343a]">Line 24</div>
                <span className="text-[10px] text-emerald-600 font-bold">92.0% Monthly Avg</span>
              </div>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold uppercase text-[#17343a] tracking-tight">
                  30-Day Daily Efficiency Trend vs 85% Benchmark
                </h2>
                <p className="text-xs text-[#527078]">
                  Daily factory-wide production efficiency percentage across all sewing units
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                Target: 85.0%
              </span>
            </div>

            {/* SVG Daily Chart */}
            <div className="h-56 w-full relative pt-4">
              <svg viewBox="0 0 700 150" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="680" y2="20" stroke="#e7e1d5" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="680" y2="60" stroke="#e7e1d5" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="680" y2="100" stroke="#e7e1d5" strokeDasharray="3 3" />

                {/* Target 85% Line (Dashed Teal) */}
                <line x1="40" y1="50" x2="680" y2="50" stroke="#e6813e" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="640" y="44" fontSize="9" fill="#e6813e" fontWeight="bold">85% TARGET</text>

                {/* Labels */}
                <text x="10" y="24" fontSize="9" fill="#527078">95%</text>
                <text x="10" y="64" fontSize="9" fill="#527078">85%</text>
                <text x="10" y="104" fontSize="9" fill="#527078">75%</text>

                {/* Daily Bars */}
                {dailyHistory.map((item, i) => {
                  const x = 50 + i * 40;
                  const height = (item.eff - 70) * 4;
                  const y = 120 - height;
                  const isOverTarget = item.eff >= 85;

                  return (
                    <g key={item.day} className="cursor-pointer group">
                      <rect
                        x={x}
                        y={y}
                        width="22"
                        height={height}
                        rx="4"
                        fill={isOverTarget ? '#176f78' : '#e6813e'}
                        className="transition-opacity hover:opacity-80"
                      />
                      <text
                        x={x + 11}
                        y={y - 5}
                        fontSize="8"
                        fontWeight="bold"
                        fill="#17343a"
                        textAnchor="middle"
                        className="font-mono-numbers opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {item.eff}%
                      </text>
                      <text
                        x={x + 11}
                        y="136"
                        fontSize="9"
                        fill="#527078"
                        textAnchor="middle"
                        fontFamily="IBM Plex Mono"
                      >
                        {item.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Buyer-wise Performance & Line League Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Breakdown */}
            <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs">
              <h2 className="font-display text-lg font-bold uppercase text-[#17343a] mb-1">
                Buyer-wise Efficiency & Volume Share
              </h2>
              <p className="text-xs text-[#527078] mb-4">
                Aggregated output and average SAM by international apparel buyers
              </p>

              <div className="space-y-3">
                {buyersSummary.map(b => (
                  <div
                    key={b.buyer}
                    className="p-3.5 rounded-xl border border-[#e7e1d5] bg-[#f1eee6]/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#17343a]">{b.buyer}</span>
                        <span className="text-[10px] text-[#527078] bg-[#f1eee6] px-1.5 py-0.2 rounded font-mono-numbers">
                          {b.lines}
                        </span>
                      </div>
                      <div className="text-xs text-[#527078] mt-0.5">
                        Total Output: <strong className="text-[#17343a] font-mono-numbers">{b.totalPcs.toLocaleString()}</strong> pcs • SMV: {b.smv.toFixed(2)} min
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-lg font-bold text-[#176f78] font-mono-numbers">
                        {b.avgEff}%
                      </span>
                      <div className="text-[10px] text-[#527078]">Avg Efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Line League Table */}
            <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs">
              <h2 className="font-display text-lg font-bold uppercase text-[#17343a] mb-1">
                Monthly Sewing Lines Ranking
              </h2>
              <p className="text-xs text-[#527078] mb-4">
                Benchmark ranking by consistency, target adherence, and absenteeism
              </p>

              <div className="space-y-3">
                {lines.map((line, idx) => (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-xl border border-[#e7e1d5] bg-[#f1eee6]/50 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#dceceb] text-[#176f78] font-bold font-display text-sm flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-[#17343a]">
                          Line {line.lineNo} ({line.style})
                        </div>
                        <div className="text-[10px] text-[#527078]">
                          {line.floor} • Buyer: {line.buyer}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-base font-bold text-[#176f78] font-mono-numbers">
                        {line.efficiency}%
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        Target Met
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
