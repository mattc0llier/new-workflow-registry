import type { Step } from '../elements-types';

export const stabilityAIImage: Step = {
  id: 'stability-ai-image',
  name: 'Stability AI Image Generation',
  description: 'Generate images using Stable Diffusion models',
  icon: 'ImageIcon',
  category: 'AI',
  integration: 'stability-ai',
  tags: ['ai', 'stability', 'stable-diffusion', 'image-generation'],
  code: `import { fatalError } from '@vercel/workflow';

type StabilityParams = {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
};

export async function stabilityAIImage(params: StabilityParams) {
  "use step";

  const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) {
      throw fatalError('STABILITY_API_KEY is required');
    }

    const formData = new FormData();
    formData.append('prompt', params.prompt);
    if (params.negative_prompt) {
      formData.append('negative_prompt', params.negative_prompt);
    }
    formData.append('output_format', 'png');

    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Accept': 'image/*',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw fatalError(\`Stability AI API error: \${response.status}\`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return {
      image: base64Image,
      contentType: 'image/png',
    };
}`,
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
