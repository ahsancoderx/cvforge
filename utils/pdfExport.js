// utils/pdfExport.js
// Complete PDF export for all 9 CV templates
// Install: npm install jspdf
// Usage: import { exportResumeToPDF } from '../utils/pdfExport'
//        exportResumeToPDF(resume, 'color')  // or 'bw'

import { jsPDF } from 'jspdf';

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return { r: parseInt(c.slice(0,2),16), g: parseInt(c.slice(2,4),16), b: parseInt(c.slice(4,6),16) };
}

function normaliseUrl(raw) {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  if (v.startsWith('mailto:') || v.startsWith('tel:')) return v;
  if (v.includes('@') && !v.includes(' ')) return 'mailto:' + v;
  if (/^\+?[\d\s\-().]+$/.test(v)) return 'tel:' + v.replace(/\s/g,'');
  if (v.startsWith('http')) return v;
  return 'https://' + v;
}

const ACCENT_MAP = {
  minimal:   '#6c63ff',
  corporate: '#1e3a5f',
  creative:  '#f59e0b',
  tech:      '#059669',
  purple:    '#4a1942',
  slate:     '#475569',
  marine:    '#0369a1',
  crimson:   '#9f1239',
  forest:    '#166534',
};

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export async function exportResumeToPDF(resume, colorMode = 'color') {
  const isColor = colorMode === 'color';
  const t       = resume.template || 'minimal';
  const p       = resume.personal || {};
  const vis     = resume.sections || {};
  const accent  = isColor ? (resume.colorTheme || ACCENT_MAP[t] || '#6c63ff') : '#333333';
  const acRgb   = hexToRgb(accent);

  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const PW=210, PH=297, ML=20, MR=20, CW=PW-ML-MR;

  const FS = { name:22, title:11, contact:9, secHead:8, body:9.5, small:8.5 };

  // colour helpers
  const rgb  = (r,g,b) => doc.setTextColor(r,g,b);
  const fill = (r,g,b) => doc.setFillColor(r,g,b);
  const drw  = (r,g,b) => doc.setDrawColor(r,g,b);
  const setA = () => rgb(acRgb.r, acRgb.g, acRgb.b);
  const setD = () => rgb(17,24,39);
  const setG = () => rgb(107,114,128);
  const setLG= () => rgb(156,163,175);
  const setW = () => rgb(255,255,255);
  const setBW= () => rgb(50,50,50);

  function hRule(y, r,g,b, lw=0.3) {
    drw(r,g,b); doc.setLineWidth(lw);
    doc.line(ML, y, PW-MR, y);
  }

  function addLink(url, lx, ly, lw, lh) {
    const full = normaliseUrl(url);
    if (full) doc.link(lx, ly-lh+1, lw, lh+1, { url: full });
  }

  // Section heading (standard layout)
  function secHead(label, y) {
    doc.setFontSize(FS.secHead);
    doc.setFont('helvetica','bold');
    if (t === 'tech') {
      fill(acRgb.r, acRgb.g, acRgb.b);
      doc.rect(ML, y-3, 1.5, 4.5, 'F');
      isColor ? setA() : setBW();
      doc.text('// '+label.toLowerCase(), ML+4, y);
    } else if (t === 'crimson') {
      isColor ? rgb(159,18,57) : setBW();
      doc.text(label.toUpperCase(), ML, y, { charSpace:0.5 });
      drw(isColor?254:180, isColor?205:180, isColor?211:180);
      doc.setLineWidth(0.25);
      doc.line(ML, y+1.5, PW-MR, y+1.5);
    } else if (t === 'creative') {
      setD();
      doc.setFontSize(11); doc.setFont('times','bold');
      doc.text(label, ML, y);
      const tw = doc.getTextWidth(label);
      isColor ? drw(acRgb.r,acRgb.g,acRgb.b) : drw(150,150,150);
      doc.setLineWidth(0.8);
      doc.line(ML+tw+4, y-1, PW-MR, y-1);
      doc.setFontSize(FS.secHead); doc.setFont('helvetica','bold');
    } else {
      isColor ? setA() : setBW();
      doc.text(label.toUpperCase(), ML, y, { charSpace:0.5 });
      drw(isColor?acRgb.r:180, isColor?acRgb.g:180, isColor?acRgb.b:180);
      doc.setLineWidth(0.25);
      doc.line(ML, y+1.5, PW-MR, y+1.5);
    }
    return y+6;
  }

  // Experience/Education block (standard)
  function expBlock(role, company, date, desc, y) {
    const lines = doc.splitTextToSize(desc||'', CW);
    const need  = 6+4.5+lines.length*4.5+4;
    if (y+need > PH-15) { doc.addPage(); y=18; }
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? setD() : setBW();
    doc.text(role||'', ML, y);
    const rw = doc.getTextWidth(role||'')+2;
    doc.setFont('helvetica','normal'); setLG();
    doc.text('—', ML+rw, y);
    const dw = doc.getTextWidth('—')+2;
    isColor ? setA() : setBW();
    doc.text(company||'', ML+rw+dw, y);
    doc.setFontSize(FS.small); setLG();
    doc.text(date||'', PW-MR, y, { align:'right' });
    y+=4.5;
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
    isColor ? setG() : setBW();
    doc.text(lines, ML, y);
    return y + lines.length*4.5 + 5;
  }

  // Skill pills (standard)
  function skillPills(skills, y) {
    let sx=ML, sy=y;
    const pH=5.5, pX=3, gap=2.5;
    skills.forEach(sk => {
      doc.setFontSize(FS.small); doc.setFont('helvetica','normal');
      const tw = doc.getTextWidth(sk);
      const pw = tw+pX*2;
      if (sx+pw > PW-MR) { sx=ML; sy+=pH+gap; }
      if (sy+pH > PH-15) { doc.addPage(); sy=18; sx=ML; }
      if (isColor) {
        fill(acRgb.r,acRgb.g,acRgb.b);
        doc.setGState(doc.GState({opacity:0.12}));
        doc.roundedRect(sx, sy-pH+pX, pw, pH, 1.5,1.5,'F');
        doc.setGState(doc.GState({opacity:1}));
        drw(acRgb.r,acRgb.g,acRgb.b); doc.setLineWidth(0.2);
        doc.roundedRect(sx, sy-pH+pX, pw, pH, 1.5,1.5,'S');
        setA();
      } else {
        fill(240,240,240);
        doc.roundedRect(sx, sy-pH+pX, pw, pH, 1.5,1.5,'F');
        drw(200,200,200); doc.setLineWidth(0.2);
        doc.roundedRect(sx, sy-pH+pX, pw, pH, 1.5,1.5,'S');
        setBW();
      }
      doc.text(sk, sx+pX, sy);
      sx += pw+gap;
    });
    return sy+pH+3;
  }

  // Language badges (standard)
  function langBadges(langs, y) {
    let lx=ML;
    langs.forEach(l => {
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(l.name||'', lx, y);
      const nw = doc.getTextWidth(l.name||'')+2;
      lx+=nw;
      doc.setFontSize(FS.small-0.5); doc.setFont('helvetica','normal');
      const lw = doc.getTextWidth(l.level||'')+6;
      if (isColor) {
        fill(acRgb.r,acRgb.g,acRgb.b);
        doc.setGState(doc.GState({opacity:0.12}));
        doc.roundedRect(lx, y-3.5, lw, 5, 2.5,2.5,'F');
        doc.setGState(doc.GState({opacity:1}));
        setA();
      } else {
        fill(235,235,235); doc.roundedRect(lx, y-3.5, lw, 5, 2.5,2.5,'F'); setBW();
      }
      doc.text(l.level||'', lx+3, y);
      lx += lw+8;
    });
    return y+7;
  }

  /* ══════════════════════════════════════════════
     ROUTE
  ══════════════════════════════════════════════ */
  if (t === 'purple') {
    buildPurple(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink });
  } else if (t === 'corporate') {
    buildCorporate(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink });
  } else if (t === 'slate') {
    buildSlate(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink, secHead, expBlock, skillPills, langBadges });
  } else if (t === 'marine') {
    buildMarine(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink });
  } else if (t === 'crimson') {
    buildCrimson(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink, secHead, expBlock, skillPills, langBadges });
  } else if (t === 'forest') {
    buildForest(doc, resume, p, vis, acRgb, isColor, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink });
  } else {
    buildStandard(doc, resume, p, vis, acRgb, isColor, t, { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink, hRule, secHead, expBlock, skillPills, langBadges });
  }

  const name   = (p.name||'Resume').replace(/\s+/g,'_');
  const suffix = colorMode==='bw' ? '_BW' : '_Color';
  doc.save(`${name}_CV${suffix}.pdf`);
}

