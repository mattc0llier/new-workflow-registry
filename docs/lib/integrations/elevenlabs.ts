import type { Integration } from '../elements-types';

export const elevenlabs: Integration = {
  id: 'elevenlabs',
  name: 'ElevenLabs',
  description: 'Generate realistic AI voices and speech with cutting-edge TTS',
  icon: 'Volume2',
  domain: 'elevenlabs.io',
  website: 'https://elevenlabs.io',
  docsUrl: 'https://elevenlabs.io/docs',
  steps: ['elevenlabs-tts'],
  authType: 'API Key',
  category: 'AI',
  setupInstructions: `1. Sign up at https://elevenlabs.io
2. Get your API key from your profile
3. Add the key as ELEVENLABS_API_KEY to your environment variables`,
};
