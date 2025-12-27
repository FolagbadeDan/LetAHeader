import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a high-quality PDF from the DOM.
 * Captures each .document-page element individually.
 */
export const generatePDF = async (
  sourceWrapper: HTMLElement,
  filename: string = 'document.pdf',
  quality: 'hd' | 'compressed' = 'hd'
) => {
  console.log('[PDF] Starting Server-Side Generation', { filename });

  // 1. Gather Content
  const pages = Array.from(sourceWrapper.querySelectorAll('.document-page')) as HTMLElement[];
  if (pages.length === 0) throw new Error('No pages found to generate');

  // 2. Prepare HTML for Server
  // We need to clone nodes to strip current scale checks, and enforce page breaks
  const container = document.createElement('div');

  pages.forEach((page, index) => {
    const clone = page.cloneNode(true) as HTMLElement;

    // Reset styles for PDF render (A4 dimensions are forced by CSS in route, but we clean inline styles)
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

    // Page Break Logic
    if (index < pages.length - 1) {
      clone.style.pageBreakAfter = 'always';
    }

    container.appendChild(clone);
  });

  const fullHtml = container.innerHTML;

  try {
    // 3. Send to Server
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: fullHtml })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server PDF Generation Failed');
    }

    // 4. Download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;

  } catch (err: any) {
    console.error('[PDF] Generation Error:', err);
    alert(`Failed to generate PDF: ${err.message}`);
    return false;
  }
};

export const generateDOCX = async (
  element: HTMLElement,
  filename: string
) => {
  try {
    // 1. Get the HTML content
    // We might need to wrap it specifically or clone styles
    const htmlContent = element.innerHTML;

    // 2. Call the Server API
    const response = await fetch('/api/generate-docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: htmlContent,
        filename: filename
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate DOCX on server');
    }

    // 3. Get the Blob and Download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (e) {
    console.error("DOCX Export Error:", e);
    alert("Failed to export Word document. Please try again.");
    return false;
  }
};

export const generateDocument = async (
  element: HTMLElement,
  filename: string,
  type: 'pdf' | 'docx',
  quality: 'hd' | 'compressed' = 'hd'
) => {
  if (type === 'pdf') {
    return generatePDF(element, filename, quality);
  } else {
    return generateDOCX(element, filename);
  }
};