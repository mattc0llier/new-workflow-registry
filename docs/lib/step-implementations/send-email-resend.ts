import { FatalError } from '@vercel/workflow';

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
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      from: params.from || process.env.FROM_EMAIL || 'noreply@example.com',
    }),
  });

  if (!response.ok) {
    throw new FatalError(`Resend API error: ${response.status}`);
  }

  return await response.json();
}
