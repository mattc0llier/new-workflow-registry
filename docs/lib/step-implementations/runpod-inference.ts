import { FatalError } from '@vercel/workflow';

type RunPodParams = {
  endpoint_id: string;
  input: Record<string, any>;
};

export async function runpodInference(params: RunPodParams) {
  'use step';

  const apiKey = process.env.RUNPOD_API_KEY;

  if (!apiKey) {
    throw new FatalError('RUNPOD_API_KEY is required');
  }

  const response = await fetch(
    `https://api.runpod.ai/v2/${params.endpoint_id}/run`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: params.input,
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(`RunPod API error: ${response.status}`);
  }

  return await response.json();
}
