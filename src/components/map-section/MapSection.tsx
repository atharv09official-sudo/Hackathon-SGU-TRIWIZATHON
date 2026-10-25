import { useCallback, useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import { AlertCircle, RotateCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRegionStats } from "@/data/regionStats";

import { DataMap } from "./DataMap";
import { type MapTypeId } from "@/components/ui/map";
=======
import {
  AlertCircle,
  RotateCw,
  Navigation,
  MapPin,
  Layers,
  Moon,
  Columns2,
  Maximize2,
  TrendingUp,
  Store,
  Building,
  Radio,
  CheckCircle2,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRegionStats } from "@/data/regionStats";

import { DataMap, ViewModeKey } from "./DataMap";
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
import { RankedBarTable, RankedBarTableSkeleton } from "./RankedBarTable";
import {
  ALL_CATEGORIES,
  type FlyRequest,
  type LoadState,
  type RankedRegionStat,
  type RegionStat,
  type SortKey,
  type SortState,
} from "./types";

const VALUE_LABEL = "Forecast weekly demand (units, P50)";
const CATEGORY_LABEL = "Channel";

const CATEGORY_COLORS: Record<string, string> = {
<<<<<<< HEAD
  "Modern Trade": "#2563EB", // blue accent
  Distributor: "#15803D", // green success
  "Store Management": "#EA580C", // orange warning/attention accent
  Kirana: "#EA580C", // backward compatibility
};
const FALLBACK_COLORS = ["#2563EB", "#EA580C", "#EAB308", "#15803D", "#DC2626"];
=======
  "Modern Trade": "#6366f1", // indigo-500
  Distributor: "#10b981", // emerald-500
  Kirana: "#f59e0b", // amber-500
};
const FALLBACK_COLORS = ["#06b6d4", "#ec4899", "#8b5cf6", "#84cc16", "#f97316"];
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

const numberFormat = new Intl.NumberFormat("en-IN");
const formatValue = (n: number) => numberFormat.format(n);

/** Hover + selection shared by the table and the map. */
function useLinkedSelection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyRequest, setFlyRequest] = useState<FlyRequest | null>(null);

  /** From a table row: select and fly the map there. */
  const selectFromTable = useCallback((id: string) => {
    setSelectedId(id);
    setFlyRequest((prev) => ({ id, nonce: (prev?.nonce ?? 0) + 1 }));
  }, []);

  /** From a marker click: the map is already looking at it. */
  const selectFromMap = useCallback((id: string) => setSelectedId(id), []);

  /** A popup closed; clear only if it belonged to the current selection. */
  const clearIfSelected = useCallback(
    (id: string) => setSelectedId((prev) => (prev === id ? null : prev)),
    [],
  );

  return {
    hoveredId,
    selectedId,
    flyRequest,
    setHoveredId,
    selectFromTable,
    selectFromMap,
    clearIfSelected,
  };
}

function useRegionStats() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchRegionStats(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Something went wrong.",
        });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);
  return { state, retry };
}

function rankAndColor(data: RegionStat[]): RankedRegionStat[] {
  const extraColors = new globalThis.Map<string, string>();
  const colorFor = (category: string) => {
    const known = CATEGORY_COLORS[category];
    if (known) return known;
    if (!extraColors.has(category)) {
      extraColors.set(category, FALLBACK_COLORS[extraColors.size % FALLBACK_COLORS.length]);
    }
    return extraColors.get(category) ?? FALLBACK_COLORS[0];
  };
  return [...data]
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
    .map((r, i) => ({ ...r, rank: i + 1, color: colorFor(r.category) }));
}

const EMPTY: RegionStat[] = [];

<<<<<<< HEAD
export function MapSection() {
=======
export interface MapSectionProps {
  theme?: "day" | "night";
}

export function MapSection({ theme = "day" }: MapSectionProps) {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const { state, retry } = useRegionStats();
  const link = useLinkedSelection();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [sort, setSort] = useState<SortState>({ key: "value", dir: "desc" });
<<<<<<< HEAD
  const [mapTypeId, setMapTypeId] = useState<MapTypeId>("satellite");

  const data = state.status === "success" ? state.data : EMPTY;

=======
  const [layoutMode, setLayoutMode] = useState<"split" | "expanded">("split");
  const [viewMode, setViewMode] = useState<ViewModeKey>(theme === "night" ? "dark" : "street");

  const data = state.status === "success" ? state.data : EMPTY;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const ranked = useMemo(() => rankAndColor(data), [data]);

  const categories = useMemo(
    () => [...new Set(ranked.map((r) => r.category))].sort((a, b) => a.localeCompare(b)),
    [ranked],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = ranked.filter(
      (r) =>
        (category === ALL_CATEGORIES || r.category === category) &&
        (q === "" || r.name.toLowerCase().includes(q)),
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) =>
      sort.key === "name"
        ? dir * a.name.localeCompare(b.name)
        : dir * (a.value - b.value) || a.name.localeCompare(b.name),
    );
  }, [ranked, query, category, sort]);

  const { maxValue, totalValue } = useMemo(
    () => ({
      maxValue: visible.reduce((m, r) => Math.max(m, r.value), 0),
      totalValue: visible.reduce((s, r) => s + r.value, 0),
    }),
    [visible],
  );

