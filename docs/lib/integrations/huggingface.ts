import type { Integration } from '../elements-types';

export const huggingface: Integration = {
  id: 'huggingface',
  name: 'Hugging Face',
  description:
    'Access thousands of open-source AI models via the Inference API',
  icon: 'Heart',
  domain: 'huggingface.co',
  website: 'https://huggingface.co',
  docsUrl: 'https://huggingface.co/docs/api-inference',
  steps: ['huggingface-inference'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://huggingface.co
2. Create an access token in your settings
3. Add the token as HUGGINGFACE_API_TOKEN to your environment variables`,
};
