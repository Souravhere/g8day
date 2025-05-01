// api/ai/route.js
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function POST(request) {
  try {
    // Parse the request body
    const { messages } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }
    
    console.log("Using model with messages:", JSON.stringify(messages, null, 2));
    
    // Make OpenAI API call with the specified model
    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick',
      messages,
      max_tokens: 500
    });
    
    // Return the response
    return NextResponse.json({ 
      reply: response.choices[0].message.content 
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    
    // Provide more detailed error information
    let errorMessage = err.message;
    let errorDetails = {};
    
    // Extract more details if available
    if (err.response) {
      errorDetails = {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      };
    }
    
    return NextResponse.json(
      { 
        error: "Failed to get AI response", 
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
