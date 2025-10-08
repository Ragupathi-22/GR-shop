import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { verifyToken } from "../../../lib/auth";
import { getFullCart } from "../../../lib/cart";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded: any = verifyToken(token);
    if (!decoded?.data?.user?.id) return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.data.user.id;

    // ✅ Use the common function
    const cart = await getFullCart(userId);

    res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err instanceof Error ? err.message : "Server error" });
  }
}