/* ═══════════════════════════════════════════════════════════
   1. STANDARD LAYOUT  (minimal / creative / tech)
═══════════════════════════════════════════════════════════ */
function buildStandard(doc, resume, p, vis, acRgb, isColor, t, h) {
  const { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink, hRule, secHead, expBlock, skillPills, langBadges } = h;
  let y = 0;

  function contactRow(items, y) {
    doc.setFontSize(FS.contact);
    let cx=ML;
    items.forEach((item,i) => {
      if (cx+item.w > PW-MR-2) { cx=ML; y+=4.5; }
      if (item.url) { isColor ? setA() : setBW(); } else { isColor ? setLG() : setBW(); }
      doc.text(item.label, cx, y);
      if (item.url) addLink(item.url, cx, y, item.w, 3.5);
      cx+=item.w;
      if (i<items.length-1) {
        doc.setTextColor(180,180,180);
        doc.text(' · ', cx, y);
        cx+=doc.getTextWidth(' · ');
      }
    });
    return y;
  }

  if (vis.personal) {
    if (t==='minimal') {
      y=18;
      doc.setFontSize(FS.name); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(p.name||'', ML, y); y+=8;
      doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
      isColor ? setA() : setBW();
      doc.text(p.title||'', ML, y); y+=7;
      const ci = buildContactItems(p, doc);
      y = contactRow(ci, y); y+=5;
      if (isColor) { drw(acRgb.r,acRgb.g,acRgb.b); doc.setLineWidth(0.7); }
      else { drw(0,0,0); doc.setLineWidth(0.8); }
      doc.line(ML, y, PW-MR, y); y+=7;
    } else if (t==='creative') {
      const hH=38;
      fill(245,158,11); doc.rect(0,0,PW,hH,'F');
      y=13;
      doc.setFontSize(FS.name); doc.setFont('times','bold'); setW();
      doc.text(p.name||'', ML, y); y+=8;
      doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
      doc.setTextColor(255,255,255);
      doc.text(p.title||'', ML, y); y+=5;
      doc.setFontSize(FS.contact);
      const ci = buildContactItems(p, doc);
      let cx=ML;
      ci.forEach((item,i) => {
        doc.setTextColor(255,255,255);
        doc.text(item.label, cx, y);
        if (item.url) addLink(item.url, cx, y, item.w, 3.5);
        cx+=item.w;
        if (i<ci.length-1) { doc.setTextColor(255,200,150); doc.text(' · ',cx,y); cx+=doc.getTextWidth(' · '); }
      });
      y=hH+8;
    } else if (t==='tech') {
      y=16;
      doc.setFontSize(FS.name+2); doc.setFont('courier','bold');
      isColor ? setD() : setBW();
      doc.text(p.name||'', ML, y); y+=8;
      doc.setFontSize(FS.title); doc.setFont('courier','normal');
      isColor ? setA() : setBW();
      doc.text(`< ${p.title||''} />`, ML, y); y+=6;
      const ci = buildContactItems(p, doc);
      y = contactRow(ci, y); y+=5;
      drw(200,200,200); doc.setLineWidth(0.25); doc.line(ML,y,PW-MR,y); y+=7;
    }
  }

  if (vis.summary && resume.summary) {
    y = secHead('Summary', y);
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
    isColor ? setG() : setBW();
    const lines = doc.splitTextToSize(resume.summary, CW);
    if (y+lines.length*4.5>PH-15) { doc.addPage(); y=18; }
    doc.text(lines, ML, y); y+=lines.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    y = secHead('Experience', y);
    for (const e of resume.experience) y=expBlock(e.role,e.company,e.date,e.desc,y);
  }
  if (vis.education && resume.education?.length) {
    y = secHead('Education', y);
    for (const e of resume.education) y=expBlock(e.degree,e.school,e.date,e.desc,y);
  }
  if (vis.skills && resume.skills?.length) {
    y = secHead('Skills', y);
    y = skillPills(resume.skills, y); y+=2;
  }
  if (vis.projects && resume.projects?.length) {
    y = secHead('Projects', y);
    for (const proj of resume.projects) {
      const pLines = doc.splitTextToSize(proj.desc||'', CW);
      if (y+14+pLines.length*4.5>PH-15) { doc.addPage(); y=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(proj.name||'', ML, y);
      if (proj.link) {
        const nw=doc.getTextWidth(proj.name||'')+3;
        doc.setFont('helvetica','normal'); isColor ? setA() : setBW();
        const ll = proj.link.replace(/^https?:\/\//,'');
        doc.text('— '+ll, ML+nw, y);
        addLink(proj.link, ML+nw+doc.getTextWidth('— '), y, doc.getTextWidth(ll), 3.5);
      }
      y+=4.5;
      doc.setFont('helvetica','normal'); isColor ? setG() : setBW();
      doc.text(pLines, ML, y); y+=pLines.length*4.5+5;
    }
  }
  if (vis.certifications && resume.certifications?.length) {
    y = secHead('Certifications', y);
    for (const c of resume.certifications) {
      if (y+8>PH-15) { doc.addPage(); y=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(c.name||'', ML, y);
      const nw=doc.getTextWidth(c.name||'')+3;
      doc.setFont('helvetica','normal'); isColor ? setA() : setBW();
      doc.text('— '+(c.org||''), ML+nw, y);
      setLG(); doc.setFontSize(FS.small);
      doc.text(c.date||'', PW-MR, y, { align:'right' }); y+=6;
    }
  }
  if (vis.languages && resume.languages?.length) {
    y = secHead('Languages', y);
    y = langBadges(resume.languages, y);
  }
}

/* ═══════════════════════════════════════════════════════════
   2. PURPLE (two-column)
═══════════════════════════════════════════════════════════ */
function buildPurple(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const aR=acRgb.r, aG=acRgb.g, aB=acRgb.b;

  const PHOTO_W=40, HDR_H=38, SIDE_W=58;
  const SIDE_X=5, SIDE_MAX=PHOTO_W+SIDE_W-5;
  const MAIN_X=PHOTO_W+SIDE_W+4, MAIN_W=PW-MAIN_X-MR;

  // Header
  fill(255,255,255); doc.rect(0,0,PHOTO_W,HDR_H,'F');
  isColor ? fill(aR,aG,aB) : fill(60,60,60);
  doc.rect(PHOTO_W,0,PW-PHOTO_W,HDR_H,'F');

  // Photo circle
  const cx=PHOTO_W/2, cy=HDR_H/2, cr=13;
  isColor ? drw(aR,aG,aB) : drw(80,80,80);
  doc.setLineWidth(0.8); doc.circle(cx,cy,cr,'S');
  isColor ? fill(aR,aG,aB) : fill(120,120,120);
  doc.circle(cx,cy-3,4,'F'); doc.ellipse(cx,cy+5,6.5,4.5,'F');

  // Name & title
  doc.setFontSize(18); doc.setFont('times','bold'); setW();
  doc.text(p.name||'', PHOTO_W+8, HDR_H/2-2);
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(220,200,215) : doc.setTextColor(180,180,180);
  doc.text((p.title||'').toUpperCase(), PHOTO_W+8, HDR_H/2+6, { charSpace:0.8 });

  // Sidebar bg
  isColor ? fill(247,240,246) : fill(245,245,245);
  doc.rect(0,HDR_H,PHOTO_W+SIDE_W,PH-HDR_H,'F');
  isColor ? drw(226,208,222) : drw(200,200,200);
  doc.setLineWidth(0.25); doc.line(PHOTO_W+SIDE_W,HDR_H,PHOTO_W+SIDE_W,PH);

  let sy=HDR_H+10, my=HDR_H+10;

  function sideTitle(label) {
    if (sy+10>PH-10) return;
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(50,50,50);
    doc.text(label.toUpperCase(), SIDE_X, sy, { charSpace:0.5 });
    isColor ? drw(aR,aG,aB) : drw(80,80,80);
    doc.setLineWidth(0.4); doc.line(SIDE_X, sy+1.5, SIDE_MAX, sy+1.5);
    sy+=7;
  }

  function mainTitle(label) {
    if (my+10>PH-10) { doc.addPage(); my=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(50,50,50);
    doc.text(label.toUpperCase(), MAIN_X, my, { charSpace:0.5 });
    isColor ? drw(aR,aG,aB) : drw(80,80,80);
    doc.setLineWidth(0.4); doc.line(MAIN_X, my+1.5, PW-MR, my+1.5);
    my+=7;
  }

  function dateBadge(dateStr, rightEdge, yPos) {
    if (!dateStr) return;
    doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    const dw=doc.getTextWidth(dateStr)+6;
    isColor ? fill(aR,aG,aB) : fill(160,160,160);
    isColor ? doc.setTextColor(255,255,255) : doc.setTextColor(0,0,0);
    doc.roundedRect(rightEdge-dw, yPos-3.5, dw, 5, 2,2,'F');
    doc.text(dateStr, rightEdge-dw+3, yPos);
  }

  function mainEntry(title, sub, date, desc) {
    const dLines = doc.splitTextToSize(desc||'', MAIN_W-8);
    const need   = 5+(sub?4.5:0)+dLines.length*4.5+6;
    if (my+need>PH-15) { doc.addPage(); my=18; }
    isColor ? fill(124,58,110) : fill(150,150,150);
    doc.rect(MAIN_X, my-4, 1.5, need-4,'F');
    const tx=MAIN_X+5;
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(34,34,34) : doc.setTextColor(0,0,0);
    doc.text(title||'', tx, my);
    dateBadge(date, PW-MR, my); my+=4.5;
    if (sub) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(124,58,110) : doc.setTextColor(90,90,90);
      doc.text(sub, tx, my); my+=4.5;
    }
    if (dLines.length>0) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(102,102,102) : doc.setTextColor(70,70,70);
      doc.text(dLines, tx, my); my+=dLines.length*4.5;
    }
    my+=6;
  }

  // Sidebar: Contact
  if (vis.personal) {
    sideTitle('Contact');
    const rows = [
      { label:'Phone', v:p.phone, href:normaliseUrl(p.phone) },
      { label:'Email', v:p.email, href:normaliseUrl(p.email) },
      { label:'Address', v:p.location, href:null },
      { label:'Website', v:p.website||p.portfolio, href:normaliseUrl(p.website||p.portfolio) },
      { label:'LinkedIn', v:p.linkedin, href:normaliseUrl(p.linkedin) },
      { label:'GitHub',   v:p.github,   href:normaliseUrl(p.github) },
    ].filter(d=>d.v);
    rows.forEach(item => {
      if (sy+11>PH-10) return;
      doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(150,150,150);
      doc.text(item.label.toUpperCase(), SIDE_X, sy); sy+=3.5;
      doc.setFontSize(8); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(50,50,50) : doc.setTextColor(30,30,30);
      const vl = doc.splitTextToSize(item.v, SIDE_MAX-SIDE_X);
      doc.text(vl, SIDE_X, sy);
      if (item.href) addLink(item.href, SIDE_X, sy, doc.getTextWidth(vl[0]), 3.5);
      sy+=vl.length*4+4;
    });
    sy+=2;
  }

  if (vis.skills && resume.skills?.length) {
    sideTitle('Skills');
    resume.skills.forEach(sk => {
      if (sy+6>PH-10) return;
      doc.setFontSize(8.5); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(100,100,100);
      doc.text('\u25B8', SIDE_X, sy);
      isColor ? doc.setTextColor(50,50,50) : doc.setTextColor(30,30,30);
      doc.text(sk, SIDE_X+5, sy); sy+=5.5;
    });
    sy+=3;
  }

  if (vis.certifications && resume.certifications?.length) {
    sideTitle('Certifications');
    resume.certifications.forEach(c => {
      if (sy+14>PH-10) return;
      doc.setFontSize(8.5); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(34,34,34) : doc.setTextColor(0,0,0);
      const nl=doc.splitTextToSize(c.name||'', SIDE_MAX-SIDE_X);
      doc.text(nl, SIDE_X, sy); sy+=nl.length*4;
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(130,130,130);
      if (c.org) { doc.text(c.org, SIDE_X, sy); sy+=4; }
      if (c.date) { doc.text(c.date, SIDE_X, sy); sy+=4; }
      sy+=3;
    });
  }

  if (vis.languages && resume.languages?.length) {
    sideTitle('Languages');
    resume.languages.forEach(l => {
      if (sy+10>PH-10) return;
      doc.setFontSize(8.5); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(34,34,34) : doc.setTextColor(0,0,0);
      doc.text(l.name||'', SIDE_X, sy); sy+=4;
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(100,100,100);
      doc.text(l.level||'', SIDE_X, sy); sy+=6;
    });
  }

  // Main column
  if (vis.summary && resume.summary) {
    mainTitle('Profile');
    const sl=doc.splitTextToSize(resume.summary, MAIN_W);
    if (my+sl.length*4.5>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
    isColor ? doc.setTextColor(102,102,102) : doc.setTextColor(60,60,60);
    doc.text(sl, MAIN_X, my); my+=sl.length*4.5+7;
  }
  if (vis.education && resume.education?.length) {
    mainTitle('Education');
    resume.education.filter(e=>e.degree||e.school).forEach(e=>mainEntry(e.degree,e.school,e.date,e.desc));
  }
  if (vis.experience && resume.experience?.length) {
    mainTitle('Experience');
    resume.experience.filter(e=>e.role||e.company).forEach(e=>mainEntry(e.role,e.company,e.date,e.desc));
  }
  if (vis.projects && resume.projects?.length) {
    mainTitle('Projects');
    resume.projects.filter(pr=>pr.name).forEach(proj => {
      const dl=doc.splitTextToSize(proj.desc||'', MAIN_W-8);
      const need=5+(proj.link?4.5:0)+dl.length*4.5+6;
      if (my+need>PH-15) { doc.addPage(); my=18; }
      isColor ? fill(124,58,110) : fill(150,150,150);
      doc.rect(MAIN_X, my-4, 1.5, need-4,'F');
      const tx=MAIN_X+5;
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(34,34,34) : doc.setTextColor(0,0,0);
      doc.text(proj.name, tx, my); my+=4.5;
      if (proj.link) {
        doc.setFontSize(FS.body-1); doc.setFont('helvetica','normal');
        isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
        const ll=proj.link.replace(/^https?:\/\//,'');
        doc.text(ll, tx, my); addLink(proj.link, tx, my, doc.getTextWidth(ll), 3.5); my+=4.5;
      }
      if (dl.length>0) {
        doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
        isColor ? doc.setTextColor(102,102,102) : doc.setTextColor(70,70,70);
        doc.text(dl, tx, my); my+=dl.length*4.5;
      }
      my+=6;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   3. CORPORATE (two-column sidebar on RIGHT)
═══════════════════════════════════════════════════════════ */
function buildCorporate(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const SIDE_W=58, MAIN_W=CW-SIDE_W-5, SIDE_X=PW-MR-SIDE_W;
  const aR=acRgb.r,aG=acRgb.g,aB=acRgb.b;

  // Header
  const hH=36;
  isColor ? fill(26,26,46) : fill(60,60,60);
  doc.rect(0,0,PW,hH,'F');
  let y=13;
  doc.setFontSize(FS.name-2); doc.setFont('helvetica','bold'); setW();
  doc.text(p.name||'', ML, y); y+=7;
  doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(167,139,250) : doc.setTextColor(200,200,200);
  doc.text(p.title||'', ML, y); y+=5;
  doc.setFontSize(FS.contact);
  const ci=buildContactItems(p,doc);
  let cx=ML;
  ci.forEach((item,i) => {
    isColor ? doc.setTextColor(196,181,253) : doc.setTextColor(200,200,200);
    doc.text(item.label, cx, y);
    if (item.url) addLink(item.url, cx, y, item.w, 3.5);
    cx+=item.w;
    if (i<ci.length-1) { isColor ? doc.setTextColor(120,100,180) : doc.setTextColor(150,150,150); doc.text(' · ',cx,y); cx+=doc.getTextWidth(' · '); }
  });

  // Sidebar bg
  isColor ? fill(248,247,255) : fill(248,248,248);
  doc.rect(SIDE_X-4, hH, SIDE_W+MR+4, PH-hH,'F');
  isColor ? drw(233,228,255) : drw(200,200,200);
  doc.setLineWidth(0.25); doc.line(SIDE_X-4, hH, SIDE_X-4, PH);

  let sy=hH+10;
  function sideHead(label) {
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(50,50,50);
    doc.text(label.toUpperCase(), SIDE_X, sy); sy+=5;
  }

  if (vis.skills && resume.skills?.length) {
    sideHead('Skills');
    resume.skills.forEach(sk => {
      if (sy+6>PH-10) return;
      isColor ? fill(237,233,254) : fill(240,240,240);
      doc.roundedRect(SIDE_X, sy-3.5, SIDE_W, 5, 2,2,'F');
      doc.setFontSize(8); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(91,33,182) : setBW();
      doc.text(sk, SIDE_X+3, sy); sy+=6.5;
    });
    sy+=4;
  }
  if (vis.education && resume.education?.length) {
    sideHead('Education');
    resume.education.forEach(e => {
      if (sy+14>PH-10) return;
      doc.setFontSize(8.5); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(26,26,46) : setBW();
      const dl=doc.splitTextToSize(e.degree||'', SIDE_W);
      doc.text(dl, SIDE_X, sy); sy+=dl.length*4;
      doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
      const sl=doc.splitTextToSize(e.school||'', SIDE_W);
      doc.text(sl, SIDE_X, sy); sy+=sl.length*4;
      doc.setTextColor(156,163,175); doc.setFontSize(7.5);
      doc.text(e.date||'', SIDE_X, sy); sy+=7;
    });
  }
  if (vis.certifications && resume.certifications?.length) {
    sideHead('Certifications');
    resume.certifications.forEach(c => {
      if (sy+12>PH-10) return;
      doc.setFontSize(8); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(26,26,46) : setBW();
      const nl=doc.splitTextToSize(c.name||'', SIDE_W);
      doc.text(nl, SIDE_X, sy); sy+=nl.length*4;
      doc.setFont('helvetica','normal'); doc.setTextColor(107,114,128); doc.setFontSize(7.5);
      doc.text(`${c.org||''} · ${c.date||''}`, SIDE_X, sy); sy+=7;
    });
  }
  if (vis.languages && resume.languages?.length) {
    sideHead('Languages');
    resume.languages.forEach(l => {
      if (sy+10>PH-10) return;
      doc.setFontSize(8.5); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(26,26,46) : setBW();
      doc.text(l.name||'', SIDE_X, sy); sy+=4;
      doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
      doc.setFontSize(7.5); doc.text(l.level||'', SIDE_X, sy); sy+=6;
    });
  }

  // Main column
  let my=hH+10;
  function mainHead(label) {
    doc.setFontSize(FS.secHead); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), ML, my);
    isColor ? drw(aR,aG,aB) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(ML, my+1.5, SIDE_X-8, my+1.5); my+=6;
  }
  function mainExpBlock(role, company, date, desc) {
    const dl=doc.splitTextToSize(desc||'', MAIN_W);
    if (my+12+dl.length*4.5>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(26,26,46) : setBW();
    doc.text(role||'', ML, my);
    const rw=doc.getTextWidth(role||'')+2;
    doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
    doc.text(company||'', ML+rw, my);
    doc.setFontSize(FS.small); doc.setTextColor(156,163,175);
    doc.text(date||'', SIDE_X-8, my, { align:'right' });
    my+=4.5;
    doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal'); doc.setTextColor(75,85,99);
    doc.text(dl, ML, my); my+=dl.length*4.5+4;
    drw(240,240,240); doc.setLineWidth(0.2); doc.line(ML, my-1, SIDE_X-8, my-1); my+=2;
  }

  if (vis.summary && resume.summary) {
    mainHead('Professional Summary');
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal'); doc.setTextColor(75,85,99);
    const sl=doc.splitTextToSize(resume.summary, MAIN_W);
    doc.text(sl, ML, my); my+=sl.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    mainHead('Experience');
    resume.experience.forEach(e=>mainExpBlock(e.role,e.company,e.date,e.desc));
  }
  if (vis.projects && resume.projects?.length) {
    mainHead('Projects');
    resume.projects.forEach(proj => {
      const pl=doc.splitTextToSize(proj.desc||'', MAIN_W);
      if (my+12+pl.length*4.5>PH-15) { doc.addPage(); my=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? doc.setTextColor(26,26,46) : setBW();
      doc.text(proj.name||'', ML, my);
      if (proj.link) {
        const nw=doc.getTextWidth(proj.name||'')+3;
        doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
        const ll=proj.link.replace(/^https?:\/\//,'');
        doc.text(ll, ML+nw, my); addLink(proj.link, ML+nw, my, doc.getTextWidth(ll), 3.5);
      }
      my+=4.5; doc.setFont('helvetica','normal'); doc.setTextColor(75,85,99);
      doc.text(pl, ML, my); my+=pl.length*4.5+5;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   4. SLATE (dark header + gradient bar + two-col grid)
═══════════════════════════════════════════════════════════ */
function buildSlate(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const aR=acRgb.r,aG=acRgb.g,aB=acRgb.b;

  // Dark header
  const hH=36;
  isColor ? fill(15,23,42) : fill(50,50,50);
  doc.rect(0,0,PW,hH,'F');

  let y=13;
  doc.setFontSize(FS.name); doc.setFont('helvetica','bold'); setW();
  doc.text(p.name||'', ML, y); y+=8;
  doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(148,163,184) : doc.setTextColor(200,200,200);
  doc.text((p.title||'').toUpperCase(), ML, y, { charSpace:0.8 });

  // Right-align contact
  const contactStrs = [p.email, p.phone, p.location, p.linkedin].filter(Boolean);
  let ry=12;
  contactStrs.forEach(v => {
    doc.setFontSize(FS.contact); doc.setFont('helvetica','normal');
    isColor ? doc.setTextColor(100,116,139) : doc.setTextColor(160,160,160);
    doc.text(v, PW-MR, ry, { align:'right' });
    if (v.includes('@')) addLink('mailto:'+v, PW-MR-doc.getTextWidth(v), ry, doc.getTextWidth(v), 3.5);
    else if (v.includes('linkedin') || v.includes('http')) addLink(normaliseUrl(v), PW-MR-doc.getTextWidth(v), ry, doc.getTextWidth(v), 3.5);
    ry+=4.5;
  });

  // Gradient bar
  y=hH;
  if (isColor) {
    const colors=[[99,102,241],[139,92,246],[236,72,153]];
    const steps=30;
    for (let i=0;i<steps;i++) {
      const r1=i/steps, r2=(i+1)/steps;
      const c1=colors[Math.floor(r1*2)], c2=colors[Math.min(Math.floor(r2*2)+0,2)];
      const fr=r1*2-Math.floor(r1*2);
      const r=Math.round(c1[0]+(c2[0]-c1[0])*fr);
      const g=Math.round(c1[1]+(c2[1]-c1[1])*fr);
      const b=Math.round(c1[2]+(c2[2]-c1[2])*fr);
      fill(r,g,b); doc.rect(ML+(CW/steps)*i, y, CW/steps+0.5, 2,'F');
    }
  } else { fill(80,80,80); doc.rect(ML,y,CW,2,'F'); }
  y+=5;

  let my=y+5;

  function slateSecHead(label, x, maxX) {
    if (my+8>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(99,102,241) : setBW();
    doc.text(label.toUpperCase(), x, my, { charSpace:0.5 });
    isColor ? drw(226,232,240) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(x, my+1.5, maxX, my+1.5);
    my+=6;
  }

  function slateExpEntry(role, company, date, desc, colW) {
    const dl=doc.splitTextToSize(desc||'', colW);
    if (my+12+dl.length*4.5>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? setD() : setBW();
    doc.text(role||'', ML, my);
    const rw=doc.getTextWidth(role||'');
    isColor ? doc.setTextColor(99,102,241) : doc.setTextColor(80,80,80);
    doc.setFont('helvetica','normal');
    doc.text(' · '+(company||''), ML+rw, my);
    doc.setFontSize(FS.small); setLG();
    doc.text(date||'', PW-MR, my, { align:'right' });
    my+=5;
    drw(241,245,249); doc.setLineWidth(0.2); doc.line(ML,my,PW-MR,my); my+=2;
    doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
    isColor ? setG() : setBW();
    doc.text(dl, ML, my); my+=dl.length*4.5+5;
  }

  if (vis.summary && resume.summary) {
    slateSecHead('Executive Summary', ML, PW-MR);
    doc.setFontSize(FS.body); doc.setFont('helvetica','italic');
    isColor ? setG() : setBW();
    const sl=doc.splitTextToSize(resume.summary, CW);
    doc.text(sl, ML, my); my+=sl.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    slateSecHead('Professional Experience', ML, PW-MR);
    resume.experience.forEach(e=>slateExpEntry(e.role,e.company,e.date,e.desc,CW));
  }

  // Two-column grid
  const col1X=ML, col2X=ML+CW/2+5, colW=(CW-10)/2;
  let savedMy=my;

  // Col 1: Education + Certifications
  let c1y=my;
  function col1SecHead(label) {
    if (c1y+8>PH-15) { doc.addPage(); c1y=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(99,102,241) : setBW();
    doc.text(label.toUpperCase(), col1X, c1y, { charSpace:0.5 });
    isColor ? drw(226,232,240) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(col1X, c1y+1.5, col2X-5, c1y+1.5);
    c1y+=6;
  }

  if (vis.education && resume.education?.length) {
    col1SecHead('Education');
    resume.education.forEach(e => {
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(e.degree||'', col1X, c1y); c1y+=4.5;
      doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(99,102,241) : doc.setTextColor(80,80,80);
      doc.setFontSize(FS.body-0.5);
      doc.text(`${e.school||''} · ${e.date||''}`, col1X, c1y); c1y+=7;
    });
  }
  if (vis.certifications && resume.certifications?.length) {
    col1SecHead('Certifications');
    resume.certifications.forEach(c => {
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(c.name||'', col1X, c1y); c1y+=4.5;
      doc.setFont('helvetica','normal'); setG();
      doc.setFontSize(FS.body-0.5);
      doc.text(`${c.org||''} · ${c.date||''}`, col1X, c1y); c1y+=7;
    });
  }

  // Col 2: Skills + Languages + Projects
  my=savedMy;
  function col2SecHead(label) {
    if (my+8>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(99,102,241) : setBW();
    doc.text(label.toUpperCase(), col2X, my, { charSpace:0.5 });
    isColor ? drw(226,232,240) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(col2X, my+1.5, PW-MR, my+1.5);
    my+=6;
  }

  if (vis.skills && resume.skills?.length) {
    col2SecHead('Core Skills');
    let sx=col2X, sy=my;
    resume.skills.forEach(sk => {
      doc.setFontSize(FS.small); doc.setFont('helvetica','normal');
      const tw=doc.getTextWidth(sk)+6;
      if (sx+tw>PW-MR) { sx=col2X; sy+=7; }
      isColor ? fill(241,245,249) : fill(240,240,240);
      doc.rect(sx, sy-4, tw, 5.5,'F');
      drw(226,232,240); doc.setLineWidth(0.2); doc.rect(sx, sy-4, tw, 5.5,'S');
      isColor ? doc.setTextColor(55,65,81) : setBW();
      doc.text(sk, sx+3, sy); sx+=tw+3;
    });
    my=sy+9;
  }
  if (vis.languages && resume.languages?.length) {
    col2SecHead('Languages');
    resume.languages.forEach(l => {
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(l.name||'', col2X, my);
      const nw=doc.getTextWidth(l.name||'')+4;
      doc.setFont('helvetica','normal'); setLG();
      doc.text(l.level||'', col2X+nw, my); my+=6;
    });
  }
  if (vis.projects && resume.projects?.length) {
    col2SecHead('Key Projects');
    resume.projects.forEach(proj => {
      const pl=doc.splitTextToSize(proj.desc||'', colW);
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(proj.name||'', col2X, my); my+=4.5;
      if (proj.link) {
        doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(99,102,241) : doc.setTextColor(80,80,80);
        doc.setFontSize(FS.small);
        doc.text(proj.link.replace(/^https?:\/\//,''), col2X, my);
        addLink(proj.link, col2X, my, doc.getTextWidth(proj.link), 3.5); my+=4;
      }
      doc.setFont('helvetica','normal'); isColor ? setG() : setBW();
      doc.setFontSize(FS.body-0.5);
      doc.text(pl, col2X, my); my+=pl.length*4.5+5;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   5. MARINE (dark LEFT sidebar)
═══════════════════════════════════════════════════════════ */
function buildMarine(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const aR=acRgb.r,aG=acRgb.g,aB=acRgb.b;

  const SIDE_W=58, MAIN_X=SIDE_W+8, MAIN_W=PW-MAIN_X-MR;

  // Dark sidebar
  isColor ? fill(12,74,110) : fill(50,50,50);
  doc.rect(0,0,SIDE_W,PH,'F');

  // Photo circle in sidebar
  const cx=SIDE_W/2, cy=24, cr=11;
  isColor ? fill(7,89,133) : fill(80,80,80);
  doc.circle(cx,cy,cr,'F');
  isColor ? drw(56,189,248) : drw(150,150,150);
  doc.setLineWidth(0.8); doc.circle(cx,cy,cr,'S');
  isColor ? fill(124,209,248) : fill(150,150,150);
  doc.circle(cx,cy-2.5,3.5,'F'); doc.ellipse(cx,cy+4.5,5.5,4,'F');

  // Name & title (under photo)
  let sy=cy+cr+6;
  doc.setFontSize(12); doc.setFont('helvetica','bold'); setW();
  const nameLines=doc.splitTextToSize(p.name||'', SIDE_W-8);
  nameLines.forEach(l => { doc.text(l, SIDE_W/2, sy, { align:'center' }); sy+=5; });
  doc.setFontSize(8.5); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(125,211,252) : doc.setTextColor(190,190,190);
  const titleLines=doc.splitTextToSize(p.title||'', SIDE_W-8);
  titleLines.forEach(l => { doc.text(l, SIDE_W/2, sy, { align:'center' }); sy+=4.5; });
  sy+=4;

  function marSideHead(label) {
    if (sy+8>PH-10) return;
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(56,189,248) : doc.setTextColor(170,170,170);
    doc.text(label.toUpperCase(), 4, sy, { charSpace:0.3 }); sy+=5;
  }

  // Contact
  marSideHead('Contact');
  const contactRows=[
    { v:p.email, href:normaliseUrl(p.email) },
    { v:p.phone, href:normaliseUrl(p.phone) },
    { v:p.location, href:null },
    { v:p.linkedin, href:normaliseUrl(p.linkedin) },
    { v:p.github, href:normaliseUrl(p.github) },
  ].filter(d=>d.v);
  contactRows.forEach(item => {
    if (sy+5>PH-10) return;
    doc.setFontSize(8); doc.setFont('helvetica','normal');
    isColor ? doc.setTextColor(186,230,253) : doc.setTextColor(190,190,190);
    const vl=doc.splitTextToSize(item.v, SIDE_W-6);
    doc.text(vl, 4, sy);
    if (item.href) addLink(item.href, 4, sy, doc.getTextWidth(vl[0]), 3.5);
    sy+=vl.length*4+3;
  });
  sy+=4;

  if (vis.skills && resume.skills?.length) {
    marSideHead('Skills');
    resume.skills.forEach(sk => {
      if (sy+5>PH-10) return;
      drw(7,89,133); doc.setLineWidth(0.2);
      doc.line(4, sy+0.5, SIDE_W-4, sy+0.5);
      doc.setFontSize(9); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(224,242,254) : doc.setTextColor(200,200,200);
      doc.text(sk, 4, sy); sy+=5.5;
    });
    sy+=2;
  }

  if (vis.languages && resume.languages?.length) {
    marSideHead('Languages');
    resume.languages.forEach(l => {
      if (sy+8>PH-10) return;
      doc.setFontSize(9); doc.setFont('helvetica','bold'); setW();
      doc.text(l.name||'', 4, sy); sy+=4;
      doc.setFont('helvetica','normal'); doc.setFontSize(8);
      isColor ? doc.setTextColor(125,211,252) : doc.setTextColor(170,170,170);
      doc.text(l.level||'', 4, sy); sy+=5;
    });
  }

  // Main column
  let my=15;
  function marMainHead(label) {
    if (my+8>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(3,105,161) : setBW();
    doc.setFillColor(isColor?3:50, isColor?105:50, isColor?161:50);
    doc.roundedRect(MAIN_X, my-4, doc.getTextWidth(label.toUpperCase())+8, 6.5, 2,2,'F');
    setW();
    doc.text(label.toUpperCase(), MAIN_X+4, my); my+=8;
  }

  function marEntry(title, sub, date, desc) {
    const dl=doc.splitTextToSize(desc||'', MAIN_W);
    const need=5+(sub?4.5:0)+dl.length*4.5+6;
    if (my+need>PH-15) { doc.addPage(); my=18; }
    // card bg
    isColor ? fill(240,249,255) : fill(248,248,248);
    doc.rect(MAIN_X, my-4.5, MAIN_W, need+1,'F');
    isColor ? drw(3,105,161) : drw(150,150,150);
    doc.setLineWidth(1); doc.line(MAIN_X, my-4.5, MAIN_X, my-4.5+need+1);
    doc.setLineWidth(0.2);
    const tx=MAIN_X+4;
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? setD() : setBW();
    doc.text(title||'', tx, my);
    doc.setFontSize(FS.small); setLG();
    doc.text(date||'', PW-MR, my, { align:'right' });
    my+=4.5;
    if (sub) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(3,105,161) : doc.setTextColor(80,80,80);
      doc.text(sub, tx, my); my+=4.5;
    }
    if (dl.length>0) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? setG() : setBW();
      doc.text(dl, tx, my); my+=dl.length*4.5;
    }
    my+=6;
  }

  if (vis.summary && resume.summary) {
    marMainHead('Profile');
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
    isColor ? setG() : setBW();
    const sl=doc.splitTextToSize(resume.summary, MAIN_W);
    doc.text(sl, MAIN_X, my); my+=sl.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    marMainHead('Experience');
    resume.experience.forEach(e=>marEntry(e.role,e.company,e.date,e.desc));
  }
  if (vis.education && resume.education?.length) {
    marMainHead('Education');
    resume.education.forEach(e=>marEntry(e.degree,e.school,e.date,e.desc));
  }
  if (vis.projects && resume.projects?.length) {
    marMainHead('Projects');
    resume.projects.forEach(proj => {
      const pl=doc.splitTextToSize(proj.desc||'', MAIN_W);
      if (my+12+pl.length*4.5>PH-15) { doc.addPage(); my=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(proj.name||'', MAIN_X, my);
      if (proj.link) {
        const nw=doc.getTextWidth(proj.name||'')+3;
        doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(3,105,161) : setBW();
        doc.setFontSize(FS.small);
        const ll=proj.link.replace(/^https?:\/\//,'');
        doc.text(ll, MAIN_X+nw, my); addLink(proj.link, MAIN_X+nw, my, doc.getTextWidth(ll), 3.5);
      }
      my+=4.5; doc.setFont('helvetica','normal'); isColor ? setG() : setBW();
      doc.text(pl, MAIN_X, my); my+=pl.length*4.5+5;
    });
  }
  if (vis.certifications && resume.certifications?.length) {
    marMainHead('Certifications');
    resume.certifications.forEach(c => {
      if (my+8>PH-15) { doc.addPage(); my=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(c.name||'', MAIN_X, my);
      const nw=doc.getTextWidth(c.name||'')+3;
      doc.setFont('helvetica','normal'); isColor ? setA() : setBW();
      doc.text(`${c.org||''} · ${c.date||''}`, MAIN_X+nw, my); my+=6;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   6. CRIMSON (centered serif header + two-col body)
═══════════════════════════════════════════════════════════ */
function buildCrimson(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const aR=acRgb.r,aG=acRgb.g,aB=acRgb.b;
  const contact=[p.email,p.phone,p.location,p.linkedin].filter(Boolean).join(' · ');

  // Centered header
  let y=14;
  doc.setFontSize(FS.name); doc.setFont('times','bold');
  isColor ? setD() : setBW();
  doc.text(p.name||'', PW/2, y, { align:'center' }); y+=8;

  doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(aR,aG,aB) : setBW();
  doc.text((p.title||'').toUpperCase(), PW/2, y, { align:'center', charSpace:0.8 }); y+=5;

  doc.setFontSize(FS.contact); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(120,113,108) : setBW();
  doc.text(contact, PW/2, y, { align:'center' }); y+=4;

  // Double rule
  isColor ? drw(aR,aG,aB) : drw(80,80,80);
  doc.setLineWidth(0.8); doc.line(ML, y, PW-MR, y); y+=1.2;
  doc.setLineWidth(0.2); doc.line(ML, y, PW-MR, y); y+=6;

  function crimSecHead(label) {
    if (y+8>PH-15) { doc.addPage(); y=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), ML, y, { charSpace:0.8 });
    isColor ? drw(254,205,211) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(ML, y+1.5, PW-MR, y+1.5);
    y+=6;
  }

  if (vis.summary && resume.summary) {
    crimSecHead('Profile');
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
    isColor ? doc.setTextColor(68,64,60) : setBW();
    const sl=doc.splitTextToSize(resume.summary, CW);
    doc.text(sl, ML, y); y+=sl.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    crimSecHead('Experience');
    resume.experience.forEach(e => {
      const dl=doc.splitTextToSize(e.desc||'', CW);
      if (y+12+dl.length*4.5>PH-15) { doc.addPage(); y=18; }
      doc.setFontSize(FS.body); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(e.role||'', ML, y);
      const rw=doc.getTextWidth(e.role||'');
      doc.setFont('times','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
      doc.text(' · '+(e.company||''), ML+rw, y);
      doc.setFontSize(FS.small); isColor ? doc.setTextColor(120,113,108) : doc.setTextColor(130,130,130);
      doc.text(e.date||'', PW-MR, y, { align:'right' }); y+=5;
      doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(87,83,78) : setBW();
      doc.text(dl, ML, y); y+=dl.length*4.5+5;
    });
  }

  // Two-col grid
  const col1X=ML, col2X=ML+CW/2+5, colW=(CW-10)/2;
  let c1y=y, c2y=y;

  function col1Head(label) {
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), col1X, c1y, { charSpace:0.8 });
    isColor ? drw(254,205,211) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(col1X, c1y+1.5, col2X-5, c1y+1.5);
    c1y+=6;
  }
  function col2Head(label) {
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), col2X, c2y, { charSpace:0.8 });
    isColor ? drw(254,205,211) : drw(180,180,180);
    doc.setLineWidth(0.2); doc.line(col2X, c2y+1.5, PW-MR, c2y+1.5);
    c2y+=6;
  }

  if (vis.education && resume.education?.length) {
    col1Head('Education');
    resume.education.forEach(e => {
      doc.setFontSize(FS.body); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(e.degree||'', col1X, c1y); c1y+=4.5;
      doc.setFont('times','normal'); isColor ? doc.setTextColor(aR,aG,aB) : doc.setTextColor(80,80,80);
      doc.setFontSize(FS.body-0.5);
      doc.text(e.school||'', col1X, c1y); c1y+=4;
      isColor ? doc.setTextColor(120,113,108) : doc.setTextColor(120,120,120);
      doc.setFontSize(FS.small);
      doc.text(e.date||'', col1X, c1y); c1y+=7;
    });
  }
  if (vis.certifications && resume.certifications?.length) {
    col1Head('Certifications');
    resume.certifications.forEach(c => {
      doc.setFontSize(FS.body); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(c.name||'', col1X, c1y); c1y+=4.5;
      doc.setFont('helvetica','normal'); doc.setFontSize(FS.small);
      isColor ? doc.setTextColor(120,113,108) : doc.setTextColor(120,120,120);
      doc.text(`${c.org||''} · ${c.date||''}`, col1X, c1y); c1y+=7;
    });
  }

  if (vis.skills && resume.skills?.length) {
    col2Head('Competencies');
    let sx=col2X, sy=c2y;
    resume.skills.forEach(sk => {
      doc.setFontSize(FS.small); doc.setFont('helvetica','normal');
      const tw=doc.getTextWidth(sk)+6;
      if (sx+tw>PW-MR) { sx=col2X; sy+=7; }
      isColor ? fill(255,241,242) : fill(242,242,242);
      doc.rect(sx, sy-4, tw, 5.5,'F');
      isColor ? drw(254,205,211) : drw(180,180,180);
      doc.setLineWidth(0.2); doc.rect(sx, sy-4, tw, 5.5,'S');
      isColor ? doc.setTextColor(aR,aG,aB) : setBW();
      doc.text(sk, sx+3, sy); sx+=tw+3;
    });
    c2y=sy+9;
  }
  if (vis.languages && resume.languages?.length) {
    col2Head('Languages');
    resume.languages.forEach(l => {
      doc.setFontSize(FS.body); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(l.name||'', col2X, c2y);
      const nw=doc.getTextWidth(l.name||'')+4;
      doc.setFont('times','normal'); isColor ? doc.setTextColor(120,113,108) : doc.setTextColor(120,120,120);
      doc.text(l.level||'', col2X+nw, c2y); c2y+=6;
    });
  }
  if (vis.projects && resume.projects?.length) {
    col2Head('Projects');
    resume.projects.forEach(proj => {
      const pl=doc.splitTextToSize(proj.desc||'', colW);
      doc.setFontSize(FS.body); doc.setFont('times','bold');
      isColor ? setD() : setBW();
      doc.text(proj.name||'', col2X, c2y); c2y+=4.5;
      if (proj.link) {
        doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(aR,aG,aB) : setBW();
        doc.setFontSize(FS.small);
        const ll=proj.link.replace(/^https?:\/\//,'');
        doc.text(ll, col2X, c2y); addLink(proj.link, col2X, c2y, doc.getTextWidth(ll), 3.5); c2y+=4;
      }
      doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(87,83,78) : setBW();
      doc.setFontSize(FS.body-0.5);
      doc.text(pl, col2X, c2y); c2y+=pl.length*4.5+5;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   7. FOREST (dark green header + two-col body)
═══════════════════════════════════════════════════════════ */
function buildForest(doc, resume, p, vis, acRgb, isColor, h) {
  const { PW,PH,ML,MR,CW,FS, setA,setD,setG,setLG,setW,setBW, fill,drw,addLink } = h;
  const aR=acRgb.r,aG=acRgb.g,aB=acRgb.b;

  // Dark header
  const hH=36;
  isColor ? fill(5,46,22) : fill(40,40,40);
  doc.rect(0,0,PW,hH,'F');

  // Photo circle
  const cy=hH/2, cx=ML+10;
  isColor ? fill(20,83,45) : fill(80,80,80);
  doc.circle(cx,cy,10,'F');
  isColor ? drw(74,222,128) : drw(150,150,150);
  doc.setLineWidth(0.8); doc.circle(cx,cy,10,'S');
  isColor ? fill(134,239,172) : fill(160,160,160);
  doc.circle(cx,cy-2,3.5,'F'); doc.ellipse(cx,cy+4.5,5.5,4,'F');

  // Name / title / contact
  const nX=cx+14;
  let y=10;
  doc.setFontSize(FS.name-2); doc.setFont('helvetica','bold'); setW();
  doc.text(p.name||'', nX, y); y+=7;
  doc.setFontSize(FS.title); doc.setFont('helvetica','normal');
  isColor ? doc.setTextColor(74,222,128) : doc.setTextColor(180,180,180);
  doc.text(p.title||'', nX, y); y+=5;
  doc.setFontSize(FS.contact);
  const basicContact=[p.email,p.phone,p.location].filter(Boolean).join(' · ');
  isColor ? doc.setTextColor(134,239,172) : doc.setTextColor(190,190,190);
  doc.text(basicContact, nX, y);

  // Right side socials
  if (p.linkedin||p.github) {
    let ry=10;
    [p.linkedin, p.github].filter(Boolean).forEach(v => {
      doc.setFontSize(FS.small); isColor ? doc.setTextColor(74,222,128) : doc.setTextColor(170,170,170);
      doc.text(v, PW-MR, ry, { align:'right' });
      addLink(normaliseUrl(v), PW-MR-doc.getTextWidth(v), ry, doc.getTextWidth(v), 3.5);
      ry+=5;
    });
  }

  // Green gradient bar
  y=hH;
  if (isColor) {
    const stops=[[74,222,128],[34,197,94],[22,163,74]];
    const steps=20;
    for (let i=0;i<steps;i++) {
      const r=i/steps;
      const si=Math.min(Math.floor(r*2),1);
      const fr=r*2-si;
      const c1=stops[si], c2=stops[si+1];
      fill(Math.round(c1[0]+(c2[0]-c1[0])*fr), Math.round(c1[1]+(c2[1]-c1[1])*fr), Math.round(c1[2]+(c2[2]-c1[2])*fr));
      doc.rect(ML+(CW/steps)*i, y, CW/steps+0.5, 2.5,'F');
    }
  } else { fill(80,80,80); doc.rect(ML,y,CW,2.5,'F'); }
  y+=5;

  // Two-column layout
  const MAIN_W_F = CW-52-6, SIDE_X_F = ML+MAIN_W_F+6;

  let my=y+5;
  function forMainHead(label) {
    if (my+8>PH-15) { doc.addPage(); my=18; }
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), ML, my, { charSpace:0.5 });
    isColor ? drw(74,222,128) : drw(150,150,150);
    doc.setLineWidth(0.4); doc.line(ML, my+1.5, SIDE_X_F-5, my+1.5);
    my+=6;
  }

  function forEntry(title, sub, date, desc) {
    const dl=doc.splitTextToSize(desc||'', MAIN_W_F-6);
    const need=5+(sub?4.5:0)+dl.length*4.5+6;
    if (my+need>PH-15) { doc.addPage(); my=18; }
    isColor ? fill(74,222,128) : fill(120,120,120);
    doc.rect(ML, my-4, 1.5, need-4,'F');
    const tx=ML+4;
    doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
    isColor ? setD() : setBW();
    doc.text(title||'', tx, my);
    doc.setFontSize(FS.small); setLG();
    doc.text(date||'', SIDE_X_F-5, my, { align:'right' });
    my+=4.5;
    if (sub) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(22,101,52) : doc.setTextColor(80,80,80);
      doc.text(sub, tx, my); my+=4.5;
    }
    if (dl.length>0) {
      doc.setFontSize(FS.body-0.5); doc.setFont('helvetica','normal');
      isColor ? setG() : setBW();
      doc.text(dl, tx, my); my+=dl.length*4.5;
    }
    my+=6;
  }

  if (vis.summary && resume.summary) {
    forMainHead('Summary');
    doc.setFontSize(FS.body); doc.setFont('helvetica','normal');
    isColor ? setG() : setBW();
    const sl=doc.splitTextToSize(resume.summary, MAIN_W_F);
    doc.text(sl, ML, my); my+=sl.length*4.5+6;
  }
  if (vis.experience && resume.experience?.length) {
    forMainHead('Experience');
    resume.experience.forEach(e=>forEntry(e.role,e.company,e.date,e.desc));
  }
  if (vis.education && resume.education?.length) {
    forMainHead('Education');
    resume.education.forEach(e=>forEntry(e.degree,e.school,e.date,e.desc));
  }
  if (vis.projects && resume.projects?.length) {
    forMainHead('Projects');
    resume.projects.forEach(proj => {
      const pl=doc.splitTextToSize(proj.desc||'', MAIN_W_F-6);
      if (my+12+pl.length*4.5>PH-15) { doc.addPage(); my=18; }
      isColor ? fill(74,222,128) : fill(120,120,120);
      doc.rect(ML, my-4, 1.5, 12+pl.length*4.5,'F');
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(proj.name||'', ML+4, my);
      if (proj.link) {
        const nw=doc.getTextWidth(proj.name||'')+3;
        doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(22,101,52) : setBW();
        doc.setFontSize(FS.small);
        const ll=proj.link.replace(/^https?:\/\//,'');
        doc.text(ll, ML+4+nw, my); addLink(proj.link, ML+4+nw, my, doc.getTextWidth(ll), 3.5);
      }
      my+=4.5; doc.setFont('helvetica','normal'); isColor ? setG() : setBW();
      doc.setFontSize(FS.body-0.5);
      doc.text(pl, ML+4, my); my+=pl.length*4.5+5;
    });
  }
  if (vis.certifications && resume.certifications?.length) {
    forMainHead('Certifications');
    resume.certifications.forEach(c => {
      if (my+8>PH-15) { doc.addPage(); my=18; }
      doc.setFontSize(FS.body); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(c.name||'', ML, my);
      const nw=doc.getTextWidth(c.name||'')+3;
      doc.setFont('helvetica','normal'); isColor ? doc.setTextColor(22,101,52) : setBW();
      doc.text(`${c.org||''} · ${c.date||''}`, ML+nw, my); my+=6;
    });
  }

  // Right sidebar (Skills + Languages)
  let sy=y+5;
  function forSideHead(label) {
    if (sy+8>PH-10) return;
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    isColor ? doc.setTextColor(aR,aG,aB) : setBW();
    doc.text(label.toUpperCase(), SIDE_X_F, sy, { charSpace:0.3 });
    isColor ? drw(74,222,128) : drw(150,150,150);
    doc.setLineWidth(0.4); doc.line(SIDE_X_F, sy+1.5, PW-MR, sy+1.5);
    sy+=6;
  }

  if (vis.skills && resume.skills?.length) {
    forSideHead('Skills');
    resume.skills.forEach(sk => {
      if (sy+6>PH-10) return;
      isColor ? fill(220,252,231) : fill(240,240,240);
      doc.rect(SIDE_X_F, sy-3.5, PW-MR-SIDE_X_F, 5.5,'F');
      doc.setFontSize(9); doc.setFont('helvetica','normal');
      isColor ? doc.setTextColor(aR,aG,aB) : setBW();
      doc.text(sk, SIDE_X_F+3, sy); sy+=6.5;
    });
    sy+=2;
  }
  if (vis.languages && resume.languages?.length) {
    forSideHead('Languages');
    resume.languages.forEach(l => {
      if (sy+8>PH-10) return;
      doc.setFontSize(9); doc.setFont('helvetica','bold');
      isColor ? setD() : setBW();
      doc.text(l.name||'', SIDE_X_F, sy); sy+=4;
      doc.setFont('helvetica','normal'); doc.setFontSize(8);
      isColor ? doc.setTextColor(107,114,128) : doc.setTextColor(120,120,120);
      doc.text(l.level||'', SIDE_X_F, sy); sy+=5;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   CONTACT ITEMS BUILDER
═══════════════════════════════════════════════════════════ */
function buildContactItems(p, doc) {
  const items=[];
  function add(label, url) {
    if (!label) return;
    doc.setFontSize(9);
    items.push({ label, w:doc.getTextWidth(label), url:url||null });
  }
  add(p.email, normaliseUrl(p.email));
  add(p.phone, normaliseUrl(p.phone));
  if (p.location) add(p.location, null);
  if (p.linkedin) add('LinkedIn', normaliseUrl(p.linkedin));
  if (p.github)   add('GitHub',   normaliseUrl(p.github));
  if (p.portfolio) add('Portfolio', normaliseUrl(p.portfolio));
  if (p.twitter)   add(p.twitter,   normaliseUrl(p.twitter));
  return items;
}

export { normaliseUrl };