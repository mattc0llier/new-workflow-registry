import type { Step } from '../elements-types';

export const groqInference: Step = {
  id: 'groq-inference',
  name: 'Groq LPU Inference',
  description: 'Ultra-fast AI inference with Groq LPU technology',
  icon: 'Zap',
  category: 'AI',
  integration: 'groq',
  tags: ['ai', 'groq', 'llm', 'fast-inference'],
  code: `import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

type GroqParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function groqInference(params: GroqParams) {
  'use step';

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new FatalError('GROQ_API_KEY is required');
  }

  try {
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
    });

    const { text } = await generateText({
      model: groq(params.model || 'llama-3.3-70b-versatile'),
      messages: params.messages,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      \`Groq API error: \${error instanceof Error ? error.message : 'Unknown error'}\`
    );
  }
}
`,

  envVars: [
    {
      name: 'GROQ_API_KEY',
      description: 'Your Groq API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
