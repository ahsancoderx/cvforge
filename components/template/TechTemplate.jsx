export default function TechTemplate({ resume }) {
  const { personal: p, summary, experience, education, skills, projects, certifications, sections } = resume;
  const contact = [p.email, p.phone, p.location, p.github].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: 1056 }}>
      {sections.personal && (
        <div style={{ padding: '36px 48px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: 26, fontWeight: 700, color: '#111827' }}>{p.name}</div>
          <div style={{ fontSize: 13, color: '#059669', marginTop: 4, fontWeight: 600 }}>{'< '}{p.title}{' />'}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 10 }}>{contact}</div>
        </div>
      )}
      <div style={{ padding: '24px 48px 40px' }}>
        {sections.summary && summary && (<><TTitle>// summary</TTitle>
          <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{summary}</p></>)}
        {sections.experience && experience.length > 0 && (<>
          <TTitle>// experience</TTitle>
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{e.role}</span>
                  <span style={{ color: '#9ca3af', fontSize: 12, marginLeft: 8 }}>@ {e.company}</span>
                </div>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: '#9ca3af' }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4, lineHeight: 1.6 }}>{e.desc}</div>
            </div>
          ))}
        </>)}
        {sections.skills && skills.length > 0 && (<>
          <TTitle>// tech_stack</TTitle>
          <div style={{ marginBottom: 16 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4,
                background: '#ecfdf5', color: '#065f46', fontSize: 11, margin: '2px',
                border: '1px solid #a7f3d0', fontFamily: '"Space Mono", monospace' }}>{s}</span>
            ))}
          </div>
        </>)}
        {sections.projects && projects.length > 0 && (<>
          <TTitle>// projects</TTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{proj.name}</span>
              {proj.link && <span style={{ color: '#059669', fontSize: 12, marginLeft: 8 }}>→ {proj.link}</span>}
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4, lineHeight: 1.6 }}>{proj.desc}</div>
            </div>
          ))}
        </>)}
        {sections.education && education.length > 0 && (<>
          <TTitle>// education</TTitle>
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{e.degree}</span>
              <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 8 }}>@ {e.school}</span>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>{e.date}</span>
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>{e.desc}</div>
            </div>
          ))}
        </>)}
        {sections.certifications && certifications.length > 0 && (<>
          <TTitle>// certifications</TTitle>
          {certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{c.org} · {c.date}</span>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

function TTitle({ children }) {
  return <div style={{ fontFamily: '"Space Mono", monospace', fontSize: 12, fontWeight: 700,
    color: '#059669', borderLeft: '3px solid #059669', paddingLeft: 10,
    marginTop: 24, marginBottom: 12 }}>{children}</div>;
}