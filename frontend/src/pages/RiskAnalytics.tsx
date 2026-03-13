import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Cloud, Activity, AlertTriangle, Sprout, Leaf, Bug, ShieldAlert, ArrowRight, Beaker, Droplets, Briefcase
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const RiskAnalytics = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/risk/analysis", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch risk analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
            <p className="font-black text-red-600 tracking-widest uppercase text-xs">Simulating Risk Scenarios...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Fixed Left Sidebar Navigation */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label="Crop Analytics" /></Link>
                <SidebarItem icon={<AlertTriangle />} label="Risk Center" active />
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label="Crop Advisory" /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label="Crop Disease Detection" /></Link>
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label="Pest Detection" /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label="Find Labor" /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 p-10">
                <header className="mb-8">
                    <div className="modern-card overflow-hidden h-64 relative mb-12 border-none">
                        <img
                            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125 saturate-0"
                            alt="Risk Background"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900/40 to-transparent"></div>
                        <div className="relative z-10 h-full p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <motion.span
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]"
                                >
                                    Threat Defense Matrix
                                </motion.span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 backdrop-blur-md rounded-full text-red-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
                                    <ShieldAlert className="w-3 h-3" /> System Scanning
                                </div>
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl font-black text-white tracking-tight leading-tight"
                            >
                                Risk Intelligence <span className="text-red-500">Center.</span>
                            </motion.h2>
                            <p className="text-white/60 mt-4 font-bold text-lg max-w-xl">
                                Proactive environmental hazard detection and mitigation strategies powered by the Aegis risk model.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {data?.risks.map((risk: any, i: number) => (
                        <RiskCard
                            key={i}
                            title={risk.type}
                            level={risk.level}
                            desc={risk.description}
                            action={risk.action}
                            delay={i * 0.1}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="modern-card p-10 bg-white"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Risk Trajectory (Weekly)</h3>
                                <p className="text-xs text-slate-400 font-bold mt-1">Aggregated hazard probability index</p>
                            </div>
                            <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100 uppercase tracking-widest">Model 4.2.1</span>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.risk_trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="level" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="modern-card p-10 bg-white"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Atmospheric Impact Surface</h3>
                                <p className="text-xs text-slate-400 font-bold mt-1">Multivariate climate stress analysis</p>
                            </div>
                            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.weather_impact}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="factor" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Impact" dataKey="impact" stroke="#ef4444" strokeWidth={3} fill="#ef4444" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
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

const RiskCard = ({ title, level, desc, action, delay }: any) => {
    const isHigh = level === "High";
    const isMedium = level === "Medium";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className={`modern-card p-6 bg-white border-l-4 ${isHigh ? 'border-l-red-500 shadow-xl shadow-red-500/5' : isMedium ? 'border-l-amber-500' : 'border-l-nature-500'}`}
        >
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none h-8 flex items-center">{title}</h4>
                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-[0.1em] border ${isHigh ? 'bg-red-50 text-red-600 border-red-100' :
                    isMedium ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-nature-50 text-nature-600 border-nature-100'
                    }`}>
                    {level} Risk
                </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mb-6 leading-relaxed flex-1 min-h-[40px]">{desc}</p>
            <div className="pt-5 border-t border-slate-50 relative group/btn">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    Active Countermeasure <ArrowRight className="w-3 h-3 text-nature-500 group-hover/btn:translate-x-1 transition-transform" />
                </p>
                <p className="text-xs text-slate-800 font-black leading-tight">{action}</p>
            </div>
        </motion.div>
    );
};

export default RiskAnalytics;
