//components/ats/ParsedResumeView
'use client';
import { Box, Typography, Chip, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import NotesIcon from '@mui/icons-material/Notes';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BoltIcon from '@mui/icons-material/Bolt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';

// ── Section Card ───────────────────────────────────────────
function SectionCard({ title, icon, children, accent = '#6c63ff', isEmpty }) {
  return (
    <Box sx={{
      mb: 2,
      background: 'rgba(255,255,255,0.025)',
      border: isEmpty ? '1px dashed rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      <Box sx={{
        px: 2, py: 1.2,
        borderBottom: isEmpty ? 'none' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 1,
        background: isEmpty ? 'transparent' : `${accent}08`,
      }}>
        <Box sx={{ color: isEmpty ? '#4b5563' : accent, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: isEmpty ? '#4b5563' : '#e2e8f0', flex: 1 }}>
          {title}
        </Typography>
        {isEmpty && (
          <Box sx={{
            px: 1, py: 0.3,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '4px',
            fontSize: '0.62rem',
            color: '#ef4444',
            fontWeight: 700,
          }}>
            NOT FOUND
          </Box>
        )}
      </Box>
      {!isEmpty && <Box sx={{ p: 2 }}>{children}</Box>}
      {isEmpty && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.78rem', color: '#4b5563' }}>
            This section was not detected in your CV. Consider adding it.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── Info Row ───────────────────────────────────────────────
function InfoRow({ label, value, status, isLink }) {
  const color = status === 'found' ? '#22c55e' : '#ef4444';
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
      <Box sx={{ color, display: 'flex', alignItems: 'center', mt: '2px', flexShrink: 0 }}>
        {status === 'found'
          ? <CheckCircleIcon sx={{ fontSize: '1rem' }} />
          : <CancelIcon sx={{ fontSize: '1rem' }} />
        }
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </Typography>
        {isLink && value ? (
          <Typography
            component="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontSize: '0.8rem', color: '#a78bfa', mt: 0.2,
              wordBreak: 'break-all', display: 'block', textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '0.8rem', color: value ? '#e2e8f0' : '#4b5563', mt: 0.2, wordBreak: 'break-word' }}>
            {value || 'Not found'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ── Experience Card ────────────────────────────────────────
function ExperienceCard({ exp }) {
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+ (user|client|team|project)/i.test(exp.desc || '');
  const hasActionVerb = /^(led|built|developed|managed|designed|increased|reduced|launched|created|improved|delivered)/i.test(exp.desc || '');

  return (
    <Box sx={{
      mb: 1.5, p: 1.5,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0f0f8' }}>
            {exp.role || 'Unknown Role'}
          </Typography>
          <Typography sx={{ fontSize: '0.77rem', color: '#a78bfa' }}>
            {exp.company || 'Unknown Company'}
          </Typography>
        </Box>
        {exp.date && (
          <Box sx={{
            px: 1, py: 0.3, flexShrink: 0,
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '5px',
            fontSize: '0.68rem', color: '#a78bfa', fontWeight: 600,
          }}>
            {exp.date}
          </Box>
        )}
      </Box>
      {exp.desc && (
        <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.6, mt: 0.8, whiteSpace: 'pre-line' }}>
          {exp.desc.length > 300 ? exp.desc.slice(0, 300) + '...' : exp.desc}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
        {[
          { ok: hasMetrics, yes: 'Has metrics', no: 'No metrics' },
          { ok: hasActionVerb, yes: 'Action verb', no: 'No action verb' },
        ].map(({ ok, yes, no }) => (
          <Box key={yes} sx={{
            px: 0.8, py: 0.25, borderRadius: '4px', fontSize: '0.62rem', fontWeight: 600,
            background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
            color: ok ? '#22c55e' : '#ef4444',
            border: `1px solid ${ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'}`,
            display: 'flex', alignItems: 'center', gap: 0.4,
          }}>
            {ok ? <CheckCircleIcon sx={{ fontSize: '0.7rem' }} /> : <CancelIcon sx={{ fontSize: '0.7rem' }} />}
            {ok ? yes : no}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Raw Text View ──────────────────────────────────────────
function RawTextView({ rawText }) {
  return (
    <Box sx={{
      p: 2,
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.06)',
      maxHeight: 500,
      overflowY: 'auto',
    }}>
      <Typography sx={{
        fontSize: '0.75rem', color: '#9ca3af',
        fontFamily: '"Fira Code", "Courier New", monospace',
        lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {rawText || 'No raw text available.'}
      </Typography>
    </Box>
  );
}

// ── Social Link Chip ───────────────────────────────────────
function SocialChip({ label, url, icon, color }) {
  if (!url) return null;
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.6,
        px: 1.2, py: 0.5, borderRadius: '6px',
        fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none',
        background: `${color}15`,
        border: `1px solid ${color}35`,
        color,
        transition: 'all 0.15s',
        '&:hover': { background: `${color}25` },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

// ── Main Export ────────────────────────────────────────────
export default function ParsedResumeView({ resume, rawText }) {
  const [tab, setTab] = useState(0);
  const p = resume.personal || {};

  const socialLinks = [
    { key: 'linkedin',      label: 'LinkedIn',       color: '#0ea5e9', icon: '💼' },
    { key: 'github',        label: 'GitHub',          color: '#a78bfa', icon: '🐙' },
    { key: 'twitter',       label: 'Twitter / X',     color: '#38bdf8', icon: '🐦' },
    { key: 'portfolio',     label: 'Portfolio',       color: '#22c55e', icon: '🌐' },
    { key: 'stackoverflow', label: 'Stack Overflow',  color: '#f97316', icon: '📚' },
    { key: 'medium',        label: 'Medium',          color: '#e5e7eb', icon: '✍️' },
    { key: 'behance',       label: 'Behance',         color: '#6c63ff', icon: '🎨' },
    { key: 'dribbble',      label: 'Dribbble',        color: '#ec4899', icon: '🏀' },
    { key: 'kaggle',        label: 'Kaggle',          color: '#22d3ee', icon: '📊' },
    { key: 'leetcode',      label: 'LeetCode',        color: '#f59e0b', icon: '⚡' },
  ].filter((s) => p[s.key]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, fontWeight: 800, color: '#f0f0f8', letterSpacing: '-0.02em' }}>
          Extracted Resume Data
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#8b8fa8', mt: 0.3 }}>
          This is what ATS systems see when they parse your CV
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { background: '#6c63ff', height: 2, borderRadius: 1 },
          '& .MuiTab-root': {
            fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', textTransform: 'none',
            minWidth: 'auto', px: 2,
            '&.Mui-selected': { color: '#a78bfa' },
          },
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Tab label="Parsed View" />
        <Tab label="Raw Text" icon={<CodeIcon sx={{ fontSize: '0.9rem' }} />} iconPosition="end" />
      </Tabs>

      {tab === 0 && (
        <Box>
          {/* Contact Info */}
          <SectionCard
            title="Contact Information"
            icon={<ContactPageIcon sx={{ fontSize: '1rem' }} />}
            isEmpty={!p.name && !p.email}
            accent="#6c63ff"
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
              <InfoRow label="Full Name"  value={p.name}     status={p.name     ? 'found' : 'missing'} />
              <InfoRow label="Email"      value={p.email}    status={p.email    ? 'found' : 'missing'} />
              <InfoRow label="Phone"      value={p.phone}    status={p.phone    ? 'found' : 'missing'} />
              <InfoRow label="Location"   value={p.location} status={p.location ? 'found' : 'missing'} />
              <InfoRow label="LinkedIn"   value={p.linkedin} status={p.linkedin ? 'found' : 'missing'} isLink />
              <InfoRow label="GitHub"     value={p.github}   status={p.github   ? 'found' : 'missing'} isLink />
              {p.twitter      && <InfoRow label="Twitter / X"    value={p.twitter}      status="found" isLink />}
              {p.portfolio    && <InfoRow label="Portfolio / Site" value={p.portfolio}  status="found" isLink />}
              {p.stackoverflow && <InfoRow label="Stack Overflow" value={p.stackoverflow} status="found" isLink />}
              {p.medium       && <InfoRow label="Medium"          value={p.medium}      status="found" isLink />}
              {p.behance      && <InfoRow label="Behance"         value={p.behance}     status="found" isLink />}
              {p.dribbble     && <InfoRow label="Dribbble"        value={p.dribbble}    status="found" isLink />}
              {p.kaggle       && <InfoRow label="Kaggle"          value={p.kaggle}      status="found" isLink />}
              {p.leetcode     && <InfoRow label="LeetCode"        value={p.leetcode}    status="found" isLink />}
            </Box>

            {/* Social quick-links */}
            {socialLinks.length > 0 && (
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                  Detected Social Profiles
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {socialLinks.map((s) => (
                    <SocialChip key={s.key} label={s.label} url={p[s.key]} icon={s.icon} color={s.color} />
                  ))}
                </Box>
              </Box>
            )}
          </SectionCard>

          {/* Summary */}
          <SectionCard
            title="Professional Summary"
            icon={<NotesIcon sx={{ fontSize: '1rem' }} />}
            isEmpty={!resume.summary}
            accent="#a78bfa"
          >
            {resume.summary && (
              <>
                <Typography sx={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.7, mb: 1.5 }}>
                  {resume.summary}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${resume.summary.split(/\s+/).filter(Boolean).length} words`}
                    size="small"
                    sx={{ fontSize: '0.68rem', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}
                  />
                  {/experienc|skill|develop|manag|lead|build|design|achiev/i.test(resume.summary) && (
                    <Chip
                      label="✓ Keywords found"
                      size="small"
                      sx={{ fontSize: '0.68rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                    />
                  )}
                </Box>
              </>
            )}
          </SectionCard>

          {/* Experience */}
          <SectionCard
            title={`Work Experience (${(resume.experience || []).length} entries)`}
            icon={<WorkIcon sx={{ fontSize: '1rem' }} />}
            isEmpty={(resume.experience || []).length === 0}
            accent="#6c63ff"
          >
            {(resume.experience || []).map((exp, i) => (
              <ExperienceCard key={i} exp={exp} />
            ))}
          </SectionCard>

          {/* Education */}
          <SectionCard
            title={`Education (${(resume.education || []).length} entries)`}
            icon={<SchoolIcon sx={{ fontSize: '1rem' }} />}
            isEmpty={(resume.education || []).length === 0}
            accent="#22c55e"
          >
            {(resume.education || []).map((edu, i) => (
              <Box key={i} sx={{
                mb: 1.5, p: 1.5,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: '#f0f0f8' }}>
                      {edu.degree || 'Unknown Degree'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.77rem', color: '#34d399' }}>
                      {edu.school || 'Unknown School'}
                    </Typography>
                    {edu.gpa && (
                      <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', mt: 0.3 }}>{edu.gpa}</Typography>
                    )}
                  </Box>
                  {edu.date && (
                    <Box sx={{
                      px: 1, py: 0.3, flexShrink: 0,
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: '5px',
                      fontSize: '0.68rem', color: '#34d399', fontWeight: 600,
                    }}>
                      {edu.date}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </SectionCard>

          {/* Skills */}
          <SectionCard
            title={`Skills (${(resume.skills || []).length} detected)`}
            icon={<BoltIcon sx={{ fontSize: '1rem' }} />}
            isEmpty={(resume.skills || []).length === 0}
            accent="#f59e0b"
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {(resume.skills || []).map((skill, i) => {
                const techList = ['javascript','typescript','python','react','node','sql','aws','docker','git','java','go','rust','graphql','css','html','figma','kubernetes'];
                const isTech = techList.includes(skill.toLowerCase().trim());
                return (
                  <Box key={i} sx={{
                    px: 1.2, py: 0.5, borderRadius: '6px',
                    fontSize: '0.75rem', fontWeight: 500,
                    background: isTech ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isTech ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    color: isTech ? '#fbbf24' : '#9ca3af',
                  }}>
                    {skill}
                  </Box>
                );
              })}
            </Box>
            {(resume.skills || []).length > 0 && (
              <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', mt: 1.5 }}>
                🟡 Highlighted skills are recognized by most ATS systems
              </Typography>
            )}
          </SectionCard>

          {/* Projects */}
          {(resume.projects || []).length > 0 && (
            <SectionCard
              title={`Projects (${resume.projects.length})`}
              icon={<RocketLaunchIcon sx={{ fontSize: '1rem' }} />}
              accent="#a78bfa"
            >
              {resume.projects.map((proj, i) => (
                <Box key={i} sx={{
                  mb: 1.5, p: 1.5,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                }}>
                  <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: '#f0f0f8' }}>{proj.name}</Typography>
                  {proj.description && (
                    <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', mt: 0.5, lineHeight: 1.55 }}>
                      {proj.description}
                    </Typography>
                  )}
                  {proj.tech && (
                    <Typography sx={{ fontSize: '0.72rem', color: '#a78bfa', mt: 0.5 }}>{proj.tech}</Typography>
                  )}
                </Box>
              ))}
            </SectionCard>
          )}

          {/* Certifications */}
          {(resume.certifications || []).length > 0 && (
            <SectionCard
              title={`Certifications (${resume.certifications.length})`}
              icon={<EmojiEventsIcon sx={{ fontSize: '1rem' }} />}
              accent="#22c55e"
            >
              {resume.certifications.map((cert, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                  <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#34d399' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{cert.name}</Typography>
                </Box>
              ))}
            </SectionCard>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Raw extracted text ({rawText?.split(/\s+/).filter(Boolean).length || 0} words) — this is exactly what ATS sees
            </Typography>
          </Box>
          <RawTextView rawText={rawText} />
        </Box>
      )}
    </Box>
  );
}