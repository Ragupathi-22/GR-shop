import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId parameter" });
  }

  try {
    const response = await fetch(
      `${process.env.WP_URL}/wp-json/custom/v1/my-orders?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ message: errorData.message || "Failed to fetch orders" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
