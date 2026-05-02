// app/editor/page.js
'use client';
import Navbar from '../../components/layout/Navbar';
import EditorLayout from '../../components/editor/EditorLayout';
import useResume from '../../hooks/useResume';

export default function EditorPage() {
  const { resume, ...handlers } = useResume();
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d0f14' }}>
      <Navbar />
      <EditorLayout resume={resume} handlers={handlers} />
    </div>
  );
}