import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  Network,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import logo from "@/assets/tennahub-logo.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TennaHub Technologies — Networking, Software & SchoolPay Systems" },
      {
        name: "description",
        content:
          "We design, install and run advanced networks plus custom software with SchoolPay automation for institutions across Uganda.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { v: "120+", l: "Networks deployed" },
  { v: "40+", l: "Schools on SchoolPay" },
  { v: "99.9%", l: "Uptime SLA" },
  { v: "24/7", l: "On-call engineers" },
];

const services = [
  {
    icon: Network,
    title: "Advanced Networking",
    body: "Fiber, structured cabling, enterprise Wi-Fi, point-to-point links and CCTV — designed, installed and monitored.",
  },
  {
    icon: Cpu,
    title: "Custom Software",
    body: "School management, hospital, hotel and church systems — built modular, deployed on rock-solid infrastructure.",
  },
  {
    icon: Wifi,
    title: "SchoolPay Automation",
    body: "Smart cards, gate access blocks for arrears, parent dashboards and automated reconciliation — natively wired.",
  },
  {
    icon: ShieldCheck,
    title: "Managed Security",
    body: "Firewalls, VPN, role-based access and round-the-clock incident response — Uganda compliant.",
  },
];

const partners = ["SchoolPay", "Stanbic", "MTN", "Airtel", "UCC", "URA"];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Engineered in Uganda · Trusted globally
              </div>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
                Networks that don't blink.{" "}
                <span className="text-gradient">Software that runs your day.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                TennaHub Technologies installs advanced networks and builds the
                software that lives on top of them — including the SchoolPay
                automation suite that powers Ugandan institutions end-to-end.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
                  <Link to="/contact">
                    Start a project <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/api-schoolpay">See SchoolPay API</Link>
                </Button>
              </div>

              <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.l}>
                    <dt className="font-display text-2xl font-bold text-primary-glow">
                      {s.v}
                    </dt>
                    <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-[120px]" />
              <div className="relative mx-auto aspect-square max-w-md rounded-3xl border border-border bg-card/30 p-10 backdrop-blur-xl shadow-card">
                <img
                  src={logo}
                  alt="TennaHub Technologies logo"
                  className="h-full w-full object-contain drop-shadow-[0_0_60px_oklch(0.58_0.22_268/0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="border-t border-border/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary-glow">
                What we can do
              </p>
              <h2 className="mt-2 max-w-2xl text-4xl font-bold sm:text-5xl">
                One team for networks, software and the systems on top.
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/services">
                Full capability list <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Card
                key={s.title}
                className="group relative overflow-hidden border-border/60 bg-card/60 p-6 transition-all hover:border-primary/60 hover:shadow-glow"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="border-t border-border/40 bg-card/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary-glow">
                Recent work
              </p>
              <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
                Projects we've shipped.
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/projects">
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "St. Mary's SS — SchoolPay Gate Access",
                tag: "Education",
                body: "1,800 students. Smart-card gate access tied to live balances.",
              },
              {
                title: "Equator Hospital Network",
                tag: "Healthcare",
                body: "Backbone fiber, VLAN segmentation, 99.99% measured uptime.",
              },
              {
                title: "Kibo Hotels Booking Suite",
                tag: "Hospitality",
                body: "Custom PMS + on-site Wi-Fi captive portal for 5 properties.",
              },
            ].map((p) => (
              <Card
                key={p.title}
                className="overflow-hidden border-border/60 bg-card/80 p-0 transition-all hover:-translate-y-1 hover:border-primary/60"
              >
                <div className="relative h-44 bg-gradient-primary">
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <Building2 className="absolute right-5 top-5 h-8 w-8 text-primary-foreground/70" />
                  <span className="absolute bottom-4 left-5 inline-block rounded-full bg-background/40 px-3 py-1 text-xs backdrop-blur">
                    {p.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY / TRUST */}
      <section className="border-t border-border/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary-glow">
                Eligibility check
              </p>
              <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
                Why you can trust TennaHub.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Before you spend a shilling, here's exactly what we put on the
                table — every project, every client.
              </p>
              <Button asChild className="mt-6 bg-gradient-primary">
                <Link to="/eligibility">Run the eligibility check</Link>
              </Button>
            </div>
            <ul className="space-y-4">
              {[
                "Licensed by UCC and registered with URA — every invoice is tax compliant.",
                "Signed SLAs with measurable uptime, response and resolution targets.",
                "Vendor-certified engineers (Cisco, Mikrotik, Ubiquiti, Microsoft).",
                "End-to-end documentation handed over — you own the network, not us.",
                "SchoolPay-certified integrator with a live reference list you can call.",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="border-y border-border/40 bg-card/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Partners & sponsors
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 sm:grid-cols-6">
            {partners.map((p) => (
              <div
                key={p}
                className="flex items-center justify-center rounded-lg border border-border/60 bg-background/40 py-5 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-primary p-12 text-center shadow-glow">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <h2 className="relative font-display text-3xl font-bold sm:text-4xl">
              Ready to build the system that runs your operation?
            </h2>
            <p className="relative mx-auto mt-3 max-w-2xl text-primary-foreground/90">
              Tell us what you're trying to do. We'll come back with a scoped
              proposal and a clear timeline — usually within 48 hours.
            </p>
            <div className="relative mt-7 flex justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Talk to an engineer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/portal">Client portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
