'use client';
import { Box, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPreview from './RightPreview';
import DownloadModal from './DownloadModal';

export default function EditorLayout({ resume, handlers }) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
        {/* Mobile Tab Bar */}
        <Box sx={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#0d0f14',
          flexShrink: 0,
        }}>
          {[
            { id: 'editor', label: '✏️ Editor' },
            { id: 'preview', label: '👁 Preview' },
          ].map((tab) => (
            <Box
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                flex: 1, py: 1.2, textAlign: 'center',
                fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? '#a78bfa' : '#8b8fa8',
                borderBottom: activeTab === tab.id ? '2px solid #a78bfa' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(108,99,255,0.05)' : 'transparent',
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>

        {/* Mobile Content */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'editor' ? (
            <LeftPanel
              resume={resume}
              handlers={handlers}
              onDownloadClick={() => setDownloadOpen(true)}
              isMobile={isMobile}
            />
          ) : (
            <RightPreview
              resume={resume}
              saved={handlers.saved}
              onDownloadClick={() => setDownloadOpen(true)}
              isMobile={isMobile}
            />
          )}
        </Box>

        <DownloadModal
          open={downloadOpen}
          onClose={() => setDownloadOpen(false)}
          resume={resume}
        />
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      <LeftPanel
        resume={resume}
        handlers={handlers}
        onDownloadClick={() => setDownloadOpen(true)}
        isMobile={false}
      />
      <RightPreview
        resume={resume}
        saved={handlers.saved}
        onDownloadClick={() => setDownloadOpen(true)}
        isMobile={false}
      />
      <DownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        resume={resume}
      />
    </Box>
  );
}