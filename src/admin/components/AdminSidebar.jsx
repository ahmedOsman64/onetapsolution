import { NavLink, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Briefcase, UserPlus, Star, 
    Mail, Settings, Newspaper, PieChart, LogOut, X, 
    Settings2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAdmin();

    const menuItems = [
        { title: 'Main Menu', type: 'header' },
        { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { title: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { title: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
        { title: 'Team', path: '/admin/team', icon: <UserPlus size={20} /> },
        { title: 'Testimonials', path: '/admin/testimonials', icon: <Star size={20} /> },
        { title: 'Messages', path: '/admin/messages', icon: <Mail size={20} />, badge: true },
        
        { title: 'Management', type: 'header' },
        { title: 'Services', path: '/admin/services', icon: <Settings size={20} /> },
        { title: 'News', path: '/admin/news', icon: <Newspaper size={20} /> },
        { title: 'Analytics', path: '/admin/analytics', icon: <PieChart size={20} /> },
        
        { title: 'Settings', type: 'header' },
        { title: 'General', path: '/admin/settings', icon: <Settings2 size={20} /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside className={`fixed top-0 left-0 bottom-0 bg-[#0A0C10] border-r border-white/5 z-50 transition-all duration-300 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/assets/images/logo.png" alt="Logo" className="h-8 w-auto" />
                            <span className="text-white font-bold text-lg tracking-tight">OneTap <span className="text-[#04C244]">Admin</span></span>
                        </Link>
                        <button onClick={toggleSidebar} className="md:hidden text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                        <ul className="space-y-1">
                            {menuItems.map((item, idx) => (
                                item.type === 'header' ? (
                                    <li key={idx} className="pt-4 pb-2 px-3">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.title}</span>
                                    </li>
                                ) : (
                                    <li key={idx}>
                                        <NavLink
                                            to={item.path}
                                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                            className={({ isActive }) => `
                                                flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                                                ${isActive ? 'bg-[#04C244] text-black font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`${isActive ? 'text-black' : 'text-[#04C244]'} group-hover:scale-110 transition-transform`}>
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-sm">{item.title}</span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-[#04C244]'} animate-pulse`}></span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                )
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5">
                        <button 
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
