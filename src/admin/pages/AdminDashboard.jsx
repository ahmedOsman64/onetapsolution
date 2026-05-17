import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
    Users, Briefcase, Eye, Mail, ArrowUpRight, 
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { data } = useAdmin();
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Users', value: data.users.length, icon: <Users size={20} />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Active Projects', value: data.projects.length, icon: <Briefcase size={20} />, color: 'bg-[#04C244]', trend: '+5%' },
        { label: 'Total Visitors', value: data.visitorCount.toLocaleString(), icon: <Eye size={20} />, color: 'bg-amber-500', trend: '+28%' },
        { label: 'Unread Messages', value: data.messages.filter(m => m.unread).length, icon: <Mail size={20} />, color: 'bg-red-500', trend: '-2%' },
    ];

    const [activeTab, setActiveTab] = useState('Week');

    const chartDataMap = {
        'Day': [
            { day: '08:00', value: 20 },
            { day: '10:00', value: 35 },
            { day: '12:00', value: 60 },
            { day: '14:00', value: 85 },
            { day: '16:00', value: 45 },
            { day: '18:00', value: 55 },
            { day: '20:00', value: 30 },
        ],
        'Week': [
            { day: 'Mon', value: 40 },
            { day: 'Tue', value: 65 },
            { day: 'Wed', value: 45 },
            { day: 'Thu', value: 90 },
            { day: 'Fri', value: 55 },
            { day: 'Sat', value: 80 },
            { day: 'Sun', value: 70 },
        ],
        'Month': [
            { day: 'Jan', value: 30 },
            { day: 'Feb', value: 45 },
            { day: 'Mar', value: 55 },
            { day: 'Apr', value: 85 },
            { day: 'May', value: 95 },
            { day: 'Jun', value: 70 },
            { day: 'Jul', value: 80 },
        ]
    };

    const currentChartData = chartDataMap[activeTab];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-all">
                        Export Report
                    </button>
                    <button 
                        onClick={() => navigate('/admin/projects')}
                        className="px-4 py-2 bg-[#04C244] text-black rounded-xl text-sm font-bold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/10"
                    >
                        + New Project
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0A0C10] border border-white/5 rounded-[24px] p-6 hover:border-[#04C244]/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color}/10 text-${stat.color.split('-')[1]}-500`}>
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Revenue Chart (Upgraded) */}
                <div className="lg:col-span-2 bg-[#0A0C10] border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#04C244]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Revenue Overview</h3>
                            <p className="text-slate-500 text-xs font-medium">{activeTab}ly performance analytics & growth</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                            {['Day', 'Week', 'Month'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab ? 'bg-[#04C244] text-black shadow-lg shadow-[#04C244]/20' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-72 w-full mt-4">
                        {/* Y-Axis Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className="flex items-center gap-4 w-full">
                                    <span className="text-[10px] font-bold text-slate-600 w-6 text-right">{val}%</span>
                                    <div className="flex-1 border-t border-white/5"></div>
                                </div>
                            ))}
                        </div>

                        {/* Bars Container */}
                        <div className="absolute inset-0 left-10 flex items-end justify-between gap-3 px-2 h-[calc(100%-12px)]">
                            {currentChartData.map((item, i) => (
                                <div key={`${activeTab}-${i}`} className="flex-1 flex flex-col justify-end h-full group relative">
                                    {/* Bar with Gradient */}
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.value}%` }}
                                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: i * 0.05 }}
                                        className={`w-full max-w-[32px] mx-auto rounded-t-xl relative group-hover:brightness-125 transition-all cursor-pointer ${
                                            i === 3 
                                            ? 'bg-linear-to-t from-[#04C244] to-emerald-400 shadow-[0_0_20px_rgba(4,194,68,0.2)]' 
                                            : 'bg-linear-to-t from-white/10 to-white/20 group-hover:from-white/20 group-hover:to-white/30'
                                        }`}
                                    >
                                        {/* Hover Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                            ${item.value}k Revenue
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                        </div>
                                    </motion.div>
                                    
                                    {/* X-Axis Label */}
                                    <div className="absolute -bottom-8 left-0 right-0 text-center">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${i === 3 ? 'text-[#04C244]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            {item.day}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-[#0A0C10] border border-white/5 rounded-[32px] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-white tracking-tight">Recent Projects</h3>
                        <button className="p-2 rounded-xl hover:bg-white/5 text-slate-500">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {data.projects.slice(0, 4).map((p, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#04C244] group-hover:bg-[#04C244]/10 transition-colors">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-[#04C244] transition-colors">{p.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{p.client}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${p.status === 'Live' ? 'bg-[#04C244]/10 text-[#04C244]' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                        <span>View All Projects</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
