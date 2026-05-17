import { useState } from 'react';
import { 
    LineChart, 
    ArrowUpRight, ArrowDownRight, 
    Smartphone, Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
    const mainStats = [
        { label: 'Avg. Session Duration', value: '4m 32s', change: '+12%', isPositive: true },
        { label: 'Bounce Rate', value: '42.5%', change: '-5%', isPositive: true },
        { label: 'Conversion Rate', value: '3.8%', change: '+0.4%', isPositive: true },
        { label: 'New Visitors', value: '842', change: '+18%', isPositive: true },
    ];

    const platforms = [
        { name: 'Mobile', value: 65, icon: <Smartphone size={16} />, color: 'bg-[#04C244]' },
        { name: 'Desktop', value: 30, icon: <Monitor size={16} />, color: 'bg-blue-500' },
        { name: 'Tablet', value: 5, icon: <Smartphone size={16} />, color: 'bg-amber-500' },
    ];

    // Generate stable random heights for the chart using state initializer (pure)
    const [barHeights] = useState(() => 
        Array.from({ length: 24 }).map(() => ({
            h1: Math.random() * 80 + 20,
            h2: Math.random() * 60 + 10
        }))
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Traffic Analytics</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Deep dive into your website performance and audience</p>
            </div>

            {/* Performance Over Time Placeholder */}
            <div className="bg-[#0A0C10] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#04C244]/10 text-[#04C244] rounded-2xl"><LineChart size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Visitor Traffic</h3>
                            <p className="text-xs text-slate-500 font-medium">Monthly unique visitors and page views</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#04C244]"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Unique Visitors</span>
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Views</span>
                    </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-1 px-4 relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        {[1,2,3,4,5].map(i => <div key={i} className="border-t border-white/10 w-full h-0"></div>)}
                    </div>
                    
                    {/* Fake Chart Bars */}
                    {barHeights.map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group/bar relative h-full max-w-[20px]">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${bar.h1}%` }}
                                transition={{ duration: 1, delay: i * 0.02 }}
                                className="w-full bg-blue-500/30 rounded-t-sm group-hover/bar:bg-blue-500 transition-colors"
                            ></motion.div>
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${bar.h2}%` }}
                                transition={{ duration: 1, delay: 0.2 + (i * 0.02) }}
                                className="w-full bg-[#04C244]/40 rounded-t-sm group-hover/bar:bg-[#04C244] transition-colors"
                            ></motion.div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-6 px-4">
                    {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                        <span key={m} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m}</span>
                    ))}
                </div>
            </div>

            {/* Stats and Device Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    {mainStats.map((stat, i) => (
                        <div key={i} className="bg-[#0A0C10] border border-white/5 rounded-[32px] p-8 hover:border-[#04C244]/10 transition-all group">
                            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h4>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-bold text-white group-hover:text-[#04C244] transition-colors">{stat.value}</p>
                                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#0A0C10] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Device Distribution</h3>
                        <p className="text-xs text-slate-500 font-medium mb-8">Where your traffic is coming from</p>
                        
                        <div className="space-y-6">
                            {platforms.map((p, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            {p.icon}
                                            <span>{p.name}</span>
                                        </div>
                                        <span className="text-slate-500">{p.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${p.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className={`h-full rounded-full ${p.color}`}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <button className="text-[10px] font-bold text-[#04C244] uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
