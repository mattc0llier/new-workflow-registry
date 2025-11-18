import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/cohere-generate.ts'),
  'utf-8'
);

export const cohereGenerate: Step = {
  id: 'cohere-generate',
  name: 'Cohere Text Generation',
  description: 'Generate text using Cohere AI models',
  icon: 'FileText',
  category: 'AI',
  integration: 'cohere',
  tags: ['ai', 'cohere', 'llm', 'text-generation'],
  code,
  envVars: [
    {
      name: 'COHERE_API_KEY',
      description: 'Your Cohere API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
