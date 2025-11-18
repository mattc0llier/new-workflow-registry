import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/runpod-inference.ts'),
  'utf-8'
);

export const runpodInference: Step = {
  id: 'runpod-inference',
  name: 'RunPod GPU Inference',
  description: 'Run AI models on RunPod serverless GPUs',
  icon: 'Server',
  category: 'AI',
  integration: 'runpod',
  tags: ['ai', 'runpod', 'gpu', 'serverless'],
  code,
  envVars: [
    {
      name: 'RUNPOD_API_KEY',
      description: 'Your RunPod API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
