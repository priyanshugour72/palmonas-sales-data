"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface DiscountsReturnsBarChartProps {
  data: AggregatedByState[];
  limit?: number;
}

export function DiscountsReturnsBarChart({ data, limit = 10 }: DiscountsReturnsBarChartProps) {
  const sliced = data.slice(0, limit).map((d) => ({
    name: d.state.length > 10 ? d.state.slice(0, 8) + "…" : d.state,
    discounts: Math.abs(d.discounts),
    returns: Math.abs(d.returns),
  }));

  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sliced} margin={{ top: 12, right: 12, left: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
        <YAxis tickFormatter={formatTick} stroke="#64748b" fontSize={11} width={48} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [(v ?? 0).toLocaleString("en-IN")]}
        />
        <Legend />
        <Bar dataKey="discounts" fill="#f97316" radius={[4, 4, 0, 0]} name="Discounts (abs)" />
        <Bar dataKey="returns" fill="#ef4444" radius={[4, 4, 0, 0]} name="Returns (abs)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
