import type { Integration } from '../elements-types';

export const slack: Integration = {
  id: 'slack',
  name: 'Slack',
  description:
    'Send messages, manage channels, and interact with your Slack workspace',
  icon: 'MessageSquare',
  domain: 'slack.com',
  website: 'https://slack.com',
  docsUrl: 'https://api.slack.com/docs',
  steps: ['send-slack-message'],
  authType: 'OAuth',
  category: 'Communication',
  setupInstructions: `1. Create a Slack App at https://api.slack.com/apps
2. Add the chat:write scope to your bot token
3. Install the app to your workspace
4. Copy the Bot User OAuth Token
5. Add it as SLACK_BOT_TOKEN to your environment variables`,
};
