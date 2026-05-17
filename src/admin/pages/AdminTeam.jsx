import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
    Plus, Edit2, Trash2, GitBranch, Link, 
    AtSign, User, Camera, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTeam = () => {
    const { data, deleteFromCollection, updateCollection } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        role: '', 
        image: '', 
        linkedin: '', 
        twitter: '', 
        github: '' 
    });

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({ ...member });
        } else {
            setEditingMember(null);
            setFormData({ name: '', role: '', image: '', linkedin: '', twitter: '', github: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMember) {
            updateCollection('team', formData, editingMember.id);
        } else {
            updateCollection('team', formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Team Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage core team members displayed on the about page</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#04C244] text-black rounded-xl text-sm font-bold hover:bg-[#03a837] transition-all shadow-lg shadow-[#04C244]/10"
                >
                    <Plus size={18} />
                    <span>Add Member</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.team.map((m, i) => (
                    <motion.div 
                        key={m.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-[#0A0C10] border border-white/5 rounded-[32px] overflow-hidden group"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={m.image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'} 
                                alt={m.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#0A0C10] via-transparent to-transparent"></div>
                            
                            {/* Action Overlay */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleOpenModal(m)}
                                    className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-[#04C244] hover:bg-[#04C244] hover:text-black transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => { if(confirm('Remove team member?')) deleteFromCollection('team', m.id) }}
                                    className="p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h3 className="text-lg font-bold text-white group-hover:text-[#04C244] transition-colors mb-1">{m.name}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">{m.role}</p>
                            
                            <div className="flex items-center justify-center gap-3">
                                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><Link size={14} /></a>}
                                {m.twitter && <a href={m.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><AtSign size={14} /></a>}
                                {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all"><GitBranch size={14} /></a>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0A0C10] border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden relative z-10 shadow-2xl my-auto"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{editingMember ? 'Edit Member' : 'Add Team Member'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="space-y-2 text-center pb-4">
                                    <div className="relative w-24 h-24 mx-auto group">
                                        <div className="w-full h-full rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <User size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-[#04C244] text-black rounded-xl hover:scale-110 transition-transform shadow-lg">
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Profile Picture URL</p>
                                    <input 
                                        type="url" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[11px] text-slate-400 focus:outline-none focus:border-[#04C244]/50"
                                        placeholder="Paste image URL here..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#04C244]/50 transition-all"
                                            placeholder="Member Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Job Role</label>
                                        <input 
                                            type="text" 
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#04C244]/50 transition-all"
                                            placeholder="e.g. Lead Designer"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Social Links (Optional)</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="relative group">
                                            <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#04C244]" />
                                            <input 
                                                type="url" 
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-[#04C244]/50 transition-all"
                                                placeholder="LinkedIn Profile URL"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#04C244]" />
                                            <input 
                                                type="url" 
                                                value={formData.twitter}
                                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-[#04C244]/50 transition-all"
                                                placeholder="Twitter / X Profile URL"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3.5 bg-[#04C244] text-black rounded-2xl text-xs font-bold hover:bg-[#03a837] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} />
                                        <span>Save Member</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTeam;
