import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const formatUGX = (n: number) =>
  "UGX " + new Intl.NumberFormat("en-UG").format(Math.round(n));

async function renderPdf(opts: {
  kind: "INVOICE" | "RECEIPT";
  number: string;
  clientName: string;
  description: string;
  amount: number;
  dateISO: string;
  reference?: string | null;
  method?: string | null;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const indigo = rgb(0.31, 0.27, 0.9);
  const ink = rgb(0.06, 0.07, 0.1);
  const muted = rgb(0.45, 0.47, 0.55);

  // Header band
  page.drawRectangle({ x: 0, y: 772, width: 595, height: 70, color: indigo });
  page.drawText("TENNAHUB TECHNOLOGIES", {
    x: 40, y: 810, size: 18, font: bold, color: rgb(1, 1, 1),
  });
  page.drawText("Networking · Software · SchoolPay Systems", {
    x: 40, y: 790, size: 10, font, color: rgb(0.85, 0.88, 1),
  });
  page.drawText(opts.kind, {
    x: 470, y: 800, size: 22, font: bold, color: rgb(1, 1, 1),
  });

  let y = 740;
  const line = (label: string, value: string, big = false) => {
    page.drawText(label, { x: 40, y, size: 9, font, color: muted });
    page.drawText(value, { x: 160, y, size: big ? 14 : 11, font: big ? bold : font, color: ink });
    y -= big ? 26 : 20;
  };

  line(`${opts.kind} #`, opts.number, true);
  line("Date", new Date(opts.dateISO).toLocaleDateString("en-UG", { dateStyle: "long" }));
  line("Billed to", opts.clientName);
  if (opts.method) line("Method", opts.method);
  if (opts.reference) line("Reference", opts.reference);

  // Description box
  y -= 10;
  page.drawRectangle({ x: 40, y: y - 80, width: 515, height: 80, borderColor: muted, borderWidth: 0.5 });
  page.drawText("Description", { x: 50, y: y - 18, size: 9, font, color: muted });
  page.drawText(opts.description.slice(0, 90), { x: 50, y: y - 38, size: 12, font, color: ink });

  // Total
  y -= 130;
  page.drawText("TOTAL", { x: 40, y, size: 11, font: bold, color: muted });
  page.drawText(formatUGX(opts.amount), {
    x: 400, y: y - 4, size: 20, font: bold, color: indigo,
  });

  // Footer
  page.drawText("Thank you for your business — TennaHub Technologies, Kampala, Uganda", {
    x: 40, y: 40, size: 9, font, color: muted,
  });

  const bytes = await pdf.save();
  return bytes;
}

async function assertCanRead(userId: string, clientId: string) {
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const isStaff = (roles ?? []).some((r) => r.role === "admin" || r.role === "staff");
  if (isStaff) return;
  const { data: c } = await supabaseAdmin.from("clients").select("user_id").eq("id", clientId).single();
  if (!c || c.user_id !== userId) throw new Error("Forbidden");
}

export const renderReceiptPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ receiptId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: r, error } = await supabaseAdmin
      .from("receipts")
      .select("*, clients(name)")
      .eq("id", data.receiptId)
      .single();
    if (error || !r) throw new Error("Receipt not found");
    await assertCanRead(context.userId, r.client_id);
    const bytes = await renderPdf({
      kind: "RECEIPT",
      number: r.id.slice(0, 8).toUpperCase(),
      clientName: (r as any).clients?.name ?? "Client",
      description: r.description,
      amount: Number(r.amount_ugx),
      dateISO: r.paid_at,
      reference: r.reference,
      method: r.method,
    });
    return { base64: Buffer.from(bytes).toString("base64"), filename: `receipt-${r.id.slice(0, 8)}.pdf` };
  });

export const renderInvoicePdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ invoiceId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: r, error } = await supabaseAdmin
      .from("invoices")
      .select("*, clients(name)")
      .eq("id", data.invoiceId)
      .single();
    if (error || !r) throw new Error("Invoice not found");
    await assertCanRead(context.userId, r.client_id);
    const bytes = await renderPdf({
      kind: "INVOICE",
      number: r.number ?? r.id.slice(0, 8).toUpperCase(),
      clientName: (r as any).clients?.name ?? "Client",
      description: r.description,
      amount: Number(r.amount_ugx),
      dateISO: r.created_at,
    });
    return { base64: Buffer.from(bytes).toString("base64"), filename: `invoice-${r.id.slice(0, 8)}.pdf` };
  });
