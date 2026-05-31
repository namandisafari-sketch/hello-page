import { createFileRoute } from "@tanstack/react-router";
import { Users, Receipt, FolderKanban, GraduationCap, TrendingUp } from "lucide-react";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  component: AdminPortal,
});

function AdminPortal() {
  return (
    <PortalShell kind="admin">
      <PortalHeader title="Admin Dashboard" subtitle="Clients, billing, HR, projects and SchoolPay — all in one console." />

      <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Active clients", value: "127", sub: "+8 this month" },
          { icon: Receipt, label: "Revenue MTD", value: "UGX 84.2M", sub: "+12% vs. last month" },
          { icon: FolderKanban, label: "Open projects", value: "23", sub: "5 awaiting sign-off" },
          { icon: GraduationCap, label: "SchoolPay schools", value: "42", sub: "Live integrations" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 p-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-primary-glow" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 px-6 pb-10 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/60 p-6 lg:col-span-2">
          <h2 className="font-semibold">Recent invoices</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 text-left font-medium">Client</th>
                <th className="py-2 text-left font-medium">Item</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { c: "St. Mary's SS", i: "Gate access maintenance", a: "UGX 1,200,000", s: "Paid" },
                { c: "Equator Hospital", i: "Q2 Network monitoring", a: "UGX 3,400,000", s: "Sent" },
                { c: "Kibo Hotels", i: "PMS license renewal", a: "UGX 2,100,000", s: "Overdue" },
                { c: "Grace Cathedral", i: "CMS support", a: "UGX 450,000", s: "Paid" },
              ].map((r) => (
                <tr key={r.c}>
                  <td className="py-3 font-medium">{r.c}</td>
                  <td className="py-3 text-muted-foreground">{r.i}</td>
                  <td className="py-3 text-right">{r.a}</td>
                  <td className="py-3 text-right">
                    <span className={
                      r.s === "Paid" ? "text-primary-glow" :
                      r.s === "Overdue" ? "text-destructive" : "text-muted-foreground"
                    }>{r.s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">HR — Uganda payroll</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { t: "Staff on payroll", v: "34" },
              { t: "PAYE this month", v: "UGX 6.8M" },
              { t: "NSSF (15%)", v: "UGX 9.1M" },
              { t: "LST due", v: "UGX 340K" },
              { t: "Leave requests open", v: "4" },
            ].map((x) => (
              <li key={x.t} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
                <span className="text-muted-foreground">{x.t}</span>
                <span className="font-medium">{x.v}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="px-6 pb-10">
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Modules</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This is the thin MVP scaffold. Each module below is wired into the
            sidebar and ready to be deepened with real data in the next phase.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {[
              "Clients & contacts",
              "Invoices & receipts",
              "Worker payment receipts",
              "HR + payroll (Uganda)",
              "Projects + milestones",
              "Site CMS (hero, services, partners)",
              "SchoolPay integrations",
              "Audit log",
            ].map((m) => (
              <div key={m} className="rounded-lg border border-border/60 bg-background/40 p-4">
                {m}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
