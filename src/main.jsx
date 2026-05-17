import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fetch all public data from MySQL and cache to localStorage
const bootstrapPublicData = async () => {
    try {
        const [projectsRes, servicesRes, teamRes, testimonialsRes, newsRes, statsRes] = await Promise.all([
            fetch('http://localhost:5000/api/projects/').then(r => r.json()).catch(() => ({ success: false, data: [] })),
            fetch('http://localhost:5000/api/services/').then(r => r.json()).catch(() => ({ success: false, data: [] })),
            fetch('http://localhost:5000/api/team/').then(r => r.json()).catch(() => ({ success: false, data: [] })),
            fetch('http://localhost:5000/api/testimonials/').then(r => r.json()).catch(() => ({ success: false, data: [] })),
            fetch('http://localhost:5000/api/news/').then(r => r.json()).catch(() => ({ success: false, data: [] })),
            fetch('http://localhost:5000/api/stats/track-visit', { method: 'POST' }).then(r => r.json()).catch(() => ({ success: false, data: { visitorCount: 1240 } }))
        ]);

        const raw = localStorage.getItem('ots-app-data');
        const currentData = raw ? JSON.parse(raw) : {};

        const updatedData = {
            ...currentData,
            projects: projectsRes.success ? projectsRes.data : (currentData.projects || []),
            services: servicesRes.success ? servicesRes.data : (currentData.services || []),
            team: teamRes.success ? teamRes.data : (currentData.team || []),
            testimonials: testimonialsRes.success ? testimonialsRes.data : (currentData.testimonials || []),
            news: newsRes.success ? newsRes.data : (currentData.news || []),
            visitorCount: statsRes.success && statsRes.data ? statsRes.data.visitorCount : (currentData.visitorCount || 1240),
            stats: {
                projects: projectsRes.success ? projectsRes.data.length : (currentData.stats?.projects || 0),
                clients: 20,
                services: servicesRes.success ? servicesRes.data.length : (currentData.stats?.services || 0),
                satisfaction: 99
            }
        };

        localStorage.setItem('ots-app-data', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('app-data-updated'));
    } catch (e) {
        console.error("Failed to bootstrap public database data from MySQL:", e);
    }
};

// Initiate dynamic backend synchronization
bootstrapPublicData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
