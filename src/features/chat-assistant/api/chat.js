import { processChatMessage } from '../lib/chat';

export async function POST(req) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const response = await processChatMessage(message, context);

    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 