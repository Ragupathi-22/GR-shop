import type { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password } = req.body;

  try {
    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/custom/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, email, password, name }),
    });

    const wpData = await wpRes.json()as { token?: string; user?: any; message?: string };

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({ message: wpData.message || "Registration failed" });
    }

    // Optionally, auto-login after registration
    const tokenRes = await fetch(`${process.env.WP_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const tokenData = await tokenRes.json() as { token?: string; user_id?: number; user_display_name?: string; message?: string };
    if (!tokenRes.ok || !tokenData.token) {
      return res.status(tokenRes.status).json({ message: tokenData.message || "Token generation failed" });
    }

    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `token=${tokenData.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${isProd ? "Secure" : ""}`
    );

    res.status(200).json({
      user: {
        id: tokenData.user_id,
        name: tokenData.user_display_name,
        email: email,
        token: tokenData.token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
}
