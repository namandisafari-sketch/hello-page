import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PayloadSchema = z.object({
  event_type: z.string().min(1).max(80),
  school_code: z.string().min(1).max(80),
  student_ref: z.string().min(1).max(120).optional(),
  amount_ugx: z.number().int().nonnegative().optional(),
  balance_ugx: z.number().int().optional(),
});

function verify(signature: string | null, body: string, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/schoolpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.SCHOOLPAY_WEBHOOK_SECRET;
        if (!secret) {
          return new Response("Webhook secret not configured", { status: 503 });
        }
        const body = await request.text();
        if (!verify(request.headers.get("x-schoolpay-signature"), body, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed;
        try {
          parsed = PayloadSchema.parse(JSON.parse(body));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const { data: school } = await supabaseAdmin
          .from("schoolpay_schools")
          .select("id, gate_access_enabled")
          .eq("code", parsed.school_code)
          .maybeSingle();

        await supabaseAdmin.from("schoolpay_events").insert({
          school_id: school?.id ?? null,
          event_type: parsed.event_type,
          student_ref: parsed.student_ref ?? null,
          amount_ugx: parsed.amount_ugx ?? null,
          payload: parsed as any,
        });

        // Gate-access decision (sample logic)
        let gate_access: "allow" | "deny" | "ignored" = "ignored";
        if (school?.gate_access_enabled && parsed.event_type === "gate_check") {
          gate_access = (parsed.balance_ugx ?? 0) >= 0 ? "allow" : "deny";
        }

        return Response.json({ ok: true, gate_access });
      },
    },
  },
});
