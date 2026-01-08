import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'LetAHeader';

const SYSTEM_INSTRUCTION = `You are a professional proofreading assistant. Your job is to:

1. Fix spelling errors
2. Correct grammar mistakes
3. Improve sentence structure and readability
4. Remove unnecessary repetition
5. Ensure professional business tone

CRITICAL RULES:
- Preserve the original meaning and intent 100%
- Keep the same HTML structure (paragraphs, line breaks, formatting)
- Do NOT change the core message or facts
- Do NOT add new information
- Do NOT remove important details
- Maintain the same level of formality
- Return ONLY the corrected HTML, no explanations or markdown code blocks`;

export async function POST(req: Request) {
    try {
        const { html } = await req.json();

        if (!html || typeof html !== 'string') {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Auto-format service unavailable' }, { status: 500 });
        }

        // Extract plain text for character count (avoid processing huge documents)
        const plainText = html.replace(/<[^>]*>/g, '');
        if (plainText.length > 10000) {
            return NextResponse.json({
                error: 'Document too long. Auto-format works best on documents under 10,000 characters.'
            }, { status: 400 });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': siteUrl,
                'X-Title': siteName,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [
                    { role: 'system', content: SYSTEM_INSTRUCTION },
                    {
                        role: 'user',
                        content: `Proofread and correct this HTML content:\n\n${html}`
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent corrections
                max_tokens: 2000,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[AUTO-FORMAT] API Error:', errorData);
            return NextResponse.json({
                error: 'Failed to process auto-format request'
            }, { status: response.status });
        }

        const data = await response.json();
        const correctedHtml = data.choices?.[0]?.message?.content || html;

        // Clean up any markdown code blocks the AI might have added
        let cleaned = correctedHtml
            .replace(/```html\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return NextResponse.json({ correctedHtml: cleaned });

    } catch (error: any) {
        console.error('[AUTO-FORMAT] Error:', error);
        return NextResponse.json({
            error: error.message || 'An error occurred during auto-format'
        }, { status: 500 });
    }
}
