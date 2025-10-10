import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, address, email } = req.body;

  if (!userId || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch(
      `${process.env.WP_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing: {
            first_name: address.firstName,
            last_name: address.lastName,
            address_1: address.address1,
            address_2: address.address2,
            city: address.city,
            state: address.state,
            postcode: address.postalCode,
            country: address.country,
            phone: address.phone,
            email,
          },
          shipping: {
            first_name: address.firstName,
            last_name: address.lastName,
            address_1: address.address1,
            address_2: address.address2,
            city: address.city,
            state: address.state,
            postcode: address.postalCode,
            country: address.country,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Failed to update address' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
