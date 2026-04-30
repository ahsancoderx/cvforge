'use client';
import { Box, TextField, Typography, Button, MenuItem, Select, Chip } from '@mui/material';
import { useRef } from 'react';
import SkillTags from '../ui/SkillTags';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

/* ── Reusable sub-components ───────────────────────────── */

function Label({ children }) {
  return (
    <Typography sx={{
      fontSize: '0.68rem', fontWeight: 700, color: '#8b8fa8',
      textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5,
    }}>
      {children}
    </Typography>
  );
}

function Field({ label, value, onChange, multiline, rows, placeholder, type = 'text', helper }) {
  return (
    <Box sx={{ mb: 1.3 }}>
      {label && <Label>{label}</Label>}
      <TextField
        fullWidth size="small" type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        multiline={multiline} rows={rows || 1}
        placeholder={placeholder || ''}
        helperText={helper}
        FormHelperTextProps={{ sx: { fontSize: '0.65rem', color: '#8b8fa8', ml: 0, mt: 0.3 } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.83rem',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#6c63ff' },
          },
          '& .MuiInputBase-input': { color: '#f0f0f8' },
          '& .MuiInputBase-input::placeholder': { color: '#6b7280', opacity: 1 },
        }}
      />
    </Box>
  );
}

function TwoCol({ children }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>{children}</Box>;
}

function BlockCard({ title, onRemove, children, accent = '#a78bfa' }) {
  return (
    <Box sx={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '10px',
      p: 1.5, mb: 1.5,
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: 'rgba(255,255,255,0.12)', borderLeftColor: accent },
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.3 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: accent }}>{title}</Typography>
        <Button
          size="small"
          onClick={onRemove}
          startIcon={<DeleteRoundedIcon sx={{ fontSize: '12px !important' }} />}
          sx={{
            fontSize: '0.68rem', color: '#f87171',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.15)',
            minWidth: 0, px: 1, py: 0.3,
            textTransform: 'none',
            '&:hover': { background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.35)' },
          }}
        >
          Remove
        </Button>
      </Box>
      {children}
    </Box>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={<AddRoundedIcon />}
      sx={{
        borderStyle: 'dashed',
        border: '1.5px dashed rgba(108,99,255,0.3)',
        color: '#a78bfa',
        background: 'rgba(108,99,255,0.03)',
        borderRadius: '10px',
        fontSize: '0.8rem',
        py: 0.9, mt: 0.5,
        textTransform: 'none',
        fontWeight: 600,
        '&:hover': { background: 'rgba(108,99,255,0.08)', borderColor: '#6c63ff' },
        transition: 'all 0.2s',
      }}
    >
      {label}
    </Button>
  );
}

function TipBox({ children, color = '#6c63ff', bg = 'rgba(108,99,255,0.06)', border = 'rgba(108,99,255,0.2)' }) {
  return (
    <Box sx={{
      mt: 1.5, p: 1.2,
      background: bg, border: `1px solid ${border}`, borderRadius: '8px',
      display: 'flex', gap: 0.8, alignItems: 'flex-start',
    }}>
      <TipsAndUpdatesRoundedIcon sx={{ fontSize: 14, color, mt: 0.1, flexShrink: 0 }} />
      <Typography sx={{ fontSize: '0.7rem', color: '#a8b1c8', lineHeight: 1.6 }}>
        {children}
      </Typography>
    </Box>
  );
}

function SectionHeading({ children }) {
  return (
    <Typography sx={{
      fontSize: '0.68rem', fontWeight: 700, color: '#6c63ff',
      textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1,
      display: 'flex', alignItems: 'center', gap: 0.5,
    }}>
      <LinkRoundedIcon sx={{ fontSize: 13 }} />
      {children}
    </Typography>
  );
}

/* ── Personal Info ─────────────────────────────────── */

