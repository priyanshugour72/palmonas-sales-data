"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface StackedBarChartProps {
  data: AggregatedByState[];
  limit?: number;
}

export function StackedBarChart({ data, limit = 10 }: StackedBarChartProps) {
  const sliced = data.slice(0, limit).map((d) => ({
    name: d.state.length > 10 ? d.state.slice(0, 8) + "…" : d.state,
    gross: d.grossSales,
    net: d.netSales,
    discounts: Math.abs(d.discounts),
  }));

  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={sliced} margin={{ top: 12, right: 12, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
        <YAxis tickFormatter={formatTick} stroke="#64748b" fontSize={11} width={50} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [(v ?? 0).toLocaleString("en-IN")]}
        />
        <Legend />
        <Bar dataKey="gross" stackId="a" fill="#22c55e" name="Gross Sales" radius={[0, 0, 0, 0]} />
        <Bar dataKey="net" stackId="a" fill="#0ea5e9" name="Net Sales" radius={[0, 0, 0, 0]} />
        <Bar dataKey="discounts" fill="#f97316" name="Discounts (abs)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
