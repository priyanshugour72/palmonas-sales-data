"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import type { AggregatedByState } from "@/types/sales";

interface TreemapChartProps {
  data: AggregatedByState[];
  limit?: number;
}

const COLORS = ["#052e16", "#14532d", "#166534", "#15803d", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

export function TreemapChart({ data, limit = 15 }: TreemapChartProps) {
  const children = data.slice(0, limit).map((d, i) => ({
    name: d.state,
    size: d.totalSales,
    fill: COLORS[i % COLORS.length],
  }));

  const formatCr = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : `${(v / 1e5).toFixed(1)} L`);

  return (
    <ResponsiveContainer width="100%" height={340}>
      <Treemap
        data={[{ name: "States", children }]}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#1e293b"
      >
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          formatter={(v) => [formatCr(Number(v) || 0), "Sales"]}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
