'use client';
// app/aggregate-calculator/AggregateCalculatorClient.jsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardActionArea, Chip, TextField, InputAdornment,
} from '@mui/material';
import SearchRoundedIcon       from '@mui/icons-material/SearchRounded';
import SchoolRoundedIcon       from '@mui/icons-material/SchoolRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { universities } from '@/utils/universityData';

export default function AggregateCalculatorClient() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d18 100%)',
        pt: { xs: 4, md: 6 },
        pb: 12,
      }}
    >
      <Container maxWidth="lg">

        {/* ── Hero ── */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            icon={<SchoolRoundedIcon sx={{ fontSize: '15px !important', color: '#a78bfa !important' }} />}
            label="Pakistan's Top Universities"
            sx={{
              mb: 3,
              background: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.3)',
              color: '#a78bfa',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
            }}
          />

          {/*
            SEO FIX: the page title is now wrapped in a single real <h1>.
            Before, "University Aggregate" was an <h1> and "Calculator Pakistan"
            was a separate <p> — so the full title was never inside one heading.
            Visually this is 100% identical: same fonts, sizes, gradient, spacing.
            The two inner Typography elements are just <span>s (display:block)
            carrying the exact same sx as before.
          */}
          <Box component="h1">
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: { xs: '2rem', md: '3.2rem' },
                fontWeight: 800,
                color: '#f0f0f8',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                mb: 1,
              }}
            >
              University Aggregate
            </Typography>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: { xs: '2rem', md: '3.2rem' },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(135deg, #a78bfa, #6c63ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Calculator Pakistan
            </Typography>
          </Box>

          <Typography
            sx={{
              color: '#8b8fa8',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              maxWidth: 520,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Select your university and instantly calculate your admission aggregate
            for{' '}
            <strong style={{ color: '#c4c4d4' }}>{universities.length} top universities</strong>{' '}
            in Pakistan.
          </Typography>

          {/* Search — MUI v6: slotProps replaces InputProps */}
          <TextField
            fullWidth
            placeholder="Search by university name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#8b8fa8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: 480,
              mx: 'auto',
              display: 'block',
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                color: '#f0f0f8',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#6c63ff' },
              },
              '& input::placeholder': { color: '#8b8fa8' },
            }}
          />
        </Box>

        {/* ── University Cards — MUI v6: size prop replaces item+xs/sm/md ── */}
        <Grid container spacing={2.5}>
          {filtered.length > 0 ? (
            filtered.map((uni) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={uni.id}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.055)',
                      border: `1px solid ${uni.accentColor}50`,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => router.push(`/aggregate-calculator/${uni.slug}`)}
                    sx={{ borderRadius: '16px' }}
                  >
                    <CardContent sx={{ p: '22px !important' }}>

                      {/* Top row */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            width: 48, height: 48, borderRadius: '13px',
                            background: `${uni.accentColor}18`,
                            border: `1px solid ${uni.accentColor}28`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem',
                          }}
                        >
                          {uni.logo}
                        </Box>
                        <Chip
                          label={uni.city}
                          size="small"
                          sx={{
                            background: 'rgba(255,255,255,0.05)',
                            color: '#8b8fa8',
                            fontSize: '0.68rem',
                            height: 22,
                            border: '1px solid rgba(255,255,255,0.07)',
                          }}
                        />
                      </Box>

                      {/* Name — SEO: each university name is a real h3 sub-heading under the page H1 */}
                      <Typography component="h3" sx={{ color: '#f0f0f8', fontWeight: 700, fontSize: '1.05rem', mb: 0.4, lineHeight: 1.25 }}>
                        {uni.name}
                      </Typography>
                      <Typography sx={{ color: '#8b8fa8', fontSize: '0.73rem', mb: 2.5, lineHeight: 1.4 }}>
                        {uni.fullName}
                      </Typography>

                      {/* Formula */}
                      <Box
                        sx={{
                          background: `${uni.accentColor}10`,
                          border: `1px solid ${uni.accentColor}22`,
                          borderRadius: '8px',
                          px: 1.4, py: 0.8,
                          mb: 2.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: uni.accentColor,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                          }}
                        >
                          {uni.formulaLabel}
                        </Typography>
                      </Box>

                      {/* Bottom row */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={uni.entryTest}
                          size="small"
                          sx={{
                            background: `${uni.accentColor}18`,
                            color: uni.accentColor,
                            fontWeight: 600,
                            fontSize: '0.68rem',
                            height: 22,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: uni.accentColor, fontSize: '0.78rem', fontWeight: 600 }}>
                          Calculate <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
                        </Box>
                      </Box>

                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#5a5e70', fontSize: '0.95rem' }}>
                  No universities found for &ldquo;{search}&rdquo;
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* SEO text */}
        <Box sx={{ mt: 10, pt: 5, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <Typography component="h2" sx={{ color: '#8b8fa8', fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
            How does the aggregate calculator work?
          </Typography>
          <Typography sx={{ color: '#5a5e70', fontSize: '0.85rem', maxWidth: 680, mx: 'auto', lineHeight: 1.85 }}>
            Each Pakistani university has its own merit formula combining Matric marks, FSc / Intermediate
            marks, and an entry test score (ECAT, NET, SAT, NAT etc.). Select your university above,
            enter your marks, and get your aggregate percentage and eligibility status instantly — for free.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}