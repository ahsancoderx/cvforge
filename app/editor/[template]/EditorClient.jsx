'use client';

import Navbar from '../../../components/layout/Navbar';
import EditorLayout from '../../../components/editor/EditorLayout';
import useResume from '../../../hooks/useResume';
import { useState, useEffect } from 'react';

export default function EditorClient({ template }) {
    const [mounted, setMounted] = useState(false);
  const { resume, ...handlers } = useResume(template);

  // Update resume template from URL
  resume.template = template;
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0d0f14',
      }}
    >
      <Navbar />
      <EditorLayout resume={resume} handlers={handlers} />
    </div>
  );
}