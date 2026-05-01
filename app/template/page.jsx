'use client';
import { useState } from 'react';
import { Box, Typography, Button, Chip, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { loadResume, saveResume } from '../../utils/storage';
import { DEFAULT_RESUME } from '../../data/defaultResume';
import {
  MinimalTemplate, CorporateTemplate, CreativeTemplate, TechTemplate,
  PurpleTemplate, SlateTemplate, MarineTemplate, CrimsonTemplate,
  ForestTemplate, NavyaTemplate,
} from '../../components/template/AllTemplates';

// ─── Template map ──────────────────────────────────────────────
const TPL_MAP = {
  minimal:   MinimalTemplate,
  corporate: CorporateTemplate,
  creative:  CreativeTemplate,
  tech:      TechTemplate,
  purple:    PurpleTemplate,
  slate:     SlateTemplate,
  marine:    MarineTemplate,
  crimson:   CrimsonTemplate,
  forest:    ForestTemplate,
  navya:     NavyaTemplate,
};

// ─── All templates list (NavyaTemplate added) ──────────────────
const TEMPLATES = [
  { id:'minimal',   name:'Minimal',         tag:'Most Popular', accent:'#6c63ff',
    desc:'Clean, ATS-friendly, timeless. Suitable for any industry.',    category:'All Roles' },
  { id:'corporate', name:'Corporate',        tag:'Enterprise',   accent:'#1e3a5f',
    desc:'Two-column sidebar — ideal for senior & enterprise roles.',     category:'Business' },
  { id:'creative',  name:'Creative',         tag:'Bold',         accent:'#f59e0b',
    desc:'Bold gradient header — for designers & marketers.',             category:'Creative' },
  { id:'tech',      name:'Tech Pro',         tag:'Engineers',    accent:'#059669',
    desc:'Monospace code-style sections for software engineers.',         category:'Tech' },
  { id:'purple',    name:'Deep Purple',      tag:'Elegant',      accent:'#4a1942',
    desc:'Photo-first two-column layout — refined and distinctive.',      category:'All Roles' },
  { id:'slate',     name:'Executive Slate',  tag:'Executive',    accent:'#475569',
    desc:'Dark header + gradient accent for senior executives.',          category:'Business' },
  { id:'marine',    name:'Marine Blue',      tag:'Professional', accent:'#0369a1',
    desc:'Dark sidebar with card-style experience entries.',              category:'Tech' },
  { id:'crimson',   name:'Crimson Pro',      tag:'Classic',      accent:'#9f1239',
    desc:'Centered serif header — elegant & traditional.',               category:'Creative' },
  { id:'forest',    name:'Forest Green',     tag:'Fresh',        accent:'#166534',
    desc:'Nature-inspired dark header with green accents.',              category:'All Roles' },
  { id:'navya',     name:'Navya Classic',    tag:'Academic',     accent:'#1a1a2e',
    desc:'Clean centered layout — perfect for academia & internships.',   category:'Academic' },
];

const CATEGORIES = ['All', 'All Roles', 'Business', 'Tech', 'Creative', 'Academic'];

// ─── Preview resume ────────────────────────────────────────────
const PREVIEW_RESUME = {
  ...DEFAULT_RESUME,
  personal:{
    name:'Alex Rivera', title:'Senior Software Engineer',
    email:'alex@email.com', phone:'+1 415 555 0123',
    location:'San Francisco, CA', linkedin:'linkedin.com/in/alexrivera',
    github:'github.com/alexrivera', portfolio:'', twitter:'', photo:'',
  },
  summary:'Experienced software engineer with 6+ years building scalable systems at Fortune 500 companies. Passionate about clean architecture and shipping products that users love.',
  experience:[
    { id:'1', role:'Senior Engineer', company:'Meta Platforms', date:'2021–Present', desc:'Led development of real-time messaging serving 400M+ users. Reduced API latency by 38%.' },
    { id:'2', role:'Software Engineer', company:'Stripe', date:'2019–2021', desc:'Built payment infrastructure handling $2B+ monthly transactions.' },
  ],
  education:[{ id:'1', degree:'B.S. Computer Science', school:'UC Berkeley', date:'2014–2018', desc:"GPA 3.8 — Dean's List." }],
  skills:['JavaScript','TypeScript','React','Node.js','Python','GraphQL','Docker','AWS'],
  projects:[{ id:'1', name:'OpenMetrics', link:'github.com/alexrivera/openmetrics', desc:'Open-source tool with 2k+ GitHub stars built with React and D3.js.' }],
  certifications:[{ id:'1', name:'AWS Solutions Architect', org:'Amazon', date:'2022' }],
  languages:[{ id:'1', name:'English', level:'Native' },{ id:'2', name:'Spanish', level:'Fluent' }],
  sections:{ personal:true, summary:true, experience:true, education:true, skills:true, projects:true, certifications:true, languages:true },
};

// ─── TemplateCard ──────────────────────────────────────────────
function TemplateCard({ t, onUse, index }) {
  const [hovered, setHovered] = useState(false);
  const Template = TPL_MAP[t.id];

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0c0e16',
        border: `1.5px solid ${hovered ? t.accent : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? `0 28px 72px ${t.accent}28, 0 0 0 1px ${t.accent}22`
          : '0 2px 20px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-7px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
        position: 'relative',
        animation: 'fadeSlideUp 0.45s ease forwards',
        animationDelay: `${index * 55}ms`,
        opacity: 0,
        '@keyframes fadeSlideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => onUse(t.id)}
    >
      {/* Top accent line */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 10,
        background: `linear-gradient(90deg, ${t.accent}, ${t.accent}55, transparent)`,
        opacity: hovered ? 1 : 0.35,
        transition: 'opacity 0.3s',
      }} />

      {/* ── Preview area — full width, zero left gap ── */}
      <Box sx={{
        height: 310, overflow: 'hidden', position: 'relative',
        background: '#f4f4f4', flexShrink: 0,
      }}>
        {/* Scale wrapper: origin top-left so no white gap on left */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0,
          width: '860px',
          height: '1200px',
          transform: 'scale(0.36)',
          transformOrigin: 'top left',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {Template && (
            <Template resume={{ ...PREVIEW_RESUME, template: t.id, colorTheme: t.accent }} />
          )}
        </Box>

        {/* Bottom fade into card background */}
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 90,
          background: 'linear-gradient(to bottom, transparent, #0c0e16)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Tag badge top-right */}
        <Chip label={t.tag} size="small" sx={{
          position: 'absolute', top: 10, right: 10, zIndex: 5,
          fontSize: '0.6rem', height: 21, fontWeight: 700, letterSpacing: '0.03em',
          background: `${t.accent}20`, color: t.accent,
          border: `1px solid ${t.accent}50`,
          backdropFilter: 'blur(8px)',
        }} />

        {/* Category badge top-left */}
        <Chip label={t.category} size="small" sx={{
          position: 'absolute', top: 10, left: 10, zIndex: 5,
          fontSize: '0.57rem', height: 19, fontWeight: 600,
          background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.65)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(6px)',
        }} />

        {/* Hover CTA overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hovered ? `${t.accent}12` : 'transparent',
          transition: 'background 0.2s',
        }}>
          <Box sx={{
            px: 2.5, py: 0.9, borderRadius: 2,
            background: t.accent,
            color: '#fff', fontSize: '0.78rem', fontWeight: 700,
            boxShadow: `0 8px 24px ${t.accent}55`,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.88)',
            transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            Use Template →
          </Box>
        </Box>
      </Box>

      {/* ── Card footer info ── */}
      <Box sx={{
        p: '14px 16px 16px',
        background: '#0c0e16',
        borderTop: `1px solid rgba(255,255,255,0.05)`,
        flex: 1, display: 'flex', flexDirection: 'column',
      }}>
        {/* Name row with colour dot */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: t.accent,
            boxShadow: `0 0 10px ${t.accent}cc`,
          }} />
          <Typography sx={{
            fontWeight: 700, fontSize: '0.93rem', color: '#f1f5f9',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            {t.name}
          </Typography>
        </Box>

        <Typography sx={{
          color: '#475569', fontSize: '0.73rem', lineHeight: 1.55,
          fontFamily: '"DM Sans", sans-serif', mb: 1.5, flex: 1,
        }}>
          {t.desc}
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          onClick={e => { e.stopPropagation(); onUse(t.id); }}
          sx={{
            borderColor: hovered ? t.accent : 'rgba(255,255,255,0.09)',
            color: hovered ? t.accent : '#64748b',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.78rem',
            py: 0.85,
            fontFamily: '"DM Sans", sans-serif',
            background: hovered ? `${t.accent}0d` : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: t.accent,
              color: t.accent,
              background: `${t.accent}12`,
            },
          }}
        >
          Use This Template →
        </Button>
      </Box>
    </Box>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────
export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  function useTemplate(id) {
    const current = loadResume() || { ...DEFAULT_RESUME };
    saveResume({ ...current, template: id });
    router.push('/editor');
  }

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#080a10',
      color: '#fff',
      // Remove any default margin/padding that causes left gap
      margin: 0,
      padding: 0,
    }}>
      <Navbar />

      {/* ── Hero section ── */}
      <Box sx={{ textAlign: 'center', pt: 6, pb: 3, px: 2, position: 'relative' }}>
        {/* Purple ambient radial glow */}
        <Box sx={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 320,
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Chip label={`${TEMPLATES.length} Templates · Real Live Preview`} size="small" sx={{
          mb: 2,
          background: 'rgba(108,99,255,0.1)',
          color: '#a78bfa',
          border: '1px solid rgba(108,99,255,0.22)',
          fontSize: '0.71rem', fontWeight: 600,
        }} />

        <Typography sx={{
          fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
          fontWeight: 800,
          fontFamily: '"Playfair Display", serif',
          background: 'linear-gradient(135deg, #fff 30%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1.5,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
        }}>
          Choose Your Template
        </Typography>

        <Typography sx={{
          color: '#475569', fontSize: '0.95rem', mb: 3,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          What you see in the preview is exactly what you get — pixel-perfect PDF export
        </Typography>

        {/* Category filter */}
        <Box sx={{
          display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: 0.9,
        }}>
          {CATEGORIES.map(cat => (
            <Box
              key={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                px: 2, py: 0.65, borderRadius: '100px',
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                transition: 'all 0.18s',
                background: activeCategory === cat ? '#6c63ff' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? '#fff' : '#64748b',
                border: `1px solid ${activeCategory === cat ? '#6c63ff' : 'rgba(255,255,255,0.07)'}`,
                userSelect: 'none',
                '&:hover': {
                  background: activeCategory === cat ? '#6c63ff' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                },
              }}
            >
              {cat}
              {activeCategory === cat && (
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  ({filtered.length})
                </span>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Templates Grid — full width, no left gap ── */}
      <Box sx={{
        width: '100%',
        // Use padding not margin so it doesn't create white sides
        px: { xs: 2, sm: 3, md: 4 },
        pb: 8,
        boxSizing: 'border-box',
      }}>
        <Grid
          container
          spacing={2.5}
          // CRITICAL: reset MUI Grid's negative margin that causes left whitespace
          sx={{ mx: 0, width: '100%' }}
        >
          {filtered.map((t, i) => (
            <Grid
              item
              xs={12} sm={6} md={4} lg={3}
              key={t.id}
              sx={{
                // Ensure grid item doesn't add extra padding-left
                display: 'flex',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <TemplateCard t={t} onUse={useTemplate} index={i} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12, color: '#334155' }}>
            <Typography sx={{ fontSize: '1rem', fontFamily: '"DM Sans", sans-serif' }}>
              No templates in this category yet.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Footer note ── */}
      <Box sx={{ textAlign: 'center', pb: 5 }}>
        <Typography sx={{
          color: '#1e293b', fontSize: '0.72rem',
          fontFamily: '"DM Sans", sans-serif',
        }}>
          Switch templates anytime from the editor · All {TEMPLATES.length} templates export as pixel-perfect PDF
        </Typography>
      </Box>
    </Box>
  );
}