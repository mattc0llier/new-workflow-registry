import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/anthropic-claude.ts'),
  'utf-8'
);

export const anthropicClaude: Step = {
  id: 'anthropic-claude',
  name: 'Anthropic Claude',
  description: 'Generate responses using Claude AI models from Anthropic',
  icon: 'Brain',
  category: 'AI',
  integration: 'anthropic',
  tags: ['ai', 'anthropic', 'claude', 'llm'],
  code,
  envVars: [
    {
      name: 'ANTHROPIC_API_KEY',
      description: 'Your Anthropic API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['content-generator', 'ai-content-pipeline'],
};
