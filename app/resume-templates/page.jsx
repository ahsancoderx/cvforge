
import TemplatesPageClient from './TemplatesPageClient';

export const metadata = {
  title:
    'Professional Resume Templates | Free ATS-Friendly CV Templates | CVStudio',

  description:
    'Browse modern, professional, and ATS-friendly resume templates. Create job-winning resumes, customize CV designs, and download professional PDF resumes for free with CVStudio.',

  keywords: [
    'resume templates',
    'professional resume templates',
    'ATS friendly resume templates',
    'free resume templates',
    'CV templates',
    'modern resume templates',
    'resume design templates',
    'job winning resume templates',
    'professional CV templates',
    'resume examples',
    'resume format',
    'ATS resume format',
    'online CV templates',
    'resume builder templates',
    'CVStudio templates',
  ],

  alternates: {
    canonical: 'https://cvstudio.site/resume-template',
  },

  openGraph: {
    title:
      'Professional Resume Templates | ATS-Friendly CV Templates | CVStudio',

    description:
      'Choose from modern ATS-friendly resume templates and create professional resumes for jobs, internships, and career growth.',

    url: 'https://cvstudio.site/resume-template',

    siteName: 'CVStudio',

    locale: 'en_US',

    type: 'website',

    images: [
      {
        url: 'https://cvstudio.site/cvlogo.png',
        width: 1200,
        height: 630,
        alt: 'CVStudio Resume Templates',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'Professional Resume Templates | Free ATS-Friendly CV Templates',

    description:
      'Explore professional resume templates optimized for ATS systems and modern recruiters.',

    images: ['https://cvstudio.site/cvlogo.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <TemplatesPageClient />;
}

