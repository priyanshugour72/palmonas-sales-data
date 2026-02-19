"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByState } from "@/types/sales";

const COLORS = ["#052e16", "#14532d", "#166534", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

interface StateDonutChartProps {
  data: AggregatedByState[];
  limit?: number;
}

export function StateDonutChart({ data, limit = 8 }: StateDonutChartProps) {
  const chartData = data.slice(0, limit).map((d) => ({
    name: d.state.length > 14 ? d.state.slice(0, 12) + "…" : d.state,
    value: d.totalSales,
  }));

  const formatCr = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : `${(v / 1e5).toFixed(1)} L`);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1e293b" strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [formatCr(Number(v) || 0), "Sales"]}
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
