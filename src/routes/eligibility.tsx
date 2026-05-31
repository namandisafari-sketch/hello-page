import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Why Trust Us — Eligibility Check | TennaHub" },
      {
        name: "description",
        content:
          "Run the TennaHub eligibility check: licensing, certifications, SLAs and references before you sign.",
      },
    ],
  }),
  component: Eligibility,
});

const checks = [
  { t: "Legally registered", d: "Incorporated in Uganda, TIN issued, URA tax compliant — current certificate on request." },
  { t: "UCC licensed", d: "Communications Commission license for ISP and network installation work." },
  { t: "Vendor-certified", d: "Cisco CCNA/CCNP, Mikrotik MTCNA, Ubiquiti UEWA, Microsoft 365 admin." },
  { t: "Written SLAs", d: "Every contract includes uptime targets, response windows and credits if we miss them." },
  { t: "Documentation handover", d: "Network diagrams, credentials and admin access handed to you — never locked behind us." },
  { t: "References on call", d: "Live list of schools, hospitals and hotels who'll take your call before you sign." },
  { t: "Insurance covered", d: "Public liability and equipment insurance for every on-site installation." },
  { t: "Data sovereignty", d: "Customer data hosted in-region by default, GDPR-aware practices applied." },
];

function Eligibility() {
  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary-glow" />
          <p className="mt-4 text-sm uppercase tracking-widest text-primary-glow">
            Eligibility check
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
            Why a visitor should <span className="text-gradient">trust TennaHub.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Before any project starts, here's the public record we put on the
            table. Every line is verifiable.
          </p>
        </div>
      </section>

      <section className="border-t border-border/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
          {checks.map((c) => (
            <Card key={c.t} className="flex gap-4 border-border/60 bg-card/60 p-6">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary-glow" />
              <div>
                <h3 className="font-semibold">{c.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
