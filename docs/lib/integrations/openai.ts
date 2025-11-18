import type { Integration } from '../elements-types';

export const openai: Integration = {
  id: 'openai',
  name: 'OpenAI',
  description: 'Access GPT models, embeddings, and other AI capabilities',
  icon: 'Bot',
  domain: 'openai.com',
  website: 'https://openai.com',
  docsUrl: 'https://platform.openai.com/docs',
  steps: ['openai-chat'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://platform.openai.com
2. Create an API key in your account settings
3. Add billing information
4. Add the API key as OPENAI_API_KEY to your environment variables`,
};
