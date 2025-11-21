import { FatalError } from 'workflow';

type PaymentParams = {
  amount: number;
  currency: string;
  customerId: string;
  description?: string;
};

export async function stripePayment(params: PaymentParams) {
  'use step';

  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new FatalError('STRIPE_SECRET_KEY is required');
  }

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      amount: params.amount.toString(),
      currency: params.currency,
      customer: params.customerId,
      description: params.description || '',
    }),
  });

  if (!response.ok) {
    throw new FatalError(`Stripe API error: ${response.status}`);
  }

  return await response.json();
}
