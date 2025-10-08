import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { verifyToken } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { getFullCart } from "../../../lib/cart"; // import your custom function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  // Parse token from cookies
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded: any = verifyToken(token);
  if (!decoded?.data?.user?.id) return res.status(401).json({ message: "Invalid token" });

  const userId = decoded.data.user.id;
  const { productId } = req.body;

  try {
    // Delete item from cart
    await query(
      "DELETE FROM wp_user_cart WHERE user_id=? AND product_id=?",
      [userId, productId]
    );

    // Fetch enriched cart using the common function
    const cart = await getFullCart(userId);

    res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err instanceof Error ? err.message : "Server error" });
  }
}
