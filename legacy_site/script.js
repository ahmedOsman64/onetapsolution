document.addEventListener('DOMContentLoaded', () => {
    init();
    initSPA();
});

function init() {
    // --- Data Persistence Connection ---
    const APP_DATA_KEY = 'ots-app-data';
    const defaultData = {
        stats: {
            projects: 50,
            clients: 20,
            services: 10,
            satisfaction: 99
        },
        users: [
            { id: 1, name: 'Alex Rivera', email: 'alex@onetap.com', role: 'Super Admin', status: 'Active', joined: 'Jan 12, 2026' },
            { id: 2, name: 'Sarah Chen', email: 'sarah@onetap.com', role: 'Lead Developer', status: 'Active', joined: 'Feb 05, 2026' },
            { id: 3, name: 'Admin Account', email: 'admin@onetap.com', role: 'Super Admin', status: 'Active', joined: 'May 11, 2026' }
        ],
        projects: [
            { id: 1, name: 'E-Commerce App', client: 'TechCorp', category: 'Web Development', progress: 75, status: 'Development', deadline: 'May 25, 2026', icon: 'fas fa-code', url: 'https://example.com' },
            { id: 2, name: 'Fitness Tracker', client: 'HealthFirst', category: 'Mobile App', progress: 100, status: 'Live', deadline: 'May 02, 2026', icon: 'fas fa-mobile-alt', url: 'https://facebook.com/onetap' }
        ],
        visitorCount: 1240,
        services: [
            { id: 1, name: 'Web Development', desc: 'Premium responsive websites built with modern technologies.', icon: 'fas fa-laptop-code', status: 'Active' },
            { id: 2, name: 'App Development', desc: 'Native and cross-platform mobile applications.', icon: 'fas fa-mobile-alt', status: 'Active' },
            { id: 3, name: 'UI/UX Design', desc: 'User-centric interface and experience design.', icon: 'fas fa-palette', status: 'Active' }
        ],
        messages: [],
        news: [
            { id: 1, title: 'OneTap v2.0 Launched', content: 'We are excited to announce the launch of our new dashboard...', date: 'May 10, 2026', status: 'Published' },
            { id: 2, title: 'New SEO Services', content: 'Our team now offers advanced SEO optimization for all clients.', date: 'May 08, 2026', status: 'Draft' }
        ],
        team: [
            { id: 1, name: 'Alex Rivera', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200', linkedin: '#', twitter: '#' },
            { id: 2, name: 'Sarah Chen', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', linkedin: '#', github: '#' },
            { id: 3, name: 'Marcus Thorne', role: 'Multimedia Designer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', linkedin: '#', dribbble: '#' }
        ],
        testimonials: [
            { id: 1, name: "Jessica Harper", role: "Founder, GreenTech", review: "OneTap Solution transformed our business with a world-class dashboard.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
            { id: 2, name: "David Miller", role: "CTO, CloudScale", review: "The mobile app they built for us is fast and intuitive.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
            { id: 3, name: "Sarah Jenkins", role: "Marketing Director, Nexus", review: "Our rebranding project was handled with extreme care.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100" }
        ],
        adminProfile: {
            companyName: 'OneTap Solution',
            email: 'hello@onetapsolution.com',
            phone: '+252 61 2652151<br>+252 61 3377606<br>+252 61 3682904',
            location: 'Mogadishu, Somalia'
        }
    };

    function getAppData() {
        const data = localStorage.getItem(APP_DATA_KEY);
        if (!data) return defaultData;
        
        try {
            const parsed = JSON.parse(data);
            const merged = { ...defaultData, ...parsed };
            // Force update if placeholder is detected in local storage
            if (merged.adminProfile && (merged.adminProfile.phone.includes('XXX') || merged.adminProfile.phone.includes('555'))) {
                merged.adminProfile.phone = defaultData.adminProfile.phone;
            }
            return merged;
        } catch {
            return defaultData;
        }
    }

    function saveAppData(data) {
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
    }

    // --- Page Transition (Fade In) ---
    document.body.classList.add('page-loaded');

    // --- Theme Toggle ---
    const themeToggle  = document.getElementById('theme-toggle');
    const themeIconEl  = document.getElementById('theme-icon');
    const themeLabelEl = document.getElementById('theme-label');

    if (themeToggle) {
        const DARK_ICON  = 'fas fa-moon';
        const LIGHT_ICON = 'fas fa-sun';

        // Apply saved theme
        const savedTheme = localStorage.getItem('ots-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIconEl) themeIconEl.className  = LIGHT_ICON;
            if (themeLabelEl) themeLabelEl.textContent = 'Dark';
        }

        themeToggle.onclick = () => {
            const isLight = document.body.classList.toggle('light-theme');
            if (themeIconEl) {
                themeIconEl.style.transform = 'rotate(360deg) scale(0)';
                setTimeout(() => {
                    themeIconEl.className    = isLight ? LIGHT_ICON : DARK_ICON;
                    if (themeLabelEl) themeLabelEl.textContent = isLight ? 'Dark'  : 'Light';
                    themeIconEl.style.transform = '';
                }, 200);
            }
            localStorage.setItem('ots-theme', isLight ? 'light' : 'dark');
        };
    }

    // --- Automatic Years Experience ---
    const expElement = document.getElementById('experience-years');
    if (expElement) {
        const startYear = 2025;
        const currentYear = new Date().getFullYear();
        let yearsExp = currentYear - startYear;
        if (yearsExp < 1) yearsExp = 1;
        expElement.innerText = yearsExp + '+';
    }

    // --- Automatic Copyright Year ---
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.onscroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.onclick = () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        };

        document.querySelectorAll('.nav-list .nav-link').forEach(link => {
            link.onclick = () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            };
        });
    }

    // --- News Feed Logic ---
    function initPublicNews() {
        const newsGrid = document.getElementById('public-news-grid');
        const fullNewsGrid = document.getElementById('full-news-grid');
        
        if (!newsGrid && !fullNewsGrid) return;

        const data = getAppData();

        if (!data.news || data.news.length === 0) {
            if (newsGrid) newsGrid.innerHTML = '<p style="color: var(--text-gray); text-align: center; width: 100%;">No news articles yet.</p>';
            if (fullNewsGrid) fullNewsGrid.innerHTML = '<p style="color: var(--text-gray); text-align: center; width: 100%;">No news articles yet.</p>';
            return;
        }

        // Handle homepage news (limited to 6)
        const publishedNews = data.news.filter(n => n.status === 'Published');
        const homepageNews = publishedNews.slice(0, 6);

        if (newsGrid) {
            newsGrid.innerHTML = homepageNews.map(n => renderNewsCard(n)).join('');
        }

        // Handle full news page (all published)
        if (fullNewsGrid) {
            fullNewsGrid.innerHTML = publishedNews.map(n => renderNewsCard(n)).join('');
        }

        function renderNewsCard(n) {
            return `
                <div class="news-card reveal">
                    ${n.image ? `<div class="news-img-container"><img src="${n.image}" alt="${n.title}"></div>` : ''}
                    <div class="news-content-wrapper">
                        <span class="news-date">${n.date}</span>
                        <h3>${n.title}</h3>
                        <p>${n.content.substring(0, 120)}${n.content.length > 120 ? '...' : ''}</p>
                        <a href="#" class="news-btn" onclick="window.readNews(${n.id}); return false;">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        }

        // Trigger reveal for newly added elements
        setTimeout(() => {
            const newsCards = document.querySelectorAll('.news-card.reveal');
            newsCards.forEach(card => card.classList.add('active'));
        }, 100);
    }

    // --- Scroll Reveal Animation ---
    function setupReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 150) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }

    // Initialize all dynamic components
    initPublicNews();
    initDynamicServices();
    initDynamicProjects();
    initDynamicContactInfo();
    setupReveal();

    // --- Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    if (stats.length > 0 && statsSection) {
        let countersStarted = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersStarted) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const increment = target / 50;
                    let current = 0;
                    const update = () => {
                        if (current < target) {
                            current += increment;
                            stat.innerText = Math.ceil(current);
                            setTimeout(update, 30);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    update();
                });
                countersStarted = true;
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(q => {
        q.onclick = () => {
            const item = q.parentElement;
            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
            item.classList.toggle('active');
        };
    });

    // --- Testimonial Slider ---
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const data = getAppData();
        const testimonials = data.testimonials || [];
        
        if (testimonials.length > 0) {
            let current = 0;
            const render = (i) => {
                const t = testimonials[i];
                testimonialSlider.innerHTML = `
                    <div class="testimonial-item" style="animation: fadeIn 0.8s ease">
                        <div class="client-img"><img src="${t.img || 'https://via.placeholder.com/100'}" alt="${t.name}"></div>
                        <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="review">"${t.review}"</p>
                        <h4>${t.name}</h4>
                        <p class="client-role">${t.role}</p>
                    </div>`;
            };
            render(current);
            setInterval(() => { 
                current = (current + 1) % testimonials.length; 
                render(current); 
            }, 5000);
        }
    }

    // --- Visitor Tracking ---
    function trackVisitor() {
        const data = getAppData();
        if (!data.visitorCount) data.visitorCount = 1240; // Base value
        data.visitorCount += 1;
        saveAppData(data);
    }
    trackVisitor();

    // --- Update Stats from Data ---
    const updateStatsFromData = () => {
        const stats = getAppData().stats;
        const statElements = document.querySelectorAll('.stat-number');
        statElements.forEach(el => {
            const target = el.getAttribute('data-target');
            if (target == "50") el.setAttribute('data-target', stats.projects);
            if (target == "20") el.setAttribute('data-target', stats.clients);
            if (target == "10") el.setAttribute('data-target', stats.services);
            if (target == "99") el.setAttribute('data-target', stats.satisfaction);
        });
    };
    updateStatsFromData();

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const newMessage = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                subject: 'New Web Inquiry',
                message: formData.get('message'),
                date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ', Today',
                unread: true
            };

            const data = getAppData();
            data.messages.unshift(newMessage);
            saveAppData(data);

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
            btn.style.background = 'var(--success)';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        };
    }

    // --- Newsletter Form Handler ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.onsubmit = (e) => {
            e.preventDefault();
            const email = new FormData(newsletterForm).get('email');
            
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'var(--primary-azure)';
            btn.disabled = true;

            // Simulate save/subscription
            console.log(`Subscribed: ${email}`);
            
            setTimeout(() => {
                newsletterForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        };
    }

    // --- Dynamic Services Rendering ---
    function initDynamicServices() {
        const servicesGrid = document.getElementById('dynamic-services-grid');
        if (!servicesGrid) return;

        const data = getAppData();
        const services = data.services || [];

        if (services.length === 0) return;

        servicesGrid.innerHTML = services.filter(s => s.status === 'Active').map(s => `
            <div class="service-card reveal active">
                <div class="service-icon"><i class="${s.icon}"></i></div>
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <a href="contact.html" class="service-link">Get Started <i class="fas fa-arrow-right"></i></a>
            </div>
        `).join('');
    }

    // --- Dynamic Team Rendering ---
    function initDynamicTeam() {
        const teamGrid = document.getElementById('dynamic-team-grid');
        if (!teamGrid) return;

        const data = getAppData();
        const team = data.team || [];

        if (team.length === 0) return;

        teamGrid.innerHTML = team.map(m => `
            <div class="team-card reveal active">
                <div class="team-img-wrapper">
                    <img src="${m.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}" alt="${m.name}">
                </div>
                <h3>${m.name}</h3>
                <p>${m.role}</p>
                <div class="team-socials">
                    ${m.linkedin ? `<a href="${m.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${m.twitter ? `<a href="${m.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                    ${m.github ? `<a href="${m.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    ${m.dribbble ? `<a href="${m.dribbble}" target="_blank"><i class="fab fa-dribbble"></i></a>` : ''}
                </div>
            </div>
        `).join('');
    }

    // --- Dynamic Projects Rendering ---
    function initDynamicProjects() {
        const portfolioGrid = document.getElementById('dynamic-portfolio-grid');
        const homepageGrid = document.getElementById('homepage-portfolio-grid');
        
        if (!portfolioGrid && !homepageGrid) return;

        const data = getAppData();
        const projects = data.projects || [];

        if (projects.length === 0) return;

        const renderProject = (p, classes = 'reveal active') => `
            <div class="portfolio-item ${classes}">
                <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800'}" alt="${p.name}">
                <div class="portfolio-overlay">
                    <div style="margin-bottom: auto; display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                         <span style="background: var(--primary-azure); color: #000; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${p.category || 'Project'}</span>
                    </div>
                    <h4>${p.name}</h4>
                    ${p.client ? `<p style="color: var(--text-gray); font-size: 13px; margin-top: -5px; margin-bottom: 5px;">Client: ${p.client}</p>` : ''}
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <p style="color: var(--primary-azure); font-size: 14px; margin: 0;">${p.status || 'Active'}</p>
                        <a href="${p.url || '#'}" target="${p.url ? '_blank' : '_self'}" class="portfolio-btn" style="position: static; opacity: 1; display: flex;"><i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;

        if (portfolioGrid) {
            portfolioGrid.innerHTML = projects.map(renderProject).join('');
        }

        if (homepageGrid) {
            // Show latest projects on homepage slider
            const recentProjects = [...projects].reverse();
            homepageGrid.innerHTML = recentProjects.map(p => renderProject(p, '')).join('');
            
            // Initialize slider logic
            let currentS = 0;
            const items = homepageGrid.querySelectorAll('.portfolio-item');
            if (items.length > 0) {
                items[0].classList.add('active-slide');
                
                setInterval(() => {
                    items[currentS].classList.remove('active-slide');
                    currentS = (currentS + 1) % items.length;
                    
                    homepageGrid.style.transform = `translateX(-${currentS * 100}%)`;
                    items[currentS].classList.add('active-slide');
                }, 4000);
            }
        }
    }

    // --- Dynamic Contact Info & Profile Sync ---
    function initDynamicContactInfo() {
        const data = getAppData();
        const profile = data.adminProfile || {};
        
        // Update Phone
        const phoneEls = document.querySelectorAll('[id$="-phone-display"]');
        if (profile.phone) {
            phoneEls.forEach(el => el.innerHTML = profile.phone);
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            // Use first number for tel: link
            const primaryPhone = profile.phone.split('<br>')[0].replace(/\D/g,'');
            phoneLinks.forEach(link => link.href = `tel:${primaryPhone}`);
        }

        // Update Email
        const emailEls = document.querySelectorAll('[id$="-email-display"]');
        if (profile.email) {
            emailEls.forEach(el => el.textContent = profile.email);
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => link.href = `mailto:${profile.email}`);
        }

        // Update Location
        const locationEls = document.querySelectorAll('[id$="-location-display"]');
        if (profile.location) {
            locationEls.forEach(el => el.textContent = profile.location);
        }

        // Update Logo/Company Name in footer
        const logoTexts = document.querySelectorAll('.logo-text, .footer .logo span');
        if (profile.companyName) {
            logoTexts.forEach(el => {
                if (el.classList.contains('logo-text')) {
                    el.innerHTML = `${profile.companyName.split(' ')[0]} <span class="accent">${profile.companyName.split(' ').slice(1).join(' ')}</span>`;
                } else {
                    el.innerHTML = `${profile.companyName.split(' ')[0]} <span class="accent">${profile.companyName.split(' ').slice(1).join(' ')}</span>`;
                }
            });
        }
    }

    // --- Active Link Highlight ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // --- Hero Slider & Animations ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentS = 0;
        setInterval(() => {
            slides[currentS].classList.remove('active');
            currentS = (currentS + 1) % slides.length;
            slides[currentS].classList.add('active');
        }, 5000);
    }

    // --- Hero Background Slider ---
    const heroBg = document.querySelector('.hero-bg-overlay');
    if (heroBg) {
        const images = [
            'assets/images/Image1.jpg',
            'assets/images/Image2.jpg',
            'assets/images/Image3.jpg'
        ];
        let currentIdx = 0;
        
        setInterval(() => {
            currentIdx = (currentIdx + 1) % images.length;
            const isLight = document.body.classList.contains('light-theme');
            const gradient = isLight 
                ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7))' 
                : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), #000000)';
            heroBg.style.backgroundImage = `${gradient}, url('${images[currentIdx]}')`;
        }, 5000);
    }

    // Floating elements logic removed
    initDynamicServices();
    initDynamicProjects();
    initPublicNews();
    initDynamicTeam();
    initDynamicContactInfo();
}

