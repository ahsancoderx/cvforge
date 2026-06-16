
import AggregateCalculatorClient from './AggregateCalculatorClient';

export const metadata = {
  title:
    'University Aggregate Calculator Pakistan 2026 | NUST, UET, FAST, LUMS | CVStudio',

  description:
    'Calculate university admission aggregate instantly for NUST, UET, FAST, COMSATS, LUMS and other Pakistani universities. Free merit calculator for admissions 2026.',

  keywords: [
    'aggregate calculator Pakistan',
    'university aggregate calculator',
    'merit calculator Pakistan',
    'NUST aggregate calculator',
    'UET aggregate calculator',
    'FAST aggregate calculator',
    'LUMS aggregate calculator',
    'COMSATS aggregate calculator',
    'admission merit calculator',
    'ECAT aggregate calculator',
    'NET aggregate calculator',
    'Pakistan university admissions',
  ],

  alternates: {
    canonical: 'https://cvstudio.site/aggregate-calculator',
  },

  openGraph: {
    title: 'University Aggregate Calculator Pakistan 2026',
    description:
      'Calculate admission aggregate and merit instantly for top Pakistani universities.',
    url: 'https://cvstudio.site/aggregate-calculator',
    type: 'website',
    images: [
      {
        url: 'https://cvstudio.site/cvlogo.png',
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'University Aggregate Calculator Pakistan',
    description:
      'Calculate NUST, UET, FAST, LUMS and COMSATS aggregate instantly.',
    images: ['https://cvstudio.site/cvlogo.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AggregateCalculatorPage() {
  return <AggregateCalculatorClient />;
}

