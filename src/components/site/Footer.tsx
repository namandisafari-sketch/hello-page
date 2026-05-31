import { Link } from "@tanstack/react-router";
import logo from "@/assets/tennahub-logo.png";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="TennaHub" className="h-10 w-10" />
            <div className="leading-none">
              <div className="font-display text-base font-bold">TENNAHUB</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Technologies
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Advanced networking, software systems, and SchoolPay-integrated
            management platforms — engineered in Uganda for the world.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">What We Do</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/partners" className="hover:text-foreground">Partners</Link></li>
            <li><Link to="/eligibility" className="hover:text-foreground">Why Trust Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/api-schoolpay" className="hover:text-foreground">SchoolPay API</Link></li>
            <li><Link to="/portal" className="hover:text-foreground">Client Portal</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin Console</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Reach us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Kampala, Uganda</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +256 700 000 000</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@tennahub.tech</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} TennaHub Technologies. All rights reserved.</p>
          <p>Kampala · Engineered for trust.</p>
        </div>
      </div>
    </footer>
  );
}
