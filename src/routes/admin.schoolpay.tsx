import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { listSchoolpay } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/schoolpay")({ component: AdminSchoolpay });

function AdminSchoolpay() {
  const fetch = useServerFn(listSchoolpay);
  const { data, isLoading } = useQuery({ queryKey: ["admin-schoolpay"], queryFn: () => fetch() });
  return (
    <PortalShell kind="admin">
      <PortalHeader
        title="SchoolPay integrations"
        subtitle="Schools live on TennaHub's SchoolPay automation, plus a live webhook feed."
      />
      <div className="grid gap-5 px-6 pb-10 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Schools</h2>
          {isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> :
            !data?.schools.length ? <p className="mt-3 text-sm text-muted-foreground">No schools registered.</p> :
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.schools.map((s: any) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Code: {s.code}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Gate: {s.gate_access_enabled ? "✓" : "—"} · Cards: {s.smart_cards_enabled ? "✓" : "—"}
                  </div>
                </li>
              ))}
            </ul>}
        </Card>
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Recent webhook events</h2>
          {!data?.events.length ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No events yet. Configure SchoolPay to POST to <code>/api/public/schoolpay-webhook</code>
              with an <code>x-schoolpay-signature</code> HMAC-SHA256 header.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.events.map((e: any) => (
                <li key={e.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{e.event_type}</span>
                    <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {e.schoolpay_schools?.name ?? "Unknown school"} · {e.student_ref ?? "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PortalShell>
  );
}
