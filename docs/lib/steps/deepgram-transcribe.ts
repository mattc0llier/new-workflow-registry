import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/deepgram-transcribe.ts'),
  'utf-8'
);

export const deepgramTranscribe: Step = {
  id: 'deepgram-transcribe',
  name: 'Deepgram Speech-to-Text',
  description: 'Transcribe audio to text with Deepgram AI',
  icon: 'Mic',
  category: 'AI',
  integration: 'deepgram',
  tags: ['ai', 'deepgram', 'speech-to-text', 'transcription'],
  code,
  envVars: [
    {
      name: 'DEEPGRAM_API_KEY',
      description: 'Your Deepgram API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
