import { anthropicClaude } from './anthropic-claude';
import { assemblyaiTranscribe } from './assemblyai-transcribe';
import { cohereGenerate } from './cohere-generate';
import { deepgramTranscribe } from './deepgram-transcribe';
import { elevenlabsTTS } from './elevenlabs-tts';
import { fireworksAI } from './fireworks-ai';
import { googleGemini } from './google-gemini';
import { googleGeminiImage } from './google-gemini-image';
import { groqInference } from './groq-inference';
import { httpRequest } from './http-request';
import { huggingfaceInference } from './huggingface-inference';
import { leonardoAI } from './leonardo-ai';
import { mistralAI } from './mistral-ai';
import { openaiChat } from './openai-chat';
import { openrouterAI } from './openrouter-ai';
import { perplexityAI } from './perplexity-ai';
import { replicateModel } from './replicate-model';
import { runpodInference } from './runpod-inference';
import { sendEmailResend } from './send-email-resend';
import { sendSlackMessage } from './send-slack-message';
import { stabilityAIImage } from './stability-ai-image';
import { stripePayment } from './stripe-payment';
import { togetherAI } from './together-ai';

export const STEPS = [
  sendSlackMessage,
  sendEmailResend,
  openaiChat,
  anthropicClaude,
  replicateModel,
  googleGemini,
  googleGeminiImage,
  huggingfaceInference,
  cohereGenerate,
  elevenlabsTTS,
  stabilityAIImage,
  mistralAI,
  perplexityAI,
  togetherAI,
  runpodInference,
  deepgramTranscribe,
  assemblyaiTranscribe,
  fireworksAI,
  openrouterAI,
  leonardoAI,
  groqInference,
  httpRequest,
  stripePayment,
];
