import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PRINTFUL_API_URL = "https://api.printful.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PrintfulRequest {
  action: string;
  data?: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PRINTFUL_API_KEY = Deno.env.get("PRINTFUL_API_KEY");
    
    if (!PRINTFUL_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Printful API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, data } = await req.json() as PrintfulRequest;

    const headers = {
      "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
    };

    let response;
    let result;

    switch (action) {
      // Get store info
      case "get-store":
        response = await fetch(`${PRINTFUL_API_URL}/store`, { headers });
        result = await response.json();
        break;

      // Get all products in store
      case "get-products":
        response = await fetch(`${PRINTFUL_API_URL}/store/products`, { headers });
        result = await response.json();
        break;

      // Get specific product
      case "get-product":
        if (!data?.product_id) {
          return new Response(
            JSON.stringify({ error: "product_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/store/products/${data.product_id}`, { headers });
        result = await response.json();
        break;

      // Get catalog (all printful products)
      case "get-catalog":
        response = await fetch(`${PRINTFUL_API_URL}/products`, { headers });
        result = await response.json();
        break;

      // Get specific catalog product with variants
      case "get-catalog-product":
        if (!data?.product_id) {
          return new Response(
            JSON.stringify({ error: "product_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/products/${data.product_id}`, { headers });
        result = await response.json();
        break;

      // Create order (estimate)
      case "estimate-order":
        if (!data?.order) {
          return new Response(
            JSON.stringify({ error: "order data required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/orders/estimate-costs`, {
          method: "POST",
          headers,
          body: JSON.stringify(data.order),
        });
        result = await response.json();
        break;

      // Create order
      case "create-order":
        if (!data?.order) {
          return new Response(
            JSON.stringify({ error: "order data required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/orders`, {
          method: "POST",
          headers,
          body: JSON.stringify(data.order),
        });
        result = await response.json();
        break;

      // Get order status
      case "get-order":
        if (!data?.order_id) {
          return new Response(
            JSON.stringify({ error: "order_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/orders/${data.order_id}`, { headers });
        result = await response.json();
        break;

      // Get shipping rates
      case "get-shipping-rates":
        if (!data?.recipient || !data?.items) {
          return new Response(
            JSON.stringify({ error: "recipient and items required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            recipient: data.recipient,
            items: data.items,
          }),
        });
        result = await response.json();
        break;

      // Get countries list
      case "get-countries":
        response = await fetch(`${PRINTFUL_API_URL}/countries`, { headers });
        result = await response.json();
        break;

      // Get webhooks
      case "get-webhooks":
        response = await fetch(`${PRINTFUL_API_URL}/webhooks`, { headers });
        result = await response.json();
        break;

      // Register webhooks
      case "register-webhooks":
        if (!data?.url || !data?.types) {
          return new Response(
            JSON.stringify({ error: "url and types required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/webhooks`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            url: data.url,
            types: data.types,
          }),
        });
        result = await response.json();
        break;

      // Delete webhooks
      case "delete-webhooks":
        response = await fetch(`${PRINTFUL_API_URL}/webhooks`, {
          method: "DELETE",
          headers,
        });
        result = await response.json();
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action", valid_actions: [
            "get-store",
            "get-products",
            "get-product",
            "get-catalog",
            "get-catalog-product",
            "estimate-order",
            "create-order",
            "get-order",
            "get-shipping-rates",
            "get-countries",
            "get-webhooks",
            "register-webhooks",
            "delete-webhooks"
          ]}),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: response.ok ? 200 : response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: unknown) {
    console.error("Printful API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});