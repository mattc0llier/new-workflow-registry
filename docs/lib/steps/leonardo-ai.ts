import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/leonardo-ai.ts'),
  'utf-8'
);

export const leonardoAI: Step = {
  id: 'leonardo-ai',
  name: 'Leonardo AI Image Generation',
  description: 'Generate creative images with Leonardo AI',
  icon: 'Palette',
  category: 'AI',
  integration: 'leonardo',
  tags: ['ai', 'leonardo', 'image-generation', 'creative'],
  code,
  envVars: [
    {
      name: 'LEONARDO_API_KEY',
      description: 'Your Leonardo AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
