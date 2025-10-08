import type { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Fetch user info from WP
    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!wpRes.ok) return res.status(401).json({ message: "Invalid token" });

    const wpUser = await wpRes.json() as { id: number; name: string; email: string; display_name: string };

    res.status(200).json({
      user: {
        id: wpUser.id,
        name: wpUser.name || wpUser.display_name,
        email: wpUser.email,
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
