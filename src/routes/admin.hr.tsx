import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { listHR } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/hr")({ component: AdminHR });
const fmt = (n: number) => "UGX " + new Intl.NumberFormat("en-UG").format(Number(n));

function AdminHR() {
  const fetch = useServerFn(listHR);
  const { data, isLoading } = useQuery({ queryKey: ["admin-hr"], queryFn: () => fetch() });

  return (
    <PortalShell kind="admin">
      <PortalHeader title="HR — Uganda payroll" subtitle="Staff roster with PAYE, NSSF and LST tracking." />
      <div className="px-6 pb-10">
        <Card className="border-border/60 bg-card/60 p-6">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
            !data?.length ? <p className="text-sm text-muted-foreground">No staff recorded yet.</p> :
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="py-2 text-left font-medium">Name</th>
                  <th className="py-2 text-left font-medium">Role</th>
                  <th className="py-2 text-right font-medium">Gross</th>
                  <th className="py-2 text-right font-medium">PAYE</th>
                  <th className="py-2 text-right font-medium">NSSF</th>
                  <th className="py-2 text-right font-medium">LST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.map((s: any) => (
                  <tr key={s.id}>
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-muted-foreground">{s.role}</td>
                    <td className="py-3 text-right">{fmt(s.gross_pay_ugx)}</td>
                    <td className="py-3 text-right">{fmt(s.paye_ugx)}</td>
                    <td className="py-3 text-right">{fmt(s.nssf_ugx)}</td>
                    <td className="py-3 text-right">{fmt(s.lst_ugx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </Card>
      </div>
    </PortalShell>
  );
}
