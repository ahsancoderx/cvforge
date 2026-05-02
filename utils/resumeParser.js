/**
 * resumeParser.js
 * Parses raw resume text into structured resume object.
 * Works on text extracted from PDF, DOCX, plain text, or OCR output.
 */

export function parseResumeText(text) {
  // Normalise OCR artefacts: spaces around dots/slashes in URLs
  const cleaned = text
    .replace(/(\w)\s+\.\s+(\w)/g, '$1.$2')      // "linked in . com" → "linkedin.com"
    .replace(/\s*\/\s*/g, '/')                   // "linkedin. com / in" → "linkedin.com/in"
    .replace(/https?\s*:\s*\/\//gi, 'https://'); // "https : //" → "https://"

  const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullText = cleaned;

  const resume = {
    personal:       extractPersonal(lines, fullText),
    summary:        extractSummary(lines, fullText),
    experience:     extractExperience(lines, fullText),
    education:      extractEducation(lines, fullText),
    skills:         extractSkills(lines, fullText),
    projects:       extractProjects(lines, fullText),
    certifications: extractCertifications(lines, fullText),
    sections: {
      summary:        true,
      experience:     true,
      education:      true,
      skills:         true,
      projects:       true,
      certifications: true,
    },
  };

  return resume;
}

// ─────────────────────────────────────────────────────────────
// Social / URL helpers
// ─────────────────────────────────────────────────────────────
function extractSocials(fullText) {
  const result = {
    linkedin:      '',
    github:        '',
    twitter:       '',
    portfolio:     '',
    stackoverflow: '',
    behance:       '',
    dribbble:      '',
    medium:        '',
    kaggle:        '',
    leetcode:      '',
  };

  // ── 1. Full URLs ─────────────────────────────────────────
  const urlRe = /https?:\/\/[^\s,;|<>"')\]]+/gi;
  const urls  = (fullText.match(urlRe) || []).map((u) => u.replace(/[.,;)>\]]+$/, ''));

  for (const url of urls) {
    const lc = url.toLowerCase();
    if      (!result.linkedin      && lc.includes('linkedin.com'))      result.linkedin      = url;
    else if (!result.github        && lc.includes('github.com'))        result.github        = url;
    else if (!result.twitter       && (lc.includes('twitter.com') || lc.includes('x.com'))) result.twitter = url;
    else if (!result.stackoverflow && lc.includes('stackoverflow'))     result.stackoverflow = url;
    else if (!result.behance       && lc.includes('behance.net'))       result.behance       = url;
    else if (!result.dribbble      && lc.includes('dribbble.com'))      result.dribbble      = url;
    else if (!result.medium        && lc.includes('medium.com'))        result.medium        = url;
    else if (!result.kaggle        && lc.includes('kaggle.com'))        result.kaggle        = url;
    else if (!result.leetcode      && lc.includes('leetcode.com'))      result.leetcode      = url;
    else if (!result.portfolio) {
      const skip = ['linkedin','github','twitter','x.com','stackoverflow','behance','dribbble','medium','kaggle','leetcode','facebook','instagram','youtube','gmail','outlook','yahoo'];
      if (!skip.some((s) => lc.includes(s))) result.portfolio = url;
    }
  }

  // ── 2. Plain-text patterns (no https://) ────────────────
  if (!result.linkedin) {
    const m = fullText.match(/linkedin(?:\.com)?(?:\/in)?[:\s/]+([a-zA-Z0-9_%-]{3,50})/i);
    if (m) result.linkedin = `https://linkedin.com/in/${m[1].trim()}`;
  }
  if (!result.github) {
    const m = fullText.match(/github(?:\.com)?[:\s/]+([a-zA-Z0-9_-]{3,50})/i);
    if (m) result.github = `https://github.com/${m[1].trim()}`;
  }
  if (!result.twitter) {
    const m = fullText.match(/(?:twitter|x\.com)[:\s/]+@?([a-zA-Z0-9_]{3,50})/i);
    if (m) result.twitter = `https://x.com/${m[1].trim()}`;
  }
  if (!result.leetcode) {
    const m = fullText.match(/leetcode(?:\.com)?[:\s/]+([a-zA-Z0-9_-]{3,50})/i);
    if (m) result.leetcode = `https://leetcode.com/u/${m[1].trim()}`;
  }
  if (!result.kaggle) {
    const m = fullText.match(/kaggle(?:\.com)?[:\s/]+([a-zA-Z0-9_-]{3,50})/i);
    if (m) result.kaggle = `https://kaggle.com/${m[1].trim()}`;
  }
  if (!result.portfolio) {
    const m = fullText.match(/(?:portfolio|personal\s*site|website|web)[:\s]+([^\s,;|<>"'\n]{5,60})/i);
    if (m) {
      const val = m[1].trim().replace(/[.,;)>\]]+$/, '');
      result.portfolio = val.startsWith('http') ? val : `https://${val}`;
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// Personal Info
// ─────────────────────────────────────────────────────────────
function extractPersonal(lines, fullText) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d[\d\s\-().]{7,15}\d)/;

  const email = (fullText.match(emailRegex) || [])[0] || '';
  const phone = (fullText.match(phoneRegex) || [])[0] || '';

  const socials = extractSocials(fullText);

  // ── Name ─────────────────────────────────────────────────
  let name = '';
  for (const line of lines.slice(0, 8)) {
    if (!line || line.length > 60) continue;
    if (emailRegex.test(line) || phoneRegex.test(line)) continue;
    if (/http|linkedin|github|twitter|@/i.test(line)) continue;
    if (/^\d/.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && /^[A-Za-z]/.test(line)) {
      name = line;
      break;
    }
  }

  // ── Location ─────────────────────────────────────────────
  const locationKeywords = /\b(remote|new york|los angeles|san francisco|chicago|london|toronto|berlin|sydney|lahore|karachi|islamabad|dubai|manchester|birmingham|houston|seattle|boston|austin)\b/i;
  const locationRegex    = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s+([A-Z]{2}|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/;
  let location = '';
  for (const line of lines.slice(0, 12)) {
    if (locationKeywords.test(line)) { location = line; break; }
    const m = line.match(locationRegex);
    if (m && line.length < 50 && !emailRegex.test(line)) { location = line; break; }
  }

  return {
    name,
    email,
    phone,
    location,
    linkedin:      socials.linkedin,
    github:        socials.github,
    twitter:       socials.twitter,
    portfolio:     socials.portfolio,
    stackoverflow: socials.stackoverflow,
    behance:       socials.behance,
    dribbble:      socials.dribbble,
    medium:        socials.medium,
    kaggle:        socials.kaggle,
    leetcode:      socials.leetcode,
  };
}

// ─────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────
function extractSummary(lines, fullText) {
  const sectionHeaders     = /^(summary|profile|objective|about\s*me|professional\s*summary|career\s*objective|overview)/i;
  const nextSectionHeaders = /^(experience|education|skills|projects|certifications|work\s*history|employment)/i;

  let inSection    = false;
  let summaryLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) {
      summaryLines.push(lines[i]);
      if (summaryLines.join(' ').split(/\s+/).length > 100) break;
    }
  }

  return summaryLines.join(' ').trim();
}

// ─────────────────────────────────────────────────────────────
// Experience
// ─────────────────────────────────────────────────────────────
function extractExperience(lines, fullText) {
  const sectionHeaders     = /^(experience|work\s*experience|work\s*history|employment|professional\s*experience|career\s*history)/i;
  const nextSectionHeaders = /^(education|skills|projects|certifications|awards|publications|references)/i;

  const datePattern      = /(\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}\s*[-–]\s*(\d{4}|present|current)|\d{4})/i;
  const jobTitleKeywords = /engineer|developer|manager|analyst|designer|director|coordinator|specialist|consultant|architect|lead|intern|associate|officer|head|vp|cto|ceo|coo|president|supervisor|administrator/i;

  let inSection    = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const experiences = [];
  let current = null;

  for (const line of sectionLines) {
    const hasDate    = datePattern.test(line);
    const isJobTitle = jobTitleKeywords.test(line) && line.length < 80;
    const isBullet   = /^[•\-*▪►→]/.test(line) || /^\d+\./.test(line);

    if ((isJobTitle || hasDate) && !isBullet && line.length < 100) {
      if (current) experiences.push(current);

      const dateMatch       = line.match(datePattern);
      const dateStr         = dateMatch ? dateMatch[0] : '';
      const lineWithoutDate = line.replace(datePattern, '').replace(/[|,–\-]+$/, '').trim();
      const atSplit         = lineWithoutDate.match(/^(.+?)\s+(?:at|@|–|-|,|\|)\s+(.+)$/i);

      current = {
        role:    atSplit ? atSplit[1].trim() : lineWithoutDate,
        company: atSplit ? atSplit[2].trim() : '',
        date:    dateStr,
        desc:    '',
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

// ─────────────────────────────────────────────────────────────
// Education
// ─────────────────────────────────────────────────────────────
function extractEducation(lines, fullText) {
  const sectionHeaders     = /^(education|academic|qualifications|academic\s*background)/i;
  const nextSectionHeaders = /^(experience|skills|projects|certifications|work|employment|awards)/i;
  const degreeKeywords     = /bachelor|master|phd|doctorate|associate|b\.?sc|m\.?sc|b\.?a|m\.?a|b\.?eng|m\.?eng|mba|diploma|certificate|high\s*school|secondary|matric|a-?levels|o-?levels|intermediate|undergraduate/i;
  const datePattern        = /(\d{4}\s*[-–]\s*(\d{4}|present|current)|\d{4})/i;

  let inSection    = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const education = [];
  let current = null;

  for (const line of sectionLines) {
    const hasDegree = degreeKeywords.test(line);
    const hasDate   = datePattern.test(line);
    const dateMatch = line.match(datePattern);

    if (hasDegree) {
      if (current) education.push(current);
      current = {
        degree: line.replace(datePattern, '').trim(),
        school: '',
        date:   dateMatch ? dateMatch[0] : '',
        gpa:    '',
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

// ─────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────
function extractSkills(lines, fullText) {
  const sectionHeaders     = /^(skills|technical\s*skills|core\s*competencies|technologies|tools|expertise|proficiencies|key\s*skills)/i;
  const nextSectionHeaders = /^(experience|education|projects|certifications|work|summary|objective)/i;

  let inSection    = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  const rawText = sectionLines.join(' ');
  const skills = rawText
    .split(/[,|•\n·\/\\;]/)
    .map((s) => s.replace(/^[-*▪►→\s]+/, '').trim())
    .filter((s) => s.length > 1 && s.length < 40 && !/^\d+$/.test(s));

  return [...new Set(skills)];
}

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────
function extractProjects(lines, fullText) {
  const sectionHeaders     = /^(projects|personal\s*projects|side\s*projects|portfolio|open\s*source)/i;
  const nextSectionHeaders = /^(experience|education|skills|certifications|work|awards|publications)/i;

  let inSection    = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection) sectionLines.push(lines[i]);
  }

  if (sectionLines.length === 0) return [];

  const projects = [];
  let current = null;

  for (const line of sectionLines) {
    const isBullet = /^[•\-*▪►→]/.test(line);
    const isTitle  = !isBullet && line.length < 80 && /^[A-Z]/.test(line);

    if (isTitle) {
      if (current) projects.push(current);
      current = { name: line, description: '', tech: '' };
    } else if (current) {
      if (/tech|stack|built\s*with|using/i.test(line)) {
        current.tech = line;
      } else {
        current.description += (current.description ? ' ' : '') + line.replace(/^[•\-*▪►→\s]+/, '');
      }
    }
  }

  if (current) projects.push(current);
  return projects.filter((p) => p.name);
}

// ─────────────────────────────────────────────────────────────
// Certifications
// ─────────────────────────────────────────────────────────────
function extractCertifications(lines, fullText) {
  const sectionHeaders     = /^(certifications?|certificates?|credentials?|licenses?|accreditations?)/i;
  const nextSectionHeaders = /^(experience|education|skills|projects|work|summary)/i;

  let inSection = false;
  const certs   = [];

  for (let i = 0; i < lines.length; i++) {
    if (sectionHeaders.test(lines[i]))              { inSection = true; continue; }
    if (inSection && nextSectionHeaders.test(lines[i])) break;
    if (inSection && lines[i].length > 3) {
      certs.push({
        name:   lines[i].replace(/^[•\-*▪►→\s]+/, '').trim(),
        issuer: '',
        date:   '',
      });
    }
  }

  return certs;
}