import React from 'react';
<<<<<<< HEAD
import { X, CheckCircle2, AlertTriangle, Truck, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { ReasonCard } from '../types';
import { useTranslation } from '../context/TranslationContext';
=======
import { X, CheckCircle2, AlertTriangle, ArrowRight, Truck, Calendar, Layers, ShieldCheck, DollarSign, HelpCircle } from 'lucide-react';
import { ReasonCard } from '../types';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface ReasonCardModalProps {
  card: ReasonCard | null;
  onClose: () => void;
  onApproveLine?: () => void;
}

export const ReasonCardModal: React.FC<ReasonCardModalProps> = ({ card, onClose, onApproveLine }) => {
<<<<<<< HEAD
  const { t, formatCurrency, formatNumber } = useTranslation();

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-[#E7E5E4] rounded-2xl shadow-2xl overflow-hidden my-8 text-[#1E293B]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF3E0]/70 border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                <span>{t('aiReasonCard') || 'AI Allocation Reason Card'}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  FR-10 Explainable Allocation
                </span>
              </h3>
              <p className="text-xs text-[#64748B]">{card.skuName} → {card.retailerName}</p>
=======
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Allocation Reason Card</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FR-10 Explainable Allocation
                </span>
              </h3>
              <p className="text-xs text-slate-400">{card.skuName} → {card.retailerName}</p>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>
          <button
            onClick={onClose}
<<<<<<< HEAD
            className="w-8 h-8 rounded-lg bg-white border border-[#E7E5E4] hover:bg-[#FAF3E0] text-[#64748B] hover:text-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
=======
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Executive Summary Callout */}
<<<<<<< HEAD
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
            <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Planner Explanation</span>
            </div>
            <p className="text-sm font-medium text-[#1E40AF] leading-relaxed">
=======
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Planner Explanation</span>
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              {card.summary}
            </p>
          </div>

          {/* Demand & Inventory Position */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
<<<<<<< HEAD
            <div className="bg-[#FFF8E7]/60 p-3 rounded-xl border border-[#E7E5E4]">
              <span className="text-[11px] text-[#64748B] font-medium">{t('demandMedian') || 'Demand Median (q50)'}</span>
              <p className="text-lg font-bold text-[#1E293B] mt-0.5 font-mono">{formatNumber(card.demandMedian)} units</p>
              <span className="text-[10px] text-[#64748B]">7-day cycle total</span>
            </div>

            <div className="bg-[#FFF8E7]/60 p-3 rounded-xl border border-[#E7E5E4]">
              <span className="text-[11px] text-[#64748B] font-medium">95th Percentile (q95)</span>
              <p className="text-lg font-bold text-[#2563EB] mt-0.5 font-mono">{formatNumber(card.demandP95)} units</p>
              <span className="text-[10px] text-[#2563EB]">Peak demand coverage</span>
            </div>

            <div className="bg-[#FFF8E7]/60 p-3 rounded-xl border border-[#E7E5E4]">
              <span className="text-[11px] text-[#64748B] font-medium">{t('stockAfterTransit') || 'Stock After Transit'}</span>
              <p className="text-lg font-bold text-[#1E293B] mt-0.5 font-mono">{formatNumber(card.effectiveStockBefore)} units</p>
              <span className="text-[10px] text-[#64748B]">On-hand minus lead time</span>
            </div>

            <div className="bg-[#FFF8E7]/60 p-3 rounded-xl border border-[#E7E5E4]">
              <span className="text-[11px] text-[#64748B] font-medium">{t('allocated') || 'Allocated'}</span>
              <p className="text-lg font-bold text-[#15803D] mt-0.5 font-mono">{formatNumber(card.casesAllocated)} cases</p>
              <span className="text-[10px] text-[#15803D] font-medium">{formatNumber(card.unitsAllocated)} units</span>
=======
            <div className="glass-panel p-3 rounded-xl border-slate-800">
              <span className="text-[11px] text-slate-400">Demand Median (q50)</span>
              <p className="text-lg font-bold text-white mt-0.5">{card.demandMedian} units</p>
              <span className="text-[10px] text-slate-500">7-day cycle total</span>
            </div>

            <div className="glass-panel p-3 rounded-xl border-slate-800">
              <span className="text-[11px] text-slate-400">95th Percentile (q95)</span>
              <p className="text-lg font-bold text-indigo-300 mt-0.5">{card.demandP95} units</p>
              <span className="text-[10px] text-indigo-400/80">Peak demand coverage</span>
            </div>

            <div className="glass-panel p-3 rounded-xl border-slate-800">
              <span className="text-[11px] text-slate-400">Stock After Transit</span>
              <p className="text-lg font-bold text-white mt-0.5">{card.effectiveStockBefore} units</p>
              <span className="text-[10px] text-slate-500">On-hand minus lead time</span>
            </div>

            <div className="glass-panel p-3 rounded-xl border-slate-800">
              <span className="text-[11px] text-slate-400">Allocated</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">{card.casesAllocated} cases</p>
              <span className="text-[10px] text-emerald-400/80">{card.unitsAllocated} units</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>

          {/* Marginal Value Tiers Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
<<<<<<< HEAD
              <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                <span>{t('marginalTiers') || 'Marginal Value Tiers (Why Shipping Stopped Here)'}</span>
              </h4>
              <span className="text-[11px] text-[#64748B]">Objective: Expected Margin &gt; Freight + Holding</span>
            </div>

            <div className="rounded-xl border border-[#E7E5E4] overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E5E4] bg-[#FAF3E0]/60 text-[#64748B]">
                    <th className="py-2.5 px-3 font-semibold">{t('tier') || 'Tier'}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('probability') || 'Prob (This Week)'}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('expectedMargin') || 'Expected Margin'}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('freightHolding') || 'Freight + Holding'}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('netValue') || 'Net Value (₹)'}</th>
                    <th className="py-2.5 px-3 font-semibold text-right">{t('status') || 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E4]">
                  {card.marginalTiers.map((tier, idx) => (
                    <tr
                      key={idx}
                      className={tier.allocated ? 'hover:bg-[#FAF3E0]/40' : 'bg-red-50/20 text-[#64748B]'}
                    >
                      <td className="py-2.5 px-3 font-medium text-[#1E293B]">{tier.tier} ({tier.caseRange} units)</td>
                      <td className="py-2.5 px-3 text-[#64748B] font-mono">{tier.probThisCycle}%</td>
                      <td className="py-2.5 px-3 text-[#15803D] font-semibold font-mono">{formatCurrency(tier.expectedMarginRupees)}</td>
                      <td className="py-2.5 px-3 text-[#EA580C] font-mono">{formatCurrency(tier.freightAndHoldingRupees)}</td>
                      <td className="py-2.5 px-3 font-bold font-mono">
                        <span className={tier.netValueRupees > 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}>
                          {formatCurrency(tier.netValueRupees)}
=======
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Marginal Value Tiers (Why Shipping Stopped Here)</span>
              </h4>
              <span className="text-[11px] text-slate-400">Objective: Expected Margin &gt; Freight + Holding</span>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Tier</th>
                    <th className="py-2.5 px-3 font-semibold">Prob (This Week)</th>
                    <th className="py-2.5 px-3 font-semibold">Expected Margin</th>
                    <th className="py-2.5 px-3 font-semibold">Freight + Holding</th>
                    <th className="py-2.5 px-3 font-semibold">Net Value (₹)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {card.marginalTiers.map((tier, idx) => (
                    <tr
                      key={idx}
                      className={tier.allocated ? 'bg-slate-900/30' : 'bg-rose-950/10 text-slate-400'}
                    >
                      <td className="py-2.5 px-3 font-medium text-slate-200">{tier.tier} ({tier.caseRange} units)</td>
                      <td className="py-2.5 px-3 text-slate-300">{tier.probThisCycle}%</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">₹{tier.expectedMarginRupees}</td>
                      <td className="py-2.5 px-3 text-amber-400">₹{tier.freightAndHoldingRupees}</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={tier.netValueRupees > 0 ? 'text-emerald-300' : 'text-rose-400'}>
                          ₹{tier.netValueRupees}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {tier.allocated ? (
<<<<<<< HEAD
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                            SHIPPED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
=======
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            SHIPPED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                            CUTOFF
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cutoff highlight */}
<<<<<<< HEAD
            <div className="mt-2 text-xs text-[#1E293B] bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
=======
            <div className="mt-2 text-xs text-slate-300 bg-slate-800/40 border border-slate-700/60 rounded-lg p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span>{card.cutoffReason}</span>
            </div>
          </div>

          {/* Shelf Life on Arrival */}
<<<<<<< HEAD
          <div className="p-4 rounded-xl bg-[#FFF8E7]/60 border border-[#E7E5E4] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1E293B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                <span>{t('arrivalShelfLife') || 'Shelf Life on Arrival Check'} (FR-09 Hard Constraint)</span>
              </span>
              <span className="text-[#15803D] font-bold font-mono">
=======
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Shelf Life on Arrival Check (FR-09 Hard Constraint)</span>
              </span>
              <span className="text-emerald-400 font-bold">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                {card.shelfLifeOnArrivalPct}% (Store Min: {card.minRequiredShelfLifePct}%)
              </span>
            </div>

            {/* Progress Bar */}
<<<<<<< HEAD
            <div className="w-full h-2 rounded-full bg-[#E7E5E4] overflow-hidden">
              <div
                className="h-full bg-[#15803D] rounded-full"
=======
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                style={{ width: `${Math.min(100, card.shelfLifeOnArrivalPct)}%` }}
              />
            </div>

<<<<<<< HEAD
            <p className="text-[11px] text-[#64748B]">
              Batch retains {card.shelfLifeDaysRemaining} days remaining upon arrival. Delivery meets the retailer's 70% minimum freshness requirement and will not trigger store rejection waste.
            </p>
          </div>

          {/* Delivery-Time-Aware Sourcing Comparison */}
          {card.alternativeWarehouseCompared && (
            <div className="p-4 rounded-xl bg-[#FFF8E7]/60 border border-[#E7E5E4]">
              <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#2563EB]" />
=======
            <p className="text-[11px] text-slate-400">
              Batch retains {card.shelfLifeDaysRemaining} days remaining upon arrival. Delivery meets the retailer's 70% minimum freshness requirement and will not trigger kirana rejection waste.
            </p>
          </div>

          {/* Delivery-Time-Aware Sourcing Comparison (T4 test case) */}
          {card.alternativeWarehouseCompared && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-400" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                <span>Alternative Warehouse Evaluated (Trade-off Matrix)</span>
              </h4>

              <div className="text-xs space-y-2">
<<<<<<< HEAD
                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E7E5E4]">
                  <span className="font-semibold text-[#1E293B]">Selected Source: {card.sourceWarehouseName}</span>
                  <span className="text-[#15803D] font-semibold">Optimal on-time arrival</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E7E5E4]">
                  <span className="text-[#64748B]">Compared Source: {card.alternativeWarehouseCompared.warehouseName}</span>
                  <span className="text-[#EA580C] font-semibold">Lateness penalty {formatCurrency(card.alternativeWarehouseCompared.latenessCostRupees)}</span>
                </div>

                <p className="text-[11px] text-[#64748B] mt-1">
                  <strong className="text-[#1E293B]">Why not chosen:</strong> {card.alternativeWarehouseCompared.reasonNotChosen}
=======
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="font-medium text-slate-300">Selected Source: {card.sourceWarehouseName}</span>
                  <span className="text-emerald-400 font-semibold">Optimal on-time arrival</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-400">Compared Source: {card.alternativeWarehouseCompared.warehouseName}</span>
                  <span className="text-amber-400">Lateness penalty ₹{card.alternativeWarehouseCompared.latenessCostRupees}</span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">
                  <strong>Why not chosen:</strong> {card.alternativeWarehouseCompared.reasonNotChosen}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
<<<<<<< HEAD
        <div className="px-6 py-4 bg-[#FAF3E0]/70 border-t border-[#E7E5E4] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#1E293B] bg-white border border-[#E7E5E4] hover:bg-[#FAF3E0] rounded-lg transition-colors cursor-pointer"
          >
            {t('close') || 'Close'}
=======
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </button>
          {onApproveLine && (
            <button
              onClick={() => {
                onApproveLine();
                onClose();
              }}
<<<<<<< HEAD
              className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('approveThisLine') || 'Approve This Allocation Line'}</span>
=======
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve This Allocation Line</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
