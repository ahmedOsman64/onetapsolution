import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Globe, Shield, Bell, 
    Smartphone, Database, Save, CheckCircle2, 
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    useAdmin();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage global configurations and security</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#04C244] text-black rounded-xl text-sm font-bold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/10 disabled:opacity-50"
                >
                    {isSaving ? <span className="flex items-center gap-2 italic"><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Saving...</span> : <><Save size={18} /><span>Save Configuration</span></>}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs */}
                <div className="lg:w-64 space-y-2">
                    {[
                        { id: 'general', label: 'General', icon: <Globe size={18} /> },
                        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
                        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                        { id: 'appearance', label: 'Appearance', icon: <Smartphone size={18} /> },
                        { id: 'backup', label: 'Backup & Data', icon: <Database size={18} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                ${activeTab === tab.id 
                                    ? 'bg-[#04C244]/10 text-[#04C244] border border-[#04C244]/20' 
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 space-y-8">
                    {activeTab === 'general' && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0A0C10] border border-white/5 rounded-[40px] p-10 space-y-8"
                        >
                            <section>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Globe className="text-[#04C244]" size={20} />
                                    Company Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Website Name</label>
                                        <input type="text" defaultValue="OneTap Solution" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company Email</label>
                                        <input type="email" defaultValue="info@onetapsolution.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                                        <input type="text" defaultValue="+252 61 9586339" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Office Location</label>
                                        <input type="text" defaultValue="Mogadishu, Somalia" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                </div>
                            </section>

                            <section className="pt-8 border-t border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6">Contact Channels</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/1 border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CheckCircle2 size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-white">WhatsApp Integration</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active · Connected to +252619586339</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-red-500 hover:underline">Disconnect</button>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0A0C10] border border-white/5 rounded-[40px] p-10 space-y-8"
                        >
                            <section>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Lock className="text-[#04C244]" size={20} />
                                    Password Management
                                </h3>
                                <div className="max-w-md space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                        <input type="password" placeholder="Min. 8 characters" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#04C244]/30 transition-all text-sm" />
                                    </div>
                                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all">Update Password</button>
                                </div>
                            </section>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
