// =============================================================
//  pdfExport.js  — v3  PIXEL-PERFECT (html2canvas approach)
//  Place at:  src/utils/pdfExport.js
//
//  HOW IT WORKS:
//  ─────────────────────────────────────────────────────────────
//  Instead of manually re-drawing the CV with jsPDF primitives
//  (which breaks layout, loses images, misses gradients), this
//  utility:
//
//    1. Temporarily renders the EXACT same React template
//       component into a hidden off-screen container (794px wide
//       = A4 at 96 dpi).
//    2. Captures it with html2canvas at 3× scale for sharp print.
//    3. Slices the tall canvas into A4-page-height chunks.
//    4. Embeds each slice as a JPEG page in a jsPDF document.
//    5. Adds clickable hyperlinks on top of email / LinkedIn /
//       GitHub / website text (scanned from the resume data).
//    6. Saves the file.
//
//  RESULT: The downloaded PDF looks IDENTICAL to the editor
//  preview — same fonts, same colours, same photo, same layout.
//
//  npm install jspdf html2canvas
// =============================================================

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

// ── Template registry ─────────────────────────────────────────
// Import all your templates here. Add new ones to this map.
import {
  MinimalTemplate,
  CorporateTemplate,
  CreativeTemplate,
  TechTemplate,
  PurpleTemplate,
  SlateTemplate,
  MarineTemplate,
  CrimsonTemplate,
  ForestTemplate,
  NavyaTemplate,
} from '../components/template/AllTemplates';

const TEMPLATE_MAP = {
  minimal:   MinimalTemplate,
  corporate: CorporateTemplate,
  creative:  CreativeTemplate,
  tech:      TechTemplate,
  purple:    PurpleTemplate,
  slate:     SlateTemplate,
  marine:    MarineTemplate,
  crimson:   CrimsonTemplate,
  forest:    ForestTemplate,
  navya:     NavyaTemplate,
};

// ── A4 dimensions ─────────────────────────────────────────────
const A4_W_PX   = 794;   // pixels at 96 dpi (210 mm)
const A4_H_PX   = 1123;  // pixels at 96 dpi (297 mm)
const A4_W_MM   = 210;
const A4_H_MM   = 297;
const SCALE     = 3;     // render at 3× for crisp print quality

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

/** Normalise a raw string into a full URL for jsPDF link() */
function toHref(raw) {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  if (v.startsWith('http') || v.startsWith('mailto:') || v.startsWith('tel:')) return v;
  if (v.includes('@') && !v.includes(' ')) return 'mailto:' + v;
  if (/^\+?[\d\s\-().]+$/.test(v)) return 'tel:' + v.replace(/\s/g, '');
  return 'https://' + v;
}

/**
 * Wait for all <img> elements inside an element to fully load.
 * This is CRITICAL for profile photos to appear in the PDF.
 */
async function waitForImages(container) {
  const imgs = [...container.querySelectorAll('img')];
  await Promise.all(
    imgs.map(
      img =>
        img.complete
          ? Promise.resolve()
          : new Promise(res => {
              img.onload  = res;
              img.onerror = res; // don't block on broken images
            })
    )
  );
}

/**
 * Wait for web fonts referenced by the document to load.
 * Without this, html2canvas may render fallback fonts.
 */
async function waitForFonts() {
  if (document.fonts?.ready) await document.fonts.ready;
  // Extra buffer for Google Fonts / remote fonts
  await new Promise(res => setTimeout(res, 300));
}

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Export the CV as a pixel-perfect PDF matching the editor preview.
 *
 * @param {Object}  resume     - Full resume data object (same shape as editor state)
 * @param {string}  colorMode  - 'color' | 'bw'  (bw not yet implemented — ignored)
 * @param {Object}  [options]
 * @param {number}  [options.scale=3]         - Canvas render scale (higher = sharper)
 * @param {string}  [options.imageFormat='jpeg'] - 'jpeg' | 'png' (png = larger file)
 * @param {number}  [options.jpegQuality=0.95]   - JPEG quality 0–1
 * @returns {Promise<void>}
 */
