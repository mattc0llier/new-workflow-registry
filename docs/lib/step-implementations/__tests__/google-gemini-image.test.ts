import { describe, expect, it, beforeEach, vi } from 'vitest';
import { googleGeminiImage } from '../google-gemini-image';
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

describe('googleGeminiImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_AI_API_KEY = 'test-google-api-key';
  });

  it('should throw FatalError if GOOGLE_AI_API_KEY is missing', async () => {
    delete process.env.GOOGLE_AI_API_KEY;

    await expect(
      googleGeminiImage({ prompt: 'Generate an image' })
    ).rejects.toThrow(FatalError);

    await expect(
      googleGeminiImage({ prompt: 'Generate an image' })
    ).rejects.toThrow('GOOGLE_AI_API_KEY is required');
  });

  it('should successfully generate image with default model', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: 'base64ImageDataHere',
                },
              },
            ],
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const result = await googleGeminiImage({
      prompt: 'A beautiful sunset',
    });

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=test-google-api-key',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    // Verify request body
    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body).toEqual({
      contents: [
        {
          parts: [{ text: 'A beautiful sunset' }],
        },
      ],
    });

    // Verify result
    expect(result).toEqual({
      image: 'base64ImageDataHere',
      text: null,
      mimeType: 'image/png',
    });
  });

  it('should use custom model when provided', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: 'imageData',
                },
              },
            ],
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    await googleGeminiImage({
      prompt: 'Test prompt',
      model: 'gemini-pro-vision',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=test-google-api-key',
      expect.anything()
    );
  });

  it('should extract both image and text from response', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Here is your generated image description',
              },
              {
                inlineData: {
                  data: 'imageBase64Data',
                },
              },
            ],
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const result = await googleGeminiImage({
      prompt: 'Generate something cool',
    });

    expect(result.image).toBe('imageBase64Data');
    expect(result.text).toBe('Here is your generated image description');
    expect(result.mimeType).toBe('image/png');
  });

  it('should handle multiple candidates and find image', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'No image here',
              },
            ],
          },
        },
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: 'foundImageData',
                },
              },
            ],
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    const result = await googleGeminiImage({ prompt: 'Test' });

    expect(result.image).toBe('foundImageData');
  });

  it('should throw FatalError when no image data is returned', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Only text, no image',
              },
            ],
          },
        },
      ],
    };

    mockFetchSuccess(mockResponse);

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      FatalError
    );

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      'No image data returned from Google AI'
    );
  });

  it('should throw FatalError when candidates array is empty', async () => {
    const mockResponse = {
      candidates: [],
    };

    mockFetchSuccess(mockResponse);

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      'No image data returned from Google AI'
    );
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(400, 'Bad Request');

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      FatalError
    );

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      'Google AI API error: 400'
    );
  });

  it('should handle 403 authentication error', async () => {
    mockFetchError(403, 'Forbidden');

    await expect(googleGeminiImage({ prompt: 'Test' })).rejects.toThrow(
      'Google AI API error: 403'
    );
  });
});
