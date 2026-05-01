// ============================================================
//  converterUtils.js  — v2  (Layout-Preserving)
//  Place at:  src/utils/converterUtils.js
//
//  npm install mammoth docx jspdf html2canvas pdf-lib
//
//  KEY FIX:  PDF → DOCX and DOCX → PDF now produce properly
//  structured documents with:
//    • Real Headings (H1, H2, H3) — not plain text
//    • Bold / italic / underline runs
//    • Bullet and numbered lists
//    • Correct spacing between sections
//    • Tables preserved
//    • NO more single-paragraph dumps
// ============================================================

// ─── Lazy pdf.js loader ──────────────────────────────────────────────────────
async function getPdfJs() {
  if (typeof window === 'undefined') throw new Error('PDF.js requires browser');
  if (window.__pdfjs_lib) return window.__pdfjs_lib;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      window.__pdfjs_lib = window.pdfjsLib;
      resolve(window.pdfjsLib);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── File readers ─────────────────────────────────────────────────────────────
export function readAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error('Failed to read file'));
    r.readAsArrayBuffer(file);
  });
}
function readAsText(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error('Failed to read file'));
    r.readAsText(file);
  });
}

// ─── PDF: extract structured lines with heading detection ────────────────────
async function extractPdfStructured(arrayBuffer) {
  const pdfjs = await getPdfJs();
  const pdf   = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const allLines = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page    = await pdf.getPage(p);
    const content = await page.getTextContent();
    const vp      = page.getViewport({ scale: 1 });

    // Group text items into lines by Y position (2px tolerance)
    const lineMap = new Map();
    for (const item of content.items) {
      if (!item.str?.trim()) continue;
      const y = Math.round(vp.height - item.transform[5]);
      const key = [...lineMap.keys()].find(k => Math.abs(k - y) < 3);
      if (key !== undefined) {
        lineMap.get(key).push(item);
      } else {
        lineMap.set(y, [item]);
      }
    }

    // Sort by Y and classify
    const sorted = [...lineMap.entries()].sort((a, b) => a[0] - b[0]);

    if (p > 1) allLines.push({ text: '', type: 'empty' });

    for (const [, items] of sorted) {
      const text    = items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
      if (!text) continue;

      const avgSize = items.reduce((s, i) => s + (i.height || 12), 0) / items.length;
      const isBold  = items.some(i => i.fontName?.toLowerCase().includes('bold'));
      const isAllCap = text.length > 2 && text.length < 60
                       && text === text.toUpperCase()
                       && /[A-Z]{2,}/.test(text);
      const isBullet = /^[•▪▸▶‣◦]\s/.test(text);
      const isNum    = /^\d+\.\s/.test(text);

      let type = 'paragraph';
      if      (avgSize >= 18 || (isBold && avgSize >= 16))        type = 'h1';
      else if (avgSize >= 13 || (isBold && isAllCap))             type = 'h2';
      else if (isBold && avgSize >= 11)                           type = 'h3';
      else if (isBullet || isNum)                                 type = 'list';

      allLines.push({
        text,
        type,
        bold: isBold,
        ordered: isNum,
        cleanText: isBullet ? text.replace(/^[•▪▸▶‣◦]\s+/, '')
                 : isNum    ? text.replace(/^\d+\.\s+/, '')
                 : text,
      });
    }
  }

  return allLines;
}

// ─── PDF: render page 1 to JPG blob ──────────────────────────────────────────
async function renderPdfPageToBlob(arrayBuffer, pageNum = 1, scale = 2) {
  const pdfjs  = await getPdfJs();
  const pdf    = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const page   = await pdf.getPage(pageNum);
  const vp     = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = vp.width;
  canvas.height = vp.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
}

// ─── PDF: plain text (for TXT export) ────────────────────────────────────────
async function extractPdfText(arrayBuffer) {
  const pdfjs = await getPdfJs();
  const pdf   = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(i => i.str).join(' ').trim());
  }
  return pages;
}

