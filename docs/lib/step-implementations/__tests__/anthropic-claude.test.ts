import { beforeEach, describe, expect, it, vi } from 'vitest';
import { anthropicClaude } from '../anthropic-claude';
import { mockFetchSuccess, mockFetchError } from './setup';

// Mock the workflow module
vi.mock('workflow', () => ({
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FatalError';
    }
  },
}));

const { FatalError } = await import('workflow');

describe('anthropicClaude', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(
      anthropicClaude({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow(FatalError);

    await expect(
      anthropicClaude({ messages: [{ role: 'user', content: 'Hello' }] })
    ).rejects.toThrow('ANTHROPIC_API_KEY is required');
  });

  it('should successfully send a message with default parameters', async () => {
    mockFetchSuccess({
      content: [{ text: 'Hello! How can I help you today?' }],
    });

    const result = await anthropicClaude({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'x-api-key': 'test-api-key',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      })
    );

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body).toEqual({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 4096,
    });

    expect(result).toBe('Hello! How can I help you today?');
  });

  it('should use custom model and max_tokens when provided', async () => {
    mockFetchSuccess({
      content: [{ text: 'Response text' }],
    });

    await anthropicClaude({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('claude-3-opus-20240229');
    expect(body.max_tokens).toBe(2000);
  });

  it('should handle multiple messages', async () => {
    mockFetchSuccess({
      content: [{ text: 'Response' }],
    });

    await anthropicClaude({
      messages: [
        { role: 'user', content: 'First message' },
        { role: 'assistant', content: 'First response' },
        { role: 'user', content: 'Second message' },
      ],
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.messages).toHaveLength(3);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      anthropicClaude({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow(FatalError);

    await expect(
      anthropicClaude({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Anthropic API error: 429');
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(
      anthropicClaude({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Anthropic API error: 401');
  });
});
