"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByMetro } from "@/types/sales";

const COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"];

interface MetroPieChartProps {
  data: AggregatedByMetro[];
}

export function MetroPieChart({ data }: MetroPieChartProps) {
  const chartData = data.map((d) => ({ name: d.metro, value: d.totalSales }));
  const formatCr = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : `${(v / 1e5).toFixed(1)} L`);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={3}
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
