import fs from 'fs';
import path from 'path';
import type { Workflow } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../workflow-implementations/ai-content-pipeline.ts'),
  'utf-8'
);

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
  code,
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
