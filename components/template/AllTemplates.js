'use client';

/* ── shared helpers ─────────────────────────────── */
function SecMin({ children, accent }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
    color:accent, borderBottom:`1px solid ${accent}44`, paddingBottom:3, margin:'16px 0 8px' }}>{children}</div>;
}
function SecCorp({ children, accent }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
    color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:3, margin:'14px 0 8px' }}>{children}</div>;
}
function SecCreative({ children, accent }) {
  return <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:700,
    color:'#1a1a2e', margin:'18px 0 10px' }}>
    <span>{children}</span>
    <div style={{ flex:1, height:2, background:`linear-gradient(90deg,${accent},transparent)` }} />
  </div>;
}
function SecTech({ children, accent }) {
  return <div style={{ fontFamily:'"Space Mono",monospace', fontSize:10, fontWeight:700, color:accent,
    borderLeft:`3px solid ${accent}`, paddingLeft:8, margin:'16px 0 8px' }}>{children}</div>;
}
function SecSlate({ children }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
    color:'#6366f1', borderBottom:'1px solid #e2e8f0', paddingBottom:3, margin:'16px 0 8px' }}>{children}</div>;
}
function SecMarine({ children, accent }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
    color:'#fff', background:accent, padding:'3px 8px', borderRadius:3, margin:'14px 0 8px', display:'inline-block' }}>{children}</div>;
}
function SecCrimson({ children }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
    color:'#9f1239', borderBottom:'1px solid #fecdd3', paddingBottom:3, margin:'14px 0 8px' }}>{children}</div>;
}
function SecForest({ children, accent }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
    color:accent, borderBottom:'2px solid #4ade80', paddingBottom:3, margin:'14px 0 8px' }}>{children}</div>;
}

function SkillPill({ s, bg, color, border }) {
  return <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:4, background:bg,
    color, fontSize:11, margin:'2px 3px', border:`1px solid ${border}` }}>{s}</span>;
}

function LangBadge({ l, accent }) {
  return <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
    <b style={{ fontSize:12 }}>{l.name}</b>
    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:100, background:`${accent}18`,
      color:accent, border:`1px solid ${accent}33` }}>{l.level}</span>
  </span>;
}

function ProfileIcon({ accent }) {
  return <svg viewBox="0 0 40 40" width="48" height="48" fill={accent}>
    <circle cx="20" cy="14" r="8"/><ellipse cx="20" cy="30" rx="13" ry="8"/>
  </svg>;
}

