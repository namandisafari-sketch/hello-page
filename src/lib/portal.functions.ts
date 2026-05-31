import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyPortal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: clients } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .limit(1);
    const client = clients?.[0] ?? null;
    if (!client) return { client: null, agreements: [], invoices: [], receipts: [] };
    const [agreements, invoices, receipts] = await Promise.all([
      supabase.from("agreements").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabase.from("invoices").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabase.from("receipts").select("*").eq("client_id", client.id).order("paid_at", { ascending: false }),
    ]);
    return {
      client,
      agreements: agreements.data ?? [],
      invoices: invoices.data ?? [],
      receipts: receipts.data ?? [],
    };
  });
