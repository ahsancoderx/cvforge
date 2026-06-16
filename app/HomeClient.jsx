'use client';
import { Box, Typography, Button, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import SlideshowRoundedIcon from '@mui/icons-material/SlideshowRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaTiktok } from "react-icons/fa";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';

/* ──────────────────────────────────────────────── */
/*  DATA                                            */
/* ──────────────────────────────────────────────── */


const FEATURES = [
  {
    icon: <PaletteRoundedIcon sx={{ fontSize: 26 }} />,
    title: '4 Pro Templates',
    desc: 'Minimal, Corporate, Creative, Tech Pro — all ATS-ready.',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)',
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Live Preview',
    desc: 'Every keystroke updates your resume preview instantly.',
    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
  },
  {
    icon: <VerifiedRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'ATS-Friendly',
    desc: 'Clean formatting that passes Applicant Tracking Systems.',
    color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)',
  },
  {
    icon: <SaveRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Auto-Save',
    desc: 'Your data persists automatically via localStorage.',
    color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)',
  },
  {
    icon: <PrintRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'PDF Export',
    desc: 'One-click print to PDF via browser — pixel-perfect.',
    color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)',
  },
  {
    icon: <TuneRoundedIcon sx={{ fontSize: 26 }} />,
    title: 'Full Control',
    desc: 'Toggle sections, add entries, customize everything.',
    color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)',
  },
];

const STATS = [
  { icon: <PeopleRoundedIcon sx={{ fontSize: 22, color: '#a78bfa' }} />, value: '50K+', label: 'Resumes Created' },
  { icon: <StarRoundedIcon sx={{ fontSize: 22, color: '#f59e0b' }} />, value: '4.9★', label: 'Average Rating' },
  { icon: <TrendingUpRoundedIcon sx={{ fontSize: 22, color: '#34d399' }} />, value: '3×', label: 'More Interviews' },
];

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Microsoft', 'Stripe', 'Airbnb'];

const CONVERTERS = [
  {
    from: 'PDF', to: 'Word',
    fromIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <DescriptionRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#f87171', toColor: '#60a5fa',
    desc: 'Convert PDF documents to fully editable Word (.docx) files in seconds.',
    badge: 'Most Popular', badgeColor: '#a78bfa',
    route: '/converter',
  },
  {
    from: 'Word', to: 'PDF',
    fromIcon: <DescriptionRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#60a5fa', toColor: '#f87171',
    desc: 'Turn Word documents into professional PDFs with formatting intact.',
    badge: null, route: '/converter',
  },
  {
    from: 'PDF', to: 'Excel',
    fromIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <TableChartRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#f87171', toColor: '#34d399',
    desc: 'Extract tables and data from PDFs into editable Excel spreadsheets.',
    badge: 'New', badgeColor: '#34d399',
    route: '/converter',
  },
  {
    from: 'PDF', to: 'PPT',
    fromIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <SlideshowRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#f87171', toColor: '#fb923c',
    desc: 'Transform PDF presentations back into editable PowerPoint slides.',
    badge: null, route: '/converter',
  },
  {
    from: 'Image', to: 'PDF',
    fromIcon: <ImageRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#c084fc', toColor: '#f87171',
    desc: 'Combine JPG, PNG, or WEBP images into a single professional PDF.',
    badge: null, route: '/converter',
  },
  {
    from: 'PDF', to: 'Image',
    fromIcon: <PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />,
    toIcon: <ImageRoundedIcon sx={{ fontSize: 28 }} />,
    fromColor: '#f87171', toColor: '#c084fc',
    desc: 'Export each PDF page as a high-resolution JPG or PNG image.',
    badge: null, route: '/converter',
  },
];

