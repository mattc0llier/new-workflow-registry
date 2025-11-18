import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/openrouter-ai.ts'),
  'utf-8'
);

export const openrouterAI: Step = {
  id: 'openrouter-ai',
  name: 'OpenRouter AI',
  description: 'Access multiple AI models through a unified API',
  icon: 'Network',
  category: 'AI',
  integration: 'openrouter',
  tags: ['ai', 'openrouter', 'llm', 'multi-model'],
  code,
  envVars: [
    {
      name: 'OPENROUTER_API_KEY',
      description: 'Your OpenRouter API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
