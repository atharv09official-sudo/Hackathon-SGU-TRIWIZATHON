import { useEffect, useRef } from "react";
<<<<<<< HEAD
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
=======
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Store } from "lucide-react";
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

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
<<<<<<< HEAD
  valueLabel,
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
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

<<<<<<< HEAD
  // When a marker is selected, scroll its row into view inside the panel only
  // (scrollIntoView would also scroll the page on mobile).
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
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
<<<<<<< HEAD
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
=======
      {/* Search Input and Category Filter Bar */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-slate-400 dark:text-slate-500 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
<<<<<<< HEAD
            placeholder="Search by name…"
            aria-label="Search by name"
            className="pl-8"
          />
        </div>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-40" aria-label={`Filter by ${categoryLabel}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>All {categoryLabel.toLowerCase()}s</SelectItem>
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

<<<<<<< HEAD
      <div
        ref={scrollRef}
        className={cn(
          "min-h-0 flex-1 rounded-lg border",
          // Make shadcn's table wrapper the vertical scroller so the header can stick.
          "*:data-[slot=table-container]:h-full *:data-[slot=table-container]:max-h-[420px] *:data-[slot=table-container]:overflow-auto lg:*:data-[slot=table-container]:max-h-none",
        )}
      >
        <Table className="table-fixed">
          <TableHeader className="bg-card sticky top-0 z-10 shadow-[inset_0_-1px_0_var(--border)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-9 text-right">#</TableHead>
              <TableHead aria-sort={ariaSort(sort, "name")} className="w-[44%] sm:w-[33%]">
                <SortButton label="Name" sortKey="name" sort={sort} onSortChange={onSortChange} />
              </TableHead>
              <TableHead className="hidden w-[27%] sm:table-cell">{categoryLabel}</TableHead>
              <TableHead className="w-auto">
                <span className="sr-only">{valueLabel} bar</span>
              </TableHead>
              <TableHead aria-sort={ariaSort(sort, "value")} className="w-20 text-right">
                <SortButton
                  label="Value"
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                  sortKey="value"
                  sort={sort}
                  onSortChange={onSortChange}
                  align="right"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

<<<<<<< HEAD
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLS} className="h-40 text-center whitespace-normal">
                  <p className="text-muted-foreground">No results</p>
                  {(query || category !== ALL_CATEGORIES) && (
                    <Button variant="link" size="sm" onClick={onClearFilters}>
                      Clear filters
                    </Button>
                  )}
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
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
<<<<<<< HEAD
                      "focus-visible:ring-ring cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset",
                      isHovered && "bg-muted/60",
                      isSelected && "bg-primary/10 hover:bg-primary/15",
                    )}
                  >
                    <TableCell className="text-muted-foreground text-right tabular-nums">
                      {row.rank}
                    </TableCell>
                    <TableCell className="max-w-0">
                      <div className="truncate font-medium" title={row.name}>
                        {row.name}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
                        <span
                          className="size-2 shrink-0 rounded-full sm:hidden"
                          style={{ backgroundColor: row.color }}
                          aria-hidden
                        />
                        <span className="sm:hidden">{row.category} · </span>
                        {row.city}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs sm:table-cell">
                      <span className="flex items-center gap-1.5" title={row.category}>
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: row.color }}
                          aria-hidden
                        />
                        <span className="truncate">{row.category}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div
                        className="bg-muted h-2.5 w-full overflow-hidden rounded-full"
                        role="presentation"
                      >
                        <div
                          className="h-full rounded-full transition-[width] duration-300 ease-out"
                          style={{
                            width: `${row.value > 0 ? Math.max(pct, 2) : 0}%`,
                            backgroundColor: row.color,
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatValue(row.value)}
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>

<<<<<<< HEAD
          <TableFooter className="bg-card sticky bottom-0 z-10 shadow-[inset_0_1px_0_var(--border)]">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="text-muted-foreground font-normal">
                Showing {rows.length} of {totalCount}
              </TableCell>
              <TableCell className="hidden sm:table-cell" />
              <TableCell className="text-muted-foreground text-right font-normal">Total</TableCell>
              <TableCell className="text-right tabular-nums">{formatValue(totalValue)}</TableCell>
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function ariaSort(sort: SortState, key: SortKey): "ascending" | "descending" | "none" {
  if (sort.key !== key) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
}

interface SortButtonProps {
=======
function SortButton({
  label,
  sortKey,
  sort,
  onSortChange,
  align = "left",
}: {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  align?: "left" | "right";
<<<<<<< HEAD
}

function SortButton({ label, sortKey, sort, onSortChange, align = "left" }: SortButtonProps) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
=======
}) {
  const isSorted = sort.key === sortKey;
  const Icon = !isSorted ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  return (
    <button
      type="button"
      onClick={() => onSortChange(sortKey)}
      className={cn(
<<<<<<< HEAD
        "hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm outline-none focus-visible:ring-2",
        align === "right" && "flex-row-reverse",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      <Icon className="size-3.5" aria-hidden />
=======
        "inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer",
        align === "right" && "ml-auto",
        isSorted ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400",
      )}
    >
      <span>{label}</span>
      <Icon className="size-3" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    </button>
  );
}

<<<<<<< HEAD
export function RankedBarTableSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3" aria-busy="true" aria-label="Loading table">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-full sm:w-40" />
      </div>
      <div className="flex-1 space-y-3 rounded-lg border p-3">
        <Skeleton className="h-4 w-1/3" />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-5" />
            <Skeleton className="h-4 w-[35%]" />
            <Skeleton className="h-2.5 flex-1 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
=======
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
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    </div>
  );
}
