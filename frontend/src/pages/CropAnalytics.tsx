import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Cloud, Activity, AlertTriangle, Sprout, Droplets, Gauge, Compass, Leaf, Bug, Beaker, Briefcase
} from "lucide-react";
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CropAnalytics = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/crop/analytics", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch crop analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin mb-4" />
            <p className="font-black text-nature-700 tracking-widest uppercase text-xs">Generating Crop Intelligence...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Fixed Left Sidebar Navigation */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <SidebarItem icon={<Activity />} label="Crop Analytics" active />
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label="Risk Center" /></Link>
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
                            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125 saturate-[1.2]"
                            alt="Crop Field"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-nature-950 via-nature-900/40 to-transparent"></div>
                        <div className="relative z-10 h-full p-12 flex flex-col justify-center">
                            <motion.span
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-[10px] font-black text-nature-400 uppercase tracking-[0.3em] mb-4"
                            >
                                Biological Insights
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl font-black text-white tracking-tight leading-tight"
                            >
                                Crop <span className="text-nature-500">Intelligence.</span>
                            </motion.h2>
                            <p className="text-white/60 mt-4 font-bold text-lg max-w-xl">
                                Real-time monitoring of photosynthesis velocity, cellular hydration, and developmental phenology.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <AnalyticsCard icon={<Sprout className="w-6 h-6 text-nature-600" />} label="Crop Health" value={data?.crop_health} desc="NDVI Satellite Index" color="nature" delay={0.1} />
                    <AnalyticsCard icon={<Droplets className="w-6 h-6 text-blue-600" />} label="Soil Moisture" value={`${data?.soil_moisture}%`} desc="Volumetric Water Content" color="blue" delay={0.2} />
                    <AnalyticsCard icon={<Compass className="w-6 h-6 text-amber-600" />} label="Growth Stage" value={data?.growth_stage} desc="Phenol-Log Development" color="amber" delay={0.3} />
                    <AnalyticsCard icon={<Gauge className="w-6 h-6 text-purple-600" />} label="Irrigation" value={data?.irrigation_status} desc="Hydro-Requirement Status" color="purple" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="modern-card p-8 bg-white"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800">Growth Velocity Trend</h3>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-nature-500" />
                                <span className="text-[10px] font-black text-nature-600 uppercase tracking-widest">Active Monitoring</span>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.growth_trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                    <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={4} dot={{ r: 6, fill: '#059669' }} activeDot={{ r: 8, strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="modern-card p-8 bg-white"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800">Hydration Levels (30cm Depth)</h3>
                            <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Volumetric Data</span>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.soil_moisture_levels}>
                                    <defs>
                                        <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="moisture" stroke="#2563eb" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={4} />
                                </AreaChart>
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

const AnalyticsCard = ({ icon, label, value, desc, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="modern-card p-6 bg-white"
    >
        <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${color === 'nature' ? 'bg-nature-50 text-nature-600' :
                color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    color === 'amber' ? 'bg-amber-50 text-amber-600' :
                        'bg-purple-50 text-purple-600'
                }`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
                <h4 className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{desc}</p>
            </div>
        </div>
    </motion.div>
);

export default CropAnalytics;
