import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      recipient: {
        name: string;
        email: string;
        phone: string;
        address1: string;
        address2: string;
        city: string;
        state_code: string;
        country_code: string;
        zip: string;
      };
      items: Array<{
        id: number;
        external_id: string;
        variant_id: number;
        sync_variant_id: number;
        quantity: number;
        name: string;
        price: string;
      }>;
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
        items: Array<{
          item_id: number;
          quantity: number;
        }>;
        estimated_delivery_dates: {
          from: string;
          to: string;
        };
      }>;
      retail_costs: {
        currency: string;
        subtotal: string;
        discount: string;
        shipping: string;
        tax: string;
        total: string;
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const payload: PrintfulWebhookPayload = await req.json();
    
    console.log("Received Printful webhook:", payload.type);

    // Log the webhook for debugging
    await supabase.from("printful_webhook_logs").insert({
      event_type: payload.type,
      payload: payload,
      processed: false,
    });

    const order = payload.data?.order;
    if (!order?.external_id) {
      console.log("No external_id in webhook, skipping");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map Printful status to our status
    const statusMap: Record<string, { status: string; printfulStatus: string }> = {
      "draft": { status: "pending", printfulStatus: "draft" },
      "pending": { status: "processing", printfulStatus: "pending" },
      "failed": { status: "failed", printfulStatus: "failed" },
      "canceled": { status: "canceled", printfulStatus: "canceled" },
      "inprocess": { status: "processing", printfulStatus: "inprocess" },
      "onhold": { status: "processing", printfulStatus: "onhold" },
      "partial": { status: "processing", printfulStatus: "partial" },
      "fulfilled": { status: "shipped", printfulStatus: "fulfilled" },
    };

    switch (payload.type) {
      case "order_created": {
        // Order created in Printful
        const mapped = statusMap[order.status] || { status: "processing", printfulStatus: order.status };
        
        await supabase
          .from("orders")
          .update({
            printful_order_id: order.id.toString(),
            printful_status: mapped.printfulStatus,
            status: mapped.status,
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} created in Printful with ID ${order.id}`);
        break;
      }

      case "order_updated": {
        // Order status changed
        const mapped = statusMap[order.status] || { status: "processing", printfulStatus: order.status };
        
        await supabase
          .from("orders")
          .update({
            printful_status: mapped.printfulStatus,
            status: mapped.status,
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} updated to status: ${order.status}`);
        break;
      }

      case "order_failed": {
        // Order failed in Printful
        await supabase
          .from("orders")
          .update({
            printful_status: "failed",
            status: "failed",
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} failed in Printful`);
        break;
      }

      case "order_canceled": {
        // Order canceled
        await supabase
          .from("orders")
          .update({
            printful_status: "canceled",
            status: "canceled",
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} canceled`);
        break;
      }

      case "package_shipped": {
        // Package shipped - get tracking info
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

        await supabase
          .from("orders")
          .update(updateData)
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} shipped with tracking: ${shipment?.tracking_number}`);
        break;
      }

      case "package_returned": {
        // Package returned to Printful
        await supabase
          .from("orders")
          .update({
            printful_status: "returned",
            status: "failed",
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} package returned`);
        break;
      }

      case "order_put_hold":
      case "order_put_hold_approval": {
        // Order put on hold
        await supabase
          .from("orders")
          .update({
            printful_status: "onhold",
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} put on hold`);
        break;
      }

      case "order_remove_hold": {
        // Order removed from hold
        await supabase
          .from("orders")
          .update({
            printful_status: "pending",
            status: "processing",
          })
          .eq("id", order.external_id);
        
        console.log(`Order ${order.external_id} removed from hold`);
        break;
      }

      default:
        console.log(`Unhandled webhook type: ${payload.type}`);
    }

    // Mark webhook as processed
    await supabase
      .from("printful_webhook_logs")
      .update({ processed: true })
      .eq("payload->data->order->external_id", order.external_id)
      .eq("event_type", payload.type);

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