import { fatalError } from '@vercel/workflow';

type ClaudeParams = {
  messages: { role: string; content: string }[];
  model?: string;
  max_tokens?: number;
};

export async function anthropicClaude(params: ClaudeParams) {
  'use step';

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw fatalError('ANTHROPIC_API_KEY is required');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'claude-3-5-sonnet-20241022',
      messages: params.messages,
      max_tokens: params.max_tokens || 4096,
    }),
  });

  if (!response.ok) {
    throw fatalError(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
