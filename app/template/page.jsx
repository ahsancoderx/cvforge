'use client';
import { Box, Typography, Button, Chip, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { TEMPLATES } from '../../data/templates';
import { loadResume, saveResume } from '../../utils/storage';
import { DEFAULT_RESUME } from '../../data/defaultResume';
import {
  MinimalTemplate, CorporateTemplate, CreativeTemplate, TechTemplate,
  PurpleTemplate, SlateTemplate, MarineTemplate, CrimsonTemplate, ForestTemplate
} from '../../components/template/AllTemplates';

const TPL_MAP = {
  minimal: MinimalTemplate, corporate: CorporateTemplate,
  creative: CreativeTemplate, tech: TechTemplate,
  purple: PurpleTemplate, slate: SlateTemplate,
  marine: MarineTemplate, crimson: CrimsonTemplate, forest: ForestTemplate,
};

// Dummy resume for previews — same data for all templates
const PREVIEW_RESUME = {
  ...DEFAULT_RESUME,
  personal: {
    name: 'Alex Rivera', title: 'Senior Software Engineer',
    email: 'alex@email.com', phone: '+1 415 555 0123',
    location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera', portfolio: '', twitter: '', photo: '',
  },
  summary: 'Experienced software engineer with 6+ years building scalable systems at Fortune 500 companies. Passionate about clean architecture and shipping products that users love.',
  experience: [
    { id:'1', role:'Senior Engineer', company:'Meta Platforms', date:'2021–Present', desc:'Led development of real-time messaging serving 400M+ users. Reduced API latency by 38%.' },
    { id:'2', role:'Software Engineer', company:'Stripe', date:'2019–2021', desc:'Built payment infrastructure handling $2B+ monthly transactions.' },
  ],
  education: [{ id:'1', degree:'B.S. Computer Science', school:'UC Berkeley', date:'2014–2018', desc:'GPA 3.8 — Dean\'s List. Focus: Algorithms, Distributed Systems.' }],
  skills: ['JavaScript','TypeScript','React','Node.js','Python','GraphQL','Docker','AWS'],
  projects: [{ id:'1', name:'OpenMetrics', link:'github.com/alexrivera/openmetrics', desc:'Open-source tool with 2k+ GitHub stars built with React and D3.js.' }],
  certifications: [{ id:'1', name:'AWS Solutions Architect', org:'Amazon', date:'2022' }],
  languages: [{ id:'1', name:'English', level:'Native' }, { id:'2', name:'Spanish', level:'Fluent' }],
  sections: { personal:true, summary:true, experience:true, education:true, skills:true, projects:true, certifications:true, languages:true },
};

export default function TemplatesPage() {
  const router = useRouter();

  function useTemplate(id) {
    const current = loadResume() || { ...DEFAULT_RESUME };
    saveResume({ ...current, template: id });
    router.push('/editor');
  }

  return (
    <Box sx={{ minHeight:'100vh', background:'#0d0f14' }}>
      <Navbar />
      <Box sx={{ textAlign:'center', pt:5, pb:2, px:2 }}>
        <Typography variant="h2" sx={{ fontSize:'2rem', fontFamily:'"Playfair Display",serif', mb:1 }}>
          Choose Your Template
        </Typography>
        <Typography sx={{ color:'#8b8fa8', fontSize:'0.9rem' }}>
          9 professional designs with real preview — what you see is what you get
        </Typography>
      </Box>

      <Box sx={{ maxWidth:1300, mx:'auto', px:3, pb:6 }}>
        <Grid container spacing={2.5}>
          {TEMPLATES.map((t) => {
            const Template = TPL_MAP[t.id];
            return (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
                <Box sx={{
                  background:'#13151c', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:3, overflow:'hidden', transition:'all 0.25s',
                  '&:hover': { borderColor:`${t.accent}80`, transform:'translateY(-5px)',
                    boxShadow:`0 20px 60px rgba(0,0,0,0.5)` },
                }}>
                  {/* Live CV Preview */}
                  <Box sx={{
                    height:320, overflow:'hidden', position:'relative',
                    background:'#f8f8f8', cursor:'pointer',
                  }}
                    onClick={() => useTemplate(t.id)}
                  >
                    <Box sx={{
                      position:'absolute', top:0, left:0,
                      width:'900px', height:'1200px',
                      transform:'scale(0.288)',
                      transformOrigin:'top left',
                      pointerEvents:'none',
                    }}>
                      <Template resume={{ ...PREVIEW_RESUME, template:t.id }} />
                    </Box>
                    {/* Badge */}
                    <Chip label={t.tag} size="small" sx={{
                      position:'absolute', top:10, right:10,
                      fontSize:'0.65rem', height:22,
                      background:`${t.accent}25`, color:t.accent,
                      border:`1px solid ${t.accent}50`, fontWeight:700,
                    }} />
                  </Box>

                  {/* Info */}
                  <Box sx={{ p:1.5, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    <Typography sx={{ fontWeight:600, fontSize:'0.9rem', mb:0.4 }}>{t.name}</Typography>
                    <Typography sx={{ color:'#8b8fa8', fontSize:'0.78rem', mb:1.2, lineHeight:1.5 }}>{t.desc}</Typography>
                    <Button fullWidth variant="contained" onClick={() => useTemplate(t.id)}
                      sx={{ background:t.accent, fontSize:'0.82rem', py:0.7, textTransform:'none',
                        '&:hover': { background:t.accent, filter:'brightness(1.15)' } }}>
                      Use This Template →
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}