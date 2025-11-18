import type { Step } from '../elements-types';

export const togetherAI: Step = {
  id: 'together-ai',
  name: 'Together AI',
  description: 'Run open-source models with Together AI inference',
  icon: 'Star',
  category: 'AI',
  integration: 'together',
  tags: ['ai', 'together', 'open-source', 'llm'],
  code: `import { fatalError } from '@vercel/workflow';

type TogetherParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
};

export async function togetherAI(params: TogetherParams) {
  'use step';

  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    throw fatalError('TOGETHER_API_KEY is required');
  }

  const response = await fetch('https://api.together.xyz/v1/completions', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      prompt: params.prompt,
      max_tokens: params.max_tokens || 1000,
    }),
  });

  if (!response.ok) {
    throw fatalError(\`Together API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.choices[0].text;
}
`,

  envVars: [
    {
      name: 'TOGETHER_API_KEY',
      description: 'Your Together AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
