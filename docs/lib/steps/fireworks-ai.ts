import type { Step } from '../elements-types';

export const fireworksAI: Step = {
  id: 'fireworks-ai',
  name: 'Fireworks AI',
  description: 'Fast inference for open-source AI models',
  icon: 'Flame',
  category: 'AI',
  integration: 'fireworks',
  tags: ['ai', 'fireworks', 'llm', 'inference'],
  code: `import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

type FireworksParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function fireworksAI(params: FireworksParams) {
  'use step';

  const apiKey = process.env.FIREWORKS_API_KEY;

  if (!apiKey) {
    throw new FatalError('FIREWORKS_API_KEY is required');
  }

  try {
    const fireworks = createOpenAI({
      baseURL: 'https://api.fireworks.ai/inference/v1',
      apiKey,
    });

    const { text } = await generateText({
      model: fireworks(
        params.model || 'accounts/fireworks/models/llama-v3p1-70b-instruct'
      ),
      messages: params.messages,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      \`Fireworks API error: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`,

  envVars: [
    {
      name: 'FIREWORKS_API_KEY',
      description: 'Your Fireworks AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
