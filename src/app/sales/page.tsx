"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  UploadZone,
  FiltersBar,
  SummaryCards,
  ChartSelector,
  DataTable,
  IndiaMap,
  StateBarChart,
  ZonePieChart,
  TierBarChart,
  LineChartByState,
  type ChartType,
} from "@/components/sales";
import { SalesProvider, useSalesContext } from "@/context/sales/SalesContext";
import { Tabs } from "antd";

function SalesDashboardContent() {
  const { rows, filteredRows, byState, byZone, byTier } = useSalesContext();
  const [chartType, setChartType] = useState<ChartType>("state-bar");

  const hasData = rows.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
        <header className="relative text-center">
          <div className="absolute right-0 top-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="rounded-lg bg-slate-200 py-1.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
            >
              Sign out
            </button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sales Analytics
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Upload your Excel and explore state-wise charts, maps and filters
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

export default function SalesPage() {
  return (
    <SalesProvider>
      <SalesDashboardContent />
    </SalesProvider>
  );
}
