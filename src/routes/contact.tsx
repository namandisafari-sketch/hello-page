import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TennaHub Technologies" },
      {
        name: "description",
        content:
          "Talk to a TennaHub engineer. We respond to project enquiries within 48 hours.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message received. We'll be in touch within 48 hours.");
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="bg-hero">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6">
        <p className="text-sm uppercase tracking-widest text-primary-glow">Contact</p>
        <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
          Let's <span className="text-gradient">scope your project.</span>
        </h1>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <Card className="border-border/60 bg-card/60 p-6">
              <MapPin className="h-5 w-5 text-primary-glow" />
              <h3 className="mt-3 font-semibold">Office</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Kampala, Uganda — visits by appointment.
              </p>
            </Card>
            <Card className="border-border/60 bg-card/60 p-6">
              <Phone className="h-5 w-5 text-primary-glow" />
              <h3 className="mt-3 font-semibold">Phone</h3>
              <p className="mt-1 text-sm text-muted-foreground">+256 700 000 000</p>
            </Card>
            <Card className="border-border/60 bg-card/60 p-6">
              <Mail className="h-5 w-5 text-primary-glow" />
              <h3 className="mt-3 font-semibold">Email</h3>
              <p className="mt-1 text-sm text-muted-foreground">hello@tennahub.tech</p>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/80 p-8">
            <form className="grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required maxLength={120} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required maxLength={255} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="org">Organisation</Label>
                <Input id="org" maxLength={200} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="message">Tell us what you're building</Label>
                <Textarea id="message" required rows={6} maxLength={2000} className="mt-1.5" />
              </div>
              <Button type="submit" disabled={submitting} className="bg-gradient-primary shadow-glow">
                {submitting ? "Sending..." : (<>Send message <Send className="h-4 w-4" /></>)}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
