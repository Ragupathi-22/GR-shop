import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { email, password } = req.body;

  try {
    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const wpData = (await wpRes.json()) as {
      token?: string;
      user_email?: string;
      user_display_name?: string;
      user_id?: number;
      message?: string;
    };

    if (!wpRes.ok || !wpData.token) {
      return res.status(wpRes.status).json({ message: wpData.message || "Invalid credentials" });
    }

    const isProd = process.env.NODE_ENV === "production";

    // Set HttpOnly auth cookie only (do not expose userId cookie)
    res.setHeader(
      "Set-Cookie",
      `token=${wpData.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${isProd ? "Secure" : ""}`
    );

    res.status(200).json({
      user: {
        id: wpData.user_id,
        name: wpData.user_display_name,
        email: wpData.user_email || email,
        token: wpData.token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}
