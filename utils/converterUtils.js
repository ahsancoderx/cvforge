// ============================================================
//  converterUtils.js  — v4  COMPLETE REWRITE
//  Place at:  src/utils/converterUtils.js
//
//  KEY FIX: PDF → DOCX/HTML/TXT now uses canvas rendering
//  to preserve exact colors, layout, fonts from designed CVs.
//  Each PDF page is rendered as a high-res image and embedded.
// ============================================================

// ─── pdf.js CDN loader ────────────────────────────────────────────────────────
let _pdfJsPromise = null;
function getPdfJs() {
  if (_pdfJsPromise) return _pdfJsPromise;
  _pdfJsPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Browser only'));
    if (window.__pdfjs_loaded) return resolve(window.pdfjsLib);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      window.__pdfjs_loaded = true;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load pdf.js from CDN'));
    document.head.appendChild(script);
  });
  return _pdfJsPromise;
}

// ─── File readers ─────────────────────────────────────────────────────────────
export function readAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = () => rej(new Error(`Cannot read ${file.name}`));
    r.readAsArrayBuffer(file);
  });
}
function readAsText(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = () => rej(new Error(`Cannot read ${file.name}`));
    r.readAsText(file);
  });
}

// ─── CORE: Render ALL PDF pages to canvas images (HIGH-RES) ──────────────────
// This is the KEY function. Instead of extracting text (which loses all
// colors/layout from designed CVs), we render each page visually at 2.5x
// scale, giving pixel-perfect output that matches the original.
async function pdfToPageImages(arrayBuffer, scale = 2.5) {
  const pdfjs = await getPdfJs();
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  } catch (e) {
    throw new Error('Could not open PDF. It may be password-protected or corrupted.');
  }

  const images = []; // Array of { dataUrl, width, height, naturalWidth, naturalHeight }

  for (let i = 1; i <= pdf.numPages; i++) {
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx      = canvas.getContext('2d');
    ctx.fillStyle  = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    images.push({
      dataUrl:       canvas.toDataURL('image/jpeg', 0.96),
      width:         canvas.width,
      height:        canvas.height,
      naturalWidth:  viewport.width  / scale, // original PDF points
      naturalHeight: viewport.height / scale,
    });
  }
  return images;
}

// ─── PDF text extraction (for TXT export only) ───────────────────────────────
async function pdfToPlainText(arrayBuffer) {
  const pdfjs = await getPdfJs();
  const pdf   = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent({ normalizeWhitespace: true });
    const vp      = page.getViewport({ scale: 1 });

    // Group by Y to preserve line order
    const yMap = new Map();
    for (const item of content.items) {
      if (!item.str?.trim()) continue;
      const y = Math.round(vp.height - item.transform[5]);
      let found = null;
      for (const k of yMap.keys()) {
        if (Math.abs(k - y) <= 4) { found = k; break; }
      }
      const key = found ?? y;
      if (!yMap.has(key)) yMap.set(key, []);
      yMap.get(key).push(item);
    }
    const lines = [...yMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, items]) => items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    pages.push(lines.join('\n'));
  }
  return pages;
}

