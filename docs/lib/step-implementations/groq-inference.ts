import { fatalError } from '@vercel/workflow';

type GroqParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function groqInference(params: GroqParams) {
  'use step';

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw fatalError('GROQ_API_KEY is required');
  }

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'llama-3.3-70b-versatile',
        messages: params.messages,
      }),
    }
  );

  if (!response.ok) {
    throw fatalError(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
