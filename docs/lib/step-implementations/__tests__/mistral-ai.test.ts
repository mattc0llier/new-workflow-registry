import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mistralAI } from '../mistral-ai';
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

describe('mistralAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MISTRAL_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if MISTRAL_API_KEY is missing', async () => {
    delete process.env.MISTRAL_API_KEY;

    await expect(
      mistralAI({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully send a message', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response text' } }],
    });

    const result = await mistralAI({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.mistral.ai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toBe('Response text');
  });

  it('should use custom model and temperature', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response' } }],
    });

    await mistralAI({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'mistral-medium',
      temperature: 0.9,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('mistral-medium');
    expect(body.temperature).toBe(0.9);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      mistralAI({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Mistral API error: 429');
  });
});
