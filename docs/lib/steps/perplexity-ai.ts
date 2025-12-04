import type { Step } from '../elements-types';

export const perplexityAI: Step = {
  id: 'perplexity-ai',
  name: 'Perplexity AI',
  description: 'Search and answer questions with Perplexity AI',
  icon: 'Search',
  category: 'AI',
  integration: 'perplexity',
  tags: ['ai', 'perplexity', 'search', 'llm'],
  code: `import { FatalError } from 'workflow';
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
      \`Perplexity API error: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`,

  envVars: [
    {
      name: 'PERPLEXITY_API_KEY',
      description: 'Your Perplexity AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
