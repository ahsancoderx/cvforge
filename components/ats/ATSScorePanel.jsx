//components/ats/ATSScorePanel
'use client';
import { Box, Typography, LinearProgress, Chip, Collapse } from '@mui/material';
import { useState, useEffect } from 'react';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import NotesIcon from '@mui/icons-material/Notes';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BoltIcon from '@mui/icons-material/Bolt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { calculateATSScore } from '../../utils/atsScorer';

const ICON_MAP = {
  'Contact Information': <ContactPageIcon sx={{ fontSize: '1rem' }} />,
  'Professional Summary': <NotesIcon sx={{ fontSize: '1rem' }} />,
  'Work Experience': <WorkIcon sx={{ fontSize: '1rem' }} />,
  'Education': <SchoolIcon sx={{ fontSize: '1rem' }} />,
  'Skills': <BoltIcon sx={{ fontSize: '1rem' }} />,
  'Completeness & Extras': <EmojiEventsIcon sx={{ fontSize: '1rem' }} />,
};

// ── Animated Score Ring ────────────────────────────────────
function ScoreRing({ score, color, size = 130 }) {
  const [animated, setAnimated] = useState(0);
  const r = 50;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const dash = (animated / 100) * circ;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, mx: 'auto' }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="2"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)', filter: 'blur(4px)', opacity: 0.4 }}
        />
      </svg>
      <Box sx={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.04em' }}>
          {score}
        </Typography>
        <Typography sx={{ fontSize: '0.62rem', color: '#8b8fa8', letterSpacing: '0.08em', fontWeight: 600 }}>
          / 100
        </Typography>
      </Box>
    </Box>
  );
}

