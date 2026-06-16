
import EditorClient from './EditorClient';

export const metadata = {
  title: 'Online Resume Editor | ATS Friendly Resume Builder | CVStudio',

  description:
    'Edit, customize, and build ATS-friendly resumes online. Modify templates, add sections, update skills, and download professional PDF resumes instantly.',

  keywords: [
    'resume editor',
    'online resume editor',
    'resume builder',
    'CV editor',
    'ATS resume builder',
    'resume customization',
    'resume templates',
    'professional resume builder',
    'CVStudio resume editor',
  ],

  alternates: {
    canonical: 'https://cvstudio.site/editor',
  },

  openGraph: {
    title: 'Online Resume Editor | CVStudio',
    description:
      'Customize ATS-friendly resumes and download professional PDF resumes.',
    url: 'https://cvstudio.site/editor',
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
    title: 'Online Resume Editor',
    description:
      'Build and edit professional ATS-friendly resumes online.',
    images: ['https://cvstudio.site/cvlogo.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page({ params }) {
  const { template } = await params;

  return <EditorClient template={template} />;
}

