import { FatalError } from 'workflow';
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
      `Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
