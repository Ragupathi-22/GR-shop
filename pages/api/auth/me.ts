import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { fetchFullCustomerData } from "@/lib/getCustomerDetail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Fetch basic WP user info
    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!wpRes.ok) return res.status(401).json({ message: "Invalid token" });

    const wpUser = await wpRes.json() as {
      id: number;
      first_name?: string;
      last_name?: string;
      display_name: string;
      email: string;
    };

       // Fetch WooCommerce customer info (billing/shipping addresses)
       const customer = await fetchFullCustomerData(wpUser.id);
   
       // send structured user data
       res.status(200).json({ user: { ...customer } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
