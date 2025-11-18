import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/fireworks-ai.ts'),
  'utf-8'
);

export const fireworksAI: Step = {
  id: 'fireworks-ai',
  name: 'Fireworks AI',
  description: 'Fast inference for open-source AI models',
  icon: 'Flame',
  category: 'AI',
  integration: 'fireworks',
  tags: ['ai', 'fireworks', 'llm', 'inference'],
  code,
  envVars: [
    {
      name: 'FIREWORKS_API_KEY',
      description: 'Your Fireworks AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
