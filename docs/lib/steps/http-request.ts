import type { Step } from '../elements-types';

export const httpRequest: Step = {
  id: 'http-request',
  name: 'HTTP Request',
  description: 'Make HTTP requests to any API endpoint',
  icon: 'Globe',
  category: 'Core',
  tags: ['http', 'api', 'rest'],
  code: `import { retryableError } from '@vercel/workflow';

type HttpRequestParams = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
};

export async function httpRequest(params: HttpRequestParams) {
  "use step";

  const response = await fetch(params.url, {
      method: params.method,
      headers: params.headers,
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    if (!response.ok) {
      throw retryableError(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    return await response.json();
}`,
  dependencies: ['@vercel/workflow'],
};
