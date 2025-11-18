import type { Step } from '../elements-types';

export const deepgramTranscribe: Step = {
  id: 'deepgram-transcribe',
  name: 'Deepgram Speech-to-Text',
  description: 'Transcribe audio to text with Deepgram AI',
  icon: 'Mic',
  category: 'AI',
  integration: 'deepgram',
  tags: ['ai', 'deepgram', 'speech-to-text', 'transcription'],
  code: `import { fatalError } from '@vercel/workflow';

type DeepgramParams = {
  audio_url: string;
  model?: string;
  language?: string;
};

export async function deepgramTranscribe(params: DeepgramParams) {
  'use step';

  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw fatalError('DEEPGRAM_API_KEY is required');
  }

  const model = params.model || 'nova-2';
  const language = params.language || 'en';

  const response = await fetch(
    \`https://api.deepgram.com/v1/listen?model=\${model}&language=\${language}\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Token \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: params.audio_url,
      }),
    }
  );

  if (!response.ok) {
    throw fatalError(\`Deepgram API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.results.channels[0].alternatives[0].transcript;
}
`,

  envVars: [
    {
      name: 'DEEPGRAM_API_KEY',
      description: 'Your Deepgram API key',
      required: true,
    },
  ],
  dependencies: ['@vercel/workflow'],
};
