import { sendSlackMessage } from './send-slack-message';
import { sendEmailResend } from './send-email-resend';
import { openaiChat } from './openai-chat';
import { anthropicClaude } from './anthropic-claude';
import { replicateModel } from './replicate-model';
import { googleGemini } from './google-gemini';
import { huggingfaceInference } from './huggingface-inference';
import { cohereGenerate } from './cohere-generate';
import { elevenlabsTTS } from './elevenlabs-tts';
import { stabilityAIImage } from './stability-ai-image';
import { mistralAI } from './mistral-ai';
import { perplexityAI } from './perplexity-ai';
import { togetherAI } from './together-ai';
import { runpodInference } from './runpod-inference';
import { deepgramTranscribe } from './deepgram-transcribe';
import { assemblyaiTranscribe } from './assemblyai-transcribe';
import { fireworksAI } from './fireworks-ai';
import { openrouterAI } from './openrouter-ai';
import { leonardoAI } from './leonardo-ai';
import { groqInference } from './groq-inference';
import { httpRequest } from './http-request';
import { stripePayment } from './stripe-payment';

export const STEPS = [
  sendSlackMessage,
  sendEmailResend,
  openaiChat,
  anthropicClaude,
  replicateModel,
  googleGemini,
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
