import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/elevenlabs-tts.ts'),
  'utf-8'
);

export const elevenlabsTTS: Step = {
  id: 'elevenlabs-tts',
  name: 'ElevenLabs Text-to-Speech',
  description: 'Convert text to speech using ElevenLabs AI voices',
  icon: 'Volume2',
  category: 'AI',
  integration: 'elevenlabs',
  tags: ['ai', 'elevenlabs', 'tts', 'voice', 'audio'],
  code,
  envVars: [
    {
      name: 'ELEVENLABS_API_KEY',
      description: 'Your ElevenLabs API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
