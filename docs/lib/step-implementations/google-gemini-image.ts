import { FatalError } from '@vercel/workflow';

type GeminiImageParams = {
  prompt: string;
  model?: string;
};

export async function googleGeminiImage(params: GeminiImageParams) {
  'use step';

  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new FatalError('GOOGLE_AI_API_KEY is required');
  }

  const model = params.model || 'gemini-2.5-flash-image';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: params.prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(`Google AI API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract the image data from the response
  let imageBase64: string | null = null;
  let textResponse: string | null = null;

  for (const candidate of data.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.text) {
        textResponse = part.text;
      } else if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }
  }

  if (!imageBase64) {
    throw new FatalError('No image data returned from Google AI');
  }

  return {
    image: imageBase64,
    text: textResponse,
    mimeType: 'image/png',
  };
}
