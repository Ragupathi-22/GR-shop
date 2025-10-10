import { fetchFullCustomerData } from "@/lib/getCustomerDetail";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { first_name, last_name, username, email, password } = req.body;

  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({ message: "Missing required registration fields" });
  }

  try {
    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/custom/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name,
        last_name,
        username,
        email,
        password,
      }),
    });

    const wpData = (await wpRes.json()) as { token?: string; user?: any; message?: string };

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({ message: wpData.message || "Registration failed" });
    }

    // Auto-login after registration
    const tokenRes = await fetch(`${process.env.WP_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const tokenData = (await tokenRes.json()) as {
      token?: string;
      user_id?: number;
      user_display_name?: string;
      message?: string;
    };
    if (!tokenRes.ok || !tokenData.token) {
      return res.status(tokenRes.status).json({ message: tokenData.message || "Token generation failed" });
    }

    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `token=${tokenData.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${isProd ? "Secure" : ""}`
    );

    // Fetch WooCommerce customer info (billing/shipping addresses)
    const customer = await fetchFullCustomerData(tokenData.user_id);

    //  send structured user data
    res.status(200).json({ user: { ...customer } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
}
