import { Step, Integration, Workflow } from './elements-types';

// Sample Steps Data
export const STEPS: Step[] = [
  {
    id: 'send-slack-message',
    name: 'Send Slack Message',
    description:
      'Send a message to a Slack channel or user using the Slack API',
    icon: '💬',
    category: 'Communication',
    integration: 'slack',
    tags: ['slack', 'messaging', 'notifications'],
    code: `// Step function - does the actual API work
async function sendSlackMessageStep(params: {
  channel: string;
  text: string;
  blocks?: any[];
}) {
  "use step";

  const token = process.env.SLACK_BOT_TOKEN;

  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(\`Slack API error: \${data.error}\`);
  }

  return data;
}

// Workflow function - orchestrates the step
export async function sendSlackMessage(params: {
  channel: string;
  text: string;
  blocks?: any[];
}) {
  "use workflow";

  const result = await sendSlackMessageStep(params);

  return {
    success: true,
    messageTs: result.ts,
    channel: result.channel,
  };
}`,
    envVars: [
      {
        name: 'SLACK_BOT_TOKEN',
        description: 'Your Slack Bot User OAuth Token',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['slackbot-agent'],
  },
  {
    id: 'send-email-resend',
    name: 'Send Email with Resend',
    description: 'Send transactional emails using the Resend API',
    icon: '📧',
    category: 'Communication',
    integration: 'resend',
    tags: ['email', 'resend', 'notifications'],
    code: `import { fatalError } from '@vercel/workflow';

type EmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail(params: EmailParams) {
  "use step";

  const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw fatalError('RESEND_API_KEY is required');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        from: params.from || process.env.FROM_EMAIL || 'noreply@example.com',
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Resend API error: \${response.status}\`);
    }

    return await response.json();
}`,
    envVars: [
      {
        name: 'RESEND_API_KEY',
        description: 'Your Resend API key',
        required: true,
      },
      {
        name: 'FROM_EMAIL',
        description: 'Default sender email address',
        required: false,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['user-onboarding'],
  },
  {
    id: 'openai-chat',
    name: 'OpenAI Chat Completion',
    description: 'Generate chat completions using OpenAI GPT models',
    icon: '🤖',
    category: 'AI',
    integration: 'openai',
    tags: ['ai', 'openai', 'gpt', 'llm'],
    code: `import { fatalError } from '@vercel/workflow';

type ChatParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function openaiChat(params: ChatParams) {
  "use step";

  const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw fatalError('OPENAI_API_KEY is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'gpt-4',
        messages: params.messages,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`OpenAI API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'OPENAI_API_KEY',
        description: 'Your OpenAI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['slackbot-agent', 'content-generator'],
  },
  {
    id: 'anthropic-claude',
    name: 'Anthropic Claude',
    description: 'Generate responses using Claude AI models from Anthropic',
    icon: '🧠',
    category: 'AI',
    integration: 'anthropic',
    tags: ['ai', 'anthropic', 'claude', 'llm'],
    code: `import { fatalError } from '@vercel/workflow';

type ClaudeParams = {
  messages: { role: string; content: string }[];
  model?: string;
  max_tokens?: number;
};

export async function anthropicClaude(params: ClaudeParams) {
  "use step";

  const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw fatalError('ANTHROPIC_API_KEY is required');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'claude-3-5-sonnet-20241022',
        messages: params.messages,
        max_tokens: params.max_tokens || 4096,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Anthropic API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.content[0].text;
}`,
    envVars: [
      {
        name: 'ANTHROPIC_API_KEY',
        description: 'Your Anthropic API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['content-generator'],
  },
  {
    id: 'replicate-model',
    name: 'Replicate Model Inference',
    description:
      'Run AI models on Replicate for image generation, video, and more',
    icon: '🎨',
    category: 'AI',
    integration: 'replicate',
    tags: ['ai', 'replicate', 'image-generation', 'ml'],
    code: `import { fatalError, retryableError } from '@vercel/workflow';

type ReplicateParams = {
  model: string;
  input: Record<string, any>;
  webhook?: string;
};

export async function replicateModel(params: ReplicateParams) {
  "use step";

  const apiKey = process.env.REPLICATE_API_TOKEN;

    if (!apiKey) {
      throw fatalError('REPLICATE_API_TOKEN is required');
    }

    // Create prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': \`Token \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: params.model,
        input: params.input,
        webhook: params.webhook,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Replicate API error: \${response.status}\`);
    }

    const prediction = await response.json();

    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const pollResponse = await fetch(
        \`https://api.replicate.com/v1/predictions/\${result.id}\`,
        {
          headers: {
            'Authorization': \`Token \${apiKey}\`,
          },
        }
      );

      result = await pollResponse.json();
    }

    if (result.status === 'failed') {
      throw retryableError(\`Model inference failed: \${result.error}\`);
    }

    return result.output;
}`,
    envVars: [
      {
        name: 'REPLICATE_API_TOKEN',
        description: 'Your Replicate API token',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['image-generation'],
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    description: 'Generate content using Google Gemini AI models',
    icon: '✨',
    category: 'AI',
    integration: 'google-ai',
    tags: ['ai', 'google', 'gemini', 'llm'],
    code: `import { fatalError } from '@vercel/workflow';

type GeminiParams = {
  prompt: string;
  model?: string;
  temperature?: number;
};

export async function googleGemini(params: GeminiParams) {
  "use step";

  const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw fatalError('GOOGLE_AI_API_KEY is required');
    }

    const model = params.model || 'gemini-1.5-pro';
    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: params.prompt }]
          }],
          generationConfig: {
            temperature: params.temperature || 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw fatalError(\`Google AI API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}`,
    envVars: [
      {
        name: 'GOOGLE_AI_API_KEY',
        description: 'Your Google AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['content-generator'],
  },
  {
    id: 'huggingface-inference',
    name: 'Hugging Face Inference',
    description: 'Run inference on Hugging Face models via their API',
    icon: '🤗',
    category: 'AI',
    integration: 'huggingface',
    tags: ['ai', 'huggingface', 'ml', 'transformers'],
    code: `import { fatalError } from '@vercel/workflow';

type HuggingFaceParams = {
  model: string;
  inputs: string | Record<string, any>;
  parameters?: Record<string, any>;
};

export async function huggingfaceInference(params: HuggingFaceParams) {
  "use step";

  const apiKey = process.env.HUGGINGFACE_API_TOKEN;

    if (!apiKey) {
      throw fatalError('HUGGINGFACE_API_TOKEN is required');
    }

    const response = await fetch(
      \`https://api-inference.huggingface.co/models/\${params.model}\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: params.inputs,
          parameters: params.parameters,
        }),
      }
    );

    if (!response.ok) {
      throw fatalError(\`Hugging Face API error: \${response.status}\`);
    }

    return await response.json();
}`,
    envVars: [
      {
        name: 'HUGGINGFACE_API_TOKEN',
        description: 'Your Hugging Face API token',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'cohere-generate',
    name: 'Cohere Text Generation',
    description: 'Generate text using Cohere AI models',
    icon: '📝',
    category: 'AI',
    integration: 'cohere',
    tags: ['ai', 'cohere', 'llm', 'text-generation'],
    code: `import { fatalError } from '@vercel/workflow';

type CohereParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
};

export async function cohereGenerate(params: CohereParams) {
  "use step";

  const apiKey = process.env.COHERE_API_KEY;

    if (!apiKey) {
      throw fatalError('COHERE_API_KEY is required');
    }

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'command',
        prompt: params.prompt,
        max_tokens: params.max_tokens || 1000,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Cohere API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.generations[0].text;
}`,
    envVars: [
      {
        name: 'COHERE_API_KEY',
        description: 'Your Cohere API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'elevenlabs-tts',
    name: 'ElevenLabs Text-to-Speech',
    description: 'Convert text to speech using ElevenLabs AI voices',
    icon: '🔊',
    category: 'AI',
    integration: 'elevenlabs',
    tags: ['ai', 'elevenlabs', 'tts', 'voice', 'audio'],
    code: `import { fatalError } from '@vercel/workflow';

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
  "use step";

  const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      throw fatalError('ELEVENLABS_API_KEY is required');
    }

    const voiceId = params.voice_id || '21m00Tcm4TlvDq8ikWAM'; // Default voice
    const response = await fetch(
      \`https://api.elevenlabs.io/v1/text-to-speech/\${voiceId}\`,
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
      throw fatalError(\`ElevenLabs API error: \${response.status}\`);
    }

    // Return audio as base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      audio: base64Audio,
      contentType: response.headers.get('content-type'),
    };
}`,
    envVars: [
      {
        name: 'ELEVENLABS_API_KEY',
        description: 'Your ElevenLabs API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'stability-ai-image',
    name: 'Stability AI Image Generation',
    description: 'Generate images using Stable Diffusion models',
    icon: '🖼️',
    category: 'AI',
    integration: 'stability-ai',
    tags: ['ai', 'stability', 'stable-diffusion', 'image-generation'],
    code: `import { fatalError } from '@vercel/workflow';

type StabilityParams = {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
};

export async function stabilityAIImage(params: StabilityParams) {
  "use step";

  const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) {
      throw fatalError('STABILITY_API_KEY is required');
    }

    const formData = new FormData();
    formData.append('prompt', params.prompt);
    if (params.negative_prompt) {
      formData.append('negative_prompt', params.negative_prompt);
    }
    formData.append('output_format', 'png');

    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Accept': 'image/*',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw fatalError(\`Stability AI API error: \${response.status}\`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return {
      image: base64Image,
      contentType: 'image/png',
    };
}`,
    envVars: [
      {
        name: 'STABILITY_API_KEY',
        description: 'Your Stability AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['image-generation'],
  },
  {
    id: 'mistral-ai',
    name: 'Mistral AI',
    description: 'Use Mistral AI models for fast and efficient text generation',
    icon: '⚡',
    category: 'AI',
    integration: 'mistral',
    tags: ['ai', 'mistral', 'llm', 'text-generation'],
    code: `import { fatalError } from '@vercel/workflow';

type MistralParams = {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
};

export async function mistralAI(params: MistralParams) {
  "use step";

  const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw fatalError('MISTRAL_API_KEY is required');
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'mistral-large-latest',
        messages: params.messages,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Mistral API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'MISTRAL_API_KEY',
        description: 'Your Mistral AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    description: 'Search and answer questions with Perplexity AI',
    icon: '🔍',
    category: 'AI',
    integration: 'perplexity',
    tags: ['ai', 'perplexity', 'search', 'llm'],
    code: `import { fatalError } from '@vercel/workflow';

type PerplexityParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function perplexityAI(params: PerplexityParams) {
  "use step";

  const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw fatalError('PERPLEXITY_API_KEY is required');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'llama-3.1-sonar-large-128k-online',
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Perplexity API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'PERPLEXITY_API_KEY',
        description: 'Your Perplexity AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'together-ai',
    name: 'Together AI',
    description: 'Run open-source models with Together AI inference',
    icon: '🌟',
    category: 'AI',
    integration: 'together',
    tags: ['ai', 'together', 'open-source', 'llm'],
    code: `import { fatalError } from '@vercel/workflow';

type TogetherParams = {
  prompt: string;
  model?: string;
  max_tokens?: number;
};

export async function togetherAI(params: TogetherParams) {
  "use step";

  const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey) {
      throw fatalError('TOGETHER_API_KEY is required');
    }

    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: params.prompt,
        max_tokens: params.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Together API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].text;
}`,
    envVars: [
      {
        name: 'TOGETHER_API_KEY',
        description: 'Your Together AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'runpod-inference',
    name: 'RunPod GPU Inference',
    description: 'Run AI models on RunPod serverless GPUs',
    icon: '🖥️',
    category: 'AI',
    integration: 'runpod',
    tags: ['ai', 'runpod', 'gpu', 'serverless'],
    code: `import { fatalError } from '@vercel/workflow';

type RunPodParams = {
  endpoint_id: string;
  input: Record<string, any>;
};

export async function runpodInference(params: RunPodParams) {
  "use step";

  const apiKey = process.env.RUNPOD_API_KEY;

    if (!apiKey) {
      throw fatalError('RUNPOD_API_KEY is required');
    }

    const response = await fetch(
      \`https://api.runpod.ai/v2/\${params.endpoint_id}/run\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: params.input,
        }),
      }
    );

    if (!response.ok) {
      throw fatalError(\`RunPod API error: \${response.status}\`);
    }

    return await response.json();
}`,
    envVars: [
      {
        name: 'RUNPOD_API_KEY',
        description: 'Your RunPod API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'deepgram-transcribe',
    name: 'Deepgram Speech-to-Text',
    description: 'Transcribe audio to text with Deepgram AI',
    icon: '🎤',
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
  "use step";

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
          'Authorization': \`Token \${apiKey}\`,
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
}`,
    envVars: [
      {
        name: 'DEEPGRAM_API_KEY',
        description: 'Your Deepgram API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'assemblyai-transcribe',
    name: 'AssemblyAI Transcription',
    description: 'Transcribe and analyze audio with AssemblyAI',
    icon: '📼',
    category: 'AI',
    integration: 'assemblyai',
    tags: ['ai', 'assemblyai', 'transcription', 'audio-analysis'],
    code: `import { fatalError } from '@vercel/workflow';

type AssemblyAIParams = {
  audio_url: string;
  speaker_labels?: boolean;
};

export async function assemblyaiTranscribe(params: AssemblyAIParams) {
  "use step";

  const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      throw fatalError('ASSEMBLYAI_API_KEY is required');
    }

    // Submit transcription
    const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: params.audio_url,
        speaker_labels: params.speaker_labels || false,
      }),
    });

    if (!submitResponse.ok) {
      throw fatalError(\`AssemblyAI API error: \${submitResponse.status}\`);
    }

    const { id } = await submitResponse.json();

    // Poll for completion
    let transcript;
    while (true) {
      const pollResponse = await fetch(
        \`https://api.assemblyai.com/v2/transcript/\${id}\`,
        {
          headers: {
            'Authorization': apiKey,
          },
        }
      );

      transcript = await pollResponse.json();

      if (transcript.status === 'completed') {
        break;
      } else if (transcript.status === 'error') {
        throw fatalError(\`Transcription failed: \${transcript.error}\`);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return transcript.text;
}`,
    envVars: [
      {
        name: 'ASSEMBLYAI_API_KEY',
        description: 'Your AssemblyAI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'fireworks-ai',
    name: 'Fireworks AI',
    description: 'Fast inference for open-source AI models',
    icon: '🎆',
    category: 'AI',
    integration: 'fireworks',
    tags: ['ai', 'fireworks', 'llm', 'inference'],
    code: `import { fatalError } from '@vercel/workflow';

type FireworksParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function fireworksAI(params: FireworksParams) {
  "use step";

  const apiKey = process.env.FIREWORKS_API_KEY;

    if (!apiKey) {
      throw fatalError('FIREWORKS_API_KEY is required');
    }

    const response = await fetch(
      'https://api.fireworks.ai/inference/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: params.model || 'accounts/fireworks/models/llama-v3p1-70b-instruct',
          messages: params.messages,
        }),
      }
    );

    if (!response.ok) {
      throw fatalError(\`Fireworks API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'FIREWORKS_API_KEY',
        description: 'Your Fireworks AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'openrouter-ai',
    name: 'OpenRouter AI',
    description: 'Access multiple AI models through a unified API',
    icon: '🔀',
    category: 'AI',
    integration: 'openrouter',
    tags: ['ai', 'openrouter', 'llm', 'multi-model'],
    code: `import { fatalError } from '@vercel/workflow';

type OpenRouterParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function openrouterAI(params: OpenRouterParams) {
  "use step";

  const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw fatalError('OPENROUTER_API_KEY is required');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'anthropic/claude-3.5-sonnet',
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`OpenRouter API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'OPENROUTER_API_KEY',
        description: 'Your OpenRouter API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo AI Image Generation',
    description: 'Generate creative images with Leonardo AI',
    icon: '🎨',
    category: 'AI',
    integration: 'leonardo',
    tags: ['ai', 'leonardo', 'image-generation', 'creative'],
    code: `import { fatalError, retryableError } from '@vercel/workflow';

type LeonardoParams = {
  prompt: string;
  model_id?: string;
  width?: number;
  height?: number;
};

export async function leonardoAI(params: LeonardoParams) {
  "use step";

  const apiKey = process.env.LEONARDO_API_KEY;

    if (!apiKey) {
      throw fatalError('LEONARDO_API_KEY is required');
    }

    // Generate image
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        modelId: params.model_id || 'b24e16ff-06e3-43eb-8d33-4416c2d75876',
        width: params.width || 1024,
        height: params.height || 1024,
        num_images: 1,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Leonardo API error: \${response.status}\`);
    }

    const { sdGenerationJob } = await response.json();

    // Poll for completion
    let result;
    while (true) {
      const pollResponse = await fetch(
        \`https://cloud.leonardo.ai/api/rest/v1/generations/\${sdGenerationJob.generationId}\`,
        {
          headers: {
            'Authorization': \`Bearer \${apiKey}\`,
          },
        }
      );

      result = await pollResponse.json();

      if (result.generations_by_pk.status === 'COMPLETE') {
        break;
      } else if (result.generations_by_pk.status === 'FAILED') {
        throw retryableError('Image generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return result.generations_by_pk.generated_images[0].url;
}`,
    envVars: [
      {
        name: 'LEONARDO_API_KEY',
        description: 'Your Leonardo AI API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'groq-inference',
    name: 'Groq LPU Inference',
    description: 'Ultra-fast AI inference with Groq LPU technology',
    icon: '⚡',
    category: 'AI',
    integration: 'groq',
    tags: ['ai', 'groq', 'llm', 'fast-inference'],
    code: `import { fatalError } from '@vercel/workflow';

type GroqParams = {
  messages: { role: string; content: string }[];
  model?: string;
};

export async function groqInference(params: GroqParams) {
  "use step";

  const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw fatalError('GROQ_API_KEY is required');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model || 'llama-3.3-70b-versatile',
        messages: params.messages,
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Groq API error: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}`,
    envVars: [
      {
        name: 'GROQ_API_KEY',
        description: 'Your Groq API key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
  },
  {
    id: 'http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to any API endpoint',
    icon: '🌐',
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
  },
  {
    id: 'stripe-payment',
    name: 'Stripe Payment',
    description: 'Process payments using the Stripe API',
    icon: '💳',
    category: 'Payment',
    integration: 'stripe',
    tags: ['stripe', 'payment', 'billing'],
    code: `import { fatalError } from '@vercel/workflow';

type PaymentParams = {
  amount: number;
  currency: string;
  customerId: string;
  description?: string;
};

export async function stripePayment(params: PaymentParams) {
  "use step";

  const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      throw fatalError('STRIPE_SECRET_KEY is required');
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: params.amount.toString(),
        currency: params.currency,
        customer: params.customerId,
        description: params.description || '',
      }),
    });

    if (!response.ok) {
      throw fatalError(\`Stripe API error: \${response.status}\`);
    }

    return await response.json();
}`,
    envVars: [
      {
        name: 'STRIPE_SECRET_KEY',
        description: 'Your Stripe secret key',
        required: true,
      },
    ],
    dependencies: ['@vercel/workflow'],
    usedInWorkflows: ['payment-processing'],
  },
];

// Sample Integrations Data
export const INTEGRATIONS: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description:
      'Send messages, manage channels, and interact with your Slack workspace',
    icon: '💬',
    domain: 'slack.com',
    website: 'https://slack.com',
    docsUrl: 'https://api.slack.com/docs',
    steps: ['send-slack-message'],
    authType: 'OAuth',
    setupInstructions: `1. Create a Slack App at https://api.slack.com/apps
2. Add the chat:write scope to your bot token
3. Install the app to your workspace
4. Copy the Bot User OAuth Token
5. Add it as SLACK_BOT_TOKEN to your environment variables`,
  },
  {
    id: 'resend',
    name: 'Resend',
    description:
      'Send transactional emails with a modern, developer-friendly API',
    icon: '📧',
    domain: 'resend.com',
    website: 'https://resend.com',
    docsUrl: 'https://resend.com/docs',
    steps: ['send-email-resend'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://resend.com
2. Create an API key in your dashboard
3. Verify your sending domain
4. Add the API key as RESEND_API_KEY to your environment variables`,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Access GPT models, embeddings, and other AI capabilities',
    icon: '🤖',
    domain: 'openai.com',
    website: 'https://openai.com',
    docsUrl: 'https://platform.openai.com/docs',
    steps: ['openai-chat'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://platform.openai.com
2. Create an API key in your account settings
3. Add billing information
4. Add the API key as OPENAI_API_KEY to your environment variables`,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description:
      'Access Claude AI models for advanced reasoning and conversation',
    icon: '🧠',
    domain: 'anthropic.com',
    website: 'https://anthropic.com',
    docsUrl: 'https://docs.anthropic.com',
    steps: ['anthropic-claude'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://console.anthropic.com
2. Create an API key in your account settings
3. Add the API key as ANTHROPIC_API_KEY to your environment variables`,
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description:
      'Run AI models in the cloud for image, video, and audio generation',
    icon: '🎨',
    domain: 'replicate.com',
    website: 'https://replicate.com',
    docsUrl: 'https://replicate.com/docs',
    steps: ['replicate-model'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://replicate.com
2. Get your API token from your account settings
3. Add the token as REPLICATE_API_TOKEN to your environment variables`,
  },
  {
    id: 'google-ai',
    name: 'Google AI',
    description: 'Access Google Gemini and other Google AI models',
    icon: '✨',
    domain: 'ai.google.dev',
    website: 'https://ai.google.dev',
    docsUrl: 'https://ai.google.dev/docs',
    steps: ['google-gemini'],
    authType: 'API Key',
    setupInstructions: `1. Visit https://makersuite.google.com/app/apikey
2. Create an API key
3. Add the key as GOOGLE_AI_API_KEY to your environment variables`,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description:
      'Access thousands of open-source AI models via the Inference API',
    icon: '🤗',
    domain: 'huggingface.co',
    website: 'https://huggingface.co',
    docsUrl: 'https://huggingface.co/docs/api-inference',
    steps: ['huggingface-inference'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://huggingface.co
2. Create an access token in your settings
3. Add the token as HUGGINGFACE_API_TOKEN to your environment variables`,
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Build with Cohere LLMs for text generation and embeddings',
    icon: '📝',
    domain: 'cohere.com',
    website: 'https://cohere.com',
    docsUrl: 'https://docs.cohere.com',
    steps: ['cohere-generate'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://dashboard.cohere.com
2. Create an API key
3. Add the key as COHERE_API_KEY to your environment variables`,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description:
      'Generate realistic AI voices and speech with cutting-edge TTS',
    icon: '🔊',
    domain: 'elevenlabs.io',
    website: 'https://elevenlabs.io',
    docsUrl: 'https://elevenlabs.io/docs',
    steps: ['elevenlabs-tts'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://elevenlabs.io
2. Get your API key from your profile
3. Add the key as ELEVENLABS_API_KEY to your environment variables`,
  },
  {
    id: 'stability-ai',
    name: 'Stability AI',
    description:
      'Generate images with Stable Diffusion and other cutting-edge models',
    icon: '🖼️',
    domain: 'stability.ai',
    website: 'https://stability.ai',
    docsUrl: 'https://platform.stability.ai/docs',
    steps: ['stability-ai-image'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://platform.stability.ai
2. Create an API key in your account
3. Add the key as STABILITY_API_KEY to your environment variables`,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Fast and efficient AI models from Mistral',
    icon: '⚡',
    domain: 'mistral.ai',
    website: 'https://mistral.ai',
    docsUrl: 'https://docs.mistral.ai',
    steps: ['mistral-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://console.mistral.ai
2. Create an API key
3. Add the key as MISTRAL_API_KEY to your environment variables`,
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'AI-powered search and question answering',
    icon: '🔍',
    domain: 'perplexity.ai',
    website: 'https://perplexity.ai',
    docsUrl: 'https://docs.perplexity.ai',
    steps: ['perplexity-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://perplexity.ai
2. Get your API key from settings
3. Add the key as PERPLEXITY_API_KEY to your environment variables`,
  },
  {
    id: 'together',
    name: 'Together AI',
    description: 'Run open-source AI models at scale',
    icon: '🌟',
    domain: 'together.ai',
    website: 'https://together.ai',
    docsUrl: 'https://docs.together.ai',
    steps: ['together-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://api.together.xyz
2. Create an API key
3. Add the key as TOGETHER_API_KEY to your environment variables`,
  },
  {
    id: 'runpod',
    name: 'RunPod',
    description: 'Serverless GPU infrastructure for AI workloads',
    icon: '🖥️',
    domain: 'runpod.io',
    website: 'https://runpod.io',
    docsUrl: 'https://docs.runpod.io',
    steps: ['runpod-inference'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://runpod.io
2. Get your API key from settings
3. Create a serverless endpoint
4. Add the key as RUNPOD_API_KEY to your environment variables`,
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    description: 'AI-powered speech recognition and transcription',
    icon: '🎤',
    domain: 'deepgram.com',
    website: 'https://deepgram.com',
    docsUrl: 'https://developers.deepgram.com/docs',
    steps: ['deepgram-transcribe'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://console.deepgram.com
2. Create an API key
3. Add the key as DEEPGRAM_API_KEY to your environment variables`,
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI',
    description: 'Advanced speech-to-text and audio intelligence',
    icon: '📼',
    domain: 'assemblyai.com',
    website: 'https://assemblyai.com',
    docsUrl: 'https://www.assemblyai.com/docs',
    steps: ['assemblyai-transcribe'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://www.assemblyai.com
2. Get your API key from the dashboard
3. Add the key as ASSEMBLYAI_API_KEY to your environment variables`,
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    description: 'Fast inference for open-source AI models',
    icon: '🎆',
    domain: 'fireworks.ai',
    website: 'https://fireworks.ai',
    docsUrl: 'https://docs.fireworks.ai',
    steps: ['fireworks-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://fireworks.ai
2. Create an API key
3. Add the key as FIREWORKS_API_KEY to your environment variables`,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified API for multiple AI models',
    icon: '🔀',
    domain: 'openrouter.ai',
    website: 'https://openrouter.ai',
    docsUrl: 'https://openrouter.ai/docs',
    steps: ['openrouter-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://openrouter.ai
2. Create an API key
3. Add the key as OPENROUTER_API_KEY to your environment variables`,
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    description: 'AI-powered creative image generation',
    icon: '🎨',
    domain: 'leonardo.ai',
    website: 'https://leonardo.ai',
    docsUrl: 'https://docs.leonardo.ai',
    steps: ['leonardo-ai'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://app.leonardo.ai
2. Get your API key from settings
3. Add the key as LEONARDO_API_KEY to your environment variables`,
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast AI inference with LPU technology',
    icon: '⚡',
    domain: 'groq.com',
    website: 'https://groq.com',
    docsUrl: 'https://console.groq.com/docs',
    steps: ['groq-inference'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://console.groq.com
2. Create an API key
3. Add the key as GROQ_API_KEY to your environment variables`,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    icon: '💳',
    domain: 'stripe.com',
    website: 'https://stripe.com',
    docsUrl: 'https://stripe.com/docs/api',
    steps: ['stripe-payment'],
    authType: 'API Key',
    setupInstructions: `1. Sign up at https://stripe.com
2. Get your API keys from the dashboard
3. Add STRIPE_SECRET_KEY to your environment variables
4. Configure webhooks for payment events`,
  },
];

// Sample Workflows Data
export const WORKFLOWS: Workflow[] = [
  {
    id: 'slackbot-agent',
    name: 'AI Slackbot Agent',
    description: 'An intelligent Slack bot that responds to messages using GPT',
    icon: '🤖',
    category: 'AI Agents',
    difficulty: 'Intermediate',
    steps: [
      {
        stepId: 'openai-chat',
        order: 1,
        description: 'Process the message with GPT to generate a response',
      },
      {
        stepId: 'send-slack-message',
        order: 2,
        description: 'Send the AI-generated response back to Slack',
      },
    ],
    code: `import { workflow } from '@vercel/workflow';
import { openaiChat } from './steps/openai-chat';
import { sendSlackMessage } from './steps/send-slack-message';

type SlackbotParams = {
  channel: string;
  userMessage: string;
  context?: string;
};

export const slackbotAgent = workflow(
  'slackbot-agent',
  async (params: SlackbotParams) => {
    // Step 1: Generate AI response
    const aiResponse = await openaiChat({
      messages: [
        {
          role: 'system',
          content: params.context || 'You are a helpful Slack assistant.',
        },
        {
          role: 'user',
          content: params.userMessage,
        },
      ],
    });

    // Step 2: Send response to Slack
    await sendSlackMessage({
      channel: params.channel,
      text: aiResponse,
    });

    return { success: true, response: aiResponse };
  }
);`,
    useCase:
      'Build an intelligent Slack bot that can answer questions, help with tasks, and engage with your team using AI.',
    prerequisites: ['OpenAI API key', 'Slack Bot token with chat:write scope'],
  },
  {
    id: 'user-onboarding',
    name: 'User Onboarding Flow',
    description: 'Automated email workflow for welcoming new users',
    icon: '👋',
    category: 'Automation',
    difficulty: 'Beginner',
    steps: [
      {
        stepId: 'send-email-resend',
        order: 1,
        description: 'Send welcome email to new user',
      },
    ],
    code: `import { workflow } from '@vercel/workflow';
import { sendEmail } from './steps/send-email-resend';

type OnboardingParams = {
  email: string;
  name: string;
};

export const userOnboarding = workflow(
  'user-onboarding',
  async (params: OnboardingParams) => {
    // Send welcome email
    await sendEmail({
      to: params.email,
      subject: 'Welcome to our platform! 👋',
      html: \`
        <h1>Hi \${params.name}!</h1>
        <p>Welcome to our platform. We're excited to have you here.</p>
        <p>Get started by exploring our features...</p>
      \`,
    });

    return { success: true };
  }
);`,
    useCase:
      'Automatically send welcome emails and onboarding materials when new users sign up.',
    prerequisites: ['Resend API key', 'Verified sending domain'],
  },
  {
    id: 'payment-processing',
    name: 'Payment Processing',
    description: 'Handle payment collection and confirmation',
    icon: '💰',
    category: 'E-commerce',
    difficulty: 'Intermediate',
    steps: [
      {
        stepId: 'stripe-payment',
        order: 1,
        description: 'Process payment with Stripe',
      },
      {
        stepId: 'send-email-resend',
        order: 2,
        description: 'Send payment confirmation email',
      },
    ],
    code: `import { workflow } from '@vercel/workflow';
import { stripePayment } from './steps/stripe-payment';
import { sendEmail } from './steps/send-email-resend';

type PaymentParams = {
  amount: number;
  currency: string;
  customerId: string;
  customerEmail: string;
};

export const paymentProcessing = workflow(
  'payment-processing',
  async (params: PaymentParams) => {
    // Step 1: Process payment
    const payment = await stripePayment({
      amount: params.amount,
      currency: params.currency,
      customerId: params.customerId,
      description: 'Product purchase',
    });

    // Step 2: Send confirmation email
    await sendEmail({
      to: params.customerEmail,
      subject: 'Payment Confirmed',
      html: \`
        <h1>Payment Successful</h1>
        <p>Your payment of \${params.currency.toUpperCase()} \${params.amount / 100} has been processed.</p>
      \`,
    });

    return { success: true, paymentId: payment.id };
  }
);`,
    useCase:
      'Process customer payments and send confirmation emails automatically.',
    prerequisites: ['Stripe API key', 'Resend API key'],
  },
];
