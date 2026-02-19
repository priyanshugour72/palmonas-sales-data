/**
 * Sales row type aligned with Excel columns.
 * Extra columns in future (10k–1L rows) are allowed via index signature.
 */
export interface SalesRow {
  "Shipping postal code"?: number;
  State?: string;
  District?: string;
  Zone?: string;
  "Metro/Non-metro"?: string;
  Tier?: string;
  "Gross sales"?: number;
  Discounts?: number;
  Returns?: number;
  "Net sales"?: number;
  "Shipping charges"?: number;
  "Return fees"?: number;
  Taxes?: number;
  "Total sales"?: number;
  "Quantity ordered"?: number;
  "Average order value"?: number;
  "Quantity returned"?: number;
  [key: string]: string | number | undefined;
}

export type NumericField =
  | "Gross sales"
  | "Discounts"
  | "Returns"
  | "Net sales"
  | "Shipping charges"
  | "Return fees"
  | "Taxes"
  | "Total sales"
  | "Quantity ordered"
  | "Average order value"
  | "Quantity returned";

export type CategoryField =
  | "State"
  | "District"
  | "Zone"
  | "Metro/Non-metro"
  | "Tier";

export interface AggregatedByState {
  state: string;
  totalSales: number;
  netSales: number;
  grossSales: number;
  discounts: number;
  returns: number;
  quantityOrdered: number;
  quantityReturned: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface AggregatedByZone {
  zone: string;
  totalSales: number;
  netSales: number;
  orderCount: number;
}

export interface AggregatedByTier {
  tier: string;
  totalSales: number;
  netSales: number;
  orderCount: number;
}

export interface ChartFilterState {
  states: string[];
  zones: string[];
  tiers: string[];
  metroFilter: string | null;
}
