import { Groq } from 'groq-sdk';
import { StreamingTextResponse } from 'ai';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { messages, context } = await req.json();

    // Create a stream
    const stream = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `You are a helpful data analysis assistant. You have access to the following data: ${JSON.stringify(context)}. 
          Analyze the data and provide insights based on the user's questions. Be concise and data-driven in your responses.`
        },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
    });

    // Convert the response into a friendly text-stream
    const response = new StreamingTextResponse(stream);

    return response;
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 