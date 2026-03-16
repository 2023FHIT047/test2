import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Droplets, Sprout, Sun, AlertTriangle, Activity, MapPin, Search, ChevronRight, LogOut, LayoutDashboard, Cloud, Bell, User, CloudRain,
    Bug, Wheat, Cpu, Leaf, ShieldCheck, ThermometerSun, Settings, ArrowRight, Wind, Calendar as CalendarIcon, Navigation, Beaker, Briefcase, Users, Clock,
    Satellite, Info as InfoIcon, X
} from "lucide-react";

import VoiceAssistantWidget from '../components/VoiceAssistantWidget';
import FarmWeatherForecast from '../components/FarmWeatherForecast';
import SmartIrrigationCard from '../components/SmartIrrigationCard';
import SatelliteMonitoringPanel from '../components/SatelliteMonitoringPanel';
import LogoIcon from '../components/Logo';

import { useLanguage } from "../context/LanguageContext";

const Dashboard = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [disasterAlerts, setDisasterAlerts] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                // Fetch Profile
                const profileResponse = await axios.get("/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Check if location is set - redirect to setup if not
                if (!profileResponse.data.latitude || !profileResponse.data.longitude) {
                    navigate("/setup-location");
                    return;
                }

                // Check if farm details are set - redirect to onboarding if not
                if (!profileResponse.data.soil_type || !profileResponse.data.irrigation_type) {
                    navigate("/onboarding");
                    return;
                }
                setUser(profileResponse.data);

                // Fetch Weather
                try {
                    const weatherResponse = await axios.get('/weather/farm-forecast/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWeatherData(weatherResponse.data);
                } catch (wErr) {
                    console.error("Weather fetch failed", wErr);
                }

                // Fetch Notifications
                try {
                    const notifyRes = await axios.get('http://localhost:8000/api/alerts-manager/my-notifications', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNotifications(notifyRes.data);
                } catch (nErr) {
                    console.error("Notifications fetch failed", nErr);
                }

                // Fetch Disaster Alerts
                try {
                    const disasterRes = await axios.get('/weather/disaster-alerts/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDisasterAlerts(disasterRes.data);
                } catch (dErr) {
                    console.error("Disaster alerts fetch failed", dErr);
                }


            } catch (err) {
                console.error(err);
                localStorage.removeItem("token");
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-nature-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 font-bold">{t('dashboard.calibrating')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-800">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/40 h-20 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-nature-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-nature-700/20 group-hover:scale-110 transition-transform duration-500">
                            <LogoIcon size={28} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">KrushiSarthi</span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 shadow-inner rounded-2xl px-5 py-2.5 w-[500px] transition-all focus-within:ring-8 focus-within:ring-nature-500/5 focus-within:bg-white/60">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('dashboard.search')}
                            className="bg-transparent border-none outline-none text-sm text-slate-800 w-full placeholder:text-slate-400 font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                if (!showNotifications) {
                                    // Refresh notifications when opening
                                    try {
                                        const token = localStorage.getItem("token");
                                        const notifyRes = await axios.get('/alerts-manager/my-notifications', {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        console.log("Notifications:", notifyRes.data);
                                        setNotifications(notifyRes.data);
                                    } catch (nErr) {
                                        console.error("Notifications fetch failed", nErr);
                                    }
                                }
                                setShowNotifications(!showNotifications);
                            }}
                            className="relative w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white/40 rounded-xl transition-all"
                        >
                            <Bell className="w-6 h-6" />
                            {(notifications.length + disasterAlerts.length) > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
                                    {notifications.length + disasterAlerts.length}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            {/* Crop Selector */}
                            <div className="mr-4">
                                <select
                                    value={user?.crop_type || "Rice"}
                                    onChange={async (e) => {
                                        const newCrop = e.target.value;
                                        try {
                                            const token = localStorage.getItem("token");
                                            await axios.patch("/profile", { crop_type: newCrop }, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setUser({ ...user, crop_type: newCrop });
                                        } catch (err) {
                                            console.error("Failed to update crop type", err);
                                        }
                                    }}
                                    className="bg-nature-50 border border-nature-200 rounded-xl px-3 py-1.5 text-[10px] font-black text-nature-700 uppercase tracking-widest outline-none cursor-pointer focus:ring-2 focus:ring-nature-500/20"
                                >
                                    <option value="Rice">{t('dashboard.crops.rice')}</option>
                                    <option value="Wheat">{t('dashboard.crops.wheat')}</option>
                                    <option value="Cotton">{t('dashboard.crops.cotton')}</option>
                                    <option value="Soybean">{t('dashboard.crops.soybean')}</option>
                                    <option value="Maize">{t('dashboard.crops.maize')}</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 mr-2">
                                <button
                                    onClick={() => navigate('/setup-location')}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-nature-50 border border-nature-200 rounded-xl text-[10px] font-black text-nature-700 uppercase tracking-widest hover:bg-nature-100 transition-all"
                                >
                                    <Navigation className="w-3 h-3" /> {t('dashboard.locate_farm')}
                                </button>
                            </div>
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-black text-slate-900 leading-tight">{user?.name}</p>
                                <p className="text-[10px] text-nature-700 font-black uppercase tracking-widest flex items-center gap-1 justify-end">
                                    <MapPin className="w-3 h-3" /> {user?.farm_location?.split(',')[0]}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-nature-100 rounded-2xl border border-nature-200 flex items-center justify-center cursor-pointer hover:border-nature-500 transition-all shadow-sm">
                                <User className="w-5 h-5 text-nature-700" />
                            </div>
                        </div>


                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-3">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar & Main Content Layout */}
            <div className="flex pt-20 max-w-[1600px] mx-auto">

                {/* Fixed Left Sidebar Navigation */}
                <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-40 overflow-y-auto no-scrollbar">
                    <SidebarItem icon={<LayoutDashboard />} label={t('dashboard.sidebar.dashboard')} active />
                    <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label={t('dashboard.sidebar.forecast')} /></Link>
                    <Link to="/farming-calendar"><SidebarItem icon={<CalendarIcon />} label={t('dashboard.sidebar.calendar')} /></Link>
                    <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label={t('dashboard.sidebar.analytics')} /></Link>
                    <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label={t('dashboard.sidebar.risk')} /></Link>
                    <div className="h-px bg-slate-200/50 my-6 mx-4" />
                    <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label={t('dashboard.sidebar.advisory')} /></Link>
                    <Link to="/dashboard"><SidebarItem icon={<Droplets />} label={t('dashboard.sidebar.irrigation')} /></Link>
                    <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label={t('dashboard.sidebar.disease')} /></Link>
                    <Link to="/pest-detection"><SidebarItem icon={<Bug />} label={t('dashboard.sidebar.pests')} /></Link>
                    <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label={t('dashboard.sidebar.labor')} /></Link>

                    <div className="mt-auto flex flex-col gap-4">
                        {/* Farm Configuration Sidebar Card */}
                        {user && (
                            <div className="bg-nature-950 text-white rounded-[2rem] p-6 hidden xl:block shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-nature-500/20 transition-all"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-nature-500 mb-4 flex items-center justify-between">
                                    {t('dashboard.farm_identity')} <Settings className="w-3 h-3 opacity-50" />
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 mb-1">{t('dashboard.crop_variety')}</p>
                                        <p className="text-sm font-black truncate text-white">{t(`dashboard.crops.${user.crop_type?.toLowerCase() || 'rice'}`)} <span className="text-nature-500 opacity-60">({user.crop_variety || 'General'})</span></p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 mb-1">{t('dashboard.soil')}</p>
                                            <p className="text-xs font-black">{user.soil_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 mb-1">{t('dashboard.system')}</p>
                                            <p className="text-xs font-black">{user.irrigation_type}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate("/onboarding")}
                                        className="w-full mt-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm"
                                    >
                                        {t('dashboard.edit_profile')} <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="glass-card p-6 hidden xl:block relative overflow-hidden group border-slate-200/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-nature-400/10 rounded-full blur-2xl"></div>
                            <LogoIcon className="w-10 h-10 text-nature-600 mb-4 group-hover:scale-110 transition-transform duration-500" />
                            <h4 className="text-sm font-black text-slate-900 mb-1">{t('dashboard.upgrade')}</h4>
                            <p className="text-xs text-slate-500 font-bold mb-5 leading-relaxed">{t('dashboard.upgrade_desc')}</p>
                            <button className="btn-primary !w-full !py-3 !text-[10px]">
                                {t('dashboard.view_plans')}
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 ml-0 md:ml-20 xl:ml-72 min-h-screen pt-12 px-10 pb-20">
                    {/* Disaster Alert Banner */}
                    <AnimatePresence>
                        {disasterAlerts.filter(a => a.severity === 'red').map((alert, idx) => (
                            <motion.div
                                key={`${alert.type}-${idx}`}
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg shadow-red-600/20 flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-red-500/50 animate-pulse-slow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest">{alert.type} - {t('alerts.severity.severe')}</h4>
                                            <p className="text-sm font-bold opacity-90">{t(`alerts.${alert.message}`)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden md:block text-right mr-2">
                                            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{t('alerts.title')}</p>
                                            <p className="text-xs font-black">{t(`alerts.actions.${alert.action}`)}</p>
                                        </div>
                                        <Link to="/risk-analytics" className="px-5 py-2.5 bg-white text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                            {t('dashboard.action_plan')}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm"
                                onClick={() => setShowNotifications(false)}
                            >
                                <div
                                    className="w-full max-w-2xl mx-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-2xl overflow-hidden relative rounded-2xl border border-slate-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-amber-400" /> {t('dashboard.notifications_title')}
                                        </h3>
                                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>

                                    </div>
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                                        {disasterAlerts.length > 0 && disasterAlerts.map((alert, idx) => (
                                            <div key={`alert-${idx}`} className={`p-4 rounded-xl border-l-4 ${alert.severity === 'red' ? 'bg-red-500/10 border-red-500' : 'bg-amber-500/10 border-amber-500'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className={`w-4 h-4 ${alert.severity === 'red' ? 'text-red-400' : 'text-amber-400'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{alert.type}</span>
                                                </div>
                                                <p className="text-sm font-bold text-white mb-2">{t(`alerts.${alert.message}`)}</p>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">{t(`alerts.actions.${alert.action}`)}</p>
                                            </div>
                                        ))}
                                        {notifications.length > 0 ? notifications.map((n, i) => (
                                            <div key={i} className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all cursor-pointer shadow-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                                                    <span className="text-[10px] font-semibold uppercase text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">{n.type}</span>
                                                </div>
                                                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                                                    <Clock className="w-3 h-3 text-slate-500" />
                                                    <p className="text-[10px] text-slate-500">{n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-center text-slate-500 font-bold py-10 text-xs uppercase tracking-widest">No New Transmissions</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <header className="mb-12 flex items-end justify-between">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl font-black text-slate-900 tracking-tight"
                            >
                                {t('dashboard.farm_overview')}
                            </motion.h2>
                            <p className="text-slate-500 mt-2 font-bold text-lg">
                                {t('dashboard.real_time')} <span className="text-nature-600">{t('dashboard.optimal_yield')}</span>
                            </p>
                        </div>
                    </header>
                    {/* Hero Section - Weather Summary */}
                    <div className="glass-card overflow-hidden mb-8 relative border-none">
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/src/assets/agri-drone.jpg"
                                alt="Agri Drone"
                                className="w-full h-full object-cover opacity-60 brightness-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-nature-950 via-nature-900/60 to-transparent"></div>
                        </div>

                        <div className="relative z-10 p-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-white">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">Live Intelligence</span>
                                    {weatherData && <span className="text-sm font-black text-nature-400">{user?.farm_location}</span>}
                                </div>
                                <div className="flex items-center gap-8 mb-8">
                                    <div className="text-8xl font-black tracking-tighter drop-shadow-lg">{weatherData?.current?.temperature || "--"}°</div>
                                    <div className="h-16 w-px bg-white/20"></div>
                                    <div>
                                        <p className="text-2xl font-black text-white capitalize leading-none mb-2">{weatherData?.current?.condition || "Sunny"}</p>
                                        <div className="flex gap-4 text-xs font-black text-white/60 tracking-widest uppercase">
                                            <span>PRECIP: {weatherData?.current?.rain_chance || "--"}%</span>
                                            <span>HUMIDITY: {weatherData?.current?.humidity || "--"}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { icon: <Droplets />, label: t('dashboard.humidity'), value: `${weatherData?.current?.humidity || "--"}%` },
                                        { icon: <Wind />, label: t('dashboard.wind_speed'), value: `${weatherData?.current?.wind_speed || "--"} km/h` },
                                        { icon: <Sun />, label: t('dashboard.uv_index'), value: "8.4" },
                                        { icon: <CloudRain />, label: t('dashboard.rain_prob'), value: `${weatherData?.current?.rain_chance || "--"}%` },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex flex-col gap-1.5">
                                            <div className="text-nature-500 w-4 h-4">{stat.icon}</div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-lg font-black">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> {t('dashboard.risk_engine')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {weatherData?.current.temperature > 35 && (
                                        <AlertCard severity="high" icon={<ThermometerSun />} title={t('dashboard.heatwave_warning')} details={t('dashboard.heatwave_details', { temp: weatherData.current.temperature, crop: t(`dashboard.crops.${user?.crop_type?.toLowerCase() || 'rice'}`) })} />
                                    )}
                                    <AlertCard severity="medium" icon={<Bug />} title={t('dashboard.fungal_warning')} details={t('dashboard.fungal_details')} />
                                </div>
                            </div>
                            <SmartIrrigationCard />
                        </div>

                        {/* Satellite Monitoring Section */}
                        <div className="lg:col-span-3">
                            <section className="bg-white/50 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 shadow-xl overflow-hidden relative mt-8">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                        <Satellite className="text-emerald-600 w-8 h-8" />
                                        {t('dashboard.satellite_title')}
                                    </h2>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                        <InfoIcon className="w-4 h-4" /> {t('dashboard.multi_spectral_intel')}
                                    </div>
                                </div>
                                <SatelliteMonitoringPanel key={user?.crop_type || 'default'} />
                            </section>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-8">
                            <div className="glass-card p-6 h-full">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Agronomic Status</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-nature-100 rounded-xl flex items-center justify-center group-hover:bg-nature-200 transition-colors">
                                                <Wheat className="w-5 h-5 text-nature-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900">{user?.crop_type || 'Crop'}</p>
                                                <p className="text-[10px] font-bold text-slate-500">{user?.crop_variety || 'Hybrid'}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-nature-600">HEALTHY</span>
                                    </div>
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                <Droplets className="w-5 h-5 text-blue-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900">Irrigation</p>
                                                <p className="text-[10px] font-bold text-slate-500">Automated System</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-blue-600">IDLE</span>
                                    </div>
                                </div>
                                <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    Daily Field Report <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <section className="mt-12">
                        <FarmWeatherForecast />
                    </section>


                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 mt-8">
                        {/* AI Crop Risk */}
                        <Link to="/crop-advisory" className="glass-card p-6 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-red-500/10 transition-colors"></div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-red-600" />
                                </div>
                                <span className="text-[10px] font-black text-red-600 bg-red-100 px-3 py-1 rounded-full uppercase tracking-widest">High Risk</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">AI Crop Risk</h4>
                            <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed line-clamp-2">
                                {weatherData?.current.rain_chance > 60 ? 'High probability of rain damage detected for current growth stage.' : 'Stable moisture conditions predicted for next 48h.'}
                            </p>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${weatherData ? Math.max(20, weatherData.current.rain_chance) : 40}%` }} />
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-black text-nature-700 uppercase tracking-widest group-hover:underline">View Advisory</span>
                                <ArrowRight className="w-4 h-4 text-nature-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        {/* Soil Moisture */}
                        <div className="glass-card p-6 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10"></div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Droplets className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Active Scan</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">Soil Moisture</h4>
                            <div className="flex items-baseline gap-1 my-3">
                                <span className="text-4xl font-black text-slate-900">42</span>
                                <span className="text-lg font-black text-slate-400">%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                            </div>
                            <p className="text-[10px] text-harvest-600 font-black mt-4 flex items-center gap-2 uppercase tracking-widest">
                                <AlertTriangle className="w-3 h-3" /> Below Critical (50%)
                            </p>
                        </div>

                        {/* Pest Risk */}
                        <Link to="/pest-detection" className="glass-card h-64 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden border-none shadow-xl shadow-harvest-100/20">
                            <img
                                src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop"
                                alt="Pest Control"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-harvest-950 via-harvest-900/60 to-transparent"></div>
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-harvest-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                            <Bug className="w-5 h-5 text-harvest-400" />
                                        </div>
                                        <span className="text-[10px] font-black bg-harvest-600 px-3 py-1 rounded-full uppercase tracking-widest">High Risk</span>
                                    </div>
                                    <h4 className="text-xl font-black mb-1">Pest Intelligence</h4>
                                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Active Monitoring</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>Aphid Detection</span>
                                        <span>72%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-harvest-500 rounded-full" style={{ width: '72%' }} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Crop Health / Digital Twin */}
                        <Link to="/digital-twin" className="glass-card h-64 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden border-none shadow-xl shadow-nature-100/20">
                            <img
                                src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1000&auto=format&fit=crop"
                                alt="Digital Twin"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-900/60 to-transparent"></div>
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-nature-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                            <Cpu className="w-5 h-5 text-nature-400" />
                                        </div>
                                        <span className="text-[10px] font-black bg-nature-600 px-3 py-1 rounded-full uppercase tracking-widest">Simulating</span>
                                    </div>
                                    <h4 className="text-xl font-black mb-1">Digital Twin</h4>
                                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Yield Projection</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold leading-tight">
                                        Modeled yield: <span className="text-nature-400 font-black">+14.2%</span> above baseline.
                                    </p>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-nature-500 rounded-full" style={{ width: '85%' }} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Find Labor Marketplace */}
                        <Link to="/find-labor" className="glass-card h-64 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden border-none shadow-xl shadow-blue-100/20">
                            <img
                                src="https://images.unsplash.com/photo-1542601906960-dafb2322354a?q=80&w=1000&auto=format&fit=crop"
                                alt="Farming Labor"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/60 to-transparent"></div>
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                            <Users className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="flex items-center gap-1 bg-nature-600 px-3 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Active Now</span>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black mb-1">Expert Labor</h4>
                                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-none">Marketplace Hub</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold leading-tight mb-4 text-white/90">
                                        Connect with verified agricultural specialists for your seasonal operations.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Find Workers</span>
                                        <ArrowRight className="w-4 h-4 text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>

                    {/* ── Farming Decision Quick Table ──────────────────── */}
                    <section className="mt-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <Leaf className="text-nature-600" /> Today's AI Farming Decisions
                            </h2>
                            <div className="flex gap-4">
                                <Link to="/farming-calendar" className="text-sm font-black text-blue-600 hover:underline flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4" /> View AI Calendar
                                </Link>
                                <Link to="/crop-advisory" className="text-sm font-bold text-nature-600 hover:underline flex items-center gap-1">
                                    View All Advisory <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 font-black text-slate-600 text-xs uppercase tracking-wider">Activity</th>
                                        <th className="text-left px-6 py-3 font-black text-slate-600 text-xs uppercase tracking-wider hidden sm:table-cell">AI Advice</th>
                                        <th className="text-left px-6 py-3 font-black text-slate-600 text-xs uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {weatherData && user ? [
                                        {
                                            act: '💧 Irrigation',
                                            advice: user.soil_type === 'sandy' && weatherData.current.rain_chance < 40
                                                ? 'Soil dries fast! Irrigating today is critical.'
                                                : weatherData.current.rain_chance > 40 ? 'Skip — rain expected' : 'Optimal to irrigate now',
                                            status: weatherData.current.rain_chance > 40 ? 'caution' : 'safe'
                                        },
                                        { act: '🧪 Fertilizer', advice: weatherData.current.rain_chance > 60 ? 'Avoid — will wash away' : 'Perfect timing', status: weatherData.current.rain_chance > 60 ? 'avoid' : 'safe' },
                                        { act: '🐛 Pesticide', advice: weatherData.current.wind_speed > 20 ? 'Too windy for spray' : 'Winds calm, safe to spray', status: weatherData.current.wind_speed > 20 ? 'avoid' : 'safe' },
                                        { act: '🌾 Harvest', advice: weatherData.current.rain_chance > 50 ? 'Wait until dry cycle' : 'Safe to proceed', status: weatherData.current.rain_chance > 50 ? 'caution' : 'safe' },
                                    ].map(r => (
                                        <tr key={r.act} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 font-bold text-slate-800">{r.act}</td>
                                            <td className="px-6 py-3 text-slate-600 font-medium hidden sm:table-cell">{r.advice}</td>
                                            <td className="px-6 py-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${r.status === 'safe' ? 'bg-nature-100 text-nature-700' :
                                                    r.status === 'caution' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {r.status === 'safe' ? '✓ Safe' : r.status === 'caution' ? '⚠ Caution' : '✗ Avoid'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-400">Loading AI decisions...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ── Precision Agriculture Spotlight ─────────────────── */}
                    <section className="mt-12 mb-8">
                        <div className="modern-card h-[280px] overflow-hidden relative group">
                            <video
                                className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-[5s]"
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-large-green-field-42777-large.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-r from-nature-950 via-nature-900/40 to-transparent"></div>
                            <div className="relative z-10 h-full p-10 flex flex-col justify-center max-w-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-nature-500 rounded-full animate-ping" />
                                    <span className="text-[10px] font-black text-nature-400 uppercase tracking-[0.2em]">Technology Showcase</span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">Empowering Every Farm with Artificial Intelligence.</h3>
                                <p className="text-white/60 font-bold text-sm leading-relaxed">
                                    KrushiSarthi uses 24+ data layers to simulate your farm's future. Our mission is to democratize high-end climate intelligence for the common farmer.
                                </p>
                            </div>
                        </div>
                    </section>

                    <footer className="pt-10 pb-6 text-center border-t border-slate-200 mt-12 text-slate-500 font-medium">
                        <p className="text-sm">&copy; 2026 KrushiSarthi Precision Agriculture Platform.</p>
                    </footer>
                </main>
            </div>
            <VoiceAssistantWidget weatherData={weatherData} user={user} />
        </div>
    );
};

// --- Reusable Components for the Dashboard ---

const SidebarItem = ({ icon, label, active = false }: any) => (
    <button className={`w-full flex items-center xl:justify-start justify-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative ${active
        ? 'bg-nature-50 text-nature-700 active-sidebar-item shadow-sm border border-nature-200/50'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
        }`}>
        {active && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-nature-600 rounded-r-full" />}
        <div className={`transition-transform duration-300 ${active ? 'text-nature-600 scale-110' : 'text-slate-400 group-hover:text-nature-600 group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className={`text-sm tracking-tight hidden xl:block ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
);

const AlertCard = ({ icon, title, details, severity }: any) => (
    <div className={`glass-card p-6 flex items-start gap-4 border-l-8 border-l-nature-500/0 hover:scale-[1.02] transition-all group ${severity === "high" ? "border-l-red-500 bg-red-50" :
        severity === "medium" ? "border-l-harvest-500 bg-yellow-50" :
            "border-l-nature-500 bg-nature-50"
        }`}>
        <div className={`p-4 rounded-2xl ${severity === "high" ? "bg-red-100 text-red-600" :
            severity === "medium" ? "bg-harvest-100 text-harvest-600" :
                "bg-nature-100 text-nature-600"
            } group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-black text-slate-900 mb-1 flex items-center gap-2">
                {title}
                {severity === "high" && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-black animate-pulse">Critical</span>}
            </h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">{details}</p>
        </div>
        <ArrowRight className="w-7 h-7 text-slate-300 group-hover:translate-x-1 transition-transform" />
    </div>
);

export default Dashboard;
