'use client';
import {
  MinimalTemplate,
  CorporateTemplate,
  CreativeTemplate,
  TechTemplate,
  PurpleTemplate,
  SlateTemplate,
  MarineTemplate,
  CrimsonTemplate,
  ForestTemplate,
  NavyaTemplate,     
} from '../template/AllTemplates';   

const MAP = {
  'ats-resume-template':        MinimalTemplate,
  'corporate-resume-template':  CorporateTemplate,
  'creative-resume-template':   CreativeTemplate,
  'software-engineer-resume':   TechTemplate,
  'modern-professional-resume': PurpleTemplate,
  'executive-resume-template':  SlateTemplate,
  'business-resume-template':   MarineTemplate,
  'modern-cv-template':         CrimsonTemplate,
  'clean-resume-template':      ForestTemplate,
  'academic-cv-template':       NavyaTemplate,
};

export default function ResumePreview({ resume }) {
  const Template = MAP[resume.template] || MinimalTemplate;
  return (
    <div style={{
      width: 794,
      minHeight: 1123,
      background: '#fff',
      overflow: 'hidden',
    }}>
      <Template resume={resume} />
    </div>
  );
}