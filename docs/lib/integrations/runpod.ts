import type { Integration } from '../elements-types';

export const runpod: Integration = {
  id: 'runpod',
  name: 'RunPod',
  description: 'Serverless GPU infrastructure for AI workloads',
  icon: 'Server',
  domain: 'runpod.io',
  website: 'https://runpod.io',
  docsUrl: 'https://docs.runpod.io',
  steps: ['runpod-inference'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://runpod.io
2. Get your API key from settings
3. Create a serverless endpoint
4. Add the key as RUNPOD_API_KEY to your environment variables`,
};
