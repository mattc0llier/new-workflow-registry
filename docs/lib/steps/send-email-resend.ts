import type { Step } from '../elements-types';

export const sendEmailResend: Step = {
  id: 'send-email-resend',
  name: 'Send Email with Resend',
  description: 'Send transactional emails using the Resend API',
  icon: 'Mail',
  category: 'Communication',
  integration: 'resend',
  tags: ['email', 'resend', 'notifications'],
  code: `import { FatalError } from 'workflow';

type EmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail(params: EmailParams) {
  'use step';

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new FatalError('RESEND_API_KEY is required');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      from: params.from || process.env.FROM_EMAIL || 'noreply@example.com',
    }),
  });

  if (!response.ok) {
    throw new FatalError(\`Resend API error: \${response.status}\`);
  }

  return await response.json();
}
`,

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
