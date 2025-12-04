import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { cohere } from '@ai-sdk/cohere';

type CohereParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
};

export async function cohereGenerate(params: CohereParams) {
  'use step';

  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    throw new FatalError('COHERE_API_KEY is required');
  }

  try {
    const { text } = await generateText({
      model: cohere(params.model || 'command', { apiKey }),
      prompt: params.prompt,
      maxTokens: params.max_tokens || 1000,
      temperature: params.temperature || 0.7,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `Cohere API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
