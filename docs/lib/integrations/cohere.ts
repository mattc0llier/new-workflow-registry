import type { Integration } from '../elements-types';

export const cohere: Integration = {
  id: 'cohere',
  name: 'Cohere',
  description: 'Build with Cohere LLMs for text generation and embeddings',
  icon: 'FileText',
  domain: 'cohere.com',
  website: 'https://cohere.com',
  docsUrl: 'https://docs.cohere.com',
  steps: ['cohere-generate'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://dashboard.cohere.com
2. Create an API key
3. Add the key as COHERE_API_KEY to your environment variables`,
};
