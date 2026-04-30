'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { loadResume } from '../../utils/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(null);

  useEffect(() => { setSaved(loadResume()); }, []);

  const tplColor = { minimal: '#6c63ff', corporate: '#1a1a2e', creative: '#f59e0b', tech: '#059669' };
  const tplLabel = { minimal: 'Minimal', corporate: 'Corporate', creative: 'Creative', tech: 'Tech Pro' };

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0f14' }}>
      <Navbar />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.8rem' }}>My Resumes</Typography>
          <Typography sx={{ color: '#8b8fa8', fontSize: '0.9rem', mt: 0.5 }}>Manage and edit your CVs</Typography>
        </Box>
        <Button variant="contained" onClick={() => router.push('/editor')}
          sx={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
          + New CV
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box onClick={() => router.push('/editor')} sx={{
            border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 3, minHeight: 220,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 1.5, cursor: 'pointer', transition: 'all 0.25s',
            '&:hover': { borderColor: '#6c63ff', background: 'rgba(108,99,255,0.05)' },
          }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: '#1a1d27',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: '#8b8fa8' }}>+</Box>
            <Typography sx={{ color: '#8b8fa8', fontSize: '0.85rem' }}>Create New CV</Typography>
          </Box>
        </Grid>

        {saved && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box onClick={() => router.push('/editor')} sx={{
              background: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3,
              overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s',
              '&:hover': { borderColor: 'rgba(108,99,255,0.4)', transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)' },
            }}>
              <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${tplColor[saved.template] || '#6c63ff'}22, ${tplColor[saved.template] || '#6c63ff'}11)` }}>
                <Box sx={{ width: 85, height: 110, background: '#fff', borderRadius: 1,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)', p: '6px', overflow: 'hidden' }}>
                  <Box sx={{ height: 6, background: tplColor[saved.template], borderRadius: 1, mb: '4px' }} />
                  {[0.6, 0.9, 0.5, 0.8, 0.4, 0.75].map((w, i) => (
                    <Box key={i} sx={{ height: 4, background: i === 0 ? '#e5e7eb' : '#f3f4f6',
                      width: `${w * 100}%`, borderRadius: 1, mb: '3px' }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{saved.personal.name || 'Untitled'}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#8b8fa8' }}>{saved.personal.title || 'No title'}</Typography>
                <Box sx={{ display: 'flex', gap: 0.7, mt: 1 }}>
                  <Chip label={tplLabel[saved.template] || 'Minimal'} size="small"
                    sx={{ fontSize: '0.7rem', background: 'rgba(108,99,255,0.15)', color: '#a78bfa', height: 22 }} />
                  <Chip label="Auto-saved" size="small"
                    sx={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', height: 22 }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}