<<<<<<< HEAD
  // Ignore hover/selection for rows hidden by the current filter.
=======
  const summary = useMemo(() => {
    const topStore =
      visible.reduce<RankedRegionStat | null>(
        (best, row) => (best === null || row.value > best.value ? row : best),
        null,
      ) ?? null;

    const cityTotals = new globalThis.Map<string, number>();
    const categoryTotals = new globalThis.Map<string, number>();
    for (const row of visible) {
      cityTotals.set(row.city, (cityTotals.get(row.city) ?? 0) + row.value);
      categoryTotals.set(
        row.category,
        (categoryTotals.get(row.category) ?? 0) + row.value,
      );
    }

    const topCity =
      [...cityTotals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ??
      null;
    const leadingCategory =
      [...categoryTotals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ??
      null;

    return {
      topStore,
      topCity,
      leadingCategory,
    };
  }, [visible]);

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const visibleIds = useMemo(() => new Set(visible.map((r) => r.id)), [visible]);
  const hoveredId = link.hoveredId && visibleIds.has(link.hoveredId) ? link.hoveredId : null;
  const selectedId = link.selectedId && visibleIds.has(link.selectedId) ? link.selectedId : null;

  const handleSortChange = useCallback((key: SortKey) => {
    setSort((prev) =>
<<<<<<< HEAD
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" },
=======
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" ? "asc" : "desc" },
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    );
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setCategory(ALL_CATEGORIES);
  }, []);

  return (
<<<<<<< HEAD
    <Card className="bg-white border-[#E7E5E4] shadow-xs text-[#1E293B]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-[#1E293B]">
                Distribution Network & Retailer Demand Map
              </CardTitle>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200 shadow-2xs">
                {mapTypeId === "satellite" && "🛰️ Google Satellite Mode (Default)"}
                {mapTypeId === "hybrid" && "🌐 Google Hybrid Mode"}
                {(mapTypeId === "roadmap" || mapTypeId === "map") && "🗺️ Google Road Map"}
                {mapTypeId === "terrain" && "⛰️ Google Terrain"}
              </span>
            </div>
            <CardDescription className="text-xs text-[#64748B] mt-0.5">
              {VALUE_LABEL} across Maharashtra warehouses, supply corridors, and retail stores. Default visual style configured to Google Maps Satellite imagery.
            </CardDescription>
          </div>
        </div>
        <ul className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs">
          <li className="flex items-center gap-1.5 font-medium text-[#1E293B]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB] border border-white" aria-hidden />
            <span>Warehouse Hubs (3)</span>
          </li>
          <li className="flex items-center gap-1.5 font-medium text-[#1E293B]">
            <span className="w-4 h-0.5 bg-[#38BDF8] rounded" aria-hidden />
            <span>Supply Corridors</span>
          </li>
          {categories.map((c) => (
            <li key={c} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: ranked.find((r) => r.category === c)?.color }}
                aria-hidden
              />
              {c}
            </li>
          ))}
        </ul>
      </CardHeader>

      <CardContent>
        {state.status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle />
            <AlertTitle>Couldn't load map data</AlertTitle>
            <AlertDescription>
              <p>{state.message}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={retry}>
                <RotateCw /> Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid min-w-0 gap-4 lg:h-[520px] lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-2 lg:min-h-0">
=======
    <div className="rounded-2xl border border-slate-200/90 bg-white dark:bg-slate-900 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-all space-y-5">
      {/* 1. Header Toolbar with Mode Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] dark:text-white tracking-tight flex items-center gap-2.5">
                <span>Maharashtra Distribution &amp; Demand Map</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Live Dispatch Arcs
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Geospatial demand density and outbound flow telemetry across Western Maharashtra FMCG network
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Layout & Map Style Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Split View vs Full Map Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setLayoutMode("split")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                layoutMode === "split"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Side-by-side Table and Map view"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("expanded")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                layoutMode === "expanded"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Expand map to full width for maximum geographic visibility"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Map</span>
            </button>
          </div>

          {/* Map Basemap Style Segmented Pill */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setViewMode("street")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                viewMode === "street"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Street View: Clean road network and city highway corridors"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Street</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("dark")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                viewMode === "dark"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Dark Canvas: Cyber night canvas with glowing neon flow lines"
            >
              <Moon className="w-3.5 h-3.5 text-cyan-500" />
              <span>Dark Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("terrain")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                viewMode === "terrain"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Terrain 3D: Topographic perspective showing Western Ghats elevation"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>3D Relief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive Network KPI Ribbon (Pulls stats OUT of the map canvas so map is completely viewable) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Weekly Demand</span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {formatValue(totalValue)}{" "}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">units (P50)</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Demand Covered
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Stores In Scope</span>
            <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {visible.length} / {ranked.length}{" "}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">Retailers</span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block font-medium">
            5 Maharashtra Districts
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Highest Demand Node</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate" title={summary.topStore?.name}>
            {summary.topStore?.name || "N/A"}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold mt-1 block">
            {summary.topStore ? `${formatValue(summary.topStore.value)} units · ${summary.topStore.city}` : "N/A"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Central Dispatch Hub</span>
            <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Pune Control Tower
          </div>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-bold mt-1 block">
            {visible.length} Active Flow Arcs
          </span>
        </div>
      </div>

      {/* Channel Filter Chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Filter Channel:
          </span>
          <button
            type="button"
            onClick={() => setCategory(ALL_CATEGORIES)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              category === ALL_CATEGORIES
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-xs"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All Channels ({ranked.length})
          </button>
          {categories.map((c) => {
            const count = ranked.filter((r) => r.category === c).length;
            const color = ranked.find((r) => r.category === c)?.color || "#6366f1";
            const isSelected = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span>{c}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Error Banner if API fails */}
      {state.status === "error" && (
        <Alert variant="destructive" className="rounded-xl border-destructive/20">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Couldn't load map telemetry</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <p>{state.message}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              <RotateCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 3. Main Workspace: Split View (Table + Map) OR Full Expanded Map */}
      {layoutMode === "split" ? (
        <div className="grid min-w-0 gap-5 lg:h-[640px] lg:grid-cols-5">
          {/* Left Table Panel (2 cols) */}
          <div className="min-w-0 lg:col-span-2 lg:min-h-0 flex flex-col">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            {state.status === "loading" ? (
              <RankedBarTableSkeleton />
            ) : (
              <RankedBarTable
                rows={visible}
                totalCount={ranked.length}
                maxValue={maxValue}
                totalValue={totalValue}
                formatValue={formatValue}
                valueLabel={VALUE_LABEL}
                categoryLabel={CATEGORY_LABEL}
                categories={categories}
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
                onClearFilters={clearFilters}
                sort={sort}
                onSortChange={handleSortChange}
                hoveredId={hoveredId}
                selectedId={selectedId}
                onHover={link.setHoveredId}
                onSelect={link.selectFromTable}
              />
            )}
          </div>

<<<<<<< HEAD
          {/* Map first on mobile, right column on desktop. */}
          <div className="order-first h-[320px] min-w-0 lg:order-none lg:col-span-3 lg:h-full">
            {state.status === "loading" ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <DataMap
                mapTypeId={mapTypeId}
                onMapTypeIdChange={setMapTypeId}
                defaultMapTypeId="satellite"
=======
          {/* Right Map Canvas (3 cols) - Generous, Uncluttered, Fully Viewable */}
          <div className="order-first h-[400px] min-w-0 lg:order-none lg:col-span-3 lg:h-full rounded-2xl overflow-hidden shadow-inner">
            {state.status === "loading" ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <DataMap
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                rows={visible}
                totalCount={ranked.length}
                maxValue={maxValue}
                formatValue={formatValue}
                valueLabel={VALUE_LABEL}
                hoveredId={hoveredId}
                selectedId={selectedId}
                flyRequest={link.flyRequest}
<<<<<<< HEAD
=======
                viewMode={viewMode}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                onHover={link.setHoveredId}
                onSelect={link.selectFromMap}
                onPopupClosed={link.clearIfSelected}
              />
            )}
          </div>
        </div>
<<<<<<< HEAD
      </CardContent>
    </Card>
=======
      ) : (
        /* Full Expanded Map View (100% Width Panoramic View) */
        <div className="space-y-4">
          <div className="h-[680px] w-full rounded-2xl overflow-hidden shadow-xl">
            {state.status === "loading" ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <DataMap
                rows={visible}
                totalCount={ranked.length}
                maxValue={maxValue}
                formatValue={formatValue}
                valueLabel={VALUE_LABEL}
                hoveredId={hoveredId}
                selectedId={selectedId}
                flyRequest={link.flyRequest}
                viewMode={viewMode}
                onHover={link.setHoveredId}
                onSelect={link.selectFromMap}
                onPopupClosed={link.clearIfSelected}
              />
            )}
          </div>

          {/* Collapsible compact table underneath full map */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              Retailer Demand Rankings Table ({visible.length} Stores)
            </h3>
            <RankedBarTable
              rows={visible}
              totalCount={ranked.length}
              maxValue={maxValue}
              totalValue={totalValue}
              formatValue={formatValue}
              valueLabel={VALUE_LABEL}
              categoryLabel={CATEGORY_LABEL}
              categories={categories}
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              onClearFilters={clearFilters}
              sort={sort}
              onSortChange={handleSortChange}
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={link.setHoveredId}
              onSelect={link.selectFromTable}
            />
          </div>
        </div>
      )}
    </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  );
}

export default MapSection;
