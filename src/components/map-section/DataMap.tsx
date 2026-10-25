<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Layers, Route as RouteIcon, MapPin } from "lucide-react";
=======
import { useEffect, useMemo, useRef } from "react";
import type { FeatureCollection, Polygon } from "geojson";
import { Compass } from "lucide-react";
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

import { cn } from "@/lib/utils";
import {
  Map,
<<<<<<< HEAD
  MapControls,
  MapMarker,
  MapRoute,
=======
  MapArc,
  MapControls,
  MapGeoJSON,
  MapMarker,
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  MarkerContent,
  MarkerPopup,
  useMap,
  useMarkerContext,
  type MapRef,
<<<<<<< HEAD
  type MapTypeId,
} from "@/components/ui/map";
import { INITIAL_ROUTES, INITIAL_WAREHOUSES } from "@/data/mockData";

import type { FlyRequest, RankedRegionStat } from "./types";

interface DataMapProps {
=======
} from "@/components/ui/map";

import type { FlyRequest, RankedRegionStat } from "./types";

const MIN_SIZE = 14;
const MAX_SIZE = 42;
const FOCUS_ZOOM = 12.5;
const INITIAL_CENTER: [number, number] = [74.65, 17.65];
const MAHARASHTRA_BOUNDS: [[number, number], [number, number]] = [
  [72.2, 15.2],
  [80.5, 22.0],
];

export const NETWORK_HUB = {
  name: "Pune Control Tower (Hub)",
  city: "Pune",
  lat: 18.5204,
  lng: 73.8567,
};

export const VIEW_MODES = {
  street: {
    label: "Street View",
    description: "Detailed road and highway basemap for local city delivery corridors.",
    styles: {
      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      dark: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    },
    pitch: 28,
    bearing: -6,
  },
  dark: {
    label: "Dark Canvas",
    description: "High-contrast dark matter canvas for neon telemetry and flow arcs.",
    styles: {
      light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    },
    pitch: 34,
    bearing: -10,
  },
  terrain: {
    label: "Terrain 3D",
    description: "3D elevation perspective for Western Ghats & Deccan plateau.",
    styles: {
      light: "https://tiles.openfreemap.org/styles/liberty",
      dark: "https://tiles.openfreemap.org/styles/liberty",
    },
    pitch: 52,
    bearing: -20,
  },
} as const;

export type ViewModeKey = keyof typeof VIEW_MODES;

const MAHARASHTRA_BELT: FeatureCollection<Polygon, { name: string }> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "maharashtra-belt",
      properties: { name: "Maharashtra retail belt" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.62, 20.88],
            [72.78, 19.52],
            [73.06, 18.55],
            [73.52, 17.18],
            [74.44, 15.86],
            [75.82, 15.68],
            [77.46, 16.22],
            [78.76, 17.82],
            [79.16, 19.68],
            [78.28, 21.38],
            [76.12, 21.9],
            [74.1, 21.56],
            [72.62, 20.88],
          ],
        ],
      },
    },
  ],
};

/** sqrt scale so marker area is proportional to demand value. */
function markerSize(value: number, maxValue: number): number {
  if (maxValue <= 0) return MIN_SIZE;
  const t = Math.sqrt(Math.max(0, value) / maxValue);
  return MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;
}

