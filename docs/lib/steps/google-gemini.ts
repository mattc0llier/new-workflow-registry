import type { Step } from '../elements-types';

export const googleGemini: Step = {
  id: 'google-gemini',
  name: 'Google Gemini',
  description: 'Generate content using Google Gemini AI models',
  icon: 'Sparkles',
  category: 'AI',
  integration: 'google-ai',
  tags: ['ai', 'google', 'gemini', 'llm'],
  code: `import { fatalError } from '@vercel/workflow';

type GeminiParams = {
  prompt: string;
  model?: string;
  temperature?: number;
};

export async function googleGemini(params: GeminiParams) {
  "use step";

  const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw fatalError('GOOGLE_AI_API_KEY is required');
    }

    const model = params.model || 'gemini-1.5-pro';
    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: params.prompt }]
          }],
          generationConfig: {
            temperature: params.temperature || 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw fatalError(\`Google AI API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}`,
  envVars: [
    {
      name: 'GOOGLE_AI_API_KEY',
      description: 'Your Google AI API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['content-generator'],
};
