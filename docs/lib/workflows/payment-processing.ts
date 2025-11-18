import type { Workflow } from '../elements-types';

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
  code: `import { workflow } from '@vercel/workflow';
import { stripePayment } from '@/steps/stripe-payment';
import { sendEmail } from '@/steps/send-email-resend';

type PaymentParams = {
  amount: number;
  currency: string;
  customerId: string;
  customerEmail: string;
};

export const paymentProcessing = workflow(
  'payment-processing',
  async (params: PaymentParams) => {
    // Step 1: Process payment
    const payment = await stripePayment({
      amount: params.amount,
      currency: params.currency,
      customerId: params.customerId,
      description: 'Product purchase',
    });

    // Step 2: Send confirmation email
    await sendEmail({
      to: params.customerEmail,
      subject: 'Payment Confirmed',
      html: \`
        <h1>Payment Successful</h1>
        <p>Your payment of \${params.currency.toUpperCase()} \${params.amount / 100} has been processed.</p>
      \`,
    });

    return { success: true, paymentId: payment.id };
  }
);
`,

  useCase:
    'Process customer payments and send confirmation emails automatically.',
  prerequisites: ['Stripe API key', 'Resend API key'],
};
