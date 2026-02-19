"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByZone } from "@/types/sales";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
];

interface ZonePieChartProps {
  data: AggregatedByZone[];
}

export function ZonePieChart({ data }: ZonePieChartProps) {
  const chartData = data.map((d) => ({
    name: d.zone,
    value: d.totalSales,
  }));

  const formatValue = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : `${(v / 1e5).toFixed(1)} L`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1e293b" strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          formatter={(value) => [formatValue(Number(value) || 0), "Total Sales"]}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value, entry) => (
            <span className="text-slate-300 text-xs">
              {value}: {formatValue((entry.payload as { value?: number }).value ?? 0)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