//  FIX 1: Objects with { label, href } — not plain strings
const FOOTER_LINKS = {
  Product: [
    { label: 'CV Builder',     href: '/editor' },
    { label: 'Templates',      href: '/resume-templates' },
    { label: 'File Converter', href: '/converter' },
    { label: 'Potfolio',      href: 'https://ahsanali-dev.vercel.app/' },
  ],
  Company: [
    { label: 'About',    href: '/about' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Contact',  href: 'https://ahsanali-dev.vercel.app/' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/cookies' },
  ],
};

/* ──────────────────────────────────────────────── */
/*  CONVERTER CARD                                  */
/* ──────────────────────────────────────────────── */

function ConverterCard({ conv, router }) {
  return (
    <Box
      onClick={() => router.push(conv.route)}
      sx={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        p: 3,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(167,139,250,0.25)',
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
        },
        '&:hover .arrow-icon': { opacity: 1, transform: 'translateX(0)' },
      }}
    >
      {conv.badge && (
        <Chip
          label={conv.badge}
          size="small"
          sx={{
            position: 'absolute', top: 14, right: 14,
            background: `${conv.badgeColor}18`,
            border: `1px solid ${conv.badgeColor}40`,
            color: conv.badgeColor,
            fontSize: '0.68rem', fontWeight: 700, height: 22,
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
          px: 1.5, py: 1, borderRadius: '10px',
          background: `${conv.fromColor}14`, border: `1px solid ${conv.fromColor}30`,
        }}>
          <Box sx={{ color: conv.fromColor }}>{conv.fromIcon}</Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: conv.fromColor, letterSpacing: '0.06em' }}>
            {conv.from}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{
            width: '100%', height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(167,139,250,0.4), rgba(255,255,255,0.05))',
            position: 'relative',
          }}>
            <ArrowForwardRoundedIcon sx={{
              fontSize: 16, color: '#a78bfa',
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              background: '#151720', padding: '2px',
            }} />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
          px: 1.5, py: 1, borderRadius: '10px',
          background: `${conv.toColor}14`, border: `1px solid ${conv.toColor}30`,
        }}>
          <Box sx={{ color: conv.toColor }}>{conv.toIcon}</Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: conv.toColor, letterSpacing: '0.06em' }}>
            {conv.to}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0f0f8', mb: 0.75 }}>
        {conv.from} to {conv.to}
      </Typography>
      <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.65 }}>
        {conv.desc}
      </Typography>

      <Box className="arrow-icon" sx={{
        display: 'flex', alignItems: 'center', gap: 0.5,
        mt: 2, color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600,
        opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.25s',
      }}>
        Convert Now <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
      </Box>
    </Box>
  );
}

/* ──────────────────────────────────────────────── */
/*  FOOTER                                          */
/* ──────────────────────────────────────────────── */

