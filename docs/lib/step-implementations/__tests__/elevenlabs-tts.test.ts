import { beforeEach, describe, expect, it, vi } from 'vitest';
import { elevenlabsTTS } from '../elevenlabs-tts';
import {
  createTestBuffer,
  mockFetchArrayBuffer,
  mockFetchError,
} from './setup';

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

describe('elevenlabsTTS', () => {
  beforeEach(() => {
    // Reset environment and mocks before each test
    vi.clearAllMocks();
    process.env.ELEVENLABS_API_KEY = 'test-api-key';
  });

  it('should throw FatalError if ELEVENLABS_API_KEY is missing', async () => {
    delete process.env.ELEVENLABS_API_KEY;

    await expect(elevenlabsTTS({ text: 'Hello world' })).rejects.toThrow(
      FatalError
    );

    await expect(elevenlabsTTS({ text: 'Hello world' })).rejects.toThrow(
      'ELEVENLABS_API_KEY is required'
    );
  });

  it('should successfully generate audio with default parameters', async () => {
    const testBuffer = createTestBuffer(100);
    mockFetchArrayBuffer(testBuffer, 'audio/mpeg');

    const result = await elevenlabsTTS({ text: 'Hello world' });

    // Verify the API was called correctly
    expect(fetch).toHaveBeenCalledWith(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'xi-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );

    // Verify the request body
    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body).toEqual({
      text: 'Hello world',
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    });

    // Verify the result
    expect(result).toHaveProperty('audio');
    expect(result).toHaveProperty('contentType');
    expect(result.contentType).toBe('audio/mpeg');
    expect(typeof result.audio).toBe('string'); // base64 string
  });

  it('should use custom voice_id when provided', async () => {
    const testBuffer = createTestBuffer(50);
    mockFetchArrayBuffer(testBuffer);

    await elevenlabsTTS({
      text: 'Custom voice test',
      voice_id: 'custom-voice-123',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.elevenlabs.io/v1/text-to-speech/custom-voice-123',
      expect.anything()
    );
  });

  it('should use custom model_id and voice_settings when provided', async () => {
    const testBuffer = createTestBuffer(50);
    mockFetchArrayBuffer(testBuffer);

    await elevenlabsTTS({
      text: 'Custom settings test',
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.9,
      },
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.model_id).toBe('eleven_multilingual_v2');
    expect(body.voice_settings).toEqual({
      stability: 0.8,
      similarity_boost: 0.9,
    });
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(429, 'Rate limit exceeded');

    await expect(elevenlabsTTS({ text: 'Hello world' })).rejects.toThrow(
      FatalError
    );

    await expect(elevenlabsTTS({ text: 'Hello world' })).rejects.toThrow(
      'ElevenLabs API error: 429'
    );
  });

  it('should handle 401 authentication error', async () => {
    mockFetchError(401, 'Unauthorized');

    await expect(elevenlabsTTS({ text: 'Test' })).rejects.toThrow(
      'ElevenLabs API error: 401'
    );
  });

  it('should convert audio buffer to base64', async () => {
    // Create a simple buffer with known content
    const buffer = new ArrayBuffer(3);
    const view = new Uint8Array(buffer);
    view[0] = 65; // 'A'
    view[1] = 66; // 'B'
    view[2] = 67; // 'C'

    mockFetchArrayBuffer(buffer);

    const result = await elevenlabsTTS({ text: 'Test' });

    // 'ABC' in base64 is 'QUJD'
    expect(result.audio).toBe('QUJD');
  });
});
