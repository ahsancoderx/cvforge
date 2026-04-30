export default function CreativeTemplate({ resume }) {
  const { personal: p, summary, experience, education, skills, projects, certifications, sections } = resume;
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: 1056 }}>
      {sections.personal && (
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          padding: '36px 48px', color: '#fff' }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 34, fontWeight: 700 }}>{p.name}</div>
          <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>{p.title}</div>
          <div style={{ fontSize: 12, opacity: 0.82, marginTop: 10 }}>{contact}</div>
        </div>
      )}
      <div style={{ padding: '28px 48px 40px' }}>
        {sections.summary && summary && (<><CrTitle>About Me</CrTitle>
          <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{summary}</p></>)}
        {sections.experience && experience.length > 0 && (<>
          <CrTitle>Experience</CrTitle>
          {experience.map((e) => (
            <div key={e.id} style={{ borderLeft: '3px solid #fbbf24', paddingLeft: 16, marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.role}</div>
                  <div style={{ fontSize: 13, color: '#ef4444' }}>{e.company}</div>
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4, lineHeight: 1.6 }}>{e.desc}</div>
            </div>
          ))}
        </>)}
        {sections.education && education.length > 0 && (<>
          <CrTitle>Education</CrTitle>
          {education.map((e) => (
            <div key={e.id} style={{ borderLeft: '3px solid #fbbf24', paddingLeft: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{e.degree}</div>
              <div style={{ fontSize: 13, color: '#ef4444' }}>{e.school} · {e.date}</div>
              <div style={{ fontSize: 12, color: '#4b5563' }}>{e.desc}</div>
            </div>
          ))}
        </>)}
        {sections.skills && skills.length > 0 && (<>
          <CrTitle>Skills</CrTitle>
          <div style={{ marginBottom: 16 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 100,
                background: '#fff7ed', color: '#92400e', fontSize: 12, margin: '3px',
                border: '1px solid #fcd34d', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </>)}
        {sections.projects && projects.length > 0 && (<>
          <CrTitle>Projects</CrTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ borderLeft: '3px solid #fbbf24', paddingLeft: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{proj.name}</div>
              {proj.link && <div style={{ fontSize: 12, color: '#ef4444' }}>{proj.link}</div>}
              <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>{proj.desc}</div>
            </div>
          ))}
        </>)}
        {sections.certifications && certifications.length > 0 && (<>
          <CrTitle>Certifications</CrTitle>
          {certifications.map((c) => (
            <div key={c.id} style={{ borderLeft: '3px solid #fbbf24', paddingLeft: 16, marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{c.org} · {c.date}</div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

function CrTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700,
      color: '#1a1a2e', marginTop: 28, marginBottom: 14 }}>
      {children}
      <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
    </div>
  );
}