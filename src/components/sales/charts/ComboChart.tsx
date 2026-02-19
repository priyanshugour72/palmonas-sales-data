"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface ComboChartProps {
  data: AggregatedByState[];
  limit?: number;
}

export function ComboChart({ data, limit = 10 }: ComboChartProps) {
  const sliced = data.slice(0, limit).map((d) => ({
    name: d.state.length > 10 ? d.state.slice(0, 8) + "…" : d.state,
    totalSales: d.totalSales,
    orderCount: d.orderCount,
    avgOrderValue: d.avgOrderValue,
  }));

  const formatSales = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`);
  const formatNum = (v: number) => (v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : String(v));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={sliced} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
        <YAxis yAxisId="left" tickFormatter={formatSales} stroke="#64748b" fontSize={11} width={48} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={formatNum} stroke="#64748b" fontSize={11} width={42} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v, name) => [
            name === "Orders" ? (v ?? 0).toLocaleString() : formatSales(Number(v) || 0),
            name,
          ]}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="totalSales" fill="#22c55e" radius={[4, 4, 0, 0]} name="Total Sales (₹)" />
        <Line yAxisId="right" type="monotone" dataKey="orderCount" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Orders" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
