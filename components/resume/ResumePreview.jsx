'use client';
import React from 'react';

/* ── Shared link helper ──────────────────────────────────────────── */
function CVLink({ href, children, bw }) {
  if (!href) return <span>{children}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: bw ? '#333' : '#2563eb',
        textDecoration: bw ? 'underline' : 'none',
      }}
      onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
      onMouseLeave={(e) => { e.target.style.textDecoration = bw ? 'underline' : 'none'; }}
    >
      {children}
    </a>
  );
}

/* ── Social contacts bar ─────────────────────────────────────────── */
function ContactsBar({ personal, social, sectionsEnabled, bw, styles }) {
  const items = [];

  if (personal.email)
    items.push(<span key="email">{personal.email}</span>);
  if (personal.phone)
    items.push(<span key="phone">{personal.phone}</span>);
  if (personal.location)
    items.push(<span key="loc">{personal.location}</span>);
  if (personal.website)
    items.push(
      <CVLink key="web" href={personal.website} bw={bw}>
        {personal.website.replace(/https?:\/\//, '')}
      </CVLink>
    );

  if (sectionsEnabled && social) {
    if (social.linkedin)
      items.push(<CVLink key="li" href={social.linkedin} bw={bw}>LinkedIn</CVLink>);
    if (social.github)
      items.push(<CVLink key="gh" href={social.github} bw={bw}>GitHub</CVLink>);
    if (social.twitter)
      items.push(<CVLink key="tw" href={social.twitter} bw={bw}>Twitter</CVLink>);
    if (social.portfolio)
      items.push(<CVLink key="pf" href={social.portfolio} bw={bw}>Portfolio</CVLink>);
    if (social.other) {
      const [label, ...rest] = social.other.split(':');
      const url = rest.join(':').trim();
      if (url)
        items.push(<CVLink key="other" href={url} bw={bw}>{label.trim()}</CVLink>);
    }
  }

  return (
    <div style={styles.contacts}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ opacity: 0.5 }}> · </span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MINIMAL TEMPLATE
   ═══════════════════════════════════════════════════════════════════ */
function MinimalCV({ resume, bw }) {
  const { personal, summary, experience, education, skills, projects, certifications, social, sections } = resume;

  const S = {
    root:     { fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1a1a1a', background: '#fff', fontSize: 13 },
    header:   { padding: '32px 40px 22px', borderBottom: bw ? '2px solid #000' : '2px solid #e5e7eb' },
    name:     { fontSize: 28, fontWeight: 700, color: bw ? '#000' : '#111', letterSpacing: '-0.02em', margin: 0 },
    title:    { fontSize: 14, color: bw ? '#555' : '#6b7280', marginTop: 4, fontFamily: 'sans-serif' },
    contacts: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10, fontSize: 12, color: bw ? '#333' : '#6b7280', fontFamily: 'sans-serif' },
    body:     { padding: '22px 40px' },
    secTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: bw ? '#000' : '#6b7280', marginBottom: 8, paddingBottom: 4, borderBottom: bw ? '1px solid #000' : '1px solid #e5e7eb', fontFamily: 'sans-serif' },
    section:  { marginBottom: 20 },
    entry:    { marginBottom: 13 },
    entryHead:{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    eTitle:   { fontWeight: 700, fontSize: 13, color: '#111' },
    eDate:    { fontSize: 11, color: '#9ca3af', flexShrink: 0, marginLeft: 8, fontFamily: 'sans-serif' },
    eSub:     { fontSize: 12, color: bw ? '#555' : '#6b7280', marginTop: 1, fontFamily: 'sans-serif' },
    eDesc:    { fontSize: 12, color: '#374151', marginTop: 5, lineHeight: 1.6, fontFamily: 'sans-serif' },
    skillsList:{ display: 'flex', flexWrap: 'wrap', gap: 5 },
    skill:    { background: bw ? '#eee' : '#f3f4f6', color: bw ? '#000' : '#374151', borderRadius: 3, padding: '3px 9px', fontSize: 11, fontFamily: 'sans-serif' },
    summary:  { fontSize: 13, color: '#374151', lineHeight: 1.65, fontFamily: 'sans-serif' },
    projLink: { fontSize: 11, color: bw ? '#333' : '#2563eb', textDecoration: bw ? 'underline' : 'none', display: 'block', marginTop: 2, fontFamily: 'sans-serif' },
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.name}>{personal.name}</div>
        <div style={S.title}>{personal.title}</div>
        <ContactsBar personal={personal} social={social} sectionsEnabled={sections.social} bw={bw} styles={S} />
      </div>
      <div style={S.body}>
        {sections.summary && summary && (
          <div style={S.section}>
            <div style={S.secTitle}>Summary</div>
            <p style={S.summary}>{summary}</p>
          </div>
        )}
        {sections.experience && experience.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Experience</div>
            {experience.filter(e => e.role || e.company).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}>
                  <span style={S.eTitle}>{e.role}</span>
                  <span style={S.eDate}>{e.date}</span>
                </div>
                <div style={S.eSub}>{e.company}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.education && education.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Education</div>
            {education.filter(e => e.degree || e.school).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}>
                  <span style={S.eTitle}>{e.degree}</span>
                  <span style={S.eDate}>{e.date}</span>
                </div>
                <div style={S.eSub}>{e.school}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.skills && skills.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Skills</div>
            <div style={S.skillsList}>{skills.map(sk => <span key={sk} style={S.skill}>{sk}</span>)}</div>
          </div>
        )}
        {sections.projects && projects.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Projects</div>
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} style={S.entry}>
                <div style={S.entryHead}>
                  <span style={S.eTitle}>{p.link ? <CVLink href={p.link} bw={bw}>{p.name}</CVLink> : p.name}</span>
                </div>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={S.projLink}>{p.link}</a>}
                {p.desc && <div style={S.eDesc}>{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.certifications && certifications.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Certifications</div>
            {certifications.filter(c => c.name).map((c) => (
              <div key={c.id} style={S.entry}>
                <div style={S.entryHead}>
                  <span style={S.eTitle}>{c.name}</span>
                  <span style={S.eDate}>{c.date}</span>
                </div>
                <div style={S.eSub}>{c.org}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CORPORATE TEMPLATE
   ═══════════════════════════════════════════════════════════════════ */
function CorporateCV({ resume, bw }) {
  const { personal, summary, experience, education, skills, projects, certifications, social, sections } = resume;

  const headerBg    = bw ? '#fff' : '#1e3a5f';
  const headerText  = bw ? '#000' : '#fff';
  const accentColor = bw ? '#000' : '#1e3a5f';
  const contactColor= bw ? '#555' : '#bfdbfe';

  const S = {
    root:     { fontFamily: "'Arial', 'Helvetica', sans-serif", color: '#1a1a1a', background: '#fff', fontSize: 13 },
    header:   { background: headerBg, padding: '30px 40px 22px', borderBottom: bw ? '2px solid #000' : 'none', color: headerText },
    name:     { fontSize: 26, fontWeight: 700, color: bw ? '#000' : '#fff', margin: 0 },
    title:    { fontSize: 13, color: bw ? '#555' : '#93c5fd', marginTop: 4 },
    contacts: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10, fontSize: 12, color: contactColor },
    body:     { padding: '22px 40px' },
    secTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accentColor, marginBottom: 9, paddingBottom: 3, borderBottom: `2px solid ${accentColor}` },
    section:  { marginBottom: 20 },
    entry:    { marginBottom: 13 },
    entryHead:{ display: 'flex', justifyContent: 'space-between' },
    eTitle:   { fontWeight: 700, fontSize: 13, color: '#111' },
    eDate:    { fontSize: 11, color: '#9ca3af', flexShrink: 0 },
    eSub:     { fontSize: 12, color: bw ? '#555' : '#1e3a5f', fontWeight: 600, marginTop: 1 },
    eDesc:    { fontSize: 12, color: '#374151', marginTop: 4, lineHeight: 1.5 },
    skillsList:{ display: 'flex', flexWrap: 'wrap', gap: 5 },
    skill:    { background: bw ? '#eee' : '#eff6ff', color: bw ? '#000' : '#1e40af', border: bw ? '1px solid #aaa' : '1px solid #bfdbfe', borderRadius: 3, padding: '2px 9px', fontSize: 11 },
    summary:  { fontSize: 12, color: '#374151', lineHeight: 1.6 },
    projLink: { fontSize: 11, color: bw ? '#333' : '#2563eb', textDecoration: bw ? 'underline' : 'none', display: 'block', marginTop: 2 },
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.name}>{personal.name}</div>
        <div style={S.title}>{personal.title}</div>
        <ContactsBar personal={personal} social={social} sectionsEnabled={sections.social} bw={bw} styles={S} />
      </div>
      <div style={S.body}>
        {sections.summary && summary && (<div style={S.section}><div style={S.secTitle}>Summary</div><p style={S.summary}>{summary}</p></div>)}
        {sections.experience && experience.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Experience</div>
            {experience.filter(e => e.role || e.company).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.role}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.company}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.education && education.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Education</div>
            {education.filter(e => e.degree || e.school).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.degree}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.school}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.skills && skills.length > 0 && (
          <div style={S.section}><div style={S.secTitle}>Skills</div>
            <div style={S.skillsList}>{skills.map(sk => <span key={sk} style={S.skill}>{sk}</span>)}</div>
          </div>
        )}
        {sections.projects && projects.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Projects</div>
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{p.link ? <CVLink href={p.link} bw={bw}>{p.name}</CVLink> : p.name}</span></div>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={S.projLink}>{p.link}</a>}
                {p.desc && <div style={S.eDesc}>{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.certifications && certifications.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Certifications</div>
            {certifications.filter(c => c.name).map((c) => (
              <div key={c.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{c.name}</span><span style={S.eDate}>{c.date}</span></div>
                <div style={S.eSub}>{c.org}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CREATIVE TEMPLATE
   ═══════════════════════════════════════════════════════════════════ */
function CreativeCV({ resume, bw }) {
  const { personal, summary, experience, education, skills, projects, certifications, social, sections } = resume;

  const S = {
    root:     { fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a1a', background: '#fff', fontSize: 13 },
    header:   { background: bw ? '#fff' : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', padding: '32px 40px 24px', color: bw ? '#000' : '#fff', borderBottom: bw ? '3px solid #000' : 'none' },
    name:     { fontSize: 30, fontWeight: 800, color: bw ? '#000' : '#fff', letterSpacing: '-0.03em', margin: 0 },
    title:    { fontSize: 13, color: bw ? '#555' : 'rgba(255,255,255,0.8)', marginTop: 5 },
    contacts: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10, fontSize: 12, color: bw ? '#444' : 'rgba(255,255,255,0.75)' },
    body:     { padding: '24px 40px' },
    secTitle: { fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: bw ? '#000' : '#7c3aed', marginBottom: 10, borderBottom: bw ? '2px solid #000' : '2px solid #ede9fe', paddingBottom: 4 },
    section:  { marginBottom: 22 },
    entry:    { marginBottom: 13 },
    entryHead:{ display: 'flex', justifyContent: 'space-between' },
    eTitle:   { fontWeight: 700, fontSize: 13, color: '#111' },
    eDate:    { fontSize: 11, color: '#9ca3af', flexShrink: 0 },
    eSub:     { fontSize: 12, color: bw ? '#555' : '#7c3aed', fontWeight: 600, marginTop: 1 },
    eDesc:    { fontSize: 12, color: '#374151', marginTop: 4, lineHeight: 1.55 },
    skillsList:{ display: 'flex', flexWrap: 'wrap', gap: 5 },
    skill:    { background: bw ? '#eee' : '#f5f3ff', color: bw ? '#000' : '#7c3aed', border: bw ? '1px solid #aaa' : '1px solid #ddd6fe', borderRadius: 20, padding: '3px 12px', fontSize: 11 },
    summary:  { fontSize: 12.5, color: '#374151', lineHeight: 1.65 },
    projLink: { fontSize: 11, color: bw ? '#333' : '#2563eb', textDecoration: bw ? 'underline' : 'none', display: 'block', marginTop: 2 },
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.name}>{personal.name}</div>
        <div style={S.title}>{personal.title}</div>
        <ContactsBar personal={personal} social={social} sectionsEnabled={sections.social} bw={bw} styles={S} />
      </div>
      <div style={S.body}>
        {sections.summary && summary && (<div style={S.section}><div style={S.secTitle}>Summary</div><p style={S.summary}>{summary}</p></div>)}
        {sections.experience && experience.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Experience</div>
            {experience.filter(e => e.role || e.company).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.role}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.company}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.education && education.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Education</div>
            {education.filter(e => e.degree || e.school).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.degree}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.school}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.skills && skills.length > 0 && (
          <div style={S.section}><div style={S.secTitle}>Skills</div>
            <div style={S.skillsList}>{skills.map(sk => <span key={sk} style={S.skill}>{sk}</span>)}</div>
          </div>
        )}
        {sections.projects && projects.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Projects</div>
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{p.link ? <CVLink href={p.link} bw={bw}>{p.name}</CVLink> : p.name}</span></div>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={S.projLink}>{p.link}</a>}
                {p.desc && <div style={S.eDesc}>{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.certifications && certifications.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Certifications</div>
            {certifications.filter(c => c.name).map((c) => (
              <div key={c.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{c.name}</span><span style={S.eDate}>{c.date}</span></div>
                <div style={S.eSub}>{c.org}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TECH PRO TEMPLATE
   ═══════════════════════════════════════════════════════════════════ */
function TechCV({ resume, bw }) {
  const { personal, summary, experience, education, skills, projects, certifications, social, sections } = resume;

  const S = {
    root:     { fontFamily: "'Courier New', 'Lucida Console', monospace", color: '#1a1a1a', background: '#fff', fontSize: 12.5 },
    header:   { background: bw ? '#fff' : '#0f172a', padding: '28px 40px 20px', borderBottom: bw ? '2px solid #000' : '2px solid #3b82f6', color: bw ? '#000' : '#e2e8f0' },
    name:     { fontSize: 24, fontWeight: 700, color: bw ? '#000' : '#60a5fa', margin: 0 },
    title:    { fontSize: 12, color: bw ? '#555' : '#94a3b8', marginTop: 4 },
    contacts: { display: 'flex', flexWrap: 'wrap', gap: '3px 12px', marginTop: 8, fontSize: 11, color: bw ? '#444' : '#94a3b8' },
    body:     { padding: '20px 40px' },
    secTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: bw ? '#000' : '#3b82f6', marginBottom: 8, borderLeft: bw ? '3px solid #000' : '3px solid #3b82f6', paddingLeft: 8 },
    section:  { marginBottom: 18 },
    entry:    { marginBottom: 11 },
    entryHead:{ display: 'flex', justifyContent: 'space-between' },
    eTitle:   { fontWeight: 700, fontSize: 12.5, color: '#0f172a' },
    eDate:    { fontSize: 11, color: '#94a3b8', flexShrink: 0 },
    eSub:     { fontSize: 11.5, color: bw ? '#555' : '#3b82f6', marginTop: 1 },
    eDesc:    { fontSize: 11.5, color: '#374151', marginTop: 4, lineHeight: 1.5 },
    skillsList:{ display: 'flex', flexWrap: 'wrap', gap: 4 },
    skill:    { background: bw ? '#eee' : '#eff6ff', color: bw ? '#000' : '#1d4ed8', border: bw ? '1px solid #aaa' : '1px solid #bfdbfe', borderRadius: 2, padding: '2px 7px', fontSize: 10.5 },
    summary:  { fontSize: 12, color: '#374151', lineHeight: 1.6 },
    projLink: { fontSize: 11, color: bw ? '#333' : '#2563eb', textDecoration: bw ? 'underline' : 'none', display: 'block', marginTop: 2 },
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.name}>{personal.name}</div>
        <div style={S.title}>{personal.title}</div>
        <ContactsBar personal={personal} social={social} sectionsEnabled={sections.social} bw={bw} styles={S} />
      </div>
      <div style={S.body}>
        {sections.summary && summary && (<div style={S.section}><div style={S.secTitle}>Summary</div><p style={S.summary}>{summary}</p></div>)}
        {sections.experience && experience.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Experience</div>
            {experience.filter(e => e.role || e.company).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.role}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.company}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.education && education.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Education</div>
            {education.filter(e => e.degree || e.school).map((e) => (
              <div key={e.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{e.degree}</span><span style={S.eDate}>{e.date}</span></div>
                <div style={S.eSub}>{e.school}</div>
                {e.desc && <div style={S.eDesc}>{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.skills && skills.length > 0 && (
          <div style={S.section}><div style={S.secTitle}>Skills</div>
            <div style={S.skillsList}>{skills.map(sk => <span key={sk} style={S.skill}>{sk}</span>)}</div>
          </div>
        )}
        {sections.projects && projects.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Projects</div>
            {projects.filter(p => p.name).map((p) => (
              <div key={p.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{p.link ? <CVLink href={p.link} bw={bw}>{p.name}</CVLink> : p.name}</span></div>
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={S.projLink}>{p.link}</a>}
                {p.desc && <div style={S.eDesc}>{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {sections.certifications && certifications.length > 0 && (
          <div style={S.section}>
            <div style={S.secTitle}>Certifications</div>
            {certifications.filter(c => c.name).map((c) => (
              <div key={c.id} style={S.entry}>
                <div style={S.entryHead}><span style={S.eTitle}>{c.name}</span><span style={S.eDate}>{c.date}</span></div>
                <div style={S.eSub}>{c.org}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PURPLE ELEGANCE TEMPLATE  (two-column, Playfair Display header)
   ═══════════════════════════════════════════════════════════════════ */
function PurpleCV({ resume, bw }) {
  const { personal, summary, experience, education, skills, projects, certifications, social, sections } = resume;

  const accent      = bw ? '#000'     : '#4a1942';
  const accentLight = bw ? '#555'     : '#7c3a6e';
  const headerBg    = bw ? '#fff'     : '#4a1942';
  const headerText  = bw ? '#000'     : '#fff';
  const leftBg      = bw ? '#f5f5f5' : '#f7f0f6';
  const leftBorder  = bw ? '#ccc'     : '#e2d0de';
  const dateBg      = bw ? '#ccc'     : '#4a1942';
  const dateText    = bw ? '#000'     : '#fff';

  const contactItems = [
    { label: 'Phone',   value: personal.phone,    href: null },
    { label: 'Email',   value: personal.email,    href: personal.email   ? `mailto:${personal.email}`   : null },
    { label: 'Address', value: personal.location, href: null },
    { label: 'Website', value: personal.website,  href: personal.website || null },
    sections.social && social?.linkedin  ? { label: 'LinkedIn',  value: 'linkedin.com/in/…', href: social.linkedin  } : null,
    sections.social && social?.github    ? { label: 'GitHub',    value: 'github.com/…',      href: social.github    } : null,
    sections.social && social?.twitter   ? { label: 'Twitter',   value: 'twitter.com/…',     href: social.twitter   } : null,
    sections.social && social?.portfolio ? { label: 'Portfolio', value: 'portfolio',          href: social.portfolio } : null,
  ].filter(Boolean).filter(item => item.value);

  const icons = {
    Phone:   <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>,
    Email:   <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
    Address: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>,
    Website: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>,
    default: <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>,
  };
  const getIcon = (label) => icons[label] || icons.default;

  const SecTitle = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginTop: 20, marginBottom: 12 }}>
      {children}
    </div>
  );

  const Entry = ({ children }) => (
    <div style={{ marginBottom: 16, paddingLeft: 12, borderLeft: `2px solid ${accentLight}` }}>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Lato', 'Arial', sans-serif", background: '#fff', color: '#222', fontSize: 13 }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#fff' }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', border: `4px solid ${accent}`, background: bw ? '#eee' : '#f5eef4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {personal.photoUrl
              ? <img src={personal.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <svg viewBox="0 0 40 40" width="52" height="52" fill={accentLight}><circle cx="20" cy="14" r="8"/><ellipse cx="20" cy="30" rx="14" ry="9"/></svg>
            }
          </div>
        </div>
        <div style={{ flex: 1, background: headerBg, padding: '30px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: bw ? `2px solid #000` : 'none' }}>
          <div style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 30, color: headerText, letterSpacing: 1, fontWeight: 700 }}>{personal.name}</div>
          <div style={{ fontSize: 12, color: bw ? '#555' : 'rgba(255,255,255,0.8)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>{personal.title}</div>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 700 }}>
        <div style={{ width: 195, flexShrink: 0, background: leftBg, padding: '22px 18px', borderRight: `1px solid ${leftBorder}` }}>
          <div style={{ marginTop: 0 }}>
            <SecTitle>Contact</SecTitle>
            {contactItems.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, background: accent, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="#fff">{getIcon(item.label)}</svg>
                </div>
                <div style={{ fontSize: 11, color: '#333', lineHeight: 1.5 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block' }}>{item.label}</span>
                  {item.href
                    ? <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: bw ? '#333' : accent, textDecoration: bw ? 'underline' : 'none', wordBreak: 'break-all' }}>
                        {['LinkedIn','GitHub','Twitter','Portfolio'].includes(item.label) ? item.label : item.value}
                      </a>
                    : <span style={{ wordBreak: 'break-all' }}>{item.value}</span>
                  }
                </div>
              </div>
            ))}
          </div>
          {sections.skills && skills.length > 0 && (
            <div>
              <SecTitle>Skills</SecTitle>
              {skills.map((sk) => (
                <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, color: '#333' }}>
                  <span style={{ color: accent, fontSize: 10 }}>▸</span>{sk}
                </div>
              ))}
            </div>
          )}
          {resume.languages && resume.languages.length > 0 && (
            <div>
              <SecTitle>Languages</SecTitle>
              {resume.languages.map((lang) => (
                <div key={lang.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: '#333' }}>{lang.name}</span>
                  <span style={{ fontSize: 10, color: '#888', background: '#fff', border: '1px solid #ddd', padding: '1px 7px', borderRadius: 10 }}>{lang.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: '24px 28px' }}>
          {sections.summary && summary && (
            <div>
              <SecTitle>Profile</SecTitle>
              <p style={{ fontSize: 11.5, color: '#666', lineHeight: 1.8, textAlign: 'justify', margin: 0 }}>{summary}</p>
            </div>
          )}
          {sections.education && education.length > 0 && (
            <div>
              <SecTitle>Education</SecTitle>
              {education.filter(e => e.degree || e.school).map((e) => (
                <Entry key={e.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{e.degree}</div>
                      <div style={{ fontSize: 11, color: accentLight, marginTop: 2 }}>{e.school}</div>
                      {e.desc && <div style={{ fontSize: 10, color: '#999', marginTop: 1 }}>{e.desc}</div>}
                    </div>
                    {e.date && <span style={{ fontSize: 10, color: dateText, background: dateBg, padding: '2px 9px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>{e.date}</span>}
                  </div>
                </Entry>
              ))}
            </div>
          )}
          {sections.experience && experience.length > 0 && (
            <div>
              <SecTitle>Experience</SecTitle>
              {experience.filter(e => e.role || e.company).map((e) => (
                <Entry key={e.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{e.role}</div>
                      <div style={{ fontSize: 11, color: accentLight, marginTop: 2 }}>{e.company}</div>
                    </div>
                    {e.date && <span style={{ fontSize: 10, color: dateText, background: dateBg, padding: '2px 9px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>{e.date}</span>}
                  </div>
                  {e.desc && <div style={{ fontSize: 11, color: '#666', marginTop: 5, lineHeight: 1.6 }}>{e.desc}</div>}
                </Entry>
              ))}
            </div>
          )}
          {sections.projects && projects.length > 0 && (
            <div>
              <SecTitle>Projects</SecTitle>
              {projects.filter(p => p.name).map((p) => (
                <Entry key={p.id}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>
                    {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: bw ? '#000' : accent, textDecoration: 'none' }}>{p.name}</a> : p.name}
                  </div>
                  {p.link && <div style={{ fontSize: 10, marginTop: 2 }}><a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: bw ? '#333' : '#2563eb', textDecoration: bw ? 'underline' : 'none' }}>{p.link}</a></div>}
                  {p.desc && <div style={{ fontSize: 11, color: '#666', marginTop: 5, lineHeight: 1.6 }}>{p.desc}</div>}
                </Entry>
              ))}
            </div>
          )}
          {sections.certifications && certifications.length > 0 && (
            <div>
              <SecTitle>Certifications</SecTitle>
              {certifications.filter(c => c.name).map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 9 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                    <strong style={{ color: '#222' }}>{c.name}</strong>
                    {c.org && <span style={{ color: '#888' }}> — {c.org}</span>}
                    {c.date && <span style={{ color: '#aaa' }}> · {c.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PURPLE CLASSIC TEMPLATE  ← NEW (purple2)
   Simple two-column layout, photo in header, skills/certs in sidebar
   ═══════════════════════════════════════════════════════════════════ */
function PurpleClassicCV({ resume, bw }) {
  const { personal: p, summary, education, experience, skills, projects, certifications, sections } = resume;

  const accent = bw ? '#333' : '#4a1942';
  const accentLight = bw ? '#555' : '#7c3a6e';

  function PTitle({ children }) {
    return (
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 14, marginTop: 20 }}>
        {children}
      </div>
    );
  }

  function PItem({ label, value }) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#333', marginTop: 3 }}>{value}</div>
      </div>
    );
  }

  function Entry({ title, sub, date, desc }) {
    return (
      <div style={{ borderLeft: `2px solid ${accentLight}`, paddingLeft: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
          {date && (
            <span style={{ fontSize: 10, color: bw ? '#000' : '#fff', background: bw ? '#ccc' : accent, padding: '2px 8px', borderRadius: 10 }}>
              {date}
            </span>
          )}
        </div>
        {sub  && <div style={{ fontSize: 11, color: accentLight, marginTop: 3 }}>{sub}</div>}
        {desc && <div style={{ fontSize: 11, color: '#666', marginTop: 5, lineHeight: 1.6 }}>{desc}</div>}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Lato, sans-serif', background: '#fff', minHeight: 1056 }}>

      {/* ── Header ── */}
      {sections.personal && (
        <div style={{ display: 'flex' }}>
          <div style={{ width: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', border: `4px solid ${accent}`, overflow: 'hidden', background: bw ? '#eee' : '#f5eef4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.photoUrl || p.image
                ? <img src={p.photoUrl || p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg viewBox="0 0 40 40" width="52" height="52" fill={accentLight}><circle cx="20" cy="14" r="8"/><ellipse cx="20" cy="30" rx="14" ry="9"/></svg>
              }
            </div>
          </div>
          <div style={{ flex: 1, background: bw ? '#fff' : accent, padding: '30px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: bw ? '2px solid #000' : 'none' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: bw ? '#000' : '#fff' }}>{p.name}</div>
            <div style={{ fontSize: 12, color: bw ? '#555' : 'rgba(255,255,255,.8)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>{p.title}</div>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ display: 'flex' }}>

        {/* Left Sidebar */}
        <div style={{ width: 195, background: bw ? '#f5f5f5' : '#f7f0f6', padding: 20, borderRight: `1px solid ${bw ? '#ccc' : '#e2d0de'}` }}>
          {sections.personal && (
            <>
              <PTitle>Contact</PTitle>
              {p.phone    && <PItem label="Phone"   value={p.phone} />}
              {p.email    && <PItem label="Email"   value={p.email} />}
              {p.location && <PItem label="Address" value={p.location} />}
              {p.website  && <PItem label="Website" value={p.website} />}
            </>
          )}

          {sections.skills && skills?.length > 0 && (
            <>
              <PTitle>Skills</PTitle>
              {skills.map((skill, i) => (
                <div key={i} style={{ marginBottom: 6, fontSize: 12, color: '#333', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: accent, fontSize: 10 }}>▸</span>{skill}
                </div>
              ))}
            </>
          )}

          {sections.certifications && certifications?.length > 0 && (
            <>
              <PTitle>Certifications</PTitle>
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: '#777' }}>{c.org}</div>
                  {c.date && <div style={{ fontSize: 10, color: '#aaa' }}>{c.date}</div>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, padding: 28 }}>
          {sections.summary && summary && (
            <>
              <PTitle>Profile</PTitle>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.8, margin: '0 0 4px' }}>{summary}</p>
            </>
          )}

          {sections.experience && experience?.length > 0 && (
            <>
              <PTitle>Experience</PTitle>
              {experience.filter(e => e.role || e.company).map((e) => (
                <Entry key={e.id} title={e.role} sub={e.company} date={e.date} desc={e.desc} />
              ))}
            </>
          )}

          {sections.education && education?.length > 0 && (
            <>
              <PTitle>Education</PTitle>
              {education.filter(e => e.degree || e.school).map((e) => (
                <Entry key={e.id} title={e.degree} sub={e.school} date={e.date} desc={e.desc} />
              ))}
            </>
          )}

          {sections.projects && projects?.length > 0 && (
            <>
              <PTitle>Projects</PTitle>
              {projects.filter(pr => pr.name).map((pr) => (
                <Entry key={pr.id} title={pr.name} date={pr.date} desc={pr.desc} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT — picks template + applies bw flag
   ═══════════════════════════════════════════════════════════════════ */
export default function ResumePreview({ resume, bw = false }) {
  const T = resume.template;
  const props = { resume, bw };

  return (
    <div
      id="cv-print-area"
      style={{
        width: 700,
        maxWidth: '100%',
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 40px rgba(0,0,0,0.45)',
      }}
    >
      {T === 'minimal'   && <MinimalCV        {...props} />}
      {T === 'corporate' && <CorporateCV       {...props} />}
      {T === 'creative'  && <CreativeCV        {...props} />}
      {T === 'tech'      && <TechCV            {...props} />}
      {T === 'purple'    && <PurpleCV          {...props} />}
      {T === 'purple2'   && <PurpleClassicCV   {...props} />}
    </div>
  );
}