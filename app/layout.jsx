// app/layout.jsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';

export const metadata = {
  metadataBase: new URL('https://cvstudio.site'),

  title: {
    default:
      'CVStudio | Free Resume Builder, ATS Resume Checker & University Aggregate Calculator',
    template: '%s | CVStudio',
  },

  description:
    'Create ATS-friendly resumes online, check ATS resume scores, calculate university admission aggregates, and download professional resumes instantly with CVStudio.',

  keywords: [
    'free resume builder',
    'resume builder',
    'online CV maker',
    'ATS resume checker',
    'ATS score checker',
    'resume templates',
    'professional CV templates',
    'AI resume builder',
    'university aggregate calculator',
    'UET aggregate calculator',
    'NUST aggregate calculator',
    'LUMS aggregate calculator',
    'FAST aggregate calculator',
    'Pakistan merit calculator',
    'CVStudio',
  ],

  authors: [{ name: 'Ahsan Ali' }],

  creator: 'Ahsan Ali',

  publisher: 'CVStudio',

  alternates: {
    canonical: 'https://cvstudio.site',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  openGraph: {
    title:
      'CVStudio | Free Resume Builder, ATS Resume Checker & University Aggregate Calculator',

    description:
      'Build ATS-friendly resumes, check ATS scores, calculate university merit and admission aggregates instantly.',

    url: 'https://cvstudio.site',

    siteName: 'CVStudio',

    locale: 'en_US',

    type: 'website',

    images: [
      {
        url: 'https://cvstudio.site/cvlogo.png',
        width: 1200,
        height: 630,
        alt: 'CVStudio',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'CVStudio | Free Resume Builder, ATS Resume Checker & University Aggregate Calculator',

    description:
      'Create ATS-friendly resumes, calculate admission merit, and download professional CVs.',

    images: ['https://cvstudio.site/cvlogo.png'],
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CVStudio',
    url: 'https://cvstudio.site',
    logo: 'https://cvstudio.site/cvlogo.png',
    founder: 'Ahsan Ali',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CVStudio',
    url: 'https://cvstudio.site',
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

