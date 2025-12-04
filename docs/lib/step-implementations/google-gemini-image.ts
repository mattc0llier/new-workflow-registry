import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { FatalError } from 'workflow';

type GeminiImageParams = {
  prompt: string;
  model?: string;
};

export async function googleGeminiImage(params: GeminiImageParams) {
  'use step';

  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new FatalError('GOOGLE_AI_API_KEY is required');
  }

  try {
    const result = await generateText({
      model: google(params.model || 'gemini-3-pro-image', { apiKey }),
      prompt: params.prompt,
    });

    // Extract generated images from files
    const images =
      result.files?.filter((file) => file.mediaType?.startsWith('image/')) ||
      [];

    if (images.length === 0) {
      throw new FatalError('No image data returned from Google AI');
    }

    // Return the first generated image (you can modify to return all)
    const firstImage = images[0];

    return {
      image: firstImage.url || firstImage.data, // URL or base64 data
      text: result.text || null,
      mimeType: firstImage.mediaType || 'image/png',
      allImages: images.map((img) => ({
        url: img.url,
        data: img.data,
        mediaType: img.mediaType,
      })),
    };
  } catch (error) {
    throw new FatalError(
      `Google AI API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
