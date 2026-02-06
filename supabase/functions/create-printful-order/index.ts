import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Input sanitization helpers
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength).replace(/[<>]/g, "");
}

function sanitizeEmail(input: unknown): string | null {
  const email = sanitizeString(input, 255).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
}

function sanitizePhone(input: unknown): string | null {
  if (!input || typeof input !== "string") return null;
  const cleaned = input.replace(/[^0-9+\-() ]/g, "").slice(0, 20);
  return cleaned || null;
}

function sanitizeNumber(input: unknown): number {
  const num = Number(input);
  return isFinite(num) && num >= 0 ? num : 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get user from auth header (required for authenticated users, optional for guest checkout)
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData.user?.id || null;
    }

    const body = await req.json();

    // --- Sanitize and validate all inputs ---
    const customerName = sanitizeString(body.customer?.name, 100);
    const customerEmail = sanitizeEmail(body.customer?.email);
    const customerPhone = sanitizePhone(body.customer?.phone);

    if (!customerName || customerName.length < 2) {
      return new Response(
        JSON.stringify({ error: "Valid customer name required (2-100 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: "Valid customer email required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shippingAddress1 = sanitizeString(body.shipping?.address1, 200);
    const shippingAddress2 = sanitizeString(body.shipping?.address2, 200) || null;
    const shippingCity = sanitizeString(body.shipping?.city, 100);
    const shippingState = sanitizeString(body.shipping?.state, 100) || null;
    const shippingCountry = sanitizeString(body.shipping?.country, 5);
    const shippingZip = sanitizeString(body.shipping?.zip, 20);

    if (!shippingAddress1 || !shippingCity || !shippingCountry || !shippingZip) {
      return new Response(
        JSON.stringify({ error: "Complete shipping address required (address, city, country, zip)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return new Response(
        JSON.stringify({ error: "Order must contain 1-50 items" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize items
    const sanitizedItems = body.items.map((item: Record<string, unknown>) => ({
      product_id: sanitizeString(item.product_id, 50),
      product_title: sanitizeString(item.product_title, 200),
      product_image: sanitizeString(item.product_image, 500),
      size: sanitizeString(item.size, 10),
      color: sanitizeString(item.color, 30),
      quantity: Math.min(Math.max(Math.floor(sanitizeNumber(item.quantity)), 1), 100),
      unit_price: sanitizeNumber(item.unit_price),
      printful_variant_id: item.printful_variant_id ? sanitizeString(item.printful_variant_id, 50) : null,
      printful_sync_product_id: item.printful_sync_product_id ? sanitizeString(item.printful_sync_product_id, 50) : null,
    }));

    // Validate each item has required fields
    for (const item of sanitizedItems) {
      if (!item.product_title || item.unit_price <= 0 || item.quantity <= 0) {
        return new Response(
          JSON.stringify({ error: "Each item must have a title, valid price, and quantity" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Calculate totals
    const subtotal = sanitizedItems.reduce(
      (sum: number, item: { unit_price: number; quantity: number }) => sum + item.unit_price * item.quantity,
      0
    );
    let discountAmount = 0;
    let affiliateId: string | null = null;

    // Check discount code
    const discountCode = sanitizeString(body.discount_code, 50).toUpperCase();
    if (discountCode) {
      const { data: coupon } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", discountCode)
        .eq("is_active", true)
        .single();

      if (coupon) {
        const now = new Date();
        const startDate = coupon.start_date ? new Date(coupon.start_date) : null;
        const endDate = coupon.end_date ? new Date(coupon.end_date) : null;
        const isValidDate = (!startDate || now >= startDate) && (!endDate || now <= endDate);
        const hasUsesLeft = !coupon.max_uses || coupon.current_uses < coupon.max_uses;

        if (isValidDate && hasUsesLeft) {
          if (coupon.discount_type === "percentage") {
            discountAmount = subtotal * (coupon.discount_value / 100);
          } else {
            discountAmount = Math.min(coupon.discount_value, subtotal);
          }

          await supabase
            .from("discount_coupons")
            .update({ current_uses: (coupon.current_uses || 0) + 1 })
            .eq("id", coupon.id);
        }
      }
    }

    // Check affiliate code
    const affiliateCode = sanitizeString(body.affiliate_code, 20);
    if (affiliateCode) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id")
        .eq("affiliate_code", affiliateCode)
        .eq("status", "approved")
        .single();

      if (affiliate) {
        affiliateId = affiliate.id;
      }
    }

    const shippingCost = 5000;
    const total = subtotal - discountAmount + shippingCost;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: customerEmail,
        phone: customerPhone,
        customer_name: customerName,
        shipping_address_1: shippingAddress1,
        shipping_address_2: shippingAddress2,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_country: shippingCountry,
        shipping_zip: shippingZip,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: discountAmount,
        total,
        discount_code: discountCode || null,
        affiliate_id: affiliateId,
        affiliate_code: affiliateCode || null,
        status: "pending",
        payment_status: "pending",
        payment_method: sanitizeString(body.payment_method, 30) || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order items
    const orderItems = sanitizedItems.map((item: Record<string, unknown>) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_title: item.product_title,
      product_image: item.product_image || null,
      size: item.size || null,
      color: item.color || null,
      printful_variant_id: item.printful_variant_id || null,
      printful_sync_product_id: item.printful_sync_product_id || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: (item.unit_price as number) * (item.quantity as number),
    }));

    await supabase.from("order_items").insert(orderItems);

    // Log initial status
    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      message: "Commande créée, en attente de paiement",
    });

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          subtotal,
          shipping_cost: shippingCost,
          discount_amount: discountAmount,
          total,
          status: order.status,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Create order error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your order. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
