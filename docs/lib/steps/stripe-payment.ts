import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/stripe-payment.ts'),
  'utf-8'
);

export const stripePayment: Step = {
  id: 'stripe-payment',
  name: 'Stripe Payment',
  description: 'Process payments using the Stripe API',
  icon: 'CreditCard',
  category: 'Payment',
  integration: 'stripe',
  tags: ['stripe', 'payment', 'billing'],
  code,
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