// ─── PDF → DOCX: embed rendered page images into Word doc ────────────────────
// Each page becomes a full-width image in the DOCX, preserving all colors/layout.
async function pdfToDocxBlob(arrayBuffer, title) {
  const images = await pdfToPageImages(arrayBuffer, 2.5);
  if (images.length === 0) throw new Error('No pages could be rendered from this PDF.');

  const { Document, Packer, Paragraph, ImageRun, AlignmentType } = await import('docx');

  // A4 dimensions in EMUs (English Metric Units): 1 inch = 914400 EMU, A4 = 8.27 × 11.69 in
  const A4_W_EMU    = 7560960; // 8.27in * 914400 - margins
  const A4_W_POINTS = 595;     // PDF points for A4 width

  const children = [];

  for (let idx = 0; idx < images.length; idx++) {
    const img = images[idx];

    // Convert dataUrl → Uint8Array for docx ImageRun
    const base64 = img.dataUrl.split(',')[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    // Scale image to fill A4 width while keeping aspect ratio
    const aspectRatio = img.height / img.width;
    const displayW    = A4_W_EMU;
    const displayH    = Math.round(A4_W_EMU * aspectRatio);

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: idx === 0 ? 0 : 200, after: 0 },
        children: [
          new ImageRun({
            data: bytes,
            transformation: { width: Math.round(displayW / 9144), height: Math.round(displayH / 9144) },
            // EMU to points: divide by 914400 * 100 ... actually docx uses twips or points depending on version
            // Use pixel-based: width/height in pixels at 96dpi
          }),
        ],
      })
    );
  }

  // Re-do with correct pixel dimensions for docx ImageRun
  const children2 = [];
  for (let idx = 0; idx < images.length; idx++) {
    const img = images[idx];
    const base64 = img.dataUrl.split(',')[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    // Target: fill ~17cm width (A4 with 2cm margins each side)
    // docx ImageRun uses pixels at 96dpi internally
    // 17cm = 6.69in = 6.69 * 96 = 642px display width
    const displayWidthPx  = 642;
    const displayHeightPx = Math.round(displayWidthPx * (img.height / img.width));

    children2.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: idx === 0 ? 0 : 300, after: 0 },
        children: [
          new ImageRun({
            data:           bytes,
            transformation: { width: displayWidthPx, height: displayHeightPx },
            type:           'jpg',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    creator: 'CVForge Studio',
    title,
    sections: [{
      properties: {
        page: {
          size:   { width: 11906, height: 16838 }, // A4
          margin: { top: 567, right: 567, bottom: 567, left: 567 }, // ~1cm margins
        },
      },
      children: children2,
    }],
  });

  const blob = await Packer.toBlob(doc);
  if (!blob || blob.size < 500) throw new Error('DOCX generation produced an empty file.');
  return blob;
}

// ─── PDF → HTML: embed rendered images in a styled HTML page ─────────────────
async function pdfToHtmlBlob(arrayBuffer, title) {
  const images = await pdfToPageImages(arrayBuffer, 2.0);
  if (images.length === 0) throw new Error('No pages could be rendered.');

  const imgTags = images.map((img, i) => `
    <div class="page">
      <img src="${img.dataUrl}" alt="Page ${i + 1}" />
    </div>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #f0f0f0;
    font-family: Arial, sans-serif;
    padding: 24px 16px;
  }
  .page {
    background: #fff;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    border-radius: 4px;
    overflow: hidden;
  }
  .page img {
    display: block;
    width: 100%;
    height: auto;
  }
  .footer {
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
    margin-top: 16px;
  }
</style>
</head>
<body>
${imgTags}
<div class="footer">Converted by CVForge Studio</div>
</body>
</html>`;

  return new Blob([html], { type: 'text/html' });
}

// ─── PDF → JPG (single page or all pages as zip) ────────────────────────────
async function pdfToJpgBlob(arrayBuffer, pageNum = 1) {
  const pdfjs = await getPdfJs();
  const pdf   = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const page  = await pdf.getPage(pageNum);
  const vp    = page.getViewport({ scale: 2.5 });
  const canvas = document.createElement('canvas');
  canvas.width  = vp.width;
  canvas.height = vp.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return new Promise(res => canvas.toBlob(blob => res(blob), 'image/jpeg', 0.95));
}

// ─── DOCX → PDF via html2canvas (layout-preserving) ──────────────────────────
async function docxToPdfBlob(arrayBuffer) {
  const mammoth = await import('mammoth/mammoth.browser');
  const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer });

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position:      'fixed',
    top:           '-9999999px',
    left:          '-9999999px',
    width:         '794px',
    background:    '#ffffff',
    color:         '#222222',
    fontFamily:    '"Segoe UI", Calibri, Arial, sans-serif',
    fontSize:      '13px',
    lineHeight:    '1.7',
    padding:       '56px 64px',
    boxSizing:     'border-box',
    zIndex:        '-999',
    visibility:    'hidden',
  });

  wrapper.innerHTML = `
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      h1 { font-size:22px; font-weight:700; color:#1a1a2e;
           border-bottom:2.5px solid #6c63ff; padding-bottom:6px;
           margin:28px 0 12px; }
      h2 { font-size:15px; font-weight:700; color:#1a1a2e;
           text-transform:uppercase; letter-spacing:0.06em;
           border-bottom:1px solid #ccc; padding-bottom:4px;
           margin:22px 0 10px; }
      h3 { font-size:13px; font-weight:700; color:#374151; margin:16px 0 6px; }
      p  { margin:0 0 8px; color:#4b5563; line-height:1.65; }
      ul,ol { padding-left:22px; margin:4px 0 10px; }
      li { margin-bottom:4px; color:#4b5563; }
      table { width:100%; border-collapse:collapse; margin:14px 0; font-size:12px; }
      td,th { border:1px solid #e5e7eb; padding:6px 10px; }
      th { background:#f9fafb; font-weight:700; }
      strong,b { color:#1a1a2e; }
      a { color:#6c63ff; }
      hr { border:none; border-top:1px solid #e5e7eb; margin:18px 0; }
    </style>
    ${htmlBody}
  `;
  document.body.appendChild(wrapper);
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise(r => setTimeout(r, 300));

  const canvas = await html2canvas(wrapper, {
    scale: 2, useCORS: true, allowTaint: false,
    backgroundColor: '#ffffff', logging: false,
    width: 794, height: wrapper.scrollHeight,
    windowWidth: 794, windowHeight: wrapper.scrollHeight,
    x: 0, y: 0,
  });
  document.body.removeChild(wrapper);

  const pdf  = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const ratio  = pdfW / canvas.width;
  const pageH  = Math.floor(pdfH / ratio);
  const pages  = Math.ceil(canvas.height / pageH);

  for (let i = 0; i < pages; i++) {
    if (i > 0) pdf.addPage();
    const srcY = i * pageH;
    const srcH = Math.min(pageH, canvas.height - srcY);
    const slice = document.createElement('canvas');
    slice.width  = canvas.width;
    slice.height = srcH;
    slice.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
    pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, srcH * ratio);
  }
  return pdf.output('blob');
}

