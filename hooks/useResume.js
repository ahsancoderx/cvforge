// hooks/useResume.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_RESUME } from '../data/defaultResume';
import { loadResume, saveResume } from '../utils/storage';

export default function useResume() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const stored = loadResume();
    if (stored) setResume(stored);
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

  const updatePersonal = (field, value) =>
    update((r) => ({ ...r, personal: { ...r.personal, [field]: value } }));

  const updateSummary = (value) => update((r) => ({ ...r, summary: value }));
  const toggleSection = (id) =>
    update((r) => ({ ...r, sections: { ...r.sections, [id]: !r.sections[id] } }));
  const setTemplate = (tpl) => update((r) => ({ ...r, template: tpl }));
  const setColorTheme = (color) => update((r) => ({ ...r, colorTheme: color }));

  const addExperience = () =>
    update((r) => ({ ...r, experience: [...r.experience, { id: Date.now().toString(), role: '', company: '', date: '', desc: '' }] }));
  const updateExperience = (id, field, value) =>
    update((r) => ({ ...r, experience: r.experience.map((e) => e.id === id ? { ...e, [field]: value } : e) }));
  const removeExperience = (id) =>
    update((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }));

  const addEducation = () =>
    update((r) => ({ ...r, education: [...r.education, { id: Date.now().toString(), degree: '', school: '', date: '', desc: '' }] }));
  const updateEducation = (id, field, value) =>
    update((r) => ({ ...r, education: r.education.map((e) => e.id === id ? { ...e, [field]: value } : e) }));
  const removeEducation = (id) =>
    update((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));

  const addSkill = (skill) => update((r) => ({ ...r, skills: [...r.skills, skill] }));
  const removeSkill = (index) => update((r) => ({ ...r, skills: r.skills.filter((_, i) => i !== index) }));

  const addProject = () =>
    update((r) => ({ ...r, projects: [...r.projects, { id: Date.now().toString(), name: '', link: '', desc: '' }] }));
  const updateProject = (id, field, value) =>
    update((r) => ({ ...r, projects: r.projects.map((p) => p.id === id ? { ...p, [field]: value } : p) }));
  const removeProject = (id) =>
    update((r) => ({ ...r, projects: r.projects.filter((p) => p.id !== id) }));

  const addCertification = () =>
    update((r) => ({ ...r, certifications: [...r.certifications, { id: Date.now().toString(), name: '', org: '', date: '' }] }));
  const updateCertification = (id, field, value) =>
    update((r) => ({ ...r, certifications: r.certifications.map((c) => c.id === id ? { ...c, [field]: value } : c) }));
  const removeCertification = (id) =>
    update((r) => ({ ...r, certifications: r.certifications.filter((c) => c.id !== id) }));

  return {
    resume, saved,
    updatePersonal, updateSummary, toggleSection, setTemplate, setColorTheme,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
  };
}