'use client';
import { Box, Typography, Chip, Button, Tooltip, IconButton } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import ResumePreview from '../resume/ResumePreview';
import DownloadRoundedIcon     from '@mui/icons-material/DownloadRounded';
import ZoomInRoundedIcon       from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon      from '@mui/icons-material/ZoomOutRounded';
import FitScreenRoundedIcon    from '@mui/icons-material/FitScreenRounded';
import LinkRoundedIcon         from '@mui/icons-material/LinkRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

export default function RightPreview({ resume, saved, onDownloadClick, isMobile }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(80);

  useEffect(() => {
    function calcFit() {
      if (!containerRef.current) return;
      const available = containerRef.current.offsetWidth - 48;
      const fit = Math.floor((available / 794) * 100);
      setZoom(Math.max(30, Math.min(fit, 100)));
    }
    calcFit();
    const ro = new ResizeObserver(calcFit);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isMobile]);

  const scale = zoom / 100;

  const tplNames = {
    minimal:'Minimal', corporate:'Corporate', creative:'Creative', tech:'Tech Pro',
    purple:'Purple Elegance', slate:'Executive Slate', marine:'Marine Blue',
    crimson:'Crimson Pro', forest:'Forest Green',
  };

  return (
    <Box sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: '#090b10', minWidth: 0,
    }}>
      {/* Topbar */}
      <Box sx={{
        px: 2, py: 0.8, borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#0d0f14', display: 'flex', alignItems: 'center',
        gap: 1, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e', boxShadow: '0 0 6px #22c55e',
            animation: 'livepulse 2s infinite', flexShrink: 0,
          }} />
          <Typography sx={{ fontSize: '0.73rem', color: '#8b8fa8', whiteSpace: 'nowrap' }}>
            Live Preview
          </Typography>
          <Chip
            label={tplNames[resume.template] || resume.template}
            size="small"
            sx={{
              fontSize: '0.63rem', height: 18,
              background: 'rgba(108,99,255,0.12)', color: '#a78bfa',
              border: '1px solid rgba(108,99,255,0.25)',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, ml: 'auto' }}>
          <Tooltip title="Zoom out">
            <IconButton onClick={() => setZoom(z => Math.max(z-10,30))} size="small"
              sx={{ color:'#8b8fa8', p:0.5, '&:hover':{color:'#f0f0f8',background:'rgba(255,255,255,0.06)'} }}>
              <ZoomOutRoundedIcon sx={{ fontSize:16 }} />
            </IconButton>
          </Tooltip>
          <Typography sx={{
            fontSize:'0.7rem', color:'#a78bfa', minWidth:38, textAlign:'center',
            background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.2)',
            borderRadius:'6px', py:'2px', px:0.5, userSelect:'none',
          }}>{zoom}%</Typography>
          <Tooltip title="Zoom in">
            <IconButton onClick={() => setZoom(z => Math.min(z+10,150))} size="small"
              sx={{ color:'#8b8fa8', p:0.5, '&:hover':{color:'#f0f0f8',background:'rgba(255,255,255,0.06)'} }}>
              <ZoomInRoundedIcon sx={{ fontSize:16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit to window">
            <IconButton onClick={() => {
              if (!containerRef.current) return;
              const av = containerRef.current.offsetWidth - 48;
              setZoom(Math.max(30, Math.min(Math.floor((av/794)*100), 100)));
            }} size="small"
              sx={{ color:'#8b8fa8', p:0.5, '&:hover':{color:'#f0f0f8',background:'rgba(255,255,255,0.06)'} }}>
              <FitScreenRoundedIcon sx={{ fontSize:16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Download CV as PDF">
          <Button size="small" onClick={onDownloadClick}
            startIcon={<DownloadRoundedIcon sx={{ fontSize:'13px !important' }} />}
            sx={{
              fontSize:'0.73rem', px:1.4, py:0.55,
              background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
              color:'#fff', whiteSpace:'nowrap', textTransform:'none', borderRadius:'8px',
              '&:hover':{transform:'translateY(-1px)',boxShadow:'0 4px 16px rgba(108,99,255,0.4)'},
              transition:'all 0.2s',
            }}>
            {isMobile ? 'PDF' : 'Download PDF'}
          </Button>
        </Tooltip>
      </Box>

      {/* ── Scroll area ── */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',   /* ← centres horizontally */
          alignItems: 'flex-start',
          py: 3,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 3 },
        }}
      >
        {/* Wrapper that collapses to the scaled width so centering works */}
        <Box sx={{ display: 'inline-block', flexShrink: 0 }}>
          <Box sx={{
            width: '794px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
            borderRadius: '2px',
            overflow: 'hidden',
            background: '#fff',
            /* Make the outer box shrink to the scaled height so scroll works */
            marginBottom: `${-(794 * 1.414 * (1 - scale))}px`,
          }}>
            <ResumePreview resume={resume} />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        px:2, py:0.7, borderTop:'1px solid rgba(255,255,255,0.06)',
        display:'flex', alignItems:'center', gap:2,
        flexShrink:0, background:'#0d0f14', flexWrap:'wrap',
      }}>
        {[
          { icon:<PictureAsPdfRoundedIcon sx={{fontSize:11}}/>, text:'A4 ready' },
          { icon:<LinkRoundedIcon sx={{fontSize:11}}/>, text:'Links clickable in PDF' },
          { icon:<Box sx={{width:7,height:7,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 4px #22c55e'}}/>, text:'Preview is live' },
        ].map(h => (
          <Box key={h.text} sx={{display:'flex',alignItems:'center',gap:0.5}}>
            <Box sx={{color:'#8b8fa8',display:'flex',alignItems:'center'}}>{h.icon}</Box>
            <Typography sx={{fontSize:'0.66rem',color:'#8b8fa8',whiteSpace:'nowrap'}}>{h.text}</Typography>
          </Box>
        ))}
      </Box>

      <style>{`@keyframes livepulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </Box>
  );
}