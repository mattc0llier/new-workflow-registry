import { beforeEach, describe, expect, it, vi } from 'vitest';
import { assemblyaiTranscribe } from '../assemblyai-transcribe';
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

describe('assemblyaiTranscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ASSEMBLYAI_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if ASSEMBLYAI_API_KEY is missing', async () => {
    delete process.env.ASSEMBLYAI_API_KEY;

    await expect(
      assemblyaiTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow(FatalError);

    await expect(
      assemblyaiTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('ASSEMBLYAI_API_KEY is required');
  });

  it('should successfully submit and retrieve transcription', async () => {
    // Mock the submission response
    mockFetchSuccess({
      id: 'transcript-123',
      status: 'processing',
    });

    // Mock the first status check (processing)
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'transcript-123', status: 'processing' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          id: 'transcript-123',
          status: 'completed',
          text: 'This is the transcribed text.',
        }),
      });

    const result = await assemblyaiTranscribe({
      audio_url: 'https://example.com/audio.mp3',
    });

    // Verify submission call
    expect(fetch).toHaveBeenCalledWith(
      'https://api.assemblyai.com/v2/transcript',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'test-api-key',
        }),
      })
    );

    expect(result).toBe('This is the transcribed text.');
  });

  it('should throw FatalError on submission API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      assemblyaiTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow(FatalError);

    await expect(
      assemblyaiTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('AssemblyAI API error: 429');
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(
      assemblyaiTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('AssemblyAI API error: 401');
  });
});
