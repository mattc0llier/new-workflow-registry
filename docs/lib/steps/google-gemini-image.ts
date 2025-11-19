import type { Step } from '../elements-types';

export const googleGeminiImage: Step = {
  id: 'google-gemini-image',
  name: 'Google Gemini Image',
  description: 'Generate images from text using Google Gemini (Nano Banana)',
  icon: 'Image',
  category: 'AI',
  tags: ['google', 'gemini', 'ai', 'image-generation', 'nano-banana'],
  code: `import { fatalError } from '@vercel/workflow';

type GeminiImageParams = {
  prompt: string;
  model?: string;
};

export async function googleGeminiImage(params: GeminiImageParams) {
  'use step';

  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw fatalError('GOOGLE_AI_API_KEY is required');
  }

  const model = params.model || 'gemini-2.5-flash-image';
  const response = await fetch(
    \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`,
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
    throw fatalError(\`Google AI API error: \${response.status}\`);
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
    throw fatalError('No image data returned from Google AI');
  }

  return {
    image: imageBase64,
    text: textResponse,
    mimeType: 'image/png',
  };
}

`,
  dependencies: ['@vercel/workflow'],
  envVars: [
    {
      name: 'GOOGLE_AI_API_KEY',
      description: 'Your Google AI API key',
      required: true,
    },
  ],
  usageExample: `import { googleGeminiImage } from '@/steps/google-gemini-image';

export async function generateImageWorkflow(prompt: string) {
  'use workflow';

  const result = await googleGeminiImage({
    prompt: 'Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme',
    model: 'gemini-2.5-flash-image', // optional
  });

  // result.image is base64 encoded PNG
  // result.text contains any text response
  // result.mimeType is 'image/png'

  return result;
}`,
};