export async function exportResumeToPDF(resume, colorMode = 'color', options = {}) {
  const {
    scale        = SCALE,
    imageFormat  = 'jpeg',
    jpegQuality  = 0.95,
  } = options;

  const templateId = resume.template || 'minimal';
  const TemplateComponent = TEMPLATE_MAP[templateId];

  if (!TemplateComponent) {
    console.error(`[pdfExport] Unknown template: "${templateId}"`);
    throw new Error(`Template "${templateId}" not found in TEMPLATE_MAP.`);
  }

  // ── 1. Create hidden off-screen container ────────────────────
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position:   'fixed',
    top:        '-99999px',
    left:       '-99999px',
    width:      `${A4_W_PX}px`,
    background: '#ffffff',
    zIndex:     '-1',
    overflow:   'hidden',
    // Disable pointer events so it can't be accidentally clicked
    pointerEvents: 'none',
  });
  document.body.appendChild(wrapper);

  // ── 2. Render the React template into the container ──────────
  //    We use createRoot (React 18). For React 17, use ReactDOM.render.
  const root = createRoot(wrapper);

  await new Promise(resolve => {
    root.render(<TemplateComponent resume={resume} />);
    // Give React one tick to flush, then resolve
    setTimeout(resolve, 0);
  });

  // ── 3. Wait for images & fonts ───────────────────────────────
  await waitForFonts();
  await waitForImages(wrapper);

  // Give browser a final render cycle
  await new Promise(res => setTimeout(res, 200));

  // ── 4. Capture with html2canvas ──────────────────────────────
  const canvas = await html2canvas(wrapper, {
    scale,
    useCORS:          true,   // allows cross-origin images (e.g. Google Photos)
    allowTaint:       false,
    backgroundColor:  '#ffffff',
    logging:          false,
    // Tell html2canvas the element's bounding rect explicitly
    // so it doesn't clip when positioned off-screen
    x:      0,
    y:      0,
    width:  A4_W_PX,
    height: wrapper.scrollHeight,
    windowWidth:  A4_W_PX,
    windowHeight: wrapper.scrollHeight,
  });

  // ── 5. Cleanup React root BEFORE building PDF ────────────────
  root.unmount();
  document.body.removeChild(wrapper);

  // ── 6. Build jsPDF document, slicing canvas into A4 pages ────
  const pdf         = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const totalH_px   = canvas.height;
  const pageH_px    = A4_H_PX * scale;          // height of one A4 page in canvas pixels
  const totalPages  = Math.ceil(totalH_px / pageH_px);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const srcY      = page * pageH_px;
    const srcH      = Math.min(pageH_px, totalH_px - srcY);

    // Slice this page's strip from the full canvas
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width  = canvas.width;
    pageCanvas.height = srcH;

    const ctx = pageCanvas.getContext('2d');
    ctx.drawImage(
      canvas,
      0, srcY,            // source x, y
      canvas.width, srcH, // source width, height
      0, 0,               // dest x, y
      canvas.width, srcH  // dest width, height
    );

    const imgData = pageCanvas.toDataURL(
      imageFormat === 'png' ? 'image/png' : 'image/jpeg',
      jpegQuality
    );

    // Map canvas pixels → mm on the PDF page
    const imgH_mm = (srcH / (canvas.width)) * A4_W_MM;

    pdf.addImage(
      imgData,
      imageFormat === 'png' ? 'PNG' : 'JPEG',
      0,        // x mm
      0,        // y mm
      A4_W_MM,  // width mm
      imgH_mm,  // height mm
      undefined,
      'FAST'    // compression
    );
  }

  // ── 7. Add clickable hyperlinks ──────────────────────────────
  //    jsPDF can't detect text positions from an image, so we
  //    add link rectangles based on known resume data positions.
  //    We overlay transparent clickable areas for common fields.
  addHyperlinks(pdf, resume, scale, A4_W_MM, A4_H_MM, A4_W_PX * scale);

  // ── 8. Save ──────────────────────────────────────────────────
  const safeName = (resume.personal?.name || 'Resume').replace(/\s+/g, '_');
  const suffix   = colorMode === 'bw' ? '_BW' : '_Color';
  pdf.save(`${safeName}_CV${suffix}.pdf`);
}

