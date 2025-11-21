import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// Schema definitions for step parameters
const ElevenLabsParamsSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice_id: z.string().optional(),
  model_id: z.string().optional(),
  voice_settings: z
    .object({
      stability: z.number().min(0).max(1),
      similarity_boost: z.number().min(0).max(1),
    })
    .optional(),
});

const GeminiImageParamsSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.string().optional(),
});

const OpenAIChatParamsSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .min(1, 'At least one message is required'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
});

describe('Schema Validation', () => {
  describe('ElevenLabsParamsSchema', () => {
    it('should accept valid parameters with only required fields', () => {
      const params = {
        text: 'Hello world',
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).not.toThrow();
    });

    it('should accept valid parameters with all fields', () => {
      const params = {
        text: 'Hello world',
        voice_id: 'custom-voice-123',
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.8,
          similarity_boost: 0.9,
        },
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).not.toThrow();
    });

    it('should reject empty text', () => {
      const params = {
        text: '',
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).toThrow();
    });

    it('should reject invalid stability value', () => {
      const params = {
        text: 'Hello',
        voice_settings: {
          stability: 1.5, // Invalid: > 1
          similarity_boost: 0.5,
        },
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).toThrow();
    });

    it('should reject negative stability value', () => {
      const params = {
        text: 'Hello',
        voice_settings: {
          stability: -0.1,
          similarity_boost: 0.5,
        },
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).toThrow();
    });

    it('should reject invalid similarity_boost value', () => {
      const params = {
        text: 'Hello',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 2.0, // Invalid: > 1
        },
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).toThrow();
    });

    it('should accept boundary values for voice settings', () => {
      const params = {
        text: 'Hello',
        voice_settings: {
          stability: 0.0,
          similarity_boost: 1.0,
        },
      };

      expect(() => ElevenLabsParamsSchema.parse(params)).not.toThrow();
    });
  });

  describe('GeminiImageParamsSchema', () => {
    it('should accept valid parameters with only required fields', () => {
      const params = {
        prompt: 'Generate a beautiful sunset',
      };

      expect(() => GeminiImageParamsSchema.parse(params)).not.toThrow();
    });

    it('should accept valid parameters with optional model', () => {
      const params = {
        prompt: 'Generate an image',
        model: 'gemini-pro-vision',
      };

      expect(() => GeminiImageParamsSchema.parse(params)).not.toThrow();
    });

    it('should reject empty prompt', () => {
      const params = {
        prompt: '',
      };

      expect(() => GeminiImageParamsSchema.parse(params)).toThrow();
    });

    it('should reject missing prompt', () => {
      const params = {};

      expect(() => GeminiImageParamsSchema.parse(params)).toThrow();
    });

    it('should accept long prompts', () => {
      const params = {
        prompt: 'A'.repeat(1000),
      };

      expect(() => GeminiImageParamsSchema.parse(params)).not.toThrow();
    });
  });

  describe('OpenAIChatParamsSchema', () => {
    it('should accept valid parameters with only required fields', () => {
      const params = {
        messages: [{ role: 'user', content: 'Hello' }],
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).not.toThrow();
    });

    it('should accept valid parameters with all fields', () => {
      const params = {
        messages: [
          { role: 'system', content: 'You are helpful' },
          { role: 'user', content: 'Hello' },
        ],
        model: 'gpt-4-turbo',
        temperature: 0.9,
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).not.toThrow();
    });

    it('should reject empty messages array', () => {
      const params = {
        messages: [],
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).toThrow();
    });

    it('should reject invalid temperature (too high)', () => {
      const params = {
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 2.5, // Invalid: > 2
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).toThrow();
    });

    it('should reject negative temperature', () => {
      const params = {
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: -0.5,
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).toThrow();
    });

    it('should accept boundary temperature values', () => {
      const params1 = {
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 0.0,
      };
      const params2 = {
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 2.0,
      };

      expect(() => OpenAIChatParamsSchema.parse(params1)).not.toThrow();
      expect(() => OpenAIChatParamsSchema.parse(params2)).not.toThrow();
    });

    it('should accept multiple messages', () => {
      const params = {
        messages: [
          { role: 'system', content: 'System message' },
          { role: 'user', content: 'User message 1' },
          { role: 'assistant', content: 'Assistant response' },
          { role: 'user', content: 'User message 2' },
        ],
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).not.toThrow();
    });

    it('should reject messages with missing role', () => {
      const params = {
        messages: [{ content: 'Hello' }],
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).toThrow();
    });

    it('should reject messages with missing content', () => {
      const params = {
        messages: [{ role: 'user' }],
      };

      expect(() => OpenAIChatParamsSchema.parse(params)).toThrow();
    });
  });

  describe('Cross-Schema Edge Cases', () => {
    it('should handle null values correctly', () => {
      expect(() => ElevenLabsParamsSchema.parse({ text: null })).toThrow();

      expect(() => GeminiImageParamsSchema.parse({ prompt: null })).toThrow();

      expect(() => OpenAIChatParamsSchema.parse({ messages: null })).toThrow();
    });

    it('should handle undefined optional fields', () => {
      expect(() =>
        ElevenLabsParamsSchema.parse({
          text: 'Hello',
          voice_id: undefined,
        })
      ).not.toThrow();

      expect(() =>
        GeminiImageParamsSchema.parse({
          prompt: 'Test',
          model: undefined,
        })
      ).not.toThrow();

      expect(() =>
        OpenAIChatParamsSchema.parse({
          messages: [{ role: 'user', content: 'Hi' }],
          temperature: undefined,
        })
      ).not.toThrow();
    });
  });
});
