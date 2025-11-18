import type { Integration } from '../elements-types';

export const fireworks: Integration = {
  id: 'fireworks',
  name: 'Fireworks AI',
  description: 'Fast inference for open-source AI models',
  icon: 'Flame',
  domain: 'fireworks.ai',
  website: 'https://fireworks.ai',
  docsUrl: 'https://docs.fireworks.ai',
  steps: ['fireworks-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://fireworks.ai
2. Create an API key
3. Add the key as FIREWORKS_API_KEY to your environment variables`,
};
