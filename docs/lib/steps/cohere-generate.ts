import type { Step } from '../elements-types';

export const cohereGenerate: Step = {
  id: 'cohere-generate',
  name: 'Cohere Text Generation',
  description: 'Generate text using Cohere AI models',
  icon: 'FileText',
  category: 'AI',
  integration: 'cohere',
  tags: ['ai', 'cohere', 'llm', 'text-generation'],
  code: `import { fatalError } from '@vercel/workflow';

type CohereParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
};

export async function cohereGenerate(params: CohereParams) {
  "use step";

  const apiKey = process.env.COHERE_API_KEY;

    if (!apiKey) {
      throw fatalError('COHERE_API_KEY is required');
    }

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'command',
        prompt: params.prompt,
        max_tokens: params.max_tokens || 1000,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Cohere API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.generations[0].text;
}`,
  envVars: [
    {
      name: 'COHERE_API_KEY',
      description: 'Your Cohere API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