function PersonalSection({ personal, updatePersonal }) {
  const fileRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePersonal('photo', ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Photo */}
      <Box sx={{ mb: 2 }}>
        <Label>Profile Photo (optional)</Label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
            border: '2px solid rgba(108,99,255,0.4)', background: '#1a1d27',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {personal.photo
              ? <img src={personal.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <PhotoCameraRoundedIcon sx={{ fontSize: 22, color: '#6b7280' }} />
            }
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Button
              size="small"
              onClick={() => fileRef.current.click()}
              startIcon={<PhotoCameraRoundedIcon sx={{ fontSize: '13px !important' }} />}
              sx={{
                fontSize: '0.73rem', background: 'rgba(108,99,255,0.1)',
                color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)',
                textTransform: 'none',
                '&:hover': { background: 'rgba(108,99,255,0.2)' },
              }}
            >
              Upload Photo
            </Button>
            {personal.photo && (
              <Button
                size="small"
                onClick={() => updatePersonal('photo', '')}
                startIcon={<DeleteRoundedIcon sx={{ fontSize: '12px !important' }} />}
                sx={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'none',
                  '&:hover': { background: 'rgba(239,68,68,0.08)' } }}
              >
                Remove
              </Button>
            )}
          </Box>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        </Box>
      </Box>

      <Field label="Full Name"  value={personal.name}     onChange={(v) => updatePersonal('name', v)}     placeholder="John Doe" />
      <Field label="Job Title"  value={personal.title}    onChange={(v) => updatePersonal('title', v)}    placeholder="Senior Software Engineer" />
      <TwoCol>
        <Field label="Email"    value={personal.email}    onChange={(v) => updatePersonal('email', v)}    type="email" />
        <Field label="Phone"    value={personal.phone}    onChange={(v) => updatePersonal('phone', v)} />
      </TwoCol>
      <Field label="Location"   value={personal.location} onChange={(v) => updatePersonal('location', v)} placeholder="City, Country" />

      {/* Social Links */}
      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <SectionHeading>Social & Links</SectionHeading>
        <Field label="LinkedIn"          value={personal.linkedin}  onChange={(v) => updatePersonal('linkedin', v)}  placeholder="linkedin.com/in/username"  helper="Clickable link in PDF" />
        <Field label="GitHub"            value={personal.github}    onChange={(v) => updatePersonal('github', v)}    placeholder="github.com/username"       helper="Clickable link in PDF" />
        <Field label="Portfolio / Site"  value={personal.portfolio} onChange={(v) => updatePersonal('portfolio', v)} placeholder="yoursite.com"              helper="Clickable link in PDF" />
        <Field label="Twitter / X"       value={personal.twitter}   onChange={(v) => updatePersonal('twitter', v)}   placeholder="@username"                 helper="Clickable link in PDF" />
      </Box>
    </Box>
  );
}

/* ── Main SectionEditor export ───────────────────────── */

