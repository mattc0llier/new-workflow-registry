import { FatalError, retryableError } from 'workflow';

type ReplicateParams = {
  model: string;
  input: Record<string, any>;
  webhook?: string;
};

export async function replicateModel(params: ReplicateParams) {
  'use step';

  const apiKey = process.env.REPLICATE_API_TOKEN;

  if (!apiKey) {
    throw new FatalError('REPLICATE_API_TOKEN is required');
  }

  // Create prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: params.model,
      input: params.input,
      webhook: params.webhook,
    }),
  });

  if (!response.ok) {
    throw new FatalError(`Replicate API error: ${response.status}`);
  }

  const prediction = await response.json();

  // Poll for completion
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${result.id}`,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      }
    );

    result = await pollResponse.json();
  }

  if (result.status === 'failed') {
    throw retryableError(`Model inference failed: ${result.error}`);
  }

  return result.output;
}
