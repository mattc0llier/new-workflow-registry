import type { Step } from '../elements-types';

export const perplexityAI: Step = {
  id: 'perplexity-ai',
  name: 'Perplexity AI',
  description: 'Search and answer questions with Perplexity AI',
  icon: 'Search',
  category: 'AI',
  integration: 'perplexity',
  tags: ['ai', 'perplexity', 'search', 'llm'],
  code: `import { fatalError } from '@vercel/workflow';

type PerplexityParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function perplexityAI(params: PerplexityParams) {
  'use step';

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw fatalError('PERPLEXITY_API_KEY is required');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'llama-3.1-sonar-large-128k-online',
      messages: params.messages,
    }),
  });

  if (!response.ok) {
    throw fatalError(\`Perplexity API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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
