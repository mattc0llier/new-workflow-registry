import type { Integration } from '../elements-types';

export const deepgram: Integration = {
  id: 'deepgram',
  name: 'Deepgram',
  description: 'AI-powered speech recognition and transcription',
  icon: 'Mic',
  domain: 'deepgram.com',
  website: 'https://deepgram.com',
  docsUrl: 'https://developers.deepgram.com/docs',
  steps: ['deepgram-transcribe'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://console.deepgram.com
2. Create an API key
3. Add the key as DEEPGRAM_API_KEY to your environment variables`,
};
