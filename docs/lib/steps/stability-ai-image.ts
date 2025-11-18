import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/stability-ai-image.ts'),
  'utf-8'
);

export const stabilityAIImage: Step = {
  id: 'stability-ai-image',
  name: 'Stability AI Image Generation',
  description: 'Generate images using Stable Diffusion models',
  icon: 'ImageIcon',
  category: 'AI',
  integration: 'stability-ai',
  tags: ['ai', 'stability', 'stable-diffusion', 'image-generation'],
  code,
  envVars: [
    {
      name: 'STABILITY_API_KEY',
      description: 'Your Stability AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['image-generation'],
};