// ─── DOCX → TXT ──────────────────────────────────────────────────────────────
async function docxToText(arrayBuffer) {
  const mammoth = await import('mammoth/mammoth.browser');
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

// ─── DOCX → HTML ─────────────────────────────────────────────────────────────
async function docxToHtml(arrayBuffer, title) {
  const mammoth = await import('mammoth/mammoth.browser');
  const { value: body } = await mammoth.convertToHtml({ arrayBuffer });
  return `<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body{font-family:"Segoe UI",Arial,sans-serif;max-width:800px;margin:40px auto;
       line-height:1.7;color:#222;padding:0 24px}
  h1{font-size:22px;font-weight:700;color:#1a1a2e;
     border-bottom:2px solid #6c63ff;padding-bottom:5px;margin:28px 0 12px}
  h2{font-size:16px;font-weight:700;color:#1a1a2e;text-transform:uppercase;
     letter-spacing:.06em;border-bottom:1px solid #ccc;padding-bottom:4px;margin:22px 0 10px}
  h3{font-size:14px;font-weight:700;color:#374151;margin:16px 0 6px}
  p{margin:0 0 10px;color:#4b5563}
  ul,ol{padding-left:24px;margin:6px 0 12px}
  li{margin-bottom:5px;color:#4b5563}
  table{width:100%;border-collapse:collapse;margin:14px 0}
  td,th{border:1px solid #e5e7eb;padding:8px 12px;font-size:13px}
  th{background:#f9fafb;font-weight:700}
  strong,b{color:#1a1a2e}
</style></head>
<body>${body}</body></html>`;
}

// ─── TXT helpers ──────────────────────────────────────────────────────────────
function txtToLines(raw) {
  return raw.split('\n').map(line => {
    const t = line.trim();
    if (!t) return { text: '', type: 'empty' };
    if (t === t.toUpperCase() && /[A-Z]{2,}/.test(t) && t.length > 2 && t.length < 55)
      return { text: t, type: 'h2', bold: true };
    if (/^[•▪\-–]\s/.test(t))
      return { text: t.replace(/^[•▪\-–]\s+/, ''), type: 'bullet', cleanText: t.replace(/^[•▪\-–]\s+/, '') };
    if (/^\d+[.)]\s/.test(t))
      return { text: t.replace(/^\d+[.)]\s+/, ''), type: 'numbered', cleanText: t.replace(/^\d+[.)]\s+/, '') };
    return { text: t, type: 'paragraph' };
  });
}

