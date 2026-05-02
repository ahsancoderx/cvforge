import AtsClient from './AtsClient';

export const metadata = {
  title: 'ATS Resume Checker | CVStudio',
  description:
    'Check your resume ATS score instantly. Improve keywords and increase your chances of getting interviews.',
};

export default function Page() {
  return <AtsClient />;
}