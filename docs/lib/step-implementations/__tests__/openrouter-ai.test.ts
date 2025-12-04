import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openrouterAI } from '../openrouter-ai';
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

describe('openrouterAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENROUTER_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if OPENROUTER_API_KEY is missing', async () => {
    delete process.env.OPENROUTER_API_KEY;

    await expect(
      openrouterAI({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully send a message', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response text' } }],
    });

    const result = await openrouterAI({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
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

    await openrouterAI({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'openai/gpt-4-turbo',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('openai/gpt-4-turbo');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      openrouterAI({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('OpenRouter API error: 429');
  });
});
