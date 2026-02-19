"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { AggregatedByDistrict } from "@/types/sales";

interface DistrictBarChartProps {
  data: AggregatedByDistrict[];
  limit?: number;
}

export function DistrictBarChart({ data, limit = 12 }: DistrictBarChartProps) {
  const sliced = data.slice(0, limit).map((d) => ({
    name: d.district.length > 12 ? d.district.slice(0, 10) + "…" : d.district,
    fullName: `${d.district} (${d.state})`,
    totalSales: d.totalSales,
    netSales: d.netSales,
  }));

  const formatTick = (v: number) =>
    v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={sliced} layout="vertical" margin={{ top: 8, right: 24, left: 100, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis type="number" tickFormatter={formatTick} stroke="#64748b" fontSize={11} />
        <YAxis type="category" dataKey="name" width={98} stroke="#64748b" fontSize={10} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [(v ?? 0).toLocaleString("en-IN"), "Total Sales"]}
          labelFormatter={(_, payload) => payload[0]?.payload?.fullName ?? ""}
        />
        <Bar dataKey="totalSales" fill="#0d9488" radius={[0, 4, 4, 0]} name="Total Sales" />
      </BarChart>
    </ResponsiveContainer>
  );
}
