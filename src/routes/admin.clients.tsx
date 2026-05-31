import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PortalShell, PortalHeader } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { listClients, upsertClient } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/clients")({ component: AdminClients });

function AdminClients() {
  const fetchClients = useServerFn(listClients);
  const save = useServerFn(upsertClient);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-clients"], queryFn: () => fetchClients() });
  const [open, setOpen] = useState(false);

  const mut = useMutation({
    mutationFn: (input: any) => save({ data: input }),
    onSuccess: () => {
      toast.success("Client saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <PortalShell kind="admin">
      <PortalHeader title="Clients" subtitle="Customer accounts managed by TennaHub." />
      <div className="px-6 pb-10">
        <div className="mb-4 flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary"><Plus className="h-4 w-4" /> New client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New client</DialogTitle></DialogHeader>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  mut.mutate({
                    name: f.get("name"),
                    contact_email: f.get("contact_email") || null,
                    contact_phone: f.get("contact_phone") || null,
                    location: f.get("location") || null,
                    plan: f.get("plan") || null,
                  });
                }}
              >
                <div><Label>Name</Label><Input name="name" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Email</Label><Input name="contact_email" type="email" /></div>
                  <div><Label>Phone</Label><Input name="contact_phone" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Location</Label><Input name="location" /></div>
                  <div><Label>Plan</Label><Input name="plan" placeholder="Fiber 50 Mbps" /></div>
                </div>
                <Button type="submit" disabled={mut.isPending} className="w-full bg-gradient-primary">
                  {mut.isPending ? "Saving…" : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="border-border/60 bg-card/60 p-6">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : !data?.length ? (
            <div className="text-sm text-muted-foreground">No clients yet. Add your first one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="py-2 text-left font-medium">Name</th>
                  <th className="py-2 text-left font-medium">Contact</th>
                  <th className="py-2 text-left font-medium">Location</th>
                  <th className="py-2 text-left font-medium">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.map((c: any) => (
                  <tr key={c.id}>
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {c.contact_email}<br /><span className="text-xs">{c.contact_phone}</span>
                    </td>
                    <td className="py-3">{c.location}</td>
                    <td className="py-3">{c.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </PortalShell>
  );
}
