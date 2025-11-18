import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/replicate-model.ts'),
  'utf-8'
);

export const replicateModel: Step = {
  id: 'replicate-model',
  name: 'Replicate Model Inference',
  description:
    'Run AI models on Replicate for image generation, video, and more',
  icon: 'Wand2',
  category: 'AI',
  integration: 'replicate',
  tags: ['ai', 'replicate', 'image-generation', 'ml'],
  code,
  envVars: [
    {
      name: 'REPLICATE_API_TOKEN',
      description: 'Your Replicate API token',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['image-generation', 'ai-content-pipeline'],
};
