import { fatalError } from '@vercel/workflow';

type AssemblyAIParams = {
  audio_url: string;
  speaker_labels?: boolean;
};

export async function assemblyaiTranscribe(params: AssemblyAIParams) {
  'use step';

  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw fatalError('ASSEMBLYAI_API_KEY is required');
  }

  // Submit transcription
  const submitResponse = await fetch(
    'https://api.assemblyai.com/v2/transcript',
    {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: params.audio_url,
        speaker_labels: params.speaker_labels || false,
      }),
    }
  );

  if (!submitResponse.ok) {
    throw fatalError(`AssemblyAI API error: ${submitResponse.status}`);
  }

  const { id } = await submitResponse.json();

  // Poll for completion
  let transcript;
  while (true) {
    const pollResponse = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    transcript = await pollResponse.json();

    if (transcript.status === 'completed') {
      break;
    } else if (transcript.status === 'error') {
      throw fatalError(`Transcription failed: ${transcript.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return transcript.text;
}
