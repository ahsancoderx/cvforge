import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';

export const metadata = {
  metadataBase: new URL('https://cvstudio-six.vercel.app'),

  title: {
    default: 'CVStudio — Build Professional ATS-Friendly Resumes',
    template: '%s | CVStudio',
  },

  description:
    'Create professional, ATS-friendly resumes online. CVStudio helps you design modern CVs, choose templates, optimize for ATS, and convert files easily.',

  keywords: [
    'CV builder',
    'resume builder',
    'ATS resume',
    'online CV maker',
    'resume templates',
    'CVStudio',
    'resume PDF generator',
  ],

  authors: [{ name: 'CVStudio' }],
  creator: 'CVStudio',

  openGraph: {
    title: 'CVStudio — Build Professional Resumes',
    description:
      'Design ATS-friendly resumes, choose templates, and download PDF instantly.',
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
    title: 'CVStudio — Resume Builder',
    description:
      'Create modern, ATS-friendly resumes in minutes.',
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