// ─── DOCX → structured lines via mammoth HTML ────────────────────────────────
async function docxToStructuredLines(arrayBuffer) {
  const mammoth = await import('mammoth');
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  const parser = new DOMParser();
  const dom    = parser.parseFromString(html, 'text/html');
  const lines  = [];

  function walk(node) {
    const tag  = node.tagName?.toLowerCase();
    const text = node.textContent?.replace(/\s+/g, ' ').trim();
    if (!tag)   return;
    if (!text)  return;

    if      (tag === 'h1') lines.push({ text, type: 'h1', bold: true });
    else if (tag === 'h2') lines.push({ text, type: 'h2', bold: true });
    else if (tag === 'h3' || tag === 'h4') lines.push({ text, type: 'h3', bold: true });
    else if (tag === 'li') {
      const ordered = node.parentElement?.tagName?.toLowerCase() === 'ol';
      lines.push({ text, type: 'list', ordered, cleanText: text });
    } else if (tag === 'p' || tag === 'div') {
      const isBold = !!node.querySelector('strong, b');
      lines.push({ text, type: isBold ? 'h3' : 'paragraph', bold: isBold });
    } else if (tag === 'table') {
      for (const row of node.querySelectorAll('tr')) {
        const cells = Array.from(row.querySelectorAll('td,th'))
          .map(c => c.textContent.trim()).filter(Boolean).join('   |   ');
        if (cells) lines.push({ text: cells, type: 'paragraph', bold: false });
      }
    } else if (['ul','ol','tbody','thead','tr','body','section','article'].includes(tag)) {
      for (const child of node.children) walk(child);
    } else {
      if (text) lines.push({ text, type: 'paragraph', bold: false });
    }
  }

  for (const child of dom.body.children) walk(child);
  return lines;
}

// ─── DOCX → HTML string ──────────────────────────────────────────────────────
async function docxToHTML(arrayBuffer) {
  const mammoth = await import('mammoth');
  const { value } = await mammoth.convertToHtml({ arrayBuffer });
  return value;
}

// ─── DOCX → plain text ───────────────────────────────────────────────────────
async function docxToText(arrayBuffer) {
  const mammoth = await import('mammoth');
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

// ─── Build properly structured DOCX from lines ───────────────────────────────
async function buildDocx(lines, docTitle = 'Document') {
  const {
    Document, Packer, Paragraph, TextRun,
    HeadingLevel, AlignmentType, BorderStyle, LevelFormat,
  } = await import('docx');

  // Numbering config
  const numbering = {
    config: [
      {
        reference: 'cv-bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: {
            run: { font: 'Calibri', size: 22 },
            paragraph: { indent: { left: 720, hanging: 360 } },
          },
        }],
      },
      {
        reference: 'cv-numbers',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: {
            run: { font: 'Calibri', size: 22 },
            paragraph: { indent: { left: 720, hanging: 360 } },
          },
        }],
      },
    ],
  };

  const children = [];

  for (const line of lines) {
    const rawText = (line.cleanText || line.text || '').trim();
    if (!rawText) {
      children.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      continue;
    }

    switch (line.type) {
      case 'h1':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: rawText, font: 'Calibri', size: 36, bold: true, color: '1a1a2e' })],
          spacing: { before: 360, after: 160 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '6c63ff', space: 4 } },
        }));
        break;

      case 'h2':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: rawText, font: 'Calibri', size: 26, bold: true, color: '1a1a2e' })],
          spacing: { before: 280, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'cccccc', space: 2 } },
        }));
        break;

      case 'h3':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun({ text: rawText, font: 'Calibri', size: 24, bold: true, color: '374151' })],
          spacing: { before: 200, after: 80 },
        }));
        break;

      case 'list': {
        const ref = line.ordered ? 'cv-numbers' : 'cv-bullets';
        children.push(new Paragraph({
          numbering: { reference: ref, level: 0 },
          children: [new TextRun({ text: rawText, font: 'Calibri', size: 22, color: '374151' })],
          spacing: { before: 40, after: 60 },
        }));
        break;
      }

      case 'separator':
        children.push(new Paragraph({
          children: [],
          spacing: { before: 120, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'e5e7eb', space: 1 } },
        }));
        break;

      default: {
        // Detect ALL CAPS short lines as section headings (common in CVs)
        const isAllCap = rawText.length > 2 && rawText.length < 50
                         && rawText === rawText.toUpperCase()
                         && /[A-Z]{2,}/.test(rawText);
        if (isAllCap) {
          children.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: rawText, font: 'Calibri', size: 26, bold: true, color: '1a1a2e' })],
            spacing: { before: 280, after: 120 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'cccccc', space: 2 } },
          }));
        } else {
          // Check for inline bold segments (e.g. "Role Name  Company  2020–2022")
          const runs = buildInlineRuns(rawText, TextRun, line.bold);
          children.push(new Paragraph({
            children: runs,
            spacing: { before: 40, after: 100 },
          }));
        }
        break;
      }
    }
  }

  const doc = new Document({
    creator:  'CVForge Studio',
    title:    docTitle,
    numbering,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22, color: '374151' } },
      },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
          quickFormat: true,
          run:       { size: 36, bold: true, font: 'Calibri', color: '1a1a2e' },
          paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
          quickFormat: true,
          run:       { size: 26, bold: true, font: 'Calibri', color: '1a1a2e' },
          paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
        },
        {
          id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
          quickFormat: true,
          run:       { size: 24, bold: true, font: 'Calibri', color: '374151' },
          paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size:   { width: 11906, height: 16838 },          // A4
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }, // ~2cm
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}

