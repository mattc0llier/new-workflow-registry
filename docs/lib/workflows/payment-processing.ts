import fs from 'fs';
import path from 'path';
import type { Workflow } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../workflow-implementations/payment-processing.ts'),
  'utf-8'
);

export const paymentProcessing: Workflow = {
  id: 'payment-processing',
  name: 'Payment Processing',
  description: 'Handle payment collection and confirmation',
  icon: 'DollarSign',
  category: 'E-commerce',
  difficulty: 'Intermediate',
  steps: [
    {
      stepId: 'stripe-payment',
      order: 1,
      description: 'Process payment with Stripe',
    },
    {
      stepId: 'send-email-resend',
      order: 2,
      description: 'Send payment confirmation email',
    },
  ],
  code,
  useCase:
    'Process customer payments and send confirmation emails automatically.',
  prerequisites: ['Stripe API key', 'Resend API key'],
};
