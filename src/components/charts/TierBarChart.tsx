"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AggregatedByTier } from "@/types/sales";

interface TierBarChartProps {
  data: AggregatedByTier[];
}

export function TierBarChart({ data }: TierBarChartProps) {
  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 12, right: 12, left: 12, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="tier" stroke="#64748b" fontSize={12} tickLine={false} />
        <YAxis
          tickFormatter={formatTick}
          stroke="#64748b"
          fontSize={11}
          width={50}
        />
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          formatter={(value) => [(value ?? 0).toLocaleString("en-IN"), "Total Sales"]}
        />
        <Bar dataKey="totalSales" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total Sales" />
      </BarChart>
    </ResponsiveContainer>
  );
}