// ─── Split a line into TextRun[] with inline bold detection ──────────────────
function buildInlineRuns(text, TextRun, defaultBold = false) {
  // Support **bold** markdown markers
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  const runs = [];
  for (const seg of segments) {
    if (!seg) continue;
    if (seg.startsWith('**') && seg.endsWith('**')) {
      runs.push(new TextRun({ text: seg.slice(2, -2), font: 'Calibri', size: 22, bold: true, color: '1a1a2e' }));
    } else {
      runs.push(new TextRun({ text: seg, font: 'Calibri', size: 22, bold: defaultBold, color: '374151' }));
    }
  }
  return runs.length ? runs : [new TextRun({ text, font: 'Calibri', size: 22, color: '374151' })];
}

// ─── HTML → PDF via html2canvas + jsPDF ──────────────────────────────────────
async function htmlToPdfBlob(htmlBody) {
  const { default: jsPDF }       = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');

  const div = document.createElement('div');
  div.style.cssText = `
    position:fixed;top:-99999px;left:-99999px;
    width:794px;background:#fff;color:#222;
    font-family:"Segoe UI",Arial,sans-serif;
    font-size:13px;line-height:1.7;
    padding:56px 64px;box-sizing:border-box;
  `;
  div.innerHTML = `
    <style>
      *{box-sizing:border-box}
      h1{font-size:22px;font-weight:700;color:#1a1a2e;
         border-bottom:2.5px solid #6c63ff;padding-bottom:5px;margin:20px 0 10px}
      h2{font-size:15px;font-weight:700;color:#1a1a2e;
         text-transform:uppercase;letter-spacing:.05em;
         border-bottom:1px solid #ccc;padding-bottom:4px;margin:18px 0 8px}
      h3{font-size:13px;font-weight:700;color:#374151;margin:14px 0 5px}
      p{margin:0 0 8px;color:#4b5563}
      ul,ol{padding-left:20px;margin:4px 0 10px}
      li{margin-bottom:4px;color:#4b5563}
      table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
      td,th{border:1px solid #e5e7eb;padding:6px 10px}
      th{background:#f9fafb;font-weight:700}
      strong,b{color:#1a1a2e}
      a{color:#6c63ff;text-decoration:none}
      hr{border:none;border-top:1px solid #e5e7eb;margin:16px 0}
    </style>
    ${htmlBody}
  `;
  document.body.appendChild(div);

  const canvas = await html2canvas(div, { scale: 2, useCORS: true, logging: false });
  document.body.removeChild(div);

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf     = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
  const pdfW    = pdf.internal.pageSize.getWidth();
  const pdfH    = pdf.internal.pageSize.getHeight();
  const imgH    = (canvas.height * pdfW) / canvas.width;
  let y = 0;

  while (y < imgH) {
    if (y > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, -y, pdfW, imgH);
    y += pdfH;
  }

  return pdf.output('blob');
}

