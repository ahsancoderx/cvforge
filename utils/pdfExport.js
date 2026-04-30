// utils/pdfExport.js
// Uses jsPDF direct drawing API — NO browser print dialog
// Produces a real PDF with:
//   ✅ Full colors (never overridden by browser)
//   ✅ Clickable hyperlinks (email, LinkedIn, GitHub, etc.)
//   ✅ Proper A4 sizing
//   ✅ Professional typography
//   ✅ Purple / Purple Classic two-column layout
//
// Install: npm install jspdf
// Usage:   import { exportResumeToPDF } from '../utils/pdfExport'
//          exportResumeToPDF(resume, 'color')   // or 'bw'

import { jsPDF } from 'jspdf';

/* ═══════════════════════════════════════════════════════════
   COLOUR HELPERS
═══════════════════════════════════════════════════════════ */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function getAccent(template, customTheme, isColor) {
  if (!isColor) return '#333333';
  if (customTheme) return customTheme;
  const map = {
    minimal:   '#6c63ff',
    corporate: '#6c63ff',
    creative:  '#f59e0b',
    tech:      '#059669',
    purple:    '#4a1942',
    purple2:   '#4a1942',
  };
  return map[template] || '#6c63ff';
}

/* ═══════════════════════════════════════════════════════════
   URL NORMALISER  – turns any input into a full URL
═══════════════════════════════════════════════════════════ */
function normaliseUrl(raw) {
  if (!raw || !raw.trim()) return null;
  const v = raw.trim();
  if (v.startsWith('mailto:') || v.startsWith('tel:')) return v;
  if (v.includes('@') && !v.includes(' ')) return 'mailto:' + v;
  if (/^\+?[\d\s\-().]+$/.test(v))          return 'tel:' + v.replace(/\s/g, '');
  if (v.startsWith('http'))                  return v;
  return 'https://' + v;
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT FUNCTION
═══════════════════════════════════════════════════════════ */
export async function exportResumeToPDF(resume, colorMode = 'color') {
  const isColor = colorMode === 'color';
  const t       = resume.template  || 'minimal';
  const p       = resume.personal  || {};
  const vis     = resume.sections  || {};
  const accent  = getAccent(t, resume.colorTheme, isColor);
  const acRgb   = hexToRgb(accent);

  // ── Page setup ──────────────────────────────────────────
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW  = 210;
  const PH  = 297;
  const ML  = 20;
  const MR  = 20;
  const CW  = PW - ML - MR;
  let   y   = 0;

  // ── Font sizes ───────────────────────────────────────────
  const FS = {
    name:    22,
    title:   11,
    contact: 9,
    secHead: 8,
    body:    9.5,
    small:   8.5,
  };
  const LH = { name: 8, title: 5, contact: 5, secHead: 4, body: 5, small: 4.5 };

  /* ── colour shortcuts ─────────────────────────────────── */
  function setAccent()     { doc.setTextColor(acRgb.r, acRgb.g, acRgb.b); }
  function setDark()       { doc.setTextColor(17, 24, 39); }
  function setGray()       { doc.setTextColor(107, 114, 128); }
  function setLightGray()  { doc.setTextColor(156, 163, 175); }
  function setWhite()      { doc.setTextColor(255, 255, 255); }
  function setBlack()      { doc.setTextColor(0, 0, 0); }
  function setBW()         { doc.setTextColor(50, 50, 50); }

  /* ── draw a horizontal rule ───────────────────────────── */
  function hRule(yPos, r, g, b, thickness = 0.3) {
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(thickness);
    doc.line(ML, yPos, PW - MR, yPos);
  }

  /* ── add clickable link annotation ───────────────────── */
  function addLink(url, lx, ly, lw, lh) {
    const full = normaliseUrl(url);
    if (!full) return;
    doc.link(lx, ly - lh + 1, lw, lh + 1, { url: full });
  }

  /* ── text + optional link in one call ────────────────── */
  function drawLinked(text, lx, ly, url, opts = {}) {
    doc.text(text, lx, ly, opts);
    if (url) {
      const w = doc.getTextWidth(text);
      addLink(url, lx, ly, w, FS.contact / 3.5);
    }
  }

  /* ── section heading ──────────────────────────────────── */
  function sectionHeading(label, yPos) {
    doc.setFontSize(FS.secHead);
    doc.setFont('helvetica', 'bold');
    const upperLabel = label.toUpperCase();

    if (t === 'tech') {
      doc.setFillColor(acRgb.r, acRgb.g, acRgb.b);
      doc.rect(ML, yPos - 3, 1.5, 4.5, 'F');
      isColor ? setAccent() : setBW();
      doc.text('// ' + label.toLowerCase(), ML + 4, yPos);
    } else if (t === 'creative') {
      isColor ? setDark() : setBlack();
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(label, ML, yPos);
      if (isColor) {
        doc.setDrawColor(acRgb.r, acRgb.g, acRgb.b);
      } else {
        doc.setDrawColor(150, 150, 150);
      }
      doc.setLineWidth(0.8);
      const tw = doc.getTextWidth(label);
      doc.line(ML + tw + 4, yPos - 1, PW - MR, yPos - 1);
      doc.setFontSize(FS.secHead);
      doc.setFont('helvetica', 'bold');
    } else {
      isColor ? setAccent() : setBW();
      doc.text(upperLabel, ML, yPos);
      hRule(yPos + 1.5, isColor ? acRgb.r : 180, isColor ? acRgb.g : 180, isColor ? acRgb.b : 180, 0.25);
    }

    return yPos + 6;
  }

  /* ── experience / education block ────────────────────── */
  function drawExpBlock(role, company, date, desc, yPos, companyUrl) {
    const descLines = doc.splitTextToSize(desc || '', CW);
    const blockH    = 6 + 4.5 + (descLines.length * 4.5) + 4;

    if (yPos + blockH > PH - 15) { doc.addPage(); yPos = 18; }

    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'bold');
    isColor ? setDark() : setBlack();
    doc.text(role || '', ML, yPos);

    doc.setFont('helvetica', 'normal');
    setLightGray();
    const roleW = doc.getTextWidth(role || '') + 2;
    doc.text('—', ML + roleW, yPos);

    const dashW  = doc.getTextWidth('—') + 2;
    const compX  = ML + roleW + dashW;
    doc.setFont('helvetica', 'normal');
    isColor ? setAccent() : setBW();
    doc.text(company || '', compX, yPos);
    if (companyUrl) addLink(companyUrl, compX, yPos, doc.getTextWidth(company || ''), 3.5);

    doc.setFontSize(FS.small);
    setLightGray();
    doc.text(date || '', PW - MR, yPos, { align: 'right' });

    yPos += 4.5;

    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'normal');
    isColor ? setGray() : setBW();
    doc.text(descLines, ML, yPos);
    yPos += descLines.length * 4.5 + 5;

    return yPos;
  }

  /* ── skill pill ──────────────────────────────────────── */
  function drawSkillPills(skills, yStart) {
    let sx = ML;
    let sy = yStart;
    const pillH   = 5.5;
    const padX    = 3;
    const padY    = 1.2;
    const gap     = 2.5;
    const maxX    = PW - MR;

    skills.forEach((skill) => {
      doc.setFontSize(FS.small);
      doc.setFont('helvetica', 'normal');
      const tw = doc.getTextWidth(skill);
      const pw = tw + padX * 2;

      if (sx + pw > maxX) { sx = ML; sy += pillH + gap; }
      if (sy + pillH > PH - 15) { doc.addPage(); sy = 18; sx = ML; }

      if (isColor) {
        doc.setFillColor(acRgb.r, acRgb.g, acRgb.b);
        doc.setGState(doc.GState({ opacity: 0.12 }));
        doc.roundedRect(sx, sy - pillH + padY, pw, pillH, 1.5, 1.5, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setDrawColor(acRgb.r, acRgb.g, acRgb.b);
        doc.setLineWidth(0.2);
        doc.roundedRect(sx, sy - pillH + padY, pw, pillH, 1.5, 1.5, 'S');
        setAccent();
      } else {
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(sx, sy - pillH + padY, pw, pillH, 1.5, 1.5, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.roundedRect(sx, sy - pillH + padY, pw, pillH, 1.5, 1.5, 'S');
        setBW();
      }

      doc.text(skill, sx + padX, sy);
      sx += pw + gap;
    });

    return sy + pillH + 3;
  }

  /* ── language badges ─────────────────────────────────── */
  function drawLanguages(langs, yPos) {
    let lx = ML;
    langs.forEach((lang) => {
      doc.setFontSize(FS.body);
      doc.setFont('helvetica', 'bold');
      isColor ? setDark() : setBlack();
      doc.text(lang.name || '', lx, yPos);
      const nameW = doc.getTextWidth(lang.name || '');
      lx += nameW + 2;

      doc.setFontSize(FS.small - 0.5);
      doc.setFont('helvetica', 'normal');
      const lw = doc.getTextWidth(lang.level || '') + 6;
      if (isColor) {
        doc.setFillColor(acRgb.r, acRgb.g, acRgb.b);
        doc.setGState(doc.GState({ opacity: 0.12 }));
        doc.roundedRect(lx, yPos - 3.5, lw, 5, 2.5, 2.5, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        setAccent();
      } else {
        doc.setFillColor(235, 235, 235);
        doc.roundedRect(lx, yPos - 3.5, lw, 5, 2.5, 2.5, 'F');
        setBW();
      }
      doc.text(lang.level || '', lx + 3, yPos);
      lx += lw + 8;
    });
    return yPos + 7;
  }

  /* ════════════════════════════════════════════════════════
     ROUTE TO CORRECT BUILDER
  ════════════════════════════════════════════════════════ */
  const helpers = {
    PW, PH, ML, MR, CW, FS, LH,
    setAccent, setDark, setGray, setLightGray, setWhite, setBW, setBlack,
    hRule, addLink, drawLinked, sectionHeading, drawExpBlock, drawSkillPills, drawLanguages,
  };

  if (t === 'purple' || t === 'purple2') {
    await buildPurpleLayout(doc, resume, p, vis, accent, acRgb, isColor, helpers);
  } else if (t === 'corporate' && isColor) {
    await buildCorporate(doc, resume, p, vis, accent, acRgb, isColor, helpers);
  } else {
    y = await buildStandardLayout(doc, resume, p, vis, accent, acRgb, isColor, t, helpers);
  }

  // ── Save ────────────────────────────────────────────────
  const name    = (p.name || 'Resume').replace(/\s+/g, '_');
  const suffix  = colorMode === 'bw' ? '_BW' : '_Color';
  doc.save(`${name}_CV${suffix}.pdf`);
}

/* ═══════════════════════════════════════════════════════════
   PURPLE / PURPLE CLASSIC TWO-COLUMN LAYOUT
═══════════════════════════════════════════════════════════ */
async function buildPurpleLayout(doc, resume, p, vis, accent, acRgb, isColor, h) {
  const { PW, PH, ML, MR, FS, addLink } = h;

  const aR = acRgb.r; // 74
  const aG = acRgb.g; // 25
  const aB = acRgb.b; // 66

  // ── Layout constants ─────────────────────────────────────
  const PHOTO_W  = 40;          // white photo column width
  const HDR_H    = 38;          // header height
  const SIDE_W   = 58;          // sidebar width (after photo col)
  const SIDE_X   = 5;           // sidebar left padding
  const SIDE_MAX = PHOTO_W + SIDE_W - 5; // sidebar right edge
  const CONTENT_W = SIDE_MAX;   // usable width inside sidebar
  const MAIN_X   = PHOTO_W + SIDE_W + 4; // main column X
  const MAIN_W   = PW - MAIN_X - MR;    // main column width

  // ══════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════

  // White section (photo side)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PHOTO_W, HDR_H, 'F');

  // Purple bar (name side)
  if (isColor) {
    doc.setFillColor(aR, aG, aB);
  } else {
    doc.setFillColor(60, 60, 60);
  }
  doc.rect(PHOTO_W, 0, PW - PHOTO_W, HDR_H, 'F');

  // ── Photo circle ─────────────────────────────────────────
  const cx = PHOTO_W / 2;
  const cy = HDR_H / 2;
  const cr = 13;

  // Circle border
  if (isColor) {
    doc.setDrawColor(aR, aG, aB);
  } else {
    doc.setDrawColor(80, 80, 80);
  }
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, cr, 'S');

  // Placeholder person icon (head + body)
  if (isColor) {
    doc.setFillColor(aR, aG, aB);
  } else {
    doc.setFillColor(120, 120, 120);
  }
  doc.circle(cx, cy - 3, 4, 'F');
  doc.ellipse(cx, cy + 5, 6.5, 4.5, 'F');

  // ── Name & Title in purple header ────────────────────────
  const nameX = PHOTO_W + 8;
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(p.name || 'Your Name', nameX, HDR_H / 2 - 2);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(isColor ? 220 : 180, isColor ? 200 : 180, isColor ? 215 : 180);
  const titleStr = (p.title || '').toUpperCase();
  doc.text(titleStr, nameX, HDR_H / 2 + 6, { charSpace: 0.8 });

  // ══════════════════════════════════════════════════════════
  // SIDEBAR BACKGROUND
  // ══════════════════════════════════════════════════════════
  if (isColor) {
    doc.setFillColor(247, 240, 246); // lavender tint #f7f0f6
  } else {
    doc.setFillColor(245, 245, 245);
  }
  doc.rect(0, HDR_H, PHOTO_W + SIDE_W, PH - HDR_H, 'F');

  // Sidebar right border
  if (isColor) {
    doc.setDrawColor(226, 208, 222);
  } else {
    doc.setDrawColor(200, 200, 200);
  }
  doc.setLineWidth(0.25);
  doc.line(PHOTO_W + SIDE_W, HDR_H, PHOTO_W + SIDE_W, PH);

  // ══════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════
  let sy = HDR_H + 10; // sidebar Y cursor
  let my = HDR_H + 10; // main Y cursor

  function sideSecTitle(label) {
    if (sy + 10 > PH - 10) return;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    if (isColor) {
      doc.setTextColor(aR, aG, aB);
      doc.setDrawColor(aR, aG, aB);
    } else {
      doc.setTextColor(50, 50, 50);
      doc.setDrawColor(80, 80, 80);
    }
    doc.text(label.toUpperCase(), SIDE_X, sy, { charSpace: 0.5 });
    doc.setLineWidth(0.4);
    doc.line(SIDE_X, sy + 1.5, SIDE_MAX, sy + 1.5);
    sy += 7;
  }

  function mainSecTitle(label) {
    if (my + 10 > PH - 10) { doc.addPage(); my = 18; }
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    if (isColor) {
      doc.setTextColor(aR, aG, aB);
      doc.setDrawColor(aR, aG, aB);
    } else {
      doc.setTextColor(50, 50, 50);
      doc.setDrawColor(80, 80, 80);
    }
    doc.text(label.toUpperCase(), MAIN_X, my, { charSpace: 0.5 });
    doc.setLineWidth(0.4);
    doc.line(MAIN_X, my + 1.5, PW - MR, my + 1.5);
    my += 7;
  }

  function dateBadge(dateStr, rightEdge, yPos) {
    if (!dateStr) return;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const dw  = doc.getTextWidth(dateStr) + 6;
    const bx  = rightEdge - dw;
    if (isColor) {
      doc.setFillColor(aR, aG, aB);
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(160, 160, 160);
      doc.setTextColor(0, 0, 0);
    }
    doc.roundedRect(bx, yPos - 3.5, dw, 5, 2, 2, 'F');
    doc.text(dateStr, bx + 3, yPos);
  }

  function mainEntryBlock(title, sub, date, desc) {
    const descLines  = doc.splitTextToSize(desc || '', MAIN_W - 8);
    const neededH    = 5 + (sub ? 4.5 : 0) + descLines.length * 4.5 + 6;
    if (my + neededH > PH - 15) { doc.addPage(); my = 18; }

    // Left accent bar
    if (isColor) {
      doc.setFillColor(124, 58, 110); // #7c3a6e
    } else {
      doc.setFillColor(150, 150, 150);
    }
    doc.rect(MAIN_X, my - 4, 1.5, neededH - 4, 'F');

    const textX = MAIN_X + 5;

    // Title (bold dark)
    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'bold');
    if (isColor) {
      doc.setTextColor(34, 34, 34);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    // Leave space for date badge on right
    doc.text(title || '', textX, my);

    // Date badge
    dateBadge(date, PW - MR, my);
    my += 4.5;

    // Sub (school / company)
    if (sub) {
      doc.setFontSize(FS.body - 0.5);
      doc.setFont('helvetica', 'normal');
      if (isColor) {
        doc.setTextColor(124, 58, 110); // #7c3a6e
      } else {
        doc.setTextColor(90, 90, 90);
      }
      doc.text(sub, textX, my);
      my += 4.5;
    }

    // Description
    if (descLines.length > 0) {
      doc.setFontSize(FS.body - 0.5);
      doc.setFont('helvetica', 'normal');
      if (isColor) {
        doc.setTextColor(102, 102, 102);
      } else {
        doc.setTextColor(70, 70, 70);
      }
      doc.text(descLines, textX, my);
      my += descLines.length * 4.5;
    }

    my += 6;
  }

  // ══════════════════════════════════════════════════════════
  // SIDEBAR CONTENT
  // ══════════════════════════════════════════════════════════

  // ── Contact ──────────────────────────────────────────────
  if (vis.personal) {
    sideSecTitle('Contact');

    const contactRows = [
      { label: 'Phone',   value: p.phone,    href: p.phone    ? normaliseUrl(p.phone)    : null },
      { label: 'Email',   value: p.email,    href: p.email    ? normaliseUrl(p.email)    : null },
      { label: 'Address', value: p.location, href: null },
      { label: 'Website', value: p.website,  href: p.website  ? normaliseUrl(p.website)  : null },
    ].filter((d) => d.value);

    contactRows.forEach((item) => {
      if (sy + 11 > PH - 10) return;

      // Label (small caps gray)
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(150, 150, 150);
      doc.text(item.label.toUpperCase(), SIDE_X, sy);
      sy += 3.5;

      // Value
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      if (isColor) {
        doc.setTextColor(50, 50, 50);
      } else {
        doc.setTextColor(30, 30, 30);
      }
      const valLines = doc.splitTextToSize(item.value, CONTENT_W);
      doc.text(valLines, SIDE_X, sy);
      if (item.href) {
        addLink(item.href, SIDE_X, sy, doc.getTextWidth(valLines[0]), 3.5);
      }
      sy += valLines.length * 4 + 4;
    });

    sy += 2;
  }

  // ── Skills ───────────────────────────────────────────────
  if (vis.skills && resume.skills?.length) {
    sideSecTitle('Skills');
    resume.skills.forEach((sk) => {
      if (sy + 6 > PH - 10) return;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      // Bullet arrow
      if (isColor) {
        doc.setTextColor(aR, aG, aB);
      } else {
        doc.setTextColor(100, 100, 100);
      }
      doc.text('\u25B8', SIDE_X, sy); // ▸
      // Skill text
      if (isColor) {
        doc.setTextColor(50, 50, 50);
      } else {
        doc.setTextColor(30, 30, 30);
      }
      doc.text(sk, SIDE_X + 5, sy);
      sy += 5.5;
    });
    sy += 3;
  }

  // ── Certifications ───────────────────────────────────────
  if (vis.certifications && resume.certifications?.length) {
    sideSecTitle('Certifications');
    resume.certifications.forEach((c) => {
      if (sy + 14 > PH - 10) return;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      if (isColor) {
        doc.setTextColor(34, 34, 34);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      const nLines = doc.splitTextToSize(c.name || '', CONTENT_W);
      doc.text(nLines, SIDE_X, sy);
      sy += nLines.length * 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      if (c.org)  { doc.text(c.org,  SIDE_X, sy); sy += 4; }
      if (c.date) { doc.text(c.date, SIDE_X, sy); sy += 4; }
      sy += 3;
    });
  }

  // ── Languages ────────────────────────────────────────────
  if (vis.languages && resume.languages?.length) {
    sideSecTitle('Languages');
    resume.languages.forEach((lang) => {
      if (sy + 10 > PH - 10) return;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      if (isColor) {
        doc.setTextColor(34, 34, 34);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      doc.text(lang.name || '', SIDE_X, sy);
      sy += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      if (isColor) {
        doc.setTextColor(aR, aG, aB);
      } else {
        doc.setTextColor(100, 100, 100);
      }
      doc.text(lang.level || '', SIDE_X, sy);
      sy += 6;
    });
  }

  // ══════════════════════════════════════════════════════════
  // MAIN CONTENT
  // ══════════════════════════════════════════════════════════

  // ── Profile / Summary ────────────────────────────────────
  if (vis.summary && resume.summary) {
    mainSecTitle('Profile');
    const sumLines = doc.splitTextToSize(resume.summary, MAIN_W);
    if (my + sumLines.length * 4.5 > PH - 15) { doc.addPage(); my = 18; }
    doc.setFontSize(FS.body - 0.5);
    doc.setFont('helvetica', 'normal');
    if (isColor) {
      doc.setTextColor(102, 102, 102);
    } else {
      doc.setTextColor(60, 60, 60);
    }
    doc.text(sumLines, MAIN_X, my);
    my += sumLines.length * 4.5 + 7;
  }

  // ── Education ────────────────────────────────────────────
  if (vis.education && resume.education?.length) {
    mainSecTitle('Education');
    for (const e of resume.education.filter((e) => e.degree || e.school)) {
      mainEntryBlock(e.degree, e.school, e.date, e.desc);
    }
  }

  // ── Experience ───────────────────────────────────────────
  if (vis.experience && resume.experience?.length) {
    mainSecTitle('Experience');
    for (const e of resume.experience.filter((e) => e.role || e.company)) {
      mainEntryBlock(e.role, e.company, e.date, e.desc);
    }
  }

  // ── Projects ─────────────────────────────────────────────
  if (vis.projects && resume.projects?.length) {
    mainSecTitle('Projects');
    for (const proj of resume.projects.filter((pr) => pr.name)) {
      const descLines = doc.splitTextToSize(proj.desc || '', MAIN_W - 8);
      const neededH   = 5 + (proj.link ? 4.5 : 0) + descLines.length * 4.5 + 6;
      if (my + neededH > PH - 15) { doc.addPage(); my = 18; }

      // Left accent bar
      if (isColor) {
        doc.setFillColor(124, 58, 110);
      } else {
        doc.setFillColor(150, 150, 150);
      }
      doc.rect(MAIN_X, my - 4, 1.5, neededH - 4, 'F');

      const textX = MAIN_X + 5;

      // Project name
      doc.setFontSize(FS.body);
      doc.setFont('helvetica', 'bold');
      if (isColor) {
        doc.setTextColor(34, 34, 34);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      doc.text(proj.name, textX, my);
      if (proj.link) addLink(proj.link, textX, my, doc.getTextWidth(proj.name), 3.5);
      my += 4.5;

      // Link URL
      if (proj.link) {
        doc.setFontSize(FS.body - 1);
        doc.setFont('helvetica', 'normal');
        if (isColor) {
          doc.setTextColor(aR, aG, aB);
        } else {
          doc.setTextColor(80, 80, 80);
        }
        const linkLabel = proj.link.replace(/^https?:\/\//, '');
        doc.text(linkLabel, textX, my);
        addLink(proj.link, textX, my, doc.getTextWidth(linkLabel), 3.5);
        my += 4.5;
      }

      // Description
      if (descLines.length > 0) {
        doc.setFontSize(FS.body - 0.5);
        doc.setFont('helvetica', 'normal');
        if (isColor) {
          doc.setTextColor(102, 102, 102);
        } else {
          doc.setTextColor(70, 70, 70);
        }
        doc.text(descLines, textX, my);
        my += descLines.length * 4.5;
      }

      my += 6;
    }
  }

  // ── Social links (shown at bottom of sidebar if present) ─
  if (vis.social && resume.social) {
    const s = resume.social;
    const socialRows = [
      { label: 'LinkedIn',  value: s.linkedin,  href: s.linkedin  },
      { label: 'GitHub',    value: s.github,    href: s.github    },
      { label: 'Twitter',   value: s.twitter,   href: s.twitter   },
      { label: 'Portfolio', value: s.portfolio, href: s.portfolio },
    ].filter((d) => d.value);

    if (socialRows.length > 0 && sy < PH - 30) {
      sideSecTitle('Social');
      socialRows.forEach((item) => {
        if (sy + 7 > PH - 10) return;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        if (isColor) {
          doc.setTextColor(aR, aG, aB);
        } else {
          doc.setTextColor(60, 60, 60);
        }
        doc.text(item.label, SIDE_X, sy);
        addLink(item.href, SIDE_X, sy, doc.getTextWidth(item.label), 3.5);
        sy += 5.5;
      });
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   STANDARD LAYOUT  (Minimal / Creative / Tech)
═══════════════════════════════════════════════════════════ */
async function buildStandardLayout(doc, resume, p, vis, accent, acRgb, isColor, t, h) {
  const { PW, PH, ML, MR, CW, FS, LH,
    setAccent, setDark, setGray, setLightGray, setWhite, setBW, setBlack,
    hRule, addLink, drawLinked, sectionHeading, drawExpBlock, drawSkillPills, drawLanguages } = h;

  let y = 0;

  /* ── HEADER ─────────────────────────────────────────── */
  if (vis.personal) {
    if (t === 'minimal') {
      y = 18;
      doc.setFontSize(FS.name);
      doc.setFont('times', 'bold');
      isColor ? setDark() : setBlack();
      doc.text(p.name || 'Your Name', ML, y);
      y += LH.name;

      doc.setFontSize(FS.title);
      doc.setFont('helvetica', 'normal');
      isColor ? setAccent() : setBW();
      doc.text(p.title || '', ML, y);
      y += LH.title + 2;

      doc.setFontSize(FS.contact);
      const contactItems = buildContactItems(p, isColor, accent, acRgb, doc);
      let cx = ML;
      contactItems.forEach((item, i) => {
        if (cx + item.w > PW - MR - 2) { cx = ML; y += 4.5; }
        if (item.url) {
          isColor ? setAccent() : setBW();
        } else {
          isColor ? setLightGray() : setBW();
        }
        doc.text(item.label, cx, y);
        if (item.url) addLink(item.url, cx, y, item.w, 3.5);
        cx += item.w;
        if (i < contactItems.length - 1) {
          doc.setTextColor(180, 180, 180);
          doc.text(' · ', cx, y);
          cx += doc.getTextWidth(' · ');
        }
      });
      y += 5;

      if (isColor) {
        doc.setDrawColor(acRgb.r, acRgb.g, acRgb.b);
        doc.setLineWidth(0.7);
      } else {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
      }
      doc.line(ML, y, PW - MR, y);
      y += 7;

    } else if (t === 'creative') {
      const hdrH = 38;
      if (isColor) {
        const steps = 40;
        for (let i = 0; i < steps; i++) {
          const ratio = i / steps;
          const r = Math.round(245 + (239 - 245) * ratio);
          const g = Math.round(158 + (68  - 158) * ratio);
          const b = Math.round(11  + (68  - 11)  * ratio);
          doc.setFillColor(r, g, b);
          doc.rect(ML + (CW / steps) * i, 0, CW / steps + 0.5, hdrH, 'F');
        }
        doc.setFillColor(245, 158, 11);
        doc.rect(0, 0, ML, hdrH, 'F');
        doc.setFillColor(239, 68, 68);
        doc.rect(PW - MR, 0, MR, hdrH, 'F');
      } else {
        doc.setFillColor(50, 50, 50);
        doc.rect(0, 0, PW, hdrH, 'F');
      }

      y = 13;
      doc.setFontSize(FS.name);
      doc.setFont('times', 'bold');
      setWhite();
      doc.text(p.name || 'Your Name', ML, y);
      y += LH.name - 1;

      doc.setFontSize(FS.title);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255, 0.85);
      doc.text(p.title || '', ML, y);
      y += LH.title + 1.5;

      doc.setFontSize(FS.contact);
      const cItems = buildContactItems(p, false, '#ffffff', { r: 255, g: 255, b: 255 }, doc);
      let cx = ML;
      cItems.forEach((item, i) => {
        doc.setTextColor(255, 255, 255);
        doc.text(item.label, cx, y);
        if (item.url) addLink(item.url, cx, y, item.w, 3.5);
        cx += item.w;
        if (i < cItems.length - 1) {
          doc.setTextColor(255, 200, 150);
          doc.text(' · ', cx, y);
          cx += doc.getTextWidth(' · ');
        }
      });
      y = hdrH + 8;

    } else if (t === 'tech') {
      y = 16;
      doc.setFontSize(FS.name + 2);
      doc.setFont('courier', 'bold');
      isColor ? setDark() : setBlack();
      doc.text(p.name || 'Your Name', ML, y);
      y += LH.name;

      doc.setFontSize(FS.title);
      doc.setFont('courier', 'normal');
      isColor ? setAccent() : setBW();
      doc.text(`< ${p.title || ''} />`, ML, y);
      y += LH.title + 2;

      doc.setFontSize(FS.contact);
      const cItems = buildContactItems(p, isColor, accent, acRgb, doc);
      let cx = ML;
      cItems.forEach((item, i) => {
        isColor ? (item.url ? setAccent() : setLightGray()) : setBW();
        doc.text(item.label, cx, y);
        if (item.url) addLink(item.url, cx, y, item.w, 3.5);
        cx += item.w;
        if (i < cItems.length - 1) {
          doc.setTextColor(180, 180, 180);
          doc.text(' · ', cx, y);
          cx += doc.getTextWidth(' · ');
        }
      });
      y += 5;
      hRule(y, 200, 200, 200, 0.25);
      y += 7;
    }
  }

  /* ── BODY SECTIONS ──────────────────────────────────── */

  if (vis.summary && resume.summary) {
    y = sectionHeading('Summary', y);
    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'normal');
    isColor ? setGray() : setBW();
    const lines = doc.splitTextToSize(resume.summary, CW);
    if (y + lines.length * 4.5 > PH - 15) { doc.addPage(); y = 18; }
    doc.text(lines, ML, y);
    y += lines.length * 4.5 + 6;
  }

  if (vis.experience && resume.experience?.length) {
    y = sectionHeading('Experience', y);
    for (const e of resume.experience) {
      y = drawExpBlock(e.role, e.company, e.date, e.desc, y, null);
    }
  }

  if (vis.education && resume.education?.length) {
    y = sectionHeading('Education', y);
    for (const e of resume.education) {
      y = drawExpBlock(e.degree, e.school, e.date, e.desc, y, null);
    }
  }

  if (vis.skills && resume.skills?.length) {
    y = sectionHeading('Skills', y);
    y = drawSkillPills(resume.skills, y);
    y += 2;
  }

  if (vis.languages && resume.languages?.length) {
    y = sectionHeading('Languages', y);
    y = drawLanguages(resume.languages, y);
  }

  if (vis.projects && resume.projects?.length) {
    y = sectionHeading('Projects', y);
    for (const proj of resume.projects) {
      const projLines = doc.splitTextToSize(proj.desc || '', CW);
      if (y + 14 + projLines.length * 4.5 > PH - 15) { doc.addPage(); y = 18; }

      doc.setFontSize(FS.body);
      doc.setFont('helvetica', 'bold');
      isColor ? setDark() : setBlack();
      doc.text(proj.name || '', ML, y);

      if (proj.link) {
        const nameW = doc.getTextWidth(proj.name || '') + 3;
        doc.setFont('helvetica', 'normal');
        isColor ? setAccent() : setBW();
        const linkLabel = proj.link.replace(/^https?:\/\//, '');
        doc.text('— ' + linkLabel, ML + nameW, y);
        addLink(proj.link, ML + nameW + doc.getTextWidth('— '), y, doc.getTextWidth(linkLabel), 3.5);
      }
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      isColor ? setGray() : setBW();
      doc.text(projLines, ML, y);
      y += projLines.length * 4.5 + 5;
    }
  }

  if (vis.certifications && resume.certifications?.length) {
    y = sectionHeading('Certifications', y);
    for (const c of resume.certifications) {
      if (y + 8 > PH - 15) { doc.addPage(); y = 18; }
      doc.setFontSize(FS.body);
      doc.setFont('helvetica', 'bold');
      isColor ? setDark() : setBlack();
      doc.text(c.name || '', ML, y);

      const nameW = doc.getTextWidth(c.name || '') + 3;
      doc.setFont('helvetica', 'normal');
      isColor ? setAccent() : setBW();
      doc.text('— ' + (c.org || ''), ML + nameW, y);

      setLightGray();
      doc.setFontSize(FS.small);
      doc.text(c.date || '', PW - MR, y, { align: 'right' });
      y += 6;
    }
  }

  return y;
}

/* ═══════════════════════════════════════════════════════════
   CORPORATE TWO-COLUMN LAYOUT
═══════════════════════════════════════════════════════════ */
async function buildCorporate(doc, resume, p, vis, accent, acRgb, isColor, h) {
  const { PW, PH, ML, MR, CW, FS,
    setAccent, setDark, setGray, setLightGray, setWhite,
    hRule, addLink, drawLinked, sectionHeading, drawExpBlock, drawSkillPills, drawLanguages } = h;

  const SIDE_W  = 58;
  const MAIN_W  = CW - SIDE_W - 5;
  const SIDE_X  = PW - MR - SIDE_W;

  // ── Dark header ─────────────────────────────────────────
  const hdrH = 36;
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, PW, hdrH, 'F');

  let y = 13;
  doc.setFontSize(FS.name - 2);
  doc.setFont('helvetica', 'bold');
  setWhite();
  doc.text(p.name || 'Your Name', ML, y);
  y += 7;

  doc.setFontSize(FS.title);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 139, 250);
  doc.text(p.title || '', ML, y);
  y += 5;

  doc.setFontSize(FS.contact);
  const cItems = buildContactItems(p, true, accent, acRgb, doc);
  let cx = ML;
  cItems.forEach((item, i) => {
    doc.setTextColor(196, 181, 253);
    doc.text(item.label, cx, y);
    if (item.url) addLink(item.url, cx, y, item.w, 3.5);
    cx += item.w;
    if (i < cItems.length - 1) {
      doc.setTextColor(120, 100, 180);
      doc.text(' · ', cx, y);
      cx += doc.getTextWidth(' · ');
    }
  });

  // ── Side column background ───────────────────────────────
  doc.setFillColor(248, 247, 255);
  doc.rect(SIDE_X - 4, hdrH, SIDE_W + MR + 4, PH - hdrH, 'F');
  doc.setDrawColor(233, 228, 255);
  doc.setLineWidth(0.25);
  doc.line(SIDE_X - 4, hdrH, SIDE_X - 4, PH);

  // ── Side content ────────────────────────────────────────
  let sy = hdrH + 10;

  function sideHeading(label) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
    doc.text(label.toUpperCase(), SIDE_X, sy);
    sy += 5;
  }

  if (vis.skills && resume.skills?.length) {
    sideHeading('Skills');
    resume.skills.forEach((skill) => {
      if (sy + 6 > PH - 10) return;
      doc.setFillColor(237, 233, 254);
      doc.roundedRect(SIDE_X, sy - 3.5, SIDE_W, 5, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(91, 33, 182);
      doc.text(skill, SIDE_X + 3, sy);
      sy += 6.5;
    });
    sy += 4;
  }

  if (vis.education && resume.education?.length) {
    sideHeading('Education');
    resume.education.forEach((e) => {
      if (sy + 14 > PH - 10) return;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      const dLines = doc.splitTextToSize(e.degree || '', SIDE_W);
      doc.text(dLines, SIDE_X, sy);
      sy += dLines.length * 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
      const sLines = doc.splitTextToSize(e.school || '', SIDE_W);
      doc.text(sLines, SIDE_X, sy);
      sy += sLines.length * 4;
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(7.5);
      doc.text(e.date || '', SIDE_X, sy);
      sy += 7;
    });
  }

  if (vis.certifications && resume.certifications?.length) {
    sideHeading('Certifications');
    resume.certifications.forEach((c) => {
      if (sy + 12 > PH - 10) return;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      const nLines = doc.splitTextToSize(c.name || '', SIDE_W);
      doc.text(nLines, SIDE_X, sy);
      sy += nLines.length * 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7.5);
      doc.text(`${c.org || ''} · ${c.date || ''}`, SIDE_X, sy);
      sy += 7;
    });
  }

  if (vis.languages && resume.languages?.length) {
    sideHeading('Languages');
    resume.languages.forEach((l) => {
      if (sy + 10 > PH - 10) return;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(l.name || '', SIDE_X, sy);
      sy += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
      doc.setFontSize(7.5);
      doc.text(l.level || '', SIDE_X, sy);
      sy += 6;
    });
  }

  // ── Main column ──────────────────────────────────────────
  let my = hdrH + 10;

  function mainHeading(label) {
    doc.setFontSize(FS.secHead);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
    doc.text(label.toUpperCase(), ML, my);
    doc.setDrawColor(acRgb.r, acRgb.g, acRgb.b);
    doc.setLineWidth(0.2);
    doc.line(ML, my + 1.5, SIDE_X - 8, my + 1.5);
    my += 6;
  }

  function mainExpBlock(role, company, date, desc) {
    const descLines = doc.splitTextToSize(desc || '', MAIN_W);
    if (my + 12 + descLines.length * 4.5 > PH - 15) { doc.addPage(); my = 18; }

    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 46);
    doc.text(role || '', ML, my);

    const rw = doc.getTextWidth(role || '') + 2;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
    doc.text(company || '', ML + rw, my);

    doc.setFontSize(FS.small);
    doc.setTextColor(156, 163, 175);
    doc.text(date || '', SIDE_X - 8, my, { align: 'right' });

    my += 4.5;
    doc.setFontSize(FS.body - 0.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(descLines, ML, my);
    my += descLines.length * 4.5 + 4;

    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.2);
    doc.line(ML, my - 1, SIDE_X - 8, my - 1);
    my += 2;
  }

  if (vis.summary && resume.summary) {
    mainHeading('Professional Summary');
    doc.setFontSize(FS.body);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const sLines = doc.splitTextToSize(resume.summary, MAIN_W);
    doc.text(sLines, ML, my);
    my += sLines.length * 4.5 + 6;
  }

  if (vis.experience && resume.experience?.length) {
    mainHeading('Experience');
    resume.experience.forEach((e) => mainExpBlock(e.role, e.company, e.date, e.desc));
  }

  if (vis.projects && resume.projects?.length) {
    mainHeading('Projects');
    resume.projects.forEach((proj) => {
      const pLines = doc.splitTextToSize(proj.desc || '', MAIN_W);
      if (my + 12 + pLines.length * 4.5 > PH - 15) { doc.addPage(); my = 18; }
      doc.setFontSize(FS.body);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(proj.name || '', ML, my);
      if (proj.link) {
        const nw = doc.getTextWidth(proj.name || '') + 3;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(acRgb.r, acRgb.g, acRgb.b);
        const ll = proj.link.replace(/^https?:\/\//, '');
        doc.text(ll, ML + nw, my);
        addLink(proj.link, ML + nw, my, doc.getTextWidth(ll), 3.5);
      }
      my += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(pLines, ML, my);
      my += pLines.length * 4.5 + 5;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   BUILD CONTACT ITEMS ARRAY
═══════════════════════════════════════════════════════════ */
function buildContactItems(p, isColor, accent, acRgb, doc) {
  const items = [];

  function add(label, url) {
    if (!label) return;
    doc.setFontSize(9);
    items.push({ label, w: doc.getTextWidth(label), url: url || null });
  }

  add(p.email,    normaliseUrl(p.email));
  add(p.phone,    normaliseUrl(p.phone));
  if (p.location) add(p.location, null);
  if (p.linkedin) add('LinkedIn', normaliseUrl(p.linkedin));
  if (p.github)   add('GitHub',   normaliseUrl(p.github));
  if (p.portfolio)add('Portfolio',normaliseUrl(p.portfolio));
  if (p.twitter)  add(p.twitter,  normaliseUrl(p.twitter));

  return items;
}

export { normaliseUrl };