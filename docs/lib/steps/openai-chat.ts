import type { Step } from '../elements-types';

export const openaiChat: Step = {
  id: 'openai-chat',
  name: 'OpenAI Chat Completion',
  description: 'Generate chat completions using OpenAI GPT models',
  icon: 'Bot',
  category: 'AI',
  integration: 'openai',
  tags: ['ai', 'openai', 'gpt', 'llm'],
  code: `import { FatalError } from 'workflow';

type ChatParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function openaiChat(params: ChatParams) {
  'use step';

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new FatalError('OPENAI_API_KEY is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'gpt-4',
      messages: params.messages,
      temperature: params.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new FatalError(\`OpenAI API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
`,

  envVars: [
    {
      name: 'OPENAI_API_KEY',
      description: 'Your OpenAI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: [
    'slackbot-agent',
    'content-generator',
    'ai-content-pipeline',
  ],
};
