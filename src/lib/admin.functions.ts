import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertStaff(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const ok = (data ?? []).some((r) => r.role === "admin" || r.role === "staff");
  if (!ok) throw new Error("Forbidden: staff role required");
}

/** Promote the calling user to admin IF the system has zero admins. */
export const claimAdminBootstrap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("Admin already configured");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const [clients, invoices, projects, schools, hr, recent] = await Promise.all([
      supabaseAdmin.from("clients").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("invoices").select("amount_ugx, status"),
      supabaseAdmin.from("projects").select("*", { count: "exact", head: true }).neq("status", "delivered"),
      supabaseAdmin.from("schoolpay_schools").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("hr_staff").select("gross_pay_ugx, nssf_ugx, paye_ugx, lst_ugx, status"),
      supabaseAdmin
        .from("invoices")
        .select("id, description, amount_ugx, status, created_at, clients(name)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const revenue = (invoices.data ?? [])
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + Number(i.amount_ugx), 0);
    const hrAgg = (hr.data ?? []).reduce(
      (acc, r) => ({
        gross: acc.gross + Number(r.gross_pay_ugx),
        nssf: acc.nssf + Number(r.nssf_ugx),
        paye: acc.paye + Number(r.paye_ugx),
        lst: acc.lst + Number(r.lst_ugx),
        active: acc.active + (r.status === "active" ? 1 : 0),
      }),
      { gross: 0, nssf: 0, paye: 0, lst: 0, active: 0 },
    );

    return {
      counts: {
        clients: clients.count ?? 0,
        openProjects: projects.count ?? 0,
        schoolpaySchools: schools.count ?? 0,
      },
      revenue,
      hr: hrAgg,
      recentInvoices: recent.data ?? [],
    };
  });

export const listClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(200),
        contact_email: z.string().email().nullish(),
        contact_phone: z.string().max(40).nullish(),
        location: z.string().max(200).nullish(),
        plan: z.string().max(120).nullish(),
        notes: z.string().max(2000).nullish(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin.from("clients").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listBilling = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const [invoices, receipts, payouts] = await Promise.all([
      supabaseAdmin
        .from("invoices")
        .select("*, clients(name)")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("receipts")
        .select("*, clients(name)")
        .order("paid_at", { ascending: false })
        .limit(50),
      supabaseAdmin.from("worker_payments").select("*").order("paid_at", { ascending: false }).limit(50),
    ]);
    return {
      invoices: invoices.data ?? [],
      receipts: receipts.data ?? [],
      payouts: payouts.data ?? [],
    };
  });

export const listHR = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*, clients(name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const listSchoolpay = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const [schools, events] = await Promise.all([
      supabaseAdmin.from("schoolpay_schools").select("*").order("created_at", { ascending: false }),
      supabaseAdmin
        .from("schoolpay_events")
        .select("*, schoolpay_schools(name)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    return { schools: schools.data ?? [], events: events.data ?? [] };
  });

export const listCms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin.from("cms_content").select("*").order("key");
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertCms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        key: z.string().min(1).max(120).regex(/^[a-z0-9_.-]+$/),
        value: z.unknown(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("cms_content")
      .upsert({ key: data.key, value: data.value as any }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
