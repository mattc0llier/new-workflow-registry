import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/mistral-ai.ts'),
  'utf-8'
);

export const mistralAI: Step = {
  id: 'mistral-ai',
  name: 'Mistral AI',
  description: 'Use Mistral AI models for fast and efficient text generation',
  icon: 'Zap',
  category: 'AI',
  integration: 'mistral',
  tags: ['ai', 'mistral', 'llm', 'text-generation'],
  code,
  envVars: [
    {
      name: 'MISTRAL_API_KEY',
      description: 'Your Mistral AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
