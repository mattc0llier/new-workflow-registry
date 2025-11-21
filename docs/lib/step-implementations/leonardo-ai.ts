import { FatalError, retryableError } from '@vercel/workflow';

type LeonardoParams = {
  prompt: string;
  model_id?: string;
  width?: number;
  height?: number;
};

export async function leonardoAI(params: LeonardoParams) {
  'use step';

  const apiKey = process.env.LEONARDO_API_KEY;

  if (!apiKey) {
    throw new FatalError('LEONARDO_API_KEY is required');
  }

  // Generate image
  const response = await fetch(
    'https://cloud.leonardo.ai/api/rest/v1/generations',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        modelId: params.model_id || 'b24e16ff-06e3-43eb-8d33-4416c2d75876',
        width: params.width || 1024,
        height: params.height || 1024,
        num_images: 1,
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(`Leonardo API error: ${response.status}`);
  }

  const { sdGenerationJob } = await response.json();

  // Poll for completion
  let result;
  while (true) {
    const pollResponse = await fetch(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${sdGenerationJob.generationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    result = await pollResponse.json();

    if (result.generations_by_pk.status === 'COMPLETE') {
      break;
    } else if (result.generations_by_pk.status === 'FAILED') {
      throw retryableError('Image generation failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return result.generations_by_pk.generated_images[0].url;
}
