import type { Integration } from '../elements-types';

export const replicate: Integration = {
  id: 'replicate',
  name: 'Replicate',
  description:
    'Run AI models in the cloud for image, video, and audio generation',
  icon: 'Wand2',
  domain: 'replicate.com',
  website: 'https://replicate.com',
  docsUrl: 'https://replicate.com/docs',
  steps: ['replicate-model'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://replicate.com
2. Get your API token from your account settings
3. Add the token as REPLICATE_API_TOKEN to your environment variables`,
};
