import type { Workflow } from '../elements-types';

export const aiContentPipeline: Workflow = {
  id: 'ai-content-pipeline',
  name: 'AI Content Generation Pipeline',
  description:
    'Generate blog content with AI, create a cover image, and distribute via email',
  icon: 'Workflow',
  category: 'AI Agents',
  difficulty: 'Advanced',
  steps: [
    {
      stepId: 'anthropic-claude',
      order: 1,
      description: 'Generate high-quality blog content using Claude AI',
    },
    {
      stepId: 'openai-chat',
      order: 2,
      description: 'Create an engaging image prompt from the content',
    },
    {
      stepId: 'replicate-model',
      order: 3,
      description: 'Generate a cover image using Stable Diffusion',
    },
    {
      stepId: 'send-email-resend',
      order: 4,
      description: 'Send the completed article to subscribers',
    },
    {
      stepId: 'send-slack-message',
      order: 5,
      description: 'Notify the team about the published content',
    },
  ],
  code: `import { workflow } from '@vercel/workflow';
import { anthropicClaude } from '@/steps/anthropic-claude';
import { openaiChat } from '@/steps/openai-chat';
import { replicateModel } from '@/steps/replicate-model';
import { sendEmail } from '@/steps/send-email-resend';
import { sendSlackMessage } from '@/steps/send-slack-message';

type ContentPipelineParams = {
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'technical';
  subscriberEmails: string[];
  slackChannel: string;
};

export const aiContentPipeline = workflow(
  'ai-content-pipeline',
  async (params: ContentPipelineParams) => {
    "use workflow";

    // Step 1: Generate blog content with Claude
    const articlePrompt = \`Write a comprehensive blog post about "\${params.topic}"
for \${params.targetAudience}. Use a \${params.tone} tone.
Include an engaging introduction, main points with examples, and a conclusion.
Format in markdown with proper headings.\`;

    const article = await anthropicClaude({
      messages: [
        {
          role: 'user',
          content: articlePrompt,
        },
      ],
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 2000,
    });

    // Step 2: Create image prompt from content
    const imagePromptRequest = await openaiChat({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating detailed image generation prompts.',
        },
        {
          role: 'user',
          content: \`Based on this blog post, create a detailed Stable Diffusion prompt for a professional cover image. The prompt should be visual and specific: \${article.slice(0, 500)}\`,
        },
      ],
      model: 'gpt-4',
    });

    // Step 3: Generate cover image
    const coverImage = await replicateModel({
      model: 'stability-ai/stable-diffusion',
      input: {
        prompt: imagePromptRequest,
        width: 1024,
        height: 768,
      },
    });

    // Step 4: Send to subscribers
    const emailPromises = params.subscriberEmails.map((email) =>
      sendEmail({
        to: email,
        subject: \`New Article: \${params.topic}\`,
        html: \`
          <h1>New Content Alert!</h1>
          <img src="\${coverImage.url}" alt="Cover image" style="max-width: 100%; height: auto;">
          <div>\${article}</div>
        \`,
      })
    );

    await Promise.all(emailPromises);

    // Step 5: Notify team on Slack
    await sendSlackMessage({
      channel: params.slackChannel,
      text: \`📝 New blog post published: "\${params.topic}"\\n✅ Sent to \${params.subscriberEmails.length} subscribers\\n🎨 Cover image: \${coverImage.url}\`,
    });

    return {
      success: true,
      article,
      coverImage: coverImage.url,
      emailsSent: params.subscriberEmails.length,
    };
  }
);`,
  useCase:
    'Automate your entire content creation and distribution process. Generate high-quality blog posts, create matching cover images, and distribute to your audience - all with AI.',
  prerequisites: [
    'Anthropic API key',
    'OpenAI API key',
    'Replicate API token',
    'Resend API key',
    'Slack Bot token with chat:write scope',
  ],
};
