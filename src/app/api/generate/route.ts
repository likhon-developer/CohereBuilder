import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateComponent } from '@/lib/cohere-api';

// Input validation schema
const requestSchema = z.object({
  prompt: z.string().min(10).max(1000),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional().default(0.7),
});

// Configure Edge runtime
export const runtime = 'edge';

/**
 * POST handler for component generation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.issues },
        { status: 400 }
      );
    }

    const { prompt, model, temperature } = result.data;

    // Generate component using Cohere API
    const code = await generateComponent(prompt);

    // Return the generated code
    return NextResponse.json({ code });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate component' },
      { status: 500 }
    );
  }
} 