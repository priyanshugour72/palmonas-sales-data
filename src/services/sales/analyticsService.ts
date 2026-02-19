import type {
  SalesRow,
  AggregatedByState,
  AggregatedByZone,
  AggregatedByTier,
  AggregatedByDistrict,
  AggregatedByMetro,
  ChartFilterState,
} from "@/types/sales";

function num(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}

function getStateName(row: SalesRow): string {
  return String(row.State ?? row.District ?? "Unknown").trim().toUpperCase();
}

/**
 * Normalize state name for map matching (e.g. "UTTAR PRADESH" -> "Uttar Pradesh" or keep as-is for GeoJSON).
 */
export function normalizeStateForMap(state: string): string {
  return state
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function aggregateByState(
  rows: SalesRow[],
  filter?: ChartFilterState
): AggregatedByState[] {
  const filtered = filterRows(rows, filter);
  const map = new Map<string, AggregatedByState>();

  for (const row of filtered) {
    const state = getStateName(row);
    const existing = map.get(state);
    const net = num(row["Net sales"]);
    const gross = num(row["Gross sales"]);
    const disc = num(row.Discounts);
    const ret = num(row.Returns);
    const total = num(row["Total sales"]);
    const qtyOrd = num(row["Quantity ordered"]);
    const qtyRet = num(row["Quantity returned"]);
    const aov = num(row["Average order value"]);

    if (existing) {
      existing.totalSales += total;
      existing.netSales += net;
      existing.grossSales += gross;
      existing.discounts += disc;
      existing.returns += ret;
      existing.quantityOrdered += qtyOrd;
      existing.quantityReturned += qtyRet;
      existing.orderCount += 1;
      existing.avgOrderValue =
        (existing.avgOrderValue * (existing.orderCount - 1) + aov) /
        existing.orderCount;
    } else {
      map.set(state, {
        state,
        totalSales: total,
        netSales: net,
        grossSales: gross,
        discounts: disc,
        returns: ret,
        quantityOrdered: qtyOrd,
        quantityReturned: qtyRet,
        orderCount: 1,
        avgOrderValue: aov,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function aggregateByZone(
  rows: SalesRow[],
  filter?: ChartFilterState
): AggregatedByZone[] {
  const filtered = filterRows(rows, filter);
  const map = new Map<string, AggregatedByZone>();

  for (const row of filtered) {
    const zone = String(row.Zone ?? "Unknown").trim();
    const existing = map.get(zone);
    const total = num(row["Total sales"]);
    const net = num(row["Net sales"]);

    if (existing) {
      existing.totalSales += total;
      existing.netSales += net;
      existing.orderCount += 1;
    } else {
      map.set(zone, {
        zone,
        totalSales: total,
        netSales: net,
        orderCount: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function aggregateByTier(
  rows: SalesRow[],
  filter?: ChartFilterState
): AggregatedByTier[] {
  const filtered = filterRows(rows, filter);
  const map = new Map<string, AggregatedByTier>();

  for (const row of filtered) {
    const tier = String(row.Tier ?? "Unknown").trim();
    const existing = map.get(tier);
    const total = num(row["Total sales"]);
    const net = num(row["Net sales"]);

    if (existing) {
      existing.totalSales += total;
      existing.netSales += net;
      existing.orderCount += 1;
    } else {
      map.set(tier, {
        tier,
        totalSales: total,
        netSales: net,
        orderCount: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function aggregateByDistrict(
  rows: SalesRow[],
  filter?: ChartFilterState
): AggregatedByDistrict[] {
  const filtered = filterRows(rows, filter);
  const map = new Map<string, AggregatedByDistrict>();

  for (const row of filtered) {
    const district = String(row.District ?? "Unknown").trim();
    const state = getStateName(row);
    const key = `${state}|${district}`;
    const existing = map.get(key);
    const total = num(row["Total sales"]);
    const net = num(row["Net sales"]);

    if (existing) {
      existing.totalSales += total;
      existing.netSales += net;
      existing.orderCount += 1;
    } else {
      map.set(key, {
        district,
        state,
        totalSales: total,
        netSales: net,
        orderCount: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function aggregateByMetro(
  rows: SalesRow[],
  filter?: ChartFilterState
): AggregatedByMetro[] {
  const filtered = filterRows(rows, filter);
  const map = new Map<string, AggregatedByMetro>();

  for (const row of filtered) {
    const metro = String(row["Metro/Non-metro"] ?? "Unknown").trim();
    const existing = map.get(metro);
    const total = num(row["Total sales"]);
    const net = num(row["Net sales"]);

    if (existing) {
      existing.totalSales += total;
      existing.netSales += net;
      existing.orderCount += 1;
    } else {
      map.set(metro, {
        metro,
        totalSales: total,
        netSales: net,
        orderCount: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
}

export function filterRows(
  rows: SalesRow[],
  filter?: ChartFilterState | null
): SalesRow[] {
  if (!filter) return rows;

  return rows.filter((row) => {
    if (
      filter.states.length &&
      !filter.states.includes(getStateName(row))
    )
      return false;
    if (
      filter.zones.length &&
      !filter.zones.includes(String(row.Zone ?? "").trim())
    )
      return false;
    if (
      filter.tiers.length &&
      !filter.tiers.includes(String(row.Tier ?? "").trim())
    )
      return false;
    if (
      filter.metroFilter != null &&
      filter.metroFilter !== "" &&
      String(row["Metro/Non-metro"] ?? "").trim() !== filter.metroFilter
    )
      return false;
    return true;
  });
}

export function getUniqueValues(
  rows: SalesRow[],
  field: "State" | "Zone" | "Tier" | "Metro/Non-metro"
): string[] {
  const key =
    field === "Metro/Non-metro" ? "Metro/Non-metro" : field;
  const set = new Set<string>();
  for (const row of rows) {
    const v = row[key];
    if (v != null && String(v).trim()) set.add(String(v).trim());
  }
  return Array.from(set).sort();
}
