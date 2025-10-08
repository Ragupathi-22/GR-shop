import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const isProd = process.env.NODE_ENV === "production";

  // Clear auth cookie (and clear userId if it existed previously)
  res.setHeader("Set-Cookie", [
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${isProd ? "Secure" : ""}`,
    `userId=; Path=/; Max-Age=0; SameSite=Lax; ${isProd ? "Secure" : ""}`,
  ]);

  res.status(200).json({ message: "Logged out successfully" });
}
