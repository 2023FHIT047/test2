import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Calendar as CalendarIcon, Clock, CheckCircle2, Circle, AlertTriangle, 
    ChevronRight, ChevronLeft, MapPin, Wind, Droplets, ThermometerSun,
    Sprout, Activity, LayoutDashboard, Cloud, Leaf, Beaker, Bug, Briefcase, Settings, LogOut, User, Search, Bell, Navigation
} from "lucide-react";
import VoiceAssistantWidget from '../components/VoiceAssistantWidget';

const FarmingCalendar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [calendarData, setCalendarData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [completedTasks, setCompletedTasks] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const [profileRes, calendarRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8000/api/farming-calendar", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setUser(profileRes.data);
                setCalendarData(calendarRes.data);
                
                // Track completed tasks based on status from backend
                const completed = calendarRes.data.tasks
                    .filter((t: any) => t.status === "Completed")
                    .map((t: any) => t.day);
                setCompletedTasks(completed);

            } catch (err) {
                console.error("Error fetching calendar data:", err);
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
                    <p className="text-slate-600 font-bold">Generating AI Farming Schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Standard Dashboard Header */}
            <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/40 h-20 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4 group" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
                        <div className="w-12 h-12 bg-nature-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-nature-700/20 group-hover:scale-110 transition-transform duration-500">
                            <Sprout className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">AgroCast</span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 shadow-inner rounded-2xl px-5 py-2.5 w-[500px]">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks, advisories..."
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
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                    <SidebarItem icon={<CalendarIcon />} label="AI Farming Calendar" active />
                    <SidebarItem icon={<Cloud />} label="Forecast Models" onClick={() => navigate('/forecast-models')} />
                    <SidebarItem icon={<Activity />} label="Crop Analytics" onClick={() => navigate('/crop-analytics')} />
                    <SidebarItem icon={<AlertTriangle />} label="Risk Center" onClick={() => navigate('/risk-analytics')} />
                    <div className="h-px bg-slate-200/50 my-6 mx-4" />
                    <SidebarItem icon={<Leaf />} label="Crop Advisory" onClick={() => navigate('/crop-advisory')} />
                    <SidebarItem icon={<Beaker />} label="Crop Disease Detection" onClick={() => navigate('/disease-detection')} />
                    <SidebarItem icon={<Bug />} label="Pest Detection" onClick={() => navigate('/pest-detection')} />
                    <SidebarItem icon={<Briefcase />} label="Find Labor" onClick={() => navigate('/find-labor')} />
                </aside>

                <main className="flex-1 ml-0 md:ml-20 xl:ml-72 min-h-screen pt-12 px-10 pb-20">
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-nature-100 text-nature-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-nature-200 shadow-sm">
                                    {calendarData?.crop} Lifecycle
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 shadow-sm">
                                    Sown: {calendarData?.sowing_date}
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Farming Calendar</h2>
                            <p className="text-slate-500 mt-2 font-bold text-lg">
                                Your optimized <span className="text-nature-600">Smart Schedule</span> for Day {calendarData?.current_day}
                            </p>
                        </div>
                        
                        {/* Weather Context Widget */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Droplets className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Rain Prob</p>
                                    <p className="text-base font-black text-slate-800">{calendarData?.weather_context.rain_prob}%</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <ThermometerSun className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Today's Temp</p>
                                    <p className="text-base font-black text-slate-800">{calendarData?.weather_context.temp}°C</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Timeline Container */}
                    <div className="relative">
                        {/* Vertical line for the timeline */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-nature-500/20 via-nature-500/20 to-transparent rounded-full hidden md:block" />

                        <div className="space-y-8">
                            {calendarData?.tasks.map((task: any, index: number) => (
                                <motion.div
                                    key={task.day}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative flex flex-col md:flex-row gap-8 items-start group`}
                                >
                                    {/* Timeline Marker */}
                                    <div className="absolute left-8 -ml-3 mt-8 w-6 h-6 rounded-full bg-white border-4 border-nature-600 z-10 hidden md:block shadow-sm group-hover:scale-125 transition-transform" />

                                    {/* Day Indicator */}
                                    <div className="w-20 shrink-0 pt-6 hidden md:block text-center">
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Day</p>
                                        <p className="text-3xl font-black text-nature-600 tracking-tighter">{task.day}</p>
                                    </div>

                                    {/* Task Card */}
                                    <div className={`flex-1 bg-white p-8 rounded-[2.5rem] border ${completedTasks.includes(task.day) ? 'border-nature-200 bg-nature-50/30' : 'border-slate-200'} shadow-sm hover:shadow-xl transition-all relative overflow-hidden group/card`}>
                                        {completedTasks.includes(task.day) && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                                        )}
                                        
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                            <div className="flex items-start gap-6">
                                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-inner transition-colors ${completedTasks.includes(task.day) ? 'bg-nature-100 text-nature-600' : 'bg-slate-50 text-slate-600'}`}>
                                                    {task.icon}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-black text-slate-900">{task.task}</h3>
                                                        {task.is_critical && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse">Critical Phase</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" /> {task.date}
                                                    </p>
                                                    <p className="text-slate-600 font-medium leading-relaxed max-w-xl">
                                                        {task.action}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                <button
                                                    onClick={() => toggleTask(task.day)}
                                                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                        completedTasks.includes(task.day)
                                                            ? 'bg-nature-600 text-white shadow-lg shadow-nature-900/20'
                                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-nature-500 hover:text-nature-600'
                                                    }`}
                                                >
                                                    {completedTasks.includes(task.day) ? (
                                                        <><CheckCircle2 className="w-4 h-4" /> Completed</>
                                                    ) : (
                                                        <><Circle className="w-4 h-4" /> Upcoming</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* AI Adjustment Panel */}
                                        <AnimatePresence>
                                            {task.ai_adjustment && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    className="mt-6 pt-6 border-t border-slate-100"
                                                >
                                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                                                            <Activity className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                                AI Intelligence Adjustment
                                                            </p>
                                                            <p className="text-xs text-amber-900 font-bold leading-relaxed italic">
                                                                "{task.ai_adjustment}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            <VoiceAssistantWidget />
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
