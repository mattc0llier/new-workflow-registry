import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/send-email-resend.ts'),
  'utf-8'
);

export const sendEmailResend: Step = {
  id: 'send-email-resend',
  name: 'Send Email with Resend',
  description: 'Send transactional emails using the Resend API',
  icon: 'Mail',
  category: 'Communication',
  integration: 'resend',
  tags: ['email', 'resend', 'notifications'],
  code,
  envVars: [
    {
      name: 'RESEND_API_KEY',
      description: 'Your Resend API key',
      required: true,
    },
    {
      name: 'FROM_EMAIL',
      description: 'Default sender email address',
      required: false,
    },
  ],
  dependencies: ['@vercel/workflow'],
  usedInWorkflows: ['user-onboarding', 'ai-content-pipeline'],
};
