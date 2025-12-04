import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deepgramTranscribe } from '../deepgram-transcribe';
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

describe('deepgramTranscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEEPGRAM_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if DEEPGRAM_API_KEY is missing', async () => {
    delete process.env.DEEPGRAM_API_KEY;

    await expect(
      deepgramTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow(FatalError);

    await expect(
      deepgramTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('DEEPGRAM_API_KEY is required');
  });

  it('should successfully transcribe audio with default parameters', async () => {
    mockFetchSuccess({
      results: {
        channels: [
          {
            alternatives: [{ transcript: 'This is the transcribed text' }],
          },
        ],
      },
    });

    const result = await deepgramTranscribe({
      audio_url: 'https://example.com/audio.mp3',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/listen?model=nova-2&language=en',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Token test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.url).toBe('https://example.com/audio.mp3');

    expect(result).toBe('This is the transcribed text');
  });

  it('should use custom model and language when provided', async () => {
    mockFetchSuccess({
      results: {
        channels: [
          {
            alternatives: [{ transcript: 'Transcribed text' }],
          },
        ],
      },
    });

    await deepgramTranscribe({
      audio_url: 'https://example.com/audio.mp3',
      model: 'nova',
      language: 'es',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.deepgram.com/v1/listen?model=nova&language=es',
      expect.anything()
    );
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(
      deepgramTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow(FatalError);

    await expect(
      deepgramTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('Deepgram API error: 429');
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(
      deepgramTranscribe({ audio_url: 'https://example.com/audio.mp3' })
    ).rejects.toThrow('Deepgram API error: 401');
  });
});
