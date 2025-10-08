//Return cart full dtails for a user
import { query } from "./db";

type CartRow = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  attributes: string | null;
};

export type CartItem = {
  id: number;
  quantity: number;
  attributes: Record<string, any>;
  name: string;
  price: number;
  image: string;
};

export async function getFullCart(userId: number): Promise<CartItem[]> {
  // 1️⃣ Fetch cart rows
  const cartRows = (await query("SELECT * FROM wp_user_cart WHERE user_id=?", [userId])) as CartRow[];

  // 2️⃣ Enrich with WooCommerce product details
  const cartWithDetails: CartItem[] = await Promise.all(
    cartRows.map(async (item) => {
      try {
        const res = await fetch(
          `${process.env.WP_URL}/wp-json/wc/v3/products/${item.product_id}?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`
        );
        const prod = await res.json();
        return {
          id: item.product_id,
          quantity: item.quantity,
          attributes: item.attributes ? JSON.parse(item.attributes) : {},
          name: prod.name || "Unknown Product",
          price: parseFloat(prod.price) || 0,
          image: prod.images?.[0]?.src || "",
        };
      } catch (err) {
        console.error("Failed to fetch product", item.product_id, err);
        return {
          id: item.product_id,
          quantity: item.quantity,
          attributes: item.attributes ? JSON.parse(item.attributes) : {},
          name: "Unknown Product",
          price: 0,
          image: "",
        };
      }
    })
  );

  return cartWithDetails;
}
