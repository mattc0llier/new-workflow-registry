import type { Step } from '../elements-types';

export const googleGemini: Step = {
  id: 'google-gemini',
  name: 'Google Gemini',
  description: 'Generate content using Google Gemini AI models',
  icon: 'Sparkles',
  category: 'AI',
  integration: 'google-ai',
  tags: ['ai', 'google', 'gemini', 'llm'],
  code: `import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { FatalError } from 'workflow';

type GeminiParams = {
  prompt: string;
  model?: string;
  temperature?: number;
};

export async function googleGemini(params: GeminiParams) {
  'use step';

  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new FatalError('GOOGLE_AI_API_KEY is required');
  }

  try {
    const { text } = await generateText({
      model: google(params.model || 'gemini-1.5-pro', { apiKey }),
      prompt: params.prompt,
      temperature: params.temperature || 0.7,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      \`Google AI API error: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`,

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
