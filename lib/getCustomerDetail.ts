export async function fetchFullCustomerData(userId: any) {
  const res = await fetch(
    `${process.env.WP_URL}/wp-json/wc/v3/customers/${userId}?consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch WooCommerce customer data');
  }

  const data = await res.json();

  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    name: `${data.first_name} ${data.last_name}`, // or use display_name if available
    email: data.email,
    address: {
      firstName: data.billing.first_name,
      lastName: data.billing.last_name,
      address1: data.billing.address_1,
      address2: data.billing.address_2,
      city: data.billing.city,
      state: data.billing.state,
      postalCode: data.billing.postcode,
      country: data.billing.country,
      phone: data.billing.phone,
    },
  };
}
