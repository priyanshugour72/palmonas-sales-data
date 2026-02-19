"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { SalesRow, ChartFilterState } from "@/types/sales";
import type { StoredMeta } from "@/lib/storage";
import {
  loadSalesData,
  loadSalesMeta,
  saveSalesData,
  clearSalesData as clearStorage,
} from "@/lib/storage";
import {
  aggregateByState,
  aggregateByZone,
  aggregateByTier,
  filterRows,
  getUniqueValues,
} from "@/services/analyticsService";

export interface SalesContextValue {
  rows: SalesRow[];
  meta: StoredMeta | null;
  filter: ChartFilterState;
  setRows: (rows: SalesRow[], meta: StoredMeta) => void;
  setFilter: (next: ChartFilterState | ((prev: ChartFilterState) => ChartFilterState)) => void;
  clearData: () => void;
  filteredRows: SalesRow[];
  byState: ReturnType<typeof aggregateByState>;
  byZone: ReturnType<typeof aggregateByZone>;
  byTier: ReturnType<typeof aggregateByTier>;
  uniqueStates: string[];
  uniqueZones: string[];
  uniqueTiers: string[];
  uniqueMetro: string[];
}

const defaultFilter: ChartFilterState = {
  states: [],
  zones: [],
  tiers: [],
  metroFilter: null,
};

const SalesContext = createContext<SalesContextValue | null>(null);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRowsState] = useState<SalesRow[]>(() => loadSalesData());
  const [meta, setMeta] = useState<StoredMeta | null>(() => loadSalesMeta());
  const [filter, setFilterState] = useState<ChartFilterState>(defaultFilter);

  const setRows = useCallback((newRows: SalesRow[], newMeta: StoredMeta) => {
    setRowsState(newRows);
    setMeta(newMeta);
    saveSalesData(newRows, newMeta);
  }, []);

  const setFilter = useCallback(
    (next: ChartFilterState | ((prev: ChartFilterState) => ChartFilterState)) => {
      setFilterState((prev) => (typeof next === "function" ? next(prev) : next));
    },
    []
  );

  const clearData = useCallback(() => {
    setRowsState([]);
    setMeta(null);
    setFilterState(defaultFilter);
    clearStorage();
  }, []);

  const filteredRows = useMemo(
    () => filterRows(rows, filter),
    [rows, filter]
  );

  const byState = useMemo(
    () => aggregateByState(rows, filter),
    [rows, filter]
  );
  const byZone = useMemo(
    () => aggregateByZone(rows, filter),
    [rows, filter]
  );
  const byTier = useMemo(
    () => aggregateByTier(rows, filter),
    [rows, filter]
  );

  const uniqueStates = useMemo(() => getUniqueValues(rows, "State"), [rows]);
  const uniqueZones = useMemo(() => getUniqueValues(rows, "Zone"), [rows]);
  const uniqueTiers = useMemo(() => getUniqueValues(rows, "Tier"), [rows]);
  const uniqueMetro = useMemo(
    () => getUniqueValues(rows, "Metro/Non-metro"),
    [rows]
  );

  const value = useMemo<SalesContextValue>(
    () => ({
      rows,
      meta,
      filter,
      setRows,
      setFilter,
      clearData,
      filteredRows,
      byState,
      byZone,
      byTier,
      uniqueStates,
      uniqueZones,
      uniqueTiers,
      uniqueMetro,
    }),
    [
      rows,
      meta,
      filter,
      setRows,
      setFilter,
      clearData,
      filteredRows,
      byState,
      byZone,
      byTier,
      uniqueStates,
      uniqueZones,
      uniqueTiers,
      uniqueMetro,
    ]
  );

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSalesContext(): SalesContextValue {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error("useSalesContext must be used within SalesProvider");
  return ctx;
}
