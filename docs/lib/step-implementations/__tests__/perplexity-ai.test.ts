import { beforeEach, describe, expect, it, vi } from 'vitest';
import { perplexityAI } from '../perplexity-ai';
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

describe('perplexityAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PERPLEXITY_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if PERPLEXITY_API_KEY is missing', async () => {
    delete process.env.PERPLEXITY_API_KEY;

    await expect(
      perplexityAI({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully send a message', async () => {
    mockFetchSuccess({
      choices: [{ message: { content: 'Response text' } }],
    });

    const result = await perplexityAI({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.perplexity.ai/chat/completions',
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

    await perplexityAI({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'llama-3.1-sonar-small-128k-online',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('llama-3.1-sonar-small-128k-online');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      perplexityAI({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Perplexity API error: 429');
  });
});
