import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/auth";
import { query } from "../../../lib/db";
import cookie from "cookie";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  // Parse token from cookies
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const decoded: any = verifyToken(token);
  if (!decoded || !decoded.data || !decoded.data.user || !decoded.data.user.id) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const userId = decoded.data.user.id;

  try {
    await query("DELETE FROM wp_user_cart WHERE user_id=?", [userId]);
    res.status(200).json({ cart: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
}
