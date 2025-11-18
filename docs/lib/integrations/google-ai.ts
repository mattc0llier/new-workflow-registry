import type { Integration } from '../elements-types';

export const googleAI: Integration = {
  id: 'google-ai',
  name: 'Google AI',
  description: 'Access Google Gemini and other Google AI models',
  icon: 'Sparkles',
  domain: 'ai.google.dev',
  website: 'https://ai.google.dev',
  docsUrl: 'https://ai.google.dev/docs',
  steps: ['google-gemini'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Visit https://makersuite.google.com/app/apikey
2. Create an API key
3. Add the key as GOOGLE_AI_API_KEY to your environment variables`,
};
