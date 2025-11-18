import type { Integration } from '../elements-types';

export const together: Integration = {
  id: 'together',
  name: 'Together AI',
  description: 'Run open-source AI models at scale',
  icon: 'Star',
  domain: 'together.ai',
  website: 'https://together.ai',
  docsUrl: 'https://docs.together.ai',
  steps: ['together-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://api.together.xyz
2. Create an API key
3. Add the key as TOGETHER_API_KEY to your environment variables`,
};
