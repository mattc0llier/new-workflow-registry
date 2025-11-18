import { anthropic } from './anthropic';
import { assemblyai } from './assemblyai';
import { cohere } from './cohere';
import { deepgram } from './deepgram';
import { elevenlabs } from './elevenlabs';
import { fireworks } from './fireworks';
import { googleAI } from './google-ai';
import { groq } from './groq';
import { huggingface } from './huggingface';
import { leonardo } from './leonardo';
import { mistral } from './mistral';
import { openai } from './openai';
import { openrouter } from './openrouter';
import { perplexity } from './perplexity';
import { replicate } from './replicate';
import { resend } from './resend';
import { runpod } from './runpod';
import { slack } from './slack';
import { stabilityAI } from './stability-ai';
import { stripe } from './stripe';
import { together } from './together';

export const INTEGRATIONS = [
  slack,
  resend,
  openai,
  anthropic,
  replicate,
  googleAI,
  huggingface,
  cohere,
  elevenlabs,
  stabilityAI,
  mistral,
  perplexity,
  together,
  runpod,
  deepgram,
  assemblyai,
  fireworks,
  openrouter,
  leonardo,
  groq,
  stripe,
];
