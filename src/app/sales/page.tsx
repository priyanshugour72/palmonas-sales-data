"use client";

import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  UploadZone,
  FiltersBar,
  SummaryCards,
  DataTable,
  IndiaMap,
  StateBarChart,
  ZonePieChart,
  TierBarChart,
  LineChartByState,
  StateDonutChart,
  ZoneDonutChart,
  MetroPieChart,
  DistrictBarChart,
  StackedBarChart,
  AreaChartByZone,
  TreemapChart,
  ComboChart,
  RadarChartZones,
  DiscountsReturnsBarChart,
  StateSummaryTable,
  ZoneSummaryTable,
  TierSummaryTable,
  DistrictSummaryTable,
} from "@/components/sales";
import { SalesProvider, useSalesContext } from "@/context/sales/SalesContext";
import { Tabs } from "antd";

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SalesDashboardContent() {
  const {
    rows,
    filteredRows,
    byState,
    byZone,
    byTier,
    byDistrict,
    byMetro,
  } = useSalesContext();

  const hasData = rows.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6">
        <header className="relative text-center">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <ThemeToggle />
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
            Upload Excel · State, Zone, Tier, District & Metro views · Maps, charts & tables
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
              defaultActiveKey="overview"
              size="middle"
              items={[
                {
                  key: "overview",
                  label: "Map & Overview",
                  children: (
                    <div className="space-y-6">
                      <ChartCard title="India — State-wise sales (%)">
                        <IndiaMap byState={byState} />
                      </ChartCard>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ChartCard title="State bar (top 15)">
                          <StateBarChart data={byState} limit={15} />
                        </ChartCard>
                        <ChartCard title="Zone pie">
                          <ZonePieChart data={byZone} />
                        </ChartCard>
                        <ChartCard title="Tier bar">
                          <TierBarChart data={byTier} />
                        </ChartCard>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "pie-donut",
                  label: "Pie & Donut",
                  children: (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      <ChartCard title="State donut (top 8)">
                        <StateDonutChart data={byState} limit={8} />
                      </ChartCard>
                      <ChartCard title="Zone donut">
                        <ZoneDonutChart data={byZone} />
                      </ChartCard>
                      <ChartCard title="Metro / Non-metro pie">
                        <MetroPieChart data={byMetro} />
                      </ChartCard>
                      <ChartCard title="Zone pie (classic)">
                        <ZonePieChart data={byZone} />
                      </ChartCard>
                    </div>
                  ),
                },
                {
                  key: "bar",
                  label: "Bar Charts",
                  children: (
                    <div className="space-y-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <ChartCard title="State bar (horizontal)">
                          <StateBarChart data={byState} limit={12} />
                        </ChartCard>
                        <ChartCard title="District bar (top 12)">
                          <DistrictBarChart data={byDistrict} limit={12} />
                        </ChartCard>
                      </div>
                      <div className="grid gap-6 lg:grid-cols-2">
                        <ChartCard title="Stacked — Gross, Net & Discounts by state">
                          <StackedBarChart data={byState} limit={10} />
                        </ChartCard>
                        <ChartCard title="Discounts & Returns by state">
                          <DiscountsReturnsBarChart data={byState} limit={10} />
                        </ChartCard>
                      </div>
                      <ChartCard title="Tier bar">
                        <TierBarChart data={byTier} />
                      </ChartCard>
                    </div>
                  ),
                },
                {
                  key: "line-area",
                  label: "Line, Area & Combo",
                  children: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <ChartCard title="State — Total vs Net sales (line)">
                        <LineChartByState data={byState} limit={12} />
                      </ChartCard>
                      <ChartCard title="Zone — Area chart">
                        <AreaChartByZone data={byZone} />
                      </ChartCard>
                      <ChartCard title="Combo — Sales (bar) & Orders (line) by state">
                        <ComboChart data={byState} limit={10} />
                      </ChartCard>
                      <ChartCard title="Zone radar — Sales & Net">
                        <RadarChartZones data={byZone} />
                      </ChartCard>
                    </div>
                  ),
                },
                {
                  key: "treemap",
                  label: "Treemap",
                  children: (
                    <div className="space-y-6">
                      <ChartCard title="State treemap (top 15 by sales)">
                        <TreemapChart data={byState} limit={15} />
                      </ChartCard>
                    </div>
                  ),
                },
                {
                  key: "tables",
                  label: "Summary Tables",
                  children: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <ChartCard title="State summary table">
                        <StateSummaryTable data={byState} height={400} />
                      </ChartCard>
                      <ChartCard title="Zone summary table">
                        <ZoneSummaryTable data={byZone} height={280} />
                      </ChartCard>
                      <ChartCard title="Tier summary table">
                        <TierSummaryTable data={byTier} height={240} />
                      </ChartCard>
                      <ChartCard title="District summary table">
                        <DistrictSummaryTable data={byDistrict} height={400} />
                      </ChartCard>
                    </div>
                  ),
                },
                {
                  key: "raw",
                  label: "Raw Data",
                  children: (
                    <div>
                      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                        Showing {filteredRows.length.toLocaleString()} rows (paginated). Same Excel
                        format works for 10K–1L+ rows.
                      </p>
                      <DataTable rows={filteredRows} height={580} />
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
