
import puppeteerCore, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function getBrowser(): Promise<Browser> {
    // If running on Vercel (Production)
    if (process.env.VERCEL) {
        // Configure @sparticuz/chromium
        chromium.setGraphicsMode = false;

        return await puppeteerCore.launch({
            args: (chromium as any).args,
            defaultViewport: (chromium as any).defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: (chromium as any).headless,
            ignoreHTTPSErrors: true,
        } as any) as unknown as Browser;
    }

    // If running Locally
    // We dynamically import puppeteer to avoid bundling it in production
    const { default: puppeteerLocal } = await import('puppeteer');

    return await puppeteerLocal.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }) as unknown as Browser;
}
