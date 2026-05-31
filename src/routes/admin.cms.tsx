import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { listCms, upsertCms, claimAdminBootstrap } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/cms")({ component: AdminCms });

function AdminCms() {
  const fetch = useServerFn(listCms);
  const save = useServerFn(upsertCms);
  const claim = useServerFn(claimAdminBootstrap);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-cms"], queryFn: () => fetch() });
  const [key, setKey] = useState("hero.tagline");
  const [value, setValue] = useState('{"text":"Built in Uganda. Engineered for trust."}');

  const mut = useMutation({
    mutationFn: async () => save({ data: { key, value: JSON.parse(value) } }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-cms"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <PortalShell kind="admin">
      <PortalHeader title="Site CMS" subtitle="Edit copy on the public site. Stored as JSON keyed by section." />
      <div className="grid gap-5 px-6 pb-10 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Edit content</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Key</Label>
              <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="hero.tagline" />
            </div>
            <div>
              <Label>Value (JSON)</Label>
              <Textarea rows={6} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <Button className="bg-gradient-primary" disabled={mut.isPending} onClick={() => mut.mutate()}>
              {mut.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
          <div className="mt-8 border-t border-border/60 pt-4">
            <h3 className="text-sm font-semibold">First-time setup</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              If you're the first user, claim the admin role.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={async () => {
                try { await claim(); toast.success("You are now admin. Refresh the page."); }
                catch (e: any) { toast.error(e.message); }
              }}
            >
              Claim admin role
            </Button>
          </div>
        </Card>
        <Card className="border-border/60 bg-card/60 p-6">
          <h2 className="font-semibold">Current content</h2>
          {isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> :
            !data?.length ? <p className="mt-3 text-sm text-muted-foreground">No entries yet.</p> :
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {data.map((c: any) => (
                <li key={c.id} className="py-3">
                  <div className="font-mono text-xs text-primary-glow">{c.key}</div>
                  <pre className="mt-1 overflow-x-auto text-xs text-muted-foreground">{JSON.stringify(c.value, null, 2)}</pre>
                </li>
              ))}
            </ul>}
        </Card>
      </div>
    </PortalShell>
  );
}
