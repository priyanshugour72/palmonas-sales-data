"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { AggregatedByZone } from "@/types/sales";

const ZONE_COLORS = ["#14532d", "#22c55e", "#4ade80", "#86efac", "#0ea5e9"];

interface AreaChartByZoneProps {
  data: AggregatedByZone[];
}

export function AreaChartByZone({ data }: AreaChartByZoneProps) {
  const chartData = data.map((d, i) => ({
    zone: d.zone,
    sales: d.totalSales,
    net: d.netSales,
    fill: ZONE_COLORS[i % ZONE_COLORS.length],
  }));

  const formatCr = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : `${(v / 1e5).toFixed(1)} L`);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="zone" stroke="#64748b" fontSize={11} tickLine={false} />
        <YAxis
          tickFormatter={(v) => (v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`)}
          stroke="#64748b"
          fontSize={11}
          width={50}
        />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [formatCr(Number(v) || 0)]}
        />
        <Legend />
        <Area type="monotone" dataKey="sales" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} name="Total Sales" />
        <Area type="monotone" dataKey="net" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} name="Net Sales" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
