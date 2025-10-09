import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req :any, res :any) {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
      payment_capture: true, // auto-capture
    });

    res.status(200).json(order);
  } catch (err :any) {
    res.status(500).json({ error: err.message });
  }
}
