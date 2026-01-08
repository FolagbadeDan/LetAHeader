import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'LetAHeader';

        console.log('[TEST] API Key exists:', !!apiKey);
        console.log('[TEST] API Key length:', apiKey?.length || 0);
        console.log('[TEST] Site URL:', siteUrl);

        if (!apiKey) {
            return NextResponse.json({
                error: 'OPENROUTER_API_KEY is not set in environment variables',
                hasKey: false,
                siteUrl,
                siteName
            }, { status: 500 });
        }

        // Test actual API call with a simple prompt
        const testPrompt = "Say 'API connection successful' in exactly 3 words.";

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
                    { role: 'user', content: testPrompt }
                ],
                temperature: 0.7,
                max_tokens: 50
            })
        });

        console.log('[TEST] Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('[TEST] Error response:', errorData);

            return NextResponse.json({
                success: false,
                error: errorData,
                status: response.status,
                hasKey: true,
                keyLength: apiKey.length,
                siteUrl,
                siteName
            }, { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content || '';

        console.log('[TEST] Success! Generated:', generatedText);

        return NextResponse.json({
            success: true,
            generatedText,
            hasKey: true,
            keyLength: apiKey.length,
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            siteUrl,
            siteName
        });

    } catch (error: any) {
        console.error('[TEST] Exception:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
