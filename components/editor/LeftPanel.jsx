// components/editor/LeftPanel
'use client';
import { Box, Typography, Button, Select, MenuItem, Tooltip, Chip } from '@mui/material';
import { useState } from 'react';

// MUI Icons
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import { SECTION_LIST } from '../../data/defaultResume';
import SectionEditor from './SectionEditor';

const SECTION_ICONS = {
  personal:       <PersonRoundedIcon sx={{ fontSize: 15 }} />,
  summary:        <ArticleRoundedIcon sx={{ fontSize: 15 }} />,
  experience:     <WorkRoundedIcon sx={{ fontSize: 15 }} />,
  education:      <SchoolRoundedIcon sx={{ fontSize: 15 }} />,
  skills:         <PsychologyRoundedIcon sx={{ fontSize: 15 }} />,
  languages:      <TranslateRoundedIcon sx={{ fontSize: 15 }} />,
  projects:       <RocketLaunchRoundedIcon sx={{ fontSize: 15 }} />,
  certifications: <EmojiEventsRoundedIcon sx={{ fontSize: 15 }} />,
};

export default function LeftPanel({ resume, handlers, onDownloadClick, isMobile }) {
  const [activeSection, setActiveSection] = useState('personal');

  const activeInfo = SECTION_LIST.find((s) => s.id === activeSection);
  const isVisible  = resume.sections[activeSection];

  return (
    <Box sx={{
      width: isMobile ? '100%' : 360,
      minWidth: isMobile ? 'unset' : 320,
      borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
      background: '#11131a',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>

      {/* ── Top Toolbar ── */}
      <Box sx={{
        px: 1.5, py: 1,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#0d0f14',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
      }}>
        <PaletteRoundedIcon sx={{ fontSize: 15, color: '#8b8fa8', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Template:
        </Typography>
        <Select
          size="small"
          value={resume.template}
          onChange={(e) => handlers.setTemplate(e.target.value)}
          sx={{
            fontSize: '0.78rem',
            background: '#1a1d27',
            color: '#f0f0f8',
            flex: 1,
            minWidth: 0,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108,99,255,0.4)' },
            '& .MuiSelect-select': { py: '5px' },
          }}
        >
          {[
  { value:'ats-resume-template',        label:'ATS Resume Template' },
{ value:'corporate-resume-template',  label:'Corporate Resume Template' },
{ value:'creative-resume-template',   label:'Creative Resume Template' },
{ value:'software-engineer-resume',   label:'Software Engineer Resume' },
{ value:'modern-professional-resume', label:'Modern Professional Resume' },
{ value:'executive-resume-template',  label:'Executive Resume Template' },
{ value:'business-resume-template',   label:'Business Resume Template' },
{ value:'modern-cv-template',         label:'Modern CV Template' },
{ value:'clean-resume-template',      label:'Clean Resume Template' },
{ value:'academic-cv-template',       label:'Academic CV Template' },
].map(t => <MenuItem key={t.value} value={t.value} sx={{ fontSize:'0.78rem' }}>{t.label}</MenuItem>)}
        </Select>

        <Tooltip title="Download CV as PDF">
          <Button
            onClick={onDownloadClick}
            variant="contained"
            size="small"
            startIcon={<DownloadRoundedIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
              fontSize: '0.72rem',
              px: 1.2,
              py: 0.6,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              textTransform: 'none',
              minWidth: 0,
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(108,99,255,0.4)' },
              transition: 'all 0.2s',
            }}
          >
            Export
          </Button>
        </Tooltip>
      </Box>

      {/* ── Section Nav ── */}
      <Box sx={{ px: 1.5, pt: 1.2, pb: 1, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography sx={{
          fontSize: '0.6rem', fontWeight: 700, color: '#6b7280',
          textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.8,
        }}>
          Sections
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {SECTION_LIST.map((s) => {
            const active  = activeSection === s.id;
            const visible = resume.sections[s.id];
            return (
              <Tooltip key={s.id} title={visible ? 'Visible in CV' : 'Hidden in CV'} placement="top">
                <Box
                  onClick={() => setActiveSection(s.id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.6,
                    px: 1, py: 0.55, borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: active ? 600 : 400,
                    background: active ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.02)',
                    border: active
                      ? '1px solid rgba(108,99,255,0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: active ? '#a78bfa' : '#8b8fa8',
                    transition: 'all 0.15s',
                    '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.12)' },
                  }}
                >
                  <Box sx={{ color: active ? '#a78bfa' : '#6b7280', display: 'flex', alignItems: 'center' }}>
                    {SECTION_ICONS[s.id]}
                  </Box>
                  <span>{s.label}</span>

                  {/* Toggle pill */}
                  <Box
                    onClick={(e) => { e.stopPropagation(); handlers.toggleSection(s.id); }}
                    title={visible ? 'Click to hide' : 'Click to show'}
                    sx={{
                      ml: 0.2, width: 22, height: 12, borderRadius: 6,
                      background: visible ? '#6c63ff' : 'rgba(255,255,255,0.12)',
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Box sx={{
                      position: 'absolute', top: 2,
                      left: visible ? 11 : 2,
                      width: 8, height: 8, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s',
                    }} />
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* ── Active Section Header ── */}
      <Box sx={{
        px: 2, py: 0.9,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(108,99,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 1,
        flexShrink: 0,
      }}>
        <Box sx={{ color: '#a78bfa', display: 'flex', alignItems: 'center' }}>
          {SECTION_ICONS[activeSection]}
        </Box>
        <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: '#f0f0f8' }}>
          {activeInfo?.label}
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isVisible
            ? <VisibilityRoundedIcon sx={{ fontSize: 13, color: '#22c55e' }} />
            : <VisibilityOffRoundedIcon sx={{ fontSize: 13, color: '#f87171' }} />
          }
          <Typography sx={{
            fontSize: '0.68rem', px: 0.8, py: 0.2, borderRadius: '6px', fontWeight: 600,
            background: isVisible ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: isVisible ? '#22c55e' : '#f87171',
          }}>
            {isVisible ? 'Visible' : 'Hidden'}
          </Typography>
        </Box>
      </Box>

      {/* ── Form Area ── */}
      <Box sx={{
        flex: 1, overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
      }}>
        <SectionEditor section={activeSection} resume={resume} handlers={handlers} />
      </Box>

      {/* ── Footer ── */}
      <Box sx={{
        px: 2, py: 0.8,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 0.8,
        flexShrink: 0,
        background: '#0d0f14',
      }}>
        <Box sx={{
          width: 7, height: 7, borderRadius: '50%',
          background: handlers.saved ? '#22c55e' : '#f59e0b',
          boxShadow: handlers.saved ? '0 0 5px #22c55e' : '0 0 5px #f59e0b',
          flexShrink: 0,
        }} />
        <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8' }}>
          {handlers.saved ? 'All changes saved' : 'Saving...'}
        </Typography>
      </Box>
    </Box>
  );
}