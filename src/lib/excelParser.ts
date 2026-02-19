import type { SalesRow } from "@/types/sales";

export interface ParseResult {
  rows: SalesRow[];
  headers: string[];
  totalRows: number;
}

/**
 * Parse Excel file (client-side). Uses first sheet.
 * Compatible with same Excel format for any number of rows.
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: true,
    defval: "",
  });

  if (jsonRows.length === 0) {
    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1");
    const headers: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c })];
      headers.push(cell?.w ?? `Column_${c}`);
    }
    return { rows: [], headers, totalRows: 0 };
  }

  const headers = Object.keys(jsonRows[0] as Record<string, unknown>);
  const rows: SalesRow[] = jsonRows.map((r) => r as unknown as SalesRow);
  return { rows, headers, totalRows: rows.length };
}
