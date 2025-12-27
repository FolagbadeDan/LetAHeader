import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    try {
        const { html } = await req.json();

        if (!html) {
            return NextResponse.json({ error: 'Missing HTML content' }, { status: 400 });
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 1. Construct Full HTML Document
        // We inject:
        // - Tailwind CDN for utility classes
        // - Google Fonts (Inter, etc.) matching globals.css
        // - Custom CSS Variables (foreground, background, etc.) matching globals.css
        // - Custom Styles (.a4-paper-container overrides for proper PDF marginless render)

        const fullContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          
          <!-- Fonts -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
          
          <!-- Tailwind (CDN Fallback) -->
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    border: "hsl(214.3 31.8% 91.4%)",
                    input: "hsl(214.3 31.8% 91.4%)",
                    ring: "hsl(222.2 84% 4.9%)",
                    background: "hsl(0 0% 100%)",
                    foreground: "hsl(222.2 84% 4.9%)",
                    primary: {
                      DEFAULT: "hsl(222.2 47.4% 11.2%)",
                      foreground: "hsl(210 40% 98%)",
                    },
                    secondary: {
                      DEFAULT: "hsl(210 40% 96.1%)",
                      foreground: "hsl(222.2 47.4% 11.2%)",
                    },
                    destructive: {
                      DEFAULT: "hsl(0 84.2% 60.2%)",
                      foreground: "hsl(210 40% 98%)",
                    },
                    muted: {
                      DEFAULT: "hsl(210 40% 96.1%)",
                      foreground: "hsl(215.4 16.3% 46.9%)",
                    },
                    accent: {
                      DEFAULT: "hsl(210 40% 96.1%)",
                      foreground: "hsl(222.2 47.4% 11.2%)",
                    },
                    popover: {
                      DEFAULT: "hsl(0 0% 100%)",
                      foreground: "hsl(222.2 84% 4.9%)",
                    },
                    card: {
                      DEFAULT: "hsl(0 0% 100%)",
                      foreground: "hsl(222.2 84% 4.9%)",
                    },
                  },
                  borderRadius: {
                    lg: "0.5rem",
                    md: "calc(0.5rem - 2px)",
                    sm: "calc(0.5rem - 4px)",
                  },
                },
              },
            }
          </script>

          <style>
            /* Reset body for PDF */
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
            }

            /* Ensure fonts apply */
            body, .font-sans { font-family: 'Inter', sans-serif; }
            .font-serif { font-family: 'Merriweather', serif; }
            .font-mono { font-family: 'Space Grotesk', monospace; } /* Mapping Space Grotesk if used as mono replacement/heading */

            /* Remove any screen-only shadows or margins from the page container itself if captured */
            .document-page {
                box-shadow: none !important;
                margin: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

        await page.setContent(fullContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"',
            },
        });

    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 });
    }
}
