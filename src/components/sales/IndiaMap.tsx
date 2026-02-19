"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { AggregatedByState } from "@/types/sales";
import { normalizeStateForMap } from "@/services/sales/analyticsService";

const MAP_URL = "/india-states.json";

/**
 * Green shades by %: top (100%) = very dark green, lower % = lighter green.
 * intensity 0 = lightest green, intensity 1 = darkest green.
 */
function percentToGreenShade(intensity: number): string {
  const r = Math.round(220 - 215 * intensity);
  const g = Math.round(252 - 206 * intensity);
  const b = Math.round(231 - 209 * intensity);
  return `rgb(${r}, ${g}, ${b})`;
}

function normalizeForMatch(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

interface IndiaMapProps {
  byState: AggregatedByState[];
  onStateSelect?: (state: string) => void;
}

export function IndiaMap({ byState, onStateSelect }: IndiaMapProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [82, 22] as [number, number], zoom: 1 });
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const stateToValue = useMemo(() => {
    const map = new Map<string, AggregatedByState>();
    for (const s of byState) {
      map.set(normalizeForMatch(normalizeStateForMap(s.state)), s);
      map.set(normalizeForMatch(s.state), s);
    }
    return map;
  }, [byState]);

  const getValue = useCallback(
    (geoName: string): AggregatedByState | undefined => {
      const n = normalizeForMatch(geoName);
      return stateToValue.get(n) ?? stateToValue.get(normalizeForMatch(geoName));
    },
    [stateToValue]
  );

  const maxSales = useMemo(() => {
    if (byState.length === 0) return 1;
    return Math.max(...byState.map((s) => s.totalSales), 1);
  }, [byState]);

  const handleZoomIn = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * 1.5, 8),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / 1.5, 0.5),
    }));
  }, []);

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          State-wise sales
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="rounded bg-slate-200 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="rounded bg-slate-200 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
          >
            −
          </button>
        </div>
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [82, 22],
          scale: 600,
        }}
        className="h-[380px] w-full"
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={({
            coordinates,
            zoom,
          }: {
            coordinates: [number, number];
            zoom: number;
          }) => setPosition({ coordinates, zoom })}
        >
          <Geographies geography={MAP_URL}>
            {({
              geographies,
            }: {
              geographies: Array<{
                rsmKey: string;
                properties?: { name?: string };
                id?: string;
              }>;
            }) =>
              geographies.map((geo) => {
                const name = geo.properties?.name ?? geo.id ?? "";
                const agg = getValue(name);
                const totalSales = agg?.totalSales ?? 0;
                const intensity = maxSales > 0 ? totalSales / maxSales : 0;
                const fill =
                  agg != null
                    ? percentToGreenShade(intensity)
                    : "#334155";
                const isSelected =
                  selectedState != null &&
                  normalizeForMatch(normalizeStateForMap(selectedState)) ===
                    normalizeForMatch(name);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected ? "#f59e0b" : "#475569"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: agg != null ? percentToGreenShade(Math.min(intensity + 0.12, 1)) : "#475569" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => setTooltip(name)}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      const s = agg?.state ?? name;
                      setSelectedState(s);
                      onStateSelect?.(s);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltip && (
        <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800">
          {(() => {
            const agg = getValue(tooltip);
            if (!agg)
              return <span className="text-slate-600 dark:text-slate-300">{tooltip}</span>;
            return (
              <div className="space-y-0.5 text-slate-700 dark:text-slate-200">
                <div className="font-medium">{agg.state}</div>
                <div>Total sales: ₹{(agg.totalSales / 1e7).toFixed(2)} Cr</div>
                <div>Net sales: ₹{(agg.netSales / 1e7).toFixed(2)} Cr</div>
                <div>Orders: {agg.orderCount.toLocaleString()}</div>
              </div>
            );
          })()}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Hover for details; click to select.</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded shrink-0 bg-green-100" title="Low %" />
          <span>Low %</span>
          <span className="text-slate-400">→</span>
          <span className="inline-block h-3 w-4 rounded shrink-0 bg-green-900" title="High %" />
          <span>High %</span>
        </div>
        {selectedState && (
          <span>
            Selected: <strong className="text-slate-700 dark:text-slate-300">{selectedState}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
