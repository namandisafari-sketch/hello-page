import { createFileRoute } from "@tanstack/react-router";
import { Building2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — TennaHub Technologies" },
      {
        name: "description",
        content:
          "Selected projects from TennaHub: schools, hospitals, hotels and enterprise networks across Uganda.",
      },
    ],
  }),
  component: Projects,
});

const projects = [
  { title: "St. Mary's SS — SchoolPay Gate Access", tag: "Education", year: "2024", desc: "Smart-card gate access tied to live SchoolPay balances for 1,800 students." },
  { title: "Equator Hospital Network", tag: "Healthcare", year: "2024", desc: "Backbone fiber, VLAN segmentation and on-site monitoring. 99.99% measured uptime." },
  { title: "Kibo Hotels Booking Suite", tag: "Hospitality", year: "2023", desc: "Custom PMS, POS and captive Wi-Fi rolled out across 5 properties." },
  { title: "Mukono District Education Portal", tag: "Government", year: "2024", desc: "Centralized portal pulling reports from 32 schools, weekly automated digests." },
  { title: "Rwenzori Coffee Logistics", tag: "Agribusiness", year: "2023", desc: "Field-officer mobile app + warehouse system with offline-first sync." },
  { title: "Grace Cathedral CMS", tag: "Faith-based", year: "2024", desc: "Members, giving, projects, livestream booking — all in one console." },
];

function Projects() {
  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6">
          <p className="text-sm uppercase tracking-widest text-primary-glow">Projects</p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
            Things we've actually <span className="text-gradient">built and run.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A live look at recent work. Most clients let us list them — a few
            prefer NDA. We share references on request.
          </p>
        </div>
      </section>

      <section className="border-t border-border/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.title} className="group overflow-hidden border-border/60 bg-card/60 p-0 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
              <div className="relative h-44 bg-gradient-primary">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <Building2 className="absolute right-5 top-5 h-8 w-8 text-primary-foreground/70" />
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="rounded-full bg-background/40 px-3 py-1 text-xs backdrop-blur">{p.tag}</span>
                  <span className="rounded-full bg-background/40 px-3 py-1 text-xs backdrop-blur">{p.year}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-glow transition-opacity opacity-70 group-hover:opacity-100">
                  Case study <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
