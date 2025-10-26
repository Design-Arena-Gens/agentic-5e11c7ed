import { ArchitectureGrid } from "@/components/ArchitectureGrid";
import { ConversationStudio } from "@/components/ConversationStudio";
import { EnhancementsList } from "@/components/EnhancementsList";
import { FinancialEngine } from "@/components/FinancialEngine";
import { GeoReachMap } from "@/components/GeoReachMap";
import { HeroSection } from "@/components/HeroSection";
import { SchemeMatcher } from "@/components/SchemeMatcher";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 pb-20 pt-8 md:px-8 md:pt-10">
      <HeroSection />
      <ArchitectureGrid />
      <ConversationStudio />
      <FinancialEngine />
      <SchemeMatcher />
      <GeoReachMap />
      <EnhancementsList />
      <section className="rounded-3xl border border-border bg-surface px-8 py-10 md:px-12">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Deployment & Governance Blueprint</h2>
            <p className="mt-1 max-w-3xl text-sm text-foreground/70">
              Production-grade delivery on Vercel Edge with APIs hosted inside the AP State Data
              Centre and event streaming to state observability stacks.
            </p>
          </div>
          <div className="rounded-full border border-border/60 bg-white px-4 py-2 text-xs text-foreground/60">
            Zero trust - Consent ledger - Continuous compliance scans
          </div>
        </header>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-primary">Edge Delivery</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Next.js app served via Vercel Edge, CDN cached assets, and server actions proxied to
              state APIs via mutual TLS. Supports offline-ready PWA packaging and device attestation.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-primary">Data Trust & Privacy</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Consent vault with revocation workflows, DPDP compliant data minimisation, encryption
              at rest with HSM-backed keys, and audit-ready event trails for bankers.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-primary">Operational Excellence</h3>
            <p className="mt-2 text-sm text-foreground/70">
              AI-assisted monitoring, bias detection checkpoints, and continuous fine-tuning using
              AP MSME ONE data lake plus repository of verified DPR outcomes.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
