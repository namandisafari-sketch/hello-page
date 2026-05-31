import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  DoorClosed,
  School,
  Smartphone,
  Wallet,
  Webhook,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/api-schoolpay")({
  head: () => ({
    meta: [
      { title: "SchoolPay API Integration — TennaHub Technologies" },
      {
        name: "description",
        content:
          "How TennaHub wires SchoolPay into your school management system: smart cards, gate access blocks, automated reconciliation and parent dashboards.",
      },
    ],
  }),
  component: SchoolPayApi,
});

const features = [
  { icon: CreditCard, t: "Smart-card payments", d: "Mifare cards issued per student, tap-to-pay at canteens and shops." },
  { icon: DoorClosed, t: "Gate access block", d: "Auto-deny entry for students with outstanding arrears beyond grace." },
  { icon: Wallet, t: "Live balances", d: "Parents see balances and receive SMS the moment a payment posts." },
  { icon: Smartphone, t: "USSD & app", d: "Parents pay via MoMo, Airtel Money, bank or the TennaHub parent app." },
  { icon: Webhook, t: "Real-time webhooks", d: "Every payment reconciles into the SMS instantly via signed webhooks." },
  { icon: Zap, t: "Auto reconciliation", d: "No more manual posting. Receipts and ledger entries are created automatically." },
];

function SchoolPayApi() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-glow">
              SchoolPay × TennaHub
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
              SchoolPay, <span className="text-gradient">automated.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              As a SchoolPay integration partner, every school management
              system we ship comes wired into the SchoolPay API out of the box —
              including gate access control, smart cards and parent dashboards.
            </p>
          </div>
          <FlowDiagram />
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            What you get out of the box.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.t} className="border-border/60 bg-card/60 p-6 transition-all hover:border-primary/60 hover:shadow-glow">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GATE ACCESS DIAGRAM */}
      <section className="border-t border-border/40 bg-card/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Gate access, tied to fees.</h2>
              <p className="mt-4 text-muted-foreground">
                When a student taps their smart card at the gate, our
                controller checks the live SchoolPay balance. If the student is
                in arrears past the school's grace policy, the turnstile won't
                open and the bursar gets notified — politely, automatically.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Mifare 13.56 MHz cards, school-branded.",
                  "Edge controller works offline with periodic sync.",
                  "Configurable grace days, blacklists and exemptions.",
                  "Bursar override via PIN at the gate console.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-primary-glow" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <GateDiagram />
          </div>
        </div>
      </section>

      {/* PAYMENT FLOW */}
      <section className="border-t border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">End-to-end payment flow.</h2>
          <p className="mt-2 text-muted-foreground">
            From the parent's phone to the school ledger — every step automated.
          </p>
          <PaymentFlow />
        </div>
      </section>
    </div>
  );
}

/* --- Diagrams (inline SVG) --- */

function FlowDiagram() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/20 blur-3xl" />
      <Card className="relative border-border/60 bg-card/70 p-6 backdrop-blur">
        <svg viewBox="0 0 460 340" className="w-full">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.58 0.22 268)" />
              <stop offset="100%" stopColor="oklch(0.72 0.2 230)" />
            </linearGradient>
          </defs>
          {/* nodes */}
          {[
            { x: 30, y: 30, w: 140, t: "Parent (MoMo/Bank)" },
            { x: 290, y: 30, w: 140, t: "SchoolPay" },
            { x: 30, y: 150, w: 140, t: "Gate Controller" },
            { x: 290, y: 150, w: 140, t: "TennaHub SMS" },
            { x: 160, y: 270, w: 140, t: "School Ledger" },
          ].map((n) => (
            <g key={n.t}>
              <rect x={n.x} y={n.y} width={n.w} height={50} rx={10}
                fill="oklch(0.17 0.05 268)" stroke="url(#g1)" strokeWidth={1.5} />
              <text x={n.x + n.w / 2} y={n.y + 30} textAnchor="middle"
                fontSize={12} fill="oklch(0.97 0.01 250)" fontFamily="DM Sans">
                {n.t}
              </text>
            </g>
          ))}
          {/* arrows */}
          {[
            { x1: 170, y1: 55, x2: 290, y2: 55 },
            { x1: 360, y1: 80, x2: 360, y2: 150 },
            { x1: 290, y1: 175, x2: 170, y2: 175 },
            { x1: 100, y1: 200, x2: 230, y2: 270 },
            { x1: 290, y1: 200, x2: 290, y2: 270 },
          ].map((a, i) => (
            <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke="url(#g1)" strokeWidth={1.5} markerEnd="url(#arr)" />
          ))}
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3"
              orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="oklch(0.72 0.2 230)" />
            </marker>
          </defs>
        </svg>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          High-level data flow — Parent → SchoolPay → School Ledger.
        </p>
      </Card>
    </div>
  );
}

