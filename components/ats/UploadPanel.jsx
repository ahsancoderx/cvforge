//components/ats/UploadPanel
'use client';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { useState, useRef, useCallback, useEffect } from 'react';
import { parseResumeText } from '../../utils/resumeParser';

const STEPS = [
  'Reading file...',
  'Extracting text content...',
  'Parsing contact information...',
  'Detecting work experience...',
  'Analyzing education section...',
  'Extracting skills...',
  'Scoring ATS compatibility...',
  'Generating recommendations...',
];

// ── Load pdfjs from CDN ────────────────────────────────────
const PDFJS_VERSION = '3.11.174';
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

function loadPdfjsFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement('script');
    script.src = `${PDFJS_CDN}/pdf.min.js`;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}

// ── Load Tesseract v4 (stable CDN, window.Tesseract works) ─
// NOTE: Using v4 NOT v5. v5 removed window.Tesseract global.
function loadTesseract() {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) { resolve(window.Tesseract); return; }
    const script = document.createElement('script');
    // v4 is the last version that exposes window.Tesseract with simple .recognize() API
    script.src = 'https://unpkg.com/tesseract.js@4.1.4/dist/tesseract.min.js';
    script.onload = () => {
      // small delay to ensure global is set
      setTimeout(() => {
        if (window.Tesseract) resolve(window.Tesseract);
        else reject(new Error('Tesseract did not expose global'));
      }, 200);
    };
    script.onerror = () => reject(new Error('Failed to load Tesseract'));
    document.head.appendChild(script);
  });
}

// ── Run OCR using Tesseract v4 API ────────────────────────
// v4 API: Tesseract.recognize(image, lang, { logger }) → { data: { text } }
async function runOCR(imageSource, setMsg, pageLabel) {
  const Tesseract = await loadTesseract();
  setMsg?.(`OCR running${pageLabel ? ' ' + pageLabel : ''}...`);
  
  const result = await Tesseract.recognize(
    imageSource,
    'eng',
    {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          setMsg?.(`OCR${pageLabel ? ' ' + pageLabel : ''}: ${pct}%`);
        }
      },
    }
  );
  return (result?.data?.text) || '';
}

