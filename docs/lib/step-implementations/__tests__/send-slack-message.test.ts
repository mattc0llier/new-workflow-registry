import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendSlackMessage } from '../send-slack-message';
import { mockFetchSuccess, mockFetchError } from './setup';

// Mock the workflow module
vi.mock('workflow', () => ({
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FatalError';
    }
  },
}));

const { FatalError } = await import('workflow');

describe('sendSlackMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SLACK_BOT_TOKEN = 'test-token';
  });

  it('should throw FatalError if SLACK_BOT_TOKEN is missing', async () => {
    delete process.env.SLACK_BOT_TOKEN;

    await expect(
      sendSlackMessage({ channel: '#general', text: 'Hello' })
    ).rejects.toThrow(FatalError);

    await expect(
      sendSlackMessage({ channel: '#general', text: 'Hello' })
    ).rejects.toThrow('SLACK_BOT_TOKEN is required');
  });

  it('should successfully send a message', async () => {
    mockFetchSuccess({
      ok: true,
      ts: '1234567890.123456',
      channel: 'C123456',
    });

    const result = await sendSlackMessage({
      channel: '#general',
      text: 'Hello, team!',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://slack.com/api/chat.postMessage',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      })
    );

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body).toEqual({
      channel: '#general',
      text: 'Hello, team!',
    });

    expect(result).toEqual({
      success: true,
      messageTs: '1234567890.123456',
      channel: 'C123456',
    });
  });

  it('should send message with blocks', async () => {
    mockFetchSuccess({
      ok: true,
      ts: '1234567890.123456',
      channel: 'C123456',
    });

    await sendSlackMessage({
      channel: '#general',
      text: 'Fallback text',
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: '*Bold text*' },
        },
      ],
    });

    const callArgs = (fetch as any).mock.calls[0][1];
    const body = JSON.parse(callArgs.body);
    expect(body.blocks).toHaveLength(1);
    expect(body.blocks[0].type).toBe('section');
  });

  it('should throw FatalError on Slack API error', async () => {
    mockFetchSuccess({ ok: false, error: 'channel_not_found' });

    await expect(
      sendSlackMessage({ channel: '#invalid', text: 'Test' })
    ).rejects.toThrow(FatalError);

    await expect(
      sendSlackMessage({ channel: '#invalid', text: 'Test' })
    ).rejects.toThrow('Slack API error: channel_not_found');
  });

  it('should handle HTTP error responses', async () => {
    mockFetchSuccess({ ok: false, error: 'invalid_auth' });

    await expect(
      sendSlackMessage({ channel: '#general', text: 'Test' })
    ).rejects.toThrow('Slack API error: invalid_auth');
  });
});
