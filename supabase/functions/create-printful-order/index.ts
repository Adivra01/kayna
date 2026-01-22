import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PRINTFUL_API_URL = "https://api.printful.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  product_title: string;
  product_image: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  printful_variant_id?: string;
  printful_sync_product_id?: string;
}

interface CreateOrderRequest {
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    country: string;
    zip: string;
  };
  items: OrderItem[];
  discount_code?: string;
  affiliate_code?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get user from auth header if present
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData.user?.id || null;
    }

    const orderRequest: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!orderRequest.customer?.name || !orderRequest.customer?.email) {
      return new Response(
        JSON.stringify({ error: "Customer name and email required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!orderRequest.shipping?.address1 || !orderRequest.shipping?.city || !orderRequest.shipping?.country || !orderRequest.shipping?.zip) {
      return new Response(
        JSON.stringify({ error: "Complete shipping address required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!orderRequest.items?.length) {
      return new Response(
        JSON.stringify({ error: "Order must contain at least one item" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate totals
    const subtotal = orderRequest.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    let discountAmount = 0;
    let affiliateId: string | null = null;

    // Check discount code
    if (orderRequest.discount_code) {
      const { data: coupon } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", orderRequest.discount_code.toUpperCase())
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

          // Increment coupon usage
          await supabase
            .from("discount_coupons")
            .update({ current_uses: (coupon.current_uses || 0) + 1 })
            .eq("id", coupon.id);
        }
      }
    }

    // Check affiliate code
    if (orderRequest.affiliate_code) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id")
        .eq("affiliate_code", orderRequest.affiliate_code)
        .eq("status", "approved")
        .single();

      if (affiliate) {
        affiliateId = affiliate.id;
      }
    }

    // Estimate shipping cost (we'll use a flat rate for now, or call Printful shipping API)
    const shippingCost = 5.99; // Default flat rate

    const total = subtotal - discountAmount + shippingCost;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: orderRequest.customer.email,
        phone: orderRequest.customer.phone,
        customer_name: orderRequest.customer.name,
        shipping_address_1: orderRequest.shipping.address1,
        shipping_address_2: orderRequest.shipping.address2,
        shipping_city: orderRequest.shipping.city,
        shipping_state: orderRequest.shipping.state,
        shipping_country: orderRequest.shipping.country,
        shipping_zip: orderRequest.shipping.zip,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: discountAmount,
        total,
        discount_code: orderRequest.discount_code,
        affiliate_id: affiliateId,
        affiliate_code: orderRequest.affiliate_code,
        status: "pending",
        payment_status: "pending",
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
    const orderItems = orderRequest.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_title: item.product_title,
      product_image: item.product_image,
      size: item.size,
      color: item.color,
      printful_variant_id: item.printful_variant_id,
      printful_sync_product_id: item.printful_sync_product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Log initial status
    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      message: "Commande créée, en attente de paiement",
    });

    // Return order info (payment will be handled separately)
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});