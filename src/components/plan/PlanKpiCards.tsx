import React from 'react';
import {
  Boxes,
  Clock,
  ShieldAlert,
  Truck,
  Calendar,
<<<<<<< HEAD
  CheckCircle2
} from 'lucide-react';
import { PlanRun } from '../../types';
import { normalizeShelfLifePct } from './ShelfLifeIndicator';
import { useTranslation } from '../../context/TranslationContext';
=======
  CheckCircle2,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { PlanRun } from '../../types';
import { normalizeShelfLifePct } from './ShelfLifeIndicator';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface PlanKpiCardsProps {
  planRun: PlanRun | null;
  onFilterClick?: (filterType: 'all' | 'PROPOSED' | 'APPROVED' | 'urgent' | 'expiry') => void;
}

export const PlanKpiCards: React.FC<PlanKpiCardsProps> = ({ planRun, onFilterClick }) => {
<<<<<<< HEAD
  const { t, formatCurrency, formatNumber } = useTranslation();

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  if (!planRun) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
<<<<<<< HEAD
          <div key={i} className="bg-white p-3.5 rounded-xl border border-[#E7E5E4] space-y-2">
            <div className="h-3 w-16 bg-[#FAF3E0] rounded" />
            <div className="h-6 w-20 bg-[#E7E5E4] rounded" />
            <div className="h-2.5 w-24 bg-[#FAF3E0] rounded" />
=======
          <div key={i} className="glass-panel p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="h-3 w-16 bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-slate-700/60 rounded" />
            <div className="h-2.5 w-24 bg-slate-800/80 rounded" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        ))}
      </div>
    );
  }

  const lines = planRun.lines || [];
  const totalCount = lines.length;
  const totalUnits = lines.reduce((acc, l) => acc + (l.units || 0), 0);
  const totalCases = planRun.totalCases || lines.reduce((acc, l) => acc + (l.cases || 0), 0);
  const totalFreight = planRun.totalFreightRupees || lines.reduce((acc, l) => acc + (l.freightRupees || 0), 0);
  const avgFreightPerCase = totalCases > 0 ? Math.round(totalFreight / totalCases) : 0;

  // Real calculations
  const pendingLines = lines.filter(l => l.status === 'PROPOSED');
  const pendingCount = pendingLines.length;
  const pendingPct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;

  const approvedLines = lines.filter(l => l.status === 'APPROVED' || l.status === 'DISPATCHED');
  const approvedCount = approvedLines.length;
  const approvedPct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const staleLines = lines.filter(l => l.status === 'STALE');
  const criticalExpiryLines = lines.filter(l => normalizeShelfLifePct(l.shelfLifeOnArrivalPct) < 70);
  const warningExpiryLines = lines.filter(l => {
    const p = normalizeShelfLifePct(l.shelfLifeOnArrivalPct);
    return p >= 70 && p < 75;
  });

  const urgentLines = lines.filter(
    l => l.status === 'STALE' || normalizeShelfLifePct(l.shelfLifeOnArrivalPct) < 70 || (l.explanation?.latenessDays && l.explanation.latenessDays > 0)
  );
  const urgentCount = urgentLines.length;
