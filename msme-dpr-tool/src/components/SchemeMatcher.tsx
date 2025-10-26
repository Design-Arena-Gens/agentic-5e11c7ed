"use client";

import { useMemo, useState } from "react";
import { schemes } from "@/data/datasets";

const focusAreas = Array.from(
  new Set(schemes.flatMap((scheme) => scheme.focus)),
).sort();

export function SchemeMatcher() {
  const [score, setScore] = useState(0.62);
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["Working Capital"]);

  const toggleFocus = (focus: string) => {
    setSelectedFocus((previous) =>
      previous.includes(focus)
        ? previous.filter((item) => item !== focus)
        : [...previous, focus],
    );
  };

  const matchingSchemes = useMemo(() => {
    return schemes
      .map((scheme) => {
        const focusOverlap = scheme.focus.filter((focus) =>
          selectedFocus.includes(focus),
        );
        const eligibilityScore = Math.min(
          1,
          (focusOverlap.length / scheme.focus.length) * 0.6 +
            (score >= scheme.minScore ? 0.4 : 0),
        );
        return { scheme, eligibilityScore };
      })
      .filter(({ eligibilityScore }) => eligibilityScore > 0.15)
      .sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  }, [score, selectedFocus]);

  return (
    <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Real-time Scheme Matcher</h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground/70">
            Align enterprise maturity with state and national credit programs. Dynamic ranking is
            refreshed with policy rulebooks and lender feedback loops.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-secondary/15 px-4 py-1 text-xs font-medium text-brand-secondary">
          API ready - JanSamarth, CFMS, SIDBI
        </span>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_2fr]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Bankability Score (beta)
          </h3>
          <p className="mt-2 text-sm text-foreground/70">
            Calculated from cash-flow resilience, collateral readiness, compliance hygiene, and
            credit history data sourced from AP MSME ONE plus partner APIs.
          </p>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-foreground/60">
              <span>0.4</span>
              <span>0.6</span>
              <span>0.8</span>
              <span>1.0</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={0.95}
              step={0.01}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              className="mt-2 w-full accent-brand-primary"
            />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-sm text-foreground/60">Current readiness</span>
              <span className="text-3xl font-semibold text-brand-primary">
                {(score * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
              Targeted outcomes
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>- Auto-fill lender specific annexures with machine-verified datasets.</li>
              <li>- Flag compliance gaps versus DPDP Act & AP Digital Governance policy.</li>
              <li>- Surface blended finance pathways for climate-aligned MSMEs.</li>
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
              Focus filters
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {focusAreas.map((focus) => (
                <button
                  type="button"
                  key={focus}
                  onClick={() => toggleFocus(focus)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selectedFocus.includes(focus)
                      ? "border-brand-secondary bg-brand-secondary/20 text-brand-secondary"
                      : "border-border text-foreground/60 hover:border-brand-secondary/60 hover:text-brand-secondary"
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {matchingSchemes.map(({ scheme, eligibilityScore }) => (
            <article
              key={scheme.name}
              className="glass rounded-3xl border border-border/60 bg-white p-6 shadow-sm"
            >
              <header className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {scheme.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wide text-foreground/60">
                    {scheme.owner} - Ticket INR {scheme.ticketSize[0]}L - INR {scheme.ticketSize[1]}L
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-foreground/60">Fit score</div>
                  <div className="text-2xl font-semibold text-brand-primary">
                    {(eligibilityScore * 100).toFixed(0)}%
                  </div>
                </div>
              </header>
              <div className="mt-4 grid gap-4 md:grid-cols-3 md:items-start">
                <ul className="space-y-2 text-sm text-foreground/70">
                  {scheme.focus.map((focus) => (
                    <li key={focus} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-brand-primary" />
                      {focus}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 text-sm text-foreground/70">
                  <p>
                    <strong>Rate:</strong> {scheme.interestRate.toFixed(2)}% p.a.
                  </p>
                  <p>
                    <strong>Subsidy:</strong> {(scheme.subsidy * 100).toFixed(0)}% capital grant
                  </p>
                  <p>
                    <strong>Min Score Threshold:</strong>{" "}
                    {(scheme.minScore * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-dashed border-brand-primary/40 p-3 text-xs text-foreground/70">
                  <p className="font-semibold text-brand-primary">Digital touchpoints</p>
                  {scheme.digitalTouchpoints.map((touchpoint) => (
                    <p key={touchpoint}>- {touchpoint}</p>
                  ))}
                </div>
              </div>
              <footer className="mt-4 border-t border-border/60 pt-4 text-xs text-foreground/60">
                Eligibility highlights: {scheme.eligibility.join("; ")}.
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