// ─────────────────────────────────────────────────────────────
//  HYPERLINK OVERLAY
//  Adds transparent clickable rectangles over contact info.
//  These are approximate — tweak Y positions per template if needed.
// ─────────────────────────────────────────────────────────────
function addHyperlinks(pdf, resume, scale, pageW, pageH, canvasW) {
  const p = resume.personal || {};
  const template = resume.template || 'minimal';

  // Helper: add a full-width link strip at a given Y (mm), height 5mm
  function addLink(url, yMm, heightMm = 5) {
    const href = toHref(url);
    if (!href) return;
    pdf.link(0, yMm, pageW, heightMm, { url: href });
  }

  // Different templates have different header heights — approximate positions
  const headerOffsets = {
    minimal:   { email: 28, phone: 32, linkedin: 36, github: 40 },
    corporate: { email: 26, phone: 30, linkedin: 34, github: 34 },
    creative:  { email: 30, phone: 34, linkedin: 30, github: 30 },
    tech:      { email: 28, phone: 32, linkedin: 32, github: 36 },
    purple:    { email: 55, phone: 65, linkedin: 75, github: 85 },
    slate:     { email: 28, phone: 32, linkedin: 36, github: 36 },
    marine:    { email: 55, phone: 62, linkedin: 70, github: 78 },
    crimson:   { email: 26, phone: 26, linkedin: 26, github: 26 },
    forest:    { email: 26, phone: 26, linkedin: 30, github: 34 },
    navya:     { email: 24, phone: 24, linkedin: 24, github: 24 },
  };

  const off = headerOffsets[template] || headerOffsets.minimal;

  if (p.email)    addLink(p.email,    off.email,   4);
  if (p.phone)    addLink(p.phone,    off.phone,   4);
  if (p.linkedin) addLink(p.linkedin, off.linkedin, 4);
  if (p.github)   addLink(p.github,   off.github,  4);
  if (p.website)  addLink(p.website,  off.github + 5, 4);

  // Add links for projects
  const projects = resume.projects || [];
  projects.forEach(proj => {
    if (proj.link) addLink(proj.link, 150, 4); // approximate
  });
}

// ─────────────────────────────────────────────────────────────
//  CONVENIENCE: Quick export from a live DOM ref
//  (alternative approach: if you already have the rendered
//   template mounted in the editor, pass its DOM node directly)
// ─────────────────────────────────────────────────────────────

/**
 * Export a PDF directly from an existing DOM element.
 * Use this if your editor already has the template mounted:
 *
 *   const previewRef = useRef();
 *   // <div ref={previewRef}><TemplateComponent resume={resume} /></div>
 *   exportFromElement(previewRef.current, resume.personal?.name);
 *
 * @param {HTMLElement} element
 * @param {string}      filename
 * @param {Object}      [options]
 */
export async function exportFromElement(element, filename = 'Resume', options = {}) {
  const {
    scale       = 3,
    imageFormat = 'jpeg',
    jpegQuality = 0.95,
  } = options;

  if (!element) throw new Error('exportFromElement: element is null');

  await waitForFonts();
  await waitForImages(element);
  await new Promise(res => setTimeout(res, 100));

  const canvas = await html2canvas(element, {
    scale,
    useCORS:         true,
    allowTaint:      false,
    backgroundColor: '#ffffff',
    logging:         false,
    width:           element.scrollWidth,
    height:          element.scrollHeight,
  });

  const pdf        = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const totalH_px  = canvas.height;
  const pageH_px   = A4_H_PX * scale;
  const totalPages = Math.ceil(totalH_px / pageH_px);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const srcY  = page * pageH_px;
    const srcH  = Math.min(pageH_px, totalH_px - srcY);

    const pc  = document.createElement('canvas');
    pc.width  = canvas.width;
    pc.height = srcH;
    pc.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

    const imgData  = pc.toDataURL(imageFormat === 'png' ? 'image/png' : 'image/jpeg', jpegQuality);
    const imgH_mm  = (srcH / canvas.width) * A4_W_MM;

    pdf.addImage(imgData, imageFormat === 'png' ? 'PNG' : 'JPEG', 0, 0, A4_W_MM, imgH_mm, undefined, 'FAST');
  }

  pdf.save(`${filename.replace(/\s+/g, '_')}_CV.pdf`);
}