'use client';
import { Box, Typography, Button, Grid, Chip } from '@mui/material';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';

const FEATURES = [
  {
    icon: <PaletteRoundedIcon sx={{ fontSize: 26 }} />,
    title: '4 Pro Templates',
    desc: 'Minimal, Corporate, Creative, Tech Pro — all ATS-ready.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Live Preview',
    desc: 'Every keystroke updates your resume preview instantly.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    icon: <VerifiedRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'ATS-Friendly',
    desc: 'Clean formatting that passes Applicant Tracking Systems.',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
  },
  {
    icon: <SaveRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Auto-Save',
    desc: 'Your data persists automatically via localStorage.',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
  },
  {
    icon: <PrintRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'PDF Export',
    desc: 'One-click print to PDF via browser — pixel-perfect.',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
  },
  {
    icon: <TuneRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Full Control',
    desc: 'Toggle sections, add entries, customize everything.',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
  },
];

const STATS = [
  { icon: <PeopleRoundedIcon sx={{ fontSize: 22, color: '#a78bfa' }} />, value: '50K+',  label: 'Resumes Created' },
  { icon: <StarRoundedIcon sx={{ fontSize: 22, color: '#f59e0b' }} />,    value: '4.9★', label: 'Average Rating' },
  { icon: <TrendingUpRoundedIcon sx={{ fontSize: 22, color: '#34d399' }} />, value: '3×', label: 'More Interviews' },
];

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Microsoft', 'Stripe', 'Airbnb'];

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0f14', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <Box sx={{ position: 'relative', textAlign: 'center', pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 }, px: 2 }}>

        {/* Ambient orbs */}
        <Box sx={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.13) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Box sx={{
          position: 'absolute', top: 80, left: '15%',
          width: 180, height: 180, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
        <Box sx={{
          position: 'absolute', top: 60, right: '10%',
          width: 220, height: 220, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />

        {/* Badge */}
        <Chip
          icon={<StarRoundedIcon sx={{ fontSize: '14px !important', color: '#a78bfa !important' }} />}
          label="Design CVs Like Canva — Free Forever"
          sx={{
            mb: 3, px: 1,
            background: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.3)',
            color: '#a78bfa',
            fontSize: '0.76rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />

        {/* Headline */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.8rem' },
            fontWeight: 800,
            lineHeight: 1.12,
            mb: 2.5,
            letterSpacing: '-0.03em',
            color: '#f0f0f8',
          }}
        >
          Build CVs That Get You Into
          <br />
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #6c63ff 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Top Companies
          </Box>
        </Typography>

        {/* Subtext */}
        <Typography
          sx={{
            color: '#8b8fa8',
            fontSize: { xs: '0.95rem', md: '1.08rem' },
            maxWidth: 520,
            mx: 'auto',
            mb: 4.5,
            lineHeight: 1.75,
          }}
        >
          A professional resume studio with live preview, beautiful templates,
          and ATS-friendly formatting for Google, Meta, and beyond.
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => router.push('/editor')}
            sx={{
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              px: 3.5, py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 6px 24px rgba(108,99,255,0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px rgba(108,99,255,0.5)',
                background: 'linear-gradient(135deg, #7c73ff, #b79bfa)',
              },
              transition: 'all 0.25s',
            }}
          >
            Start Building Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/templates')}
            sx={{
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#d1d5f0',
              px: 3, py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                borderColor: '#a78bfa',
                color: '#a78bfa',
                background: 'rgba(167,139,250,0.06)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.25s',
            }}
          >
            Browse Templates
          </Button>
        </Box>

        {/* Stats Row */}
        <Box sx={{
          display: 'inline-flex',
          gap: { xs: 2, sm: 4 },
          flexWrap: 'wrap',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: 2,
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {STATS.map((s) => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {s.icon}
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#f0f0f8', lineHeight: 1.1 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Marquee Trust Strip ───────────────────────── */}
      <Box sx={{
        overflow: 'hidden', py: 2, mb: 2,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Box sx={{
          display: 'flex', gap: 5, width: 'max-content',
          animation: 'marquee 18s linear infinite',
          '@keyframes marquee': {
            from: { transform: 'translateX(0)' },
            to: { transform: 'translateX(-50%)' },
          },
        }}>
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <Typography
              key={i}
              sx={{
                color: 'rgba(139,143,168,0.45)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* ── Features Grid ─────────────────────────────── */}
      <Box sx={{ maxWidth: 1020, mx: 'auto', px: { xs: 2, md: 3 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.7rem', md: '2.4rem' },
              fontWeight: 800,
              mb: 1,
              letterSpacing: '-0.02em',
              color: '#f0f0f8',
            }}
          >
            Everything You Need
          </Typography>
          <Typography sx={{ color: '#8b8fa8', fontSize: '1rem' }}>
            A full studio for your professional story
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {FEATURES.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    borderColor: f.border,
                    transform: 'translateY(-5px)',
                    background: f.bg,
                    boxShadow: `0 12px 40px ${f.border}`,
                  },
                  '&:hover .feature-icon-wrap': {
                    transform: 'scale(1.1) rotate(-5deg)',
                  },
                }}
              >
                {/* Icon */}
                <Box
                  className="feature-icon-wrap"
                  sx={{
                    width: 48, height: 48,
                    borderRadius: '12px',
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color,
                    mb: 2,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {f.icon}
                </Box>

                <Typography sx={{ fontWeight: 700, mb: 0.75, fontSize: '0.95rem', color: '#f0f0f8' }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.83rem', lineHeight: 1.65 }}>
                  {f.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography sx={{ color: '#8b8fa8', mb: 2, fontSize: '0.9rem' }}>
            Ready to land your dream job?
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => router.push('/editor')}
            sx={{
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              px: 4, py: 1.3,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 6px 24px rgba(108,99,255,0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(108,99,255,0.5)',
              },
              transition: 'all 0.25s',
            }}
          >
            Create My CV Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}