<<<<<<< HEAD
=======

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const expiryRiskCount = criticalExpiryLines.length + warningExpiryLines.length;

  const kpis = [
    {
      id: 'total',
<<<<<<< HEAD
      label: t('table.allocated', 'Recommendations'),
      value: formatNumber(totalCount),
      subtext: `${formatNumber(totalCases)} cs • ${formatNumber(totalUnits)} units`,
      icon: Boxes,
      iconColor: 'text-[#2563EB]',
      borderColor: 'border-[#BFDBFE]',
=======
      label: 'Total Recommendations',
      value: totalCount.toString(),
      subtext: `${totalCases.toLocaleString()} cs • ${totalUnits.toLocaleString()} units`,
      icon: Boxes,
      iconColor: 'text-indigo-400',
      badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'all' as const,
    },
    {
      id: 'pending',
<<<<<<< HEAD
      label: t('status.pending', 'Awaiting Action'),
      value: formatNumber(pendingCount),
      subtext: `${pendingPct}% awaiting approval`,
      icon: Clock,
      iconColor: pendingCount > 0 ? 'text-[#EA580C]' : 'text-[#64748B]',
      borderColor: pendingCount > 0 ? 'border-orange-200' : 'border-[#E7E5E4]',
=======
      label: 'Awaiting Approval',
      value: pendingCount.toString(),
      subtext: `${pendingPct}% of recommendations`,
      icon: Clock,
      iconColor: pendingCount > 0 ? 'text-amber-400' : 'text-slate-400',
      badgeClass: pendingCount > 0 ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'PROPOSED' as const,
    },
    {
      id: 'urgent',
<<<<<<< HEAD
      label: t('status.critical', 'High-Risk / Urgent'),
      value: formatNumber(urgentCount),
      subtext: staleLines.length > 0 ? `${staleLines.length} stale • ${criticalExpiryLines.length} critical` : `${criticalExpiryLines.length} critical SLA`,
      icon: ShieldAlert,
      iconColor: urgentCount > 0 ? 'text-[#DC2626]' : 'text-[#64748B]',
      borderColor: urgentCount > 0 ? 'border-red-200' : 'border-[#E7E5E4]',
=======
      label: 'High-Risk / Urgent',
      value: urgentCount.toString(),
      subtext: staleLines.length > 0 ? `${staleLines.length} stale (409) • ${criticalExpiryLines.length} critical` : `${criticalExpiryLines.length} critical SLA`,
      icon: ShieldAlert,
      iconColor: urgentCount > 0 ? 'text-rose-400' : 'text-slate-400',
      badgeClass: urgentCount > 0 ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'urgent' as const,
    },
    {
      id: 'freight',
<<<<<<< HEAD
      label: 'Estimated Freight',
      value: formatCurrency(totalFreight),
      subtext: `Avg ₹${avgFreightPerCase}/cs • 13.8% saved`,
      icon: Truck,
      iconColor: 'text-[#2563EB]',
      borderColor: 'border-[#E7E5E4]',
=======
      label: 'Estimated Route Freight',
      value: `₹${totalFreight.toLocaleString()}`,
      subtext: `Avg ₹${avgFreightPerCase}/cs • 13.8% savings`,
      icon: Truck,
      iconColor: 'text-amber-300',
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'all' as const,
    },
    {
      id: 'expiry',
<<<<<<< HEAD
      label: t('status.warning', 'Shelf-Life Watch'),
      value: formatNumber(expiryRiskCount),
      subtext: criticalExpiryLines.length > 0 ? `${criticalExpiryLines.length} below 70% min SLA` : 'All compliant (≥70% SLA)',
      icon: Calendar,
      iconColor: criticalExpiryLines.length > 0 ? 'text-[#DC2626]' : expiryRiskCount > 0 ? 'text-[#EAB308]' : 'text-[#15803D]',
      borderColor: expiryRiskCount > 0 ? 'border-yellow-200' : 'border-[#E7E5E4]',
=======
      label: 'Expiry-Risk Watch',
      value: expiryRiskCount.toString(),
      subtext: criticalExpiryLines.length > 0 ? `${criticalExpiryLines.length} violate ≥70% SLA` : 'All compliant with ≥70% SLA',
      icon: Calendar,
      iconColor: criticalExpiryLines.length > 0 ? 'text-rose-400' : expiryRiskCount > 0 ? 'text-amber-400' : 'text-emerald-400',
      badgeClass: criticalExpiryLines.length > 0 ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'expiry' as const,
    },
    {
      id: 'approved',
<<<<<<< HEAD
      label: t('status.approved', 'Approved / Locked'),
      value: formatNumber(approvedCount),
      subtext: `${approvedPct}% stock committed`,
      icon: CheckCircle2,
      iconColor: approvedCount === totalCount ? 'text-[#15803D]' : 'text-[#2563EB]',
      borderColor: approvedCount > 0 ? 'border-emerald-200' : 'border-[#E7E5E4]',
=======
      label: 'Approved / Reserved',
      value: approvedCount.toString(),
      subtext: `${approvedPct}% inventory locked`,
      icon: CheckCircle2,
      iconColor: approvedCount === totalCount ? 'text-emerald-400' : 'text-indigo-400',
      badgeClass: approvedCount === totalCount ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      filterKey: 'APPROVED' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map(kpi => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onFilterClick && onFilterClick(kpi.filterKey)}
<<<<<<< HEAD
            className={`text-left bg-white p-3.5 rounded-xl border ${kpi.borderColor} hover:border-[#2563EB] hover:shadow-sm transition-all group flex flex-col justify-between cursor-pointer`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors line-clamp-1">
=======
            className="text-left glass-panel glass-panel-hover p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                  {kpi.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${kpi.iconColor} shrink-0`} />
              </div>
<<<<<<< HEAD
              <div className="text-xl font-black text-[#1E293B] font-mono tracking-tight tabular-nums">
                {kpi.value}
              </div>
            </div>
            <div className="mt-2 text-[10px] text-[#64748B] truncate font-medium">
=======
              <div className="text-xl font-black text-white font-mono tracking-tight tabular-nums">
                {kpi.value}
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              {kpi.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
