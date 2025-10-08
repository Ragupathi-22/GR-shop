import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { verifyToken } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { getFullCart } from "../../../lib/cart";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded: any = verifyToken(token);
  if (!decoded?.data?.user?.id)
    return res.status(401).json({ message: "Invalid token" });

  const userId = decoded.data.user.id;
  const { id, quantity ,userEmail} = req.body;

  try {
    const existing = (await query(
      "SELECT * FROM wp_user_cart WHERE user_id=? AND product_id=?",
      [userId, id]
    )) as any[];

    if (existing.length > 0) {
      await query("UPDATE wp_user_cart SET quantity = quantity + ? WHERE id = ?", [
        quantity,
        existing[0].id,
      ]);
    } else {
      await query(
        "INSERT INTO wp_user_cart (user_id, user_email, product_id, quantity) VALUES (?, ?, ?, ?)",
        [userId, userEmail, id, quantity] // ✅ include email
      );
    }

    // ✅ Fetch full cart details using common function
    const cart = await getFullCart(userId);
    res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err instanceof Error ? err.message : "Server error" });
  }
}
