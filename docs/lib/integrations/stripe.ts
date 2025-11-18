import type { Integration } from '../elements-types';

export const stripe: Integration = {
  id: 'stripe',
  name: 'Stripe',
  description: 'Process payments and manage subscriptions',
  icon: 'CreditCard',
  domain: 'stripe.com',
  website: 'https://stripe.com',
  docsUrl: 'https://stripe.com/docs/api',
  steps: ['stripe-payment'],
  authType: 'API Key',
  category: 'Payment',
  setupInstructions: `1. Sign up at https://stripe.com
2. Get your API keys from the dashboard
3. Add STRIPE_SECRET_KEY to your environment variables
4. Configure webhooks for payment events`,
};
