
import AtsClient from './AtsClient';

export const metadata = {
  title: 'Free ATS Resume Checker | ATS Score Checker Online | CVStudio',

  description:
    'Check your ATS resume score instantly. Analyze keywords, improve resume compatibility, optimize for applicant tracking systems, and increase interview chances with CVStudio.',

  keywords: [
    'ATS resume checker',
    'ATS score checker',
    'free ATS checker',
    'resume scanner',
    'ATS resume scan',
    'ATS friendly resume',
    'resume optimization',
    'resume keyword checker',
    'resume analysis',
    'CVStudio ATS checker',
  ],

  alternates: {
    canonical: 'https://cvstudio.site/ats-checker',
  },

  openGraph: {
    title: 'Free ATS Resume Checker | CVStudio',
    description:
      'Analyze ATS score, optimize resume keywords, and improve job application success.',
    url: 'https://cvstudio.site/ats-checker',
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
    title: 'Free ATS Resume Checker',
    description:
      'Check ATS compatibility and improve your resume score instantly.',
    images: ['https://cvstudio.site/cvlogo.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AtsClient />;
}

