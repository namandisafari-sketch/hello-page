import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, FileText, Receipt, Wifi } from "lucide-react";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/portal")({
  component: ClientPortal,
});

function ClientPortal() {
  return (
    <PortalShell kind="client">
      <PortalHeader title="Welcome back" subtitle="Your TennaHub connection, agreements and receipts in one place." />
      <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Wifi, label: "Connection", value: "Fiber 50 Mbps", sub: "Active · Kampala" },
          { icon: CreditCard, label: "Plan", value: "Business Plus", sub: "Renews 12 Jul 2026" },
          { icon: Receipt, label: "Balance", value: "UGX 0", sub: "All invoices settled" },
          { icon: FileText, label: "Agreements", value: "2 active", sub: "Last signed Mar 2026" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
            <div className="mt-4 font-display text-xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 px-6 pb-10 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Recent receipts</h2>
          <ul className="mt-4 divide-y divide-border/60 text-sm">
            {[
              { d: "May 15, 2026", desc: "Monthly Fiber 50 Mbps", a: "UGX 350,000" },
              { d: "Apr 15, 2026", desc: "Monthly Fiber 50 Mbps", a: "UGX 350,000" },
              { d: "Mar 02, 2026", desc: "CCTV Maintenance", a: "UGX 480,000" },
            ].map((r) => (
              <li key={r.d} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{r.desc}</div>
                  <div className="text-xs text-muted-foreground">{r.d}</div>
                </div>
                <div className="font-medium text-primary-glow">{r.a}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Active agreements</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { t: "Master Services Agreement", d: "Signed 02 Mar 2026 · Evergreen" },
              { t: "SLA — Fiber 50 Mbps", d: "99.5% uptime · 4hr response" },
            ].map((a) => (
              <li key={a.t} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-4">
                <div>
                  <div className="font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.d}</div>
                </div>
                <button className="text-xs text-primary-glow hover:underline">View</button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PortalShell>
  );
}