async function txtToDocxBlob(lines, title) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel,
          AlignmentType, BorderStyle, LevelFormat } = await import('docx');

  const numbering = {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: 'Calibri', size: 22 } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: 'Calibri', size: 22 } } }] },
    ],
  };

  const children = lines.map(line => {
    const raw = (line.cleanText || line.text || '').trim();
    if (!raw || line.type === 'empty') return new Paragraph({ children: [], spacing: { after: 80 } });
    if (line.type === 'h1') return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: raw, font: 'Calibri', size: 36, bold: true, color: '1a1a2e' })],
      spacing: { before: 400, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '6c63ff', space: 4 } },
    });
    if (line.type === 'h2') return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: raw.toUpperCase(), font: 'Calibri', size: 26, bold: true, color: '1a1a2e' })],
      spacing: { before: 300, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'cccccc', space: 4 } },
    });
    if (line.type === 'bullet') return new Paragraph({
      numbering: { reference: 'bullets', level: 0 },
      children: [new TextRun({ text: raw, font: 'Calibri', size: 22, color: '374151' })],
      spacing: { before: 40, after: 60 },
    });
    if (line.type === 'numbered') return new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      children: [new TextRun({ text: raw, font: 'Calibri', size: 22, color: '374151' })],
      spacing: { before: 40, after: 60 },
    });
    return new Paragraph({
      children: [new TextRun({ text: raw, font: 'Calibri', size: 22, bold: !!line.bold,
        color: line.bold ? '1a1a2e' : '374151' })],
      spacing: { before: 40, after: 100 },
    });
  });

  const doc = new Document({
    creator: 'CVForge Studio', title, numbering,
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      children,
    }],
  });
  return Packer.toBlob(doc);
}

async function txtToPdfBlob(lines) {
  const { default: jsPDF } = await import('jspdf');
  const pdf  = new jsPDF({ unit: 'mm', format: 'a4' });
  const ML   = 20;
  const maxW = pdf.internal.pageSize.getWidth() - ML * 2;
  let y = 25;
  const addY = extra => { y += extra; if (y > 272) { pdf.addPage(); y = 22; } };

  for (const line of lines) {
    const t = (line.text || '').trim();
    if (!t) { addY(4); continue; }
    switch (line.type) {
      case 'h1':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(17); pdf.setTextColor(26,26,46);
        pdf.text(t, ML, y);
        pdf.setDrawColor(108,99,255); pdf.setLineWidth(0.6); pdf.line(ML, y+1.5, ML+maxW, y+1.5);
        addY(10); break;
      case 'h2':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(12); pdf.setTextColor(26,26,46);
        pdf.text(t.toUpperCase(), ML, y);
        pdf.setDrawColor(180,180,180); pdf.setLineWidth(0.3); pdf.line(ML, y+1.5, ML+maxW, y+1.5);
        addY(8); break;
      case 'h3':
        pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(55,65,81);
        pdf.text(t, ML, y); addY(7); break;
      case 'bullet':
      case 'numbered': {
        pdf.setFont('helvetica','normal'); pdf.setFontSize(10.5); pdf.setTextColor(75,85,99);
        const wrapped = pdf.splitTextToSize((line.type==='bullet'?'• ':'')+t, maxW-6);
        for (const wl of wrapped) { pdf.text(wl, ML+4, y); addY(5); }
        break;
      }
      default: {
        pdf.setFont('helvetica','normal'); pdf.setFontSize(10.5); pdf.setTextColor(75,85,99);
        const wrapped = pdf.splitTextToSize(t, maxW);
        for (const wl of wrapped) { pdf.text(wl, ML, y); addY(5.2); }
        addY(1.5); break;
      }
    }
  }
  return pdf.output('blob');
}

