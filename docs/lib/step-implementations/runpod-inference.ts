import { fatalError } from '@vercel/workflow';

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
    throw fatalError(`RunPod API error: ${response.status}`);
  }

  return await response.json();
}
