import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stripePayment } from '../stripe-payment';
import { mockFetchSuccess, mockFetchError } from './setup';

vi.mock('workflow', () => ({
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FatalError';
    }
  },
}));

const { FatalError } = await import('workflow');

describe('stripePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'test-secret-key';
  });

  it('should throw FatalError if STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;

    await expect(
      stripePayment({
        amount: 1000,
        currency: 'usd',
        customerId: 'cus_123',
      })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully create a payment intent', async () => {
    mockFetchSuccess({
      id: 'pi_123',
      amount: 1000,
      currency: 'usd',
      status: 'succeeded',
    });

    const result = await stripePayment({
      amount: 1000,
      currency: 'usd',
      customerId: 'cus_123',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.stripe.com/v1/payment_intents',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-secret-key',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    );

    expect(result).toEqual({
      id: 'pi_123',
      amount: 1000,
      currency: 'usd',
      status: 'succeeded',
    });
  });

  it('should include description when provided', async () => {
    mockFetchSuccess({
      id: 'pi_123',
      description: 'Premium subscription',
    });

    await stripePayment({
      amount: 2000,
      currency: 'usd',
      customerId: 'cus_123',
      description: 'Premium subscription',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    // URLSearchParams creates an iterable, convert to string
    const bodyStr = callArgs.body.toString();
    expect(bodyStr).toContain('description=Premium+subscription');
  });

  it('should handle different currencies', async () => {
    mockFetchSuccess({ id: 'pi_123' });

    await stripePayment({
      amount: 5000,
      currency: 'eur',
      customerId: 'cus_123',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    // URLSearchParams creates an iterable, convert to string
    const bodyStr = callArgs.body.toString();
    expect(bodyStr).toContain('currency=eur');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(402, 'Card declined');

    await expect(
      stripePayment({
        amount: 1000,
        currency: 'usd',
        customerId: 'cus_invalid',
      })
    ).rejects.toThrow('Stripe API error: 402');
  });
});
