import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail } from '../send-email-resend';
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

describe('sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      sendEmail({ to: 'user@example.com', subject: 'Test', html: '<p>Hi</p>' })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully send email', async () => {
    mockFetchSuccess({ id: 'email-123' });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Welcome',
      html: '<p>Welcome to our service!</p>',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.to).toBe('user@example.com');
    expect(body.subject).toBe('Welcome');
    expect(body.html).toBe('<p>Welcome to our service!</p>');
    expect(body.from).toBe('noreply@example.com'); // default from

    expect(result).toEqual({ id: 'email-123' });
  });

  it('should use custom from address', async () => {
    mockFetchSuccess({ id: 'email-123' });

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      from: 'sender@example.com',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.from).toBe('sender@example.com');
  });

  it('should use FROM_EMAIL environment variable if set', async () => {
    process.env.FROM_EMAIL = 'noreply@myapp.com';
    mockFetchSuccess({ id: 'email-123' });

    await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.from).toBe('noreply@myapp.com');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(400, 'Invalid email address');

    await expect(
      sendEmail({ to: 'invalid', subject: 'Test', html: '<p>Test</p>' })
    ).rejects.toThrow('Resend API error: 400');
  });
});
