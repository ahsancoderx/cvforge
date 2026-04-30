'use client';
import { Box, Typography, Grid, Button, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { TEMPLATES } from '../../data/templates';
import { loadResume, saveResume } from '../../utils/storage';
import { DEFAULT_RESUME } from '../../data/defaultResume';

export default function TemplatesPage() {
  const router = useRouter();

  // accent color map — keyed by template id
  const accent = {
    minimal:   '#6c63ff',
    corporate: '#a78bfa',
    creative:  '#f59e0b',
    tech:      '#059669',
    purple:    '#4a1942',
    purple2:   '#4a1942',
  };

  function useTemplate(id) {
    const current = loadResume() || { ...DEFAULT_RESUME };
    saveResume({ ...current, template: id });
    router.push('/editor');
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0f14' }}>
      <Navbar />
      <Box sx={{ textAlign: 'center', pt: 5, pb: 3, px: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '2rem', mb: 1 }}>Choose Your Template</Typography>
        <Typography sx={{ color: '#8b8fa8', fontSize: '0.9rem' }}>Select a style that fits your industry</Typography>
      </Box>
      <Grid container spacing={2.5} sx={{ maxWidth: 1200, mx: 'auto', px: 3, pb: 6 }}>
        {TEMPLATES.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Box sx={{
              background: '#13151c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.25s',
              '&:hover': {
                borderColor: `${accent[t.id]}60`,
                transform: 'translateY(-5px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              },
            }}>
              {/* Preview thumbnail */}
              <Box sx={{
                height: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1d27, #222636)',
                position: 'relative',
              }}>
                <Box sx={{
                  width: 110, height: 155, background: '#fff', borderRadius: 1,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', p: '8px', overflow: 'hidden',
                }}>
                  <Box sx={{
                    height: 24, background: accent[t.id],
                    borderRadius: '2px 2px 0 0',
                    mx: -1, mt: -1, mb: 1,
                    display: 'flex', alignItems: 'center', px: 1,
                  }}>
                    <Box sx={{ width: '60%', height: 3, background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
                  </Box>
                  {[0.8, 0.55, 0.9, 0.45, 0.7, 0.4, 0.85, 0.5].map((w, i) => (
                    <Box key={i} sx={{
                      height: 3, width: `${w * 100}%`, borderRadius: 1, mb: '4px',
                      background: i % 4 === 0 ? accent[t.id] : '#e5e7eb',
                      opacity: i % 4 === 0 ? 1 : 0.6,
                    }} />
                  ))}
                </Box>
                <Chip
                  label={t.tag}
                  size="small"
                  sx={{
                    position: 'absolute', top: 10, right: 10,
                    fontSize: '0.65rem',
                    background: `${accent[t.id]}22`,
                    color: accent[t.id],
                    border: `1px solid ${accent[t.id]}40`,
                    height: 22,
                  }}
                />
              </Box>

              {/* Info + button */}
              <Box sx={{ p: 1.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.4 }}>{t.name}</Typography>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.78rem', mb: 1.2, lineHeight: 1.5 }}>{t.desc}</Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => useTemplate(t.id)}
                  sx={{
                    background: accent[t.id],
                    fontSize: '0.82rem',
                    py: 0.7,
                    textTransform: 'none',
                    '&:hover': { background: accent[t.id], filter: 'brightness(1.15)' },
                  }}
                >
                  Use This Template
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}