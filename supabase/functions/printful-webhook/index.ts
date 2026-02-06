import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Known Printful webhook event types for validation
const VALID_EVENT_TYPES = new Set([
  "order_created",
  "order_updated",
  "order_failed",
  "order_canceled",
  "package_shipped",
  "package_returned",
  "order_put_hold",
  "order_put_hold_approval",
  "order_remove_hold",
]);

interface PrintfulWebhookPayload {
  type: string;
  created: number;
  retries: number;
  store: number;
  data: {
    order: {
      id: number;
      external_id: string;
      status: string;
      shipping: string;
      shipping_service_name: string;
      created: number;
      updated: number;
      recipient: Record<string, unknown>;
      items: Array<Record<string, unknown>>;
      shipments: Array<{
        id: number;
        carrier: string;
        service: string;
        tracking_number: string;
        tracking_url: string;
        created: number;
        ship_date: string;
        shipped_at: number;
        reshipment: boolean;
        items: Array<{ item_id: number; quantity: number }>;
        estimated_delivery_dates: { from: string; to: string };
      }>;
      retail_costs: Record<string, string>;
    };
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests for webhooks
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const payload: PrintfulWebhookPayload = await req.json();

    // --- Webhook source validation ---
    // 1. Validate payload structure (Printful-specific fields)
    if (
      typeof payload.type !== "string" ||
      typeof payload.created !== "number" ||
      typeof payload.store !== "number" ||
      !payload.data
    ) {
      console.error("Invalid webhook payload structure");
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate event type against whitelist
    if (!VALID_EVENT_TYPES.has(payload.type)) {
      console.log(`Unknown webhook type: ${payload.type}, logging but not processing`);
      await supabase.from("printful_webhook_logs").insert({
        event_type: payload.type,
        payload: payload as unknown as Record<string, unknown>,
        processed: false,
        error: "Unknown event type",
      });
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Validate timestamp (reject payloads older than 1 hour to prevent replay attacks)
    const payloadAge = Date.now() / 1000 - payload.created;
    if (payloadAge > 3600 || payloadAge < -300) {
      console.error("Webhook timestamp out of range:", payloadAge);
      return new Response(JSON.stringify({ error: "Invalid timestamp" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Received Printful webhook:", payload.type);

    // Log the webhook
    await supabase.from("printful_webhook_logs").insert({
      event_type: payload.type,
      payload: payload as unknown as Record<string, unknown>,
      processed: false,
    });

    const order = payload.data?.order;
    if (!order?.external_id) {
      console.log("No external_id in webhook, skipping");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate external_id is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(order.external_id)) {
      console.error("Invalid external_id format:", order.external_id);
      return new Response(JSON.stringify({ error: "Invalid external_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map Printful status to our status
    const statusMap: Record<string, { status: string; printfulStatus: string }> = {
      draft: { status: "pending", printfulStatus: "draft" },
      pending: { status: "processing", printfulStatus: "pending" },
      failed: { status: "failed", printfulStatus: "failed" },
      canceled: { status: "canceled", printfulStatus: "canceled" },
      inprocess: { status: "processing", printfulStatus: "inprocess" },
      onhold: { status: "processing", printfulStatus: "onhold" },
      partial: { status: "processing", printfulStatus: "partial" },
      fulfilled: { status: "shipped", printfulStatus: "fulfilled" },
    };

    switch (payload.type) {
      case "order_created": {
        const mapped = statusMap[order.status] || { status: "processing", printfulStatus: order.status };
        await supabase
          .from("orders")
          .update({
            printful_order_id: order.id.toString(),
            printful_status: mapped.printfulStatus,
            status: mapped.status,
          })
          .eq("id", order.external_id);
        break;
      }

      case "order_updated": {
        const mapped = statusMap[order.status] || { status: "processing", printfulStatus: order.status };
        await supabase
          .from("orders")
          .update({ printful_status: mapped.printfulStatus, status: mapped.status })
          .eq("id", order.external_id);
        break;
      }

      case "order_failed":
        await supabase
          .from("orders")
          .update({ printful_status: "failed", status: "failed" })
          .eq("id", order.external_id);
        break;

      case "order_canceled":
        await supabase
          .from("orders")
          .update({ printful_status: "canceled", status: "canceled" })
          .eq("id", order.external_id);
        break;

      case "package_shipped": {
        const shipment = order.shipments?.[0];
        const updateData: Record<string, unknown> = {
          printful_status: "shipped",
          status: "shipped",
          shipped_at: new Date().toISOString(),
        };

        if (shipment) {
          updateData.printful_shipping_carrier = shipment.carrier;
          updateData.printful_tracking_number = shipment.tracking_number;
          updateData.printful_tracking_url = shipment.tracking_url;
          if (shipment.estimated_delivery_dates?.to) {
            updateData.printful_estimated_delivery = new Date(shipment.estimated_delivery_dates.to).toISOString();
          }
        }

        await supabase.from("orders").update(updateData).eq("id", order.external_id);
        break;
      }

      case "package_returned":
        await supabase
          .from("orders")
          .update({ printful_status: "returned", status: "failed" })
          .eq("id", order.external_id);
        break;

      case "order_put_hold":
      case "order_put_hold_approval":
        await supabase
          .from("orders")
          .update({ printful_status: "onhold" })
          .eq("id", order.external_id);
        break;

      case "order_remove_hold":
        await supabase
          .from("orders")
          .update({ printful_status: "pending", status: "processing" })
          .eq("id", order.external_id);
        break;
    }

    // Mark webhook as processed
    await supabase
      .from("printful_webhook_logs")
      .update({ processed: true })
      .eq("event_type", payload.type)
      .eq("processed", false);

    return new Response(JSON.stringify({ received: true, type: payload.type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
