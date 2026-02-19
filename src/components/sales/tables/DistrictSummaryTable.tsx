"use client";

import { Table } from "antd";
import type { AggregatedByDistrict } from "@/types/sales";

const formatCr = (n: number) => `₹${(n / 1e7).toFixed(2)} Cr`;
const formatNum = (n: number) => n.toLocaleString("en-IN");

const columns = [
  { title: "District", dataIndex: "district", key: "district", ellipsis: true, width: 140 },
  { title: "State", dataIndex: "state", key: "state", ellipsis: true, width: 120 },
  { title: "Total Sales", dataIndex: "totalSales", key: "totalSales", render: (v: number) => formatCr(v), width: 110 },
  { title: "Net Sales", dataIndex: "netSales", key: "netSales", render: (v: number) => formatCr(v), width: 100 },
  { title: "Orders", dataIndex: "orderCount", key: "orderCount", render: (v: number) => formatNum(v), width: 80 },
];

interface DistrictSummaryTableProps {
  data: AggregatedByDistrict[];
  height?: number;
}

export function DistrictSummaryTable({ data, height = 380 }: DistrictSummaryTableProps) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" style={{ maxHeight: height }}>
      <Table
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} districts` }}
        size="small"
      />
    </div>
  );
}
