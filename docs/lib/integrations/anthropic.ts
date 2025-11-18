import type { Integration } from '../elements-types';

export const anthropic: Integration = {
  id: 'anthropic',
  name: 'Anthropic',
  description:
    'Access Claude AI models for advanced reasoning and conversation',
  icon: 'Brain',
  domain: 'anthropic.com',
  website: 'https://anthropic.com',
  docsUrl: 'https://docs.anthropic.com',
  steps: ['anthropic-claude'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://console.anthropic.com
2. Create an API key in your account settings
3. Add the API key as ANTHROPIC_API_KEY to your environment variables`,
};
