import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    console.log("Webhook payload:", req.body);

    const { status, billing } = req.body;
    const customer_email = billing?.email;

    if (!customer_email) {
      console.warn("Missing customer_email in billing info");
    }

    if ((status === "processing" || status === "completed") && customer_email) {
      const email = customer_email.trim().toLowerCase();
      const result = await query("DELETE FROM wp_user_cart WHERE user_email = ?", [email]);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}
