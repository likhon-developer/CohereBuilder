import { StreamingTextResponse, Message } from 'ai';
import { cohere } from '@/lib/cohere-client';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Construct the prompt for component generation
  const prompt = `You are an expert React developer. Generate a React component based on this request: ${lastMessage.content}

Please follow these guidelines:
1. Use modern React practices with TypeScript
2. Include proper type definitions
3. Use Tailwind CSS for styling
4. Make the component responsive and accessible
5. Add helpful comments explaining key parts
6. Include all necessary imports
7. Format the code properly
8. Use modern hooks like useState, useEffect, useCallback where appropriate
9. Include error handling and loading states
10. Follow accessibility best practices

Return ONLY the component code wrapped in a code block with the appropriate language tag (e.g. \`\`\`tsx).`;

  try {
    const response = await cohere.chat({
      message: prompt,
      model: 'command',
      temperature: 0.7,
      stream: true,
      maxTokens: 2000
    });

    // Create a readable stream from the Cohere response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(chunk.text);
        }
        controller.close();
      },
    });

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating component:', error);
    return new Response('Error generating component', { status: 500 });
  }
}