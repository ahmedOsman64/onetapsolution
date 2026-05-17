/**
 * api.js — Shared data layer for OneTap Solution
 * Reads from the same localStorage store the Admin panel writes to.
 * This means any change an admin makes is instantly visible to customers.
 */

const APP_DATA_KEY = 'ots-app-data';

const defaultData = {
  projects: [],
  services: [],
  testimonials: [],
  team: [],
  stats: { projects: 0, clients: 20, services: 0, satisfaction: 99 },
  news: [],
};

/**
 * Get the full app data (merges stored data with defaults)
 */
function getAppData() {
  try {
    const raw = localStorage.getItem(APP_DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.error('api.js: failed to read app data', e);
  }
  return defaultData;
}

export function getProjects() {
  const d = getAppData();
  return (d.projects || []).map(p => ({
    id: p.id,
    title: p.name || p.title,
    category: p.category || 'Web Development',
    desc: p.desc || p.description || '',
    image: p.image || p.img || '',
    url: p.url || '#',
    deadline: p.deadline || '',
    progress: p.progress || 0,
    client: p.client || ''
  }));
}

export function getServices() {
  const d = getAppData();
  return (d.services || []).filter(s => s.status !== 'Inactive');
}

export function getTestimonials() {
  const d = getAppData();
  return d.testimonials || [];
}

export function getTeam() {
  const d = getAppData();
  return d.team || [];
}

export function getStats() {
  const d = getAppData();
  return d.stats || defaultData.stats;
}

export function getNews() {
  const d = getAppData();
  return (d.news || []).filter(n => n.status === 'Published');
}

/**
 * Submit a contact message directly to MySQL backend
 */
export async function submitContactMessage({ name, email, subject, message }) {
  try {
    const response = await fetch('http://localhost:5000/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
    const result = await response.json();
    return { success: response.ok && result.success, message: result.message };
  } catch (e) {
    console.error('api.js: failed to save message', e);
    return { success: false, message: 'Server connection failed' };
  }
}

/**
 * Subscribe to the newsletter directly in MySQL
 */
export async function subscribeNewsletter(email) {
  try {
    const response = await fetch('http://localhost:5000/api/newsletter/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    return { success: response.ok && result.success, message: result.message };
  } catch (e) {
    console.error('api.js: failed to subscribe to newsletter', e);
    return { success: false, message: 'Server connection failed' };
  }
}