// --- SPA Logic ---
function initSPA() {
    const loadingBar = document.createElement('div');
    loadingBar.id = 'loading-bar';
    document.body.appendChild(loadingBar);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.includes('wa.me') || link.target === '_blank') return;

        e.preventDefault();
        navigateTo(href);
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
}

async function navigateTo(url) {
    if (url === window.location.pathname.split('/').pop()) return;
    
    const contentArea = document.getElementById('content-area');
    contentArea.classList.add('is-exiting');

    const loadingBar = document.getElementById('loading-bar');
    loadingBar.style.width = '30%';
    loadingBar.style.opacity = '1';

    setTimeout(async () => {
        history.pushState(null, null, url); // Update URL first
        await loadPage(url);
        loadingBar.style.width = '100%';
        setTimeout(() => {
            loadingBar.style.opacity = '0';
            setTimeout(() => loadingBar.style.width = '0%', 300);
        }, 200);
    }, 400);
}

async function loadPage(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newContentArea = doc.getElementById('content-area');
        if (!newContentArea) throw new Error('No content area found');
        
        const newContent = newContentArea.innerHTML;
        const newTitle = doc.title;

        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = newContent;
        document.title = newTitle;

        contentArea.classList.remove('is-exiting');
        contentArea.classList.add('is-entering');
        
        window.scrollTo(0, 0);
        
        // Re-initialize scripts
        init();
        
        setTimeout(() => {
            contentArea.classList.remove('is-entering');
        }, 10);

    } catch (err) {
        console.error('Failed to load page:', err);
        // If it fails (e.g. 404 or network error), do a hard refresh
        window.location.href = url;
    }
}

// --- News Reader Logic ---
window.readNews = (id) => {
    // We need to re-fetch data to get the full content
    const data = JSON.parse(localStorage.getItem('ots-app-data')) || { news: [] };
    const news = data.news.find(n => n.id == id);
    if (!news) return;

    const modal = document.getElementById('news-reader-modal');
    if (!modal) return;

    modal.querySelector('.news-reader-title').textContent = news.title;
    modal.querySelector('.news-reader-date').textContent = news.date;
    modal.querySelector('.news-reader-content').textContent = news.content;
    
    const img = modal.querySelector('.news-reader-img');
    if (news.image) {
        img.src = news.image;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeNewsReader = () => {
    const modal = document.getElementById('news-reader-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// Helper for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
