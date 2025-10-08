import { type NextRequest, NextResponse } from "next/server"
import { addApiRequest } from "../admin/api-stats/route"

const SYSTEM_PROMPT = `Generate a realistic US name and gender from email. Return: Full Name: [first last], Gender: [male/female]`

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      addApiRequest(false, Date.now() - startTime, "Invalid email address", email, requestId)
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    // Log usage for monitoring
    console.log(`[${requestId}] Email2Name API called for: ${email}`)
    
    // Log request details
    console.log(`[${requestId}] Request details:`, {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    // Check if GROQ_API_KEY is available
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      addApiRequest(false, Date.now() - startTime, "GROQ_API_KEY not configured", email, requestId)
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    // Call Groq Chat Completions API (OpenAI-compatible)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Email: ${email}` },
          ],
          temperature: 0.2,
          max_tokens: 40,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`[${requestId}] Groq API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        email: email,
        timestamp: new Date().toISOString()
      })
      
      // Check for quota exceeded error
      if (errorData.error?.message?.includes("quota") || errorData.error?.message?.includes("limit")) {
        console.error(`[${requestId}] GROQ QUOTA EXCEEDED for email: ${email}`)
        addApiRequest(false, Date.now() - startTime, "API quota exceeded", email, requestId)
        return NextResponse.json(
          { 
            success: false, 
            error: "API quota exceeded. Please check your Groq API key limits or upgrade your plan.",
            requestId: requestId,
            timestamp: new Date().toISOString()
          },
          { status: 429 },
        )
      }
      
      addApiRequest(false, Date.now() - startTime, errorData.error?.message || "Unknown error", email, requestId)
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to generate name from email: ${errorData.error?.message || "Unknown error"}`,
          requestId: requestId,
          timestamp: new Date().toISOString()
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content

    if (!generatedText) {
      addApiRequest(false, Date.now() - startTime, "No response from AI", email, requestId)
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 500 })
    }

    // Parse the response
    const result = {
      fullName: "",
      firstName: "",
      lastName: "",
      gender: "",
      country: "US", // Always set to US
      type: "Personal", // Default type
    }

    const lines = generatedText.trim().split("\n")
    for (const line of lines) {
      const parts = line.split(":", 2)
      if (parts.length === 2) {
        const key = parts[0].trim().toLowerCase()
        const value = parts[1].trim()

        if (key.includes("full name")) {
          // Remove any trailing punctuation (e.g., commas) from the full name
          const cleanedFullName = value.replace(/[\s,.;:]+$/g, "").trim()
          result.fullName = cleanedFullName
          // Split full name into first and last name
          const nameParts = cleanedFullName.split(" ")
          if (nameParts.length >= 2) {
            result.firstName = nameParts[0]
            result.lastName = nameParts.slice(1).join(" ")
          } else if (nameParts.length === 1) {
            result.firstName = nameParts[0]
            result.lastName = ""
          }
        } else if (key.includes("gender")) {
          result.gender = value
        }
      }
    }

    const responseTime = Date.now() - startTime
    addApiRequest(true, responseTime)
    
    console.log(`[${requestId}] Successfully generated name for: ${email}`, {
      result: result,
      responseTime: responseTime,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: result,
      requestId: requestId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    addApiRequest(false, responseTime, error instanceof Error ? error.message : "Unknown error", email, requestId)
    
    console.error(`[${requestId}] Email2Name API error:`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      email: email,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      requestId: requestId,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
