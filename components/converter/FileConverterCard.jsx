//components/converter/FileConverterCard.jsx
// ============================================================
//  FileConverterCard.jsx
//  Place this file at:  src/components/converter/FileConverterCard.jsx
//
//  A self-contained drag-and-drop converter card.
//  Props:
//    none — fully standalone, uses converterUtils internally
//
//  Usage inside any page:
//    import FileConverterCard from '@/components/converter/FileConverterCard';
//    <FileConverterCard />
// ============================================================

'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Button, Chip, CircularProgress,
  LinearProgress, Select, MenuItem, FormControl,
  Tooltip, Stack, IconButton, Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import { convertFile, downloadBlob, getTargetFormats, formatFileSize } from '@/utils/converterUtils';

// ── File type → icon + color ──────────────────────────────────────────────────
function getFileIcon(ext) {
  const map = {
    pdf:  { icon: <PictureAsPdfIcon />, color: '#ef4444', bg: '#fef2f2' },
    docx: { icon: <ArticleIcon />,      color: '#2563eb', bg: '#eff6ff' },
    doc:  { icon: <ArticleIcon />,      color: '#2563eb', bg: '#eff6ff' },
    txt:  { icon: <TextSnippetIcon />,  color: '#6b7280', bg: '#f9fafb' },
    html: { icon: <CodeIcon />,         color: '#d97706', bg: '#fffbeb' },
    jpg:  { icon: <ImageIcon />,        color: '#059669', bg: '#ecfdf5' },
    jpeg: { icon: <ImageIcon />,        color: '#059669', bg: '#ecfdf5' },
    png:  { icon: <ImageIcon />,        color: '#059669', bg: '#ecfdf5' },
  };
  return map[ext?.toLowerCase()] || { icon: <InsertDriveFileIcon />, color: '#6b7280', bg: '#f9fafb' };
}

// ── Progress step labels ──────────────────────────────────────────────────────
const STEPS = ['Reading file…', 'Processing…', 'Converting…', 'Finalising…'];

