import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { listProjects } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/projects")({ component: AdminProjects });

function AdminProjects() {
  const fetch = useServerFn(listProjects);
  const { data, isLoading } = useQuery({ queryKey: ["admin-projects"], queryFn: () => fetch() });
  return (
    <PortalShell kind="admin">
      <PortalHeader title="Projects" subtitle="Active engagements and showcase items." />
      <div className="px-6 pb-10">
        <Card className="border-border/60 bg-card/60 p-6">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
            !data?.length ? <p className="text-sm text-muted-foreground">No projects yet.</p> :
            <ul className="divide-y divide-border/60 text-sm">
              {data.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.clients?.name ?? "Internal"} · {p.status} {p.is_showcase ? "· showcased" : ""}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.started_at ?? "—"} → {p.due_at ?? "—"}
                  </div>
                </li>
              ))}
            </ul>}
        </Card>
      </div>
    </PortalShell>
  );
}
