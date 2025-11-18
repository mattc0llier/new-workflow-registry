import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/together-ai.ts'),
  'utf-8'
);

export const togetherAI: Step = {
  id: 'together-ai',
  name: 'Together AI',
  description: 'Run open-source models with Together AI inference',
  icon: 'Star',
  category: 'AI',
  integration: 'together',
  tags: ['ai', 'together', 'open-source', 'llm'],
  code,
  envVars: [
    {
      name: 'TOGETHER_API_KEY',
      description: 'Your Together AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
