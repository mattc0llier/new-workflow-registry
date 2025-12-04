import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

type TogetherParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
};

export async function togetherAI(params: TogetherParams) {
  'use step';

  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    throw new FatalError('TOGETHER_API_KEY is required');
  }

  try {
    const together = createOpenAI({
      baseURL: 'https://api.together.xyz/v1',
      apiKey,
    });

    const { text } = await generateText({
      model: together(params.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1'),
      prompt: params.prompt,
      maxTokens: params.max_tokens || 1000,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `Together API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
