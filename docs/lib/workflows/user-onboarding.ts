import fs from 'fs';
import path from 'path';
import type { Workflow } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../workflow-implementations/user-onboarding.ts'),
  'utf-8'
);

export const userOnboarding: Workflow = {
  id: 'user-onboarding',
  name: 'User Onboarding Flow',
  description: 'Automated email workflow for welcoming new users',
  icon: 'UserPlus',
  category: 'Automation',
  difficulty: 'Beginner',
  steps: [
    {
      stepId: 'send-email-resend',
      order: 1,
      description: 'Send welcome email to new user',
    },
  ],
  code,
  useCase:
    'Automatically send welcome emails and onboarding materials when new users sign up.',
  prerequisites: ['Resend API key', 'Verified sending domain'],
};