/** Converts a hex color to an rgb string for rgba glow shadows. */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export function DataMap({
  rows,
  totalCount,
  maxValue,
  formatValue,
  hoveredId,
  selectedId,
  flyRequest,
  viewMode = "street",
  onHover,
  onSelect,
  onPopupClosed,
}: {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  rows: RankedRegionStat[];
  totalCount: number;
  maxValue: number;
  formatValue: (n: number) => string;
  valueLabel: string;
  hoveredId: string | null;
  selectedId: string | null;
  flyRequest: FlyRequest | null;
<<<<<<< HEAD
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPopupClosed: (id: string) => void;
  defaultMapTypeId?: MapTypeId;
  mapTypeId?: MapTypeId;
  onMapTypeIdChange?: (mapTypeId: MapTypeId) => void;
}

const MIN_SIZE = 10;
const MAX_SIZE = 32;
const FOCUS_ZOOM = 11;
// Western Maharashtra, roughly centred on the store network.
const INITIAL_CENTER: [number, number] = [74.7, 17.5];

/** Approximate warehouse coordinates (WGS84). */
export const WAREHOUSE_COORDS: Record<string, { lat: number; lng: number }> = {
  "WH-PUN": { lat: 18.5204, lng: 73.8567 }, // Pune Central Logistics Hub
  "WH-SAT": { lat: 17.6805, lng: 74.0183 }, // Satara Regional Depot
  "WH-KOL": { lat: 16.705, lng: 74.2433 },  // Kolhapur Distribution Center
};

export const WAREHOUSE_NODES = INITIAL_WAREHOUSES.map((w) => ({
  ...w,
  lat: WAREHOUSE_COORDS[w.id]?.lat ?? 18.5,
  lng: WAREHOUSE_COORDS[w.id]?.lng ?? 73.8,
}));

/** sqrt scale so marker *area* is proportional to value. */
function markerSize(value: number, maxValue: number): number {
  if (maxValue <= 0) return MIN_SIZE;
  const t = Math.sqrt(Math.max(0, value) / maxValue);
  return MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;
}

export function DataMap({
  rows,
  totalCount,
  maxValue,
  formatValue,
  valueLabel,
  hoveredId,
  selectedId,
  flyRequest,
  onHover,
  onSelect,
  onPopupClosed,
  defaultMapTypeId = "satellite",
  mapTypeId: controlledMapTypeId,
  onMapTypeIdChange,
}: DataMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [internalMapTypeId, setInternalMapTypeId] = useState<MapTypeId>(
    controlledMapTypeId ?? defaultMapTypeId ?? "satellite",
  );
  const activeMapTypeId = controlledMapTypeId ?? internalMapTypeId ?? "satellite";

  const handleSetMapTypeId = (type: MapTypeId) => {
    setInternalMapTypeId(type);
    onMapTypeIdChange?.(type);
  };

  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  // Row click → fly to that marker.
=======
  viewMode?: ViewModeKey;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPopupClosed: (id: string) => void;
}) {
  const mapRef = useRef<MapRef>(null);
  const activeView = VIEW_MODES[viewMode] || VIEW_MODES.street;

  const totalDemand = useMemo(() => rows.reduce((sum, r) => sum + r.value, 0), [rows]);

  const flowArcs = useMemo(
    () =>
      rows.map((row) => ({
        id: row.id,
        from: [NETWORK_HUB.lng, NETWORK_HUB.lat] as [number, number],
        to: [row.lng, row.lat] as [number, number],
        flow: row.value,
        color: row.color,
        name: row.name,
        city: row.city,
      })),
    [rows],
  );

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  useEffect(() => {
    if (!flyRequest) return;
    const row = rows.find((r) => r.id === flyRequest.id);
    const map = mapRef.current;
    if (!row || !map) return;
    map.flyTo({
      center: [row.lng, row.lat],
      zoom: Math.max(map.getZoom(), FOCUS_ZOOM),
<<<<<<< HEAD
      duration: 900,
      essential: true,
    });
    // Only react to new requests, not to row changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyRequest]);

  // Build route lines from warehouses to retailers
  const routeFeatures = useMemo(() => {
    const rowMap = new globalThis.Map<string, RankedRegionStat>(rows.map((r) => [r.id, r]));
    const whMap = new globalThis.Map(WAREHOUSE_NODES.map((w) => [w.id, w]));

    return INITIAL_ROUTES.map((route, idx) => {
      const wh = whMap.get(route.warehouseId);
      const ret = rowMap.get(route.retailerId);
      if (!wh || !ret) return null;

      const isConnectedToActiveRetailer =
        ret.id === selectedId || ret.id === hoveredId;
      const isConnectedToActiveWarehouse =
        wh.id === selectedWarehouseId;
      const isActive = isConnectedToActiveRetailer || isConnectedToActiveWarehouse;

      return {
        id: `route-${route.warehouseId}-${route.retailerId}-${idx}`,
        warehouseName: wh.name,
        retailerName: ret.name,
        costPerCaseRupees: route.costPerCaseRupees,
        transitDays: route.transitDays,
        coordinates: [
          [wh.lng, wh.lat] as [number, number],
          [ret.lng, ret.lat] as [number, number],
        ],
        isActive,
      };
    }).filter((r): r is NonNullable<typeof r> => r !== null);
  }, [rows, selectedId, hoveredId, selectedWarehouseId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#E7E5E4] shadow-xs">
      {/* Google Maps Layer Switcher & Route Toggle Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md border border-[#E7E5E4] rounded-xl shadow-md text-xs font-semibold">
        <div className="flex items-center gap-0.5 px-1 text-[11px] font-bold text-[#64748B] border-r border-[#E7E5E4] pr-2 mr-0.5">
          <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Layer:</span>
        </div>

        {/* Satellite Mode (Default) */}
        <button
          type="button"
          onClick={() => handleSetMapTypeId("satellite")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
            activeMapTypeId === "satellite"
              ? "bg-[#DC2626] text-white shadow-xs"
              : "text-[#1E293B] hover:bg-[#FFF8E7]"
          )}
          title="Google Maps Satellite Mode (Default)"
        >
          <span>🛰️ Satellite</span>
        </button>

        {/* Hybrid Mode (Satellite + Labels) */}
        <button
          type="button"
          onClick={() => handleSetMapTypeId("hybrid")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
            activeMapTypeId === "hybrid"
              ? "bg-[#DC2626] text-white shadow-xs"
              : "text-[#1E293B] hover:bg-[#FFF8E7]"
          )}
          title="Google Maps Hybrid Mode (Satellite + Roads & Labels)"
        >
          <span>🌐 Hybrid</span>
        </button>

        {/* Standard Road Map */}
        <button
          type="button"
          onClick={() => handleSetMapTypeId("roadmap")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
            activeMapTypeId === "roadmap" || activeMapTypeId === "map"
              ? "bg-[#DC2626] text-white shadow-xs"
              : "text-[#1E293B] hover:bg-[#FFF8E7]"
          )}
          title="Standard Street Map"
        >
          <span>🗺️ Map</span>
        </button>

        <div className="h-4 w-px bg-[#E7E5E4] mx-1" />

        {/* Routes Toggle */}
        <button
          type="button"
          onClick={() => setShowRoutes(!showRoutes)}
          className={cn(
            "px-2 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer",
            showRoutes
              ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
              : "text-[#64748B] hover:bg-[#FFF8E7]"
          )}
          title="Toggle Distribution Corridor Routes"
        >
          <RouteIcon className="w-3.5 h-3.5" />
          <span>Routes ({routeFeatures.length})</span>
        </button>
      </div>

      {/* Main Map Component with Google Maps Satellite Mode */}
      <Map
        ref={mapRef}
        center={INITIAL_CENTER}
        zoom={6.4}
        mapTypeId={activeMapTypeId}
        defaultMapTypeId="satellite"
        attributionControl={{ compact: true }}
      >
        <MapControls position="bottom-right" showZoom showLocate />
        <FitToRows rows={rows} />

        {/* 1. Distribution Route Corridors (Warehouses -> Retailers) */}
        {showRoutes &&
          routeFeatures.map((route) => (
            <MapRoute
              key={route.id}
              id={route.id}
              coordinates={route.coordinates}
              color={
                route.isActive
                  ? "#DC2626"
                  : activeMapTypeId === "roadmap" || activeMapTypeId === "map"
                  ? "#2563EB"
                  : "#38BDF8"
              }
              width={route.isActive ? 4 : 2}
              opacity={route.isActive ? 0.95 : 0.6}
              dashArray={route.isActive ? undefined : [4, 3]}
            />
          ))}

        {/* 2. Warehouse Locations (Primary Supply Hubs) */}
        {WAREHOUSE_NODES.map((wh) => {
          const isSelected = selectedWarehouseId === wh.id;
          return (
            <MapMarker
              key={wh.id}
              longitude={wh.lng}
              latitude={wh.lat}
              onClick={() =>
                setSelectedWarehouseId((prev) => (prev === wh.id ? null : wh.id))
              }
            >
              <MarkerContent>
                <div
                  role="img"
                  aria-label={`${wh.name}: Warehouse Hub`}
                  className={cn(
                    "flex items-center justify-center rounded-lg border-2 border-white shadow-xl bg-[#2563EB] text-white p-1 transition-transform duration-150 ease-out cursor-pointer hover:scale-125",
                    isSelected && "ring-4 ring-[#DC2626] scale-125 shadow-2xl"
                  )}
                  style={{ width: 28, height: 28 }}
                  title={`${wh.name} (${wh.city})`}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </MarkerContent>
              <MarkerPopup closeButton offset={18}>
                <div className="space-y-1.5 pr-3 text-[#1E293B]">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded bg-[#2563EB] text-white">
                      <Building2 className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="leading-snug font-bold text-sm text-[#1E293B]">
                        {wh.name}
                      </p>
                      <p className="text-[10px] text-[#64748B] uppercase font-semibold">
                        Primary Warehouse • {wh.city}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#E7E5E4] space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B]">Cycle Capacity:</span>
                      <span className="font-mono font-bold text-[#1E293B]">
                        {wh.capacityCasesPerCycle.toLocaleString()} cases
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B]">Current Utilization:</span>
                      <span className="font-mono font-bold text-[#15803D]">
                        {(wh.utilizationCases ?? 0).toLocaleString()} cases (
                        {Math.round(((wh.utilizationCases ?? 0) / wh.capacityCasesPerCycle) * 100)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748B]">Depot Manager:</span>
                      <span className="font-medium text-[#1E293B]">{wh.managerName}</span>
                    </div>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}

        {/* 3. Retailer Locations (Store Management, Modern Trade, Distributors) */}
=======
      duration: 850,
      essential: true,
    });
  }, [flyRequest, rows]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ pitch: activeView.pitch, bearing: activeView.bearing, duration: 600 });
  }, [activeView]);

  const handleRecenter = () => {
    const map = mapRef.current;
    if (!map) return;
    let minLng = NETWORK_HUB.lng;
    let minLat = NETWORK_HUB.lat;
    let maxLng = NETWORK_HUB.lng;
    let maxLat = NETWORK_HUB.lat;
    for (const r of rows) {
      minLng = Math.min(minLng, r.lng);
      minLat = Math.min(minLat, r.lat);
      maxLng = Math.max(maxLng, r.lng);
      maxLat = Math.max(maxLat, r.lat);
    }
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 70, maxZoom: 9.5, duration: 750 },
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-950">
      <Map
        ref={mapRef}
        center={INITIAL_CENTER}
        zoom={7.2}
        maxBounds={MAHARASHTRA_BOUNDS}
        styles={activeView.styles}
        attributionControl={{ compact: true }}
      >
        <MapControls position="top-right" showZoom showLocate />
        <FitToRows rows={rows} />

        {/* Maharashtra Distribution Corridor Polygon */}
        <MapGeoJSON
          id="maharashtra-belt"
          data={MAHARASHTRA_BELT}
          fillPaint={{ "fill-color": "#6366f1", "fill-opacity": 0.04 }}
          linePaint={{
            "line-color": "#6366f1",
            "line-opacity": 0.25,
            "line-width": 2,
            "line-dasharray": [3, 3],
          }}
        />

        {/* Distribution Flow Arcs from Pune Hub to Retailers */}
        <MapArc
          id="distribution-flow"
          data={flowArcs}
          curvature={0.16}
          samples={60}
          interactive={false}
          paint={{
            "line-color": ["coalesce", ["get", "color"], "#6366f1"],
            "line-opacity": 0.45,
            "line-width": [
              "interpolate",
              ["linear"],
              ["get", "flow"],
              0,
              1.5,
              Math.max(maxValue, 1),
              4.5,
            ],
            "line-blur": 0.5,
          }}
          hoverPaint={{ "line-opacity": 0.9, "line-width": 5 }}
        />

        {/* Central Dispatch Hub: Pune Control Tower */}
        <MapMarker longitude={NETWORK_HUB.lng} latitude={NETWORK_HUB.lat}>
          <MarkerContent>
