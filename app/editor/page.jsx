import EditorClient from './EditorClient';

export const metadata = {
  title: 'Resume Editor | CVStudio',
  description:
    'Edit and customize your resume in real-time. Add sections, change templates, and export ATS-friendly PDF instantly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <EditorClient />;
}