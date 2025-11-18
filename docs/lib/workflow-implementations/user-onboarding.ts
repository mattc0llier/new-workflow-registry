import { workflow } from '@vercel/workflow';
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
      html: `
        <h1>Hi ${params.name}!</h1>
        <p>Welcome to our platform. We're excited to have you here.</p>
        <p>Get started by exploring our features...</p>
      `,
    });

    return { success: true };
  }
);