<<<<<<< HEAD
            <div className="relative group cursor-pointer z-30 -translate-y-8">
=======
            <div className="relative group cursor-pointer z-30">
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
              <div className="absolute -inset-2 rounded-full bg-cyan-400/25 animate-ping pointer-events-none" />
              <div className="absolute -inset-1 rounded-full bg-indigo-500/40 blur-sm pointer-events-none" />
              <div className="relative flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-slate-950 px-3 py-1 text-xs font-bold text-white shadow-2xl">
                <span className="size-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
                <span>Pune Hub (Control Tower)</span>
              </div>
            </div>
          </MarkerContent>
          <MarkerPopup closeButton offset={16}>
            <div className="w-64 p-3.5 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  HUB
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{NETWORK_HUB.name}</h4>
                  <p className="text-[11px] text-cyan-300 font-mono">18.5204° N, 73.8567° E</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Central optimization hub orchestrating stock allocations, FEFO picking, and outbound truck dispatches across Western Maharashtra.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Active Outbound:</span>
                <strong className="text-emerald-400 font-mono">{formatValue(totalDemand)} Units</strong>
              </div>
            </div>
          </MarkerPopup>
        </MapMarker>

        {/* Retailer Demand Markers */}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        {rows.map((row) => {
          const size = markerSize(row.value, maxValue);
          const isActive = row.id === hoveredId || row.id === selectedId;
          return (
            <MapMarker
              key={row.id}
              longitude={row.lng}
              latitude={row.lat}
              onMouseEnter={() => onHover(row.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(row.id)}
            >
              <MarkerContent>
                <div
                  role="img"
                  aria-label={`${row.name}: ${formatValue(row.value)}`}
                  className={cn(
<<<<<<< HEAD
                    "rounded-full border-2 border-white/95 shadow-md transition-transform duration-150 ease-out cursor-pointer",
                    isActive && "ring-[#DC2626] scale-125 ring-4 shadow-xl"
                  )}
                  style={{ width: size, height: size, backgroundColor: row.color }}
                />
              </MarkerContent>
              <MarkerPopup closeButton offset={size / 2 + 8}>
                <div className="space-y-1.5 pr-4 text-[#1E293B]">
                  <p className="leading-snug font-bold text-sm text-[#1E293B]">{row.name}</p>
                  <p className="text-[#64748B] flex items-center gap-1.5 text-xs">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: row.color }}
                      aria-hidden
                    />
                    <span className="font-semibold">{row.category}</span> · {row.city}
                  </p>
                  <div className="flex items-baseline justify-between gap-4 pt-1 border-t border-[#E7E5E4]">
                    <span className="text-base font-extrabold text-[#1E293B] tabular-nums font-mono">
                      {formatValue(row.value)}
                    </span>
                    <span className="text-[#2563EB] text-xs font-bold tabular-nums">
                      Rank #{row.rank} of {totalCount}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-[11px]">{valueLabel}</p>
=======
                    "relative rounded-full border-2 border-white shadow-xl transition-all duration-300 ease-out cursor-pointer flex items-center justify-center",
                    isActive ? "scale-125 ring-4 ring-indigo-400/80 z-30" : "hover:scale-110",
                  )}
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: row.color,
                    boxShadow: `0 0 16px ${row.color}80, 0 4px 12px rgba(0,0,0,0.5)`,
                  }}
                >
                  <div className="size-2 rounded-full bg-white shadow-sm" />
                </div>
              </MarkerContent>
              <MarkerPopup closeButton offset={size / 2 + 10}>
                <div className="w-68 p-3.5 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{row.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="font-medium text-slate-300">{row.category}</span>
                        <span>•</span>
                        <span>{row.city}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                      Rank #{row.rank}
                    </span>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Demand</span>
                      <span className="text-lg font-black text-white font-mono">{formatValue(row.value)}</span>
                      <span className="text-[10px] text-slate-500 ml-1">units (P50)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Network Share</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {totalDemand > 0 ? ((row.value / totalDemand) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                </div>
              </MarkerPopup>
              <MarkerSync
                id={row.id}
                isActive={isActive}
                isSelected={row.id === selectedId}
                onPopupClosed={onPopupClosed}
              />
            </MapMarker>
          );
        })}
      </Map>
