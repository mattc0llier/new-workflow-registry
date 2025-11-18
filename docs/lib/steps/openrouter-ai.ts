import type { Step } from '../elements-types';

export const openrouterAI: Step = {
  id: 'openrouter-ai',
  name: 'OpenRouter AI',
  description: 'Access multiple AI models through a unified API',
  icon: 'Network',
  category: 'AI',
  integration: 'openrouter',
  tags: ['ai', 'openrouter', 'llm', 'multi-model'],
  code: `import { fatalError } from '@vercel/workflow';

type OpenRouterParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function openrouterAI(params: OpenRouterParams) {
  "use step";

  const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw fatalError('OPENROUTER_API_KEY is required');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'anthropic/claude-3.5-sonnet',
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`OpenRouter API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
  envVars: [
    {
      name: 'OPENROUTER_API_KEY',
      description: 'Your OpenRouter API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
