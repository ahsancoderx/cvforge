// utils/atsScorer.js
export function calculateATSScore(resume) {
  const results = [];
  let totalScore = 0;
  let totalMax = 0;

  // ── 1. Contact Info (15 pts) ──────────────────────────────
  const p = resume.personal || {};

  // Count any social/portfolio link as a professional link
  const socialFields = ['linkedin','twitter','portfolio','stackoverflow','medium','behance','dribbble','kaggle','leetcode'];
  const hasSocialLink = socialFields.some((f) => p[f]?.trim());
  const hasLinkedIn   = !!p.linkedin?.trim();
  const hasGitHub     = !!p.github?.trim();

  const contactScore =
    (p.name?.trim()     ? 3 : 0) +
    (p.email?.trim()    ? 4 : 0) +
    (p.phone?.trim()    ? 3 : 0) +
    (p.location?.trim() ? 2 : 0) +
    // LinkedIn OR any social link → 2pts; both LinkedIn AND GitHub → extra 1pt
    ((hasLinkedIn || hasSocialLink) ? 2 : 0) +
    ((hasGitHub || hasSocialLink)   ? 1 : 0);

  const contactSuggestions = [
    !p.name?.trim()     && 'Add your full name',
    !p.email?.trim()    && 'Add a professional email address',
    !p.phone?.trim()    && 'Add a phone number',
    !p.location?.trim() && 'Add your city / location',
    !hasLinkedIn        && 'Add your LinkedIn URL',
    !hasGitHub          && !hasSocialLink && 'Add your GitHub or portfolio link',
    !hasGitHub          && hasSocialLink  && 'Add your GitHub profile (great for tech roles)',
  ].filter(Boolean);

  results.push({
    category: 'Contact Information',
    icon: '📇',
    score: Math.min(contactScore, 15),
    max: 15,
    status: contactScore >= 12 ? 'great' : contactScore >= 8 ? 'good' : 'weak',
    suggestions: contactSuggestions,
  });

  totalScore += Math.min(contactScore, 15);
  totalMax += 15;

  // ── 2. Summary (15 pts) ───────────────────────────────────
  const summary = resume.summary || '';
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const hasKeywords = /experienc|skill|develop|manag|lead|build|design|achiev/i.test(summary);
  const summaryScore =
    (wordCount >= 40 ? 6 : wordCount >= 20 ? 4 : wordCount > 0 ? 2 : 0) +
    (hasKeywords ? 5 : 0) +
    (resume._sections?.summary !== false ? 4 : 0);

  results.push({
    category: 'Professional Summary',
    icon: '📝',
    score: summaryScore,
    max: 15,
    status: summaryScore >= 12 ? 'great' : summaryScore >= 7 ? 'good' : 'weak',
    suggestions: [
      wordCount < 40 && `Expand your summary (currently ${wordCount} words — aim for 40–80)`,
      !hasKeywords && 'Include action keywords: led, built, designed, managed, achieved',
      wordCount === 0 && 'Add a professional summary section',
    ].filter(Boolean),
  });

  totalScore += summaryScore;
  totalMax += 15;

  // ── 3. Experience (25 pts) ────────────────────────────────
  const exp = resume.experience || [];
  const hasExp = exp.length > 0;
  const expFilled = exp.filter((e) => e.role && e.company && e.date && e.desc).length;
  const expHasMetrics = exp.some((e) => /\d+%|\d+x|\$\d+|\d+ (user|client|team|project)/i.test(e.desc || ''));
  const expHasAction  = exp.some((e) => /led|built|developed|managed|designed|increased|reduced|launched/i.test(e.desc || ''));
  const expScore =
    (hasExp ? 5 : 0) +
    (expFilled >= 2 ? 8 : expFilled === 1 ? 4 : 0) +
    (expHasMetrics ? 7 : 0) +
    (expHasAction  ? 5 : 0);

  results.push({
    category: 'Work Experience',
    icon: '💼',
    score: expScore,
    max: 25,
    status: expScore >= 20 ? 'great' : expScore >= 12 ? 'good' : 'weak',
    suggestions: [
      !hasExp && 'Add at least one work experience entry',
      expFilled < 2 && 'Complete all fields (role, company, date, description) for each entry',
      !expHasMetrics && 'Add measurable impact — e.g. "Increased performance by 40%", "Managed $2M budget"',
      !expHasAction  && 'Start bullet descriptions with action verbs: Led, Built, Designed, Launched',
    ].filter(Boolean),
  });

  totalScore += expScore;
  totalMax += 25;

  // ── 4. Education (10 pts) ─────────────────────────────────
  const edu = resume.education || [];
  const hasEdu = edu.length > 0;
  const eduFilled = edu.filter((e) => e.degree && e.school).length;
  const eduScore =
    (hasEdu ? 4 : 0) +
    (eduFilled >= 1 ? 4 : 0) +
    (edu.some((e) => e.date) ? 2 : 0);

  results.push({
    category: 'Education',
    icon: '🎓',
    score: eduScore,
    max: 10,
    status: eduScore >= 8 ? 'great' : eduScore >= 5 ? 'good' : 'weak',
    suggestions: [
      !hasEdu && 'Add your educational background',
      eduFilled === 0 && 'Fill in your degree and school name',
      !edu.some((e) => e.date) && 'Add graduation year(s)',
    ].filter(Boolean),
  });

  totalScore += eduScore;
  totalMax += 10;

  // ── 5. Skills (20 pts) ────────────────────────────────────
  const skills = resume.skills || [];
  const hasSkills = skills.length > 0;
  const techKeywords = ['javascript','typescript','python','react','node','sql','aws','docker','git','java','go','rust','graphql','rest','api','css','html','figma','kubernetes','machine learning','ai','data analysis','excel','powerpoint','word','agile','scrum'];
  const hasTechSkill = skills.some((s) => techKeywords.includes(s.toLowerCase().trim()));
  const skillScore =
    (hasSkills ? 4 : 0) +
    (skills.length >= 8 ? 8 : skills.length >= 5 ? 5 : skills.length >= 3 ? 3 : 0) +
    (hasTechSkill ? 5 : 0) +
    (skills.length <= 15 ? 3 : 1);

  results.push({
    category: 'Skills',
    icon: '⚡',
    score: skillScore,
    max: 20,
    status: skillScore >= 16 ? 'great' : skillScore >= 10 ? 'good' : 'weak',
    suggestions: [
      !hasSkills && 'Add a skills section',
      skills.length < 8 && `Add more skills (currently ${skills.length} — aim for 8–15)`,
      skills.length > 15 && 'Trim to the 10–15 most relevant skills for ATS readability',
      !hasTechSkill && 'Include recognizable technical tools (React, Python, AWS, Docker, etc.)',
    ].filter(Boolean),
  });

  totalScore += skillScore;
  totalMax += 20;

  // ── 6. Completeness bonus (15 pts) ───────────────────────
  const hasProjects = (resume.projects || []).length > 0;
  const hasCerts    = (resume.certifications || []).length > 0;
  const sectionCount = [hasExp, hasEdu, hasSkills, !!summary, hasProjects, hasCerts].filter(Boolean).length;
  const completenessScore =
    (sectionCount >= 5 ? 6 : sectionCount * 1) +
    (hasProjects ? 5 : 0) +
    (hasCerts ? 4 : 0);

  results.push({
    category: 'Completeness & Extras',
    icon: '🏆',
    score: completenessScore,
    max: 15,
    status: completenessScore >= 12 ? 'great' : completenessScore >= 7 ? 'good' : 'weak',
    suggestions: [
      !hasProjects && 'Add 1–2 notable projects to stand out',
      !hasCerts    && 'Add relevant certifications (AWS, Google Cloud, PMP, etc.)',
      sectionCount < 5 && 'Add more resume sections for a well-rounded profile',
    ].filter(Boolean),
  });

  totalScore += completenessScore;
  totalMax += 15;

  const percent = Math.round((totalScore / totalMax) * 100);

  return {
    score: percent,
    totalScore,
    totalMax,
    grade: percent >= 85 ? 'A' : percent >= 70 ? 'B' : percent >= 55 ? 'C' : 'D',
    label: percent >= 85 ? 'Excellent' : percent >= 70 ? 'Good' : percent >= 55 ? 'Needs Work' : 'Poor',
    color: percent >= 85 ? '#22c55e' : percent >= 70 ? '#6c63ff' : percent >= 55 ? '#f59e0b' : '#ef4444',
    categories: results,
  };
}