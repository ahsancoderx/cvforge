//components/ats/Uploadanel
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

// ── Load pdfjs from CDN once ───────────────────────────────
const PDFJS_VERSION = '3.11.174';
const PDFJS_CDN     = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

function loadPdfjsFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement('script');
    script.src = `${PDFJS_CDN}/pdf.min.js`;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
    document.head.appendChild(script);
  });
}

export default function UploadPanel({ onResumeParsed }) {
  const [isDragging, setIsDragging]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingStep, setLoadingStep]   = useState(0);
  const [error, setError]               = useState('');
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
    const isPDF  = type === 'application/pdf' || name.endsWith('.pdf');
    const isDOCX = type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx');
    const isDOC  = type === 'application/msword' || name.endsWith('.doc');
    const isTXT  = type === 'text/plain' || name.endsWith('.txt');

    if (!isPDF && !isDOCX && !isDOC && !isTXT) {
      setError('Unsupported file type. Please upload PDF, DOCX, or TXT.');
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    try {
      let text = '';
      if (isTXT)             text = await extractTxt(file);
      else if (isDOCX||isDOC) text = await extractDocx(file);
      else if (isPDF)        text = await extractPdf(file);

      if (!text || text.trim().length < 50) {
        throw new Error(
          isPDF
            ? 'PDF text is empty. Make sure your PDF is text-based (you can select/copy text in it), not a scanned image.'
            : 'Could not extract enough text. Try saving as a different format.'
        );
      }

      simulateProgress(() => {
        const resume = parseResumeText(text);
        setLoading(false);
        onResumeParsed({ resume, rawText: text, fileName: file.name });
      });
    } catch (err) {
      setLoading(false);
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
          <input ref={inputRef} type="file" accept=".pdf,.docx,.doc,.txt"
            style={{ display: 'none' }} onChange={handleFileChange} />
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
            {['PDF', 'DOCX', 'TXT'].map((fmt) => (
              <Box key={fmt} sx={{
                px: 1.5, py: 0.5, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em',
              }}>{fmt}</Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <Box sx={{
            width: 80, height: 80, borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(167,139,250,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3, animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.7, transform: 'scale(0.96)' } },
          }}>
            <CircularProgress size={32} sx={{ color: '#a78bfa' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5, color: '#f0f0f8' }}>
            Analyzing your CV...
          </Typography>
          <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem', mb: 3, minHeight: 20 }}>
            {STEPS[Math.min(loadingStep, STEPS.length - 1)]}
          </Typography>
          <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', p: 2 }}>
            <LinearProgress variant="determinate"
              value={Math.round(((loadingStep + 1) / STEPS.length) * 100)}
              sx={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6c63ff, #a78bfa)', borderRadius: 3 } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {STEPS.map((_, i) => (
                <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%',
                  background: i <= loadingStep ? '#6c63ff' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s' }} />
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
              Tip: Open your PDF → select all text (Ctrl+A) — if text highlights, it will work. If nothing selects, it is a scanned image.
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 3, mt: 5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
        {[
          { icon: '🔒', text: 'Private & Secure' },
          { icon: '⚡', text: 'Instant Analysis' },
          { icon: '🎯', text: '6 ATS Checks' },
          { icon: '💡', text: 'Smart Suggestions' },
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

// ── PDF via CDN pdfjs (no bundler) ─────────────────────────
async function extractPdf(file) {
  let pdfjsLib;
  try {
    pdfjsLib = await loadPdfjsFromCDN();
  } catch {
    throw new Error('Could not load PDF reader. Check your internet connection and try again.');
  }

  const arrayBuffer = await file.arrayBuffer();
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  } catch (err) {
    throw new Error('Could not open this PDF. It may be password-protected or corrupted.');
  }

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    let pageText = '';
    for (const item of content.items) {
      if (!item.str) continue;
      const y = item.transform?.[5] ?? 0;
      if (lastY !== null && Math.abs(y - lastY) > 2) pageText += '\n';
      pageText += item.str + ' ';
      lastY = y;
    }
    pageTexts.push(pageText.trim());
  }

  const fullText = pageTexts.join('\n\n').trim();
  if (fullText.length < 50) {
    throw new Error(
      'This PDF appears to contain no selectable text — it is likely a scanned image. ' +
      'Please export from Word as PDF, or paste your CV into a .txt file and upload that.'
    );
  }
  return fullText;
}

// ── DOCX via mammoth browser build + jszip fallback ────────
async function extractDocx(file) {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const mammoth = await import('mammoth/mammoth.browser');
    const result  = await mammoth.extractRawText({ arrayBuffer });
    if (result?.value?.trim().length > 30) return result.value;
  } catch (err) {
    console.warn('[DOCX] mammoth failed:', err?.message);
  }

  try {
    const { default: JSZip } = await import('jszip');
    const zip     = await JSZip.loadAsync(arrayBuffer);
    const xmlFile = zip.file('word/document.xml');
    if (!xmlFile) throw new Error('word/document.xml not found');
    const xml     = await xmlFile.async('string');
    const matches = xml.match(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g) ?? [];
    const text    = matches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ').replace(/\s+/g, ' ').trim();
    if (text.length < 30) throw new Error('Too little text in DOCX');
    return text;
  } catch (err) {
    console.error('[DOCX] jszip fallback failed:', err?.message);
    throw new Error(
      'Could not read this Word file. Please try: open in Microsoft Word → File → Save As → PDF, then upload the PDF.'
    );
  }
}