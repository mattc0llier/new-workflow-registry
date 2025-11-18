import type { Step } from '../elements-types';

export const stripePayment: Step = {
  id: 'stripe-payment',
  name: 'Stripe Payment',
  description: 'Process payments using the Stripe API',
  icon: 'CreditCard',
  category: 'Payment',
  integration: 'stripe',
  tags: ['stripe', 'payment', 'billing'],
  code: `import { fatalError } from '@vercel/workflow';

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
    throw fatalError('STRIPE_SECRET_KEY is required');
  }

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
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
    throw fatalError(\`Stripe API error: \${response.status}\`);
  }

  return await response.json();
}
`,

  envVars: [
    {
      name: 'STRIPE_SECRET_KEY',
      description: 'Your Stripe secret key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['payment-processing'],
};
