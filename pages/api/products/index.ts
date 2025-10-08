import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
    const params = Object.fromEntries(searchParams);

    const wpRes = await fetch(`${process.env.WP_URL}/wp-json/wc/v3/products?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64"),
         "Content-Type": "application/json",
      },
    });

    const data = await wpRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
}
