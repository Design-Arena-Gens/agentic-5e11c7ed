"use client";

import { enhancements } from "@/data/datasets";

const pillarColor: Record<(typeof enhancements)[number]["pillar"], string> = {
  Efficiency: "bg-brand-primary/15 text-brand-primary",
  Inclusion: "bg-brand-secondary/15 text-brand-secondary",
  Policy: "bg-brand-accent/15 text-brand-accent",
};

export function EnhancementsList() {
  return (
    <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            High-impact Enhancements
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground/70">
            Layer advanced capability enablers that accelerate DPR throughput, deepen inclusion, and
            embed policy-grade governance demanded by public financiers.
          </p>
        </div>
        <div className="rounded-full border border-border/60 bg-white px-4 py-2 text-xs text-foreground/60">
          Compliance first - DPDP Act, AP Digital Governance, RBI Consent Artifacts
        </div>
      </header>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {enhancements.map((item) => (
          <article
            key={item.title}
            className="glass flex flex-col rounded-3xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <span
              className={`w-max rounded-full px-3 py-1 text-xs font-semibold ${pillarColor[item.pillar]}`}
            >
              {item.pillar}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 flex-1 text-sm text-foreground/70">{item.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
              Impact: {item.impact}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
