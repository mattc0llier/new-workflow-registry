import type { Step } from '../elements-types';

export const runpodInference: Step = {
  id: 'runpod-inference',
  name: 'RunPod GPU Inference',
  description: 'Run AI models on RunPod serverless GPUs',
  icon: 'Server',
  category: 'AI',
  integration: 'runpod',
  tags: ['ai', 'runpod', 'gpu', 'serverless'],
  code: `import { fatalError } from '@vercel/workflow';

type RunPodParams = {
  endpoint_id: string;
  input: Record<string, any>;
};

export async function runpodInference(params: RunPodParams) {
  'use step';

  const apiKey = process.env.RUNPOD_API_KEY;

  if (!apiKey) {
    throw fatalError('RUNPOD_API_KEY is required');
  }

  const response = await fetch(
    \`https://api.runpod.ai/v2/\${params.endpoint_id}/run\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: params.input,
      }),
    }
  );

  if (!response.ok) {
    throw fatalError(\`RunPod API error: \${response.status}\`);
  }

  return await response.json();
}
`,

  envVars: [
    {
      name: 'RUNPOD_API_KEY',
      description: 'Your RunPod API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
