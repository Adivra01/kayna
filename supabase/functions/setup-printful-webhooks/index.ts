import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!printfulApiKey) {
    return new Response(JSON.stringify({ error: "PRINTFUL_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const webhookUrl = `${supabaseUrl}/functions/v1/printful-webhook`;

  try {
    // First, get existing webhooks
    const existingResponse = await fetch("https://api.printful.com/webhooks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
    });

    const existingData = await existingResponse.json();
    console.log("Existing webhooks:", existingData);

    // Register new webhook with all important events
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

    console.log("Registering webhook:", webhookPayload);

    const registerResponse = await fetch("https://api.printful.com/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    const registerData = await registerResponse.json();
    console.log("Register response:", registerData);

    if (!registerResponse.ok) {
      // If webhook already exists, try to update it
      if (registerData.error?.message?.includes("already exists") || registerData.code === 400) {
        console.log("Webhook exists, attempting to disable and re-register...");
        
        // Disable existing webhook
        await fetch("https://api.printful.com/webhooks", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${printfulApiKey}`,
            "Content-Type": "application/json",
          },
        });

        // Re-register
        const retryResponse = await fetch("https://api.printful.com/webhooks", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${printfulApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        const retryData = await retryResponse.json();
        console.log("Retry response:", retryData);

        return new Response(JSON.stringify({
          success: retryResponse.ok,
          message: retryResponse.ok ? "Webhook re-registered successfully" : "Failed to re-register webhook",
          webhook_url: webhookUrl,
          data: retryData,
        }), {
          status: retryResponse.ok ? 200 : 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: registerData,
        webhook_url: webhookUrl,
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Webhook registered successfully",
      webhook_url: webhookUrl,
      events: webhookPayload.types,
      data: registerData,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Setup error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(JSON.stringify({ 
      error: message,
      webhook_url: webhookUrl,
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
