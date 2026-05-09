// app/aggregate-calculator/[university]/page.jsx
// ✅ Server Component — no "use client" here

import { universities, getUniversityBySlug } from '@/utils/universityData';
import UniversityCalculatorClient from './UniversityCalculatorClient';
import { Box, Typography } from '@mui/material';

// ── Static params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return universities.map((u) => ({ university: u.slug }));
}

// ── Metadata — params is a Promise in Next.js 15+ ────────────────────────────
export async function generateMetadata({ params }) {
  const { university } = await params;
  const uni = getUniversityBySlug(university);
  if (!uni) return {};
  return {
    title: `${uni.name} Aggregate Calculator 2024 | CVStudio`,
    description: `Calculate your ${uni.name} admission aggregate. ${uni.formulaLabel}. Check merit for ${uni.programs.join(', ')}.`,
    alternates: { canonical: `/aggregate-calculator/${uni.slug}` },
    keywords: `${uni.name} aggregate calculator, ${uni.name} merit, ${uni.fullName} admission, Pakistan university merit 2024`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function UniversityCalculatorPage({ params }) {
  const { university } = await params;           // ← must await in Next.js 15+
  const uni = getUniversityBySlug(university);

  if (!uni) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#8b8fa8' }}>University not found.</Typography>
      </Box>
    );
  }

  return <UniversityCalculatorClient uni={uni} />;
}