export default function SectionEditor({ section, resume, handlers }) {
  const {
    updatePersonal, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    addLanguage, updateLanguage, removeLanguage,
  } = handlers;

  /* ── Personal ── */
  if (section === 'personal') return (
    <PersonalSection personal={resume.personal} updatePersonal={updatePersonal} />
  );

  /* ── Summary ── */
  if (section === 'summary') return (
    <Box sx={{ p: 2 }}>
      <Label>Professional Summary</Label>
      <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8', mb: 1, lineHeight: 1.6 }}>
        Write 2–4 sentences. Include years of experience, top skills, and what makes you unique.
      </Typography>
      <TextField
        fullWidth multiline rows={5}
        value={resume.summary || ''}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Experienced software engineer with 5+ years..."
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.85rem',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#6c63ff' },
          },
          '& .MuiInputBase-input': { color: '#f0f0f8' },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Typography sx={{
          fontSize: '0.68rem',
          color: (resume.summary?.split(/\s+/).filter(Boolean).length || 0) >= 40 ? '#22c55e' : '#f59e0b',
        }}>
          {resume.summary?.split(/\s+/).filter(Boolean).length || 0} words (aim for 40–80)
        </Typography>
      </Box>
      <TipBox>Aim for 40–80 words. Start with your role, years of experience, then top 2 skills.</TipBox>
    </Box>
  );

  /* ── Experience ── */
  if (section === 'experience') return (
    <Box sx={{ p: 2 }}>
      {resume.experience.map((e, i) => (
        <BlockCard key={e.id} title={`Position ${i + 1}`} onRemove={() => removeExperience(e.id)}>
          <Field label="Job Title"   value={e.role}    onChange={(v) => updateExperience(e.id, 'role', v)}    placeholder="Senior Engineer" />
          <Field label="Company"     value={e.company} onChange={(v) => updateExperience(e.id, 'company', v)} placeholder="Google" />
          <Field label="Date Range"  value={e.date}    onChange={(v) => updateExperience(e.id, 'date', v)}    placeholder="Jan 2021 – Present" />
          <Field
            label="Description" value={e.desc} onChange={(v) => updateExperience(e.id, 'desc', v)}
            multiline rows={3}
            placeholder="Led a team of 5 engineers to build... Increased performance by 40%..."
            helper="Start with action verbs. Add numbers & percentages for ATS."
          />
        </BlockCard>
      ))}
      <AddBtn onClick={addExperience} label="Add Experience" />
      <TipBox>Use action verbs like "Led", "Built", "Increased". Quantify results wherever possible.</TipBox>
    </Box>
  );

  /* ── Education ── */
  if (section === 'education') return (
    <Box sx={{ p: 2 }}>
      {resume.education.map((e, i) => (
        <BlockCard key={e.id} title={`Entry ${i + 1}`} onRemove={() => removeEducation(e.id)} accent="#60a5fa">
          <Field label="Degree / Qualification" value={e.degree} onChange={(v) => updateEducation(e.id, 'degree', v)} placeholder="B.S. Computer Science" />
          <Field label="School / University"    value={e.school} onChange={(v) => updateEducation(e.id, 'school', v)} placeholder="MIT" />
          <Field label="Years"                  value={e.date}   onChange={(v) => updateEducation(e.id, 'date', v)}   placeholder="2018 – 2022" />
          <Field label="Details (GPA, honors)"  value={e.desc}   onChange={(v) => updateEducation(e.id, 'desc', v)}   multiline rows={2} />
        </BlockCard>
      ))}
      <AddBtn onClick={addEducation} label="Add Education" />
    </Box>
  );

  /* ── Skills ── */
  if (section === 'skills') return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8', mb: 1.5, lineHeight: 1.6 }}>
        Add 8–15 skills. Include tools, languages, and frameworks relevant to your target role.
      </Typography>
      <SkillTags skills={resume.skills} onAdd={addSkill} onRemove={removeSkill} />
      <TipBox color="#22c55e" bg="rgba(34,197,94,0.05)" border="rgba(34,197,94,0.2)">
        ATS tip: Match skills exactly to keywords in the job description.
      </TipBox>
    </Box>
  );

  /* ── Projects ── */
  if (section === 'projects') return (
    <Box sx={{ p: 2 }}>
      {resume.projects.map((proj, i) => (
        <BlockCard key={proj.id} title={`Project ${i + 1}`} onRemove={() => removeProject(proj.id)} accent="#34d399">
          <Field label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, 'name', v)} placeholder="OpenMetrics Dashboard" />
          <Field
            label="Link / URL" value={proj.link} onChange={(v) => updateProject(proj.id, 'link', v)}
            placeholder="github.com/you/project" helper="Clickable link in PDF"
          />
          <Field label="Description" value={proj.desc} onChange={(v) => updateProject(proj.id, 'desc', v)} multiline rows={3} placeholder="Built with React and Node.js..." />
        </BlockCard>
      ))}
      <AddBtn onClick={addProject} label="Add Project" />
    </Box>
  );

  /* ── Certifications ── */
  if (section === 'certifications') return (
    <Box sx={{ p: 2 }}>
      {resume.certifications.map((c, i) => (
        <BlockCard key={c.id} title={`Certification ${i + 1}`} onRemove={() => removeCertification(c.id)} accent="#f59e0b">
          <Field label="Certification Name"      value={c.name} onChange={(v) => updateCertification(c.id, 'name', v)} placeholder="AWS Solutions Architect" />
          <Field label="Issuing Organization"    value={c.org}  onChange={(v) => updateCertification(c.id, 'org', v)}  placeholder="Amazon Web Services" />
          <Field label="Year"                    value={c.date} onChange={(v) => updateCertification(c.id, 'date', v)} placeholder="2023" />
        </BlockCard>
      ))}
      <AddBtn onClick={addCertification} label="Add Certification" />
    </Box>
  );

  /* ── Languages ── */
  if (section === 'languages') return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '0.72rem', color: '#8b8fa8', mb: 1.5, lineHeight: 1.6 }}>
        Add languages you speak and your proficiency level.
      </Typography>

      {/* Proficiency legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
        {[
          { level: 'Native',       color: '#22c55e' },
          { level: 'Fluent',       color: '#60a5fa' },
          { level: 'Advanced',     color: '#a78bfa' },
          { level: 'Intermediate', color: '#f59e0b' },
          { level: 'Basic',        color: '#f87171' },
        ].map((l) => (
          <Chip
            key={l.level}
            label={l.level}
            size="small"
            sx={{
              fontSize: '0.62rem', height: 18,
              background: `${l.color}15`,
              color: l.color,
              border: `1px solid ${l.color}40`,
            }}
          />
        ))}
      </Box>

      {(resume.languages || []).map((l, i) => (
        <BlockCard
          key={l.id}
          title={`Language ${i + 1}${l.name ? ` — ${l.name}` : ''}`}
          onRemove={() => removeLanguage(l.id)}
          accent="#a78bfa"
        >
          <Field
            label="Language"
            value={l.name}
            onChange={(v) => updateLanguage(l.id, 'name', v)}
            placeholder="e.g. English, Urdu, Arabic"
          />
          <Box sx={{ mb: 0.5 }}>
            <Label>Proficiency Level</Label>
            <Select
              fullWidth
              size="small"
              value={l.level || 'Conversational'}
              onChange={(e) => updateLanguage(l.id, 'level', e.target.value)}
              sx={{
                fontSize: '0.83rem',
                background: '#1a1d27',
                color: '#f0f0f8',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108,99,255,0.4)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6c63ff' },
                '& .MuiSelect-select': { py: '6px' },
              }}
            >
              {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic', 'Conversational'].map((lv) => (
                <MenuItem key={lv} value={lv} sx={{ fontSize: '0.83rem' }}>{lv}</MenuItem>
              ))}
            </Select>
          </Box>
        </BlockCard>
      ))}

      <AddBtn
        onClick={() => {
          if (typeof addLanguage === 'function') {
            addLanguage();
          } else {
            console.warn('addLanguage handler not found in handlers');
          }
        }}
        label="Add Language"
      />
    </Box>
  );

  return null;
}