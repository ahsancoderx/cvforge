'use client';
import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_RESUME } from '../data/defaultResume';
import { loadResume, saveResume } from '../utils/storage';

export default function useResume() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [saved, setSaved]   = useState(true);

  useEffect(() => {
    const stored = loadResume();
    if (stored) {
      setResume({
        ...DEFAULT_RESUME,
        ...stored,
        sections:  { ...DEFAULT_RESUME.sections,  ...(stored.sections  || {}) },
        languages: stored.languages || DEFAULT_RESUME.languages || [],
      });
    }
  }, []);

  const update = useCallback((updater) => {
    setResume((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveResume(next);
      return next;
    });
    setSaved(false);
    setTimeout(() => setSaved(true), 1200);
  }, []);

  /* ── Personal ── */
  const updatePersonal = (f, v) =>
    update((r) => ({ ...r, personal: { ...r.personal, [f]: v } }));

  /* ── Summary ── */
  const updateSummary = (v) =>
    update((r) => ({ ...r, summary: v }));

  /* ── Sections toggle ── */
  const toggleSection = (id) =>
    update((r) => ({ ...r, sections: { ...r.sections, [id]: !r.sections[id] } }));

  /* ── Template / theme ── */
  const setTemplate   = (tpl) => update((r) => ({ ...r, template: tpl }));
  const setColorTheme = (c)   => update((r) => ({ ...r, colorTheme: c }));

  /* ── Experience ── */
  const addExperience = () =>
    update((r) => ({
      ...r,
      experience: [
        ...r.experience,
        { id: Date.now().toString(), role: '', company: '', date: '', desc: '' },
      ],
    }));
  const updateExperience = (id, f, v) =>
    update((r) => ({
      ...r,
      experience: r.experience.map((e) => (e.id === id ? { ...e, [f]: v } : e)),
    }));
  const removeExperience = (id) =>
    update((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }));

  /* ── Education ── */
  const addEducation = () =>
    update((r) => ({
      ...r,
      education: [
        ...r.education,
        { id: Date.now().toString(), degree: '', school: '', date: '', desc: '' },
      ],
    }));
  const updateEducation = (id, f, v) =>
    update((r) => ({
      ...r,
      education: r.education.map((e) => (e.id === id ? { ...e, [f]: v } : e)),
    }));
  const removeEducation = (id) =>
    update((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));

  /* ── Skills ── */
  const addSkill    = (s) => update((r) => ({ ...r, skills: [...r.skills, s] }));
  const removeSkill = (i) => update((r) => ({ ...r, skills: r.skills.filter((_, idx) => idx !== i) }));

  /* ── Projects ── */
  const addProject = () =>
    update((r) => ({
      ...r,
      projects: [
        ...r.projects,
        { id: Date.now().toString(), name: '', link: '', desc: '' },
      ],
    }));
  const updateProject = (id, f, v) =>
    update((r) => ({
      ...r,
      projects: r.projects.map((p) => (p.id === id ? { ...p, [f]: v } : p)),
    }));
  const removeProject = (id) =>
    update((r) => ({ ...r, projects: r.projects.filter((p) => p.id !== id) }));

  /* ── Certifications ── */
  const addCertification = () =>
    update((r) => ({
      ...r,
      certifications: [
        ...r.certifications,
        { id: Date.now().toString(), name: '', org: '', date: '' },
      ],
    }));
  const updateCertification = (id, f, v) =>
    update((r) => ({
      ...r,
      certifications: r.certifications.map((c) => (c.id === id ? { ...c, [f]: v } : c)),
    }));
  const removeCertification = (id) =>
    update((r) => ({ ...r, certifications: r.certifications.filter((c) => c.id !== id) }));

  /* ── Languages ── */
  const addLanguage = () =>
    update((r) => ({
      ...r,
      languages: [
        ...(r.languages || []),
        { id: Date.now().toString(), name: '', level: 'Conversational' },
      ],
    }));
  const updateLanguage = (id, f, v) =>
    update((r) => ({
      ...r,
      languages: (r.languages || []).map((l) => (l.id === id ? { ...l, [f]: v } : l)),
    }));
  const removeLanguage = (id) =>
    update((r) => ({
      ...r,
      languages: (r.languages || []).filter((l) => l.id !== id),
    }));

  /* ── Return everything ── */
  return {
    resume,
    saved,
    updatePersonal,
    updateSummary,
    toggleSection,
    setTemplate,
    setColorTheme,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
  };
}