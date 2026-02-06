import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");

  if (!printfulApiKey) {
    return new Response(
      JSON.stringify({ error: "PRINTFUL_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // --- AUTH: Admin-only ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // --- Setup webhooks ---
    const webhookUrl = `${supabaseUrl}/functions/v1/printful-webhook`;

    // Get existing webhooks
    const existingResponse = await fetch("https://api.printful.com/webhooks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
    });

    const existingData = await existingResponse.json();
    console.log("Existing webhooks:", existingData);

    const webhookPayload = {
      url: webhookUrl,
      types: [
        "order_created",
        "order_updated",
        "order_failed",
        "order_canceled",
        "package_shipped",
        "package_returned",
        "order_put_hold",
        "order_put_hold_approval",
        "order_remove_hold",
      ],
    };

    const registerResponse = await fetch("https://api.printful.com/webhooks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      if (registerData.error?.message?.includes("already exists") || registerData.code === 400) {
        // Delete and re-register
        await fetch("https://api.printful.com/webhooks", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${printfulApiKey}`,
            "Content-Type": "application/json",
          },
        });

        const retryResponse = await fetch("https://api.printful.com/webhooks", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${printfulApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        const retryData = await retryResponse.json();

        return new Response(
          JSON.stringify({
            success: retryResponse.ok,
            message: retryResponse.ok ? "Webhook re-registered successfully" : "Failed to re-register webhook",
            data: retryData,
          }),
          {
            status: retryResponse.ok ? 200 : 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: registerData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook registered successfully",
        events: webhookPayload.types,
        data: registerData,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Setup error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
