import React from 'react';
import {
  Search,
<<<<<<< HEAD
=======
  Filter,
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  ArrowUpDown,
  X,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
<<<<<<< HEAD
  ChevronDown
} from 'lucide-react';
import { Warehouse, Retailer } from '../../types';
import { useTranslation } from '../../context/TranslationContext';
=======
  SlidersHorizontal,
  Building,
  Store,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Warehouse, Retailer } from '../../types';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

export type SortOption =
  | 'default'
  | 'freight_asc'
  | 'freight_desc'
  | 'cases_desc'
  | 'cases_asc'
  | 'shelf_life_asc'
  | 'shelf_life_desc'
  | 'product_asc'
<<<<<<< HEAD
  | 'retailer_asc'
  | 'warehouse_asc';
=======
  | 'retailer_asc';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

export type ShelfLifeFilter = 'all' | 'healthy' | 'warning' | 'critical';

export interface PlanFilterState {
  searchQuery: string;
  warehouseId: string;
  retailerId: string;
  status: string;
  shelfLifeRisk: ShelfLifeFilter;
  sortBy: SortOption;
  viewMode: 'table' | 'cards';
  pageSize: number;
}

interface PlanToolbarProps {
  filters: PlanFilterState;
  onFilterChange: (newFilters: Partial<PlanFilterState>) => void;
  onResetFilters: () => void;
  warehouses: Warehouse[];
  retailers: Retailer[];
  totalResultsCount: number;
  filteredCount: number;
}

export const PlanToolbar: React.FC<PlanToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  warehouses,
  retailers,
  totalResultsCount,
  filteredCount,
}) => {
<<<<<<< HEAD
  const { t, formatNumber } = useTranslation();

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const activeFiltersCount = [
    filters.searchQuery.trim() !== '',
    filters.warehouseId !== 'all',
    filters.retailerId !== 'all',
    filters.status !== 'all',
    filters.shelfLifeRisk !== 'all',
    filters.sortBy !== 'default',
  ].filter(Boolean).length;

  return (
<<<<<<< HEAD
    <div className="bg-white p-4 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-3">
=======
    <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      {/* Search & Main Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
<<<<<<< HEAD
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          <input
            type="text"
            value={filters.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
<<<<<<< HEAD
            placeholder={t('searchPlaceholder') || "Search by SKU, Product name, Store Management, or Warehouse Hub..."}
            className="w-full bg-[#FAF3E0]/40 border border-[#E7E5E4] hover:border-[#2563EB]/50 focus:border-[#2563EB] rounded-xl pl-9 pr-9 py-2 text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none transition-colors"
=======
            placeholder="Search by SKU, Product, Kirana Retailer, or Warehouse Hub..."
            className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
<<<<<<< HEAD
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] p-0.5 rounded transition-colors cursor-pointer"
=======
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Toggle & Status Count */}
        <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
<<<<<<< HEAD
          <div className="text-xs text-[#64748B] font-medium whitespace-nowrap">
            Showing <span className="font-bold text-[#1E293B] font-mono">{formatNumber(filteredCount)}</span> of{' '}
            <span className="font-bold text-[#64748B] font-mono">{formatNumber(totalResultsCount)}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 text-[11px] text-[#2563EB]">({totalResultsCount - filteredCount} filtered)</span>
=======
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Showing <span className="font-bold text-white font-mono">{filteredCount}</span> of{' '}
            <span className="font-bold text-slate-300 font-mono">{totalResultsCount}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 text-[11px] text-indigo-400">({totalResultsCount - filteredCount} filtered)</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            )}
          </div>

          {/* View Mode Switcher */}
<<<<<<< HEAD
          <div className="flex items-center bg-[#FFF8E7] border border-[#E7E5E4] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: 'table' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filters.viewMode === 'table'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
=======
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: 'table' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filters.viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              }`}
              title="Dense enterprise table layout"
            >
              <TableIcon className="w-3.5 h-3.5" />
<<<<<<< HEAD
              <span className="hidden sm:inline">{t('table') || 'Table'}</span>
=======
              <span className="hidden sm:inline">Table</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: 'cards' })}
<<<<<<< HEAD
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filters.viewMode === 'cards'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
=======
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filters.viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              }`}
              title="Responsive card grid layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
<<<<<<< HEAD
              <span className="hidden sm:inline">{t('cards') || 'Cards'}</span>
=======
              <span className="hidden sm:inline">Cards</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Sorting Row */}
<<<<<<< HEAD
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#E7E5E4] text-xs">
=======
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        <div className="flex flex-wrap items-center gap-2">
          {/* Warehouse Dropdown */}
          <div className="relative">
            <select
              value={filters.warehouseId}
              onChange={e => onFilterChange({ warehouseId: e.target.value })}
<<<<<<< HEAD
              className="appearance-none bg-[#FFF8E7] border border-[#E7E5E4] hover:border-[#2563EB]/50 text-[#1E293B] rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
            >
              <option value="all">{t('allWarehouses') || 'All Warehouses'}</option>
=======
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Warehouses</option>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.city} Hub ({w.id})
                </option>
              ))}
            </select>
