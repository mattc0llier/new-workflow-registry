import type { Workflow } from '../elements-types';

export const slackbotAgent: Workflow = {
  id: 'slackbot-agent',
  name: 'AI Slackbot Agent',
  description: 'An intelligent Slack bot that responds to messages using GPT',
  icon: 'Bot',
  category: 'AI Agents',
  difficulty: 'Intermediate',
  steps: [
    {
      stepId: 'openai-chat',
      order: 1,
      description: 'Process the message with GPT to generate a response',
    },
    {
      stepId: 'send-slack-message',
      order: 2,
      description: 'Send the AI-generated response back to Slack',
    },
  ],
  code: `import { workflow } from '@vercel/workflow';
import { openaiChat } from '@/steps/openai-chat';
import { sendSlackMessage } from '@/steps/send-slack-message';

type SlackbotParams = {
  channel: string;
  userMessage: string;
  context?: string;
};

export const slackbotAgent = workflow(
  'slackbot-agent',
  async (params: SlackbotParams) => {
    // Step 1: Generate AI response
    const aiResponse = await openaiChat({
      messages: [
        {
          role: 'system',
          content: params.context || 'You are a helpful Slack assistant.',
        },
        {
          role: 'user',
          content: params.userMessage,
        },
      ],
    });

    // Step 2: Send response to Slack
    await sendSlackMessage({
      channel: params.channel,
      text: aiResponse,
    });

    return { success: true, response: aiResponse };
  }
);
`,

  useCase:
    'Build an intelligent Slack bot that can answer questions, help with tasks, and engage with your team using AI.',
  prerequisites: ['OpenAI API key', 'Slack Bot token with chat:write scope'],
};
