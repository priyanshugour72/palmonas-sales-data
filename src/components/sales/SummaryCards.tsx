"use client";

import { useMemo } from "react";
import { useSalesContext } from "@/hooks/sales/useSalesContext";

function formatCr(n: number): string {
  return `₹${(n / 1e7).toFixed(2)} Cr`;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-IN");
}

export function SummaryCards() {
  const { filteredRows, byState } = useSalesContext();

  const { totalSales, netSales, grossSales, totalOrders, avgDiscount } = useMemo(() => {
    let total = 0;
    let net = 0;
    let gross = 0;
    let orders = 0;
    let discountSum = 0;
    let discountCount = 0;
    for (const row of filteredRows) {
      const t = Number(row["Total sales"]) || 0;
      const n = Number(row["Net sales"]) || 0;
      const g = Number(row["Gross sales"]) || 0;
      total += t;
      net += n;
      gross += g;
      orders += 1;
      const d = Number(row.Discounts) || 0;
      if (d !== 0) {
        discountSum += Math.abs(d);
        discountCount += 1;
      }
    }
    return {
      totalSales: total,
      netSales: net,
      grossSales: gross,
      totalOrders: orders,
      avgDiscount: discountCount > 0 ? discountSum / discountCount : 0,
    };
  }, [filteredRows]);

  const topState = byState[0];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Total Sales
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {formatCr(totalSales)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Net Sales
        </p>
        <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCr(netSales)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Orders
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {formatNum(totalOrders)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Avg Discount
        </p>
        <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">
          {formatCr(avgDiscount)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Top State
        </p>
        <p className="mt-1 truncate text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {topState ? `${topState.state} (${formatCr(topState.totalSales)})` : "—"}
        </p>
      </div>
    </div>
  );
}
