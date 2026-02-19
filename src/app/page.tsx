"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { FiltersBar } from "@/components/FiltersBar";
import { SummaryCards } from "@/components/SummaryCards";
import { ChartSelector, type ChartType } from "@/components/ChartSelector";
import { StateBarChart } from "@/components/charts/StateBarChart";
import { ZonePieChart } from "@/components/charts/ZonePieChart";
import { TierBarChart } from "@/components/charts/TierBarChart";
import { LineChartByState } from "@/components/charts/LineChartByState";
import { IndiaMap } from "@/components/IndiaMap";
import { DataTable } from "@/components/DataTable";
import { SalesProvider, useSalesContext } from "@/context/SalesContext";
import { Tabs } from "antd";

function DashboardContent() {
  const { rows, filteredRows, byState, byZone, byTier } = useSalesContext();
  const [chartType, setChartType] = useState<ChartType>("state-bar");

  const hasData = rows.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            State-wise Sales Analytics
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Upload your Excel and explore charts, maps and filters
          </p>
        </header>

        <UploadZone />

        {!hasData && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-600 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              Upload an Excel file with columns: State, District, Zone, Metro/Non-metro, Tier,
              Gross sales, Discounts, Returns, Net sales, Total sales, Quantity ordered, etc.
            </p>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              Data is stored in browser session. Same format supports 10K–1L+ rows.
            </p>
          </div>
        )}

        {hasData && (
          <>
            <FiltersBar />
            <SummaryCards />

            <Tabs
              defaultActiveKey="charts"
              items={[
                {
                  key: "charts",
                  label: "Charts & Map",
                  children: (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Analytics
                          </h2>
                          <ChartSelector value={chartType} onChange={setChartType} />
                        </div>
                        <div className="min-h-[320px]">
                          {chartType === "state-bar" && (
                            <StateBarChart data={byState} limit={15} />
                          )}
                          {chartType === "zone-pie" && <ZonePieChart data={byZone} />}
                          {chartType === "tier-bar" && <TierBarChart data={byTier} />}
                          {chartType === "state-line" && (
                            <LineChartByState data={byState} limit={12} />
                          )}
                        </div>
                      </div>

                      <IndiaMap byState={byState} />
                    </div>
                  ),
                },
                {
                  key: "table",
                  label: "Data Table",
                  children: (
                    <div>
                      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                        Showing {filteredRows.length.toLocaleString()} rows (paginated). Same Excel
                        format works for 10K–1L+ rows.
                      </p>
                      <DataTable rows={filteredRows} height={520} />
                    </div>
                  ),
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SalesProvider>
      <DashboardContent />
    </SalesProvider>
  );
}
