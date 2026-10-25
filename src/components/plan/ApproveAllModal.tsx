import React from 'react';
<<<<<<< HEAD
import { CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { PlanRun } from '../../types';
import { useTranslation } from '../../context/TranslationContext';
=======
import { CheckCircle2, AlertCircle, X, ShieldCheck, Truck, Boxes } from 'lucide-react';
import { PlanRun } from '../../types';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface ApproveAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planRun: PlanRun;
  isProcessing?: boolean;
}

export const ApproveAllModal: React.FC<ApproveAllModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planRun,
  isProcessing = false,
}) => {
<<<<<<< HEAD
  const { t, formatCurrency, formatNumber } = useTranslation();

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  if (!isOpen) return null;

  const totalLines = planRun.lines.length;
  const pendingLines = planRun.lines.filter(l => l.status === 'PROPOSED').length;
  const totalUnits = planRun.lines.reduce((acc, l) => acc + (l.units || 0), 0);

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-[#E7E5E4] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 text-[#1E293B]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">{t('confirmApprovalTitle') || 'Approve & Reserve Allocation Plan'}</h3>
              <p className="text-xs text-[#64748B] font-mono">{planRun.id}</p>
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Approve & Reserve Allocation Plan</h3>
              <p className="text-xs text-slate-400 font-mono">{planRun.id}</p>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
<<<<<<< HEAD
            className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#FAF3E0] transition-colors cursor-pointer"
=======
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Impact Summary Metrics */}
<<<<<<< HEAD
        <div className="grid grid-cols-3 gap-2.5 bg-[#FFF8E7]/60 p-3.5 rounded-xl border border-[#E7E5E4] text-center">
          <div>
            <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block">Lines to Lock</span>
            <span className="text-lg font-black text-[#1E293B] font-mono">{pendingLines} of {totalLines}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block">{t('totalVolume') || 'Total Volume'}</span>
            <span className="text-lg font-black text-[#1E293B] font-mono">{formatNumber(planRun.totalCases)} cs</span>
            <span className="text-[9px] text-[#64748B] block">({formatNumber(totalUnits)} units)</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block">{t('freightCost') || 'Route Freight'}</span>
            <span className="text-lg font-black text-[#2563EB] font-mono">{formatCurrency(planRun.totalFreightRupees)}</span>
=======
        <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Lines to Lock</span>
            <span className="text-lg font-black text-white font-mono">{pendingLines} of {totalLines}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Total Volume</span>
            <span className="text-lg font-black text-indigo-300 font-mono">{planRun.totalCases} cs</span>
            <span className="text-[9px] text-slate-500 block">({totalUnits.toLocaleString()} units)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Route Freight</span>
            <span className="text-lg font-black text-amber-300 font-mono">₹{planRun.totalFreightRupees.toLocaleString()}</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>

        {/* Informational Callout */}
<<<<<<< HEAD
        <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-2.5 text-xs text-[#1E40AF]">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('confirmApprovalBody') || 'Approving this plan will atomically commit inventory reservations across all candidate batches. Warehouse inventory versions will increment, and stock will be locked for transport dispatch.'}
=======
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Approving this plan will atomically commit inventory reservations across all candidate batches. Warehouse inventory versions will increment, and stock will be locked for transport dispatch under Four-Eyes approval policies.
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </p>
        </div>

        {/* Buttons */}
<<<<<<< HEAD
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E7E5E4]">
=======
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
<<<<<<< HEAD
            className="px-4 py-2 text-xs font-semibold text-[#1E293B] bg-white border border-[#E7E5E4] hover:bg-[#FAF3E0] rounded-xl transition-colors cursor-pointer"
          >
            {t('cancel') || 'Cancel'}
=======
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Cancel
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
<<<<<<< HEAD
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
=======
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            {isProcessing ? (
              <span>Reserving Inventory...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
<<<<<<< HEAD
                <span>{t('confirmAndLock') || 'Confirm & Lock Allocation'}</span>
=======
                <span>Confirm & Lock Allocation</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
