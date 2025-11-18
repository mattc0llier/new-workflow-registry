import type { Integration } from '../elements-types';

export const stabilityAI: Integration = {
  id: 'stability-ai',
  name: 'Stability AI',
  description:
    'Generate images with Stable Diffusion and other cutting-edge models',
  icon: 'ImageIcon',
  domain: 'stability.ai',
  website: 'https://stability.ai',
  docsUrl: 'https://platform.stability.ai/docs',
  steps: ['stability-ai-image'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://platform.stability.ai
2. Create an API key in your account
3. Add the key as STABILITY_API_KEY to your environment variables`,
};
