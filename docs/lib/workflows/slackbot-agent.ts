import fs from 'fs';
import path from 'path';
import type { Workflow } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../workflow-implementations/slackbot-agent.ts'),
  'utf-8'
);

export const slackbotAgent: Workflow = {
  id: 'slackbot-agent',
  name: 'AI Slackbot Agent',
  description: 'An intelligent Slack bot that responds to messages using GPT',
  icon: 'Bot',
  category: 'AI Agents',
  difficulty: 'Intermediate',
  steps: [
    {
      stepId: 'openai-chat',
      order: 1,
      description: 'Process the message with GPT to generate a response',
    },
    {
      stepId: 'send-slack-message',
      order: 2,
      description: 'Send the AI-generated response back to Slack',
    },
  ],
  code,
  useCase:
    'Build an intelligent Slack bot that can answer questions, help with tasks, and engage with your team using AI.',
  prerequisites: ['OpenAI API key', 'Slack Bot token with chat:write scope'],
};