// ─── Image → PDF ──────────────────────────────────────────────────────────────
async function imageToPdfBlob(file) {
  const { PDFDocument } = await import('pdf-lib');
  const buf    = await readAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.create();
  const isJpg  = file.type === 'image/jpeg';
  const img    = isJpg ? await pdfDoc.embedJpg(buf) : await pdfDoc.embedPng(buf);
  const A4     = { w: 595.28, h: 841.89 };
  const scale  = Math.min(A4.w / img.width, A4.h / img.height, 1);
  const w = img.width * scale, h = img.height * scale;
  const page = pdfDoc.addPage([A4.w, A4.h]);
  page.drawImage(img, { x:(A4.w-w)/2, y:(A4.h-h)/2, width:w, height:h });
  return new Blob([await pdfDoc.save()], { type:'application/pdf' });
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────
export async function convertFile(file, targetFormat) {
  const ext      = file.name.split('.').pop().toLowerCase();
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const target   = targetFormat.toLowerCase().trim();

  // ── PDF → DOCX  (image-embed, preserves full layout/colors) ────────────────
  if (ext === 'pdf' && target === 'docx') {
    const buf  = await readAsArrayBuffer(file);
    const blob = await pdfToDocxBlob(buf, baseName);
    return { blob, filename: `${baseName}.docx` };
  }

  // ── PDF → HTML ──────────────────────────────────────────────────────────────
  if (ext === 'pdf' && target === 'html') {
    const buf  = await readAsArrayBuffer(file);
    const blob = await pdfToHtmlBlob(buf, baseName);
    return { blob, filename: `${baseName}.html` };
  }

  // ── PDF → TXT ───────────────────────────────────────────────────────────────
  if (ext === 'pdf' && target === 'txt') {
    const buf   = await readAsArrayBuffer(file);
    const pages = await pdfToPlainText(buf);
    return { blob: new Blob([pages.join('\n\n')], { type:'text/plain' }), filename: `${baseName}.txt` };
  }

  // ── PDF → JPG ───────────────────────────────────────────────────────────────
  if (ext === 'pdf' && target === 'jpg') {
    const buf  = await readAsArrayBuffer(file);
    const blob = await pdfToJpgBlob(buf, 1);
    return { blob, filename: `${baseName}_page1.jpg` };
  }

  // ── DOCX → PDF ──────────────────────────────────────────────────────────────
  if (['docx','doc'].includes(ext) && target === 'pdf') {
    const buf  = await readAsArrayBuffer(file);
    const blob = await docxToPdfBlob(buf);
    return { blob, filename: `${baseName}.pdf` };
  }

  // ── DOCX → TXT ──────────────────────────────────────────────────────────────
  if (['docx','doc'].includes(ext) && target === 'txt') {
    const buf  = await readAsArrayBuffer(file);
    const text = await docxToText(buf);
    return { blob: new Blob([text], { type:'text/plain' }), filename: `${baseName}.txt` };
  }

  // ── DOCX → HTML ─────────────────────────────────────────────────────────────
  if (['docx','doc'].includes(ext) && target === 'html') {
    const buf  = await readAsArrayBuffer(file);
    const html = await docxToHtml(buf, baseName);
    return { blob: new Blob([html], { type:'text/html' }), filename: `${baseName}.html` };
  }

  // ── TXT → DOCX ──────────────────────────────────────────────────────────────
  if (ext === 'txt' && target === 'docx') {
    const raw   = await readAsText(file);
    const lines = txtToLines(raw);
    const blob  = await txtToDocxBlob(lines, baseName);
    return { blob, filename: `${baseName}.docx` };
  }

  // ── TXT → PDF ───────────────────────────────────────────────────────────────
  if (ext === 'txt' && target === 'pdf') {
    const raw   = await readAsText(file);
    const lines = txtToLines(raw);
    const blob  = await txtToPdfBlob(lines);
    return { blob, filename: `${baseName}.pdf` };
  }

  // ── Image → PDF ─────────────────────────────────────────────────────────────
  if (['jpg','jpeg','png'].includes(ext) && target === 'pdf') {
    const blob = await imageToPdfBlob(file);
    return { blob, filename: `${baseName}.pdf` };
  }

  throw new Error(`Conversion from .${ext.toUpperCase()} to .${target.toUpperCase()} is not supported yet.`);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}

export function getTargetFormats(ext) {
  const map = {
    pdf:  [
      { value:'docx', label:'Word Document (.docx) — layout preserved' },
      { value:'txt',  label:'Plain Text (.txt)' },
      { value:'html', label:'HTML Page (.html) — layout preserved' },
      { value:'jpg',  label:'Image — first page (.jpg)' },
    ],
    docx: [
      { value:'pdf',  label:'PDF Document (.pdf) — layout preserved' },
      { value:'txt',  label:'Plain Text (.txt)' },
      { value:'html', label:'HTML Page (.html)' },
    ],
    doc: [
      { value:'pdf',  label:'PDF Document (.pdf) — layout preserved' },
      { value:'txt',  label:'Plain Text (.txt)' },
      { value:'html', label:'HTML Page (.html)' },
    ],
    txt:  [
      { value:'pdf',  label:'PDF Document (.pdf)' },
      { value:'docx', label:'Word Document (.docx)' },
    ],
    jpg:  [{ value:'pdf', label:'PDF Document (.pdf)' }],
    jpeg: [{ value:'pdf', label:'PDF Document (.pdf)' }],
    png:  [{ value:'pdf', label:'PDF Document (.pdf)' }],
  };
  return map[ext?.toLowerCase()] || [];
}

export function formatFileSize(bytes) {
  if (!bytes)          return '0 B';
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(2)} MB`;
}