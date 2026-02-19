"use client";

import { Table } from "antd";
import type { AggregatedByState } from "@/types/sales";

const formatCr = (n: number) => `₹${(n / 1e7).toFixed(2)} Cr`;
const formatNum = (n: number) => n.toLocaleString("en-IN");

const columns = [
  { title: "State", dataIndex: "state", key: "state", ellipsis: true, width: 160 },
  { title: "Total Sales", dataIndex: "totalSales", key: "totalSales", render: (v: number) => formatCr(v), width: 120 },
  { title: "Net Sales", dataIndex: "netSales", key: "netSales", render: (v: number) => formatCr(v), width: 110 },
  { title: "Gross Sales", dataIndex: "grossSales", key: "grossSales", render: (v: number) => formatCr(v), width: 110 },
  { title: "Orders", dataIndex: "orderCount", key: "orderCount", render: (v: number) => formatNum(v), width: 90 },
  { title: "Avg Order (₹)", dataIndex: "avgOrderValue", key: "avgOrderValue", render: (v: number) => formatNum(Math.round(v)), width: 110 },
];

interface StateSummaryTableProps {
  data: AggregatedByState[];
  height?: number;
}

export function StateSummaryTable({ data, height = 360 }: StateSummaryTableProps) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" style={{ maxHeight: height }}>
      <Table
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        columns={columns}
        pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Total ${t} states` }}
        size="small"
      />
    </div>
  );
}
