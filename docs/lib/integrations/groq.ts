import type { Integration } from '../elements-types';

export const groq: Integration = {
  id: 'groq',
  name: 'Groq',
  description: 'Ultra-fast AI inference with LPU technology',
  icon: 'Zap',
  domain: 'groq.com',
  website: 'https://groq.com',
  docsUrl: 'https://console.groq.com/docs',
  steps: ['groq-inference'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://console.groq.com
2. Create an API key
3. Add the key as GROQ_API_KEY to your environment variables`,
};
