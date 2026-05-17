document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    
    const notificationBtn = document.getElementById('notification-btn');
    const notificationMenu = document.getElementById('notification-menu');
    
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');
    
    // --- Sidebar Toggle ---
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            if (window.innerWidth > 992) {
                // Desktop behavior
                sidebar?.classList.toggle('collapsed');
                mainContent?.classList.toggle('expanded');
            } else {
                // Mobile behavior
                sidebar?.classList.add('open');
            }
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar?.classList.remove('open');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !toggleSidebarBtn?.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    // --- Dropdowns ---
    function closeAllDropdowns() {
        notificationMenu?.classList.remove('show');
        profileMenu?.classList.remove('show');
    }

    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShowing = notificationMenu?.classList.contains('show');
            closeAllDropdowns();
            if (!isShowing) {
                notificationMenu?.classList.add('show');
            }
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShowing = profileMenu?.classList.contains('show');
            closeAllDropdowns();
            if (!isShowing) {
                profileMenu?.classList.add('show');
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationBtn && !notificationBtn.contains(e.target)) {
            notificationMenu?.classList.remove('show');
        }
        if (profileBtn && !profileBtn.contains(e.target)) {
            profileMenu?.classList.remove('show');
        }
    });

    // --- Active Menu State ---
    const menuItems = document.querySelectorAll('.menu-item');
    
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'admin.html';
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                
                if (fileName === href) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }

    setActiveMenuItem();

    // On mobile, close sidebar after clicking a link
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 992 && !e.target.closest('.has-submenu')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // --- Authentication ---
    const APP_DATA_KEY = 'ots-app-data';
    const SESSION_KEY = 'ots-admin-session';
    // Authorised credential hashes (SHA-256, never store plain text)
    const _AH = ['240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'];

    async function _digest(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    window.checkAuth = () => {
        const session = localStorage.getItem(SESSION_KEY);
        const isLoginPage = window.location.pathname.includes('admin-login.html');
        
        if (!session) {
            if (!isLoginPage) {
                window.location.href = 'admin-login.html';
            }
            return false;
        }
        
        if (isLoginPage) {
            window.location.href = 'admin.html';
        }
        
        // Update UI with user info if elements exist
        try {
            const userData = JSON.parse(session);
            const welcomeName = document.getElementById('welcome-name');
            if (welcomeName) welcomeName.textContent = userData.name.split(' ')[0];
            
            const profileName = document.querySelector('.user-info .user-name');
            if (profileName) profileName.textContent = userData.name;
            
            const profileRole = document.querySelector('.user-info .user-role');
            if (profileRole) profileRole.textContent = userData.role;
        } catch (e) {
            console.error('Error parsing session data:', e);
        }

        return true;
    };

    window.handleLogin = async (email, password) => {
        const data = getAppData();
        
        const currentUsers = data.users || [];
        const combinedUsers = [...currentUsers];
        
        defaultData.users.forEach(defaultUser => {
            if (!combinedUsers.find(u => u.email.toLowerCase() === defaultUser.email.toLowerCase())) {
                combinedUsers.push(defaultUser);
            }
        });
        
        const cleanEmail = email.trim().toLowerCase();
        const hash = await _digest(password.trim());

        const user = combinedUsers.find(u => u.email.toLowerCase() === cleanEmail);
        
        const isPrivileged = user && ['Super Admin', 'Lead Developer', 'Admin'].includes(user.role);
        const isAuthorised = _AH.includes(hash);

        if (user && isPrivileged && isAuthorised) {
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                time: Date.now()
            }));
            return true;
        }
        return false;
    };

    // --- Data Persistence ---
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
            { id: 3, name: 'Admin Account', email: 'admin@onetap.com', role: 'Super Admin', status: 'Active', joined: 'May 11, 2026' },
            { id: 4, name: 'Marcus Wright', email: 'marcus@client.com', role: 'Client', status: 'Offline', joined: 'Mar 20, 2026' }
        ],
        projects: [
            { id: 1, name: 'E-Commerce App', client: 'TechCorp', progress: 75, status: 'Development', deadline: 'May 25, 2026', icon: 'fas fa-code', url: 'https://example.com' },
            { id: 2, name: 'Fitness Tracker', client: 'HealthFirst', progress: 100, status: 'Live', deadline: 'May 02, 2026', icon: 'fas fa-mobile-alt', url: 'https://facebook.com/onetap' }
        ],
        visitorCount: 1240,
        services: [
            { id: 1, name: 'Web Development', desc: 'Premium responsive websites built with modern technologies.', icon: 'fas fa-laptop-code', status: 'Active' },
            { id: 2, name: 'App Development', desc: 'Native and cross-platform mobile applications.', icon: 'fas fa-mobile-alt', status: 'Active' },
            { id: 3, name: 'UI/UX Design', desc: 'User-centric interface and experience design.', icon: 'fas fa-palette', status: 'Active' }
        ],
        messages: [
            { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Web Design Project', message: 'Hello, I\'m interested in building a new e-commerce platform...', date: '10 mins ago', unread: true },
            { id: 2, name: 'Alice Smith', email: 'alice@example.com', subject: 'Question about pricing', message: 'Hi, I saw your pricing plans and had a question about the custom tier.', date: '2 hours ago', unread: false }
        ],
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
        ]
    };

    function getAppData() {
        const data = localStorage.getItem(APP_DATA_KEY);
        if (!data) return defaultData;
        
        try {
            const parsed = JSON.parse(data);
            // Merge with defaultData to ensure all keys exist
            return { ...defaultData, ...parsed };
        } catch {
            return defaultData;
        }
    }

    function saveAppData(data) {
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
    }

    window.handleLogout = () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    };

    // Run auth check immediately
    window.checkAuth();

    // --- Notifications Management ---
    function initNotifications() {
        const data = getAppData();
        const notificationBtn = document.getElementById('notification-btn');
        const notificationMenu = document.getElementById('notification-menu');
        const notificationList = document.querySelector('.notification-menu .dropdown-body');
        const pulseDot = document.querySelector('.pulse-dot');
        const badge = document.querySelector('.notification-menu .badge');

        if (!notificationBtn || !notificationMenu) return;

        // Toggle logic
        notificationBtn.onclick = (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            document.getElementById('profile-menu')?.classList.remove('show');
        };

        const unreadCount = data.messages.filter(m => m.unread).length;
        
        // Update Pulse Dot
        if (pulseDot) pulseDot.style.display = unreadCount > 0 ? 'block' : 'none';
        
        // Update Badge
        if (badge) badge.textContent = `${unreadCount} New`;

        // Render List
        if (notificationList) {
            if (data.messages.length === 0) {
                notificationList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-gray); font-size: 13px;">No notifications</p>';
                return;
            }

            notificationList.innerHTML = data.messages.slice(0, 5).map(msg => `
                <a href="admin-messages.html" class="notification-item ${msg.unread ? 'unread' : ''}">
                    <div class="icon-circle bg-primary-light">
                        <i class="fas ${msg.unread ? 'fa-envelope' : 'fa-envelope-open'} text-primary"></i>
                    </div>
                    <div class="notification-info">
                        <p>${msg.name}</p>
                        <span style="display:block; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${msg.subject}</span>
                        <span>${msg.date}</span>
                    </div>
                </a>
            `).join('');
        }
    }

    // --- Helper Functions ---
    const formatDate = (date = new Date()) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    // --- Stats Management (Dashboard) ---
    function initDashboardStats(query = '') {
        if (!window.location.pathname.includes('admin.html') || window.location.pathname.includes('admin-')) return;
        
        const data = getAppData();
        const statValues = document.querySelectorAll('.stat-value');
        
        if (statValues.length >= 4) {
            statValues[0].textContent = data.users.length.toLocaleString();
            statValues[1].textContent = data.projects.length.toLocaleString();
            
            // Simulated real-time growth for visitors
            let currentVisitors = data.visitorCount || 0;
            
            // 30% chance to add 1-3 new "live" visitors during this refresh cycle
            if (Math.random() > 0.7) {
                const boost = Math.floor(Math.random() * 3) + 1;
                currentVisitors += boost;
                data.visitorCount = currentVisitors;
                saveAppData(data);
            }
            
            statValues[2].textContent = currentVisitors.toLocaleString();
            
            statValues[3].textContent = data.messages.filter(m => m.unread).length.toLocaleString();
        }

        // Recent Projects Table on Dashboard
        const dashboardTable = document.querySelector('.table tbody');
        if (dashboardTable) {
            let recentProjects = [...data.projects].reverse();
            
            if (query) {
                recentProjects = recentProjects.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.client?.toLowerCase().includes(query) ||
                    p.status.toLowerCase().includes(query)
                );
            } else {
                recentProjects = recentProjects.slice(0, 4);
            }

            dashboardTable.innerHTML = recentProjects.map(p => `
                <tr>
                    <td>
                        <div class="project-info">
                            <div class="project-icon"><i class="${p.icon}"></i></div>
                            <span>${p.name}</span>
                        </div>
                    </td>
                    <td>${p.client}</td>
                    <td><span class="badge ${p.status === 'Live' ? 'badge-success' : 'badge-primary'}">${p.status}</span></td>
                    <td>${p.deadline}</td>
                    <td>
                        <div class="page-actions" style="gap: 8px;">
                            ${p.url ? `<a href="${p.url}" target="_blank" class="action-btn" title="View Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            <button class="action-btn" onclick="window.editProject(${p.id})"><i class="fas fa-edit"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    initDashboardStats();
    // Real-time updates for stats
    setInterval(initDashboardStats, 5000);
    initNotifications();

    // --- User Management ---
    function initUsers(query = '') {
        if (!window.location.pathname.includes('admin-users.html')) return;
        const data = getAppData();
        const userTable = document.querySelector('.table tbody');
        if (userTable) {
            let filteredUsers = data.users;
            if (query) {
                filteredUsers = data.users.filter(u => 
                    u.name.toLowerCase().includes(query) || 
                    u.email.toLowerCase().includes(query) || 
                    u.role.toLowerCase().includes(query) ||
                    u.status.toLowerCase().includes(query)
                );
            }

            userTable.innerHTML = filteredUsers.map(u => `
                <tr>
                    <td>
                        <div class="project-info">
                            <div class="project-icon"><i class="fas fa-user"></i></div>
                            <span>${u.name}</span>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td><span class="badge badge-primary">${u.role}</span></td>
                    <td><span class="${u.status === 'Active' ? 'text-success' : 'text-gray'}"><i class="fas fa-circle" style="font-size: 8px; margin-right: 5px;"></i> ${u.status}</span></td>
                    <td>${u.joined}</td>
                    <td>
                        <button class="action-btn" onclick="window.editUser(${u.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" onclick="window.deleteUser(${u.id})" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.addUser = () => {
        const modal = document.getElementById('user-modal');
        if (!modal) return;
        const form = document.getElementById('user-form');
        form.reset();
        form.querySelector('[name="id"]').value = '';
        modal.querySelector('h3').textContent = 'Add New User';
        modal.classList.add('show');
    };

    window.closeUserModal = () => {
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.remove('show');
    };

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(userForm);
            const id = formData.get('id');
            const data = getAppData();
            
            if (id) {
                // Edit existing user
                const user = data.users.find(u => u.id === parseInt(id));
                if (user) {
                    user.name = formData.get('name');
                    user.email = formData.get('email');
                    user.role = formData.get('role');
                }
            } else {
                // Add new user
                data.users.push({
                    id: Date.now(),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    status: 'Active',
                    joined: formatDate()
                });
            }
            
            saveAppData(data);
            window.closeUserModal();
            userForm.reset();
            initUsers();
        };
    }

    window.editUser = (id) => {
        const data = getAppData();
        const user = data.users.find(u => u.id === id);
        if (!user) return;
        
        const modal = document.getElementById('user-modal');
        if (!modal) return;
        
        const form = document.getElementById('user-form');
        form.querySelector('[name="id"]').value = user.id;
        form.querySelector('[name="name"]').value = user.name;
        form.querySelector('[name="email"]').value = user.email;
        form.querySelector('[name="role"]').value = user.role;
        
        modal.querySelector('h3').textContent = 'Edit User';
        modal.classList.add('show');
    };

    window.deleteUser = (id) => {
        if (!confirm("Are you sure?")) return;
        const data = getAppData();
        data.users = data.users.filter(u => u.id !== id);
        saveAppData(data);
        initUsers();
    };

    initUsers();

    // --- Project Management ---
    function initProjects(query = '') {
        if (!window.location.pathname.includes('admin-projects.html')) return;
        const data = getAppData();
        const projectTable = document.querySelector('.table tbody');
        if (projectTable) {
            let filteredProjects = data.projects;
            if (query) {
                filteredProjects = data.projects.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    (p.client && p.client.toLowerCase().includes(query)) ||
                    p.status.toLowerCase().includes(query)
                );
            }

            projectTable.innerHTML = filteredProjects.map(p => `
                <tr>
                    <td><div class="project-info"><div class="project-icon"><i class="${p.icon}"></i></div><span>${p.name}</span></div></td>
                    <td>
                        <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                            <div style="width: ${p.progress}%; height: 100%; background: ${p.progress === 100 ? 'var(--success)' : 'var(--primary-neon)'};"></div>
                        </div>
                    </td>
                    <td><span class="badge ${p.status === 'Live' ? 'badge-success' : 'badge-primary'}">${p.status}</span></td>
                    <td>${p.deadline}</td>
                    <td>
                        <div class="page-actions" style="gap: 8px;">
                            ${p.url ? `<a href="${p.url}" target="_blank" class="action-btn" title="View Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            <button class="action-btn" onclick="window.editProject(${p.id})"><i class="fas fa-edit"></i></button>
                            <button class="action-btn" onclick="window.deleteProject(${p.id})" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.addProject = () => {
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        const form = document.getElementById('project-form');
        form.reset();
        form.querySelector('[name="id"]').value = '';
        modal.querySelector('h3').textContent = 'Create New Project';
        modal.classList.add('show');
    };

    window.closeProjectModal = () => {
        const modal = document.getElementById('project-modal');
        if (modal) modal.classList.remove('show');
    };

    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(projectForm);
            const id = formData.get('id');
            const category = formData.get('category');
            const fileInput = document.getElementById('project-image-file');
            
            const iconMap = {
                'Web Development': 'fas fa-code',
                'Mobile App': 'fas fa-mobile-alt',
                'Business Automation': 'fas fa-chart-line',
                'Multimedia': 'fas fa-photo-film'
            };

            let imageUrl = '';
            if (fileInput && fileInput.files[0]) {
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(fileInput.files[0]);
                });
            }

            const data = getAppData();
            
            if (id) {
                // Edit existing project
                const p = data.projects.find(p => p.id === parseInt(id));
                if (p) {
                    p.name = formData.get('name');
                    p.client = formData.get('client');
                    p.category = category;
                    p.status = formData.get('status');
                    p.deadline = formatDate(new Date(formData.get('deadline')));
                    p.url = formData.get('url');
                    p.icon = iconMap[category] || 'fas fa-briefcase';
                    if (imageUrl) p.image = imageUrl;
                    p.progress = p.status === 'Live' ? 100 : p.progress;
                }
            } else {
                // Add new project
                data.projects.push({
                    id: Date.now(),
                    name: formData.get('name'),
                    client: formData.get('client'),
                    category: category,
                    progress: formData.get('status') === 'Live' ? 100 : 0,
                    status: formData.get('status'),
                    deadline: formatDate(new Date(formData.get('deadline'))),
                    url: formData.get('url'),
                    image: imageUrl || '',
                    icon: iconMap[category] || 'fas fa-briefcase'
                });
            }
            
            saveAppData(data);
            window.closeProjectModal();
            projectForm.reset();
            initProjects();
            if (window.location.pathname.includes('admin.html')) initDashboardStats();
        };
    }

    window.editProject = (id) => {
        const data = getAppData();
        const p = data.projects.find(p => p.id === id);
        if (!p) return;
        
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        
        const form = document.getElementById('project-form');
        form.querySelector('[name="id"]').value = p.id;
        form.querySelector('[name="name"]').value = p.name;
        form.querySelector('[name="client"]').value = p.client || '';
        form.querySelector('[name="category"]').value = p.category;
        form.querySelector('[name="status"]').value = p.status;
        form.querySelector('[name="url"]').value = p.url || '';
        
        // Handle date conversion for input[type="date"]
        if (p.deadline) {
            try {
                const dateParts = p.deadline.split(' ');
                const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
                const month = monthMap[dateParts[0]];
                const day = parseInt(dateParts[1].replace(',',''));
                const year = parseInt(dateParts[2]);
                const d = new Date(year, month, day);
                form.querySelector('[name="deadline"]').value = d.toISOString().split('T')[0];
            } catch { /* invalid date format, skip */ }
        }
        
        modal.querySelector('h3').textContent = 'Edit Project';
        modal.classList.add('show');
    };

    window.deleteProject = (id) => {
        if (!confirm("Delete project?")) return;
        const data = getAppData();
        data.projects = data.projects.filter(p => p.id !== id);
        saveAppData(data);
        initProjects();
    };

    initProjects();

    // --- Service Management ---
    function initServices(query = '') {
        if (!window.location.pathname.includes('admin-services.html')) return;
        const data = getAppData();
        const grid = document.querySelector('.stats-grid');
        if (grid) {
            let filteredServices = data.services;
            if (query) {
                filteredServices = data.services.filter(s => 
                    s.name.toLowerCase().includes(query) || 
                    s.desc.toLowerCase().includes(query)
                );
            }

            grid.innerHTML = filteredServices.map(s => `
                <div class="service-card">
                    <div class="service-icon-wrapper">
                        <i class="${s.icon}"></i>
                    </div>
                    <h3>${s.name}</h3>
                    <p>${s.desc}</p>
                    <div class="service-actions">
                        <button class="service-btn edit" onclick="window.editService(${s.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="service-btn delete" onclick="window.deleteService(${s.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    window.addService = () => {
        const modal = document.getElementById('service-modal');
        if (!modal) return;
        document.getElementById('service-form').reset();
        document.getElementById('service-id').value = '';
        modal.classList.add('show');
    };

    window.editService = (id) => {
        const modal = document.getElementById('service-modal');
        if (!modal) return;
        const data = getAppData();
        const s = data.services.find(s => s.id === id);
        if (!s) return;
        
        document.getElementById('service-id').value = s.id;
        document.getElementById('service-name').value = s.name;
        document.getElementById('service-desc').value = s.desc;
        document.getElementById('service-icon').value = s.icon;
        
        modal.classList.add('show');
    };

    window.closeServiceModal = () => {
        const modal = document.getElementById('service-modal');
        if (modal) modal.classList.remove('show');
    };

    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(serviceForm);
            const id = formData.get('id');
            const data = getAppData();
            
            if (id) {
                // Edit mode
                const s = data.services.find(s => s.id === parseInt(id));
                if (s) {
                    s.name = formData.get('name');
                    s.desc = formData.get('desc');
                    s.icon = formData.get('icon');
                }
            } else {
                // Add mode
                data.services.push({
                    id: Date.now(),
                    name: formData.get('name'),
                    desc: formData.get('desc'),
                    icon: formData.get('icon'),
                    status: 'Active'
                });
            }
            
            saveAppData(data);
            window.closeServiceModal();
            initServices();
        };
    }

    window.deleteService = (id) => {
        if (!confirm("Delete service?")) return;
        const data = getAppData();
        data.services = data.services.filter(s => s.id !== id);
        saveAppData(data);
        initServices();
    };

    initServices();

    // --- News Management ---
    function initNews(query = '') {
        if (!window.location.pathname.includes('admin-news.html')) return;
        const data = getAppData();
        const newsTable = document.querySelector('.table tbody');
        if (newsTable) {
            let filteredNews = data.news;
            if (query) {
                filteredNews = data.news.filter(n => 
                    n.title.toLowerCase().includes(query) || 
                    n.status.toLowerCase().includes(query) ||
                    (n.content && n.content.toLowerCase().includes(query))
                );
            }

            newsTable.innerHTML = filteredNews.map(n => `
                <tr>
                    <td><div style="font-weight: 600; color: var(--white);">${n.title}</div></td>
                    <td><span style="color: var(--text-gray); font-size: 13px;">${n.date}</span></td>
                    <td><span class="badge ${n.status === 'Published' ? 'badge-success' : 'badge-primary'}">${n.status}</span></td>
                    <td>
                        <div class="page-actions" style="gap: 8px;">
                            <button class="action-btn" onclick="window.editNews(${n.id})"><i class="fas fa-edit"></i></button>
                            <button class="action-btn" onclick="window.deleteNews(${n.id})" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.addNews = () => {
        const modal = document.getElementById('news-modal');
        if (!modal) return;
        document.getElementById('news-form').reset();
        document.getElementById('news-id').value = '';
        modal.classList.add('show');
    };

    window.closeNewsModal = () => {
        const modal = document.getElementById('news-modal');
        if (modal) modal.classList.remove('show');
    };

    window.editNews = (id) => {
        const data = getAppData();
        const n = data.news.find(n => n.id === id);
        if (!n) return;
        
        const modal = document.getElementById('news-modal');
        if (!modal) return;
        
        document.getElementById('news-id').value = n.id;
        document.querySelector('[name="title"]').value = n.title;
        document.querySelector('[name="image"]').value = n.image || '';
        document.querySelector('[name="content"]').value = n.content;
        document.querySelector('[name="status"]').value = n.status;
        
        modal.classList.add('show');
    };

    window.deleteNews = (id) => {
        if (!confirm("Delete news article?")) return;
        const data = getAppData();
        data.news = data.news.filter(n => n.id !== id);
        saveAppData(data);
        initNews();
    };

    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(newsForm);
            const data = getAppData();
            const id = document.getElementById('news-id').value;
            const fileInput = document.getElementById('news-image-file');
            
            let imageUrl = formData.get('image');

            // Handle File Upload (Convert to Base64)
            if (fileInput && fileInput.files[0]) {
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(fileInput.files[0]);
                });
            }

            if (id) {
                const n = data.news.find(n => n.id == id);
                if (n) {
                    n.title = formData.get('title');
                    n.image = imageUrl;
                    n.content = formData.get('content');
                    n.status = formData.get('status');
                }
            } else {
                data.news.unshift({
                    id: Date.now(),
                    title: formData.get('title'),
                    image: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800',
                    content: formData.get('content'),
                    status: formData.get('status'),
                    date: formatDate(new Date())
                });
            }

            saveAppData(data);
            window.closeNewsModal();
            initNews();
        };
    }

    initNews();

    // --- Global Profile Sync ---
    window.initAdminProfile = () => {
        const data = getAppData();
        const profile = data.adminProfile;
        if (!profile) return;

        // Update topbar
        const topbarName = document.querySelector('.user-name');
        const topbarRole = document.querySelector('.user-role');
        const topbarAvatars = document.querySelectorAll('.avatar');

        if (topbarName && profile.name) topbarName.textContent = profile.name;
        if (topbarRole && profile.position) topbarRole.textContent = profile.position;
        if (profile.avatar) {
            topbarAvatars.forEach(img => img.src = profile.avatar);
        }

        // Update profile page elements if they exist
        const displayName = document.getElementById('display-name');
        const displayRole = document.getElementById('display-role');
        const profileImg = document.getElementById('profile-display-img');
        const welcomeName = document.getElementById('welcome-name');

        if (displayName && profile.name) displayName.textContent = profile.name;
        if (displayRole && profile.position) displayRole.textContent = profile.position;
        if (profileImg && profile.avatar) profileImg.src = profile.avatar;
        if (welcomeName && profile.name) welcomeName.textContent = profile.name.split(' ')[0]; // Show first name

        // Pre-fill form fields
        const form = document.getElementById('profile-form');
        if (form) {
            if (profile.name) form.name.value = profile.name;
            if (profile.email) form.email.value = profile.email;
            if (profile.phone) form.phone.value = profile.phone;
            if (profile.position) form.position.value = profile.position;
            if (profile.bio) form.bio.value = profile.bio;
        }
    };

    window.initAdminProfile();

    // --- Profile Management ---
    window.toggleEditProfile = () => {
        const editCard = document.getElementById('profile-edit-card');
        if (editCard) {
            const isHidden = editCard.style.display === 'none';
            editCard.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                editCard.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            
            const name = formData.get('name');
            const position = formData.get('position');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const bio = formData.get('bio');

            // Save to localStorage
            const data = getAppData();
            data.adminProfile = data.adminProfile || {};
            data.adminProfile.name = name;
            data.adminProfile.position = position;
            data.adminProfile.email = email;
            data.adminProfile.phone = phone;
            data.adminProfile.bio = bio;
            saveAppData(data);
            
            // Update UI elements in real-time
            window.initAdminProfile();

            alert('Profile updated successfully!');
            window.toggleEditProfile();
        };
    }

    // --- Profile Avatar Upload ---
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    
                    // Update main profile display
                    const profileImg = document.getElementById('profile-display-img');
                    if (profileImg) profileImg.src = base64Image;
                    
                    // Update topbar avatar
                    const topbarAvatars = document.querySelectorAll('.avatar');
                    topbarAvatars.forEach(img => img.src = base64Image);
                    
                    // Save to localStorage for persistence
                    const data = getAppData();
                    data.adminProfile = data.adminProfile || {};
                    data.adminProfile.avatar = base64Image;
                    saveAppData(data);
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // --- Settings Management ---
    function initSettings() {
        if (!window.location.pathname.includes('admin-settings.html')) return;
        
        const data = getAppData();
        const stats = data.stats;
        const profile = data.adminProfile || {};
        
        // Populate Stats
        const projectsInput = document.getElementById('set-projects');
        const clientsInput = document.getElementById('set-clients');
        const servicesInput = document.getElementById('set-services');
        const satisfactionInput = document.getElementById('set-satisfaction');
        
        if (projectsInput) projectsInput.value = stats.projects;
        if (clientsInput) clientsInput.value = stats.clients;
        if (servicesInput) servicesInput.value = stats.services;
        if (satisfactionInput) satisfactionInput.value = stats.satisfaction;

        // Populate Site Settings
        const companyInput = document.getElementById('set-company-name');
        const emailInput = document.getElementById('set-support-email');
        const phoneInput = document.getElementById('set-support-phone');
        
        if (companyInput) companyInput.value = profile.companyName || 'OneTap Solution';
        if (emailInput) emailInput.value = profile.email || 'hello@onetapsolution.com';
        if (phoneInput) phoneInput.value = profile.phone || '+1 (555) 123-4567';

        // Save site settings form
        const siteForm = document.getElementById('site-settings-form');
        if (siteForm) {
            siteForm.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(siteForm);
                data.adminProfile = data.adminProfile || {};
                data.adminProfile.companyName = formData.get('companyName');
                data.adminProfile.email = formData.get('supportEmail');
                data.adminProfile.phone = formData.get('supportPhone');
                saveAppData(data);

                const btn = siteForm.querySelector('button');
                btn.innerHTML = '<i class="fas fa-check"></i> Saved';
                btn.style.background = 'var(--success)';
                setTimeout(() => {
                    btn.innerHTML = 'Save Site Settings';
                    btn.style.background = '';
                }, 2000);
            };
        }
        
        // Save stats form
        const statsForm = document.getElementById('stats-settings-form');
        if (statsForm) {
            statsForm.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(statsForm);
                data.stats = {
                    projects: parseInt(formData.get('projects')),
                    clients: parseInt(formData.get('clients')),
                    services: parseInt(formData.get('services')),
                    satisfaction: parseInt(formData.get('satisfaction'))
                };
                saveAppData(data);
                
                const btn = statsForm.querySelector('button');
                btn.innerHTML = '<i class="fas fa-check"></i> Updated';
                btn.style.background = 'var(--success)';
                setTimeout(() => {
                    btn.innerHTML = 'Update Counters';
                    btn.style.background = '';
                }, 2000);
            };
        }
    }

    initSettings();

    // --- Message Management ---
    function initMessages(query = '') {
        if (!window.location.pathname.includes('admin-messages.html')) return;
        
        const messages = getAppData().messages;
        const inboxList = document.querySelector('.card-body.p-0'); // Inbox list container
        
        if (inboxList) {
            let filteredMessages = messages;
            if (query) {
                filteredMessages = messages.filter(m => 
                    m.name.toLowerCase().includes(query) || 
                    m.subject.toLowerCase().includes(query) ||
                    m.message.toLowerCase().includes(query)
                );
            }

            if (filteredMessages.length === 0) {
                inboxList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-gray);">No messages found</p>';
                return;
            }

            inboxList.innerHTML = filteredMessages.map(msg => `
                <div class="notification-item ${msg.unread ? 'unread' : ''}" onclick="window.viewMessage(${msg.id})">
                    <div class="icon-circle bg-primary-light"><i class="fas fa-envelope text-primary"></i></div>
                    <div class="notification-info">
                        <p>${msg.name}</p>
                        <span style="display:block; font-size: 12px;">${msg.subject}</span>
                        <span>${msg.date}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    window.viewMessage = (id) => {
        const data = getAppData();
        const msg = data.messages.find(m => m.id === id);
        if (!msg) return;

        // Update UI
        const detailCard = document.querySelectorAll('.card')[1]; // Second card is detail
        if (detailCard) {
            detailCard.innerHTML = `
                <div class="card-header"><h3>Message Detail</h3></div>
                <div class="card-body">
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h4 style="color: var(--white); margin-bottom: 4px;">${msg.subject}</h4>
                                <p style="color: var(--text-gray); font-size: 14px;">From: ${msg.name} (${msg.email})</p>
                            </div>
                            <span class="badge ${msg.replied ? 'badge-success' : 'badge-primary'}">${msg.replied ? 'Replied' : 'Pending'}</span>
                        </div>
                    </div>
                    <div class="message-bubble" style="margin-bottom: 20px;">
                        <p>${msg.message}</p>
                        <span style="display: block; font-size: 11px; margin-top: 10px; opacity: 0.6;">Received: ${msg.date}</span>
                    </div>

                    ${msg.replied ? `
                        <div class="message-bubble" style="margin-left: 30px; border-left: 3px solid var(--primary-neon); background: rgba(0,255,102,0.05);">
                            <p style="color: var(--primary-neon); font-size: 12px; margin-bottom: 5px;">Admin Reply:</p>
                            <p>${msg.replyContent}</p>
                            <span style="display: block; font-size: 11px; margin-top: 10px; opacity: 0.6;">Sent: ${msg.replyDate}</span>
                        </div>
                    ` : ''}

                    <div id="reply-form-container" style="display: ${msg.replied ? 'none' : 'none'}; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                        <textarea id="admin-reply-text" placeholder="Type your reply to ${msg.name}..." style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--white); padding: 12px; font-family: inherit; margin-bottom: 12px; resize: vertical;" rows="4"></textarea>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary btn-sm" onclick="window.sendReply(${msg.id})">Send Reply</button>
                            <button class="btn btn-outline btn-sm" onclick="document.getElementById('reply-form-container').style.display='none'">Cancel</button>
                        </div>
                    </div>

                    <div class="page-actions" id="message-actions" style="margin-top: 24px;">
                        ${!msg.replied ? `<button class="btn btn-primary" onclick="document.getElementById('reply-form-container').style.display='block'">Reply Message</button>` : ''}
                        <button class="btn btn-outline" onclick="window.deleteMessage(${msg.id})">Delete</button>
                    </div>
                </div>
            `;
        }

        // Mark as read
        msg.unread = false;
        saveAppData(data);
        initMessages();
    };

    window.sendReply = (id) => {
        const replyText = document.getElementById('admin-reply-text').value;
        if (!replyText) return;

        const data = getAppData();
        const msg = data.messages.find(m => m.id === id);
        if (msg) {
            msg.replied = true;
            msg.replyContent = replyText;
            msg.replyDate = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ', Today';
            saveAppData(data);
            window.viewMessage(id);
            alert("Reply sent successfully (Simulated)");
        }
    };

    window.deleteMessage = (id) => {
        const data = getAppData();
        data.messages = data.messages.filter(m => m.id !== id);
        saveAppData(data);
        location.reload();
    };

    initMessages();

    // --- Export Logic ---
    window.exportData = () => {
        const data = getAppData();
        const projects = data.projects || [];
        
        if (projects.length === 0) {
            alert("No data available to export.");
            return;
        }

        // Create CSV Header
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Project Name,Client,Category,Status,Deadline\r\n";

        // Add Data Rows
        projects.forEach(p => {
            const row = [
                `"${p.name}"`,
                `"${p.client}"`,
                `"${p.category}"`,
                `"${p.status}"`,
                `"${p.deadline}"`
            ].join(",");
            csvContent += row + "\r\n";
        });

        // Trigger Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `OneTap_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);
    };

    // --- Window Resize Handler ---

    // --- Chart Data Switching ---
    const chartSelect = document.querySelector('.chart-card .form-select');
    if (chartSelect) {
        chartSelect.onchange = (e) => {
            const timeframe = e.target.value;
            document.querySelectorAll('.chart-card .bar-group');
            
            const chartData = {
                'This Week': {
                    data: [30, 45, 25, 70, 95, 40, 60],
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                'This Month': {
                    data: [45, 65, 85, 55],
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                },
                'This Year': {
                    data: [40, 55, 70, 45, 80, 60, 90, 75, 85, 50, 65, 95],
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            };

            const selected = chartData[timeframe] || chartData['This Month'];
            const container = document.querySelector('.chart-card .css-chart');
            
            const grid = container.querySelector('.chart-grid');
            const axis = container.querySelector('.y-axis');
            container.innerHTML = '';
            container.appendChild(grid);
            container.appendChild(axis);

            selected.data.forEach((val, idx) => {
                const group = document.createElement('div');
                group.className = 'bar-group';
                if (timeframe === 'This Year') group.style.width = '6%';
                else if (timeframe === 'This Month') group.style.width = '20%';
                else group.style.width = '10%';

                const isHighest = val === Math.max(...selected.data);
                
                group.innerHTML = `
                    <div class="bar ${isHighest ? 'accent-bar' : ''}" style="height: ${val}%" data-value="${val}%"></div>
                    <span>${selected.labels[idx]}</span>
                `;
                container.appendChild(group);
            });
        };
    }

    // --- Analytics Range Selection ---
    const rangeBtn = document.getElementById('select-range-btn');
    const rangeModal = document.getElementById('range-modal');
    const closeRange = document.getElementById('close-range-modal');
    const applyRange = document.getElementById('apply-range');
    
    if (rangeBtn && rangeModal) {
        rangeBtn.onclick = () => rangeModal.classList.add('show');
        closeRange.onclick = () => rangeModal.classList.remove('show');
        
        applyRange.onclick = () => {
            const start = document.getElementById('range-start').value;
            const end = document.getElementById('range-end').value;
            
            if (!start || !end) {
                alert("Please select both dates");
                return;
            }

            // Update Button Text
            rangeBtn.innerHTML = `<i class="fas fa-calendar-alt"></i> ${start} - ${end}`;
            
            // Mock Update Chart Data
            const bars = document.querySelectorAll('.css-chart .bar');
            bars.forEach(bar => {
                const randomVal = Math.floor(Math.random() * 70) + 30; // Random 30-100%
                bar.style.height = `${randomVal}%`;
                bar.setAttribute('data-value', (randomVal * 100).toLocaleString());
            });

            rangeModal.classList.remove('show');
        };
    }

    // --- Global Search Logic ---
    let currentSearchQuery = '';

    window.refreshCurrentView = (query = currentSearchQuery) => {
        currentSearchQuery = query;
        if (window.location.pathname.includes('admin-users.html')) initUsers(query);
        else if (window.location.pathname.includes('admin-projects.html')) initProjects(query);
        else if (window.location.pathname.includes('admin-team.html')) initTeam(query);
        else if (window.location.pathname.includes('admin-services.html')) initServices(query);
        else if (window.location.pathname.includes('admin-news.html')) initNews(query);
        else if (window.location.pathname.includes('admin-messages.html')) initMessages(query);
        else if (window.location.pathname.includes('admin.html') && !window.location.pathname.includes('admin-')) initDashboardStats(query);
    };

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            window.refreshCurrentView(e.target.value.toLowerCase());
        };
    }

    // --- URL Action Handler ---
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
        if (window.location.pathname.includes('admin-projects.html')) {
            if (typeof window.addProject === 'function') window.addProject();
        } else if (window.location.pathname.includes('admin-team.html')) {
            if (typeof window.addTeamMember === 'function') window.addTeamMember();
        } else if (window.location.pathname.includes('admin-users.html')) {
            if (typeof window.addUser === 'function') window.addUser();
        } else if (window.location.pathname.includes('admin-services.html')) {
            if (typeof window.addService === 'function') window.addService();
        }
    }
    
    // --- Team Management Logic ---
    function initTeam(query = '') {
        const tableBody = document.getElementById('team-table-body');
        if (!tableBody) return;

        const data = getAppData();
        const team = data.team || [];
        
        const filteredTeam = team.filter(m => 
            m.name.toLowerCase().includes(query.toLowerCase()) || 
            m.role.toLowerCase().includes(query.toLowerCase())
        );

        tableBody.innerHTML = filteredTeam.map(m => `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${m.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}" alt="${m.name}">
                        <div><span class="user-name">${m.name}</span></div>
                    </div>
                </td>
                <td><span class="badge" style="background: rgba(255,255,255,0.1); color: var(--white);">${m.role}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        ${m.linkedin ? `<a href="${m.linkedin}" target="_blank" style="color: var(--text-gray);"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${m.twitter || m.github || m.dribbble ? `<a href="${m.twitter || m.github || m.dribbble}" target="_blank" style="color: var(--text-gray);"><i class="fab fa-${m.twitter ? 'twitter' : (m.github ? 'github' : 'dribbble')}"></i></a>` : ''}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn" onclick="window.editTeamMember(${m.id})"><i class="far fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="window.deleteTeamMember(${m.id})"><i class="far fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.addTeamMember = () => {
        const modal = document.getElementById('team-modal');
        const form = document.getElementById('team-form');
        const title = document.getElementById('modal-title');
        
        if (!modal || !form) return;
        
        title.textContent = 'Add Team Member';
        form.reset();
        document.getElementById('member-id').value = '';
        
        modal.classList.add('show');
    };

    window.closeTeamModal = () => {
        const modal = document.getElementById('team-modal');
        if (modal) modal.classList.remove('show');
    };

    window.editTeamMember = (id) => {
        const data = getAppData();
        const member = data.team.find(m => m.id == id);
        if (!member) return;

        const modal = document.getElementById('team-modal');
        const form = document.getElementById('team-form');
        const title = document.getElementById('modal-title');
        
        title.textContent = 'Edit Team Member';
        document.getElementById('member-id').value = member.id;
        form.name.value = member.name;
        form.role.value = member.role;
        form.linkedin.value = member.linkedin || '';
        form.social2.value = member.twitter || member.github || member.dribbble || '';
        
        modal.classList.add('show');
    };

    window.deleteTeamMember = (id) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        
        const data = getAppData();
        data.team = data.team.filter(m => m.id != id);
        saveAppData(data);
        initTeam();
    };

    const teamForm = document.getElementById('team-form');
    if (teamForm) {
        teamForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(teamForm);
            const memberId = document.getElementById('member-id').value;
            
            const name = formData.get('name');
            const role = formData.get('role');
            const linkedin = formData.get('linkedin');
            const social2 = formData.get('social2');
            
            const imageFile = document.getElementById('member-image-file').files[0];
            
            const handleSave = (imgBase64 = null) => {
                const data = getAppData();
                data.team = data.team || [];
                
                if (memberId) {
                    // Edit existing
                    const index = data.team.findIndex(m => m.id == memberId);
                    if (index !== -1) {
                        data.team[index].name = name;
                        data.team[index].role = role;
                        data.team[index].linkedin = linkedin;
                        // Guess social platform from URL
                        if (social2.includes('github')) {
                            data.team[index].github = social2;
                            delete data.team[index].twitter;
                            delete data.team[index].dribbble;
                        } else if (social2.includes('dribbble')) {
                            data.team[index].dribbble = social2;
                            delete data.team[index].twitter;
                            delete data.team[index].github;
                        } else {
                            data.team[index].twitter = social2;
                            delete data.team[index].github;
                            delete data.team[index].dribbble;
                        }
                        if (imgBase64) data.team[index].image = imgBase64;
                    }
                } else {
                    // Add new
                    const newMember = {
                        id: Date.now(),
                        name,
                        role,
                        linkedin,
                        image: imgBase64 || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'
                    };
                    if (social2.includes('github')) newMember.github = social2;
                    else if (social2.includes('dribbble')) newMember.dribbble = social2;
                    else newMember.twitter = social2;
                    
                    data.team.push(newMember);
                }
                
                saveAppData(data);
                window.closeTeamModal();
                initTeam();
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (event) => handleSave(event.target.result);
                reader.readAsDataURL(imageFile);
            } else {
                handleSave();
            }
        };
    }

    // Call initTeam if on team page
    if (window.location.pathname.includes('admin-team.html')) {
        initTeam();
    }
    // --- Testimonials Management Logic ---
    function initTestimonials(query = '') {
        const tableBody = document.getElementById('testimonials-table-body');
        if (!tableBody) return;

        const data = getAppData();
        const testimonials = data.testimonials || [];
        
        const filtered = testimonials.filter(t => 
            t.name.toLowerCase().includes(query.toLowerCase()) || 
            t.role.toLowerCase().includes(query.toLowerCase()) ||
            t.review.toLowerCase().includes(query.toLowerCase())
        );

        tableBody.innerHTML = filtered.map(t => `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${t.img || 'https://via.placeholder.com/40'}" alt="${t.name}">
                        <div><span class="user-name">${t.name}</span></div>
                    </div>
                </td>
                <td><span class="badge" style="background: rgba(255,255,255,0.1); color: var(--white);">${t.role}</span></td>
                <td><p style="font-size: 13px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.review}</p></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn" onclick="window.editTestimonial(${t.id})"><i class="far fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="window.deleteTestimonial(${t.id})"><i class="far fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.addTestimonial = () => {
        const modal = document.getElementById('testimonial-modal');
        const form = document.getElementById('testimonial-form');
        const title = document.getElementById('modal-title');
        
        if (!modal || !form) return;
        
        title.textContent = 'Add Testimonial';
        form.reset();
        document.getElementById('testimonial-id').value = '';
        
        modal.classList.add('show');
    };

    window.closeTestimonialModal = () => {
        const modal = document.getElementById('testimonial-modal');
        if (modal) modal.classList.remove('show');
    };

    window.editTestimonial = (id) => {
        const data = getAppData();
        const t = data.testimonials.find(item => item.id == id);
        if (!t) return;

        const modal = document.getElementById('testimonial-modal');
        const form = document.getElementById('testimonial-form');
        const title = document.getElementById('modal-title');
        
        title.textContent = 'Edit Testimonial';
        document.getElementById('testimonial-id').value = t.id;
        form.name.value = t.name;
        form.role.value = t.role;
        form.review.value = t.review;
        
        modal.classList.add('show');
    };

    window.deleteTestimonial = (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        
        const data = getAppData();
        data.testimonials = data.testimonials.filter(t => t.id != id);
        saveAppData(data);
        initTestimonials();
    };

    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(testimonialForm);
            const tId = document.getElementById('testimonial-id').value;
            
            const name = formData.get('name');
            const role = formData.get('role');
            const review = formData.get('review');
            const imageFile = document.getElementById('testimonial-image-file').files[0];
            
            const handleSave = (imgBase64 = null) => {
                const data = getAppData();
                data.testimonials = data.testimonials || [];
                
                if (tId) {
                    const index = data.testimonials.findIndex(t => t.id == tId);
                    if (index !== -1) {
                        data.testimonials[index].name = name;
                        data.testimonials[index].role = role;
                        data.testimonials[index].review = review;
                        if (imgBase64) data.testimonials[index].img = imgBase64;
                    }
                } else {
                    const newT = {
                        id: Date.now(),
                        name,
                        role,
                        review,
                        img: imgBase64 || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                    };
                    data.testimonials.push(newT);
                }
                
                saveAppData(data);
                window.closeTestimonialModal();
                initTestimonials();
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (event) => handleSave(event.target.result);
                reader.readAsDataURL(imageFile);
            } else {
                handleSave();
            }
        };
    }

    // Call initTestimonials if on testimonials page
    if (window.location.pathname.includes('admin-testimonials.html')) {
        initTestimonials();
    }
});
