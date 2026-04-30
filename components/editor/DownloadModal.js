// components/editor/DownloadModal.js
'use client';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { exportResumeToPDF } from '../../utils/pdfExport';

const COLOR_THEMES = [
  { label: 'Template Default', value: null },
  { label: 'Indigo',  value: '#6c63ff' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Rose',    value: '#e11d48' },
  { label: 'Amber',   value: '#d97706' },
  { label: 'Sky',     value: '#0284c7' },
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Slate',   value: '#475569' },
];

export default function DownloadModal({ open, onClose, resume }) {
  const [mode,    setMode]    = useState('color');
  const [theme,   setTheme]   = useState(null);
  const [loading, setLoading] = useState(false);

  function handleDownload() {
    setLoading(true);
    // Pass color theme override into resume object
    const r = {
      ...resume,
      colorTheme: mode === 'bw' ? null : (theme !== undefined ? theme : resume.colorTheme),
    };
    exportResumeToPDF(r, mode);
    setTimeout(() => { setLoading(false); onClose(); }, 800);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { background: '#13151c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', pb: 1 }}>
        Download CV as PDF
      </DialogTitle>
      <DialogContent>

        {/* Mode */}
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#8b8fa8',
          textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
          Color Mode
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
          {[
            { val: 'color', label: '🎨 Full Color', sub: 'Preserves all template colors' },
            { val: 'bw',    label: '⬛ Black & White', sub: 'Classic monochrome' },
          ].map((m) => (
            <Box key={m.val} onClick={() => setMode(m.val)} sx={{
              flex: 1, p: 1.5, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
              border: mode === m.val ? '2px solid #6c63ff' : '1px solid rgba(255,255,255,0.1)',
              background: mode === m.val ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s',
            }}>
              <Typography sx={{ fontSize: '0.88rem', mb: 0.3 }}>{m.label}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#8b8fa8' }}>{m.sub}</Typography>
            </Box>
          ))}
        </Box>

        {/* Accent color swatches */}
        {mode === 'color' && (
          <>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#8b8fa8',
              textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
              Accent Color Override
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
              {COLOR_THEMES.map((ct) => (
                <Box
                  key={ct.label}
                  onClick={() => setTheme(ct.value)}
                  title={ct.label}
                  sx={{
                    width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                    background: ct.value || 'conic-gradient(#6c63ff,#f59e0b,#059669,#e11d48,#6c63ff)',
                    border: theme === ct.value ? '3px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                    transition: 'transform 0.15s, border 0.15s',
                    '&:hover': { transform: 'scale(1.15)' },
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {ct.value === null && (
                    <Typography sx={{ fontSize: '0.48rem', color: '#fff', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
                      AUTO
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Info box */}
        <Box sx={{ p: 1.5, background: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.2)', borderRadius: 2, mb: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#d1d5db', lineHeight: 1.7 }}>
            ✅ CV opens in a <strong style={{ color: '#22c55e' }}>new tab</strong> with full colors<br />
            🖨 Click <strong style={{ color: '#22c55e' }}>"Save as PDF"</strong> or press <strong style={{ color: '#22c55e' }}>Ctrl+P</strong><br />
            🔗 All links stay <strong style={{ color: '#22c55e' }}>clickable</strong> in the saved PDF<br />
            📄 Set paper size to <strong style={{ color: '#22c55e' }}>A4</strong>, margins to <strong style={{ color: '#22c55e' }}>None</strong>
          </Typography>
        </Box>

        <Button fullWidth variant="contained" onClick={handleDownload} disabled={loading}
          sx={{
            background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
            py: 1.2, fontSize: '0.9rem', fontWeight: 700,
            '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 8px 20px rgba(108,99,255,0.4)' },
          }}>
          {loading ? 'Opening...' : '🚀 Open CV & Download PDF'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}