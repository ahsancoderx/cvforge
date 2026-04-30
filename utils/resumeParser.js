/**
 * resumeParser.js
 * Parses raw resume text into structured resume object.
 * Works on text extracted from PDF, DOCX, or plain text uploads.
 */

export function parseResumeText(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullText = text;

  const resume = {
    personal: extractPersonal(lines, fullText),
    summary: extractSummary(lines, fullText),
    experience: extractExperience(lines, fullText),
    education: extractEducation(lines, fullText),
    skills: extractSkills(lines, fullText),
    projects: extractProjects(lines, fullText),
    certifications: extractCertifications(lines, fullText),
    sections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
    },
  };

  return resume;
}

// ── Personal Info ──────────────────────────────────────────
function extractPersonal(lines, fullText) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d[\d\s\-().]{7,15}\d)/;
  const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i;
  const githubRegex = /github\.com\/([a-zA-Z0-9\-_]+)/i;

  const email = (fullText.match(emailRegex) || [])[0] || '';
  const phone = (fullText.match(phoneRegex) || [])[0] || '';
  const linkedinMatch = fullText.match(linkedinRegex);
  const githubMatch = fullText.match(githubRegex);

  // Name heuristic: first non-empty line that's not an email/phone/url and looks like a name
  let name = '';
  for (const line of lines.slice(0, 5)) {
    if (
      !emailRegex.test(line) &&
      !phoneRegex.test(line) &&
      !/http|linkedin|github/i.test(line) &&
      line.length > 2 &&
      line.length < 60 &&
      /^[A-Z]/.test(line)
    ) {
      name = line;
      break;
    }
  }

  // Location heuristic: look for city, state patterns
  const locationRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s+([A-Z]{2}|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/;
  const locationKeywords = /\b(remote|new york|los angeles|san francisco|chicago|london|toronto|berlin|sydney|lahore|karachi|islamabad)\b/i;
  let location = '';
  for (const line of lines.slice(0, 10)) {
    if (locationKeywords.test(line)) {
      location = line;
      break;
    }
    const m = line.match(locationRegex);
    if (m && line.length < 50) {
      location = line;
      break;
    }
  }

  return {
    name,
    email,
    phone,
    location,
    linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
    github: githubMatch ? `https://github.com/${githubMatch[1]}` : '',
  };
}

// ── Summary ────────────────────────────────────────────────
function extractSummary(lines, fullText) {
  const sectionHeaders = /^(summary|profile|objective|about me|professional summary|career objective|overview)/i;
  const nextSectionHeaders = /^(experience|education|skills|projects|certifications|work history|employment)/i;

  let inSection = false;
  let summaryLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (nextSectionHeaders.test(lines[i])) break;
      summaryLines.push(lines[i]);
      if (summaryLines.join(' ').split(/\s+/).length > 100) break;
    }
  }

  return summaryLines.join(' ').trim();
}

// ── Experience ─────────────────────────────────────────────
function extractExperience(lines, fullText) {
  const sectionHeaders = /^(experience|work experience|work history|employment|professional experience|career history)/i;
  const nextSectionHeaders = /^(education|skills|projects|certifications|awards|publications|references)/i;

  const datePattern = /(\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}\s*[-–]\s*(\d{4}|present|current)|\d{4})/i;
  const jobTitleKeywords = /engineer|developer|manager|analyst|designer|director|coordinator|specialist|consultant|architect|lead|intern|associate|officer|head|vp|cto|ceo|coo|president|supervisor|administrator/i;

  let inSection = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const experiences = [];
  let current = null;

  for (const line of sectionLines) {
    const hasDate = datePattern.test(line);
    const isJobTitle = jobTitleKeywords.test(line) && line.length < 80;
    const isBullet = /^[•\-*▪►→]/.test(line) || /^\d+\./.test(line);

    if ((isJobTitle || hasDate) && !isBullet && line.length < 100) {
      if (current) experiences.push(current);

      const dateMatch = line.match(datePattern);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const lineWithoutDate = line.replace(datePattern, '').replace(/[|,–\-]+$/,'').trim();

      // Try to split "Role at Company" or "Role | Company"
      const atSplit = lineWithoutDate.match(/^(.+?)\s+(?:at|@|–|-|,|\|)\s+(.+)$/i);
      current = {
        role: atSplit ? atSplit[1].trim() : lineWithoutDate,
        company: atSplit ? atSplit[2].trim() : '',
        date: dateStr,
        desc: '',
      };
    } else if (current) {
      if (isBullet || line.length > 30) {
        current.desc += (current.desc ? '\n' : '') + line;
      } else if (!current.company && line.length < 60) {
        current.company = line;
      }
    }
  }

  if (current) experiences.push(current);

  return experiences.filter((e) => e.role || e.company);
}

