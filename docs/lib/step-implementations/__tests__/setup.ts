import { vi } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock fetch helper for successful responses
export function mockFetchSuccess(
  responseData: any,
  options: { headers?: Record<string, string> } = {}
) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => responseData,
    arrayBuffer: async () => new ArrayBuffer(0),
    headers: {
      get: (key: string) => options.headers?.[key] || null,
    },
  });
}

// Mock fetch helper for error responses
export function mockFetchError(status: number, statusText = 'Error') {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  });
}

// Mock fetch helper for array buffer responses (audio, images, etc.)
export function mockFetchArrayBuffer(
  buffer: ArrayBuffer,
  contentType = 'audio/mpeg'
) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    arrayBuffer: async () => buffer,
    headers: {
      get: (key: string) => {
        if (key === 'content-type') return contentType;
        return null;
      },
    },
  });
}

// Create a simple test buffer
export function createTestBuffer(size = 100): ArrayBuffer {
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    view[i] = i % 256;
  }
  return buffer;
}
