import ConverterClient from './ConverterClient';

export const metadata = {
  title: 'File Converter | CVStudio',
  description:
    'Convert resume files between PDF and DOCX instantly. Fast, secure, and free file conversion tool.',
};

export default function Page() {
  return <ConverterClient />;
}