import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { mistral } from '@ai-sdk/mistral';

type MistralParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function mistralAI(params: MistralParams) {
  'use step';

  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new FatalError('MISTRAL_API_KEY is required');
  }

  try {
    const { text } = await generateText({
      model: mistral(params.model || 'mistral-large-latest', { apiKey }),
      messages: params.messages,
      temperature: params.temperature || 0.7,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `Mistral API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
