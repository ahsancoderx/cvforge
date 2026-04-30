export default function CorporateTemplate({ resume }) {
  const { personal: p, summary, experience, education, skills, projects, certifications, sections } = resume;
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', color: '#1a1a2e', minHeight: 1056 }}>
      {sections.personal && (
        <div style={{ background: '#1a1a2e', padding: '36px 48px', color: '#fff' }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.name}</div>
          <div style={{ color: '#a78bfa', fontSize: 14, marginTop: 4 }}>{p.title}</div>
          <div style={{ fontSize: 12, color: '#c4b5fd', marginTop: 10 }}>{contact}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', minHeight: 900 }}>
        <div style={{ padding: '28px 32px 28px 48px' }}>
          {sections.summary && summary && (<><CSTitle>Professional Summary</CSTitle>
            <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{summary}</p></>)}
          {sections.experience && experience.length > 0 && (<>
            <CSTitle>Experience</CSTitle>
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: '#6c63ff' }}>{e.company}</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{e.date}</span>
                </div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 6, lineHeight: 1.6 }}>{e.desc}</div>
              </div>
            ))}
          </>)}
          {sections.projects && projects.length > 0 && (<>
            <CSTitle>Projects</CSTitle>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{proj.name}</div>
                {proj.link && <div style={{ fontSize: 12, color: '#6c63ff' }}>{proj.link}</div>}
                <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>{proj.desc}</div>
              </div>
            ))}
          </>)}
        </div>
        <div style={{ background: '#f8f7ff', padding: '28px 16px', borderLeft: '1px solid #e9e4ff' }}>
          {sections.skills && skills.length > 0 && (<>
            <SideTitle>Skills</SideTitle>
            {skills.map((s, i) => (
              <div key={i} style={{ padding: '4px 8px', borderRadius: 6, background: '#ede9fe',
                color: '#5b21b6', fontSize: 12, marginBottom: 5, fontWeight: 500 }}>{s}</div>
            ))}
          </>)}
          {sections.education && education.length > 0 && (<>
            <SideTitle>Education</SideTitle>
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{e.degree}</div>
                <div style={{ fontSize: 11, color: '#6c63ff' }}>{e.school}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{e.date}</div>
              </div>
            ))}
          </>)}
          {sections.certifications && certifications.length > 0 && (<>
            <SideTitle>Certifications</SideTitle>
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{c.org} · {c.date}</div>
              </div>
            ))}
          </>)}
        </div>
      </div>
    </div>
  );
}

function CSTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#6c63ff', marginTop: 22, marginBottom: 10 }}>{children}</div>;
}
function SideTitle({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#6c63ff', marginTop: 18, marginBottom: 8 }}>{children}</div>;
}