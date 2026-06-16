// app/converter/page.jsx
// BUGS FIXED:
// 1. <Navbar/> was incorrectly inside <FileRow> — REMOVED (was causing repeated navbars in each file row)
// 2. globalStatus reset properly after each convert batch
// 3. Error messages now shown in UI properly
// 4. convertFile errors surface to the item.error field correctly
'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Button, Chip, CircularProgress,
  LinearProgress, Select, MenuItem, FormControl, Stack,
  IconButton, Alert, Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Navbar from '../../components/layout/Navbar';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HistoryIcon from '@mui/icons-material/History';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LockIcon from '@mui/icons-material/Lock';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import { convertFile, downloadBlob, getTargetFormats, formatFileSize } from '@/utils/converterUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getFileIcon(ext, size = 20) {
  const e = ext?.toLowerCase();
  if (e === 'pdf')                      return <PictureAsPdfIcon sx={{ fontSize: size, color: '#ef4444' }} />;
  if (['docx','doc'].includes(e))       return <ArticleIcon      sx={{ fontSize: size, color: '#2563eb' }} />;
  if (e === 'txt')                      return <TextSnippetIcon  sx={{ fontSize: size, color: '#6b7280' }} />;
  if (e === 'html')                     return <CodeIcon         sx={{ fontSize: size, color: '#d97706' }} />;
  if (['jpg','jpeg','png'].includes(e)) return <ImageIcon        sx={{ fontSize: size, color: '#059669' }} />;
  return <InsertDriveFileIcon sx={{ fontSize: size, color: '#6b7280' }} />;
}

function extBg(ext) {
  const e = ext?.toLowerCase();
  if (e === 'pdf')                      return '#1f0d0d';
  if (['docx','doc'].includes(e))       return '#0d1020';
  if (e === 'txt')                      return '#111';
  if (e === 'html')                     return '#1a1200';
  if (['jpg','jpeg','png'].includes(e)) return '#0d1f15';
  return '#13151c';
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'Just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
}

const FORMAT_PAIRS = [
  { from:'PDF',     to:'DOCX', fromColor:'#ef4444', toColor:'#2563eb', desc:'Extract text & rebuild as Word' },
  { from:'DOCX',    to:'PDF',  fromColor:'#2563eb', toColor:'#ef4444', desc:'Render Word document as PDF' },
  { from:'PDF',     to:'TXT',  fromColor:'#ef4444', toColor:'#6b7280', desc:'Extract plain text from PDF' },
  { from:'PDF',     to:'HTML', fromColor:'#ef4444', toColor:'#d97706', desc:'Convert PDF pages to HTML' },
  { from:'PDF',     to:'JPG',  fromColor:'#ef4444', toColor:'#059669', desc:'Render first page as image' },
  { from:'DOCX',    to:'TXT',  fromColor:'#2563eb', toColor:'#6b7280', desc:'Extract raw text from Word' },
  { from:'DOCX',    to:'HTML', fromColor:'#2563eb', toColor:'#d97706', desc:'Convert Word to styled HTML' },
  { from:'TXT',     to:'PDF',  fromColor:'#6b7280', toColor:'#ef4444', desc:'Wrap plain text in a PDF' },
  { from:'TXT',     to:'DOCX', fromColor:'#6b7280', toColor:'#2563eb', desc:'Wrap plain text in Word doc' },
  { from:'JPG/PNG', to:'PDF',  fromColor:'#059669', toColor:'#ef4444', desc:'Embed image in A4 PDF page' },
];