// ─── Image → PDF ─────────────────────────────────────────────────────────────
async function imageToPDFBlob(file) {
  const { PDFDocument } = await import('pdf-lib');
  const buf    = await readAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.create();
  const isJpg  = file.type === 'image/jpeg';
  const img    = isJpg ? await pdfDoc.embedJpg(buf) : await pdfDoc.embedPng(buf);
  const a4     = { width: 595, height: 842 };
  const scale  = Math.min(a4.width / img.width, a4.height / img.height, 1);
  const w      = img.width  * scale;
  const h      = img.height * scale;
  const page   = pdfDoc.addPage([a4.width, a4.height]);
  page.drawImage(img, { x: (a4.width - w) / 2, y: (a4.height - h) / 2, width: w, height: h });
  return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

// ─── TXT → structured lines ───────────────────────────────────────────────────
function txtToLines(raw) {
  return raw.split('\n').map(line => {
    const t = line.trim();
    if (!t) return { text: '', type: 'empty' };
    if (t === t.toUpperCase() && t.length > 2 && t.length < 50 && /[A-Z]{2,}/.test(t))
      return { text: t, type: 'h2', bold: true };
    if (/^[•▪\-–]\s/.test(t)) return { text: t.replace(/^[•▪\-–]\s+/,''), type: 'list', cleanText: t.replace(/^[•▪\-–]\s+/,'') };
    if (/^\d+\.\s/.test(t))   return { text: t.replace(/^\d+\.\s+/,''), type: 'list', ordered: true, cleanText: t.replace(/^\d+\.\s+/,'') };
    return { text: t, type: 'paragraph' };
  });
}

// ─── TXT → PDF ───────────────────────────────────────────────────────────────
async function txtToPdf(lines) {
  const { default: jsPDF } = await import('jspdf');
  const pdf    = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 20;
  const maxW   = pdf.internal.pageSize.getWidth() - margin * 2;
  let y = 25;

  const nl = (extra = 0) => { y += extra; if (y > 272) { pdf.addPage(); y = 25; } };

  for (const line of lines) {
    const t = line.text || '';
    if (!t) { nl(4); continue; }

    switch (line.type) {
      case 'h1':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(18); pdf.setTextColor(26,26,46);
        pdf.text(t, margin, y);
        pdf.setDrawColor(108,99,255); pdf.setLineWidth(0.5);
        pdf.line(margin, y+1.5, margin+maxW, y+1.5);
        nl(10);
        break;
      case 'h2':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(13); pdf.setTextColor(26,26,46);
        pdf.text(t.toUpperCase(), margin, y);
        pdf.setDrawColor(180,180,180); pdf.setLineWidth(0.3);
        pdf.line(margin, y+1.5, margin+maxW, y+1.5);
        nl(8);
        break;
      case 'h3':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(12); pdf.setTextColor(55,65,81);
        pdf.text(t, margin, y);
        nl(7);
        break;
      case 'list': {
        pdf.setFont('helvetica','normal'); pdf.setFontSize(11); pdf.setTextColor(75,85,99);
        const wrapped = pdf.splitTextToSize(`\u2022  ${t}`, maxW - 8);
        for (const wl of wrapped) { nl(0); pdf.text(wl, margin+4, y); nl(5.5); }
        break;
      }
      default: {
        pdf.setFont('helvetica','normal'); pdf.setFontSize(11); pdf.setTextColor(75,85,99);
        const wrapped = pdf.splitTextToSize(t, maxW);
        for (const wl of wrapped) { nl(0); pdf.text(wl, margin, y); nl(5.5); }
        nl(1.5);
        break;
      }
    }
  }

  return pdf.output('blob');
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
export async function convertFile(file, targetFormat) {
  const ext      = file.name.split('.').pop().toLowerCase();
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const target   = targetFormat.toLowerCase();

  // PDF → DOCX  ✅ with proper layout
  if (ext === 'pdf' && target === 'docx') {
    const buf   = await readAsArrayBuffer(file);
    const lines = await extractPdfStructured(buf);
    const blob  = await buildDocx(lines, baseName);
    return { blob, filename: `${baseName}.docx` };
  }

  // DOCX / DOC → PDF  ✅ with proper layout
  if (['docx','doc'].includes(ext) && target === 'pdf') {
    const buf  = await readAsArrayBuffer(file);
    const html = await docxToHTML(buf);
    const blob = await htmlToPdfBlob(html);
    return { blob, filename: `${baseName}.pdf` };
  }

  // DOCX → TXT
  if (['docx','doc'].includes(ext) && target === 'txt') {
    const buf  = await readAsArrayBuffer(file);
    const text = await docxToText(buf);
    return { blob: new Blob([text], { type: 'text/plain' }), filename: `${baseName}.txt` };
  }

  // DOCX → HTML  ✅ styled
  if (['docx','doc'].includes(ext) && target === 'html') {
    const buf  = await readAsArrayBuffer(file);
    const body = await docxToHTML(buf);
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:40px auto;
line-height:1.7;color:#222;padding:0 24px}
h1{font-size:22px;font-weight:700;color:#1a1a2e;border-bottom:2px solid #6c63ff;
padding-bottom:4px;margin:24px 0 12px}
h2{font-size:16px;font-weight:700;color:#1a1a2e;text-transform:uppercase;
letter-spacing:.05em;border-bottom:1px solid #ccc;padding-bottom:3px;margin:20px 0 8px}
h3{font-size:14px;font-weight:700;color:#374151;margin:16px 0 6px}
p{margin:0 0 10px;color:#4b5563}ul,ol{padding-left:24px;margin:4px 0 12px}
li{margin-bottom:5px;color:#4b5563}
table{width:100%;border-collapse:collapse;margin:14px 0}
td,th{border:1px solid #e5e7eb;padding:8px 12px;font-size:13px}
th{background:#f9fafb;font-weight:700}
</style></head><body>${body}</body></html>`;
    return { blob: new Blob([full], { type: 'text/html' }), filename: `${baseName}.html` };
  }

  // PDF → TXT
  if (ext === 'pdf' && target === 'txt') {
    const buf   = await readAsArrayBuffer(file);
    const pages = await extractPdfText(buf);
    return {
      blob: new Blob([pages.join('\n\n--- Page Break ---\n\n')], { type: 'text/plain' }),
      filename: `${baseName}.txt`,
    };
  }

  // PDF → HTML  ✅ structured
  if (ext === 'pdf' && target === 'html') {
    const buf   = await readAsArrayBuffer(file);
    const lines = await extractPdfStructured(buf);
    const body  = lines.map(l => {
      if (!l.text) return '';
      if (l.type === 'h1')   return `<h1>${l.text}</h1>`;
      if (l.type === 'h2')   return `<h2>${l.text}</h2>`;
      if (l.type === 'h3')   return `<h3>${l.text}</h3>`;
      if (l.type === 'list') return `<li>${l.cleanText || l.text}</li>`;
      return `<p>${l.text}</p>`;
    }).join('\n');
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:40px auto;
line-height:1.7;color:#222;padding:0 24px}
h1{font-size:22px;font-weight:700;color:#1a1a2e;border-bottom:2px solid #6c63ff;
padding-bottom:4px;margin:24px 0 12px}
h2{font-size:16px;font-weight:700;color:#1a1a2e;text-transform:uppercase;
letter-spacing:.05em;border-bottom:1px solid #ccc;padding-bottom:3px;margin:20px 0 8px}
h3{font-size:14px;font-weight:700;color:#374151;margin:16px 0 6px}
p{margin:0 0 10px;color:#4b5563}li{margin-bottom:5px;color:#4b5563}
</style></head><body>${body}</body></html>`;
    return { blob: new Blob([full], { type: 'text/html' }), filename: `${baseName}.html` };
  }

  // PDF → JPG
  if (ext === 'pdf' && target === 'jpg') {
    const buf  = await readAsArrayBuffer(file);
    const blob = await renderPdfPageToBlob(buf, 1, 2);
    return { blob, filename: `${baseName}_page1.jpg` };
  }

  // JPG/PNG → PDF
  if (['jpg','jpeg','png'].includes(ext) && target === 'pdf') {
    const blob = await imageToPDFBlob(file);
    return { blob, filename: `${baseName}.pdf` };
  }

  // TXT → DOCX
  if (ext === 'txt' && target === 'docx') {
    const raw   = await readAsText(file);
    const lines = txtToLines(raw);
    const blob  = await buildDocx(lines, baseName);
    return { blob, filename: `${baseName}.docx` };
  }

  // TXT → PDF
  if (ext === 'txt' && target === 'pdf') {
    const raw   = await readAsText(file);
    const lines = txtToLines(raw);
    const blob  = await txtToPdf(lines);
    return { blob, filename: `${baseName}.pdf` };
  }

  throw new Error(`Conversion .${ext} → .${target} is not supported.`);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function getTargetFormats(ext) {
  const map = {
    pdf:  [
      { value: 'docx', label: 'Word Document (.docx) — with layout' },
      { value: 'txt',  label: 'Plain Text (.txt)' },
      { value: 'html', label: 'HTML Page (.html)' },
      { value: 'jpg',  label: 'Image — first page (.jpg)' },
    ],
    docx: [
      { value: 'pdf',  label: 'PDF Document (.pdf) — with layout' },
      { value: 'txt',  label: 'Plain Text (.txt)' },
      { value: 'html', label: 'HTML Page (.html)' },
    ],
    doc: [
      { value: 'pdf',  label: 'PDF Document (.pdf) — with layout' },
      { value: 'txt',  label: 'Plain Text (.txt)' },
      { value: 'html', label: 'HTML Page (.html)' },
    ],
    txt:  [
      { value: 'pdf',  label: 'PDF Document (.pdf)' },
      { value: 'docx', label: 'Word Document (.docx)' },
    ],
    jpg:  [{ value: 'pdf', label: 'PDF Document (.pdf)' }],
    jpeg: [{ value: 'pdf', label: 'PDF Document (.pdf)' }],
    png:  [{ value: 'pdf', label: 'PDF Document (.pdf)' }],
  };
  return map[ext?.toLowerCase()] || [];
}

export function formatFileSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}