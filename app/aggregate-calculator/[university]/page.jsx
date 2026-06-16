// app/aggregate-calculator/[university]/page.jsx
//  Server Component — no "use client" here
import { universities, getUniversityBySlug } from '@/utils/universityData';
import UniversityCalculatorClient from './UniversityCalculatorClient';
import { Box, Typography } from '@mui/material';

export function generateStaticParams() {
  return universities.map((u) => ({
    university: u.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { university } = await params;

  const uni = getUniversityBySlug(university);

  if (!uni) {
    return {
      title: 'University Aggregate Calculator | CVStudio',
      description:
        'Calculate university admission aggregate, merit score, and eligibility instantly with CVStudio.',
    };
  }

  const canonicalUrl = `https://cvstudio.site/aggregate-calculator/${uni.slug}`;

  return {
    title: `${uni.name} Aggregate Calculator 2026 | Merit Calculator | CVStudio`,

    description: `Calculate your ${uni.name} aggregate instantly for 2026 admissions. Check merit formula, admission requirements, eligibility criteria, and admission chances using CVStudio.`,

    keywords: [
      `${uni.name} aggregate calculator`,
      `${uni.name} merit calculator`,
      `${uni.name} admission calculator`,
      `${uni.name} aggregate formula`,
      `${uni.name} merit list`,
      `${uni.name} admission requirements`,
      `${uni.name} admission criteria`,
      'Pakistan university aggregate calculator',
      'Pakistan merit calculator',
      'University aggregate calculator',
      'Admission merit calculator',
      'CVStudio',
    ],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${uni.name} Aggregate Calculator 2026`,
      description: `Check ${uni.name} admission aggregate, merit formula, and admission eligibility instantly.`,
      url: canonicalUrl,
      siteName: 'CVStudio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://cvstudio.site/cvlogo.png',
          width: 1200,
          height: 630,
          alt: `${uni.name} Aggregate Calculator`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${uni.name} Aggregate Calculator 2026`,
      description: `Calculate ${uni.name} merit and admission aggregate instantly.`,
      images: ['https://cvstudio.site/cvlogo.png'],
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function UniversityCalculatorPage({ params }) {
  const { university } = await params;

  const uni = getUniversityBySlug(university);

  if (!uni) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#0a0a0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#8b8fa8' }}>
          University not found.
        </Typography>
      </Box>
    );
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How is ${uni.name} aggregate calculated?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: uni.formulaLabel,
        },
      },
      {
        '@type': 'Question',
        name: `Is this ${uni.name} aggregate calculator accurate?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, this calculator follows the official admission formula used by ${uni.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I calculate admission merit instantly?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, simply enter your marks and the calculator will estimate your aggregate instantly.`,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cvstudio.site',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Aggregate Calculator',
        item: 'https://cvstudio.site/aggregate-calculator',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: uni.name,
        item: `https://cvstudio.site/aggregate-calculator/${uni.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <UniversityCalculatorClient uni={uni} />
    </>
  );
}