function Footer() {
  const [copied, setCopied] = useState(false);
  const JAZZCASH = '03271348097';

  const handleCopy = () => {
    navigator.clipboard.writeText(JAZZCASH);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,11,16,0.9)',
        pt: { xs: 8, md: 10 },
        pb: 4,
        px: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>

        {/* Donate strip */}
        <Box sx={{
          mb: 8, borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(167,139,250,0.06) 100%)',
          border: '1px solid rgba(167,139,250,0.2)',
          p: { xs: 3, md: 4 },
          display: 'flex', flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' }, gap: 3,
          position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', right: -60, top: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />

          <Box sx={{
            width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
            background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FavoriteRoundedIcon sx={{ fontSize: 26, color: '#f87171' }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, color: '#f0f0f8', fontSize: '1rem', mb: 0.4 }}>
              If this tool helped you, consider supporting 
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.83rem', lineHeight: 1.6 }}>
              This project is free forever. To keep the servers running and add full PDF-to-Word
              conversion, your support means everything.
            </Typography>
          </Box>

          <Box sx={{
            flexShrink: 0, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
            p: 2, minWidth: 220,
          }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mb: 0.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              JazzCash · Pakistan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '6px', px: 1, py: 0.25 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>JAZZ</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#f0f0f8', fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                {JAZZCASH}
              </Typography>
              <Tooltip title={copied ? 'Copied!' : 'Copy number'} placement="top">
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{
                    color: copied ? '#34d399' : '#6b7280',
                    '&:hover': { color: '#a78bfa', background: 'rgba(167,139,250,0.1)' },
                    transition: 'all 0.2s', p: 0.5,
                  }}
                >
                  <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography sx={{ fontSize: '0.72rem', color: '#6b7280' }}>
              Name:{' '}
              <Box component="span" sx={{ color: '#d1d5db', fontWeight: 600 }}>Ahsan Ali</Box>
            </Typography>
          </Box>
        </Box>

        {/* ✅ FIX 2 + FIX 3: Grid size syntax + link.label / link.href */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#f0f0f8', mb: 1.5, letterSpacing: '-0.02em' }}>
              CV<Box component="span" sx={{ color: '#a78bfa' }}>Studio</Box>
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.83rem', lineHeight: 1.8, maxWidth: 280, mb: 2.5 }}>
              Build professional resumes and convert files — all in one free, no-signup studio.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <GitHubIcon sx={{ fontSize: 18 }} />, href: 'https://github.com/ahsancoderx' },
               { icon: <FaTiktok size={18} />, href: 'https://www.tiktok.com/@ahsantech74' },
                { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, href: 'https://www.linkedin.com/in/ahsan-ali-mern-stack-developer/' },
                {icon :<WorkIcon sx={{fontSize:18}}/> , href:'https://ahsanali-dev.vercel.app/'}
              ].map((s, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={s.href}
                  size="small"
                  sx={{
                    color: '#6b7280',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    '&:hover': { color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.06)' },
                    transition: 'all 0.2s',
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 'auto' }} key={section} sx={{ minWidth: 130 }}>
              <Typography sx={{
                fontWeight: 700, fontSize: '0.75rem', color: '#a78bfa',
                letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2,
              }}>
                {section}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {links.map((link) => (
                  //  key=link.label (string), href=link.href, children=link.label
                  <Typography
                    key={link.label}
                    component="a"
                    href={link.href}
                    sx={{
                      color: '#6b7280', fontSize: '0.83rem',
                      textDecoration: 'none', transition: 'color 0.2s',
                      '&:hover': { color: '#d1d5db' },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#4b5563', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} CVStudio. Made with{' '}
            <FavoriteRoundedIcon sx={{ fontSize: 11, color: '#f87171', mx: 0.3, verticalAlign: 'middle' }} />
            {' '}by Ahsan Ali · Pakistan
          </Typography>
          <Typography sx={{ color: '#4b5563', fontSize: '0.78rem' }}>
            Free forever · No signup required
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ──────────────────────────────────────────────── */
/*  MAIN PAGE                                       */
/* ──────────────────────────────────────────────── */

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0f14', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <Box sx={{ position: 'relative', textAlign: 'center', pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 }, px: 2 }}>
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

        <Chip
          icon={<StarRoundedIcon sx={{ fontSize: '14px !important', color: '#a78bfa !important' }} />}
          label="Design CVs Like Canva  Free Forever"
          sx={{
            mb: 3, px: 1,
            background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.3)',
            color: '#a78bfa', fontSize: '0.76rem', fontWeight: 500, letterSpacing: '0.02em',
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />

        <Typography variant="h1"
        aria-label="Create ATS-Friendly Resumes Online for Free — Trusted by Top Companies"
         sx={{
          
          fontSize: { xs: '2rem', sm: '2.8rem', md: '3.8rem' },
          fontWeight: 800, lineHeight: 1.12, mb: 2.5, letterSpacing: '-0.03em', color: '#f0f0f8',
        }}>
          Create ATS-Friendly Resumes Online for Free
          <br />
          <Box component="span" sx={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #6c63ff 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Top Companies
          </Box>
        </Typography>

        <Typography sx={{
          color: '#8b8fa8', fontSize: { xs: '0.95rem', md: '1.08rem' },
          maxWidth: 520, mx: 'auto', mb: 4.5, lineHeight: 1.75,
        }}>
          A professional resume studio with live preview, beautiful templates, and ATS-friendly
          formatting plus a powerful file converter.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
          <Button
            variant="contained" size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => router.push('/resume-templates')}
            sx={{
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              px: 3.5, py: 1.2, borderRadius: '12px',
              textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
              boxShadow: '0 6px 24px rgba(108,99,255,0.4)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(108,99,255,0.5)' },
              transition: 'all 0.25s',
            }}
          >
            Start Building Free
          </Button>
          <Button
            variant="outlined" size="large"
            onClick={() => router.push('/resume-templates')}
            sx={{
              borderColor: 'rgba(255,255,255,0.15)', color: '#d1d5f0',
              px: 3, py: 1.2, borderRadius: '12px',
              textTransform: 'none', fontWeight: 600, fontSize: '0.95rem',
              '&:hover': { borderColor: '#a78bfa', color: '#a78bfa', background: 'rgba(167,139,250,0.06)', transform: 'translateY(-1px)' },
              transition: 'all 0.25s',
            }}
          >
            Browse Templates
          </Button>
        </Box>

        <Box sx={{
          display: 'inline-flex', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap', justifyContent: 'center',
          px: { xs: 2, sm: 4 }, py: 2, borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {STATS.map((s) => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {s.icon}
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#f0f0f8', lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Marquee ──────────────────────────────────── */}
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
            <Typography key={i} sx={{
              color: 'rgba(139,143,168,0.45)', fontSize: '0.78rem',
              fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {c}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* ── CV Builder Features ───────────────────────── */}
      <Box sx={{ maxWidth: 1060, mx: 'auto', px: { xs: 2, md: 3 }, pb: { xs: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="CV Builder" size="small" sx={{
            mb: 2, background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa', fontSize: '0.72rem', fontWeight: 700,
          }} />
          <Typography variant="h2" sx={{
            fontSize: { xs: '1.7rem', md: '2.4rem' }, fontWeight: 800,
            mb: 1, letterSpacing: '-0.02em', color: '#f0f0f8',
          }}>
            Free Resume Builder|Everything You Need
          </Typography>
          <Typography sx={{ color: '#8b8fa8', fontSize: '1rem' }}>
            A full studio for your professional story
          </Typography>
        </Box>

        {/* ✅ FIX 2: size={{ xs, sm, md }} — no item prop */}
        <Grid container spacing={2}>
          {FEATURES.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Box sx={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', p: 3, height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  borderColor: f.border, transform: 'translateY(-5px)',
                  background: f.bg, boxShadow: `0 12px 40px ${f.border}`,
                },
                '&:hover .fi': { transform: 'scale(1.1) rotate(-5deg)' },
              }}>
                <Box className="fi" sx={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: f.bg, border: `1px solid ${f.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, mb: 2, transition: 'transform 0.3s ease',
                }}>
                  {f.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, mb: 0.75, fontSize: '0.95rem', color: '#f0f0f8' }}>{f.title}</Typography>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.83rem', lineHeight: 1.65 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── File Converter Section ────────────────────── */}
      <Box sx={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(108,99,255,0.04) 50%, transparent 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        py: { xs: 8, md: 12 },
      }}>
        <Box sx={{ maxWidth: 1060, mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip
              icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '14px !important', color: '#34d399 !important' }} />}
              label="File Converter"
              size="small"
              sx={{
                mb: 2, background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)', color: '#34d399',
                fontSize: '0.72rem', fontWeight: 700,
                '& .MuiChip-icon': { ml: 0.5 },
              }}
            />
            <Typography variant="h2" sx={{
              fontSize: { xs: '1.7rem', md: '2.4rem' }, fontWeight: 800,
              mb: 1.5, letterSpacing: '-0.02em', color: '#f0f0f8',
            }}>
              Convert Any File Instantly
            </Typography>
            <Typography sx={{ color: '#8b8fa8', fontSize: '1rem', maxWidth: 500, mx: 'auto', lineHeight: 1.75 }}>
              PDF, Word, Excel, PowerPoint, Images — convert between formats with one click. No signup. No watermark.
            </Typography>
          </Box>

          {/* ✅ FIX 2: size={{ xs: 12, sm: 6 }} */}
          <Grid container spacing={2.5}>
            {CONVERTERS.map((conv) => (
              <Grid size={{ xs: 12, sm: 6 }} key={`${conv.from}-${conv.to}`}>
                <ConverterCard conv={conv} router={router} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{
            mt: 4, p: 2.5, borderRadius: '14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}>
            <Typography sx={{ color: '#4b5563', fontSize: '0.82rem' }}>
              <Box component="span" sx={{ color: '#a78bfa', fontWeight: 700 }}>More converters coming soon —</Box>{' '}
              HTML → PDF, Markdown → Word, CSV → Excel, and more.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <Box sx={{ textAlign: 'center', py: { xs: 8, md: 10 }, px: 2 }}>
        <Typography sx={{ color: '#8b8fa8', mb: 2, fontSize: '0.9rem' }}>
          Ready to land your dream job?
        </Typography>
        <Button
          variant="contained" size="large"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => router.push('/resume-templates')}
          sx={{
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            px: 4, py: 1.3, borderRadius: '12px',
            textTransform: 'none', fontWeight: 700, fontSize: '0.95rem',
            boxShadow: '0 6px 24px rgba(108,99,255,0.4)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(108,99,255,0.5)' },
            transition: 'all 0.25s',
          }}
        >
          Create My CV Now
        </Button>
      </Box>

      {/* ── Footer ───────────────────────────────────── */}
      <Footer />
    </Box>
  );
}