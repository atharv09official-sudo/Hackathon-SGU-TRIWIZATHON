import React, { useState } from 'react';
import {
  Building,
  Store,
<<<<<<< HEAD
=======
  Calendar,
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  HelpCircle,
  Edit3,
  CheckCircle2,
  Copy,
<<<<<<< HEAD
  Check
} from 'lucide-react';
import { AllocationLine, Product, Warehouse, Retailer, InventoryBatch } from '../../types';
import { ShelfLifeIndicator } from './ShelfLifeIndicator';
import { useTranslation } from '../../context/TranslationContext';
=======
  Check,
  Truck,
  Boxes,
  ShieldAlert
} from 'lucide-react';
import { AllocationLine, Product, Warehouse, Retailer, UserRole } from '../../types';
import { ShelfLifeIndicator } from './ShelfLifeIndicator';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface PlanCardItemProps {
  line: AllocationLine;
  product?: Product;
  warehouse?: Warehouse;
  retailer?: Retailer;
<<<<<<< HEAD
  batch?: InventoryBatch;
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  onExplain: (line: AllocationLine) => void;
  onEdit: (line: AllocationLine) => void;
  onApprove: (lineId: string) => void;
  isApproving?: boolean;
<<<<<<< HEAD
=======
  userRole?: UserRole;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
}

