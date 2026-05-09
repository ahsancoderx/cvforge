'use client';
// app/aggregate-calculator/[university]/UniversityCalculatorClient.jsx

import { useState } from 'react';
import Link from 'next/link';
import {
  Box, Container, Grid, Card, CardContent, Typography,
  TextField, Button, Chip, LinearProgress, Divider, Breadcrumbs,
} from '@mui/material';
import HomeRoundedIcon         from '@mui/icons-material/HomeRounded';
import CalculateRoundedIcon    from '@mui/icons-material/CalculateRounded';
import CheckCircleRoundedIcon  from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon       from '@mui/icons-material/CancelRounded';
import RefreshRoundedIcon      from '@mui/icons-material/RefreshRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import OpenInNewRoundedIcon    from '@mui/icons-material/OpenInNewRounded';
import { universities, calculateAggregate } from '@/utils/universityData';

const STATUS = {
  Excellent:      { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  icon: '🎉' },
  Good:           { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  icon: '👍' },
  Borderline:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '⚠️' },
  'Not Eligible': { color: '#f87171', bg: 'rgba(248,113,113,0.1)',icon: '❌' },
};

// Shared link style used in the sidebar list
const sidebarLinkSx = {
  display: 'flex', alignItems: 'center', gap: 1.5,
  py: 1.1, px: 1.2, borderRadius: '9px',
  textDecoration: 'none',
  transition: 'background 0.15s',
  '&:hover': { background: 'rgba(255,255,255,0.04)' },
};