export default function FileConverterCard() {
  const [file, setFile]           = useState(null);
  const [targetFmt, setTargetFmt] = useState('');
  const [status, setStatus]       = useState('idle'); // idle | converting | done | error
  const [progress, setProgress]   = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [result, setResult]       = useState(null);  // { blob, filename }
  const [error, setError]         = useState('');
  const [dragging, setDragging]   = useState(false);
  const inputRef = useRef();

  const ext = file?.name.split('.').pop().toLowerCase() || '';
  const formats = getTargetFormats(ext);
  const fileInfo = getFileIcon(ext);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, []);

  function handleFileSelect(selected) {
    setFile(selected);
    setTargetFmt('');
    setStatus('idle');
    setResult(null);
    setError('');
    setProgress(0);
  }

  // ── Simulate stepped progress ────────────────────────────────────────────────
  function simulateProgress(onDone) {
    let step = 0;
    setProgress(5);
    setStepLabel(STEPS[0]);

    const interval = setInterval(() => {
      step++;
      const pct = Math.min(20 + step * 18, 85);
      setProgress(pct);
      setStepLabel(STEPS[Math.min(step, STEPS.length - 1)]);
      if (step >= 3) clearInterval(interval);
    }, 600);

    return () => clearInterval(interval);
  }

  // ── Run conversion ───────────────────────────────────────────────────────────
  async function handleConvert() {
    if (!file || !targetFmt) return;
    setStatus('converting');
    setProgress(0);
    setError('');
    setResult(null);

    const clearSim = simulateProgress();

    try {
      const res = await convertFile(file, targetFmt);
      clearSim();
      setProgress(100);
      setStepLabel('Done!');
      setResult(res);
      setStatus('done');
    } catch (err) {
      clearSim();
      setError(err.message || 'Conversion failed. Please try again.');
      setStatus('error');
      setProgress(0);
    }
  }

  function handleReset() {
    setFile(null);
    setTargetFmt('');
    setStatus('idle');
    setResult(null);
    setError('');
    setProgress(0);
    setStepLabel('');
  }

  // ── Styles shared ────────────────────────────────────────────────────────────
  const accent = '#6c63ff';
  const cardBg = '#13151c';
  const border  = 'rgba(255,255,255,0.08)';

  return (
    <Box sx={{
      background: cardBg, border: `1px solid ${border}`, borderRadius: 3,
      p: 3, width: '100%', maxWidth: 520,
    }}>

      {/* ── Drop zone ── */}
      {!file ? (
        <Box
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
          sx={{
            border: `2px dashed ${dragging ? accent : 'rgba(108,99,255,0.3)'}`,
            borderRadius: 2.5, p: 5, textAlign: 'center', cursor: 'pointer',
            background: dragging ? `${accent}08` : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
            '&:hover': { borderColor: accent, background: `${accent}08` },
          }}
        >
          <input ref={inputRef} type="file"
            accept=".pdf,.docx,.doc,.txt,.html,.jpg,.jpeg,.png"
            hidden onChange={e => e.target.files[0] && handleFileSelect(e.target.files[0])} />
          <UploadFileIcon sx={{ fontSize: 48, color: accent, mb: 1.5, opacity: 0.8 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', mb: 0.5 }}>
            Drop your file here
          </Typography>
          <Typography sx={{ color: '#8b8fa8', fontSize: '0.78rem', mb: 2 }}>
            or click to browse
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.8 }}>
            {['PDF', 'DOCX', 'TXT', 'HTML', 'JPG', 'PNG'].map(f => (
              <Chip key={f} label={f} size="small"
                sx={{ fontSize: '0.65rem', height: 20, background: 'rgba(255,255,255,0.05)',
                  color: '#8b8fa8', border: '1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </Box>
        </Box>

      ) : (
        <Box>
          {/* ── File info row ── */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
            background: 'rgba(255,255,255,0.04)', borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.07)', mb: 2,
          }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
              background: fileInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              '& svg': { color: fileInfo.color, fontSize: 22 },
            }}>
              {fileInfo.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#e2e8f0',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>
                {formatFileSize(file.size)} · .{ext.toUpperCase()}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleReset}
              sx={{ color: '#8b8fa8', '&:hover': { color: '#ef4444' } }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* ── Format selector ── */}
          {formats.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{
                flex: 1, p: 1.2, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 1.5,
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <Box sx={{ '& svg': { color: fileInfo.color, fontSize: 18 } }}>{fileInfo.icon}</Box>
                <Typography sx={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
                  .{ext.toUpperCase()}
                </Typography>
              </Box>

              <SwapHorizIcon sx={{ color: accent, fontSize: 22, flexShrink: 0 }} />

              <FormControl size="small" sx={{ flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', borderRadius: 1.5,
                  '& fieldset': { borderColor: targetFmt ? accent : 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: accent },
                },
                '& .MuiSvgIcon-root': { color: '#8b8fa8' },
              }}>
                <Select value={targetFmt} onChange={e => setTargetFmt(e.target.value)}
                  displayEmpty sx={{ fontSize: '0.82rem' }}>
                  <MenuItem value="" disabled sx={{ fontSize: '0.82rem', color: '#8b8fa8' }}>
                    Convert to…
                  </MenuItem>
                  {formats.map(f => (
                    <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.82rem' }}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Alert severity="warning" sx={{ mb: 2, background: '#1a1d00', color: '#fbbf24',
              '& .MuiAlert-icon': { color: '#fbbf24' } }}>
              This file type is not supported for conversion.
            </Alert>
          )}

          {/* ── Progress bar ── */}
          {status === 'converting' && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.75rem' }}>{stepLabel}</Typography>
                <Typography sx={{ color: accent, fontSize: '0.75rem', fontWeight: 700 }}>{progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress}
                sx={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${accent}, #a78bfa)`, borderRadius: 3 } }} />
            </Box>
          )}

          {/* ── Success result ── */}
          {status === 'done' && result && (
            <Box sx={{ mb: 2, p: 1.5, background: '#0d1f0d',
              border: '1px solid #22c55e40', borderRadius: 2,
              display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 22, flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
                  Conversion complete!
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {result.filename}
                </Typography>
              </Box>
              <Button size="small" variant="contained" startIcon={<FileDownloadIcon sx={{ fontSize: 14 }} />}
                onClick={() => downloadBlob(result.blob, result.filename)}
                sx={{ background: '#22c55e', borderRadius: 2, textTransform: 'none', fontWeight: 600,
                  fontSize: '0.75rem', flexShrink: 0,
                  '&:hover': { background: '#16a34a' } }}>
                Download
              </Button>
            </Box>
          )}

          {/* ── Error ── */}
          {status === 'error' && (
            <Alert severity="error" sx={{ mb: 2, background: '#1f0d0d', color: '#fca5a5',
              '& .MuiAlert-icon': { color: '#ef4444' }, fontSize: '0.8rem' }}>
              {error}
            </Alert>
          )}

          {/* ── Action buttons ── */}
          <Stack direction="row" spacing={1}>
            {status !== 'done' && (
              <Button fullWidth variant="contained" onClick={handleConvert}
                disabled={!targetFmt || status === 'converting'}
                startIcon={status === 'converting'
                  ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                  : <SwapHorizIcon sx={{ fontSize: 16 }} />}
                sx={{
                  background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
                  borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.1,
                  '&:hover': { filter: 'brightness(1.1)' },
                  '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: '#8b8fa8' },
                }}>
                {status === 'converting' ? 'Converting…' : 'Convert File'}
              </Button>
            )}
            {status === 'done' && (
              <Button fullWidth variant="outlined" onClick={handleReset}
                sx={{ color: '#8b8fa8', borderColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 2, textTransform: 'none',
                  '&:hover': { borderColor: accent, color: accent } }}>
                Convert Another File
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}