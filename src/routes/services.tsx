import { createFileRoute } from "@tanstack/react-router";
import {
  Cpu,
  Network,
  Wifi,
  ShieldCheck,
  Camera,
  Cable,
  Cloud,
  GraduationCap,
  Hospital,
  Hotel,
  Briefcase,
  Church,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "What We Can Do — TennaHub Technologies" },
      {
        name: "description",
        content:
          "Networking, software, SchoolPay automation, security, cloud and managed services delivered by TennaHub.",
      },
    ],
  }),
  component: ServicesPage,
});

const groups = [
  {
    title: "Networking & Infrastructure",
    items: [
      { icon: Cable, t: "Structured cabling", d: "Fiber, CAT6/6A, patch panels, trunking." },
      { icon: Wifi, t: "Enterprise Wi-Fi", d: "High-density coverage, captive portals, roaming." },
      { icon: Network, t: "Point-to-point links", d: "Long-range links between branches and campuses." },
      { icon: Camera, t: "CCTV & access control", d: "IP cameras, NVR, smart-card door access." },
    ],
  },
  {
    title: "Software & Platforms",
    items: [
      { icon: GraduationCap, t: "School management", d: "Admissions, academics, finance + SchoolPay." },
      { icon: Hospital, t: "Hospital management", d: "Patients, billing, lab, pharmacy, NHIF-ready." },
      { icon: Hotel, t: "Hotel & restaurant", d: "PMS, POS, bookings, captive Wi-Fi." },
      { icon: Church, t: "Church & NGO", d: "Members, contributions, projects, reporting." },
    ],
  },
  {
    title: "Security & Cloud",
    items: [
      { icon: ShieldCheck, t: "Firewalls & VPN", d: "Site-to-site, road warrior, MFA enforced." },
      { icon: Cloud, t: "Cloud hosting", d: "VPS, backups, disaster recovery in-region." },
      { icon: Cpu, t: "Custom integrations", d: "APIs to MTN MoMo, Airtel, SchoolPay, URA EFRIS." },
      { icon: Briefcase, t: "HR & payroll (Uganda)", d: "PAYE, NSSF, LST, leave, contracts." },
    ],
  },
];

function ServicesPage() {
  return (
    <div className="bg-hero">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6">
        <p className="text-sm uppercase tracking-widest text-primary-glow">
          What we can do
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
          A complete stack. <span className="text-gradient">One team.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Most of our clients hire us once and never need a second vendor.
          From the cable in the wall to the dashboard on their phone — it all
          comes from TennaHub.
        </p>
      </section>

      <section className="border-t border-border/40 bg-background py-20">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="text-2xl font-semibold sm:text-3xl">{g.title}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((i) => (
                  <Card
                    key={i.t}
                    className="border-border/60 bg-card/60 p-6 transition-all hover:border-primary/50 hover:shadow-glow"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
                      <i.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{i.t}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{i.d}</p>
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
