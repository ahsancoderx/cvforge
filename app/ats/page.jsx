'use client';
import { Box, Typography, Grid, Fade, useMediaQuery, useTheme, Drawer, IconButton } from '@mui/material';
import { useCallback, useState } from 'react';
import BoltIcon from '@mui/icons-material/Bolt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ATSScorePanel from '../../components/ats/ATSScorePanel';
import UploadPanel from '../../components/ats/UploadPanel';
import ParsedResumeView from '../../components/ats/ParsedResumeView';

export default function ATSPage() {
  const [resume, setResume] = useState(null);
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [view, setView] = useState('upload');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleResumeParsed = useCallback(({ resume, rawText, fileName }) => {
    setResume(resume);
    setRawText(rawText);
    setFileName(fileName);
    setView('results');
    setDrawerOpen(false);
  }, []);

  const handleReset = () => {
    setResume(null);
    setRawText('');
    setFileName('');
    setView('upload');
    setDrawerOpen(false);
  };

  const TOPBAR_HEIGHT = 56;

  const ScorePanel = (
    <ATSScorePanel resume={resume} fileName={fileName} />
  );

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0b0f',
      fontFamily: '"DM Sans", sans-serif',
      overflow: 'hidden',
    }}>
      {/* ── Top Bar ── */}
      <Box sx={{
        height: TOPBAR_HEIGHT,
        minHeight: TOPBAR_HEIGHT,
        flexShrink: 0,
        px: { xs: 2, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,11,15,0.95)',
        backdropFilter: 'blur(16px)',
        zIndex: 200,
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BoltIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: '1.1rem',
            letterSpacing: '-0.02em', color: '#fff',
          }}>
            ATS<span style={{ color: '#6c63ff' }}>Check</span>
          </Typography>
        </Box>

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {view === 'results' && (
            <>
              {/* Mobile: hamburger to toggle score panel */}
              {isMobile && (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', p: 0.7 }}
                >
                  <AssessmentIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              )}
              <Box
                onClick={handleReset}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: { xs: 1.5, md: 2 }, py: 0.7,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  color: '#8b8fa8',
                  transition: 'all 0.2s',
                  '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' },
                }}
              >
                <UploadFileIcon sx={{ fontSize: '0.9rem' }} />
                {!isMobile && 'Upload New CV'}
              </Box>
            </>
          )}
          <Box sx={{
            px: { xs: 1.5, md: 2 }, py: 0.7,
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.1))',
            border: '1px solid rgba(108,99,255,0.35)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#a78bfa',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            Free ATS Analyzer
          </Box>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {view === 'upload' ? (
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <UploadPanel onResumeParsed={handleResumeParsed} />
          </Box>
        ) : (
          <Fade in timeout={400}>
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>

              {/* ── Desktop: side-by-side ── */}
              {!isMobile && (
                <>
                  {/* Left Score Panel */}
                  <Box sx={{
                    width: { md: 340, lg: 380, xl: 420 },
                    flexShrink: 0,
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    overflowY: 'auto',
                    background: '#0d0f17',
                    height: '100%',
                  }}>
                    {ScorePanel}
                  </Box>

                  {/* Right Parsed View */}
                  <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    background: '#0d0f17',
                    height: '100%',
                  }}>
                    <ParsedResumeView resume={resume} rawText={rawText} fileName={fileName} />
                  </Box>
                </>
              )}

              {/* ── Mobile: full parsed view + drawer for score ── */}
              {isMobile && (
                <>
               <Box
  sx={{
    display: 'flex',
    flexDirection: {
      xs: 'column', // Mobile = vertical
      sm: 'column', // Small tablets = vertical
      md: 'row',    // Desktop = horizontal
    },
    height: '100%',
    gap: 2,
  }}
>
  <Box
    sx={{
      flex: 1,
      overflowY: 'auto',
      background: '#0d0f17',
      minHeight: {
        xs: '50vh',
        md: 'auto',
      },
      borderRadius: 2,
    }}
  >
    <ATSScorePanel resume={resume} fileName={fileName} />
  </Box>

  <Box
    sx={{
      flex: 1,
      overflowY: 'auto',
      background: '#0d0f17',
      minHeight: {
        xs: '50vh',
        md: 'auto',
      },
      borderRadius: 2,
    }}
  >
    <ParsedResumeView
      resume={resume}
      rawText={rawText}
      fileName={fileName}
    />
  </Box>
</Box>

                  <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{
                      sx: {
                        width: '85vw',
                        maxWidth: 380,
                        background: '#0d0f17',
                        borderLeft: '1px solid rgba(255,255,255,0.07)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                      <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#8b8fa8' }}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    {ScorePanel}
                  </Drawer>
                </>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}