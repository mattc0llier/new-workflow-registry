import { beforeEach, describe, expect, it, vi } from 'vitest';
import { togetherAI } from '../together-ai';
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

describe('togetherAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TOGETHER_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if TOGETHER_API_KEY is missing', async () => {
    delete process.env.TOGETHER_API_KEY;

    await expect(togetherAI({ prompt: 'Hello' })).rejects.toThrow(FatalError);
  });

  it('should successfully generate completion', async () => {
    mockFetchSuccess({
      choices: [{ text: 'Generated response' }],
    });

    const result = await togetherAI({ prompt: 'Write a story' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.together.xyz/v1/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toBe('Generated response');
  });

  it('should use custom model and max_tokens', async () => {
    mockFetchSuccess({
      choices: [{ text: 'Response' }],
    });

    await togetherAI({
      prompt: 'Test',
      model: 'togethercomputer/llama-2-70b',
      max_tokens: 500,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('togethercomputer/llama-2-70b');
    expect(body.max_tokens).toBe(500);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(togetherAI({ prompt: 'Test' })).rejects.toThrow(
      'Together API error: 429'
    );
  });
});
