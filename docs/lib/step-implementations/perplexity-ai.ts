import { fatalError } from '@vercel/workflow';

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
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'llama-3.1-sonar-large-128k-online',
      messages: params.messages,
    }),
  });

  if (!response.ok) {
    throw fatalError(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
