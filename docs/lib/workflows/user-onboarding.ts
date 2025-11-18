import type { Workflow } from '../elements-types';

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
  code: `import { workflow } from '@vercel/workflow';
import { sendEmail } from '@/steps/send-email-resend';

type OnboardingParams = {
  email: string;
  name: string;
};

export const userOnboarding = workflow(
  'user-onboarding',
  async (params: OnboardingParams) => {
    // Send welcome email
    await sendEmail({
      to: params.email,
      subject: 'Welcome to our platform! 👋',
      html: \`
        <h1>Hi \${params.name}!</h1>
        <p>Welcome to our platform. We're excited to have you here.</p>
        <p>Get started by exploring our features...</p>
      \`,
    });

    return { success: true };
  }
);
`,

  useCase:
    'Automatically send welcome emails and onboarding materials when new users sign up.',
  prerequisites: ['Resend API key', 'Verified sending domain'],
};
