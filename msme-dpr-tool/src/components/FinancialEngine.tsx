"use client";

import { useMemo, useState } from "react";
import {
  cashflowTimeline,
  sectorBenchmarks,
  sensitivityMatrix,
} from "@/data/datasets";

const gradientStops = [
  { offset: "0%", color: "var(--brand-secondary)" },
  { offset: "100%", color: "var(--brand-primary)" },
];

function LineChart() {
  const width = 540;
  const height = 220;
  const padding = 40;

  const revenues = cashflowTimeline.map((item) => item.revenue);
  const expenses = cashflowTimeline.map((item) => item.expense);
  const capitals = cashflowTimeline.map((item) => item.capital);
  const maxValue = Math.max(...revenues, ...expenses, ...capitals) * 1.1;

  const scaleX = (index: number) =>
    padding + (index / (cashflowTimeline.length - 1)) * (width - padding * 2);
  const scaleY = (value: number) =>
    height - padding - (value / maxValue) * (height - padding * 1.6);

  const buildPath = (values: number[]) =>
    values
      .map(
        (value, index) =>
          `${index === 0 ? "M" : "L"} ${scaleX(index)} ${scaleY(value)}`,
      )
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-56 w-full"
      role="img"
      aria-label="Cash flow timeline across 24 months"
    >
      <defs>
        <linearGradient id="revenueGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          {gradientStops.map((stop) => (
            <stop key={stop.offset} {...stop} />
          ))}
        </linearGradient>
      </defs>
      <rect
        x={padding / 2}
        y={padding / 2}
        width={width - padding}
        height={height - padding * 1.2}
        rx={24}
        className="fill-white"
      />
      {cashflowTimeline.map((point, index) => (
        <g key={point.month} transform={`translate(${scaleX(index)}, ${height - padding})`}>
          <line
            y1={0}
            y2={-height + padding * 1.2}
            className="stroke-border/50"
            strokeDasharray={4}
          />
          <text
            y={20}
            textAnchor="middle"
            className="fill-foreground/60 text-[10px] font-medium"
          >
            {point.month}
          </text>
        </g>
      ))}
      <path
        d={buildPath(revenues)}
        className="fill-none stroke-[3]"
        stroke="url(#revenueGradient)"
      />
      <path
        d={buildPath(expenses)}
        className="fill-none stroke-[2]"
        stroke="var(--brand-accent)"
        strokeDasharray={6}
      />
      <path
        d={buildPath(capitals)}
        className="fill-none stroke-[2]"
        stroke="var(--brand-secondary)"
        strokeDasharray={3}
      />
      {cashflowTimeline.map((point, index) => (
        <g key={point.month}>
          <circle
            cx={scaleX(index)}
            cy={scaleY(revenues[index])}
            r={4}
            className="fill-brand-primary/90"
          />
          <circle
            cx={scaleX(index)}
            cy={scaleY(expenses[index])}
            r={3.6}
            className="fill-brand-accent"
          />
          <circle
            cx={scaleX(index)}
            cy={scaleY(capitals[index])}
            r={3.6}
            className="fill-brand-secondary/80"
          />
        </g>
      ))}
    </svg>
  );
}

