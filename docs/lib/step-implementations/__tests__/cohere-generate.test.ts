import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cohereGenerate } from '../cohere-generate';
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

describe('cohereGenerate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.COHERE_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if COHERE_API_KEY is missing', async () => {
    delete process.env.COHERE_API_KEY;

    await expect(cohereGenerate({ prompt: 'Hello' })).rejects.toThrow(
      FatalError
    );

    await expect(cohereGenerate({ prompt: 'Hello' })).rejects.toThrow(
      'COHERE_API_KEY is required'
    );
  });

  it('should successfully generate text with default parameters', async () => {
    mockFetchSuccess({
      generations: [{ text: 'Generated text response' }],
    });

    const result = await cohereGenerate({ prompt: 'Write a story' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.cohere.ai/v1/generate',
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
    expect(body).toEqual({
      model: 'command',
      prompt: 'Write a story',
      max_tokens: 1000,
      temperature: 0.7,
    });

    expect(result).toBe('Generated text response');
  });

  it('should use custom model, max_tokens, and temperature when provided', async () => {
    mockFetchSuccess({
      generations: [{ text: 'Response' }],
    });

    await cohereGenerate({
      prompt: 'Test',
      model: 'command-nightly',
      max_tokens: 500,
      temperature: 0.9,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model).toBe('command-nightly');
    expect(body.max_tokens).toBe(500);
    expect(body.temperature).toBe(0.9);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(cohereGenerate({ prompt: 'Test' })).rejects.toThrow(
      FatalError
    );

    await expect(cohereGenerate({ prompt: 'Test' })).rejects.toThrow(
      'Cohere API error: 429'
    );
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(cohereGenerate({ prompt: 'Test' })).rejects.toThrow(
      'Cohere API error: 401'
    );
  });
});
