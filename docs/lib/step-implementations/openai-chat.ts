import { FatalError } from 'workflow';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

type ChatParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function openaiChat(params: ChatParams) {
  'use step';

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new FatalError('OPENAI_API_KEY is required');
  }

  try {
    const { text } = await generateText({
      model: openai(params.model || 'gpt-4', { apiKey }),
      messages: params.messages,
      temperature: params.temperature || 0.7,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
