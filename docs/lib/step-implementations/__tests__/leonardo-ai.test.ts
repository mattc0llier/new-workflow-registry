import { beforeEach, describe, expect, it, vi } from 'vitest';
import { leonardoAI } from '../leonardo-ai';
import { mockFetchSuccess, mockFetchError } from './setup';

vi.mock('workflow', () => ({
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FatalError';
    }
  },
  retryableError: (message: string) => new Error(message),
}));

const { FatalError } = await import('workflow');

describe('leonardoAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.LEONARDO_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if LEONARDO_API_KEY is missing', async () => {
    delete process.env.LEONARDO_API_KEY;

    await expect(leonardoAI({ prompt: 'A beautiful sunset' })).rejects.toThrow(
      FatalError
    );
  });

  it('should successfully generate an image', async () => {
    // Mock generation response
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sdGenerationJob: { generationId: 'gen-123' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          generations_by_pk: {
            status: 'COMPLETE',
            generated_images: [{ url: 'https://example.com/image.jpg' }],
          },
        }),
      });

    const result = await leonardoAI({ prompt: 'A beautiful sunset' });

    expect(fetch).toHaveBeenCalledWith(
      'https://cloud.leonardo.ai/api/rest/v1/generations',
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
    expect(body.prompt).toBe('A beautiful sunset');
    expect(body.width).toBe(1024);
    expect(body.height).toBe(1024);

    expect(result).toBe('https://example.com/image.jpg');
  });

  it('should use custom model and dimensions', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sdGenerationJob: { generationId: 'gen-123' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          generations_by_pk: {
            status: 'COMPLETE',
            generated_images: [{ url: 'https://example.com/image.jpg' }],
          },
        }),
      });

    await leonardoAI({
      prompt: 'Test',
      model_id: 'custom-model-id',
      width: 512,
      height: 768,
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.modelId).toBe('custom-model-id');
    expect(body.width).toBe(512);
    expect(body.height).toBe(768);
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(402, 'Insufficient credits');

    await expect(leonardoAI({ prompt: 'Test' })).rejects.toThrow(
      'Leonardo API error: 402'
    );
  });
});
