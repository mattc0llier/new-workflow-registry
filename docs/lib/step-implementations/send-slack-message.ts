import { fatalError } from '@vercel/workflow';

type SlackMessageParams = {
  channel: string;
  text: string;
  blocks?: any[];
};

export async function sendSlackMessage(params: SlackMessageParams) {
  'use step';

  const token = process.env.SLACK_BOT_TOKEN;

  if (!token) {
    throw fatalError('SLACK_BOT_TOKEN is required');
  }

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!data.ok) {
    throw fatalError(`Slack API error: ${data.error}`);
  }

  return {
    success: true,
    messageTs: data.ts,
    channel: data.channel,
  };
}
