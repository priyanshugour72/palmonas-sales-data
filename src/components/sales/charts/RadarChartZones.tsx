"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { AggregatedByZone } from "@/types/sales";

interface RadarChartZonesProps {
  data: AggregatedByZone[];
}

export function RadarChartZones({ data }: RadarChartZonesProps) {
  const chartData = data.map((d) => ({
    zone: d.zone,
    sales: d.totalSales,
    net: d.netSales,
    orders: d.orderCount,
    full: d.totalSales,
  }));

  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : String(v);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="zone" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <PolarRadiusAxis angle={90} tick={{ fill: "#64748b" }} tickFormatter={formatTick} />
        <Radar name="Total Sales" dataKey="sales" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} strokeWidth={2} />
        <Radar name="Net Sales" dataKey="net" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} strokeWidth={2} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [formatTick(Number(v) || 0)]}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
