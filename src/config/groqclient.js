import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// Load env variables once here — no need to do it in every file
dotenv.config();

// Validate API key early so you get a clear error message
if (!process.env.API_KEY) {
  throw new Error('❌ API_KEY is missing! Please add it to your .env file.');
}

// Create Groq client once and export it
export const groqClient = new Groq({
  apiKey: process.env.API_KEY,
});

// Default model — change here and it updates everywhere
export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// Default config for all AI calls — override per file if needed
export const DEFAULT_CONFIG = {
  model: DEFAULT_MODEL,
  temperature: 0.7,
  max_tokens: 1024,
};

// Generic reusable function to call Groq API
// Pass messages array + optional config overrides
export async function callGroq(messages, configOverrides = {}) {
  const response = await groqClient.chat.completions.create({
    ...DEFAULT_CONFIG,       // spread defaults
    ...configOverrides,      // override anything you want per call
    messages,
  });

  return response.choices[0].message.content;
}