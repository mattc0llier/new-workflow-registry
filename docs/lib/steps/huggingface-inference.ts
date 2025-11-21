import type { Step } from '../elements-types';

export const huggingfaceInference: Step = {
  id: 'huggingface-inference',
  name: 'Hugging Face Inference',
  description: 'Run inference on Hugging Face models via their API',
  icon: 'Heart',
  category: 'AI',
  integration: 'huggingface',
  tags: ['ai', 'huggingface', 'ml', 'transformers'],
  code: `import { FatalError } from 'workflow';

type HuggingFaceParams = {
  model: string;
  inputs: string | Record<string, any>;
  parameters?: Record<string, any>;
};

export async function huggingfaceInference(params: HuggingFaceParams) {
  'use step';

  const apiKey = process.env.HUGGINGFACE_API_TOKEN;

  if (!apiKey) {
    throw new FatalError('HUGGINGFACE_API_TOKEN is required');
  }

  const response = await fetch(
    \`https://api-inference.huggingface.co/models/\${params.model}\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: params.inputs,
        parameters: params.parameters,
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(\`Hugging Face API error: \${response.status}\`);
  }

  return await response.json();
}
`,

  envVars: [
    {
      name: 'HUGGINGFACE_API_TOKEN',
      description: 'Your Hugging Face API token',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
