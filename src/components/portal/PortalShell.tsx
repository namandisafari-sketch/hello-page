import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CreditCard,
  FileText,
  Home,
  LogOut,
  Receipt,
  Shield,
  Users,
  Briefcase,
  FolderKanban,
  Settings,
  GraduationCap,
} from "lucide-react";
import logo from "@/assets/tennahub-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PortalKind = "client" | "admin";

const links: Record<PortalKind, { to: string; label: string; icon: any }[]> = {
  client: [
    { to: "/portal", label: "Overview", icon: Home },
    { to: "/portal/plan", label: "My Connection", icon: CreditCard },
    { to: "/portal/agreements", label: "Agreements", icon: FileText },
    { to: "/portal/receipts", label: "Receipts", icon: Receipt },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: Home },
    { to: "/admin/clients", label: "Clients", icon: Users },
    { to: "/admin/billing", label: "Billing", icon: Receipt },
    { to: "/admin/hr", label: "HR (Uganda)", icon: Briefcase },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/schoolpay", label: "SchoolPay", icon: GraduationCap },
    { to: "/admin/cms", label: "Site CMS", icon: Settings },
  ],
};

export function PortalShell({
  kind,
  children,
}: {
  kind: PortalKind;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      setEmail(data.session.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
      else setEmail(session.user.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading portal…</div>
      </div>
    );
  }

  const items = links[kind];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar md:flex">
        <Link to="/" className="flex h-16 items-center gap-2.5 border-b border-border/60 px-5">
          <img src={logo} alt="TennaHub" className="h-8 w-8" />
          <div className="leading-none">
            <div className="font-display text-sm font-bold">TENNAHUB</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {kind === "admin" ? "Admin" : "Client"} Portal
            </div>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((it) => {
            const active = pathname === it.to;
            const isRootRoute = it.to === "/portal" || it.to === "/admin";
            const className = cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            );
            return isRootRoute ? (
              <Link key={it.to} to={it.to} className={className}>
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            ) : (
              <a key={it.to} href={it.to} className={className}>
                <it.icon className="h-4 w-4" />
                {it.label}
                <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/60">soon</span>
              </a>
            );
          })}
          {kind === "client" && (
            <Link
              to="/admin"
              className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-4 w-4" /> Switch to Admin
            </Link>
          )}
          {kind === "admin" && (
            <Link
              to="/portal"
              className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4" /> Switch to Client
            </Link>
          )}
        </nav>
        <div className="border-t border-border/60 p-3">
          <div className="truncate px-2 pb-2 text-xs text-muted-foreground">{email}</div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="flex-1 overflow-x-auto">{children}</div>
    </div>
  );
}

export function PortalHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="border-b border-border/60 bg-card/30 px-6 py-6">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
