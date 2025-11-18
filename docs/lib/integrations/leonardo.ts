import type { Integration } from '../elements-types';

export const leonardo: Integration = {
  id: 'leonardo',
  name: 'Leonardo AI',
  description: 'AI-powered creative image generation',
  icon: 'Palette',
  domain: 'leonardo.ai',
  website: 'https://leonardo.ai',
  docsUrl: 'https://docs.leonardo.ai',
  steps: ['leonardo-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://app.leonardo.ai
2. Get your API key from settings
3. Add the key as LEONARDO_API_KEY to your environment variables`,
};