// ── Category Row ───────────────────────────────────────────
function CategoryRow({ cat, index }) {
  const [open, setOpen] = useState(false);
  const [animated, setAnimated] = useState(false);
  const pct = Math.round((cat.score / cat.max) * 100);
  const color = cat.status === 'great' ? '#22c55e' : cat.status === 'good' ? '#6c63ff' : '#ef4444';
  const bgColor = cat.status === 'great' ? 'rgba(34,197,94,0.06)' : cat.status === 'good' ? 'rgba(108,99,255,0.06)' : 'rgba(239,68,68,0.06)';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), index * 80 + 300);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <Box sx={{
      mb: 1,
      background: bgColor,
      border: `1px solid ${color}22`,
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      <Box
        onClick={() => cat.suggestions.length > 0 && setOpen(!open)}
        sx={{
          p: '10px 12px 8px',
          cursor: cat.suggestions.length > 0 ? 'pointer' : 'default',
          '&:hover': cat.suggestions.length > 0 ? { background: `${color}0d` } : {},
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
          <Box sx={{ color, display: 'flex', alignItems: 'center' }}>
            {ICON_MAP[cat.category] || <BoltIcon sx={{ fontSize: '1rem' }} />}
          </Box>
          <Typography sx={{ fontSize: '0.78rem', color: '#f0f0f8', flex: 1, fontWeight: 600 }}>
            {cat.category}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Typography sx={{ fontSize: '0.72rem', color, fontWeight: 800 }}>
              {cat.score}/{cat.max}
            </Typography>
            <Box sx={{
              px: 0.8, py: 0.2,
              background: `${color}20`,
              borderRadius: '4px',
              fontSize: '0.6rem',
              color,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {cat.status}
            </Box>
            {cat.suggestions.length > 0 && (
              <Box sx={{ color: '#8b8fa8', display: 'flex', alignItems: 'center' }}>
                {open
                  ? <ExpandLessIcon sx={{ fontSize: '0.9rem' }} />
                  : <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />
                }
              </Box>
            )}
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={animated ? pct : 0}
          sx={{
            height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              borderRadius: 2,
              transition: 'transform 0.8s cubic-bezier(0.34,1.2,0.64,1) !important',
            },
          }}
        />
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 1.5, pb: 1.2, borderTop: `1px solid ${color}15` }}>
          {cat.suggestions.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.8 }}>
              <Box sx={{
                width: 16, height: 16, borderRadius: '50%',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, mt: '1px',
              }}>
                <Typography sx={{ fontSize: '0.55rem', color: '#f59e0b' }}>!</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.55 }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Grade Badge ────────────────────────────────────────────
function GradeBadge({ grade, color }) {
  return (
    <Box sx={{
      width: 48, height: 48, borderRadius: '12px',
      background: `${color}15`,
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 20px ${color}30`,
    }}>
      <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color, lineHeight: 1 }}>{grade}</Typography>
    </Box>
  );
}

// ── Main Export ────────────────────────────────────────────
export default function ATSScorePanel({ resume, fileName }) {
  const result = calculateATSScore(resume);
  const allSuggestions = result.categories.flatMap((c) => c.suggestions);
  const goodCount = result.categories.filter((c) => c.status === 'great').length;
  const weakCount = result.categories.filter((c) => c.status === 'weak').length;

  return (
    <Box sx={{
      height: '100%',
      overflowY: 'auto',
      background: '#0d0f17',
      p: { xs: 2, md: 2.5 },
    }}>
      {/* File Badge */}
      {fileName && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, mb: 2,
          p: '8px 12px',
          background: 'rgba(108,99,255,0.08)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '8px',
        }}>
          <DescriptionIcon sx={{ fontSize: '1rem', color: '#a78bfa' }} />
          <Typography sx={{
            fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {fileName}
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#f0f0f8', letterSpacing: '-0.02em' }}>
            ATS Score
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>
            Applicant Tracking System Analysis
          </Typography>
        </Box>
        <Chip
          label={result.label}
          size="small"
          sx={{
            fontSize: '0.7rem',
            background: `${result.color}18`,
            color: result.color,
            border: `1px solid ${result.color}40`,
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}
        />
      </Box>

      {/* Score Ring + Grade */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 1.5 }}>
        <ScoreRing score={result.score} color={result.color} />
        <Box>
          <GradeBadge grade={result.grade} color={result.color} />
          <Typography sx={{ fontSize: '0.7rem', color: '#8b8fa8', textAlign: 'center', mt: 0.8 }}>Grade</Typography>
        </Box>
      </Box>

      <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#8b8fa8', mb: 0.5 }}>
        {result.totalScore} of {result.totalMax} points
      </Typography>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5, mt: 1.5 }}>
        {[
          { label: 'Passed', value: goodCount, color: '#22c55e' },
          { label: 'Issues', value: weakCount, color: '#ef4444' },
          { label: 'Tips', value: allSuggestions.length, color: '#f59e0b' },
        ].map((stat) => (
          <Box key={stat.label} sx={{
            flex: 1, textAlign: 'center',
            p: '8px 4px',
            background: `${stat.color}0d`,
            border: `1px solid ${stat.color}22`,
            borderRadius: '8px',
          }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#8b8fa8', mt: 0.3, fontWeight: 600 }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mb: 2 }} />

      {/* Category Breakdown */}
      <Typography sx={{
        fontSize: '0.68rem', fontWeight: 800, color: '#8b8fa8',
        textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.2,
      }}>
        Section Breakdown
      </Typography>

      {result.categories.map((cat, i) => (
        <CategoryRow key={cat.category} cat={cat} index={i} />
      ))}

      {/* Suggestions Summary */}
      {allSuggestions.length > 0 && (
        <>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mt: 2, mb: 2 }} />
          <Typography sx={{
            fontSize: '0.68rem', fontWeight: 800, color: '#8b8fa8',
            textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.2,
          }}>
            All Suggestions ({allSuggestions.length})
          </Typography>
          {allSuggestions.map((s, i) => (
            <Box key={i} sx={{
              display: 'flex', gap: 1, mb: 0.8,
              p: '9px 10px',
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.12)',
              borderRadius: '8px',
            }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#f59e0b', flexShrink: 0 }}>💡</Typography>
              <Typography sx={{ fontSize: '0.76rem', color: '#d1d5db', lineHeight: 1.55 }}>{s}</Typography>
            </Box>
          ))}
        </>
      )}

      {allSuggestions.length === 0 && (
        <Box sx={{
          mt: 2, p: 2,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <Typography sx={{ fontSize: '1.2rem', mb: 0.5 }}>🎉</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 700 }}>
            Outstanding Resume!
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#86efac', mt: 0.3 }}>
            No major ATS issues found.
          </Typography>
        </Box>
      )}

      {/* Footer note */}
      <Box sx={{ mt: 2.5, mb: 2, p: 1.5, background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>
          ATS score is based on content completeness, keywords, and structure.
          Scores above 70 pass most automated screening systems.
        </Typography>
      </Box>
    </Box>
  );
}