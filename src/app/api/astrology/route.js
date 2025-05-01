// api/astrology/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const requestData = await request.json();
    
    // Debug log the request
    console.log("Received request:", JSON.stringify(requestData));
    console.log("API Key exists:", !!process.env.ASTRO_API_KEY);
    
    // Call the astrology API
    const response = await fetch("https://json.freeastrologyapi.com/planets/extended", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ASTRO_API_KEY,
      },
      body: JSON.stringify(requestData),
    });
    
    // Get the response as text first
    const responseText = await response.text();
    console.log("API Response:", responseText.substring(0, 500)); // Log first 500 chars
    
    if (!response.ok) {
      // Return a proper JSON error response
      return NextResponse.json(
        { error: `API responded with status ${response.status}`, details: responseText },
        { status: response.status }
      );
    }
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON response from API", details: responseText.substring(0, 200) },
        { status: 500 }
      );
    }
    
    // Return the data
    return NextResponse.json(data);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch astrological data", details: err.message },
      { status: 500 }
    );
  }
}