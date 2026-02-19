"use client";

import { Select, Tag } from "antd";
import { useSalesContext } from "@/context/SalesContext";

export function FiltersBar() {
  const {
    filter,
    setFilter,
    uniqueStates,
    uniqueZones,
    uniqueTiers,
    uniqueMetro,
  } = useSalesContext();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Filters:
      </span>
      <Select
        mode="multiple"
        placeholder="State"
        allowClear
        className="min-w-[180px]"
        value={filter.states}
        onChange={(states) => setFilter((p) => ({ ...p, states }))}
        options={uniqueStates.map((s) => ({ label: s, value: s }))}
        maxTagCount="responsive"
      />
      <Select
        mode="multiple"
        placeholder="Zone"
        allowClear
        className="min-w-[140px]"
        value={filter.zones}
        onChange={(zones) => setFilter((p) => ({ ...p, zones }))}
        options={uniqueZones.map((z) => ({ label: z, value: z }))}
        maxTagCount="responsive"
      />
      <Select
        mode="multiple"
        placeholder="Tier"
        allowClear
        className="min-w-[120px]"
        value={filter.tiers}
        onChange={(tiers) => setFilter((p) => ({ ...p, tiers }))}
        options={uniqueTiers.map((t) => ({ label: t, value: t }))}
        maxTagCount="responsive"
      />
      <Select
        placeholder="Metro / Non-metro"
        allowClear
        className="min-w-[160px]"
        value={filter.metroFilter ?? undefined}
        onChange={(v) => setFilter((p) => ({ ...p, metroFilter: v ?? null }))}
        options={uniqueMetro.map((m) => ({ label: m, value: m }))}
      />
      {(filter.states.length > 0 ||
        filter.zones.length > 0 ||
        filter.tiers.length > 0 ||
        filter.metroFilter) && (
        <Tag
          color="blue"
          className="cursor-pointer"
          onClick={() =>
            setFilter({
              states: [],
              zones: [],
              tiers: [],
              metroFilter: null,
            })
          }
        >
          Clear all
        </Tag>
      )}
    </div>
  );
}
