// data/defaultResume.js
export const DEFAULT_RESUME = {
  template: 'minimal',
  colorTheme: null,
  sections: {
    personal: true, summary: true, experience: true,
    education: true, skills: true, projects: true,
    certifications: true, languages: true,
  },
  personal: {
    name: 'Alex Rivera',
    title: 'Senior Software Engineer',
    email: 'alex.rivera@email.com',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    portfolio: '',
    twitter: '',
    photo: '',
  },
  summary:
    'Experienced software engineer with 6+ years building scalable systems at high-growth startups and Fortune 500 companies. Passionate about clean architecture, team leadership, and shipping products that users love.',
  experience: [
    { id: '1', role: 'Senior Software Engineer', company: 'Meta Platforms', date: '2021 – Present', desc: 'Led development of a real-time messaging feature serving 400M+ users. Reduced API latency by 38% through caching and query optimization. Mentored 4 junior engineers.' },
    { id: '2', role: 'Software Engineer', company: 'Stripe', date: '2019 – 2021', desc: 'Built payment infrastructure handling $2B+ monthly transactions. Designed RESTful APIs consumed by 10,000+ merchants worldwide.' },
  ],
  education: [
    { id: '1', degree: 'B.S. Computer Science', school: 'UC Berkeley', date: '2014 – 2018', desc: "GPA: 3.8/4.0 — Dean's List. Focus: Algorithms, Distributed Systems, ML." },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS'],
  projects: [
    { id: '1', name: 'OpenMetrics Dashboard', link: 'github.com/alexrivera/openmetrics', desc: 'Open-source observability tool with 2k+ GitHub stars. Built with React, D3.js, and WebSockets.' },
  ],
  certifications: [
    { id: '1', name: 'AWS Certified Solutions Architect', org: 'Amazon Web Services', date: '2022' },
    { id: '2', name: 'Google Cloud Professional', org: 'Google', date: '2021' },
  ],
  languages: [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Urdu', level: 'Native' },
  ],
};

export const SECTION_LIST = [
  { id: 'personal',       label: 'Personal Info',   icon: '👤' },
  { id: 'summary',        label: 'Summary',          icon: '📝' },
  { id: 'experience',     label: 'Experience',       icon: '💼' },
  { id: 'education',      label: 'Education',        icon: '🎓' },
  { id: 'skills',         label: 'Skills',           icon: '🛠' },
  { id: 'languages',      label: 'Languages',        icon: '🌐' },
  { id: 'projects',       label: 'Projects',         icon: '🚀' },
  { id: 'certifications', label: 'Certifications',   icon: '🏆' },
];