<<<<<<< HEAD
=======

      {/* Quick Recenter Camera Button at Top-Left */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-slate-900 transition-all cursor-pointer"
        title="Reset camera zoom to fit full Western Maharashtra network"
      >
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>Fit Maharashtra</span>
      </button>

      {/* Minimal Floating Legend Capsule at Bottom-Left (Clean & Unobtrusive) */}
      <div className="absolute left-3.5 bottom-3.5 z-10 flex flex-wrap items-center gap-2.5 rounded-full border border-slate-700/70 bg-slate-950/85 px-4 py-1.5 text-xs text-white shadow-2xl backdrop-blur-md font-medium">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
<<<<<<< HEAD
          <span className="text-[11px] text-cyan-700 font-semibold">Pune Hub</span>
=======
          <span className="text-[11px] text-cyan-200 font-semibold">Pune Hub</span>
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#6366f1]" />
          <span className="text-[11px]">Modern Trade</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#f59e0b]" />
          <span className="text-[11px]">Kirana</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#10b981]" />
          <span className="text-[11px]">Distributor</span>
        </span>
      </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    </div>
  );
}

<<<<<<< HEAD
interface MarkerSyncProps {
=======
function MarkerSync({
  id,
  isActive,
  isSelected,
  onPopupClosed,
}: {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  id: string;
  isActive: boolean;
  isSelected: boolean;
  onPopupClosed: (id: string) => void;
<<<<<<< HEAD
}

/**
 * Keeps a marker's popup and stacking order in step with the shared selection
 * state. Must render after <MarkerPopup> so the popup is attached first.
 */
function MarkerSync({ id, isActive, isSelected, onPopupClosed }: MarkerSyncProps) {
=======
}) {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const { marker } = useMarkerContext();
  const onClosedRef = useRef(onPopupClosed);
  useEffect(() => {
    onClosedRef.current = onPopupClosed;
  }, [onPopupClosed]);

<<<<<<< HEAD
  // Bring hovered/selected markers above their neighbours.
  useEffect(() => {
    marker.getElement().style.zIndex = isActive ? "10" : "";
  }, [marker, isActive]);

  // Open/close the popup when selection changes from outside the map.
=======
  useEffect(() => {
    marker.getElement().style.zIndex = isActive ? "30" : "";
  }, [marker, isActive]);

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  useEffect(() => {
    const popup = marker.getPopup();
    if (!popup) return;
    if (isSelected && !popup.isOpen()) marker.togglePopup();
    else if (!isSelected && popup.isOpen()) popup.remove();
  }, [marker, isSelected]);

<<<<<<< HEAD
  // Popup closed by the user (close button / map click) → clear selection.
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  useEffect(() => {
    const popup = marker.getPopup();
    if (!popup) return;
    const handleClose = () => onClosedRef.current(id);
    popup.on("close", handleClose);
    return () => {
      popup.off("close", handleClose);
    };
  }, [marker, id]);

  return null;
}

<<<<<<< HEAD
/** Fits the camera to the visible markers and warehouses on initial load. */
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
function FitToRows({ rows }: { rows: RankedRegionStat[] }) {
  const { map, isLoaded } = useMap();
  const hasFitRef = useRef(false);
  const key = rows.map((r) => r.id).join("|");

  useEffect(() => {
    if (!map || !isLoaded || rows.length === 0) return;
    const duration = hasFitRef.current ? 700 : 0;
    hasFitRef.current = true;

<<<<<<< HEAD
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    // Include retailers
=======
    // Include NETWORK_HUB in bounding box so Pune Control Tower is never cut off
    let minLng = NETWORK_HUB.lng;
    let minLat = NETWORK_HUB.lat;
    let maxLng = NETWORK_HUB.lng;
    let maxLat = NETWORK_HUB.lat;

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    for (const r of rows) {
      minLng = Math.min(minLng, r.lng);
      minLat = Math.min(minLat, r.lat);
      maxLng = Math.max(maxLng, r.lng);
      maxLat = Math.max(maxLat, r.lat);
    }

<<<<<<< HEAD
    // Include warehouse locations
    for (const w of WAREHOUSE_NODES) {
      minLng = Math.min(minLng, w.lng);
      minLat = Math.min(minLat, w.lat);
      maxLng = Math.max(maxLng, w.lng);
      maxLat = Math.max(maxLat, w.lat);
    }

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
<<<<<<< HEAD
      { padding: 48, maxZoom: FOCUS_ZOOM, duration }
    );
    // `key` captures the visible set; `rows` identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
      { padding: { top: 60, bottom: 60, left: 60, right: 60 }, maxZoom: 9.5, duration },
    );
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  }, [map, isLoaded, key]);

  return null;
}
