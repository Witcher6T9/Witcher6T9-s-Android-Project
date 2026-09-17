/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Save,
  Plus,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { LineEntry } from '../types';
import { calculateLineMetrics } from '../utils';

interface LineDataProps {
  lines: LineEntry[];
  selectedLineNo: string;
  onSelectLineNo: (lineNo: string) => void;
  onSaveLine: (line: LineEntry) => void;
  onAddNewLine: () => void;
}

export const LineData: React.FC<LineDataProps> = ({
  lines,
  selectedLineNo,
  onSelectLineNo,
  onSaveLine,
  onAddNewLine
}) => {
  const currentLine = lines.find(l => l.lineNo === selectedLineNo) || lines[0];

  // Local draft state for editing
  const [formData, setFormData] = useState<LineEntry>(currentLine);
  const [saveToast, setSaveToast] = useState(false);

  // Sync draft when selected line changes
  React.useEffect(() => {
    if (currentLine) {
      setFormData(currentLine);
    }
  }, [currentLine?.lineNo, currentLine?.id]);

  const metrics = calculateLineMetrics(formData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update calculated efficiency
    const updated: LineEntry = {
      ...formData,
      efficiency: metrics.efficiencyPct
    };
    onSaveLine(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Line Selector Navigation */}
      <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#dceceb] text-[#176f78]">
                Sewing Line Telemetry & Balancing
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#17343a] tracking-tight">
              Line {formData.lineNo} Production Control
            </h1>
            <p className="text-xs text-[#527078] mt-0.5">
              {formData.floor} • Style: <strong className="text-[#17343a]">{formData.style}</strong> ({formData.buyer})
            </p>
          </div>

          {/* Line tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {lines.map(line => (
              <button
                key={line.id}
                onClick={() => onSelectLineNo(line.lineNo)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  line.lineNo === selectedLineNo
                    ? 'bg-[#176f78] text-white shadow-xs'
                    : 'bg-[#f1eee6] text-[#527078] hover:bg-[#e7e1d5] border border-[#d9d2c2]'
                }`}
              >
                Line {line.lineNo}
              </button>
            ))}
            <button
              onClick={onAddNewLine}
              title="Add New Sewing Line"
              className="p-2 rounded-xl bg-[#f1eee6] text-[#176f78] hover:bg-[#dceceb] border border-[#d9d2c2] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time calculated KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#e7e1d5]">
          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase">Calculated Efficiency</span>
            <div className="font-display text-2xl font-bold text-[#176f78] font-mono-numbers">
              {metrics.efficiencyPct}%
            </div>
            <span className="text-[10px] text-[#527078]">Target: {formData.targetEff}%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase">Output vs Target</span>
            <div className="font-display text-2xl font-bold text-[#17343a] font-mono-numbers">
              {formData.achievedProd}
              <span className="text-xs text-[#527078] font-sans"> / {formData.targetProd}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {metrics.variancePcs >= 0 ? `+${metrics.variancePcs} pcs` : `${metrics.variancePcs} pcs`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase">Present Manpower</span>
            <div className="font-display text-2xl font-bold text-[#17343a] font-mono-numbers">
              {metrics.totalPresentMP}
              <span className="text-xs text-[#527078] font-sans"> MP</span>
            </div>
            <span className="text-[10px] text-rose-600 font-bold">
              {metrics.totalAbsentMP} Absent ({metrics.absenteeismPct}%)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1eee6] border border-[#d9d2c2]">
            <span className="text-[10px] text-[#527078] font-bold uppercase">Produced Minutes</span>
            <div className="font-display text-2xl font-bold text-[#17343a] font-mono-numbers">
              {metrics.standardProducedMinutes}
            </div>
            <span className="text-[10px] text-[#527078]">Avail: {metrics.availableMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Line & Order Setup */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
            <h2 className="font-display text-lg font-bold uppercase text-[#17343a] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#176f78]" />
              <span>Line Setup & Product Style Specifications</span>
            </h2>
            <span className="text-xs font-mono-numbers text-[#527078]">ID: #{formData.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Line Number
              </label>
              <input
                type="text"
                value={formData.lineNo}
                onChange={e => setFormData({ ...formData, lineNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-bold text-[#17343a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Floor Location
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={e => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Buyer / Customer
              </label>
              <input
                type="text"
                value={formData.buyer}
                onChange={e => setFormData({ ...formData, buyer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Running Style Name
              </label>
              <input
                type="text"
                value={formData.style}
                onChange={e => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-[#17343a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Standard Allowed Minutes (SMV) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.smv}
                onChange={e => setFormData({ ...formData, smv: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Planned Shift Hours
              </label>
              <input
                type="number"
                value={formData.workingHours}
                onChange={e => setFormData({ ...formData, workingHours: parseInt(e.target.value) || 8 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Target Efficiency (%)
              </label>
              <input
                type="number"
                value={formData.targetEff}
                onChange={e => setFormData({ ...formData, targetEff: parseInt(e.target.value) || 85 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Buffer WIP (Pcs)
              </label>
              <input
                type="number"
                value={formData.wip}
                onChange={e => setFormData({ ...formData, wip: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Manpower Breakdown */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
            <h2 className="font-display text-lg font-bold uppercase text-[#17343a] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#176f78]" />
              <span>Sewing Manpower & Attendance Breakdown</span>
            </h2>
            <div className="text-xs font-mono-numbers text-[#527078]">
              Total Present: <strong className="text-[#17343a]">{metrics.totalPresentMP}</strong> | Total Absent: <strong className="text-rose-600">{metrics.totalAbsentMP}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Operators */}
            <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] space-y-2">
              <div className="font-bold text-[#17343a]">Sewing Machine Operators</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#527078] uppercase font-bold">Present</label>
                  <input
                    type="number"
                    value={formData.mp.Operator.present}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          Operator: {
                            ...formData.mp.Operator,
                            present: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rose-600 uppercase font-bold">Absent</label>
                  <input
                    type="number"
                    value={formData.mp.Operator.absent}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          Operator: {
                            ...formData.mp.Operator,
                            absent: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Helpers */}
            <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] space-y-2">
              <div className="font-bold text-[#17343a]">Line Helpers / Bundlers</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#527078] uppercase font-bold">Present</label>
                  <input
                    type="number"
                    value={formData.mp.Helper.present}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          Helper: {
                            ...formData.mp.Helper,
                            present: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rose-600 uppercase font-bold">Absent</label>
                  <input
                    type="number"
                    value={formData.mp.Helper.absent}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          Helper: {
                            ...formData.mp.Helper,
                            absent: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Iron Men */}
            <div className="p-3.5 rounded-xl bg-[#f1eee6] border border-[#d9d2c2] space-y-2">
              <div className="font-bold text-[#17343a]">Iron Man / Pressers</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#527078] uppercase font-bold">Present</label>
                  <input
                    type="number"
                    value={formData.mp['Iron Man'].present}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          'Iron Man': {
                            ...formData.mp['Iron Man'],
                            present: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rose-600 uppercase font-bold">Absent</label>
                  <input
                    type="number"
                    value={formData.mp['Iron Man'].absent}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mp: {
                          ...formData.mp,
                          'Iron Man': {
                            ...formData.mp['Iron Man'],
                            absent: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#d9d2c2] font-mono-numbers text-rose-600 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Target vs Production & Balancing Method */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
            <h2 className="font-display text-lg font-bold uppercase text-[#17343a] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#176f78]" />
              <span>Production Target & Line Balancing Method</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Target Output (Pcs)
              </label>
              <input
                type="number"
                value={formData.targetProd}
                onChange={e => setFormData({ ...formData, targetProd: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Achieved Output (Pcs)
              </label>
              <input
                type="number"
                value={formData.achievedProd}
                onChange={e => setFormData({ ...formData, achievedProd: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Balancing Graph Stage
              </label>
              <select
                value={formData.balancingGraph}
                onChange={e => setFormData({ ...formData, balancingGraph: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
              >
                <option value="day1">Day 1 (Initial Setup)</option>
                <option value="day2">Day 2 (Ramping)</option>
                <option value="day3">Day 3 (Build-up)</option>
                <option value="day4">Day 4 (Peak Ramp)</option>
                <option value="complete">Complete / Stable Phase</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Balancing Countermeasure Method
              </label>
              <select
                value={formData.balanceMethod}
                onChange={e => setFormData({ ...formData, balanceMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
              >
                <option value="Overtime">Overtime (1-2 Hours)</option>
                <option value="Borrowed from other line">Borrowed Floaters from Training Pool</option>
                <option value="Extra operators">Extra Operators Deployed</option>
                <option value="Reduced target">Adjusted Learning Curve Target</option>
                <option value="Method change">Method Improvement / Jig Attached</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Line Balancing Action Notes
              </label>
              <input
                type="text"
                value={formData.balanceNotes}
                onChange={e => setFormData({ ...formData, balanceNotes: e.target.value })}
                placeholder="e.g. 2 operators worked 1 hr OT to absorb backlog"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Bottleneck Study */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e1d5] pb-3">
            <h2 className="font-display text-lg font-bold uppercase text-[#17343a] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Critical Bottleneck Station Study</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Station Name
              </label>
              <input
                type="text"
                value={formData.bottleneck.station}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bottleneck: { ...formData.bottleneck, station: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Observed Cycle Time (sec)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bottleneck.cycleTime}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bottleneck: {
                      ...formData.bottleneck,
                      cycleTime: parseFloat(e.target.value) || 0
                    }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
                Target Cycle Time (sec)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bottleneck.targetCT}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bottleneck: {
                      ...formData.bottleneck,
                      targetCT: parseFloat(e.target.value) || 0
                    }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] font-mono-numbers font-bold text-[#176f78]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
              Corrective Action Taken at Station
            </label>
            <input
              type="text"
              value={formData.bottleneck.action}
              onChange={e =>
                setFormData({
                  ...formData,
                  bottleneck: { ...formData.bottleneck, action: e.target.value }
                })
              }
              placeholder="e.g. Assigned senior multi-skilled operator & added guide attachment"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-xs"
            />
          </div>
        </div>

        {/* Section 5: Remarks & Save */}
        <div className="rounded-2xl border border-[#d9d2c2] bg-[#fbfaf6] p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#527078] mb-1">
              General Line Remarks & Supervisor Recap
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#d9d2c2] text-xs text-[#17343a] focus:outline-hidden focus:ring-1 focus:ring-[#176f78]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e7e1d5]">
            <div className="text-xs text-[#527078]">
              {saveToast && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  Line {formData.lineNo} telemetry updated successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176f78] text-white hover:bg-[#12555c] transition-colors text-xs font-bold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Line Data</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
