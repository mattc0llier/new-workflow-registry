import { beforeEach, describe, expect, it, vi } from 'vitest';
import { replicateModel } from '../replicate-model';
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

describe('replicateModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REPLICATE_API_TOKEN = 'test-token';
  });

  it('should throw FatalError if REPLICATE_API_TOKEN is missing', async () => {
    delete process.env.REPLICATE_API_TOKEN;

    await expect(
      replicateModel({
        model: 'model-version-id',
        input: { prompt: 'A dog' },
      })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully run a prediction', async () => {
    // Mock creation response
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'pred-123',
          status: 'processing',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'pred-123',
          status: 'succeeded',
          output: ['https://example.com/output.jpg'],
        }),
      });

    const result = await replicateModel({
      model: 'stability-ai/sdxl',
      input: { prompt: 'A beautiful landscape' },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.replicate.com/v1/predictions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Token test-token',
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual(['https://example.com/output.jpg']);
  });

  it('should include webhook when provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'pred-123',
        status: 'succeeded',
        output: 'result',
      }),
    });

    await replicateModel({
      model: 'model-version-id',
      input: {},
      webhook: 'https://example.com/webhook',
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.webhook).toBe('https://example.com/webhook');
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(404, 'Model not found');

    await expect(
      replicateModel({ model: 'invalid', input: {} })
    ).rejects.toThrow('Replicate API error: 404');
  });
});
