import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/groq-inference.ts'),
  'utf-8'
);

export const groqInference: Step = {
  id: 'groq-inference',
  name: 'Groq LPU Inference',
  description: 'Ultra-fast AI inference with Groq LPU technology',
  icon: 'Zap',
  category: 'AI',
  integration: 'groq',
  tags: ['ai', 'groq', 'llm', 'fast-inference'],
  code,
  envVars: [
    {
      name: 'GROQ_API_KEY',
      description: 'Your Groq API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
