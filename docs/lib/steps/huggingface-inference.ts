import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/huggingface-inference.ts'),
  'utf-8'
);

export const huggingfaceInference: Step = {
  id: 'huggingface-inference',
  name: 'Hugging Face Inference',
  description: 'Run inference on Hugging Face models via their API',
  icon: 'Heart',
  category: 'AI',
  integration: 'huggingface',
  tags: ['ai', 'huggingface', 'ml', 'transformers'],
  code,
  envVars: [
    {
      name: 'HUGGINGFACE_API_TOKEN',
      description: 'Your Hugging Face API token',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
