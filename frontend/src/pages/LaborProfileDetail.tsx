import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft, Phone, MapPin, Briefcase, User,
    Star, Calendar, ShieldCheck, MessageSquare, Loader2, LayoutDashboard, Cloud, Activity, AlertTriangle, Leaf, Bug, Beaker, Droplets
} from "lucide-react";
import axios from "axios";

const LaborProfileDetail = () => {
    const { id } = useParams();
    const [labor, setLabor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLaborDetail = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8000/api/labor/detail/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLabor(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLaborDetail();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-nature-600 animate-spin" />
            </div>
        );
    }

    if (!labor) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-10">
                <div className="modern-card p-12 bg-white max-w-md w-full">
                    <User className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Profile Not Found</h2>
                    <p className="text-slate-500 font-bold mb-8 italic">The expert profile you are looking for might have been moved or removed.</p>
                    <Link to="/find-labor" className="btn-primary !py-4 w-full flex items-center justify-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Standard Sidebar */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label="Crop Analytics" /></Link>
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label="Risk Center" /></Link>
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label="Crop Advisory" /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label="Crop Disease Detection" /></Link>
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label="Pest Detection" /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label="Find Labor" active /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 bg-transparent">
                {/* Header Profile Section */}
                <div className="relative">
                    <div className="h-64 bg-slate-900 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-nature-950 via-nature-900 to-slate-900 opacity-90" />
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent" />
                    </div>

                    <div className="max-w-5xl mx-auto px-10 relative -mt-32 pb-20">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-48 h-48 bg-white rounded-[3rem] shadow-2xl p-2 flex-shrink-0 relative group"
                            >
                                <div className="w-full h-full bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 overflow-hidden relative">
                                    <User className="w-24 h-24" />
                                    <div className="absolute inset-0 bg-nature-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-nature-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-xl">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            </motion.div>

                            {/* Info Section */}
                            <div className="flex-1 pt-4 text-center md:text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{labor.name}</h1>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${labor.availability === 'available'
                                            ? 'bg-nature-50 text-nature-600 border-nature-200'
                                            : 'bg-amber-50 text-amber-600 border-amber-200'
                                            }`}>
                                            STATUS: {labor.availability}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-bold mb-8">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 italic transition-transform hover:scale-105">
                                            <MapPin className="w-4 h-4 text-nature-600" /> {labor.village}, {labor.district}
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 italic transition-transform hover:scale-105">
                                            <Briefcase className="w-4 h-4 text-nature-600" /> {labor.experience} Years Exp.
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 italic transition-transform hover:scale-105">
                                            <Star className="w-4 h-4 text-amber-500" /> 4.9 Expert Rating
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={`tel:${labor.phone}`}
                                            className="px-10 py-5 bg-nature-600 hover:bg-nature-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-nature-600/30 flex items-center justify-center gap-4 active:scale-95 group"
                                        >
                                            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" /> CALL EXPERT LABOR
                                        </a>
                                        <button className="px-10 py-5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4 active:scale-95 group">
                                            <MessageSquare className="w-5 h-5 text-nature-600 group-hover:scale-110 transition-transform" /> SEND INQUIRY
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Detailed Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="modern-card p-10 bg-white">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-8 border-b border-nature-100 pb-4">Professional Intelligence Dossier</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Core Location</p>
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{labor.village}</p>
                                                <p className="text-slate-500 font-bold italic">{labor.district}, {labor.state}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Verified Phone</p>
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="font-black text-slate-800 text-lg tracking-widest">{labor.phone}</p>
                                                <p className="text-slate-500 font-bold italic">Active Primary Contact</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-8 bg-nature-50 rounded-[2rem] border-2 border-nature-100 border-dashed">
                                        <p className="text-xs font-black text-nature-600 uppercase tracking-widest mb-4 italic">Platform Verification Hash</p>
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-8 h-8 text-nature-600" />
                                            <div>
                                                <p className="font-black text-slate-800 uppercase tracking-tighter">AGRO-CERTIFIED EXPERT</p>
                                                <p className="text-[10px] text-nature-700 font-black tracking-[0.2em] mt-0.5">IDENTITY & SKILLSET VERIFIED BY ADMIN</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="modern-card p-10 bg-white">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-6">Expert Specializations</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['Pest Management', 'Irrigation Setup', 'Harvest Optimization', 'Crop Monitoring', 'Organic Farming'].map(skill => (
                                            <span key={skill} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-tight border border-slate-100 hover:border-nature-300 hover:text-nature-700 transition-all cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="modern-card p-8 bg-slate-900 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-nature-600/10 rounded-full blur-3xl" />
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight italic">
                                        <Calendar className="w-5 h-5 text-nature-500" /> Quick Scheduler
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                                            <p className="text-sm font-black text-nature-400">⚡ Fast (Under 2 Hours)</p>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Rate</p>
                                            <p className="text-sm font-black text-nature-400">₹ Negotiable per Day</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-10 py-4 bg-nature-600 hover:bg-nature-500 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-nature-600/20 active:scale-95">
                                        REQUEST ENGAGEMENT
                                    </button>
                                </div>

                                <div className="modern-card p-8 bg-white border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Awareness</h4>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                                            Always verify work details and safety protocols before engaging labor for field operations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false }: any) => (
    <button className={`w-full flex items-center xl:justify-start justify-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${active
        ? 'bg-nature-50 text-nature-700 shadow-sm border border-nature-200/50'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
        <div className={`transition-transform duration-300 ${active ? 'text-nature-600 scale-110' : 'text-slate-400 group-hover:text-nature-600 group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className={`text-sm tracking-tight hidden xl:block ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
);

export default LaborProfileDetail;
