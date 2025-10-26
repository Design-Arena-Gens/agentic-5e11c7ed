"use client";

const highlights = [
  {
    label: "Entrepreneurs Onboarded",
    value: "250K+",
    detail: "Projected coverage across AP MSME ecosystem by 2027",
  },
  {
    label: "DPR Generation Time",
    value: "70% faster",
    detail: "Automated workflows collapse consultant-heavy effort",
  },
  {
    label: "Bankability Uplift",
    value: "1.8x",
    detail: "Data-backed narratives trusted by PSBs & DFIs",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-10 pb-16 pt-24 md:px-16">
      <div className="absolute inset-0 grid-pattern opacity-35" aria-hidden />
      <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-brand-primary/15 blur-2xl" />
      <div className="absolute bottom-14 right-16 h-36 w-36 rounded-full bg-brand-secondary/15 blur-3xl" />
      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-1 text-sm font-medium text-brand-primary">
          Andhra Pradesh MSME Digital Mission - 2025
        </span>
        <div className="mt-6 max-w-5xl">
          <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            AI-powered Detailed Project Reports that unlock bankable growth for
            Andhra Pradesh MSMEs.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/75 md:text-xl">
            A production-grade DPR preparation engine seamlessly embedded into
            the AP MSME ONE Portal combining conversational onboarding,
            sector-specific intelligence, government scheme matching, and
            policy-compliant analytics in English and Telugu.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="glass flex flex-col rounded-3xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-xs uppercase tracking-wide text-foreground/60">
                {item.label}
              </span>
              <span className="mt-3 text-3xl font-semibold text-brand-primary">
                {item.value}
              </span>
              <p className="mt-2 text-sm text-foreground/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
