import type { Integration } from '../elements-types';

export const mistral: Integration = {
  id: 'mistral',
  name: 'Mistral AI',
  description: 'Fast and efficient AI models from Mistral',
  icon: 'Zap',
  domain: 'mistral.ai',
  website: 'https://mistral.ai',
  docsUrl: 'https://docs.mistral.ai',
  steps: ['mistral-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://console.mistral.ai
2. Create an API key
3. Add the key as MISTRAL_API_KEY to your environment variables`,
};
