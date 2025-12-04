import type { Step } from '../elements-types';

export const openrouterAI: Step = {
  id: 'openrouter-ai',
  name: 'OpenRouter AI',
  description: 'Access multiple AI models through a unified API',
  icon: 'Network',
  category: 'AI',
  integration: 'openrouter',
  tags: ['ai', 'openrouter', 'llm', 'multi-model'],
  code: `import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

type OpenRouterParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function openrouterAI(params: OpenRouterParams) {
  'use step';

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new FatalError('OPENROUTER_API_KEY is required');
  }

  try {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });

    const { text } = await generateText({
      model: openrouter(params.model || 'anthropic/claude-3.5-sonnet'),
      messages: params.messages,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      \`OpenRouter API error: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`,

  envVars: [
    {
      name: 'OPENROUTER_API_KEY',
      description: 'Your OpenRouter API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
