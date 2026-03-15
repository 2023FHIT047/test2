import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Calendar as CalendarIcon, Clock, CheckCircle2, Circle, AlertTriangle,
    MapPin, Droplets, ThermometerSun, Sprout,
    Activity, LayoutDashboard, Cloud, Leaf, Beaker, Bug, Briefcase, LogOut, User, Search, Bell, ArrowRight
} from "lucide-react";
import Logo from "../components/Logo";
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';

import { useLanguage } from "../context/LanguageContext";

const FarmingCalendar = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [calendarData, setCalendarData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [completedTasks, setCompletedTasks] = useState<number[]>([]);
    const [weatherData, setWeatherData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const [profileRes, calendarRes, weatherRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8000/api/farming-calendar", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8000/api/weather/farm-forecast/', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                console.log("DEBUG: Profile Response:", profileRes.data);
                console.log("DEBUG: Calendar Response:", calendarRes.data);

                setUser(profileRes.data);
                setWeatherData(weatherRes.data);
                if (calendarRes.data.is_setup_complete && calendarRes.data.tasks?.length > 0) {
                    setCalendarData(calendarRes.data);

                    // Track completed tasks based on status from backend
                    const completed = calendarRes.data.tasks
                        .filter((t: any) => t.status === "Completed")
                        .map((t: any) => t.day);
                    setCompletedTasks(completed);
                } else {
                    console.log("DEBUG: Setup not complete or no tasks. Showing empty state.");
                    setCalendarData({ ...calendarRes.data, tasks: [] });
                }

            } catch (err) {
                console.error("DEBUG: Error fetching calendar data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const toggleTask = (day: number) => {
        if (completedTasks.includes(day)) {
            setCompletedTasks(completedTasks.filter(d => d !== day));
        } else {
            setCompletedTasks([...completedTasks, day]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-nature-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 font-bold">{t('dashboard.calibrating')}</p>
                </div>
            </div>
        );
    }

    const getLifecycleProgress = () => {
        if (!calendarData || !calendarData.tasks.length) return 0;
        const total = calendarData.tasks.length;
        const completed = completedTasks.length;
        return Math.round((completed / total) * 100);
    };

    const todayTask = calendarData?.tasks.find((t: any) => t.day === calendarData.current_day);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 50, y: 20 },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring" as any,
                stiffness: 100,
                damping: 12
            }
        }
    };

    const isToday = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Standard Dashboard Header */}
            <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/40 h-20 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4 group" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <div className="w-12 h-12 bg-nature-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-nature-700/20 group-hover:scale-110 transition-transform duration-500">
                            <Logo size={28} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">KrushiSarthi</span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 shadow-inner rounded-2xl px-5 py-2.5 w-[500px]">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('calendar.search_placeholder')}
                            className="bg-transparent border-none outline-none text-sm text-slate-800 w-full placeholder:text-slate-400 font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white/40 rounded-xl transition-all">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-black text-slate-900">{user?.name}</p>
                                <p className="text-[10px] text-nature-700 font-black uppercase tracking-widest flex items-center gap-1 justify-end">
                                    <MapPin className="w-3 h-3" /> {user?.village || 'Farm'}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-nature-100 rounded-2xl border border-nature-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-nature-700" />
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-3">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex pt-20 max-w-[1600px] mx-auto">
                {/* Fixed Left Sidebar */}
                <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-40 overflow-y-auto no-scrollbar">
                    <SidebarItem icon={<LayoutDashboard />} label={t('dashboard.sidebar.dashboard')} onClick={() => navigate('/dashboard')} />
                    <SidebarItem icon={<CalendarIcon />} label={t('dashboard.sidebar.calendar')} active />
                    <SidebarItem icon={<Cloud />} label={t('dashboard.sidebar.forecast')} onClick={() => navigate('/forecast-models')} />
                    <SidebarItem icon={<Activity />} label={t('dashboard.sidebar.analytics')} onClick={() => navigate('/crop-analytics')} />
                    <SidebarItem icon={<AlertTriangle />} label={t('dashboard.sidebar.risk')} onClick={() => navigate('/risk-analytics')} />
                    <div className="h-px bg-slate-200/50 my-6 mx-4" />
                    <SidebarItem icon={<Leaf />} label={t('dashboard.sidebar.advisory')} onClick={() => navigate('/crop-advisory')} />
                    <SidebarItem icon={<Beaker />} label={t('dashboard.sidebar.disease')} onClick={() => navigate('/disease-detection')} />
                    <SidebarItem icon={<Bug />} label={t('dashboard.sidebar.pests')} onClick={() => navigate('/pest-detection')} />
                    <SidebarItem icon={<Briefcase />} label={t('dashboard.sidebar.labor')} onClick={() => navigate('/find-labor')} />
                </aside>

                <main className="flex-1 ml-0 md:ml-20 xl:ml-72 min-h-screen pt-12 px-10 pb-20">
                    <header className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-nature-100 rounded-2xl">
                                        <CalendarIcon className="w-8 h-8 text-nature-600" />
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('calendar.title')}</h1>
                                </div>
                                <p className="text-slate-500 font-bold text-lg max-w-xl leading-relaxed">
                                    {t('calendar.subtitle') || "Your personalized agricultural timeline based on crop lifecycle and real-time weather data."}
                                </p>
                            </div>

                            {/* Weather Context Widget */}
                            {calendarData?.is_setup_complete && (
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Droplets className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t('weather.rain_chance')}</p>
                                            <p className="text-base font-black text-slate-800">{calendarData?.weather_context.rain_prob}%</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-100" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                            <ThermometerSun className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t('weather.temperature')}</p>
                                            <p className="text-base font-black text-slate-800">{calendarData?.weather_context.temp}°C</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {calendarData?.is_setup_complete && (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-nature-950 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-nature-500/20 transition-all duration-700"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-inner">
                                        <Sprout className="w-10 h-10 text-nature-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-nature-500 uppercase tracking-widest mb-1">{t(`dashboard.crops.${calendarData?.crop.toLowerCase()}`)} {t('calendar.lifecycle')}</p>
                                        <h3 className="text-2xl font-black text-white italic">
                                            {t('calendar.day')} {calendarData?.current_day}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 relative z-10">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('calendar.today')}</p>
                                        <p className="text-lg font-black text-white truncate max-w-[200px]">{todayTask ? todayTask.task : t('calendar.rest_day')}</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10 hidden lg:block" />
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{t('calendar.season_progress')}</p>
                                        <p className="text-2xl font-black text-white italic">{getLifecycleProgress()}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Progress Indicator */}
                    {calendarData?.is_setup_complete && (
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-nature-600" /> {t('calendar.season_progress')}
                                </h3>
                                <span className="text-nature-700 font-black text-xl">{getLifecycleProgress()}%</span>
                            </div>
                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getLifecycleProgress()}%` }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-nature-400 to-nature-600 rounded-full"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                                <span className={getLifecycleProgress() >= 0 ? 'text-nature-600' : ''}>Sowing</span>
                                <span className={getLifecycleProgress() >= 30 ? 'text-nature-600' : ''}>Growth</span>
                                <span className={getLifecycleProgress() >= 70 ? 'text-nature-600' : ''}>Flowering</span>
                                <span className={getLifecycleProgress() >= 100 ? 'text-nature-600' : ''}>Harvest</span>
                            </div>
                        </div>
                    )}

                    {/* Timeline Container */}
                    <div className="relative pl-0 md:pl-28">
                        {!calendarData?.is_setup_complete ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-slate-200 text-center shadow-sm"
                            >
                                <div className="w-24 h-24 bg-nature-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CalendarIcon className="w-12 h-12 text-nature-600" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">{t('calendar.no_calendar_data')}</h3>
                                <p className="text-slate-500 font-bold text-lg mb-10 max-w-md mx-auto">
                                    {calendarData?.message || t('calendar.subtitle')}
                                </p>
                                <button
                                    onClick={() => navigate('/onboarding')}
                                    className="px-10 py-5 bg-nature-700 hover:bg-nature-600 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-nature-700/20 flex items-center gap-3 mx-auto active:scale-[0.98]"
                                >
                                    {t('calendar.set_crop_details')} <ArrowRight className="w-6 h-6" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-12 relative"
                            >
                                {/* Fixed Vertical Line */}
                                <div className="absolute left-[3.5rem] md:left-14 top-4 bottom-4 w-1 bg-gradient-to-b from-nature-500 via-nature-200 to-transparent rounded-full z-0 hidden md:block" />

                                {calendarData?.tasks.map((task: any) => (
                                    <motion.div
                                        key={task.day}
                                        variants={itemVariants}
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-50px" }}
                                        className={`relative flex items-start gap-8 z-10 group`}
                                    >
                                        {/* Day label (Fixed column) */}
                                        <div className="w-24 shrink-0 pt-8 hidden md:block text-right pr-4">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('calendar.day')}</p>
                                            <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{task.day}</p>
                                        </div>

                                        {/* Timeline Node */}
                                        <div className="absolute left-10 md:left-14 -ml-4 mt-8 hidden md:block z-20">
                                            <motion.div
                                                className={`w-8 h-8 rounded-full border-4 ${completedTasks.includes(task.day) ? 'bg-nature-600 border-nature-100' : isToday(task.date) ? 'bg-white border-blue-500' : 'bg-white border-slate-200'} shadow-md flex items-center justify-center`}
                                                whileHover={{ scale: 1.2 }}
                                            >
                                                {completedTasks.includes(task.day) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </motion.div>
                                            {isToday(task.date) && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                                                />
                                            )}
                                        </div>

                                        {/* Task Card */}
                                        <motion.div
                                            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
                                            className={`flex-1 bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group/card ${isToday(task.date)
                                                ? 'border-blue-500 shadow-xl shadow-blue-500/10'
                                                : completedTasks.includes(task.day)
                                                    ? 'border-nature-100 bg-nature-50/20'
                                                    : 'border-slate-100 shadow-sm'
                                                }`}
                                        >
                                            {isToday(task.date) && (
                                                <div className="absolute top-0 left-0 bg-blue-500 text-white px-6 py-1.5 rounded-br-2xl text-[10px] font-black uppercase tracking-[0.2em] z-20">
                                                    {t('calendar.today')}
                                                </div>
                                            )}

                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 pt-4 lg:pt-0">
                                                <div className="flex items-start gap-6">
                                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-6 ${completedTasks.includes(task.day) ? 'bg-nature-100' : isToday(task.date) ? 'bg-blue-50' : 'bg-slate-50'
                                                        }`}>
                                                        {task.icon}
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-black text-slate-900 group-hover/card:text-nature-700 transition-colors uppercase tracking-tight">{task.task}</h3>
                                                            {task.is_critical && (
                                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-red-200">{t('calendar.critical')}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5" /> {task.date}
                                                        </p>
                                                        <p className="text-slate-600 font-bold leading-relaxed max-w-xl text-sm">
                                                            {task.action}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleTask(task.day)}
                                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shrink-0 active:scale-[0.95] ${completedTasks.includes(task.day)
                                                        ? 'bg-nature-600 text-white shadow-lg shadow-nature-900/30'
                                                        : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-nature-500 hover:text-nature-600 hover:shadow-lg'
                                                        }`}
                                                >
                                                    {completedTasks.includes(task.day) ? (
                                                        <><CheckCircle2 className="w-5 h-5" /> {t('calendar.completed')}</>
                                                    ) : (
                                                        <><Circle className="w-5 h-5" /> {t('calendar.upcoming')}</>
                                                    )}
                                                </button>
                                            </div>

                                            {/* AI Adjustment Panel */}
                                            <AnimatePresence>
                                                {task.ai_adjustment && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="mt-6 pt-6 border-t border-slate-50"
                                                    >
                                                        <div className="bg-amber-50 rounded-3xl p-6 flex items-start gap-4 border border-amber-100 shadow-inner">
                                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm transition-transform group-hover/card:rotate-12">
                                                                <Activity className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2">
                                                                    {t('calendar.climate_intel_adjustment')}
                                                                </p>
                                                                <p className="text-sm text-amber-950 font-bold leading-relaxed italic">
                                                                    "{task.ai_adjustment}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
            <VoiceAssistantWidget weatherData={weatherData} user={user} />
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center xl:justify-start justify-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative ${active
            ? 'bg-nature-50 text-nature-700'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}>
        {active && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-nature-600 rounded-r-full" />}
        <div className={`transition-transform duration-300 ${active ? 'text-nature-600 scale-110' : 'text-slate-400 group-hover:text-nature-600 group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className={`text-sm tracking-tight hidden xl:block ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
);

export default FarmingCalendar;
