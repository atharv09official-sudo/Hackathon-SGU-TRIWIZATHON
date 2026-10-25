import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ALL_CATEGORIES,
  type RankedRegionStat,
  type SortKey,
  type SortState,
} from "./types";

interface RankedBarTableProps {
  rows: RankedRegionStat[];
  totalCount: number;
  maxValue: number;
  totalValue: number;
  formatValue: (n: number) => string;
  valueLabel: string;
  categoryLabel: string;
  categories: string[];
  query: string;
  onQueryChange: (q: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  onClearFilters: () => void;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const COLS = 5;

export function RankedBarTable({
  rows,
  totalCount,
  maxValue,
  totalValue,
  formatValue,
  categoryLabel,
  categories,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  onClearFilters,
  sort,
  onSortChange,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
}: RankedBarTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current?.querySelector<HTMLElement>(
      "[data-slot=table-container]",
    );
    if (!container || !selectedId) return;
    const row = container.querySelector<HTMLElement>(
      `[data-row-id="${CSS.escape(selectedId)}"]`,
    );
    const head = container.querySelector<HTMLElement>("thead");
    const foot = container.querySelector<HTMLElement>("tfoot");
    if (!row) return;
    const top = row.offsetTop - (head?.offsetHeight ?? 0);
    const bottom =
      row.offsetTop + row.offsetHeight - container.clientHeight + (foot?.offsetHeight ?? 0);
    if (container.scrollTop > top) container.scrollTop = top;
    else if (container.scrollTop < bottom) container.scrollTop = bottom;
  }, [selectedId]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Search Input and Category Filter Bar */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-slate-400 dark:text-slate-500 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search stores or cities (e.g. Pune, Kolhapur)…"
            aria-label="Search stores by name or city"
            className="pl-9 bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 transition-colors"
          />
        </div>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-44 bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200" aria-label={`Filter by ${categoryLabel}`}>
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
            <SelectItem value={ALL_CATEGORIES}>All Channels ({totalCount})</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interactive Retailer List Table */}
      <div
        ref={scrollRef}
        className={cn(
          "min-h-0 flex-1 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs bg-white dark:bg-slate-950/60",
          "*:data-[slot=table-container]:h-full *:data-[slot=table-container]:max-h-[440px] *:data-[slot=table-container]:overflow-auto lg:*:data-[slot=table-container]:max-h-none",
        )}
      >
        <Table className="table-auto w-full">
          <TableHeader className="bg-slate-50/90 dark:bg-slate-950 sticky top-0 z-10 border-b border-slate-200/90 dark:border-slate-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 text-center text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">#</TableHead>
              <TableHead aria-sort={ariaSort(sort, "name")} className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                <SortButton label="Store & City" sortKey="name" sort={sort} onSortChange={onSortChange} />
              </TableHead>
              <TableHead className="hidden sm:table-cell w-28 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Channel</TableHead>
              <TableHead className="w-24 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Share</TableHead>
              <TableHead aria-sort={ariaSort(sort, "value")} className="w-24 text-right text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                <SortButton
                  label="P50 Units"
                  sortKey="value"
                  sort={sort}
                  onSortChange={onSortChange}
                  align="right"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLS} className="h-44 text-center whitespace-normal">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Store className="w-8 h-8 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500">No stores match your query</p>
                    {(query || category !== ALL_CATEGORIES) && (
                      <Button variant="outline" size="sm" onClick={onClearFilters} className="text-xs font-semibold mt-1">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const pct = maxValue > 0 ? (row.value / maxValue) * 100 : 0;
                const isHovered = row.id === hoveredId;
                const isSelected = row.id === selectedId;
                return (
                  <TableRow
                    key={row.id}
                    data-row-id={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    aria-selected={isSelected}
                    tabIndex={0}
                    onMouseEnter={() => onHover(row.id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(row.id)}
                    onBlur={() => onHover(null)}
                    onClick={() => onSelect(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(row.id);
                      }
                    }}
                    className={cn(
                      "cursor-pointer outline-none transition-colors duration-150 text-xs",
                      isHovered && "bg-slate-100/70 dark:bg-slate-800/50",
                      isSelected
                        ? "bg-indigo-50/90 dark:bg-indigo-950/60 border-l-4 border-l-indigo-600 shadow-xs"
                        : "border-l-4 border-l-transparent",
                    )}
                  >
                    {/* Rank */}
                    <TableCell className="text-center font-bold font-mono text-[11px] text-slate-500 dark:text-slate-400 py-3">
                      {row.rank}
                    </TableCell>

                    {/* Store Name & City */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="size-2.5 shrink-0 rounded-full shadow-xs"
                          style={{ backgroundColor: row.color }}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate" title={row.name}>
                            {row.name}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px] mt-0.5">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{row.city}</span>
                            <span>•</span>
                            <span>{row.category}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Channel Pill Badge */}
                    <TableCell className="hidden sm:table-cell py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap"
                        style={{
                          backgroundColor: `${row.color}15`,
                          color: row.color === "#f59e0b" ? "#b45309" : row.color === "#10b981" ? "#047857" : "#4338ca",
                          borderColor: `${row.color}40`,
                        }}
                      >
                        <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        {row.category}
                      </span>
                    </TableCell>

                    {/* Demand Proportion Bar */}
                    <TableCell className="py-3">
                      <div className="w-full space-y-1">
                        <div
                          className="bg-slate-100 dark:bg-slate-800 h-2 w-full overflow-hidden rounded-full"
                          role="presentation"
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300 ease-out"
                            style={{
                              width: `${row.value > 0 ? Math.max(pct, 4) : 0}%`,
                              backgroundColor: row.color,
                              boxShadow: `0 0 8px ${row.color}60`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                          {totalValue > 0 ? ((row.value / totalValue) * 100).toFixed(0) : 0}% network
                        </span>
                      </div>
                    </TableCell>

                    {/* Demand Value */}
                    <TableCell className="text-right py-3">
                      <div className="font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white tabular-nums">
                        {formatValue(row.value)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">units</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>

          <TableFooter className="bg-slate-50/90 dark:bg-slate-950 sticky bottom-0 z-10 border-t border-slate-200 dark:border-slate-800">
            <TableRow className="hover:bg-transparent text-xs">
              <TableCell colSpan={2} className="text-slate-600 dark:text-slate-400 font-bold py-3 pl-4">
                Showing {rows.length} of {totalCount} Retailers
              </TableCell>
              <TableCell className="hidden sm:table-cell py-3" />
              <TableCell className="text-slate-500 dark:text-slate-400 text-right font-bold py-3 uppercase tracking-wider text-[11px]">
                Total
              </TableCell>
              <TableCell className="text-right font-mono font-black text-slate-900 dark:text-white text-sm py-3 tabular-nums">
                {formatValue(totalValue)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

function SortButton({
  label,
  sortKey,
  sort,
  onSortChange,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isSorted = sort.key === sortKey;
  const Icon = !isSorted ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSortChange(sortKey)}
      className={cn(
        "inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer",
        align === "right" && "ml-auto",
        isSorted ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400",
      )}
    >
      <span>{label}</span>
      <Icon className="size-3" />
    </button>
  );
}

function ariaSort(sort: SortState, key: SortKey): "ascending" | "descending" | "none" {
  if (sort.key !== key) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
}

export function RankedBarTableSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
      <Skeleton className="h-[460px] w-full rounded-xl" />
    </div>
  );
}
