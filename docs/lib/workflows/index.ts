import { slackbotAgent } from './slackbot-agent';
import { userOnboarding } from './user-onboarding';
import { paymentProcessing } from './payment-processing';
import { aiContentPipeline } from './ai-content-pipeline';

export const WORKFLOWS = [
  slackbotAgent,
  userOnboarding,
  paymentProcessing,
  aiContentPipeline,
];
