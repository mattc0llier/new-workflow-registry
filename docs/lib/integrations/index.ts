import { slack } from './slack';
import { resend } from './resend';
import { openai } from './openai';
import { anthropic } from './anthropic';
import { replicate } from './replicate';
import { googleAI } from './google-ai';
import { huggingface } from './huggingface';
import { cohere } from './cohere';
import { elevenlabs } from './elevenlabs';
import { stabilityAI } from './stability-ai';
import { mistral } from './mistral';
import { perplexity } from './perplexity';
import { together } from './together';
import { runpod } from './runpod';
import { deepgram } from './deepgram';
import { assemblyai } from './assemblyai';
import { fireworks } from './fireworks';
import { openrouter } from './openrouter';
import { leonardo } from './leonardo';
import { groq } from './groq';
import { stripe } from './stripe';

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
