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

  const response = await fetch(
    'https://api.fireworks.ai/inference/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model:
          params.model || 'accounts/fireworks/models/llama-v3p1-70b-instruct',
        messages: params.messages,
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(\`Fireworks API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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
