import { fatalError } from '@vercel/workflow';

type MistralParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function mistralAI(params: MistralParams) {
  'use step';

  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw fatalError('MISTRAL_API_KEY is required');
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'mistral-large-latest',
      messages: params.messages,
      temperature: params.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw fatalError(`Mistral API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