function GateDiagram() {
  return (
    <Card className="border-border/60 bg-card/70 p-8">
      <svg viewBox="0 0 520 280" className="w-full">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.58 0.22 268)" />
            <stop offset="100%" stopColor="oklch(0.72 0.2 230)" />
          </linearGradient>
        </defs>
        {/* student card */}
        <g>
          <rect x="20" y="100" width="90" height="60" rx="8"
            fill="url(#g2)" />
          <text x="65" y="135" textAnchor="middle" fontSize={11}
            fill="white" fontFamily="DM Sans">Smart Card</text>
        </g>
        {/* gate */}
        <g>
          <rect x="180" y="60" width="120" height="160" rx="10"
            fill="oklch(0.17 0.05 268)" stroke="url(#g2)" strokeWidth={1.5} />
          <text x="240" y="100" textAnchor="middle" fontSize={12}
            fill="oklch(0.97 0.01 250)" fontFamily="Space Grotesk" fontWeight={600}>Gate Reader</text>
          <circle cx="240" cy="140" r="22" fill="oklch(0.58 0.22 268)" opacity={0.4} />
          <circle cx="240" cy="140" r="10" fill="oklch(0.72 0.2 230)" />
          <text x="240" y="200" textAnchor="middle" fontSize={10}
            fill="oklch(0.7 0.03 260)" fontFamily="DM Sans">Edge Controller</text>
        </g>
        {/* api check */}
        <g>
          <rect x="370" y="40" width="130" height="60" rx="10"
            fill="oklch(0.17 0.05 268)" stroke="url(#g2)" strokeWidth={1.5} />
          <text x="435" y="65" textAnchor="middle" fontSize={11}
            fill="oklch(0.97 0.01 250)" fontFamily="DM Sans">SchoolPay API</text>
          <text x="435" y="82" textAnchor="middle" fontSize={9}
            fill="oklch(0.7 0.03 260)" fontFamily="DM Sans">balance check</text>
        </g>
        {/* decision */}
        <g>
          <rect x="370" y="180" width="130" height="60" rx="10"
            fill="oklch(0.17 0.05 268)" stroke="url(#g2)" strokeWidth={1.5} />
          <text x="435" y="205" textAnchor="middle" fontSize={11}
            fill="oklch(0.97 0.01 250)" fontFamily="DM Sans">Decision</text>
          <text x="435" y="222" textAnchor="middle" fontSize={9}
            fill="oklch(0.7 0.03 260)" fontFamily="DM Sans">open / block / notify</text>
        </g>
        {/* arrows */}
        <line x1="110" y1="130" x2="180" y2="140" stroke="url(#g2)" strokeWidth={1.5} markerEnd="url(#arr2)" />
        <line x1="300" y1="100" x2="370" y2="70" stroke="url(#g2)" strokeWidth={1.5} markerEnd="url(#arr2)" />
        <line x1="370" y1="90" x2="300" y2="120" stroke="url(#g2)" strokeWidth={1.5} markerEnd="url(#arr2)" />
        <line x1="300" y1="170" x2="370" y2="200" stroke="url(#g2)" strokeWidth={1.5} markerEnd="url(#arr2)" />
        <defs>
          <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 z" fill="oklch(0.72 0.2 230)" />
          </marker>
        </defs>
      </svg>
    </Card>
  );
}

function PaymentFlow() {
  const steps = [
    { icon: Smartphone, t: "Parent pays", d: "MTN/Airtel/Bank/USSD" },
    { icon: CreditCard, t: "SchoolPay", d: "Receives & validates" },
    { icon: Webhook, t: "Webhook to TennaHub", d: "Signed payload" },
    { icon: School, t: "Ledger updated", d: "Receipt + SMS issued" },
  ];
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <div key={s.t} className="relative">
          <Card className="h-full border-border/60 bg-card/60 p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="font-display text-sm text-muted-foreground">
                Step {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </Card>
          {i < steps.length - 1 && (
            <ArrowRight className="absolute top-1/2 right-[-12px] hidden h-5 w-5 -translate-y-1/2 text-primary-glow lg:block" />
          )}
        </div>
      ))}
    </div>
  );
}
