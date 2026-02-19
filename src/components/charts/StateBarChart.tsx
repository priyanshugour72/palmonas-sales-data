"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface StateBarChartProps {
  data: AggregatedByState[];
  metric?: "totalSales" | "netSales" | "grossSales" | "quantityOrdered";
  limit?: number;
}

const metricLabel: Record<string, string> = {
  totalSales: "Total Sales",
  netSales: "Net Sales",
  grossSales: "Gross Sales",
  quantityOrdered: "Quantity Ordered",
};

export function StateBarChart({
  data,
  metric = "totalSales",
  limit = 15,
}: StateBarChartProps) {
  const sliced = data.slice(0, limit).map((d) => ({
    name: d.state.length > 12 ? d.state.slice(0, 11) + "…" : d.state,
    fullName: d.state,
    value: d[metric],
    totalSales: d.totalSales,
    netSales: d.netSales,
  }));

  const formatTick = (v: number) =>
    metric === "quantityOrdered"
      ? v >= 1e6
        ? `${(v / 1e6).toFixed(1)}M`
        : v >= 1e3
          ? `${(v / 1e3).toFixed(0)}k`
          : String(v)
      : v >= 1e7
        ? `${(v / 1e7).toFixed(1)}Cr`
        : v >= 1e5
          ? `${(v / 1e5).toFixed(1)}L`
          : v >= 1e3
            ? `${(v / 1e3).toFixed(0)}k`
            : String(v);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={sliced}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 80, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis
          type="number"
          tickFormatter={formatTick}
          stroke="#64748b"
          fontSize={11}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={78}
          stroke="#64748b"
          fontSize={11}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#e2e8f0" }}
          formatter={(value) => [
            (value ?? 0).toLocaleString("en-IN"),
            metricLabel[metric] ?? metric,
          ]}
          labelFormatter={(_, payload) =>
            payload[0]?.payload?.fullName ?? ""
          }
        />
        <Bar
          dataKey="value"
          fill="#6366f1"
          radius={[0, 4, 4, 0]}
          name={metricLabel[metric]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
