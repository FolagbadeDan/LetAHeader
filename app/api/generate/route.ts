
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// --- Dynamic AI Provider Interface & Implementations ---

interface AIProvider {
  name: string;
  generate(prompt: string, systemInstruction: string): Promise<string>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'LetAHeader';

class OpenRouterProvider implements AIProvider {
  name = "OpenRouter";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(prompt: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': siteName,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free', // Using free model for now, change to 'google/gemini-pro' via OpenRouter if desired
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

// Future implementation example
/*
import { GoogleGenerativeAI } from "@google/generative-ai";
class GeminiProvider implements AIProvider {
  name = "Gemini";
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string, systemInstruction: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`${systemInstruction}\n\n${prompt}`);
    return result.response.text();
  }
}
*/

// --- Factory/Selector ---

function getAIProvider(): AIProvider {
  // Logic to select provider based on config or env
  // Currently forcing OpenRouter as requested

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    return new OpenRouterProvider(openRouterKey);
  }

  // Fallback or Error
  throw new Error("Configuration Error: OPENROUTER_API_KEY is missing. Please add it to your .env.local file.");
}

// --- Main API Route ---

const SYSTEM_INSTRUCTION = `You are an expert professional business correspondence assistant. 
Your goal is to write clear, concise, and professionally formatted business letters.
When asked to draft a letter, produce the body content in HTML format (using <p>, <br>, <strong>, <ul>, <li> tags).
Do not wrap the output in markdown code blocks. Just return the raw HTML string for the body.
Maintain a polite and professional tone suitable for corporate environments.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userPlan = 'FREE';
    let userId = null;

    // 1. Auth & Identity Check
    if (session && session.user) {
      // @ts-ignore
      userPlan = session.user.plan || 'FREE';
      // @ts-ignore
      userId = session.user.id;
    } else {
      console.log('[AI] Guest user - proceeding');
    }

    // 2. Limit Enforcement (Database for Logged In users)
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      const currentUsage = (user?.aiUsageCount || 0) + 1;

      // UNLIMITED AI for all signed-in users (as per user request)
      // if (userPlan === 'FREE' && currentUsage > 3) {
      //   return NextResponse.json({ error: 'LIMIT_REACHED', message: "You have reached your free AI limit." }, { status: 403 });
      // }

      // Optimistic update (or await if critical)
      await db.user.update({
        where: { id: userId },
        data: { aiUsageCount: currentUsage }
      });
    }

    // 3. Provider Initialization
    let provider: AIProvider;
    try {
      provider = getAIProvider();
    } catch (configError: any) {
      console.error("[AI] Provider Config Error:", configError.message);
      return NextResponse.json({ error: configError.message }, { status: 500 });
    }

    // 4. Request Parsing & Generation
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    console.log(`[AI] Generating with provider: ${provider.name}`);
    const text = await provider.generate(prompt, SYSTEM_INSTRUCTION);

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Generate Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
