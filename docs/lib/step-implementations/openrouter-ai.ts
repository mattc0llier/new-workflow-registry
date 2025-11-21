import { FatalError } from '@vercel/workflow';

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

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'anthropic/claude-3.5-sonnet',
        messages: params.messages,
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
