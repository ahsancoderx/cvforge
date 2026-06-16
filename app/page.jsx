import HomeClient from './HomeClient';

export const metadata = {
  title: 'Free Resume Builder, ATS Resume Checker & University Aggregate Calculator | CVStudio',
  description:
        'Build ATS-friendly resumes, check ATS scores, calculate university aggregates, and download professional CVs instantly with CVStudio.'
};

export default function Page() {
  return <HomeClient />;
}