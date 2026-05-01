'use client';
import {
  MinimalTemplate, CorporateTemplate, CreativeTemplate, TechTemplate,
  PurpleTemplate, SlateTemplate, MarineTemplate, CrimsonTemplate, ForestTemplate
} from '../template/AllTemplates';

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
};

export default function ResumePreview({ resume }) {
  const Template = MAP[resume.template] || MinimalTemplate;
  return (
    <div style={{ width:680, minHeight:880, boxShadow:'0 20px 80px rgba(0,0,0,0.5)', borderRadius:4, overflow:'hidden', background:'#fff' }}>
      <Template resume={resume} />
    </div>
  );
}