export default function UniversityCalculatorClient({ uni }) {
  const [values, setValues] = useState({ matric: '', inter: '', entryTest: '' });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    uni.fields.forEach((f) => {
      const v = parseFloat(values[f.key]);
      if (!values[f.key])         errs[f.key] = 'Required';
      else if (isNaN(v) || v < 0) errs[f.key] = 'Enter a valid number';
      else if (v > f.max)         errs[f.key] = `Max is ${f.max}`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    setResult(calculateAggregate(uni, {
      matric:    parseFloat(values.matric),
      inter:     parseFloat(values.inter),
      entryTest: parseFloat(values.entryTest),
    }));
  };

  const handleReset = () => {
    setValues({ matric: '', inter: '', entryTest: '' });
    setResult(null);
    setErrors({});
  };

  const onChange = (key) => (e) => {
    setValues((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const sc = result ? STATUS[result.status] : null;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d18 100%)', pt: { xs: 3, md: 5 }, pb: 12 }}>
      <Container maxWidth="lg">

        {/* ── Breadcrumbs — no legacyBehavior, no <a> child ── */}
        <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.25)' } }}>
          <Link href="/" style={{ color: '#8b8fa8', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', textDecoration: 'none' }}>
            <HomeRoundedIcon sx={{ fontSize: 13 }} /> Home
          </Link>
          <Link href="/aggregate-calculator" style={{ color: '#8b8fa8', fontSize: '0.8rem', textDecoration: 'none' }}>
            Aggregate Calculator
          </Link>
          <Typography sx={{ color: '#c4c4d4', fontSize: '0.8rem' }}>{uni.name}</Typography>
        </Breadcrumbs>

        {/* MUI v6: alignItems goes on container only via sx, size replaces item+xs/md */}
        <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>

          {/* ══ LEFT ══ */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '15px', background: `${uni.accentColor}18`, border: `1px solid ${uni.accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                  {uni.logo}
                </Box>
                <Box>
                  <Typography component="h1" sx={{ color: '#f0f0f8', fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    {uni.name}
                  </Typography>
                  <Typography sx={{ color: '#8b8fa8', fontSize: '0.82rem' }}>{uni.fullName}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, background: `${uni.accentColor}10`, border: `1px solid ${uni.accentColor}22`, borderRadius: '9px', px: 1.8, py: 1 }}>
                <CalculateRoundedIcon sx={{ fontSize: 15, color: uni.accentColor }} />
                <Typography sx={{ color: uni.accentColor, fontSize: '0.78rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {uni.formulaLabel}
                </Typography>
              </Box>
            </Box>

            {/* Input Card */}
            <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', mb: 3 }}>
              <CardContent sx={{ p: '26px !important' }}>
                <Typography sx={{ color: '#f0f0f8', fontWeight: 700, fontSize: '1rem', mb: 3 }}>
                  Enter Your Marks
                </Typography>

                <Grid container spacing={2}>
                  {uni.fields.map((field) => (
                    <Grid size={12} key={field.key}>
                      <TextField
                        fullWidth
                        label={`${field.label} (max ${field.max})`}
                        placeholder={field.placeholder}
                        type="number"
                        value={values[field.key]}
                        onChange={onChange(field.key)}
                        error={!!errors[field.key]}
                        helperText={errors[field.key]}
                        // MUI v6: use slotProps.htmlInput instead of inputProps
                        slotProps={{ htmlInput: { min: 0, max: field.max, step: 'any' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255,255,255,0.04)', borderRadius: '11px', color: '#f0f0f8',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.09)' },
                            '&:hover fieldset': { borderColor: `${uni.accentColor}55` },
                            '&.Mui-focused fieldset': { borderColor: uni.accentColor },
                          },
                          '& .MuiInputLabel-root': { color: '#8b8fa8' },
                          '& .MuiInputLabel-root.Mui-focused': { color: uni.accentColor },
                          '& .MuiFormHelperText-root': { color: '#f87171' },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                  <Button
                    fullWidth variant="contained" size="large"
                    onClick={handleCalculate}
                    startIcon={<CalculateRoundedIcon />}
                    sx={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', borderRadius: '11px', py: 1.4, fontWeight: 700, fontSize: '0.95rem', textTransform: 'none', boxShadow: '0 6px 20px rgba(108,99,255,0.35)', '&:hover': { boxShadow: '0 8px 28px rgba(108,99,255,0.5)' } }}
                  >
                    Calculate Aggregate
                  </Button>
                  {result && (
                    <Button
                      variant="outlined" size="large" onClick={handleReset}
                      startIcon={<RefreshRoundedIcon />}
                      sx={{ borderRadius: '11px', py: 1.4, borderColor: 'rgba(255,255,255,0.12)', color: '#8b8fa8', textTransform: 'none', '&:hover': { borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)' } }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Result Card */}
            {result && (
              <Card sx={{ background: sc.bg, border: `1px solid ${sc.color}28`, borderRadius: '18px' }}>
                <CardContent sx={{ p: '26px !important' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography sx={{ color: '#8b8fa8', fontSize: '0.78rem', mb: 0.5 }}>Your Aggregate</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography sx={{ color: sc.color, fontWeight: 900, fontSize: '3.2rem', lineHeight: 1, letterSpacing: '-0.03em' }}>
                          {result.aggregate}
                        </Typography>
                        <Typography sx={{ color: '#8b8fa8', fontSize: '1.1rem', fontWeight: 600 }}>%</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>{sc.icon}</Typography>
                      <Chip label={result.status} sx={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}35`, fontWeight: 700, fontSize: '0.78rem' }} />
                    </Box>
                  </Box>

                  {/* Progress bar */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography sx={{ color: '#8b8fa8', fontSize: '0.72rem' }}>0%</Typography>
                      <Typography sx={{ color: '#8b8fa8', fontSize: '0.72rem' }}>Min: {uni.minAggregate}%&nbsp;&nbsp;|&nbsp;&nbsp;You: {result.aggregate}%</Typography>
                      <Typography sx={{ color: '#8b8fa8', fontSize: '0.72rem' }}>100%</Typography>
                    </Box>
                    <Box sx={{ position: 'relative' }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(parseFloat(result.aggregate), 100)}
                        sx={{ height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { borderRadius: 5, background: `linear-gradient(90deg, #6c63ff, ${sc.color})` } }}
                      />
                      <Box sx={{ position: 'absolute', top: '50%', left: `${uni.minAggregate}%`, transform: 'translate(-50%, -50%)', width: 2, height: 16, background: 'rgba(255,255,255,0.35)', borderRadius: 1 }} />
                    </Box>
                  </Box>

                  {/* Score Breakdown */}
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2.5 }} />
                  <Typography sx={{ color: '#8b8fa8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}>
                    Score Breakdown
                  </Typography>
                  <Grid container spacing={1.5}>
                    {[
                      { label: 'Matric',       pct: result.matricPercent, w: uni.formula.matric },
                      { label: 'Intermediate', pct: result.interPercent,  w: uni.formula.inter },
                      { label: uni.entryTest,  pct: result.testPercent,   w: uni.formula.entryTest },
                    ].map((item) => (
                      <Grid size={4} key={item.label}>
                        <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '11px', p: 1.5, textAlign: 'center' }}>
                          <Typography sx={{ color: '#f0f0f8', fontWeight: 700, fontSize: '1.15rem' }}>{item.pct}%</Typography>
                          <Typography sx={{ color: '#8b8fa8', fontSize: '0.67rem' }}>{item.label}</Typography>
                          <Typography sx={{ color: uni.accentColor, fontSize: '0.67rem', fontWeight: 600 }}>×{item.w}%</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Eligibility */}
                  <Box sx={{ mt: 2.5, p: 1.8, background: result.isEligible ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)', border: `1px solid ${result.isEligible ? 'rgba(74,222,128,0.22)' : 'rgba(248,113,113,0.22)'}`, borderRadius: '11px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {result.isEligible
                      ? <CheckCircleRoundedIcon sx={{ color: '#4ade80', fontSize: 20 }} />
                      : <CancelRoundedIcon      sx={{ color: '#f87171', fontSize: 20 }} />
                    }
                    <Typography sx={{ color: result.isEligible ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '0.85rem' }}>
                      {result.isEligible
                        ? `You meet ${uni.name}'s minimum aggregate of ${uni.minAggregate}%`
                        : `You need ${(uni.minAggregate - parseFloat(result.aggregate)).toFixed(2)}% more to reach the ${uni.minAggregate}% minimum`
                      }
                    </Typography>
                  </Box>

                </CardContent>
              </Card>
            )}
          </Grid>

          {/* ══ RIGHT — Sidebar ══ */}
          <Grid size={{ xs: 12, md: 5 }}>

            {/* University info */}
            <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', mb: 3 }}>
              <CardContent sx={{ p: '22px !important' }}>
                <Typography sx={{ color: '#f0f0f8', fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>About {uni.name}</Typography>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.85rem', lineHeight: 1.7, mb: 2.5 }}>{uni.description}</Typography>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />

                {[
                  { label: 'Location',      value: uni.city },
                  { label: 'Entry Test',    value: uni.entryTest },
                  { label: 'Min Aggregate', value: `${uni.minAggregate}%` },
                ].map((row) => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                    <Typography sx={{ color: '#8b8fa8', fontSize: '0.8rem' }}>{row.label}</Typography>
                    <Typography sx={{ color: '#f0f0f8', fontSize: '0.8rem', fontWeight: 600 }}>{row.value}</Typography>
                  </Box>
                ))}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

                <Typography sx={{ color: '#8b8fa8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1.5 }}>
                  Programs Offered
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {uni.programs.map((p) => (
                    <Chip key={p} label={p} size="small" sx={{ background: `${uni.accentColor}14`, color: uni.accentColor, border: `1px solid ${uni.accentColor}22`, fontSize: '0.7rem', height: 24 }} />
                  ))}
                </Box>

                <Button
                  fullWidth variant="outlined"
                  endIcon={<OpenInNewRoundedIcon />}
                  href={uni.website} target="_blank" rel="noopener noreferrer"
                  sx={{ mt: 2.5, borderRadius: '10px', borderColor: 'rgba(255,255,255,0.1)', color: '#8b8fa8', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: `${uni.accentColor}50`, color: uni.accentColor, background: `${uni.accentColor}08` } }}
                >
                  Official Website
                </Button>
              </CardContent>
            </Card>

            {/* Other calculators — no legacyBehavior, no nested <a> */}
            <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px' }}>
              <CardContent sx={{ p: '22px !important' }}>
                <Typography sx={{ color: '#8b8fa8', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 2 }}>
                  Other Calculators
                </Typography>

                {universities
                  .filter((u) => u.id !== uni.id)
                  .slice(0, 5)
                  .map((u) => (
                    <Link href={`/aggregate-calculator/${u.slug}`} key={u.id} style={{ textDecoration: 'none' }}>
                      <Box sx={sidebarLinkSx}>
                        <Typography sx={{ fontSize: '1rem' }}>{u.logo}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#f0f0f8', fontSize: '0.82rem', fontWeight: 600 }}>{u.name}</Typography>
                          <Typography sx={{ color: '#8b8fa8', fontSize: '0.7rem' }}>{u.city}</Typography>
                        </Box>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 13, color: '#5a5e70' }} />
                      </Box>
                    </Link>
                  ))}

                <Link href="/aggregate-calculator" style={{ textDecoration: 'none' }}>
                  <Button fullWidth sx={{ mt: 1, color: '#8b8fa8', textTransform: 'none', fontSize: '0.8rem', '&:hover': { color: '#f0f0f8' } }}>
                    View All Universities →
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </Grid>
        </Grid>

        {/* SEO block */}
        <Box sx={{ mt: 8, pt: 5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography component="h2" sx={{ color: '#8b8fa8', fontSize: '1rem', fontWeight: 700, mb: 1.5 }}>
            How to Calculate {uni.name} Aggregate?
          </Typography>
          <Typography sx={{ color: '#5a5e70', fontSize: '0.85rem', lineHeight: 1.85, maxWidth: 760 }}>
            {uni.fullName} calculates admission aggregate using:{' '}
            <strong style={{ color: '#8b8fa8' }}>{uni.formulaLabel}</strong>.
            The minimum aggregate required is {uni.minAggregate}%.
            Entry test: {uni.entryTest}. Programs offered: {uni.programs.join(', ')}.
            Use our free calculator above to check your eligibility instantly.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}