/* ─────────────────────────────────────────────────
   1. MINIMAL
───────────────────────────────────────────────── */
export function MinimalTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = resume.colorTheme || '#6c63ff';
  const contact = [p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio, p.twitter].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', color:'#1a1a2e', background:'#fff', minHeight:1056 }}>
      {sections.personal && <div style={{ padding:'40px 48px 24px', borderBottom:`2px solid ${accent}` }}>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:32, fontWeight:700 }}>{p.name}</div>
        <div style={{ fontSize:15, color:accent, marginTop:4 }}>{p.title}</div>
        <div style={{ fontSize:11, color:'#6b7280', marginTop:8, lineHeight:1.8 }}>{contact}</div>
      </div>}
      <div style={{ padding:'24px 48px 40px' }}>
        {sections.summary && summary && <><SecMin accent={accent}>Summary</SecMin><p style={{ fontSize:12, color:'#4b5563', lineHeight:1.7 }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecMin accent={accent}>Experience</SecMin>
          {experience.map(e => <div key={e.id} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:13 }}>{e.role}</b><span style={{ fontSize:11, color:'#9ca3af' }}>{e.date}</span></div>
            <div style={{ fontSize:12, color:accent }}>{e.company}</div>
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.6 }}>{e.desc}</div>
          </div>)}
        </>}
        {sections.education && education?.length > 0 && <><SecMin accent={accent}>Education</SecMin>
          {education.map(e => <div key={e.id} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:13 }}>{e.degree}</b><span style={{ fontSize:11, color:'#9ca3af' }}>{e.date}</span></div>
            <div style={{ fontSize:12, color:accent }}>{e.school}</div>
            <div style={{ fontSize:11, color:'#4b5563' }}>{e.desc}</div>
          </div>)}
        </>}
        {sections.skills && skills?.length > 0 && <><SecMin accent={accent}>Skills</SecMin>
          <div>{skills.map((s,i) => <SkillPill key={i} s={s} bg={`${accent}18`} color={accent} border={`${accent}33`} />)}</div>
        </>}
        {sections.projects && projects?.length > 0 && <><SecMin accent={accent}>Projects</SecMin>
          {projects.map(proj => <div key={proj.id} style={{ marginBottom:12 }}>
            <b style={{ fontSize:13 }}>{proj.name}</b>{proj.link && <span style={{ color:accent, fontSize:11, marginLeft:6 }}>— {proj.link}</span>}
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{proj.desc}</div>
          </div>)}
        </>}
        {sections.certifications && certifications?.length > 0 && <><SecMin accent={accent}>Certifications</SecMin>
          {certifications.map(c => <div key={c.id} style={{ marginBottom:8 }}>
            <b style={{ fontSize:13 }}>{c.name}</b><span style={{ fontSize:11, color:accent, marginLeft:6 }}>— {c.org}</span><span style={{ fontSize:10, color:'#9ca3af', marginLeft:6 }}>{c.date}</span>
          </div>)}
        </>}
        {sections.languages && languages?.length > 0 && <><SecMin accent={accent}>Languages</SecMin>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>{languages.map(l => <LangBadge key={l.id} l={l} accent={accent} />)}</div>
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   2. CORPORATE
───────────────────────────────────────────────── */
export function CorporateTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = resume.colorTheme || '#1e3a5f';
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', background:'#fff', color:'#1a1a2e' }}>
      {sections.personal && <div style={{ background:accent, padding:'28px 40px', color:'#fff' }}>
        <div style={{ fontSize:26, fontWeight:700 }}>{p.name}</div>
        <div style={{ color:'#93c5fd', fontSize:13, marginTop:3 }}>{p.title}</div>
        <div style={{ fontSize:11, color:'#bfdbfe', marginTop:8 }}>{contact}</div>
      </div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 190px', minHeight:900 }}>
        <div style={{ padding:'22px 24px 22px 40px' }}>
          {sections.summary && summary && <><SecCorp accent={accent}>Professional Summary</SecCorp><p style={{ fontSize:12, color:'#374151', lineHeight:1.65 }}>{summary}</p></>}
          {sections.experience && experience?.length > 0 && <><SecCorp accent={accent}>Experience</SecCorp>
            {experience.map(e => <div key={e.id} style={{ marginBottom:16, paddingBottom:14, borderBottom:'1px solid #f3f4f6' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><div><div style={{ fontSize:13, fontWeight:700 }}>{e.role}</div><div style={{ fontSize:12, color:accent, fontWeight:600 }}>{e.company}</div></div><span style={{ fontSize:11, color:'#9ca3af' }}>{e.date}</span></div>
              <div style={{ fontSize:11, color:'#4b5563', marginTop:5, lineHeight:1.5 }}>{e.desc}</div>
            </div>)}
          </>}
          {sections.projects && projects?.length > 0 && <><SecCorp accent={accent}>Projects</SecCorp>
            {projects.map(proj => <div key={proj.id} style={{ marginBottom:12 }}>
              <b style={{ fontSize:13 }}>{proj.name}</b>{proj.link && <span style={{ color:accent, fontSize:11, marginLeft:6 }}>{proj.link}</span>}
              <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>{proj.desc}</div>
            </div>)}
          </>}
        </div>
        <div style={{ background:'#eff6ff', padding:'22px 14px', borderLeft:'1px solid #bfdbfe' }}>
          {sections.skills && skills?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, marginBottom:8 }}>Skills</div>
            {skills.map((s,i) => <div key={i} style={{ padding:'4px 8px', borderRadius:5, background:'#dbeafe', color:'#1e40af', fontSize:11, marginBottom:4, fontWeight:500 }}>{s}</div>)}
          </>}
          {sections.education && education?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, margin:'14px 0 8px' }}>Education</div>
            {education.map(e => <div key={e.id} style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:700 }}>{e.degree}</div><div style={{ fontSize:10, color:accent }}>{e.school}</div><div style={{ fontSize:10, color:'#9ca3af' }}>{e.date}</div></div>)}
          </>}
          {sections.certifications && certifications?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, margin:'14px 0 8px' }}>Certifications</div>
            {certifications.map(c => <div key={c.id} style={{ marginBottom:8 }}><div style={{ fontSize:11, fontWeight:600 }}>{c.name}</div><div style={{ fontSize:10, color:'#6b7280' }}>{c.org} · {c.date}</div></div>)}
          </>}
          {sections.languages && languages?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, margin:'14px 0 8px' }}>Languages</div>
            {languages.map(l => <div key={l.id} style={{ marginBottom:6 }}><div style={{ fontSize:11, fontWeight:600 }}>{l.name}</div><div style={{ fontSize:10, color:accent }}>{l.level}</div></div>)}
          </>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   3. CREATIVE
