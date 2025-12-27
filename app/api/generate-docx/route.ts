import { NextRequest, NextResponse } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';

export async function POST(request: NextRequest) {
    try {
        const { html, filename } = await request.json();

        if (!html) {
            return NextResponse.json(
                { error: 'HTML content is required' },
                { status: 400 }
            );
        }

        // Basic CSS for the Word document
        const css = `
      body { font-family: 'Arial', sans-serif; font-size: 11pt; }
      p { margin-bottom: 12px; line-height: 1.5; }
      h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
    `;

        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Document</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

        const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        // Return the file as a blob
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename || 'document.docx'}"`,
            },
        });
    } catch (error) {
        console.error('DOCX Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate DOCX file' },
            { status: 500 }
        );
    }
}
