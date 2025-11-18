import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/openai-chat.ts'),
  'utf-8'
);

export const openaiChat: Step = {
  id: 'openai-chat',
  name: 'OpenAI Chat Completion',
  description: 'Generate chat completions using OpenAI GPT models',
  icon: 'Bot',
  category: 'AI',
  integration: 'openai',
  tags: ['ai', 'openai', 'gpt', 'llm'],
  code,
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
