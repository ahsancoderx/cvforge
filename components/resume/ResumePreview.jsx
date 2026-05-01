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
} from '../template/AllTemplates';   // ← correct path: templates (with s)

const MAP = {
  minimal:   MinimalTemplate,
  corporate: CorporateTemplate,
  creative:  CreativeTemplate,
  tech:      TechTemplate,
  purple:    PurpleTemplate,
  slate:     SlateTemplate,
  marine:    MarineTemplate,
  crimson:   CrimsonTemplate,
  forest:    ForestTemplate,
  navya:     NavyaTemplate,
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