───────────────────────────────────────────────── */
export function CreativeTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = resume.colorTheme || '#f59e0b';
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', background:'#fff', color:'#1a1a2e' }}>
      {sections.personal && <div style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)', padding:'32px 40px', color:'#fff' }}>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:30, fontWeight:700 }}>{p.name}</div>
        <div style={{ fontSize:13, opacity:0.9, marginTop:4 }}>{p.title}</div>
        <div style={{ fontSize:11, opacity:0.8, marginTop:8 }}>{contact}</div>
      </div>}
      <div style={{ padding:'22px 40px 40px' }}>
        {sections.summary && summary && <><SecCreative accent={accent}>About Me</SecCreative><p style={{ fontSize:12, color:'#4b5563', lineHeight:1.7 }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecCreative accent={accent}>Experience</SecCreative>
          {experience.map(e => <div key={e.id} style={{ borderLeft:'3px solid #fbbf24', paddingLeft:14, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div><b style={{ fontSize:13 }}>{e.role}</b><div style={{ fontSize:12, color:'#ef4444' }}>{e.company}</div></div><span style={{ fontSize:11, color:'#9ca3af' }}>{e.date}</span></div>
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{e.desc}</div>
          </div>)}
        </>}
        {sections.education && education?.length > 0 && <><SecCreative accent={accent}>Education</SecCreative>
          {education.map(e => <div key={e.id} style={{ borderLeft:'3px solid #fbbf24', paddingLeft:14, marginBottom:12 }}>
            <b style={{ fontSize:13 }}>{e.degree}</b><div style={{ fontSize:12, color:'#ef4444' }}>{e.school} · {e.date}</div>
          </div>)}
        </>}
        {sections.skills && skills?.length > 0 && <><SecCreative accent={accent}>Skills</SecCreative>
          <div>{skills.map((s,i) => <span key={i} style={{ display:'inline-block', padding:'3px 12px', borderRadius:100, background:'#fff7ed', color:'#92400e', fontSize:11, margin:'2px', border:'1px solid #fcd34d', fontWeight:500 }}>{s}</span>)}</div>
        </>}
        {sections.projects && projects?.length > 0 && <><SecCreative accent={accent}>Projects</SecCreative>
          {projects.map(proj => <div key={proj.id} style={{ borderLeft:'3px solid #fbbf24', paddingLeft:14, marginBottom:12 }}>
            <b style={{ fontSize:13 }}>{proj.name}</b>{proj.link && <div style={{ fontSize:11, color:'#ef4444' }}>{proj.link}</div>}
            <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>{proj.desc}</div>
          </div>)}
        </>}
        {sections.certifications && certifications?.length > 0 && <><SecCreative accent={accent}>Certifications</SecCreative>
          {certifications.map(c => <div key={c.id} style={{ borderLeft:'3px solid #fbbf24', paddingLeft:14, marginBottom:8 }}>
            <b style={{ fontSize:13 }}>{c.name}</b><div style={{ fontSize:11, color:'#6b7280' }}>{c.org} · {c.date}</div>
          </div>)}
        </>}
        {sections.languages && languages?.length > 0 && <><SecCreative accent={accent}>Languages</SecCreative>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>{languages.map(l => <LangBadge key={l.id} l={l} accent={accent} />)}</div>
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   4. TECH PRO
───────────────────────────────────────────────── */
export function TechTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = resume.colorTheme || '#059669';
  const contact = [p.email, p.phone, p.location, p.github].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', background:'#fff', color:'#1a1a2e' }}>
      {sections.personal && <div style={{ padding:'32px 40px', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ fontFamily:'"Space Mono",monospace', fontSize:26, fontWeight:700, color:'#111827' }}>{p.name}</div>
        <div style={{ fontSize:12, color:accent, marginTop:4, fontWeight:600 }}>&lt; {p.title} /&gt;</div>
        <div style={{ fontSize:11, color:'#6b7280', marginTop:8 }}>{contact}</div>
      </div>}
      <div style={{ padding:'20px 40px 40px' }}>
        {sections.summary && summary && <><SecTech accent={accent}>// summary</SecTech><p style={{ fontSize:12, color:'#4b5563', lineHeight:1.7 }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecTech accent={accent}>// experience</SecTech>
          {experience.map(e => <div key={e.id} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><div><b style={{ fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{e.role}</b><span style={{ color:'#9ca3af', fontSize:11 }}> @ {e.company}</span></div><span style={{ fontSize:10, color:'#9ca3af', fontFamily:'"Space Mono",monospace' }}>{e.date}</span></div>
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{e.desc}</div>
          </div>)}
        </>}
        {sections.skills && skills?.length > 0 && <><SecTech accent={accent}>// tech_stack</SecTech>
          <div style={{ marginBottom:14 }}>{skills.map((s,i) => <span key={i} style={{ display:'inline-block', padding:'2px 8px', borderRadius:3, background:'#ecfdf5', color:'#065f46', fontSize:10, margin:'2px', border:'1px solid #a7f3d0', fontFamily:'"Space Mono",monospace' }}>{s}</span>)}</div>
        </>}
        {sections.projects && projects?.length > 0 && <><SecTech accent={accent}>// projects</SecTech>
          {projects.map(proj => <div key={proj.id} style={{ marginBottom:12 }}>
            <b style={{ fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{proj.name}</b>{proj.link && <span style={{ color:accent, fontSize:11, marginLeft:6 }}>→ {proj.link}</span>}
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{proj.desc}</div>
          </div>)}
        </>}
        {sections.education && education?.length > 0 && <><SecTech accent={accent}>// education</SecTech>
          {education.map(e => <div key={e.id} style={{ marginBottom:10 }}>
            <b style={{ fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{e.degree}</b><span style={{ color:'#6b7280', fontSize:11 }}> @ {e.school}</span><span style={{ color:'#9ca3af', fontSize:10, marginLeft:6, fontFamily:'"Space Mono",monospace' }}>{e.date}</span>
          </div>)}
        </>}
        {sections.certifications && certifications?.length > 0 && <><SecTech accent={accent}>// certifications</SecTech>
          {certifications.map(c => <div key={c.id} style={{ marginBottom:8 }}>
            <b style={{ fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{c.name}</b><span style={{ fontSize:11, color:'#6b7280', marginLeft:6 }}>{c.org} · {c.date}</span>
          </div>)}
        </>}
        {sections.languages && languages?.length > 0 && <><SecTech accent={accent}>// languages</SecTech>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>{languages.map(l => <LangBadge key={l.id} l={l} accent={accent} />)}</div>
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   5. PURPLE ELEGANCE
───────────────────────────────────────────────── */
export function PurpleTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = '#4a1942';
  const accentLight = '#7c3a6e';
  const dateBg = '#4a1942';
  const contactItems = [
    { icon:'📧', v:p.email }, { icon:'📱', v:p.phone },
    { icon:'📍', v:p.location }, { icon:'🔗', v:p.linkedin },
    p.github && { icon:'💻', v:p.github }, p.portfolio && { icon:'🌐', v:p.portfolio },
  ].filter(Boolean).filter(i => i.v);

  const SecPurple = ({ children }) => <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:accent, borderBottom:`2px solid ${accent}`, paddingBottom:4, margin:'14px 0 10px' }}>{children}</div>;
  const Entry = ({ children }) => <div style={{ paddingLeft:12, borderLeft:`2px solid ${accentLight}`, marginBottom:14 }}>{children}</div>;

  return (
    <div style={{ fontFamily:'"Lato",sans-serif', background:'#fff', color:'#222' }}>
      <div style={{ display:'flex' }}>
        <div style={{ width:140, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 10px' }}>
          <div style={{ width:100, height:100, borderRadius:'50%', border:`4px solid ${accent}`, background:'#f5eef4', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            {p.photo ? <img src={p.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" /> : <ProfileIcon accent={accentLight} />}
          </div>
        </div>
        <div style={{ flex:1, background:accent, padding:'28px 28px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:'"Playfair Display",serif', fontSize:26, color:'#fff', fontWeight:700 }}>{p.name}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', letterSpacing:3, textTransform:'uppercase', marginTop:6 }}>{p.title}</div>
        </div>
      </div>
      <div style={{ display:'flex', minHeight:820 }}>
        <div style={{ width:200, background:'#f7f0f6', padding:'20px 16px', borderRight:'1px solid #e2d0de' }}>
          <SecPurple>Contact</SecPurple>
          {contactItems.map((item,i) => <div key={i} style={{ display:'flex', gap:6, marginBottom:8, fontSize:11, color:'#444' }}>
            <span>{item.icon}</span><span style={{ wordBreak:'break-all' }}>{item.v}</span>
          </div>)}
          {sections.skills && skills?.length > 0 && <><SecPurple>Skills</SecPurple>
            {skills.map((s,i) => <div key={i} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5, fontSize:11, color:'#333' }}>
              <span style={{ color:accent, fontSize:9 }}>▸</span>{s}
            </div>)}
          </>}
          {sections.languages && languages?.length > 0 && <><SecPurple>Languages</SecPurple>
            {languages.map(l => <div key={l.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:11 }}>{l.name}</span><span style={{ fontSize:10, color:'#888' }}>{l.level}</span>
            </div>)}
          </>}
        </div>
        <div style={{ flex:1, padding:'20px 24px' }}>
          {sections.summary && summary && <><SecPurple>Profile</SecPurple><p style={{ fontSize:11, color:'#555', lineHeight:1.8, textAlign:'justify' }}>{summary}</p></>}
          {sections.education && education?.length > 0 && <><SecPurple>Education</SecPurple>
            {education.map(e => <Entry key={e.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div><div style={{ fontSize:12, fontWeight:700 }}>{e.degree}</div><div style={{ fontSize:11, color:accentLight }}>{e.school}</div>{e.desc && <div style={{ fontSize:10, color:'#999' }}>{e.desc}</div>}</div>
                {e.date && <span style={{ fontSize:10, color:'#fff', background:dateBg, padding:'2px 8px', borderRadius:10, whiteSpace:'nowrap' }}>{e.date}</span>}
              </div>
            </Entry>)}
          </>}
          {sections.experience && experience?.length > 0 && <><SecPurple>Experience</SecPurple>
            {experience.map(e => <Entry key={e.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div><div style={{ fontSize:12, fontWeight:700 }}>{e.role}</div><div style={{ fontSize:11, color:accentLight }}>{e.company}</div></div>
                {e.date && <span style={{ fontSize:10, color:'#fff', background:dateBg, padding:'2px 8px', borderRadius:10, whiteSpace:'nowrap' }}>{e.date}</span>}
              </div>
              {e.desc && <div style={{ fontSize:11, color:'#555', marginTop:4, lineHeight:1.6 }}>{e.desc}</div>}
            </Entry>)}
          </>}
          {sections.projects && projects?.length > 0 && <><SecPurple>Projects</SecPurple>
            {projects.map(proj => <Entry key={proj.id}>
              <div style={{ fontSize:12, fontWeight:700 }}>{proj.name}</div>
              {proj.link && <div style={{ fontSize:10, color:accentLight, marginTop:2 }}>{proj.link}</div>}
              {proj.desc && <div style={{ fontSize:11, color:'#555', marginTop:4, lineHeight:1.5 }}>{proj.desc}</div>}
            </Entry>)}
          </>}
          {sections.certifications && certifications?.length > 0 && <><SecPurple>Certifications</SecPurple>
            {certifications.map(c => <div key={c.id} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:accent, flexShrink:0, marginTop:4 }} />
              <div style={{ fontSize:11, color:'#555' }}><b style={{ color:'#222' }}>{c.name}</b>{c.org && <span style={{ color:'#888' }}> — {c.org}</span>}{c.date && <span style={{ color:'#aaa' }}> · {c.date}</span>}</div>
            </div>)}
          </>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   6. EXECUTIVE SLATE
───────────────────────────────────────────────── */
export function SlateTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean);
  return (
    <div style={{ fontFamily:'"Merriweather",serif', background:'#fff', color:'#1a1a2e' }}>
      {sections.personal && <div style={{ background:'#0f172a', padding:'32px 44px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>{p.name}</div>
          <div style={{ fontSize:11, color:'#94a3b8', marginTop:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>{p.title}</div>
        </div>
        <div style={{ textAlign:'right', fontSize:10, color:'#64748b', lineHeight:1.9 }}>{contact.map((v,i) => <div key={i}>{v}</div>)}</div>
      </div>}
      <div style={{ height:3, background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)' }} />
      <div style={{ padding:'24px 44px 40px' }}>
        {sections.summary && summary && <><SecSlate>Executive Summary</SecSlate><p style={{ fontSize:12, color:'#374151', lineHeight:1.75, fontStyle:'italic' }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecSlate>Professional Experience</SecSlate>
          {experience.map(e => <div key={e.id} style={{ marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid #f1f5f9', paddingBottom:4, marginBottom:6 }}>
              <div><b style={{ fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>{e.role}</b><span style={{ color:'#6366f1', fontSize:11, fontFamily:'"DM Sans",sans-serif' }}> · {e.company}</span></div>
              <span style={{ fontSize:11, color:'#94a3b8', fontFamily:'"DM Sans",sans-serif' }}>{e.date}</span>
            </div>
            <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.6, fontFamily:'"DM Sans",sans-serif' }}>{e.desc}</div>
          </div>)}
        </>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div>
            {sections.education && education?.length > 0 && <><SecSlate>Education</SecSlate>
              {education.map(e => <div key={e.id} style={{ marginBottom:10 }}>
                <b style={{ fontSize:12, fontFamily:'"DM Sans",sans-serif' }}>{e.degree}</b>
                <div style={{ fontSize:11, color:'#6366f1', fontFamily:'"DM Sans",sans-serif' }}>{e.school} · {e.date}</div>
              </div>)}
            </>}
          </div>
          <div>
            {sections.skills && skills?.length > 0 && <><SecSlate>Core Skills</SecSlate>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {skills.map((s,i) => <span key={i} style={{ padding:'3px 10px', background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:4, fontSize:10, fontFamily:'"DM Sans",sans-serif', color:'#374151' }}>{s}</span>)}
              </div>
            </>}
          </div>
        </div>
        {sections.certifications && certifications?.length > 0 && <><SecSlate>Certifications</SecSlate>
          {certifications.map(c => <div key={c.id} style={{ marginBottom:7, fontFamily:'"DM Sans",sans-serif', fontSize:11 }}>
            <b>{c.name}</b><span style={{ color:'#6b7280' }}> — {c.org}</span><span style={{ color:'#94a3b8' }}> · {c.date}</span>
          </div>)}
        </>}
        {sections.projects && projects?.length > 0 && <><SecSlate>Key Projects</SecSlate>
          {projects.map(proj => <div key={proj.id} style={{ marginBottom:10, fontFamily:'"DM Sans",sans-serif' }}>
            <b style={{ fontSize:12 }}>{proj.name}</b>{proj.link && <span style={{ color:'#6366f1', fontSize:11, marginLeft:6 }}>{proj.link}</span>}
            <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>{proj.desc}</div>
          </div>)}
        </>}
        {sections.languages && languages?.length > 0 && <><SecSlate>Languages</SecSlate>
          <div style={{ display:'flex', gap:14, fontFamily:'"DM Sans",sans-serif' }}>{languages.map(l => <span key={l.id} style={{ fontSize:12 }}><b>{l.name}</b> <span style={{ color:'#94a3b8' }}>{l.level}</span></span>)}</div>
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   7. MARINE BLUE
───────────────────────────────────────────────── */
export function MarineTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = '#0369a1';
  const contact = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', background:'#fff', color:'#1a1a2e', display:'flex', minHeight:1056 }}>
      <div style={{ width:210, background:'#0c4a6e', padding:'28px 16px', flexShrink:0 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#075985', border:'3px solid #38bdf8', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          {p.photo ? <img src={p.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" /> : <svg viewBox="0 0 40 40" width="44" height="44" fill="#7dd3fc"><circle cx="20" cy="14" r="8"/><ellipse cx="20" cy="30" rx="13" ry="8"/></svg>}
        </div>
        <div style={{ textAlign:'center', marginBottom:18 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{p.name}</div>
          <div style={{ fontSize:10, color:'#7dd3fc', marginTop:3 }}>{p.title}</div>
        </div>
        <div style={{ fontSize:9, fontWeight:700, color:'#38bdf8', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Contact</div>
        {contact.map((v,i) => <div key={i} style={{ fontSize:10, color:'#bae6fd', marginBottom:5, wordBreak:'break-all' }}>{v}</div>)}
        {sections.skills && skills?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, color:'#38bdf8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'14px 0 8px' }}>Skills</div>
          {skills.map((s,i) => <div key={i} style={{ padding:'3px 0', fontSize:10, color:'#e0f2fe', borderBottom:'1px solid #075985', marginBottom:4 }}>{s}</div>)}
        </>}
        {sections.languages && languages?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, color:'#38bdf8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'14px 0 8px' }}>Languages</div>
          {languages.map(l => <div key={l.id} style={{ fontSize:11, color:'#bae6fd', marginBottom:5 }}><b>{l.name}</b> <span style={{ opacity:0.7 }}>{l.level}</span></div>)}
        </>}
      </div>
      <div style={{ flex:1, padding:'28px 28px 40px' }}>
        {sections.summary && summary && <><SecMarine accent={accent}>Profile</SecMarine><p style={{ fontSize:12, color:'#374151', lineHeight:1.7, marginBottom:14 }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecMarine accent={accent}>Experience</SecMarine>
          {experience.map(e => <div key={e.id} style={{ marginBottom:14, padding:10, background:'#f0f9ff', borderLeft:`3px solid ${accent}`, borderRadius:'0 6px 6px 0' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:12 }}>{e.role}</b><span style={{ fontSize:10, color:'#9ca3af' }}>{e.date}</span></div>
            <div style={{ fontSize:11, color:accent, fontWeight:600 }}>{e.company}</div>
            <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{e.desc}</div>
          </div>)}
        </>}
        {sections.education && education?.length > 0 && <><SecMarine accent={accent}>Education</SecMarine>
          {education.map(e => <div key={e.id} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><b style={{ fontSize:12 }}>{e.degree}</b><span style={{ fontSize:10, color:'#9ca3af' }}>{e.date}</span></div>
            <div style={{ fontSize:11, color:accent }}>{e.school}</div>
            {e.desc && <div style={{ fontSize:11, color:'#4b5563' }}>{e.desc}</div>}
          </div>)}
        </>}
        {sections.projects && projects?.length > 0 && <><SecMarine accent={accent}>Projects</SecMarine>
          {projects.map(proj => <div key={proj.id} style={{ marginBottom:10 }}>
            <b style={{ fontSize:12 }}>{proj.name}</b>{proj.link && <span style={{ color:accent, fontSize:11, marginLeft:6 }}>{proj.link}</span>}
            <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>{proj.desc}</div>
          </div>)}
        </>}
        {sections.certifications && certifications?.length > 0 && <><SecMarine accent={accent}>Certifications</SecMarine>
          {certifications.map(c => <div key={c.id} style={{ marginBottom:7 }}>
            <b style={{ fontSize:12 }}>{c.name}</b><span style={{ fontSize:11, color:'#6b7280', marginLeft:6 }}>{c.org} · {c.date}</span>
          </div>)}
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   8. CRIMSON PRO
───────────────────────────────────────────────── */
export function CrimsonTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = '#9f1239';
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"Merriweather",serif', background:'#fff', color:'#1c1917' }}>
      {sections.personal && <div style={{ padding:'36px 48px 20px', borderBottom:`3px double ${accent}` }}>
        <div style={{ fontSize:30, fontWeight:700, textAlign:'center', letterSpacing:'0.02em' }}>{p.name}</div>
        <div style={{ fontSize:11, color:accent, textAlign:'center', marginTop:5, letterSpacing:'0.15em', textTransform:'uppercase' }}>{p.title}</div>
        <div style={{ fontSize:10, color:'#78716c', textAlign:'center', marginTop:8, fontFamily:'"DM Sans",sans-serif' }}>{contact}</div>
      </div>}
      <div style={{ padding:'20px 48px 40px' }}>
        {sections.summary && summary && <><SecCrimson>Profile</SecCrimson><p style={{ fontSize:12, color:'#44403c', lineHeight:1.8, textAlign:'justify' }}>{summary}</p></>}
        {sections.experience && experience?.length > 0 && <><SecCrimson>Experience</SecCrimson>
          {experience.map(e => <div key={e.id} style={{ marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div><b style={{ fontSize:13 }}>{e.role}</b><span style={{ color:accent, fontSize:11, fontFamily:'"DM Sans",sans-serif' }}> · {e.company}</span></div>
              <span style={{ fontSize:10, color:'#78716c', fontFamily:'"DM Sans",sans-serif' }}>{e.date}</span>
            </div>
            <div style={{ fontSize:11, color:'#57534e', marginTop:4, lineHeight:1.6, fontFamily:'"DM Sans",sans-serif' }}>{e.desc}</div>
          </div>)}
        </>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div>
            {sections.education && education?.length > 0 && <><SecCrimson>Education</SecCrimson>
              {education.map(e => <div key={e.id} style={{ marginBottom:10 }}>
                <b style={{ fontSize:12 }}>{e.degree}</b>
                <div style={{ fontSize:11, color:accent, fontFamily:'"DM Sans",sans-serif' }}>{e.school}</div>
                <div style={{ fontSize:10, color:'#78716c', fontFamily:'"DM Sans",sans-serif' }}>{e.date}</div>
              </div>)}
            </>}
            {sections.certifications && certifications?.length > 0 && <><SecCrimson>Certifications</SecCrimson>
              {certifications.map(c => <div key={c.id} style={{ marginBottom:7, fontFamily:'"DM Sans",sans-serif' }}>
                <b style={{ fontSize:11 }}>{c.name}</b><div style={{ fontSize:10, color:'#78716c' }}>{c.org} · {c.date}</div>
              </div>)}
            </>}
          </div>
          <div>
            {sections.skills && skills?.length > 0 && <><SecCrimson>Competencies</SecCrimson>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {skills.map((s,i) => <span key={i} style={{ padding:'2px 8px', background:'#fff1f2', color:accent, border:'1px solid #fecdd3', borderRadius:3, fontSize:10, fontFamily:'"DM Sans",sans-serif' }}>{s}</span>)}
              </div>
            </>}
            {sections.languages && languages?.length > 0 && <><SecCrimson>Languages</SecCrimson>
              {languages.map(l => <div key={l.id} style={{ fontSize:11, marginBottom:4, fontFamily:'"DM Sans",sans-serif' }}><b>{l.name}</b> <span style={{ color:'#78716c' }}>{l.level}</span></div>)}
            </>}
            {sections.projects && projects?.length > 0 && <><SecCrimson>Projects</SecCrimson>
              {projects.map(proj => <div key={proj.id} style={{ marginBottom:8, fontFamily:'"DM Sans",sans-serif' }}>
                <b style={{ fontSize:11 }}>{proj.name}</b>{proj.link && <div style={{ fontSize:10, color:accent }}>{proj.link}</div>}
                <div style={{ fontSize:10, color:'#57534e', lineHeight:1.5 }}>{proj.desc}</div>
              </div>)}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   9. FOREST GREEN
───────────────────────────────────────────────── */
export function ForestTemplate({ resume }) {
  const { personal:p, summary, experience, education, skills, projects, certifications, languages, sections } = resume;
  const accent = '#166534';
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(' · ');
  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', background:'#fff', color:'#1a2e1a' }}>
      {sections.personal && <>
        <div style={{ background:'#052e16', padding:'28px 44px', display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ width:68, height:68, borderRadius:'50%', background:'#14532d', border:'3px solid #4ade80', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            {p.photo ? <img src={p.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" /> : <svg viewBox="0 0 40 40" width="40" height="40" fill="#86efac"><circle cx="20" cy="14" r="8"/><ellipse cx="20" cy="30" rx="13" ry="8"/></svg>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:24, fontWeight:700, color:'#fff' }}>{p.name}</div>
            <div style={{ fontSize:11, color:'#4ade80', marginTop:3 }}>{p.title}</div>
            <div style={{ fontSize:10, color:'#86efac', marginTop:5 }}>{contact}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            {p.linkedin && <div style={{ fontSize:10, color:'#4ade80' }}>{p.linkedin}</div>}
            {p.github && <div style={{ fontSize:10, color:'#4ade80', marginTop:2 }}>{p.github}</div>}
          </div>
        </div>
        <div style={{ height:4, background:'linear-gradient(90deg,#4ade80,#22c55e,#16a34a)' }} />
      </>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 180px' }}>
        <div style={{ padding:'22px 24px 40px 44px' }}>
          {sections.summary && summary && <><SecForest accent={accent}>Summary</SecForest><p style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>{summary}</p></>}
          {sections.experience && experience?.length > 0 && <><SecForest accent={accent}>Experience</SecForest>
            {experience.map(e => <div key={e.id} style={{ paddingLeft:12, borderLeft:'2px solid #4ade80', marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><div><b style={{ fontSize:13 }}>{e.role}</b><div style={{ fontSize:11, color:'#16a34a', fontWeight:600 }}>{e.company}</div></div><span style={{ fontSize:10, color:'#9ca3af' }}>{e.date}</span></div>
              <div style={{ fontSize:11, color:'#4b5563', marginTop:3, lineHeight:1.5 }}>{e.desc}</div>
            </div>)}
          </>}
          {sections.education && education?.length > 0 && <><SecForest accent={accent}>Education</SecForest>
            {education.map(e => <div key={e.id} style={{ paddingLeft:12, borderLeft:'2px solid #4ade80', marginBottom:10 }}>
              <b style={{ fontSize:12 }}>{e.degree}</b><div style={{ fontSize:11, color:'#16a34a' }}>{e.school} · {e.date}</div>
              {e.desc && <div style={{ fontSize:10, color:'#4b5563' }}>{e.desc}</div>}
            </div>)}
          </>}
          {sections.projects && projects?.length > 0 && <><SecForest accent={accent}>Projects</SecForest>
            {projects.map(proj => <div key={proj.id} style={{ paddingLeft:12, borderLeft:'2px solid #4ade80', marginBottom:10 }}>
              <b style={{ fontSize:12 }}>{proj.name}</b>{proj.link && <div style={{ fontSize:10, color:'#16a34a' }}>{proj.link}</div>}
              <div style={{ fontSize:11, color:'#4b5563', lineHeight:1.5 }}>{proj.desc}</div>
            </div>)}
          </>}
          {sections.certifications && certifications?.length > 0 && <><SecForest accent={accent}>Certifications</SecForest>
            {certifications.map(c => <div key={c.id} style={{ marginBottom:7 }}>
              <b style={{ fontSize:12 }}>{c.name}</b><span style={{ fontSize:11, color:'#16a34a', marginLeft:6 }}>{c.org} · {c.date}</span>
            </div>)}
          </>}
        </div>
        <div style={{ padding:'22px 14px', background:'#f0fdf4', borderLeft:'1px solid #dcfce7' }}>
          {sections.skills && skills?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Skills</div>
            {skills.map((s,i) => <div key={i} style={{ padding:'4px 8px', background:'#dcfce7', color:'#166534', fontSize:11, borderRadius:5, marginBottom:4, fontWeight:500 }}>{s}</div>)}
          </>}
          {sections.languages && languages?.length > 0 && <><div style={{ fontSize:9, fontWeight:700, color:accent, textTransform:'uppercase', letterSpacing:'0.1em', margin:'12px 0 8px' }}>Languages</div>
            {languages.map(l => <div key={l.id} style={{ marginBottom:6 }}><b style={{ fontSize:11 }}>{l.name}</b><div style={{ fontSize:10, color:'#6b7280' }}>{l.level}</div></div>)}
          </>}
        </div>
      </div>
    </div>
  );
}