import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/assemblyai-transcribe.ts'),
  'utf-8'
);

export const assemblyaiTranscribe: Step = {
  id: 'assemblyai-transcribe',
  name: 'AssemblyAI Transcription',
  description: 'Transcribe and analyze audio with AssemblyAI',
  icon: 'AudioLines',
  category: 'AI',
  integration: 'assemblyai',
  tags: ['ai', 'assemblyai', 'transcription', 'audio-analysis'],
  code,
  envVars: [
    {
      name: 'ASSEMBLYAI_API_KEY',
      description: 'Your AssemblyAI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
