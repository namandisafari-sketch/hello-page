import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CreditCard, Download, FileText, Receipt, Wifi } from "lucide-react";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyPortal } from "@/lib/portal.functions";
import { renderReceiptPdf } from "@/lib/pdf.functions";

export const Route = createFileRoute("/portal")({ component: ClientPortal });

const fmt = (n: number) => "UGX " + new Intl.NumberFormat("en-UG").format(Number(n));

function ClientPortal() {
  const fetch = useServerFn(getMyPortal);
  const renderReceipt = useServerFn(renderReceiptPdf);
  const { data, isLoading } = useQuery({ queryKey: ["my-portal"], queryFn: () => fetch() });

  const downloadReceipt = async (id: string) => {
    try {
      const res = await renderReceipt({ data: { receiptId: id } });
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${res.base64}`;
      link.download = res.filename;
      link.click();
    } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) {
    return (
      <PortalShell kind="client">
        <PortalHeader title="Welcome back" />
        <div className="p-6 text-sm text-muted-foreground">Loading…</div>
      </PortalShell>
    );
  }

  const c = data?.client;
  const balance = (data?.invoices ?? [])
    .filter((i: any) => i.status === "sent" || i.status === "overdue")
    .reduce((s: number, i: any) => s + Number(i.amount_ugx), 0);

  return (
    <PortalShell kind="client">
      <PortalHeader title="Welcome back" subtitle="Your TennaHub connection, agreements and receipts." />

      {!c ? (
        <div className="p-6">
          <Card className="border-border/60 bg-card/60 p-6 text-sm text-muted-foreground">
            We haven't linked your account to a client record yet. Reach out to TennaHub support and we'll connect it.
          </Card>
        </div>
      ) : (
        <>
          <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wifi, label: "Connection", value: c.plan ?? "Pending", sub: c.location ?? "" },
              { icon: CreditCard, label: "Client", value: c.name, sub: c.contact_phone ?? "" },
              { icon: Receipt, label: "Balance", value: fmt(balance), sub: balance === 0 ? "All settled" : "Pending invoices" },
              { icon: FileText, label: "Agreements", value: `${data!.agreements.length} active`, sub: "" },
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
              {!data!.receipts.length ? (
                <p className="mt-3 text-sm text-muted-foreground">No receipts yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border/60 text-sm">
                  {data!.receipts.map((r: any) => (
                    <li key={r.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium">{r.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.paid_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-primary-glow">{fmt(r.amount_ugx)}</span>
                        <Button size="sm" variant="ghost" onClick={() => downloadReceipt(r.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="border-border/60 bg-card/60 p-6">
              <h2 className="font-semibold">Agreements</h2>
              {!data!.agreements.length ? (
                <p className="mt-3 text-sm text-muted-foreground">No agreements on file.</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm">
                  {data!.agreements.map((a: any) => (
                    <li key={a.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.status}{a.signed_at ? ` · signed ${new Date(a.signed_at).toLocaleDateString()}` : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </PortalShell>
  );
}
