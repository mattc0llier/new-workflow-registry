import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/google-gemini.ts'),
  'utf-8'
);

export const googleGemini: Step = {
  id: 'google-gemini',
  name: 'Google Gemini',
  description: 'Generate content using Google Gemini AI models',
  icon: 'Sparkles',
  category: 'AI',
  integration: 'google-ai',
  tags: ['ai', 'google', 'gemini', 'llm'],
  code,
  envVars: [
    {
      name: 'GOOGLE_AI_API_KEY',
      description: 'Your Google AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['content-generator'],
};
