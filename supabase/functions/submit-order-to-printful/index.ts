import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PRINTFUL_API_URL = "https://api.printful.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmitOrderRequest {
  order_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");

  if (!printfulApiKey) {
    return new Response(
      JSON.stringify({ error: "Printful API key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { order_id }: SubmitOrderRequest = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if order is already submitted
    if (order.printful_order_id) {
      return new Response(
        JSON.stringify({ error: "Order already submitted to Printful", printful_order_id: order.printful_order_id }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check payment status
    if (order.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Order must be paid before submitting to Printful" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);

    if (itemsError || !items?.length) {
      return new Response(
        JSON.stringify({ error: "No items found for order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build Printful order
    const printfulOrder = {
      external_id: order.id,
      shipping: "STANDARD",
      recipient: {
        name: order.customer_name,
        email: order.email,
        phone: order.phone || "",
        address1: order.shipping_address_1,
        address2: order.shipping_address_2 || "",
        city: order.shipping_city,
        state_code: order.shipping_state || "",
        country_code: order.shipping_country,
        zip: order.shipping_zip,
      },
      items: items.map(item => ({
        sync_variant_id: item.printful_sync_product_id ? parseInt(item.printful_sync_product_id) : undefined,
        variant_id: item.printful_variant_id ? parseInt(item.printful_variant_id) : undefined,
        quantity: item.quantity,
        external_id: item.id,
        retail_price: item.unit_price.toString(),
        name: item.product_title,
      })).filter(item => item.sync_variant_id || item.variant_id),
      retail_costs: {
        currency: "EUR",
        subtotal: order.subtotal.toString(),
        discount: order.discount_amount.toString(),
        shipping: order.shipping_cost.toString(),
        tax: "0",
        total: order.total.toString(),
      },
    };

    // Check if we have valid Printful variant IDs
    if (printfulOrder.items.length === 0) {
      // If no Printful variants, we need to handle this differently
      // This could be products not synced with Printful yet
      console.log("No Printful variants found for order items");
      
      await supabase
        .from("orders")
        .update({
          status: "processing",
          printful_status: "manual",
        })
        .eq("id", order_id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Order marked for manual processing - no Printful variants configured",
          requires_manual_processing: true 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Submit to Printful
    const printfulResponse = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printfulOrder),
    });

    const printfulResult = await printfulResponse.json();

    if (!printfulResponse.ok) {
      console.error("Printful API error:", printfulResult);
      
      await supabase
        .from("orders")
        .update({
          printful_status: "failed",
          status: "failed",
        })
        .eq("id", order_id);

      return new Response(
        JSON.stringify({ error: "Printful submission failed", details: printfulResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order with Printful info
    await supabase
      .from("orders")
      .update({
        printful_order_id: printfulResult.result.id.toString(),
        printful_status: printfulResult.result.status,
        status: "processing",
      })
      .eq("id", order_id);

    // Log success
    await supabase.from("order_status_history").insert({
      order_id,
      status: "processing",
      printful_status: printfulResult.result.status,
      message: `Commande envoyée à Printful (ID: ${printfulResult.result.id})`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        printful_order_id: printfulResult.result.id,
        printful_status: printfulResult.result.status,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Submit to Printful error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});