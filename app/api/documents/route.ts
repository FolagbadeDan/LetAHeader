import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import HTMLtoDOCX from 'html-to-docx';

export async function POST(req: Request) {
    console.log("Document generation request received");
    try {
        const { html, type, filename } = await req.json();
        console.log(`Generating ${type} for ${filename}`);

        if (!html) {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        if (type === 'pdf') {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();

            // Set content and wait for network idle to ensure styles load
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm',
                },
            });

            await browser.close();

            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${filename || 'document.pdf'}"`,
                },
            });
        }

        if (type === 'docx') {
            const docxBuffer = await HTMLtoDOCX(html, null, {
                table: { row: { cantSplit: true } },
                footer: true,
                pageNumber: true,
            });

            return new NextResponse(docxBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': `attachment; filename="${filename || 'document.docx'}"`,
                },
            });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    } catch (error: any) {
        console.error('Document Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate document' }, { status: 500 });
    }
}
