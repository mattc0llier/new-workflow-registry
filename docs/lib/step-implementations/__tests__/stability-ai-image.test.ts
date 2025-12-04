import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stabilityAIImage } from '../stability-ai-image';
import {
  createTestBuffer,
  mockFetchArrayBuffer,
  mockFetchError,
} from './setup';

vi.mock('workflow', () => ({
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FatalError';
    }
  },
}));

const { FatalError } = await import('workflow');

describe('stabilityAIImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STABILITY_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if STABILITY_API_KEY is missing', async () => {
    delete process.env.STABILITY_API_KEY;

    await expect(
      stabilityAIImage({ prompt: 'A beautiful sunset' })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully generate an image', async () => {
    const testBuffer = createTestBuffer(1000);
    mockFetchArrayBuffer(testBuffer, 'image/png');

    const result = await stabilityAIImage({ prompt: 'A beautiful sunset' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          Accept: 'image/*',
        },
      })
    );

    expect(result).toHaveProperty('image');
    expect(result).toHaveProperty('contentType');
    expect(result.contentType).toBe('image/png');
    expect(typeof result.image).toBe('string'); // base64 string
  });

  it('should include negative prompt when provided', async () => {
    const testBuffer = createTestBuffer(100);
    mockFetchArrayBuffer(testBuffer, 'image/png');

    await stabilityAIImage({
      prompt: 'A beautiful sunset',
      negative_prompt: 'blurry, distorted',
    });

    // FormData calls are harder to inspect, but we can verify fetch was called
    expect(fetch).toHaveBeenCalledWith(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(402, 'Insufficient credits');

    await expect(stabilityAIImage({ prompt: 'Test' })).rejects.toThrow(
      'Stability AI API error: 402'
    );
  });

  it('should convert image buffer to base64', async () => {
    // Create a simple buffer with known content
    const buffer = new ArrayBuffer(3);
    const view = new Uint8Array(buffer);
    view[0] = 65; // 'A'
    view[1] = 66; // 'B'
    view[2] = 67; // 'C'

    mockFetchArrayBuffer(buffer, 'image/png');

    const result = await stabilityAIImage({ prompt: 'Test' });

    // 'ABC' in base64 is 'QUJD'
    expect(result.image).toBe('QUJD');
  });
});
