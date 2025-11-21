import { FatalError } from 'workflow';

type ElevenLabsParams = {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
  };
};

export async function elevenlabsTTS(params: ElevenLabsParams) {
  'use step';

  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new FatalError('ELEVENLABS_API_KEY is required');
  }

  const voiceId = params.voice_id || '21m00Tcm4TlvDq8ikWAM'; // Default voice
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: params.text,
        model_id: params.model_id || 'eleven_monolingual_v1',
        voice_settings: params.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new FatalError(`ElevenLabs API error: ${response.status}`);
  }

  // Return audio as base64
  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');

  return {
    audio: base64Audio,
    contentType: response.headers.get('content-type'),
  };
}
