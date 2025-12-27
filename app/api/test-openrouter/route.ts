import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    console.log('[TEST] API Key exists:', !!apiKey);
    console.log('[TEST] API Key length:', apiKey?.length);

    if (!apiKey) {
        return NextResponse.json({ error: 'No API key' }, { status: 500 });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Say hello in one sentence'
                    }
                ]
            })
        });

        const text = await response.text();
        console.log('[TEST] Response status:', response.status);
        console.log('[TEST] Response:', text);

        return NextResponse.json({
            status: response.status,
            response: text
        });
    } catch (error: any) {
        console.error('[TEST] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