export const PlanCardItem: React.FC<PlanCardItemProps> = ({
  line,
  product,
  warehouse,
  retailer,
<<<<<<< HEAD
  batch,
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  onExplain,
  onEdit,
  onApprove,
  isApproving = false,
<<<<<<< HEAD
}) => {
  const { t, formatCurrency, formatNumber } = useTranslation();
=======
  userRole = 'rohit',
}) => {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const [copiedSku, setCopiedSku] = useState(false);

  const handleCopySku = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(line.sku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const statusMap: Record<string, { label: string; className: string }> = {
    PROPOSED: {
<<<<<<< HEAD
      label: t('proposed') || 'PROPOSED',
      className: 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] font-semibold',
    },
    APPROVED: {
      label: t('reserved') || 'RESERVED',
      className: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] font-semibold',
    },
    OVERRIDDEN: {
      label: t('modified') || 'MODIFIED',
      className: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold',
    },
    STALE: {
      label: t('stale') || '409 STALE',
      className: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold animate-pulse',
    },
    DISPATCHED: {
      label: t('dispatched') || 'DISPATCHED',
      className: 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] font-semibold',
    },
    CANCELLED: {
      label: t('cancelled') || 'CANCELLED',
      className: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
    },
    EXPIRED: {
      label: t('expired') || 'EXPIRED',
      className: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
=======
      label: 'PROPOSED',
      className: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    APPROVED: {
      label: 'RESERVED',
      className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    OVERRIDDEN: {
      label: 'MODIFIED',
      className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    STALE: {
      label: '409 STALE',
      className: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
    },
    DISPATCHED: {
      label: 'DISPATCHED',
      className: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    },
    CANCELLED: {
      label: 'CANCELLED',
      className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    EXPIRED: {
      label: 'EXPIRED',
      className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    },
  };
  const statusConfig = statusMap[line.status] || {
    label: line.status,
<<<<<<< HEAD
    className: 'bg-[#FAF3E0] text-[#64748B] border border-[#E7E5E4]',
  };

  const expiryDate = batch?.expiryDate;

  return (
    <div
      className={`p-4 rounded-xl border transition-all space-y-3 bg-white ${
        line.status === 'STALE'
          ? 'border-[#FECACA] bg-[#FEF2F2]/30'
          : line.status === 'OVERRIDDEN'
          ? 'border-[#BFDBFE] bg-[#EFF6FF]/30'
          : line.status === 'APPROVED'
          ? 'border-[#BBF7D0] bg-[#F0FDF4]/30'
          : 'border-[#E7E5E4] hover:border-[#2563EB]/40 hover:shadow-xs'
      }`}
    >
      {/* Card Header: Route & Status */}
      <div className="flex items-start justify-between gap-2 border-b border-[#E7E5E4] pb-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B]">
            <Building className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span>{warehouse?.city || line.warehouseId} Hub</span>
            <span className="text-[#64748B]">→</span>
            <Store className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            <span className="truncate max-w-[150px]">{retailer?.name || line.retailerId}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
            <span>{retailer?.city}</span>
            <span>•</span>
            <span className="text-[#2563EB] font-semibold uppercase">Class {retailer?.serviceClass}</span>
=======
    className: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div
      className={`glass-panel p-4 rounded-xl border transition-all space-y-3 ${
        line.status === 'STALE'
          ? 'border-amber-500/40 bg-amber-950/20'
          : line.status === 'OVERRIDDEN'
          ? 'border-indigo-500/40 bg-indigo-950/20'
          : line.status === 'APPROVED'
          ? 'border-emerald-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Card Header: Route & Status */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{warehouse?.city || line.warehouseId} Hub</span>
            <span className="text-slate-500">→</span>
            <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[150px]">{retailer?.name || line.retailerId}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span>{retailer?.city}</span>
            <span>•</span>
            <span className="text-indigo-400 font-semibold uppercase">Class {retailer?.serviceClass}</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>

        <span
<<<<<<< HEAD
          className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 font-mono ${statusConfig.className}`}
=======
          className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusConfig.className}`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Product & SKU Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
<<<<<<< HEAD
          <h4 className="text-xs font-bold text-[#1E293B] truncate" title={product?.name}>
=======
          <h4 className="text-xs font-bold text-white truncate" title={product?.name}>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            {product?.name || line.sku}
          </h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleCopySku}
              type="button"
<<<<<<< HEAD
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#1E293B] bg-[#FFF8E7] hover:bg-[#FAF3E0] px-2 py-0.5 rounded border border-[#E7E5E4] transition-colors whitespace-nowrap cursor-pointer select-all"
=======
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700/80 transition-colors whitespace-nowrap"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              title="Click to copy SKU code"
            >
              <span>{line.sku}</span>
              {copiedSku ? (
<<<<<<< HEAD
                <Check className="w-3 h-3 text-[#15803D]" />
              ) : (
                <Copy className="w-3 h-3 text-[#64748B]" />
              )}
            </button>
            <span className="font-mono text-[10px] text-[#64748B] bg-[#FAF3E0] px-1.5 py-0.5 rounded border border-[#E7E5E4] whitespace-nowrap">
              {line.batchNo}
            </span>
            {expiryDate && (
              <span className="font-mono text-[10px] text-[#EAB308] bg-[#FEF9C3] px-1.5 py-0.5 rounded border border-[#FEF08A] whitespace-nowrap font-bold">
                Exp: {expiryDate}
              </span>
            )}
=======
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap">
              {line.batchNo}
            </span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>

        {/* Shelf Life Gauge */}
        <div className="shrink-0 text-center">
          <ShelfLifeIndicator
            percentage={line.shelfLifeOnArrivalPct}
            minThresholdPct={retailer?.minShelfLifePct ? Math.round(retailer.minShelfLifePct * 100) : 70}
            daysRemaining={line.explanation?.shelfLifeDaysRemaining}
            compact
          />
        </div>
      </div>

      {/* Quantitative Details Grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-3 gap-2 bg-[#FFF8E7]/60 p-2.5 rounded-lg border border-[#E7E5E4] text-center">
        <div>
          <span className="text-[10px] text-[#64748B] block font-medium">{t('cases') || 'Cases'}</span>
          <span className="text-xs font-black text-[#1E293B] font-mono">{formatNumber(line.cases)} cs</span>
          <span className="text-[9px] text-[#64748B] block">({formatNumber(line.units)} u)</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block font-medium">{t('freightCost') || 'Freight'}</span>
          <span className="text-xs font-bold text-[#1E293B] font-mono">{formatCurrency(line.freightRupees)}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block font-medium">Arrival ETA</span>
          <span className="text-xs font-semibold text-[#64748B] font-mono">{line.arrivalDate}</span>
=======
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Cases</span>
          <span className="text-xs font-bold text-white font-mono">{line.cases} cs</span>
          <span className="text-[9px] text-slate-500 block">({line.units} u)</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Route Freight</span>
          <span className="text-xs font-bold text-amber-300 font-mono">₹{line.freightRupees}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Arrival ETA</span>
          <span className="text-xs font-semibold text-slate-300 font-mono">{line.arrivalDate}</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        </div>
      </div>

      {/* Overridden Callout if present */}
      {line.override && (
<<<<<<< HEAD
        <div className="text-[10px] text-[#2563EB] bg-[#EFF6FF] p-1.5 rounded border border-[#BFDBFE] flex items-center justify-between">
          <span>Overridden: {line.override.originalCases}cs → {line.override.newCases}cs</span>
          <span className="text-[#64748B] truncate max-w-[140px] italic">"{line.override.reason}"</span>
=======
        <div className="text-[10px] text-indigo-300 bg-indigo-950/40 p-1.5 rounded border border-indigo-800/40 flex items-center justify-between">
          <span>Overridden: {line.override.originalCases}cs → {line.override.newCases}cs</span>
          <span className="text-slate-400 truncate max-w-[140px] italic">"{line.override.reason}"</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        </div>
      )}

      {/* Card Actions Footer */}
<<<<<<< HEAD
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E7E5E4]">
        {/* Informational Explain Button */}
        <button
          type="button"
          onClick={() => onExplain(line)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer shadow-xs"
          title="Inspect explainable AI reasoning and value tiers"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{t('explain') || 'Explain'}</span>
        </button>

        {/* Secondary Edit / Override Button */}
        <button
          type="button"
          onClick={() => onEdit(line)}
          className="p-1.5 rounded-lg text-[#1E293B] hover:text-[#2563EB] bg-white hover:bg-[#FAF3E0] border border-[#E7E5E4] hover:border-[#2563EB] transition-colors cursor-pointer shadow-xs"
          title="Override quantity with mandatory justification"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
        </button>

        {/* Primary Action Approve Button: Red */}
        {line.status !== 'APPROVED' && line.status !== 'STALE' && (
          <button
            type="button"
            onClick={() => onApprove(line.id)}
            disabled={isApproving}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Approve line and reserve stock atomically"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('approve') || 'Approve'}</span>
          </button>
        )}

        {line.status === 'APPROVED' && (
          <span className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-1 rounded-lg border border-[#BBF7D0]">
            <Check className="w-3 h-3 text-[#15803D]" /> {t('locked') || 'Locked'}
          </span>
=======
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onExplain(line)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
          title="Inspect explainable AI reasoning and value tiers"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Explain</span>
        </button>

        {userRole === 'ganesh' ? (
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Inbound to Store</span>
          </span>
        ) : userRole === 'sunita' && line.warehouseId !== 'WH-PUN' && line.warehouseId !== 'WH-01' ? (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700">
            Non-Pune Hub
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(line)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Override quantity with mandatory justification"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {line.status !== 'APPROVED' && line.status !== 'STALE' && (
              <button
                type="button"
                onClick={() => onApprove(line.id)}
                disabled={isApproving}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                title="Approve line and reserve stock atomically"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            )}
          </>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        )}
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