// ── Education ──────────────────────────────────────────────
function extractEducation(lines, fullText) {
  const sectionHeaders = /^(education|academic|qualifications|academic background)/i;
  const nextSectionHeaders = /^(experience|skills|projects|certifications|work|employment|awards)/i;
  const degreeKeywords = /bachelor|master|phd|doctorate|associate|b\.?sc|m\.?sc|b\.?a|m\.?a|b\.?eng|m\.?eng|mba|diploma|certificate|high school|secondary|matric|a-levels|o-levels|intermediate|undergraduate/i;
  const datePattern = /(\d{4}\s*[-–]\s*(\d{4}|present|current)|\d{4})/i;

  let inSection = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const education = [];
  let current = null;

  for (const line of sectionLines) {
    const hasDegree = degreeKeywords.test(line);
    const hasDate = datePattern.test(line);
    const dateMatch = line.match(datePattern);

    if (hasDegree) {
      if (current) education.push(current);
      current = {
        degree: line.replace(datePattern, '').trim(),
        school: '',
        date: dateMatch ? dateMatch[0] : '',
        gpa: '',
      };
    } else if (current) {
      if (!current.school && !hasDate && line.length < 80) {
        current.school = line;
      } else if (hasDate && !current.date) {
        current.date = dateMatch ? dateMatch[0] : '';
      } else if (/gpa|cgpa|grade|percentage/i.test(line)) {
        current.gpa = line;
      }
    }
  }

  if (current) education.push(current);
  return education.filter((e) => e.degree || e.school);
}

// ── Skills ─────────────────────────────────────────────────
function extractSkills(lines, fullText) {
  const sectionHeaders = /^(skills|technical skills|core competencies|technologies|tools|expertise|proficiencies|key skills)/i;
  const nextSectionHeaders = /^(experience|education|projects|certifications|work|summary|objective)/i;

  let inSection = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  const rawText = sectionLines.join(' ');
  // Split by common delimiters
  const skills = rawText
    .split(/[,|•\n·\/\\]/)
    .map((s) => s.replace(/^[-*▪►→\s]+/, '').trim())
    .filter((s) => s.length > 1 && s.length < 40 && !/^\d+$/.test(s));

  // De-duplicate
  return [...new Set(skills)];
}

// ── Projects ───────────────────────────────────────────────
function extractProjects(lines, fullText) {
  const sectionHeaders = /^(projects|personal projects|side projects|portfolio|open source)/i;
  const nextSectionHeaders = /^(experience|education|skills|certifications|work|awards|publications)/i;

  let inSection = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const projects = [];
  let current = null;

  for (const line of sectionLines) {
    const isBullet = /^[•\-*▪►→]/.test(line);
    const isTitle = !isBullet && line.length < 80 && /^[A-Z]/.test(line);

    if (isTitle) {
      if (current) projects.push(current);
      current = { name: line, description: '', tech: '' };
    } else if (current) {
      if (/tech|stack|built with|using/i.test(line)) {
        current.tech = line;
      } else {
        current.description += (current.description ? ' ' : '') + line.replace(/^[•\-*▪►→\s]+/, '');
      }
    }
  }

  if (current) projects.push(current);
  return projects.filter((p) => p.name);
}

// ── Certifications ─────────────────────────────────────────
function extractCertifications(lines, fullText) {
  const sectionHeaders = /^(certifications?|certificates?|credentials?|licenses?|accreditations?)/i;
  const nextSectionHeaders = /^(experience|education|skills|projects|work|summary)/i;

  let inSection = false;
  const certs = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i])) { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection && lines[i].length > 3) {
      certs.push({
        name: lines[i].replace(/^[•\-*▪►→\s]+/, '').trim(),
        issuer: '',
        date: '',
      });
    }
  }

  return certs;
}