<<<<<<< HEAD
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Retailer Dropdown */}
          <div className="relative">
            <select
              value={filters.retailerId}
              onChange={e => onFilterChange({ retailerId: e.target.value })}
<<<<<<< HEAD
              className="appearance-none bg-[#FFF8E7] border border-[#E7E5E4] hover:border-[#2563EB]/50 text-[#1E293B] rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#2563EB] font-medium max-w-[180px] truncate cursor-pointer"
            >
              <option value="all">{t('allRetailers') || 'All Retailers'}</option>
=======
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 font-medium max-w-[180px] truncate"
            >
              <option value="all">All Retailers</option>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              {retailers.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.city})
                </option>
              ))}
            </select>
<<<<<<< HEAD
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={e => onFilterChange({ status: e.target.value })}
<<<<<<< HEAD
              className="appearance-none bg-[#FFF8E7] border border-[#E7E5E4] hover:border-[#2563EB]/50 text-[#1E293B] rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
            >
              <option value="all">{t('allStatuses') || 'All Statuses'}</option>
              <option value="PROPOSED">{t('proposed') || 'Proposed'}</option>
              <option value="APPROVED">{t('reserved') || 'Approved / Reserved'}</option>
              <option value="OVERRIDDEN">{t('modified') || 'Overridden (Audit)'}</option>
              <option value="STALE">{t('stale') || 'Stale (409 Conflict)'}</option>
              <option value="DISPATCHED">{t('dispatched') || 'Dispatched'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="PROPOSED">Proposed</option>
              <option value="APPROVED">Approved / Reserved</option>
              <option value="OVERRIDDEN">Overridden (Audit)</option>
              <option value="STALE">Stale (409 Conflict)</option>
              <option value="DISPATCHED">Dispatched</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Shelf Life Risk Dropdown */}
          <div className="relative">
            <select
              value={filters.shelfLifeRisk}
              onChange={e => onFilterChange({ shelfLifeRisk: e.target.value as ShelfLifeFilter })}
<<<<<<< HEAD
              className="appearance-none bg-[#FFF8E7] border border-[#E7E5E4] hover:border-[#2563EB]/50 text-[#1E293B] rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
            >
              <option value="all">{t('allShelfLife') || 'All Shelf-Life'}</option>
              <option value="healthy">{t('healthy') || 'Healthy'} (≥75%)</option>
              <option value="warning">{t('nearMin') || 'Near Min'} (70-74%)</option>
              <option value="critical">{t('criticalRisk') || 'Critical Risk'} (&lt;70% SLA)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Shelf-Life</option>
              <option value="healthy">Healthy (≥75%)</option>
              <option value="warning">Near Min (70-74%)</option>
              <option value="critical">Critical (&lt;70% SLA Violation)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
<<<<<<< HEAD
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] font-semibold transition-colors cursor-pointer"
              title="Reset all search queries and filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('clearFilters') || 'Clear'} ({activeFiltersCount})</span>
=======
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold transition-colors"
              title="Reset all search queries and filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear ({activeFiltersCount})</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
<<<<<<< HEAD
          <span className="text-[#64748B] text-[11px] font-medium hidden sm:inline flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
            {t('sortBy') || 'Sort by'}:
=======
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            Sort by:
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </span>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={e => onFilterChange({ sortBy: e.target.value as SortOption })}
<<<<<<< HEAD
              className="appearance-none bg-[#FFF8E7] border border-[#E7E5E4] hover:border-[#2563EB]/50 text-[#1E293B] rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
            >
              <option value="default">{t('enginePriority') || 'Engine Priority'}</option>
              <option value="freight_asc">{t('freightLowHigh') || 'Freight: Low → High'}</option>
              <option value="freight_desc">{t('freightHighLow') || 'Freight: High → Low'}</option>
              <option value="cases_desc">{t('casesHighLow') || 'Cases: High → Low'}</option>
              <option value="cases_asc">{t('casesLowHigh') || 'Cases: Low → High'}</option>
              <option value="shelf_life_asc">{t('shelfLifeAsc') || 'Shelf Life: Lowest First (FEFO)'}</option>
              <option value="shelf_life_desc">{t('shelfLifeDesc') || 'Shelf Life: Highest First'}</option>
              <option value="product_asc">{t('productAsc') || 'Product: A → Z'}</option>
              <option value="retailer_asc">{t('retailerAsc') || 'Retailer: A → Z'}</option>
              <option value="warehouse_asc">{t('warehouseAsc') || 'Warehouse Hub: A → Z'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
=======
              className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="default">Engine Priority</option>
              <option value="freight_asc">Freight: Low → High</option>
              <option value="freight_desc">Freight: High → Low</option>
              <option value="cases_desc">Cases: High → Low</option>
              <option value="cases_asc">Cases: Low → High</option>
              <option value="shelf_life_asc">Shelf Life: Lowest First (FEFO Urgency)</option>
              <option value="shelf_life_desc">Shelf Life: Highest First</option>
              <option value="product_asc">Product: A → Z</option>
              <option value="retailer_asc">Retailer: A → Z</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
