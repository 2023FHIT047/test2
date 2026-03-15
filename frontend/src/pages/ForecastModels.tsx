import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Cloud, Activity, AlertTriangle,
    ThermometerSun, Droplets, Wind, CloudRain, Leaf, Bug, Beaker, Briefcase
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const ForecastModels = () => {
    const { t } = useLanguage();
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/weather/farm-forecast/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeatherData(res.data);
            } catch (err) {
                console.error("Failed to fetch forecast", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-16 h-16 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin mb-4" />
            <p className="font-black text-nature-700 tracking-widest uppercase text-xs">{t('forecast.analyzing')}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Fixed Left Sidebar Navigation */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label={t('dashboard.sidebar.dashboard')} /></Link>
                <SidebarItem icon={<Cloud />} label={t('dashboard.sidebar.forecast')} active />
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label={t('dashboard.sidebar.analytics')} /></Link>
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label={t('dashboard.sidebar.risk')} /></Link>
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label={t('dashboard.sidebar.advisory')} /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label={t('dashboard.sidebar.irrigation')} /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label={t('dashboard.sidebar.disease')} /></Link>
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label={t('dashboard.sidebar.pests')} /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label={t('dashboard.sidebar.labor')} /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 p-10">
                <header className="mb-8">
                    <div className="modern-card overflow-hidden h-64 relative mb-12 border-none">
                        <img
                            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125"
                            alt="Satellite View"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
                        <div className="relative z-10 h-full p-12 flex flex-col justify-center">
                            <motion.span
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-[10px] font-black text-nature-400 uppercase tracking-[0.3em] mb-4"
                            >
                                {t('forecast.satellite_intel')}
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl font-black text-white tracking-tight leading-tight"
                            >
                                {t('forecast.title').split(' ')[0]} <span className="text-nature-500">{t('forecast.title').split(' ').slice(1).join(' ')}.</span>
                            </motion.h2>
                            <p className="text-white/60 mt-4 font-bold text-lg max-w-xl">
                                {t('forecast.subtitle')}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <ForecastCard icon={<ThermometerSun className="w-6 h-6 text-orange-500" />} label={t('weather.temperature')} value={`${weatherData?.current?.temperature}°C`} desc={t('forecast.temp_peak_desc')} color="orange" delay={0.1} />
                    <ForecastCard icon={<CloudRain className="w-6 h-6 text-blue-500" />} label={t('weather.precip')} value={`${weatherData?.current?.rain_chance}%`} desc={t('forecast.rain_prob_desc')} color="blue" delay={0.2} />
                    <ForecastCard icon={<Droplets className="w-6 h-6 text-cyan-500" />} label={t('weather.humidity')} value={`${weatherData?.current?.humidity}%`} desc={t('forecast.humidity_desc')} color="cyan" delay={0.3} />
                    <ForecastCard icon={<Wind className="w-6 h-6 text-slate-500" />} label={t('weather.wind_speed')} value={`${weatherData?.current?.wind_speed} km/h`} desc={t('forecast.wind_vector_desc')} color="slate" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="modern-card p-8 bg-white"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800">{t('forecast.temp_trajectory')}</h3>
                            <span className="text-[10px] font-black px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 uppercase tracking-widest">{t('forecast.dynamic_prediction')}</span>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weatherData?.hourly_trend}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f3f4f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f3f4f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                                </AreaChart>
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
                            <h3 className="text-xl font-black text-slate-800">{t('forecast.rain_prob_chart')}</h3>
                            <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase tracking-widest">{t('forecast.atmospheric_data')}</span>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weatherData?.hourly_trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="rain_prob" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={30} />
                                </BarChart>
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

const ForecastCard = ({ icon, label, value, desc, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="modern-card p-6 bg-white"
    >
        <div className={`p-4 rounded-2xl w-fit mb-6 ${color === 'orange' ? 'bg-orange-50 text-orange-600' :
            color === 'blue' ? 'bg-blue-50 text-blue-600' :
                color === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
                    'bg-slate-50 text-slate-600'
            }`}>
            {icon}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-3xl font-black text-slate-900 my-2 tracking-tight">{value}</h4>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">{desc}</p>
    </motion.div>
);

export default ForecastModels;
