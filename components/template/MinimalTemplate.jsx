export default function MinimalTemplate({ resume }) {
  const { personal: p, summary, experience, education, skills, projects, certifications, sections } = resume;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#1a1a2e', background: '#fff',
      minHeight: 1056, padding: 0 }}>
      {sections.personal && (
        <div style={{ padding: '40px 48px 28px', borderBottom: '2px solid #1a1a2e' }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>{p.name}</div>
          <div style={{ fontSize: 15, color: '#6b7280', marginTop: 4 }}>{p.title}</div>
          <div style={{ fontSize: 12, color: '#4b5563', marginTop: 10, lineHeight: 1.6 }}>{contact}</div>
        </div>
      )}
      <div style={{ padding: '24px 48px 40px' }}>
        {sections.summary && summary && (
          <>
            <STitle>Summary</STitle>
            <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{summary}</p>
          </>
        )}
        {sections.experience && experience.length > 0 && (
          <>
            <STitle>Experience</STitle>
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{e.role}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{e.date}</span>
                </div>
                <div style={{ fontSize: 13, color: '#374151' }}>{e.company}</div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4, lineHeight: 1.6 }}>{e.desc}</div>
              </div>
            ))}
          </>
        )}
        {sections.education && education.length > 0 && (
          <>
            <STitle>Education</STitle>
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{e.degree}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{e.date}</span>
                </div>
                <div style={{ fontSize: 13, color: '#374151' }}>{e.school}</div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>{e.desc}</div>
              </div>
            ))}
          </>
        )}
        {sections.skills && skills.length > 0 && (
          <>
            <STitle>Skills</STitle>
            <div>{skills.map((s, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4,
                background: '#f3f4f6', color: '#374151', fontSize: 12, margin: '2px 3px' }}>{s}</span>
            ))}</div>
          </>
        )}
        {sections.projects && projects.length > 0 && (
          <>
            <STitle>Projects</STitle>
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</span>
                {p.link && <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>{p.link}</span>}
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 3, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </>
        )}
        {sections.certifications && certifications.length > 0 && (
          <>
            <STitle>Certifications</STitle>
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{c.org} · {c.date}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
    
  );
  // Inside MinimalTemplate, add after certifications block:
{sections.languages && resume.languages?.length > 0 && (
  <>
    <STitle>Languages</STitle>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
      {resume.languages.map((l) => (
        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{l.name}</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100,
            background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {l.level}
          </span>
        </div>
      ))}
    </div>
  </>
)}
}

function STitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
      color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: 4,
      marginTop: 24, marginBottom: 12 }}>{children}</div>
  );
}