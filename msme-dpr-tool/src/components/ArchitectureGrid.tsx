"use client";

const architectureLayers = [
  {
    title: "Conversational Onboarding Mesh",
    description:
      "Multimodal chat orchestrator merging text, voice, and vernacular prompts. Uses multilingual LLM adapters tuned on AP MSME cases with context retrieval from the knowledge base.",
    elements: [
      "Voice workflow: Telugu ASR, neural translation, sentiment guardrails",
      "Progressive disclosure questionnaires for low-literacy users",
      "Persona aware prompting for women, SHG, and rural entrepreneurs",
    ],
  },
  {
    title: "Financial Intelligence Core",
    description:
      "Benchmark service ingesting AP industrial datasets, GST signals, and SIDBI templates to auto-generate cash flow, ratio, and bank covenant analytics.",
    elements: [
      "Hybrid rule engine plus ML forecasts for sector archetypes",
      "Auto reconciliation with UPI, TReDS, and bank statement data",
      "Narrative NLG tuned to bank examiner lexicon",
    ],
  },
  {
    title: "Scheme & Policy Alignment Fabric",
    description:
      "Real-time matcher across central, state, PSB, and DFI schemes with compliance calculators and subsidy simulations.",
    elements: [
      "Rulebook ingestion via DocAI and policy change diffing",
      "Eligibility graph with explainable reasoning trails",
      "Sanction readiness dashboards for stakeholders",
    ],
  },
  {
    title: "NLG DPR Studio",
    description:
      "Template-aware narrative generator that produces bankable DPRs with tables, charts, and evidence manifests in English and Telugu.",
    elements: [
      "Section orchestrator mapped to SIDBI and AP formats",
      "Automated annexures, ratio commentary, risk articulation",
      "Multichannel export: PDF, Word, structured JSON, API",
    ],
  },
  {
    title: "Secure Cloud-native Platform",
    description:
      "Micro front-end hosted on Vercel, API layer on AP State Data Centre, and event streaming for audit logs with full DPDP compliance.",
    elements: [
      "Role-based access, consent ledger, zero trust architecture",
      "Offline sync for field kits with encrypted storage",
      "Observability stack with RBI-grade monitoring",
    ],
  },
];

export function ArchitectureGrid() {
  return (
    <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Solution Architecture</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground/70">
            Modular layers aligned to AP MSME ONE for seamless integration, policy compliance, and
            rapid scaling across districts.
          </p>
        </div>
        <div className="rounded-full border border-border/60 bg-white px-4 py-2 text-xs text-foreground/60">
          Cloud-native - Multilingual - Bank-grade Security
        </div>
      </header>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {architectureLayers.map((layer) => (
          <article
            key={layer.title}
            className="glass flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <h3 className="text-lg font-semibold text-brand-primary">{layer.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{layer.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-foreground/70">
              {layer.elements.map((element) => (
                <li key={element} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                  {element}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