function PieChart({ capex, workingCapital, sustainability }: { capex: number; workingCapital: number; sustainability: number }) {
  const size = 160;
  const radius = size / 2;
  const total = capex + workingCapital + sustainability;
  let cumulativeAngle = -Math.PI / 2;
  const slices = [
    { label: "Capex Assets", value: capex, color: "var(--brand-primary)" },
    { label: "Working Capital", value: workingCapital, color: "var(--brand-secondary)" },
    { label: "Green Upgrades", value: sustainability, color: "var(--brand-accent)" },
  ].map((slice) => {
    const angle = (slice.value / total) * Math.PI * 2;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);
    const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...slice, path };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Capital allocation pie chart">
        {slices.map((slice) => (
          <path
            key={slice.label}
            d={slice.path}
            fill={slice.color}
            className="opacity-90 transition hover:opacity-100"
          />
        ))}
      </svg>
      <ul className="space-y-1 text-sm text-foreground/70">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full" style={{ background: slice.color }} />
            <span className="font-medium text-foreground/80">{slice.label}</span>
            <span>{((slice.value / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Heatmap() {
  const drivers = Array.from(new Set(sensitivityMatrix.map((item) => item.driver)));
  const variations = Array.from(new Set(sensitivityMatrix.map((item) => item.variation)));

  const valueFor = (driver: string, variation: string) =>
    sensitivityMatrix.find(
      (item) => item.driver === driver && item.variation === variation,
    );

  const cellColor = (delta: number) => {
    if (delta >= 6) return "bg-brand-primary/80 text-white";
    if (delta >= 0) return "bg-brand-secondary/60 text-foreground";
    if (delta <= -6) return "bg-rose-500/80 text-white";
    return "bg-amber-500/70 text-foreground";
  };

  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
          EBITDA Sensitivity
        </h4>
        <span className="text-xs text-foreground/50">Delta EBITDA (%) vs base case</span>
      </div>
      <div className="mt-4 grid grid-cols-[auto_repeat(variations.length,_minmax(4rem,1fr))] gap-2 text-xs">
        <div className="text-foreground/60">Driver</div>
        {variations.map((variation) => (
          <div key={variation} className="text-center text-foreground/60">
            {variation}
          </div>
        ))}
        {drivers.map((driver) => (
          <div key={driver} className="contents">
            <div className="whitespace-nowrap rounded-lg bg-surface-muted px-3 py-3 text-sm font-medium text-foreground/70">
              {driver}
            </div>
            {variations.map((variation) => {
              const value = valueFor(driver, variation);
              return (
                <div
                  key={`${driver}-${variation}`}
                  className={`flex h-14 items-center justify-center rounded-xl text-sm font-semibold ${value ? cellColor(value.ebitdaDelta) : "bg-surface-muted/70 text-foreground/40"}`}
                >
                  {value ? `${value.ebitdaDelta > 0 ? "+" : ""}${value.ebitdaDelta}` : "-"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinancialEngine() {
  const [selectedSector, setSelectedSector] = useState(0);
  const selected = sectorBenchmarks[selectedSector];

  const allocation = useMemo(() => {
    const capex = selected.capexPerUnit;
    const workingCapital = Math.max(12, capex * 0.6);
    const sustainability = Math.max(6, capex * selected.sustainabilityScore * 0.35);
    return { capex, workingCapital, sustainability };
  }, [selected]);

  return (
    <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Intelligent Financial Engine</h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground/70">
            Live sector benchmarks derived from AP MSME ONE data lake and curated repositories power
            automated projections, covenant compliance, and viability checks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-border/70 bg-surface-muted px-4 py-2 text-xs font-medium text-foreground/60">
          <span>Benchmarks refreshed</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary/20 px-2 py-1 text-brand-secondary">
            Oct 2025
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2.5fr,1.5fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {sectorBenchmarks.map((benchmark, index) => (
              <button
                key={benchmark.subSector}
                type="button"
                onClick={() => setSelectedSector(index)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedSector === index
                    ? "border-brand-primary bg-brand-primary text-white shadow"
                    : "border-border bg-white text-foreground/70 hover:border-brand-primary/60 hover:text-brand-primary"
                }`}
              >
                {benchmark.subSector}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
                Viability Profile
              </h3>
              <dl className="mt-4 space-y-3 text-sm text-foreground/70">
                <div className="flex items-center justify-between">
                  <dt>Operating Margin</dt>
                  <dd className="font-semibold text-foreground/90">
                    {(selected.operatingMargin * 100).toFixed(0)}%
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Break-even</dt>
                  <dd className="font-semibold text-foreground/90">
                    {selected.breakEvenMonths} months
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Productivity Index</dt>
                  <dd className="font-semibold text-foreground/90">
                    {(selected.productivityIndex * 100).toFixed(0)} percentile
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Export Readiness</dt>
                  <dd className="font-semibold text-brand-secondary">
                    {(selected.exportReadiness * 100).toFixed(0)}%
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
                Workforce Mix
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-foreground/75">
                <li className="flex items-center justify-between">
                  <span>Skilled</span>
                  <span className="font-semibold">
                    {(selected.workforceSplit.skilled * 100).toFixed(0)}%
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Semi-skilled</span>
                  <span className="font-semibold">
                    {(selected.workforceSplit.semiSkilled * 100).toFixed(0)}%
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Women participation</span>
                  <span className="font-semibold text-brand-primary">
                    {(selected.workforceSplit.women * 100).toFixed(0)}%
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface-muted/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
                  Cash Flow Radar
                </h3>
                <p className="text-xs text-foreground/60">
                  Auto-generated from transaction data, invoice ingestion, and demand forecasts.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-foreground/60">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brand-primary" /> Revenue
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brand-accent" /> Expense
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brand-secondary" /> Capital Buffer
                </span>
              </div>
            </div>
            <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm">
              <LineChart />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
              Capital Allocation Blueprint
            </h3>
            <PieChart
              capex={allocation.capex}
              workingCapital={allocation.workingCapital}
              sustainability={allocation.sustainability}
            />
            <p className="mt-4 text-xs text-foreground/60">
              Exportable as SVG/PNG and layered into final DPR along with automated commentary.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-foreground/70">
              {selected.sources.map((source) => (
                <li key={source} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
          <Heatmap />
        </div>
      </div>
    </section>
  );
}
