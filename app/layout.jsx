import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';

export const metadata = {
  metadataBase: new URL('https://cvstudio-six.vercel.app'),

  title: {
    default: 'CVStudio — Free AI Resume Builder | ATS-Friendly CV Templates',
    template: '%s | CVStudio',
  },

  description:
    'Create professional ATS-friendly resumes using AI. Choose modern CV templates, optimize for ATS systems, and download your CV instantly as PDF for jobs and internships.',

  keywords: [
    'CV builder',
    'resume builder',
    'ATS resume',
    'AI resume builder',
    'online CV maker',
    'resume templates',
    'CVStudio',
    'resume PDF generator',
    'ATS friendly resume',
  ],

  authors: [{ name: 'CVStudio' }],
  creator: 'CVStudio',

  alternates: {
    canonical: 'https://cvstudio-six.vercel.app',
  },

  openGraph: {
    title: 'CVStudio — Free AI Resume Builder',
    description:
      'Create ATS-friendly resumes, choose professional templates, and download PDF instantly.',
    url: 'https://cvstudio-six.vercel.app',
    siteName: 'CVStudio',
    images: [
      {
        url: '/cvlogo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CVStudio — Free AI Resume Builder',
    description:
      'Create modern ATS-friendly resumes in minutes and download instantly.',
    images: ['/cvlogo.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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