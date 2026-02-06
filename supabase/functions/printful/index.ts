import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PRINTFUL_API_URL = "https://api.printful.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Whitelist of allowed actions to prevent injection
const ALLOWED_ACTIONS = new Set([
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
  "delete-webhooks",
]);

interface PrintfulRequest {
  action: string;
  data?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH: Admin-only access ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden: admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Printful API proxy ---
    const PRINTFUL_API_KEY = Deno.env.get("PRINTFUL_API_KEY");
    if (!PRINTFUL_API_KEY) {
      console.error("Missing PRINTFUL_API_KEY configuration");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, data } = (await req.json()) as PrintfulRequest;

    // Validate action against whitelist
    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
    };

    let response: Response;

    switch (action) {
      case "get-store":
        response = await fetch(`${PRINTFUL_API_URL}/store`, { headers });
        break;

      case "get-products":
        response = await fetch(`${PRINTFUL_API_URL}/store/products`, { headers });
        break;

      case "get-product": {
        const productId = String(data?.product_id || "").replace(/[^a-zA-Z0-9_-]/g, "");
        if (!productId) {
          return new Response(
            JSON.stringify({ error: "product_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, { headers });
        break;
      }

      case "get-catalog":
        response = await fetch(`${PRINTFUL_API_URL}/products`, { headers });
        break;

      case "get-catalog-product": {
        const catProductId = String(data?.product_id || "").replace(/[^a-zA-Z0-9_-]/g, "");
        if (!catProductId) {
          return new Response(
            JSON.stringify({ error: "product_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/products/${catProductId}`, { headers });
        break;
      }

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
        break;

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
        break;

      case "get-order": {
        const orderId = String(data?.order_id || "").replace(/[^a-zA-Z0-9_-]/g, "");
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "order_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, { headers });
        break;
      }

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
          body: JSON.stringify({ recipient: data.recipient, items: data.items }),
        });
        break;

      case "get-countries":
        response = await fetch(`${PRINTFUL_API_URL}/countries`, { headers });
        break;

      case "get-webhooks":
        response = await fetch(`${PRINTFUL_API_URL}/webhooks`, { headers });
        break;

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
          body: JSON.stringify({ url: data.url, types: data.types }),
        });
        break;

      case "delete-webhooks":
        response = await fetch(`${PRINTFUL_API_URL}/webhooks`, {
          method: "DELETE",
          headers,
        });
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const result = await response!.json();

    return new Response(JSON.stringify(result), {
      status: response!.ok ? 200 : response!.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Printful API error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
