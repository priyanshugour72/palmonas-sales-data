"use client";

import { Segmented } from "antd";
import { BarChartOutlined, PieChartOutlined, LineChartOutlined } from "@ant-design/icons";

export type ChartType = "state-bar" | "zone-pie" | "tier-bar" | "state-line";

interface ChartSelectorProps {
  value: ChartType;
  onChange: (t: ChartType) => void;
}

const options: { label: React.ReactNode; value: ChartType }[] = [
  { label: <span><BarChartOutlined /> State (Bar)</span>, value: "state-bar" },
  { label: <span><PieChartOutlined /> Zone (Pie)</span>, value: "zone-pie" },
  { label: <span><BarChartOutlined /> Tier (Bar)</span>, value: "tier-bar" },
  { label: <span><LineChartOutlined /> State (Line)</span>, value: "state-line" },
];

export function ChartSelector({ value, onChange }: ChartSelectorProps) {
  return (
    <Segmented
      options={options}
      value={value}
      onChange={(v) => onChange(v as ChartType)}
      className="bg-slate-100 dark:bg-slate-800"
    />
  );
}
