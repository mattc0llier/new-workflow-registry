import { beforeEach, describe, expect, it, vi } from 'vitest';
import { huggingfaceInference } from '../huggingface-inference';
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

describe('huggingfaceInference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.HUGGINGFACE_API_TOKEN = 'test-token';
  });

  it('should throw FatalError if HUGGINGFACE_API_TOKEN is missing', async () => {
    delete process.env.HUGGINGFACE_API_TOKEN;

    await expect(
      huggingfaceInference({ model: 'bert-base-uncased', inputs: 'Hello' })
    ).rejects.toThrow(FatalError);
  });

  it('should successfully run inference with string input', async () => {
    mockFetchSuccess([{ label: 'POSITIVE', score: 0.9998 }]);

    const result = await huggingfaceInference({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: 'I love this!',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      })
    );

    expect(result).toEqual([{ label: 'POSITIVE', score: 0.9998 }]);
  });

  it('should support structured inputs and parameters', async () => {
    mockFetchSuccess({ generated_text: 'Once upon a time...' });

    await huggingfaceInference({
      model: 'gpt2',
      inputs: { text: 'Write a story' },
      parameters: { max_length: 100, temperature: 0.9 },
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.inputs).toEqual({ text: 'Write a story' });
    expect(body.parameters).toEqual({ max_length: 100, temperature: 0.9 });
  });

  it('should throw FatalError on API error', async () => {
    mockFetchError(503, 'Model is loading');

    await expect(
      huggingfaceInference({ model: 'gpt2', inputs: 'Test' })
    ).rejects.toThrow('Hugging Face API error: 503');
  });
});
