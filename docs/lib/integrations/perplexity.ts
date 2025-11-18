import type { Integration } from '../elements-types';

export const perplexity: Integration = {
  id: 'perplexity',
  name: 'Perplexity AI',
  description: 'AI-powered search and question answering',
  icon: 'Search',
  domain: 'perplexity.ai',
  website: 'https://perplexity.ai',
  docsUrl: 'https://docs.perplexity.ai',
  steps: ['perplexity-ai'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://perplexity.ai
2. Get your API key from settings
3. Add the key as PERPLEXITY_API_KEY to your environment variables`,
};
