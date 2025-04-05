import { CohereClient } from 'cohere-ai';

if (!process.env.COHERE_API_KEY) {
  throw new Error('Missing COHERE_API_KEY environment variable');
}

// Initialize the Cohere client with streaming support
export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
  options: {
    timeout: 60000, // 60 second timeout for long responses
    maxRetries: 3, // Retry failed requests up to 3 times
  }
});