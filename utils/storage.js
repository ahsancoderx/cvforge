const KEY = 'cvforge_resume';

export function loadResume() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResume(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearResume() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}