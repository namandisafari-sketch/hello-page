import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listBilling } from "@/lib/admin.functions";
import { renderInvoicePdf, renderReceiptPdf } from "@/lib/pdf.functions";

export const Route = createFileRoute("/admin/billing")({ component: AdminBilling });

const fmt = (n: number) => "UGX " + new Intl.NumberFormat("en-UG").format(Number(n));

function download(b64: string, name: string) {
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${b64}`;
  link.download = name;
  link.click();
}

function AdminBilling() {
  const fetch = useServerFn(listBilling);
  const inv = useServerFn(renderInvoicePdf);
  const rec = useServerFn(renderReceiptPdf);
  const { data, isLoading } = useQuery({ queryKey: ["admin-billing"], queryFn: () => fetch() });

  const dl = async (kind: "inv" | "rec", id: string) => {
    try {
      const fn = kind === "inv" ? inv : rec;
      const res = await fn({ data: kind === "inv" ? { invoiceId: id } : { receiptId: id } } as any);
      download(res.base64, res.filename);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <PortalShell kind="admin">
      <PortalHeader title="Billing" subtitle="Invoices, customer receipts and worker payouts." />
      <div className="grid gap-5 px-6 pb-10 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Invoices</h2>
          {isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> :
            !data?.invoices.length ? <p className="mt-3 text-sm text-muted-foreground">No invoices yet.</p> :
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.invoices.map((i: any) => (
                <li key={i.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{i.description}</div>
                    <div className="text-xs text-muted-foreground">{i.clients?.name} · {i.status}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{fmt(i.amount_ugx)}</span>
                    <Button size="sm" variant="ghost" onClick={() => dl("inv", i.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>}
        </Card>
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Customer receipts</h2>
          {isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> :
            !data?.receipts.length ? <p className="mt-3 text-sm text-muted-foreground">No receipts yet.</p> :
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.receipts.map((r: any) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{r.description}</div>
                    <div className="text-xs text-muted-foreground">{r.clients?.name} · {new Date(r.paid_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-primary-glow">{fmt(r.amount_ugx)}</span>
                    <Button size="sm" variant="ghost" onClick={() => dl("rec", r.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>}
        </Card>
        <Card className="border-border/60 bg-card/60 p-6 lg:col-span-2">
          <h2 className="font-semibold">Worker payments</h2>
          {!data?.payouts.length ? <p className="mt-3 text-sm text-muted-foreground">No payouts recorded.</p> :
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.payouts.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{p.staff_name}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </div>
                  <span className="font-medium">{fmt(p.amount_ugx)}</span>
                </li>
              ))}
            </ul>}
        </Card>
      </div>
    </PortalShell>
  );
}
