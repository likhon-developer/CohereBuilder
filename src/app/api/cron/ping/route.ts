import { NextResponse } from 'next/server';

// Configure Edge runtime for better performance
export const runtime = 'edge';
export const preferredRegion = 'iad1';

/**
 * GET handler for the ping endpoint
 * Used by the cron job to keep the serverless function warm
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'CohereBuilder is running',
    },
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  );
} 