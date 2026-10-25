import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, HelpCircle } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from '../../context/TranslationContext';
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

export const normalizeShelfLifePct = (val: number): number => {
  if (val <= 1.0 && val > 0) return Math.round(val * 100);
  return Math.round(val);
};

export type ShelfLifeHealth = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export const getShelfLifeHealth = (val: number): ShelfLifeHealth => {
  const pct = normalizeShelfLifePct(val);
  if (pct < 70) return 'CRITICAL';
  if (pct < 75) return 'WARNING';
  return 'HEALTHY';
};

interface ShelfLifeIndicatorProps {
  percentage: number;
  minThresholdPct?: number;
  daysRemaining?: number;
  compact?: boolean;
}

export const ShelfLifeIndicator: React.FC<ShelfLifeIndicatorProps> = ({
  percentage,
  minThresholdPct = 70,
  daysRemaining,
  compact = false,
}) => {
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const [showTooltip, setShowTooltip] = useState(false);
  const normalized = normalizeShelfLifePct(percentage);
  const health = getShelfLifeHealth(percentage);

  const config = {
    HEALTHY: {
<<<<<<< HEAD
      label: t('healthy') || 'Healthy',
      badgeClass: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
      barColor: 'bg-[#15803D]',
      icon: CheckCircle2,
      iconColor: 'text-[#15803D]',
    },
    WARNING: {
      label: t('nearMin') || 'Near Min',
      badgeClass: 'text-[#EA580C] bg-[#FFF7ED] border-[#FED7AA]',
      barColor: 'bg-[#EAB308]',
      icon: Clock,
      iconColor: 'text-[#EA580C]',
    },
    CRITICAL: {
      label: t('criticalRisk') || 'Critical Risk',
      badgeClass: 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA] font-bold',
      barColor: 'bg-[#DC2626]',
      icon: AlertTriangle,
      iconColor: 'text-[#DC2626]',
=======
      label: 'Healthy',
      badgeClass: 'text-emerald-300 bg-emerald-950/50 border-emerald-500/40',
      barColor: 'bg-emerald-400',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    WARNING: {
      label: 'Near Min',
      badgeClass: 'text-amber-300 bg-amber-950/50 border-amber-500/40',
      barColor: 'bg-amber-400',
      icon: Clock,
      iconColor: 'text-amber-400',
    },
    CRITICAL: {
      label: 'Critical Risk',
      badgeClass: 'text-rose-300 bg-rose-950/60 border-rose-500/50 font-bold',
      barColor: 'bg-rose-500',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    },
  }[health];

  const Icon = config.icon;
  const barWidth = Math.min(100, Math.max(0, normalized));

  return (
    <div
      className="relative inline-flex flex-col items-center group cursor-help select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="tooltip"
<<<<<<< HEAD
      aria-label={`Arrival shelf-life: ${normalized}%. Status: ${config.label}. Store minimum threshold is ${minThresholdPct}%.`}
=======
      aria-label={`Arrival shelf-life: ${normalized}%. Status: ${config.label}. Kirana minimum threshold is ${minThresholdPct}%.`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    >
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold ${config.badgeClass} transition-colors`}
      >
        <Icon className={`w-3 h-3 ${config.iconColor} shrink-0`} />
        <span className="font-mono tabular-nums font-bold">{normalized}%</span>
        {!compact && (
          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90 hidden sm:inline">
            {config.label}
          </span>
        )}
      </div>

      {/* Mini Progress Bar with 70% threshold tick */}
<<<<<<< HEAD
      <div className="w-20 sm:w-24 h-1.5 bg-[#E7E5E4] rounded-full mt-1.5 overflow-hidden relative">
=======
      <div className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden relative">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        <div
          className={`h-full ${config.barColor} transition-all duration-300 rounded-full`}
          style={{ width: `${barWidth}%` }}
        />
        {/* Threshold marker tick at 70% */}
        <div
<<<<<<< HEAD
          className="absolute top-0 bottom-0 w-0.5 bg-[#64748B] z-10"
          style={{ left: `${minThresholdPct}%` }}
          title={`Store SLA minimum limit (${minThresholdPct}%)`}
=======
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
          style={{ left: `${minThresholdPct}%` }}
          title={`Kirana SLA minimum limit (${minThresholdPct}%)`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        />
      </div>

      {/* Subtext */}
<<<<<<< HEAD
      <span className="text-[9px] text-[#64748B] font-medium mt-0.5">
=======
      <span className="text-[9px] text-slate-400 font-medium mt-0.5">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        &ge; {minThresholdPct}% min SLA
      </span>

      {/* Hover / Focus Tooltip */}
      {showTooltip && (
<<<<<<< HEAD
        <div className="absolute bottom-full mb-2 z-50 w-64 p-3 bg-white border border-[#E7E5E4] rounded-xl shadow-xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B] mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{t('arrivalShelfLife') || 'Remaining Shelf Life on Arrival'}</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed mb-2">
            Represents the ratio of usable shelf life remaining upon store delivery:
            <span className="block font-mono text-[10px] text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] p-1 rounded mt-1">
              (Expiry Date − Arrival Date) ÷ Total Shelf Life
            </span>
          </p>
          <div className="space-y-1 text-[10px] border-t border-[#E7E5E4] pt-1.5">
            <div className="flex justify-between text-[#64748B]">
              <span>Arrival Value:</span>
              <span className="font-bold text-[#1E293B] font-mono">{normalized}%</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>Store Rule:</span>
              <span className="font-semibold text-[#15803D]">&ge; {minThresholdPct}% Minimum</span>
            </div>
            {daysRemaining !== undefined && (
              <div className="flex justify-between text-[#64748B]">
                <span>Days Remaining:</span>
                <span className="font-mono text-[#EAB308] font-semibold">{daysRemaining} days</span>
              </div>
            )}
            <div className="flex justify-between text-[#64748B]">
=======
        <div className="absolute bottom-full mb-2 z-50 w-64 p-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Remaining Shelf Life on Arrival</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
            Represents the ratio of usable shelf life remaining upon store delivery:
            <span className="block font-mono text-[10px] text-indigo-300 mt-0.5">
              (Expiry Date − Arrival Date) ÷ Total Shelf Life
            </span>
          </p>
          <div className="space-y-1 text-[10px] border-t border-slate-800 pt-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Arrival Value:</span>
              <span className="font-bold text-white font-mono">{normalized}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Kirana Rule:</span>
              <span className="font-semibold text-emerald-400">&ge; {minThresholdPct}% Minimum</span>
            </div>
            {daysRemaining !== undefined && (
              <div className="flex justify-between text-slate-300">
                <span>Days Remaining:</span>
                <span className="font-mono text-amber-300">{daysRemaining} days</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span>Condition:</span>
              <span className={`font-bold ${config.iconColor}`}>{config.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
