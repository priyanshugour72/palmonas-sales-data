"use client";

import { useMemo } from "react";
import { Table } from "antd";
import type { SalesRow } from "@/types/sales";

const COLUMNS: { key: keyof SalesRow | string; title: string; width?: number; render?: (v: unknown, r: SalesRow) => React.ReactNode }[] = [
  { key: "Shipping postal code", title: "Postal Code", width: 120 },
  { key: "State", title: "State", width: 140 },
  { key: "District", title: "District", width: 140 },
  { key: "Zone", title: "Zone", width: 100 },
  { key: "Metro/Non-metro", title: "Metro", width: 100 },
  { key: "Tier", title: "Tier", width: 90 },
  { key: "Gross sales", title: "Gross Sales", width: 120, render: (v) => formatNum(v) },
  { key: "Discounts", title: "Discounts", width: 110, render: (v) => formatNum(v) },
  { key: "Net sales", title: "Net Sales", width: 110, render: (v) => formatNum(v) },
  { key: "Total sales", title: "Total Sales", width: 110, render: (v) => formatNum(v) },
  { key: "Quantity ordered", title: "Qty Ordered", width: 110, render: (v) => formatNum(v) },
  { key: "Average order value", title: "AOV", width: 100, render: (v) => formatNum(v) },
];

function formatNum(v: unknown): string {
  if (typeof v !== "number") return String(v ?? "");
  return v.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

interface DataTableProps {
  rows: SalesRow[];
  height?: number;
}

export function DataTable({ rows, height = 400 }: DataTableProps) {
  const columns = useMemo(
    () =>
      COLUMNS.map((col) => ({
        ...col,
        dataIndex: col.key,
        ellipsis: true,
        render: col.render
          ? (v: unknown, r: SalesRow) => col.render!(v, r)
          : (v: unknown) => (v != null ? String(v) : ""),
      })),
    []
  );

  if (rows.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
        style={{ height }}
      >
        <p className="text-slate-500 dark:text-slate-400">No data to show</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <Table
          dataSource={rows.map((r, i) => ({ ...r, key: i }))}
          columns={columns}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total.toLocaleString()} rows`,
            pageSizeOptions: ["20", "50", "100", "200", "500"],
          }}
          scroll={{ x: "max-content", y: height - 60 }}
          size="small"
        />
      </div>
    </div>
  );
}
