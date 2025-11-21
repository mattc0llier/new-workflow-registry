import { describe, expect, it, beforeEach, vi } from 'vitest';
import { openaiChat } from '../openai-chat';
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

// Import the mocked FatalError
const { FatalError } = await import('workflow');

describe('openaiChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
  });

  it('should throw FatalError if OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).rejects.toThrow(FatalError);

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).rejects.toThrow('OPENAI_API_KEY is required');
  });

  it('should successfully complete chat with default parameters', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hello! How can I help you?',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const result = await openaiChat({
      messages: [{ role: 'user', content: 'Hello' }],
    });

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-openai-key',
          'Content-Type': 'application/json',
        },
      })
    );

    // Verify request body with defaults
    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body).toEqual({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello' }],
      temperature: 0.7,
    });

    // Verify result
    expect(result).toBe('Hello! How can I help you?');
  });

  it('should use custom model when provided', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Response from GPT-3.5',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    await openaiChat({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'gpt-3.5-turbo',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('gpt-3.5-turbo');
  });

  it('should use custom temperature when provided', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Creative response',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    await openaiChat({
      messages: [{ role: 'user', content: 'Be creative' }],
      temperature: 1.5,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.temperature).toBe(1.5);
  });

  it('should handle multiple messages in conversation', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Yes, I remember our previous conversation.',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi! How can I help?' },
      { role: 'user', content: 'Do you remember what I said?' },
    ];

    await openaiChat({ messages });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.messages).toEqual(messages);
  });

  it('should use custom model and temperature together', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Custom response',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    await openaiChat({
      messages: [{ role: 'user', content: 'Test' }],
      model: 'gpt-4-turbo',
      temperature: 0.2,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('gpt-4-turbo');
    expect(body.temperature).toBe(0.2);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).rejects.toThrow(FatalError);

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).rejects.toThrow('OpenAI API error: 429');
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Test' }],
      })
    ).rejects.toThrow('OpenAI API error: 401');
  });

  it('should handle 500 server error', async () => {
    mockFetchError(500, 'Internal Server Error');

    await expect(
      openaiChat({
        messages: [{ role: 'user', content: 'Test' }],
      })
    ).rejects.toThrow('OpenAI API error: 500');
  });

  it('should extract content from first choice', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'First choice response',
          },
        },
        {
          message: {
            content: 'Second choice response (ignored)',
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const result = await openaiChat({
      messages: [{ role: 'user', content: 'Test' }],
    });

    expect(result).toBe('First choice response');
  });
});