export default function UploadPanel({ onResumeParsed }) {
  const [isDragging, setIsDragging]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMsg, setLoadingMsg]   = useState('');
  const [error, setError]             = useState('');
  const inputRef = useRef();

  useEffect(() => {
    loadPdfjsFromCDN().catch(() => {});
  }, []);

  const simulateProgress = useCallback((callback) => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= STEPS.length - 1) { clearInterval(interval); callback(); }
    }, 300);
    return interval;
  }, []);

  const processFile = useCallback(async (file) => {
    setError('');
    const name = file.name.toLowerCase();
    const type = file.type;
    const isPDF  = type === 'application/pdf'  || name.endsWith('.pdf');
    const isDOCX = type.includes('wordprocessingml') || name.endsWith('.docx');
    const isDOC  = type === 'application/msword' || name.endsWith('.doc');
    const isTXT  = type === 'text/plain'        || name.endsWith('.txt');
    const isIMG  = type.startsWith('image/')    || /\.(png|jpe?g|webp|bmp|tiff?)$/i.test(name);

    if (!isPDF && !isDOCX && !isDOC && !isTXT && !isIMG) {
      setError('Unsupported file. Please upload PDF, DOCX, TXT, or image (PNG/JPG).');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setLoadingMsg('');

    try {
      let text = '';

      if (isTXT) {
        text = await extractTxt(file);

      } else if (isDOCX || isDOC) {
        text = await extractDocx(file);

      } else if (isIMG) {
        // Direct image → OCR
        setLoadingMsg('Loading OCR engine...');
        text = await runOCR(file, setLoadingMsg, '');

      } else if (isPDF) {
        // Try normal text extraction first
        setLoadingMsg('Extracting PDF text...');
        text = await extractPdf(file).catch(() => '');

        if (!text || text.trim().length < 50) {
          // Scanned PDF → render each page as image → OCR
          setLoadingMsg('Scanned PDF detected — loading OCR engine...');
          text = await extractPdfViaOCR(file, setLoadingMsg);
        }
      }

      if (!text || text.trim().length < 50) {
        throw new Error(
          isPDF
            ? 'Could not extract text. Try uploading as PNG/JPG screenshot of your CV instead.'
            : 'Could not extract enough text. Try a different format.'
        );
      }

      simulateProgress(() => {
        const resume = parseResumeText(text);
        setLoading(false);
        setLoadingMsg('');
        onResumeParsed({ resume, rawText: text, fileName: file.name });
      });

    } catch (err) {
      setLoading(false);
      setLoadingMsg('');
      setError(err.message || 'Failed to process file. Please try again.');
    }
  }, [onResumeParsed, simulateProgress]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 },
      background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08) 0%, transparent 70%)',
    }}>
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 560 }}>
        <Typography sx={{
          fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.1, mb: 1.5,
          background: 'linear-gradient(135deg, #fff 30%, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Check Your CV Against ATS</Typography>
        <Typography sx={{ color: '#8b8fa8', fontSize: '1rem', lineHeight: 1.6 }}>
          Upload your resume and get an instant ATS compatibility score with detailed feedback on every section.
        </Typography>
      </Box>

      {!loading ? (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          sx={{
            width: '100%', maxWidth: 520,
            border: `2px dashed ${isDragging ? '#6c63ff' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '20px',
            background: isDragging ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.03)',
            cursor: 'pointer', p: { xs: 4, md: 6 }, textAlign: 'center',
            transition: 'all 0.25s ease',
            '&:hover': { border: '2px dashed rgba(108,99,255,0.6)', background: 'rgba(108,99,255,0.05)' },
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp,.bmp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Box sx={{
            width: 72, height: 72, borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.1))',
            border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', mx: 'auto', mb: 2.5,
          }}>📄</Box>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#f0f0f8', mb: 0.8 }}>
            {isDragging ? 'Drop your CV here' : 'Drag & drop your CV'}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#8b8fa8', mb: 3 }}>
            or click to browse from your computer
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PDF', 'DOCX', 'TXT', 'PNG / JPG'].map((fmt) => (
              <Box key={fmt} sx={{
                px: 1.5, py: 0.5, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em',
              }}>{fmt}</Box>
            ))}
          </Box>
          <Typography sx={{ fontSize: '0.72rem', color: '#4b5563', mt: 2 }}>
            ✨ Scanned PDFs &amp; image CVs supported via OCR
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <Box sx={{
            width: 80, height: 80, borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(167,139,250,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%':      { opacity: 0.7, transform: 'scale(0.96)' },
            },
          }}>
            <CircularProgress size={32} sx={{ color: '#a78bfa' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5, color: '#f0f0f8' }}>
            Analyzing your CV...
          </Typography>
          <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem', mb: loadingMsg ? 1 : 3, minHeight: 20 }}>
            {STEPS[Math.min(loadingStep, STEPS.length - 1)]}
          </Typography>
          {loadingMsg && (
            <Typography sx={{ color: '#f59e0b', fontSize: '0.78rem', mb: 2 }}>
              {loadingMsg}
            </Typography>
          )}
          <Box sx={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', p: 2,
          }}>
            <LinearProgress
              variant="determinate"
              value={Math.round(((loadingStep + 1) / STEPS.length) * 100)}
              sx={{
                height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6c63ff, #a78bfa)', borderRadius: 3,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {STEPS.map((_, i) => (
                <Box key={i} sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i <= loadingStep ? '#6c63ff' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {error && (
        <Box sx={{
          mt: 2.5, maxWidth: 520, width: '100%', p: 2,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '12px', display: 'flex', gap: 1.2, alignItems: 'flex-start',
        }}>
          <Typography sx={{ fontSize: '0.9rem', color: '#ef4444', flexShrink: 0 }}>⚠️</Typography>
          <Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.6 }}>{error}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#ef444488', mt: 0.8 }}>
              💡 Tip: Take a screenshot of your CV and upload as PNG/JPG for best OCR results.
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 3, mt: 5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
        {[
          { icon: '🔒', text: 'Private & Secure' },
          { icon: '⚡', text: 'Instant Analysis' },
          { icon: '🎯', text: '6 ATS Checks' },
          { icon: '🔍', text: 'OCR Support' },
        ].map((f) => (
          <Box key={f.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Typography sx={{ fontSize: '1rem' }}>{f.icon}</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#8b8fa8', fontWeight: 500 }}>{f.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── TXT ────────────────────────────────────────────────────
async function extractTxt(file) {
  return await file.text();
}

// ── PDF (text-based) ───────────────────────────────────────
async function extractPdf(file) {
  const pdfjsLib = await loadPdfjsFromCDN();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null, pageText = '';
    for (const item of content.items) {
      if (!item.str) continue;
      const y = item.transform?.[5] ?? 0;
      if (lastY !== null && Math.abs(y - lastY) > 2) pageText += '\n';
      pageText += item.str + ' ';
      lastY = y;
    }
    pageTexts.push(pageText.trim());
  }
  return pageTexts.join('\n\n').trim();
}

// ── Scanned PDF → canvas → OCR ────────────────────────────
async function extractPdfViaOCR(file, setMsg) {
  setMsg?.('Loading OCR engine...');
  const pdfjsLib = await loadPdfjsFromCDN();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const total = Math.min(pdf.numPages, 5);
  const allText = [];

  for (let i = 1; i <= total; i++) {
    setMsg?.(`Rendering page ${i}/${total}...`);
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.5 });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx      = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Convert canvas → blob → OCR
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    const text = await runOCR(blob, setMsg, `page ${i}/${total}`);
    allText.push(text);
  }

  return allText.join('\n\n').trim();
}

// ── DOCX ──────────────────────────────────────────────────
async function extractDocx(file) {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const mammoth = await import('mammoth/mammoth.browser');
    const result  = await mammoth.extractRawText({ arrayBuffer });
    if (result?.value?.trim().length > 30) return result.value;
  } catch (e) {
    console.warn('[DOCX] mammoth failed:', e?.message);
  }

  try {
    const { default: JSZip } = await import('jszip');
    const zip     = await JSZip.loadAsync(arrayBuffer);
    const xmlFile = zip.file('word/document.xml');
    if (!xmlFile) throw new Error('No document.xml');
    const xml     = await xmlFile.async('string');
    const matches = xml.match(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g) ?? [];
    const text    = matches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ').replace(/\s+/g, ' ').trim();
    if (text.length < 30) throw new Error('Too little text');
    return text;
  } catch (e) {
    throw new Error('Could not read Word file. Try saving as PDF and uploading that.');
  }
}