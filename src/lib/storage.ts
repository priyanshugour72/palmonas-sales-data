import type { SalesRow } from "@/types/sales";

const STORAGE_KEY = "statewise_sales_data";
const META_KEY = "statewise_sales_meta";

export interface StoredMeta {
  uploadedAt: string;
  fileName: string;
  totalRows: number;
  headers: string[];
}

export function saveSalesData(rows: SalesRow[], meta: StoredMeta): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    sessionStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch (e) {
    if (e instanceof Error && e.name === "QuotaExceededError") {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(META_KEY);
      throw new Error("Data too large for storage. Please use a smaller file or filter data.");
    }
    throw e;
  }
}

export function loadSalesData(): SalesRow[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SalesRow[];
  } catch {
    return [];
  }
}

export function loadSalesMeta(): StoredMeta | null {
  try {
    const raw = sessionStorage.getItem(META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredMeta;
  } catch {
    return null;
  }
}

export function clearSalesData(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(META_KEY);
}

export function hasStoredData(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) != null;
}
