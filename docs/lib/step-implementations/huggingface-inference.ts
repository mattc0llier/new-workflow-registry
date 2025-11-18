import { fatalError } from '@vercel/workflow';

type HuggingFaceParams = {
  model: string;
  inputs: string | Record<string, any>;
  parameters?: Record<string, any>;
};

export async function huggingfaceInference(params: HuggingFaceParams) {
  'use step';

  const apiKey = process.env.HUGGINGFACE_API_TOKEN;

  if (!apiKey) {
    throw fatalError('HUGGINGFACE_API_TOKEN is required');
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${params.model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: params.inputs,
        parameters: params.parameters,
      }),
    }
  );

  if (!response.ok) {
    throw fatalError(`Hugging Face API error: ${response.status}`);
  }

  return await response.json();
}
