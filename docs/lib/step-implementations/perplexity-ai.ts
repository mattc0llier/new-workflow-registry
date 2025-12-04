import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

type PerplexityParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function perplexityAI(params: PerplexityParams) {
  'use step';

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new FatalError('PERPLEXITY_API_KEY is required');
  }

  try {
    const perplexity = createOpenAI({
      baseURL: 'https://api.perplexity.ai',
      apiKey,
    });

    const { text } = await generateText({
      model: perplexity(params.model || 'llama-3.1-sonar-large-128k-online'),
      messages: params.messages,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `Perplexity API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
