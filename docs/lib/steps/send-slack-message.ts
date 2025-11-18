import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/send-slack-message.ts'),
  'utf-8'
);

export const sendSlackMessage: Step = {
  id: 'send-slack-message',
  name: 'Send Slack Message',
  description: 'Send a message to a Slack channel or user using the Slack API',
  icon: 'MessageSquare',
  category: 'Communication',
  integration: 'slack',
  tags: ['slack', 'messaging', 'notifications'],
  code,
  envVars: [
    {
      name: 'SLACK_BOT_TOKEN',
      description: 'Your Slack Bot User OAuth Token',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['slackbot-agent', 'ai-content-pipeline'],
};
