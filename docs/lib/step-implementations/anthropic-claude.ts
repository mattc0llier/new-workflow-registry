import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { FatalError } from 'workflow';

type ClaudeParams = {
  messages: { role: string; content: string }[];
  model?: string;
  max_tokens?: number;
};

export async function anthropicClaude(params: ClaudeParams) {
  'use step';

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new FatalError('ANTHROPIC_API_KEY is required');
  }

  try {
    const { text } = await generateText({
      model: anthropic(params.model || 'claude-3-5-sonnet-20241022', {
        apiKey,
      }),
      messages: params.messages,
      maxTokens: params.max_tokens || 4096,
    });

    return text;
  } catch (error) {
    throw new FatalError(
      `Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
