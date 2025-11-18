import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/perplexity-ai.ts'),
  'utf-8'
);

export const perplexityAI: Step = {
  id: 'perplexity-ai',
  name: 'Perplexity AI',
  description: 'Search and answer questions with Perplexity AI',
  icon: 'Search',
  category: 'AI',
  integration: 'perplexity',
  tags: ['ai', 'perplexity', 'search', 'llm'],
  code,
  envVars: [
    {
      name: 'PERPLEXITY_API_KEY',
      description: 'Your Perplexity AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
