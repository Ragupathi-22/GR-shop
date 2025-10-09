import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/auth";
import { query } from "../../../lib/db";
import cookie from "cookie";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
//   try {
//     // 1. Parse JWT token from cookie
//     const cookies = cookie.parse(req.headers.cookie || "");
//     const token = cookies.token;
//     if (!token) return res.status(401).json({ message: "Not authenticated" });
//     const decoded: any = verifyToken(token);
//     if (!decoded?.data?.user?.id) return res.status(401).json({ message: "Invalid token" });
//     const userId = decoded.data.user.id;

//     // 2. Get user cart
//     const cartResult = await query("SELECT * FROM wp_user_cart WHERE user_id = ?", [userId]);
//     const cartItems: any[] = Array.isArray(cartResult) ? cartResult : [];
//     if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

//     // 3. Prepare WooCommerce order line items
//     const line_items = await Promise.all(cartItems.map(async (item) => {
//       const productRes = await fetch(
//         `${process.env.WP_URL}/wp-json/wc/v3/products/${item.product_id}?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`
//       );
//       const product = await productRes.json();
//       return {
//         product_id: item.product_id,
//         quantity: item.quantity,
//         price: product.price,
//       };
//     }));

//     // 4.Create WooCommerce order (customer_id MUST be WP user_id)
//     const orderData = {
//       payment_method: "cod",
//       payment_method_title: "Cash on Delivery",
//       set_paid: false,
//       customer_id: userId,
//       line_items,
//       status: "pending"
//     };
//     const orderRes = await fetch(
//       `${process.env.WP_URL}/wp-json/wc/v3/orders?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
//       { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) }
//     );
//     const order = await orderRes.json();
//     if (!order.id || !order.order_key) {
//       console.error("WooCommerce order creation failed", order);
//       return res.status(500).json({ message: "Failed to create order" });
//     }

//     // 5. Generate autologin token
//     const autoLoginRes = await fetch(
//       `${process.env.WP_URL}/wp-json/custom/v1/generate-autologin?user_id=${userId}`
//     );
//     const { token: autoLoginToken } = await autoLoginRes.json();
//     if (!autoLoginToken) {
//       console.error("Auto-login token generation failed");
//       return res.status(500).json({ message: "Auto-login token failed" });
//     }

//     // 6. Prepare full redirect, including correct order_key
//     const checkoutRelative = `/Ragu/gr/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
//     const checkoutUrl = `${process.env.WP_URL}/custom-autologin?token=${autoLoginToken}&redirect=${encodeURIComponent(checkoutRelative)}`;

//     // 7. Optionally clear cart if desired:
//     await query("DELETE FROM wp_user_cart WHERE user_id = ?", [userId]);

//     return res.status(200).json({
//       success: true,
//       orderId: order.id,
//       checkoutUrl,
//     });
//   } catch (err: any) {
//     console.error("Order creation failed:", err);
//     res.status(500).json({ message: err.message || "Server error" });
//   }
// }


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
//   try {
//     const cookies = cookie.parse(req.headers.cookie || "");
//     const token = cookies.token;
//     if (!token) return res.status(401).json({ message: "Not authenticated" });
//     const decoded: any = verifyToken(token);
//     if (!decoded?.data?.user?.id) return res.status(401).json({ message: "Invalid token" });
//     const userId = decoded.data.user.id;

//     const { address, paymentMethod } = req.body; // Receive address & paymentMethod from frontend

//     const cartResult = await query("SELECT * FROM wp_user_cart WHERE user_id = ?", [userId]);
//     const cartItems: any[] = Array.isArray(cartResult) ? cartResult : [];
//     if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

//     const line_items = await Promise.all(cartItems.map(async (item) => {
//       const productRes = await fetch(
//         `${process.env.WP_URL}/wp-json/wc/v3/products/${item.product_id}?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`
//       );
//       const product = await productRes.json();
//       return {
//         product_id: item.product_id,
//         quantity: item.quantity,
//         price: product.price,
//       };
//     }));

//     // Map paymentMethod to WooCommerce payment slugs if needed
//     const paymentMethodSlug = paymentMethod === 'credit_card' ? 'cod' : paymentMethod; 

//     const orderData = {
//       payment_method: paymentMethodSlug,
//       payment_method_title: paymentMethodSlug === 'cod' ? 'Cash on Delivery' : paymentMethodSlug,
//       set_paid: false,
//       customer_id: userId,
//       line_items,
//       billing: address?.billing,
//       shipping: address?.shipping,
//       status: "pending",
//     };

//     const orderRes = await fetch(
//       `${process.env.WP_URL}/wp-json/wc/v3/orders?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       }
//     );
//     const order = await orderRes.json();
//     if (!order.id || !order.order_key) {
//       console.error("WooCommerce order creation failed", order);
//       return res.status(500).json({ message: "Failed to create order" });
//     }

//     const autoLoginRes = await fetch(
//       `${process.env.WP_URL}/wp-json/custom/v1/generate-autologin?user_id=${userId}`
//     );
//     const { token: autoLoginToken } = await autoLoginRes.json();
//     if (!autoLoginToken) {
//       console.error("Auto-login token generation failed");
//       return res.status(500).json({ message: "Auto-login token failed" });
//     }

//     const checkoutRelative = `/Ragu/gr/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
//     const checkoutUrl = `${process.env.WP_URL}/custom-autologin?token=${autoLoginToken}&redirect=${encodeURIComponent(checkoutRelative)}`;

//     // Optionally clear cart here or via webhook after payment success
//     // await query("DELETE FROM wp_user_cart WHERE user_id = ?", [userId]);

//     return res.status(200).json({
//       success: true,
//       orderId: order.id,
//       checkoutUrl,
//     });
//   } catch (err: any) {
//     console.error("Order creation failed:", err);
//     res.status(500).json({ message: err.message || "Server error" });
//   }
// }




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { address, paymentMethod, paymentDetails } = req.body;
  if (!address || !paymentMethod || !["cod", "razorpay"].includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // Authenticate user
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded: any = verifyToken(token);
    if (!decoded?.data?.user?.id) return res.status(401).json({ message: "Invalid token" });
    const userId = decoded.data.user.id;

    // Get cart
    const cartResult = await query("SELECT * FROM wp_user_cart WHERE user_id = ?", [userId]);
    const cartItems: any[] = Array.isArray(cartResult) ? cartResult : [];
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const line_items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    // Prepare WooCommerce order data
    const orderData: any = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay",
      set_paid: paymentMethod === "razorpay",
      customer_id: userId,
      line_items,
      billing: address.billing,
      shipping: address.shipping,
      status: paymentMethod === "cod" ? "pending" : "processing",
      meta_data: [],
    };

    // Add Razorpay payment info to meta_data
    if (paymentMethod === "razorpay" && paymentDetails) {
      orderData.meta_data.push(
        { key: "_transaction_id", value: paymentDetails.razorpay_payment_id },
        { key: "_payment_method_title", value: "Razorpay" },
        { key: "_payment_method", value: "razorpay" }
      );
    }

    // Create order in WooCommerce
    const orderRes = await fetch(
      `${process.env.WP_URL}/wp-json/wc/v3/orders?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );

    const order = await orderRes.json();
    if (!order.id) {
      console.error("Failed to create order", order);
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Clear user cart
    await query("DELETE FROM wp_user_cart WHERE user_id = ?", [userId]);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      orderKey: order.order_key,
      total: order.total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

