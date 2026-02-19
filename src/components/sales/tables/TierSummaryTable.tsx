"use client";

import { Table } from "antd";
import type { AggregatedByTier } from "@/types/sales";

const formatCr = (n: number) => `₹${(n / 1e7).toFixed(2)} Cr`;
const formatNum = (n: number) => n.toLocaleString("en-IN");

const columns = [
  { title: "Tier", dataIndex: "tier", key: "tier", width: 100 },
  { title: "Total Sales", dataIndex: "totalSales", key: "totalSales", render: (v: number) => formatCr(v), width: 120 },
  { title: "Net Sales", dataIndex: "netSales", key: "netSales", render: (v: number) => formatCr(v), width: 110 },
  { title: "Orders", dataIndex: "orderCount", key: "orderCount", render: (v: number) => formatNum(v), width: 90 },
];

interface TierSummaryTableProps {
  data: AggregatedByTier[];
  height?: number;
}

export function TierSummaryTable({ data, height = 240 }: TierSummaryTableProps) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" style={{ maxHeight: height }}>
      <Table
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        columns={columns}
        pagination={false}
        size="small"
      />
    </div>
  );
}
