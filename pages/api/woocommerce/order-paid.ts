import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  try {
    const { id, status, customer_id } = req.body;
    if (status === "processing" || status === "completed") {
      await query("DELETE FROM wp_user_cart WHERE user_id = ?", [customer_id]);
    }
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}
