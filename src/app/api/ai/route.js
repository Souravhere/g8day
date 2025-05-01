// api/ai/route.js
import { NextResponse } from 'next/server';
import OpenAI from "openai";

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
    
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "Configuration error: API key is missing" },
        { status: 500 }
      );
    }
    
    console.log("Using model with messages:", JSON.stringify(messages, null, 2));
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Make OpenAI API call with a model that exists
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a standard OpenAI model instead of deepseek
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