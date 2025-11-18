import type { Integration } from '../elements-types';

export const resend: Integration = {
  id: 'resend',
  name: 'Resend',
  description:
    'Send transactional emails with a modern, developer-friendly API',
  icon: 'Mail',
  domain: 'resend.com',
  website: 'https://resend.com',
  docsUrl: 'https://resend.com/docs',
  steps: ['send-email-resend'],
  authType: 'API Key',
  category: 'Communication',
  setupInstructions: `1. Sign up at https://resend.com
2. Create an API key in your dashboard
3. Verify your sending domain
4. Add the API key as RESEND_API_KEY to your environment variables`,
};
