import { workflow } from '@vercel/workflow';
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
