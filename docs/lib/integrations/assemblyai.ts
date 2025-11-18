import type { Integration } from '../elements-types';

export const assemblyai: Integration = {
  id: 'assemblyai',
  name: 'AssemblyAI',
  description: 'Advanced speech-to-text and audio intelligence',
  icon: 'AudioLines',
  domain: 'assemblyai.com',
  website: 'https://assemblyai.com',
  docsUrl: 'https://www.assemblyai.com/docs',
  steps: ['assemblyai-transcribe'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://www.assemblyai.com
2. Get your API key from the dashboard
3. Add the key as ASSEMBLYAI_API_KEY to your environment variables`,
};
