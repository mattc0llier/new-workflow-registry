import { beforeEach, describe, expect, it, vi } from 'vitest';
import { googleGemini } from '../google-gemini';
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

describe('googleGemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_AI_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if GOOGLE_AI_API_KEY is missing', async () => {
    delete process.env.GOOGLE_AI_API_KEY;

    await expect(googleGemini({ prompt: 'Hello' })).rejects.toThrow(FatalError);
  });

  it('should successfully generate content', async () => {
    mockFetchSuccess({
      candidates: [
        {
          content: {
            parts: [{ text: 'Generated response' }],
          },
        },
      ],
    });

    const result = await googleGemini({ prompt: 'Write a story' });

    expect(fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=test-api-key',
      expect.objectContaining({
        method: 'POST',
      })
    );

    expect(result).toBe('Generated response');
  });

  it('should use custom model and temperature', async () => {
    mockFetchSuccess({
      candidates: [
        {
          content: {
            parts: [{ text: 'Response' }],
          },
        },
      ],
    });

    await googleGemini({
      prompt: 'Test',
      model: 'gemini-1.5-flash',
      temperature: 0.9,
    });

    const url = (fetch as any).mock.calls[0][0];
    expect(url).toContain('gemini-1.5-flash');

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.generationConfig.temperature).toBe(0.9);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(googleGemini({ prompt: 'Test' })).rejects.toThrow(
      'Google AI API error: 429'
    );
  });
});
