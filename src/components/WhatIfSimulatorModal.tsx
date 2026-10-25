import React, { useState } from 'react';
import { Sliders, X, Sparkles, TrendingUp, Truck, Building, RotateCcw } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from '../context/TranslationContext';
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseCases: number;
  baseFreight: number;
  baseMargin: number;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  baseCases,
  baseFreight,
  baseMargin,
}) => {
<<<<<<< HEAD
  const { t, formatCurrency, formatNumber } = useTranslation();
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const [demandSurgePct, setDemandSurgePct] = useState<number>(15); // +15%
  const [freightShockPct, setFreightShockPct] = useState<number>(10); // +10%
  const [puneCapacityLimitPct, setPuneCapacityLimitPct] = useState<number>(100); // 100% normal

  if (!isOpen) return null;

  // Calculated what-if adjustments
  const multiplierDemand = 1 + demandSurgePct / 100;
  const multiplierFreight = 1 + freightShockPct / 100;
  const capacityConstraintFactor = puneCapacityLimitPct < 80 ? (puneCapacityLimitPct / 100) : 1;

  const simulatedCases = Math.round(baseCases * multiplierDemand * capacityConstraintFactor);
  const simulatedFreight = Math.round(baseFreight * (simulatedCases / Math.max(1, baseCases)) * multiplierFreight);
  const simulatedMargin = Math.round(baseMargin * (simulatedCases / Math.max(1, baseCases)));

  const handleReset = () => {
    setDemandSurgePct(0);
    setFreightShockPct(0);
    setPuneCapacityLimitPct(100);
  };

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border border-[#E7E5E4] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF3E0] border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">
                {t('modal.whatIfTitle', 'What-If Scenario Simulator (FR-17)')}
              </h3>
              <p className="text-xs text-[#64748B]">{t('modal.whatIfSubtitle', 'Stress-test allocation against macro shocks in real-time')}</p>
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                What-If Scenario Simulator (FR-17)
              </h3>
              <p className="text-xs text-slate-400">Stress-test allocation against macro shocks in real-time</p>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>
          <button
            onClick={onClose}
<<<<<<< HEAD
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFF8E7] border border-[#E7E5E4] text-[#64748B] hover:text-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
=======
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders Body */}
        <div className="p-6 space-y-6">
          {/* Slider 1: Festival Demand Surge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
              <span className="font-semibold text-[#1E293B] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#15803D]" />
                <span>Diwali Festival Demand Surge</span>
              </span>
              <span className="font-bold text-[#15803D]">+{demandSurgePct}%</span>
=======
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Diwali Festival Demand Surge</span>
              </span>
              <span className="font-bold text-emerald-400">+{demandSurgePct}%</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
            <input
              type="range"
              min={-30}
              max={60}
              step={5}
              value={demandSurgePct}
              onChange={e => setDemandSurgePct(parseInt(e.target.value))}
<<<<<<< HEAD
              className="w-full accent-[#15803D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
=======
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span>-30% (Slump)</span>
              <span>0% (Baseline)</span>
              <span>+60% (Festive Peak)</span>
            </div>
          </div>

          {/* Slider 2: Fuel / Freight Rate Shock */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
              <span className="font-semibold text-[#1E293B] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#EA580C]" />
                <span>Secondary Route Freight Inflation</span>
              </span>
              <span className="font-bold text-[#EA580C]">+{freightShockPct}%</span>
=======
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Secondary Route Freight Inflation</span>
              </span>
              <span className="font-bold text-amber-400">+{freightShockPct}%</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
            <input
              type="range"
              min={-20}
              max={50}
              step={5}
              value={freightShockPct}
              onChange={e => setFreightShockPct(parseInt(e.target.value))}
<<<<<<< HEAD
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
=======
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span>-20% (Subsidy)</span>
              <span>0% (Normal)</span>
              <span>+50% (Fuel Hike)</span>
            </div>
          </div>

          {/* Slider 3: Warehouse Capacity Bottleneck */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
              <span className="font-semibold text-[#1E293B] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#2563EB]" />
                <span>Pune Central Hub Throughput</span>
              </span>
              <span className="font-bold text-[#2563EB]">{puneCapacityLimitPct}% Available</span>
=======
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Pune Central Hub Throughput</span>
              </span>
              <span className="font-bold text-indigo-300">{puneCapacityLimitPct}% Available</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={10}
              value={puneCapacityLimitPct}
              onChange={e => setPuneCapacityLimitPct(parseInt(e.target.value))}
<<<<<<< HEAD
              className="w-full accent-[#2563EB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B]">
=======
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span>30% (Dock Strike)</span>
              <span>70% (Restricted)</span>
              <span>100% (Full Capacity)</span>
            </div>
          </div>

          {/* Live Impact Preview */}
<<<<<<< HEAD
          <div className="p-4 rounded-xl bg-[#FFF8E7] border border-[#E7E5E4] space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
=======
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              Simulated Plan Outcome
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
<<<<<<< HEAD
              <div className="p-2.5 rounded-lg bg-white border border-[#E7E5E4] shadow-xs">
                <span className="text-[#64748B] block text-[11px]">Cases Dispatched</span>
                <span className="text-base font-bold text-[#1E293B] mt-0.5 block">{formatNumber(simulatedCases)} cs</span>
                <span className="text-[10px] text-[#64748B]">Base: {formatNumber(baseCases)} cs</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E7E5E4] shadow-xs">
                <span className="text-[#64748B] block text-[11px]">Route Freight</span>
                <span className="text-base font-bold text-[#EA580C] mt-0.5 block">{formatCurrency(simulatedFreight)}</span>
                <span className="text-[10px] text-[#64748B]">Base: {formatCurrency(baseFreight)}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#E7E5E4] shadow-xs">
                <span className="text-[#64748B] block text-[11px]">Gross Margin</span>
                <span className="text-base font-bold text-[#15803D] mt-0.5 block">{formatCurrency(simulatedMargin)}</span>
                <span className="text-[10px] text-[#64748B]">Base: {formatCurrency(baseMargin)}</span>
=======
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Cases Dispatched</span>
                <span className="text-base font-bold text-white mt-0.5 block">{simulatedCases} cs</span>
                <span className="text-[10px] text-slate-500">Base: {baseCases} cs</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Route Freight</span>
                <span className="text-base font-bold text-amber-300 mt-0.5 block">₹{simulatedFreight.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">Base: ₹{baseFreight.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Gross Margin</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">₹{simulatedMargin.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">Base: ₹{baseMargin.toLocaleString()}</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
<<<<<<< HEAD
        <div className="px-6 py-4 bg-[#FAF3E0] border-t border-[#E7E5E4] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
=======
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>

          <button
            onClick={onClose}
<<<<<<< HEAD
            className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-sm transition-all cursor-pointer"
=======
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
