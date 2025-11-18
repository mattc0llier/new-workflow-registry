import { aiContentPipeline } from './ai-content-pipeline';
import { paymentProcessing } from './payment-processing';
import { slackbotAgent } from './slackbot-agent';
import { userOnboarding } from './user-onboarding';

export const WORKFLOWS = [
  slackbotAgent,
  userOnboarding,
  paymentProcessing,
  aiContentPipeline,
];
