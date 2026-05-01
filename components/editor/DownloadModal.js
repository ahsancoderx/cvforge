'use client';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { exportResumeToPDF } from '../../utils/pdfExport';

const COLOR_THEMES = [
  { label:'Template Default', value: null },
  { label:'Indigo',   value:'#6c63ff' },
  { label:'Emerald',  value:'#059669' },
  { label:'Rose',     value:'#e11d48' },
  { label:'Amber',    value:'#d97706' },
  { label:'Sky',      value:'#0284c7' },
  { label:'Violet',   value:'#7c3aed' },
  { label:'Slate',    value:'#475569' },
];

export default function DownloadModal({ open, onClose, resume }) {
  const [mode,    setMode]    = useState('color');
  const [theme,   setTheme]   = useState(null);  // null = use template default
  const [loading, setLoading] = useState(false);

  function handleDownload() {
    setLoading(true);
    // Build the resume object with the correct color theme
    const r = {
      ...resume,
      colorTheme: mode === 'bw' ? null : (theme !== undefined ? theme : resume.colorTheme),
    };
    // Pass both the modified resume AND the colorMode ('color' or 'bw')
    exportResumeToPDF(r, mode);
    setTimeout(() => { setLoading(false); onClose(); }, 800);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx:{
        background:'#13151c', border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:3, m: 2,
      }}}>
      <DialogTitle sx={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontFamily:'"Playfair Display",serif', fontSize:'1.1rem', pb:1,
      }}>
        Download CV as PDF
        <IconButton onClick={onClose} size="small" sx={{ color:'#8b8fa8' }}>
          <CloseRoundedIcon sx={{ fontSize:18 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>

        {/* Mode selector */}
        <Typography sx={{ fontSize:'0.7rem', fontWeight:700, color:'#8b8fa8',
          textTransform:'uppercase', letterSpacing:'0.07em', mb:1 }}>
          Color Mode
        </Typography>
        <Box sx={{ display:'flex', gap:1, mb:2.5 }}>
          {[
            { val:'color', label:'🎨 Full Color',    sub:'All template colors preserved' },
            { val:'bw',    label:'⬛ Black & White', sub:'Classic monochrome' },
          ].map(m => (
            <Box key={m.val} onClick={() => setMode(m.val)} sx={{
              flex:1, p:1.5, borderRadius:2, cursor:'pointer', textAlign:'center',
              border: mode===m.val ? '2px solid #6c63ff' : '1px solid rgba(255,255,255,0.1)',
              background: mode===m.val ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.03)',
              transition:'all 0.2s',
            }}>
              <Typography sx={{ fontSize:'0.85rem', mb:0.3 }}>{m.label}</Typography>
              <Typography sx={{ fontSize:'0.65rem', color:'#8b8fa8' }}>{m.sub}</Typography>
            </Box>
          ))}
        </Box>

        {/* Color swatches */}
        {mode === 'color' && (
          <>
            <Typography sx={{ fontSize:'0.7rem', fontWeight:700, color:'#8b8fa8',
              textTransform:'uppercase', letterSpacing:'0.07em', mb:1 }}>
              Accent Color
            </Typography>
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.8, mb:2.5 }}>
              {COLOR_THEMES.map(ct => (
                <Tooltip key={ct.label} title={ct.label}>
                  <Box
                    onClick={() => setTheme(ct.value)}
                    sx={{
                      width:32, height:32, borderRadius:'50%', cursor:'pointer',
                      background: ct.value
                        ? ct.value
                        : 'conic-gradient(#6c63ff 0deg,#f59e0b 120deg,#059669 240deg,#6c63ff 360deg)',
                      border: theme===ct.value ? '3px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                      transition:'transform 0.15s, border 0.15s',
                      '&:hover':{ transform:'scale(1.15)' },
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}
                  >
                    {ct.value===null && (
                      <Typography sx={{ fontSize:'0.42rem', color:'#fff', fontWeight:700, lineHeight:1.2, textAlign:'center' }}>
                        AUTO
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </>
        )}

        {/* Info */}
        <Box sx={{ p:1.5, background:'rgba(34,197,94,0.07)',
          border:'1px solid rgba(34,197,94,0.2)', borderRadius:2, mb:2 }}>
          <Typography sx={{ fontSize:'0.74rem', color:'#d1d5db', lineHeight:1.75 }}>
            ✅ PDF downloads directly — no browser dialog<br/>
            🎨 Full colors & layout exactly as shown in preview<br/>
            🔗 All links (email, LinkedIn, GitHub) are clickable<br/>
            📄 A4 format, print-ready
          </Typography>
        </Box>

        <Button fullWidth variant="contained" onClick={handleDownload} disabled={loading}
          sx={{
            background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
            py:1.2, fontSize:'0.9rem', fontWeight:700, textTransform:'none',
            '&:hover':{ transform:'translateY(-1px)', boxShadow:'0 8px 20px rgba(108,99,255,0.4)' },
          }}>
          {loading ? 'Generating PDF...' : '⬇ Download PDF'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Need to import Tooltip at top:
import { Tooltip } from '@mui/material';