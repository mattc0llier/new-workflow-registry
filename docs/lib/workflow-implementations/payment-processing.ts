import { workflow } from '@vercel/workflow';
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
      html: `
        <h1>Payment Successful</h1>
        <p>Your payment of ${params.currency.toUpperCase()} ${params.amount / 100} has been processed.</p>
      `,
    });

    return { success: true, paymentId: payment.id };
  }
);
