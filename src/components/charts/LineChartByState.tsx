"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface LineChartByStateProps {
  data: AggregatedByState[];
  limit?: number;
}

export function LineChartByState({ data, limit = 10 }: LineChartByStateProps) {
  const sliced = data.slice(0, limit);

  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sliced} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis
          dataKey="state"
          stroke="#64748b"
          fontSize={10}
          tickFormatter={(v) => (v.length > 10 ? v.slice(0, 8) + "…" : v)}
        />
        <YAxis tickFormatter={formatTick} stroke="#64748b" fontSize={11} width={50} />
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          formatter={(value) => [(value ?? 0).toLocaleString("en-IN"), "Total Sales"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1", r: 4 }}
          name="Total Sales"
        />
        <Line
          type="monotone"
          dataKey="netSales"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: "#22c55e", r: 4 }}
          name="Net Sales"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
