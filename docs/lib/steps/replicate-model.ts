import type { Step } from '../elements-types';

export const replicateModel: Step = {
  id: 'replicate-model',
  name: 'Replicate Model Inference',
  description:
    'Run AI models on Replicate for image generation, video, and more',
  icon: 'Wand2',
  category: 'AI',
  integration: 'replicate',
  tags: ['ai', 'replicate', 'image-generation', 'ml'],
  code: `import { fatalError, retryableError } from '@vercel/workflow';

type ReplicateParams = {
  model: string;
  input: Record<string, any>;
  webhook?: string;
};

export async function replicateModel(params: ReplicateParams) {
  'use step';

  const apiKey = process.env.REPLICATE_API_TOKEN;

  if (!apiKey) {
    throw fatalError('REPLICATE_API_TOKEN is required');
  }

  // Create prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: \`Token \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: params.model,
      input: params.input,
      webhook: params.webhook,
    }),
  });

  if (!response.ok) {
    throw fatalError(\`Replicate API error: \${response.status}\`);
  }

  const prediction = await response.json();

  // Poll for completion
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollResponse = await fetch(
      \`https://api.replicate.com/v1/predictions/\${result.id}\`,
      {
        headers: {
          Authorization: \`Token \${apiKey}\`,
        },
      }
    );

    result = await pollResponse.json();
  }

  if (result.status === 'failed') {
    throw retryableError(\`Model inference failed: \${result.error}\`);
  }

  return result.output;
}
`,

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