// ─── Single file row (NO Navbar inside — that was the bug) ───────────────────
function FileRow({ item, onRemove, onTargetChange, onDownload }) {
  const ext     = item.file.name.split('.').pop().toLowerCase();
  const formats = getTargetFormats(ext);

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
      p: 1.5, borderRadius: 2, transition: 'border-color 0.2s',
      background: extBg(ext),
      border: `1px solid ${
        item.status === 'done'  ? '#22c55e30' :
        item.status === 'error' ? '#ef444430' :
        'rgba(255,255,255,0.07)'
      }`,
    }}>

      {/* File icon */}
      <Box sx={{
        width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {getFileIcon(ext)}
      </Box>

      {/* File name + size */}
      <Box sx={{ flex: 1, minWidth: 80 }}>
        <Typography sx={{
          fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220,
        }}>
          {item.file.name}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#8b8fa8' }}>
          {formatFileSize(item.file.size)}
        </Typography>
      </Box>

      {/* Arrow */}
      <SwapHorizIcon sx={{ color: '#6c63ff', fontSize: 18, flexShrink: 0 }} />

      {/* Format select */}
      <FormControl size="small" sx={{
        minWidth: 160,
        '& .MuiOutlinedInput-root': {
          color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', borderRadius: 1.5,
          '& fieldset': { borderColor: item.targetFmt ? '#6c63ff60' : 'rgba(255,255,255,0.1)' },
          '&:hover fieldset': { borderColor: '#6c63ff' },
        },
        '& .MuiSvgIcon-root': { color: '#8b8fa8' },
      }}>
        <Select
          value={item.targetFmt}
          onChange={e => onTargetChange(item.id, e.target.value)}
          displayEmpty
          sx={{ fontSize: '0.78rem' }}
          disabled={item.status === 'converting' || item.status === 'done'}
        >
          <MenuItem value="" disabled sx={{ fontSize: '0.78rem' }}>Convert to…</MenuItem>
          {formats.map(f => (
            <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.78rem' }}>{f.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status */}
      <Box sx={{ flexShrink: 0, minWidth: 80 }}>
        {item.status === 'idle' && (
          <Chip label="Ready" size="small"
            sx={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', color: '#8b8fa8' }} />
        )}
        {item.status === 'converting' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <CircularProgress size={12} sx={{ color: '#6c63ff' }} />
            <Typography sx={{ fontSize: '0.7rem', color: '#a78bfa' }}>{item.progress}%</Typography>
          </Box>
        )}
        {item.status === 'done' && (
          <Button
            size="small" variant="text"
            startIcon={<FileDownloadIcon sx={{ fontSize: 12 }} />}
            onClick={() => onDownload(item)}
            sx={{ color: '#22c55e', fontSize: '0.7rem', textTransform: 'none', p: 0.5,
              '&:hover': { background: '#22c55e10' } }}
          >
            Download
          </Button>
        )}
        {item.status === 'error' && (
          <Tooltip title={item.error || 'Conversion failed'} arrow>
            <Chip label="Error" size="small"
              sx={{ fontSize: '0.65rem', background: '#ef444420', color: '#ef4444', cursor: 'help' }} />
          </Tooltip>
        )}
      </Box>

      {/* Remove button */}
      {item.status !== 'converting' && (
        <IconButton
          size="small"
          onClick={() => onRemove(item.id)}
          sx={{ color: '#8b8fa8', '&:hover': { color: '#ef4444' }, p: 0.3, flexShrink: 0 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}

      {/* Progress bar */}
      {item.status === 'converting' && (
        <Box sx={{ width: '100%', mt: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={item.progress}
            sx={{
              height: 3, borderRadius: 2,
              background: 'rgba(255,255,255,0.07)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg,#6c63ff,#a78bfa)', borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Error detail */}
      {item.status === 'error' && item.error && (
        <Box sx={{ width: '100%', mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.68rem', color: '#f87171', lineHeight: 1.4 }}>
            ⚠ {item.error}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function ConverterPage() {
  const [files,        setFiles]        = useState([]);
  const [history,      setHistory]      = useState([]);
  const [dragging,     setDragging]     = useState(false);
  const [globalStatus, setGlobalStatus] = useState('idle');
  const inputRef  = useRef();
  const idCounter = useRef(0);
  const accent = '#6c63ff';

  function makeItem(file) {
    return { id: ++idCounter.current, file, targetFmt: '', status: 'idle', progress: 0, error: '', result: null };
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList).slice(0, 5 - files.length).map(makeItem);
    setFiles(prev => [...prev, ...incoming].slice(0, 5));
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [files.length]);

  function updateItem(id, patch) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
  }

  function removeItem(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  function setTarget(id, val) {
    updateItem(id, { targetFmt: val, status: 'idle', error: '', result: null });
  }

  async function convertAll() {
    const toConvert = files.filter(f => f.targetFmt && f.status !== 'done');
    if (!toConvert.length) return;
    setGlobalStatus('converting');

    await Promise.all(toConvert.map(async (item) => {
      updateItem(item.id, { status: 'converting', progress: 10, error: '' });

      // Stepped progress simulation
      let p = 10;
      const interval = setInterval(() => {
        p = Math.min(p + 12, 82);
        updateItem(item.id, { progress: p });
      }, 600);

      try {
        const res = await convertFile(item.file, item.targetFmt);
        clearInterval(interval);
        updateItem(item.id, { status: 'done', progress: 100, result: res });

        const inputExt = item.file.name.split('.').pop().toLowerCase();
        setHistory(h => [{
          id:         Date.now() + Math.random(),
          inputName:  item.file.name,
          outputName: res.filename,
          inputExt,
          outputExt:  item.targetFmt,
          blob:       res.blob,
          timestamp:  Date.now(),
          status:     'done',
        }, ...h].slice(0, 20));

      } catch (err) {
        clearInterval(interval);
        const msg = err?.message || 'Conversion failed';
        updateItem(item.id, { status: 'error', error: msg, progress: 0 });

        const inputExt = item.file.name.split('.').pop().toLowerCase();
        setHistory(h => [{
          id:         Date.now() + Math.random(),
          inputName:  item.file.name,
          outputName: `Failed → .${item.targetFmt}`,
          inputExt,
          outputExt:  item.targetFmt,
          timestamp:  Date.now(),
          status:     'error',
        }, ...h].slice(0, 20));
      }
    }));

    setGlobalStatus('done');
  }

  function downloadItem(item) {
    if (item.result) downloadBlob(item.result.blob, item.result.filename);
    if (item.blob)   downloadBlob(item.blob, item.outputName);
  }

  function downloadAll() {
    files
      .filter(f => f.status === 'done' && f.result)
      .forEach((f, i) => setTimeout(() => downloadBlob(f.result.blob, f.result.filename), i * 400));
  }

  function clearAll() {
    setFiles([]);
    setGlobalStatus('idle');
  }

  const readyCount = files.filter(f => f.targetFmt && f.status !== 'done').length;
  const doneCount  = files.filter(f => f.status === 'done').length;

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0f14', color: '#fff', pb: 8 }}>
      {/* ONE Navbar at the top of the page — not inside FileRow */}
      <Navbar />

      {/* ── Hero ── */}
      <Box sx={{ textAlign: 'center', pt: 7, pb: 5, px: 2 }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2,
          px: 1.5, py: 0.5, borderRadius: 100,
          background: `${accent}15`, border: `1px solid ${accent}30`,
        }}>
          <AutoFixHighIcon sx={{ fontSize: 14, color: accent }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
            Free · No signup · 100% Browser-based
          </Typography>
        </Box>
        <Typography sx={{
          fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800,
          letterSpacing: '-0.03em', mb: 1.5,
          background: 'linear-gradient(135deg, #fff 20%, #8b8fa8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Free File Converter — PDF, Word, Excel & Images
        </Typography>
        <Typography 
        component="h2"
        sx={{ color: '#8b8fa8', fontSize: '1rem', maxWidth: 500, mx: 'auto' }}>
          Convert PDF, Word, images and text files directly in your browser.
          Files never leave your device.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3 }}>
        <Grid container spacing={3}>

          {/* ── Left: Converter ── */}
          <Grid  xs={12} md={7}>

            {/* Drop zone */}
            {files.length < 5 && (
              <Box
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current.click()}
                sx={{
                  border: `2px dashed ${dragging ? accent : 'rgba(108,99,255,0.3)'}`,
                  borderRadius: 3, p: 4, textAlign: 'center', cursor: 'pointer',
                  background: dragging ? `${accent}06` : 'rgba(255,255,255,0.015)',
                  mb: 2, transition: 'all 0.2s',
                  '&:hover': { borderColor: accent, background: `${accent}06` },
                }}
              >
                <input
                  ref={inputRef} type="file" multiple hidden
                  accept=".pdf,.docx,.doc,.txt,.html,.jpg,.jpeg,.png"
                  onChange={e => addFiles(e.target.files)}
                />
                <UploadFileIcon sx={{ fontSize: 42, color: accent, mb: 1, opacity: 0.85 }} />
                <Typography sx={{ fontWeight: 700, color: '#e2e8f0', mb: 0.5, fontSize: '0.95rem' }}>
                  Drop files here or click to browse
                </Typography>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.78rem', mb: 1.5 }}>
                  Up to 5 files at once · PDF, DOCX, TXT, HTML, JPG, PNG
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.7 }}>
                  {['PDF','DOCX','DOC','TXT','HTML','JPG','PNG'].map(f => (
                    <Chip key={f} label={f} size="small" sx={{
                      fontSize: '0.62rem', height: 18,
                      background: 'rgba(255,255,255,0.05)', color: '#8b8fa8',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* File list */}
            {files.length > 0 && (
              <Box>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {files.map(item => (
                    <FileRow
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onTargetChange={setTarget}
                      onDownload={downloadItem}
                    />
                  ))}
                </Stack>

                {/* Action buttons */}
                <Stack direction="row" spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={convertAll}
                    disabled={readyCount === 0 || globalStatus === 'converting'}
                    startIcon={
                      globalStatus === 'converting'
                        ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                        : <SwapHorizIcon />
                    }
                    sx={{
                      background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
                      borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.1,
                      '&:hover': { filter: 'brightness(1.1)' },
                      '&.Mui-disabled': { background: 'rgba(255,255,255,0.07)', color: '#8b8fa8' },
                    }}
                  >
                    {globalStatus === 'converting' ? 'Converting…'
                      : readyCount > 1 ? `Convert All (${readyCount})` : 'Convert File'}
                  </Button>

                  {doneCount > 1 && (
                    <Button
                      variant="outlined"
                      onClick={downloadAll}
                      startIcon={<FileDownloadIcon />}
                      sx={{
                        borderColor: '#22c55e60', color: '#22c55e',
                        borderRadius: 2, textTransform: 'none', fontWeight: 600, flexShrink: 0,
                        '&:hover': { borderColor: '#22c55e', background: '#22c55e10' },
                      }}
                    >
                      Download All
                    </Button>
                  )}

                  <IconButton
                    onClick={clearAll}
                    sx={{
                      color: '#8b8fa8',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      '&:hover': { color: '#ef4444', borderColor: '#ef444440' },
                    }}
                  >
                    <DeleteSweepIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
            )}

            {/* Supported conversions grid */}
            <Box sx={{ mt: 4 }}>
              <Typography 
              component="h3"
              sx={{
                fontWeight: 700, fontSize: '0.72rem', mb: 1.5,
                textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8b8fa8',
              }}>
                Supported Conversions
              </Typography>
              <Grid container spacing={1}>
                {FORMAT_PAIRS.map((pair, i) => (
                  <Grid  xs={6} sm={4} key={i}>
                    <Box sx={{
                      p: 1.2, background: '#13151c',
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.5 }}>
                        <Chip label={pair.from} size="small" sx={{
                          fontSize: '0.58rem', height: 18,
                          background: `${pair.fromColor}15`, color: pair.fromColor,
                          border: `1px solid ${pair.fromColor}30`,
                        }} />
                        <Typography sx={{ fontSize: '0.62rem', color: '#8b8fa8' }}>→</Typography>
                        <Chip label={pair.to} size="small" sx={{
                          fontSize: '0.58rem', height: 18,
                          background: `${pair.toColor}15`, color: pair.toColor,
                          border: `1px solid ${pair.toColor}30`,
                        }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', lineHeight: 1.4 }}>
                        {pair.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* ── Right: Features + History ── */}
          <Grid  xs={12} md={5}>

            {/* Feature cards */}
            <Box sx={{ mb: 3 }}>
              {[
                { icon: <LockIcon sx={{ fontSize: 14 }} />, label: '100% Private', desc: 'Files never leave your browser' },
                { icon: <SpeedIcon sx={{ fontSize: 14 }} />, label: 'Instant',     desc: 'No server roundtrip needed' },
                { icon: <DevicesIcon sx={{ fontSize: 14 }} />, label: 'All Devices', desc: 'Works on desktop and mobile' },
              ].map((f, i) => (
                <Box key={i} sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5,
                  p: 1.5, background: '#13151c',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 2,
                }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: 1.5, flexShrink: 0,
                    background: `${accent}15`, color: accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#e2e8f0' }}>{f.label}</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>{f.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* History panel */}
            <Box sx={{
              background: '#13151c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 3, p: 2.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon sx={{ fontSize: 16, color: '#8b8fa8' }} />
                  <Typography 
                  component="h3"
                  sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>
                    Recent Conversions
                  </Typography>
                  {history.length > 0 && (
                    <Chip label={history.length} size="small"
                      sx={{ height: 18, fontSize: '0.62rem', background: `${accent}20`, color: '#a78bfa' }} />
                  )}
                </Box>
                {history.length > 0 && (
                  <IconButton size="small" onClick={() => setHistory([])}
                    sx={{ color: '#8b8fa8', '&:hover': { color: '#ef4444' } }}>
                    <DeleteSweepIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>

              {history.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.08)', mb: 1 }} />
                  <Typography sx={{ color: '#8b8fa8', fontSize: '0.78rem' }}>
                    Converted files appear here
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {history.map(item => (
                    <Box key={item.id} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.2,
                      p: 1.1, borderRadius: 1.5,
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${item.status === 'done' ? '#22c55e18' : '#ef444418'}`,
                    }}>
                      {item.status === 'done'
                        ? <CheckCircleIcon sx={{ fontSize: 14, color: '#22c55e', flexShrink: 0 }} />
                        : <ErrorIcon       sx={{ fontSize: 14, color: '#ef4444', flexShrink: 0 }} />
                      }
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getFileIcon(item.inputExt, 12)}
                          <Typography sx={{ fontSize: '0.63rem', color: '#8b8fa8' }}>→</Typography>
                          {getFileIcon(item.outputExt, 12)}
                          <Typography sx={{
                            fontSize: '0.72rem', color: '#e2e8f0', ml: 0.3,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {item.outputName}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.62rem', color: '#6b7280' }}>
                          {timeAgo(item.timestamp)}
                        </Typography>
                      </Box>
                      {item.status === 'done' && item.blob && (
                        <IconButton size="small" onClick={() => downloadItem(item)}
                          sx={{ color: accent, p: 0.3, '&:hover': { background: `${accent}15` } }}>
                          <FileDownloadIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}