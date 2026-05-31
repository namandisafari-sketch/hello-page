import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners & Sponsors — TennaHub Technologies" },
      {
        name: "description",
        content:
          "TennaHub partners with SchoolPay, telecom carriers and global vendors to deliver enterprise-grade systems.",
      },
    ],
  }),
  component: Partners,
});

const tiered = {
  Strategic: ["SchoolPay", "Stanbic Bank", "MTN Uganda"],
  Technology: ["Cisco", "Mikrotik", "Ubiquiti", "Microsoft", "Google Cloud"],
  Carrier: ["Airtel", "Uganda Telecom", "Roke Telkom"],
  Community: ["UCC", "Outbox Hub", "Innovation Village"],
};

function Partners() {
  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6">
          <p className="text-sm uppercase tracking-widest text-primary-glow">
            Partners & sponsors
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
            We don't build alone. <span className="text-gradient">Meet the network.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Our work is backed by certified vendor partners and a strategic
            partnership with SchoolPay — the leading school payments platform
            in the region.
          </p>
        </div>
      </section>

      <section className="border-t border-border/40 py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
          {Object.entries(tiered).map(([tier, partners]) => (
            <div key={tier}>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary-glow" />
                <h2 className="text-2xl font-semibold">{tier} partners</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {partners.map((p) => (
                  <Card
                    key={p}
                    className="flex items-center gap-3 border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/50"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                      <Handshake className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{p}</span>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
