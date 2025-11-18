import type { Integration } from '../elements-types';

export const openrouter: Integration = {
  id: 'openrouter',
  name: 'OpenRouter',
  description: 'Unified API for multiple AI models',
  icon: 'Network',
  domain: 'openrouter.ai',
  website: 'https://openrouter.ai',
  docsUrl: 'https://openrouter.ai/docs',
  steps: ['openrouter-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://openrouter.ai
2. Create an API key
3. Add the key as OPENROUTER_API_KEY to your environment variables`,
};
