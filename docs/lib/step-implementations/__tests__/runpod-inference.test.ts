import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runpodInference } from '../runpod-inference';
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

describe('runpodInference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RUNPOD_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if RUNPOD_API_KEY is missing', async () => {
    delete process.env.RUNPOD_API_KEY;

    await expect(
      runpodInference({ endpoint_id: 'endpoint-123', input: {} })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully run inference', async () => {
    mockFetchSuccess({
      id: 'run-123',
      status: 'COMPLETED',
      output: { result: 'inference result' },
    });

    const result = await runpodInference({
      endpoint_id: 'endpoint-123',
      input: { prompt: 'Generate image' },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.runpod.ai/v2/endpoint-123/run',
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
    expect(body.input).toEqual({ prompt: 'Generate image' });

    expect(result).toEqual({
      id: 'run-123',
      status: 'COMPLETED',
      output: { result: 'inference result' },
    });
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(404, 'Endpoint not found');

    await expect(
      runpodInference({ endpoint_id: 'invalid', input: {} })
    ).rejects.toThrow('RunPod API error: 404');
  });
});
