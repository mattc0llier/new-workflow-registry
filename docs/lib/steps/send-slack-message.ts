import type { Step } from '../elements-types';

export const sendSlackMessage: Step = {
  id: 'send-slack-message',
  name: 'Send Slack Message',
  description: 'Send a message to a Slack channel or user using the Slack API',
  icon: 'MessageSquare',
  category: 'Communication',
  integration: 'slack',
  tags: ['slack', 'messaging', 'notifications'],
  code: `// Step function - does the actual API work
async function sendSlackMessageStep(params: {
  channel: string;
  text: string;
  blocks?: any[];
}) {
  "use step";

  const token = process.env.SLACK_BOT_TOKEN;

  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(\`Slack API error: \${data.error}\`);
  }

  return data;
}

// Workflow function - orchestrates the step
export async function sendSlackMessage(params: {
  channel: string;
  text: string;
  blocks?: any[];
}) {
  "use workflow";

  const result = await sendSlackMessageStep(params);

  return {
    success: true,
    messageTs: result.ts,
    channel: result.channel,
  };
}`,
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
