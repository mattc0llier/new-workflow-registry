import { RetryableError } from 'workflow';

type HttpRequestParams = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
};

export async function httpRequest(params: HttpRequestParams) {
  'use step';

  const response = await fetch(params.url, {
    method: params.method,
    headers: params.headers,
    body: params.body ? JSON.stringify(params.body) : undefined,
  });

  if (!response.ok) {
    throw new RetryableError(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
