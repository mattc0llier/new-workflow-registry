import { beforeEach, describe, expect, it, vi } from 'vitest';
import { httpRequest } from '../http-request';

// Mock the workflow module
vi.mock('workflow', () => ({
  RetryableError: class RetryableError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RetryableError';
    }
  },
}));

const { RetryableError } = await import('workflow');

describe('httpRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully make a GET request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'response' }),
    });

    const result = await httpRequest({
      url: 'https://api.example.com/data',
      method: 'GET',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        method: 'GET',
        headers: undefined,
        body: undefined,
      })
    );

    expect(result).toEqual({ data: 'response' });
  });

  it('should successfully make a POST request with body', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await httpRequest({
      url: 'https://api.example.com/create',
      method: 'POST',
      body: { name: 'John', age: 30 },
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    expect(callArgs.method).toBe('POST');
    expect(JSON.parse(callArgs.body)).toEqual({ name: 'John', age: 30 });
  });

  it('should include custom headers when provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await httpRequest({
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: {
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'value',
      },
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    expect(callArgs.headers).toEqual({
      Authorization: 'Bearer token123',
      'X-Custom-Header': 'value',
    });
  });

  it('should support all HTTP methods', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

    for (const method of methods) {
      await httpRequest({
        url: 'https://api.example.com/resource',
        method,
      });
    }

    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it('should throw RetryableError on 4xx error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(
      httpRequest({
        url: 'https://api.example.com/bad',
        method: 'GET',
      })
    ).rejects.toThrow(RetryableError);

    await expect(
      httpRequest({
        url: 'https://api.example.com/bad',
        method: 'GET',
      })
    ).rejects.toThrow('HTTP 400: Bad Request');
  });

  it('should throw RetryableError on 5xx error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      httpRequest({
        url: 'https://api.example.com/error',
        method: 'GET',
      })
    ).rejects.toThrow('HTTP 500: Internal Server Error');
  });
});
