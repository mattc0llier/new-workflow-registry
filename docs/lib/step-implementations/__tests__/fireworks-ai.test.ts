import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireworksAI } from '../fireworks-ai';
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

describe('fireworksAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.FIREWORKS_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if FIREWORKS_API_KEY is missing', async () => {
    delete process.env.FIREWORKS_API_KEY;

    await expect(
      fireworksAI({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully send a message', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response text' } }],
    });

    const result = await fireworksAI({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.fireworks.ai/inference/v1/chat/completions',
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

  it('should use custom model when provided', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response' } }],
    });

    await fireworksAI({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'accounts/fireworks/models/llama-v3-70b-instruct',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('accounts/fireworks/models/llama-v3-70b-instruct');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      fireworksAI({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Fireworks API error: 429');
  });
});
