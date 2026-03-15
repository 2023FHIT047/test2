import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    Droplets, Wind, Sun, Cloud, CloudLightning, MapPin, AlertCircle, Loader2,
    Calendar as CalendarIcon, Info
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// Animated Weather Icons Component
const AnimatedWeatherIcon = ({ condition, className = "w-12 h-12" }: { condition: string, className?: string }) => {
    const iconProps = { className };
    
    switch (condition.toLowerCase()) {
        case 'sunny':
        case 'clear':
            return (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Sun {...iconProps} className={`${className} text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`} />
                </motion.div>
            );
        case 'cloudy':
        case 'clouds':
            return (
                <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Cloud {...iconProps} className={`${className} text-slate-400`} />
                </motion.div>
            );
        case 'rain':
        case 'drizzle':
            return (
                <div className="relative">
                    <Cloud {...iconProps} className={`${className} text-slate-400`} />
                    <div className="absolute top-2/3 left-0 right-0 flex justify-around px-1">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, 8], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                                className="w-0.5 h-2 bg-blue-400 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            );
        case 'storm':
        case 'thunderstorm':
            return (
                <div className="relative">
                    <Cloud {...iconProps} className={`${className} text-slate-500`} />
                    <motion.div
                        animate={{ opacity: [0, 1, 0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1, 0.15, 1] }}
                    >
                        <CloudLightning className={`${className} text-yellow-400 absolute top-0 left-0`} />
                    </motion.div>
                </div>
            );
        default:
            return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    }
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 border border-white/10 shadow-2xl rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white">
                    {payload[0].value}{unit}
                </p>
            </div>
        );
    }
    return null;
};

const FarmWeatherForecast = () => {
    const { t } = useLanguage();
    const [weatherData, setWeatherData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'wind'>('temp');

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:8000/api/weather/farm-forecast/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeatherData(response.data);
                setError(null);
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    setError(t('location_required'));
                } else {
                    setError("Unable to fetch weather data at this time.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [t]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm">
                <Loader2 className="w-10 h-10 text-nature-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold">{t('analyzing_models')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200 p-8 text-center max-w-3xl mx-auto shadow-xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">{t('location_required')}</h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto font-medium leading-relaxed">{error}</p>
                <Link to="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-nature-600 hover:bg-nature-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-nature-600/30 active:scale-95">
                    <MapPin className="w-5 h-5" /> {t('set_location')}
                </Link>
            </div>
        );
    }

    if (!weatherData) return null;

    const { current, daily_forecast, hourly_trend } = weatherData;

    const getUnit = () => {
        if (activeTab === 'temp') return '°C';
        if (activeTab === 'rain') return '%';
        return ' km/h';
    };

    const getThemeColor = () => {
        if (activeTab === 'temp') return '#fbbf24'; // Amber-400
        if (activeTab === 'rain') return '#3b82f6'; // Blue-500
        return '#94a3b8'; // Slate-400
    };

    const getChartDataKey = () => {
        if (activeTab === 'temp') return 'temp';
        if (activeTab === 'rain') return 'rain_prob';
        return 'wind_speed';
    };

    const formatTime = (timeStr: string) => {
        const [hour] = timeStr.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12} ${ampm}`;
    };

    const getConditionKey = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes('clear')) return 'clear';
        if (d.includes('cloud')) return 'clouds';
        if (d.includes('rain') || d.includes('drizzle')) return 'rain';
        if (d.includes('storm')) return 'storm';
        return 'clear';
    };

    return (
        <section className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden mb-8">
            {/* Top Section: Current Weather */}
            <div className="p-10 pb-6 bg-gradient-to-br from-white to-slate-50/30">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4">
                            <span className="text-8xl font-[900] text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">
                                {Math.round(current.temperature)}°
                            </span>
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none mb-3">CELSIUS</span>
                                <AnimatedWeatherIcon condition={current.description} className="w-20 h-20" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <h3 className="text-4xl font-black text-slate-800 leading-none mb-3">
                                {t(`weather.${getConditionKey(current.description)}`)}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                <MapPin className="w-3.5 h-3.5 text-nature-600" /> {t('coordinates_active')}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:flex items-center gap-x-14 gap-y-6">
                        <WeatherMetric label={t('weather.precip')} value={`${current.rain_chance}%`} icon={<Droplets className="w-5 h-5 text-blue-500/80" />} />
                        <WeatherMetric label={t('weather.humidity')} value={`${current.humidity}%`} icon={<Droplets className="w-5 h-5 text-cyan-400" />} />
                        <WeatherMetric label={t('weather.wind_speed')} value={`${current.wind_speed} km/h`} icon={<Wind className="w-5 h-5 text-slate-300" />} />
                    </div>
                </div>
            </div>

            {/* Middle Section: Tabs */}
            <div className="px-10 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-10">
                    <TabButton 
                        active={activeTab === 'temp'} 
                        label={t('temperature')} 
                        onClick={() => setActiveTab('temp')} 
                        color="#fbbf24"
                    />
                    <TabButton 
                        active={activeTab === 'rain'} 
                        label={t('rainfall')} 
                        onClick={() => setActiveTab('rain')} 
                        color="#3b82f6"
                    />
                    <TabButton 
                        active={activeTab === 'wind'} 
                        label={t('wind')} 
                        onClick={() => setActiveTab('wind')} 
                        color="#64748b"
                    />
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <CalendarIcon className="w-4 h-4" /> {t('24h_trend')}
                </div>
            </div>

            {/* Graph Section */}
            <div className="h-[280px] w-full mt-10 px-6 relative">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01)_0%,transparent_100%)]"></div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourly_trend} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={getThemeColor()} stopOpacity={0.25}/>
                                <stop offset="95%" stopColor={getThemeColor()} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={formatTime}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                            dy={15}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <RechartsTooltip 
                            content={<CustomTooltip unit={getUnit()} />} 
                            cursor={{ stroke: '#f1f5f9', strokeWidth: 2, strokeDasharray: '5 5' }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey={getChartDataKey()} 
                            stroke={getThemeColor()} 
                            strokeWidth={5} 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Section: Daily Forecast */}
            <div className="p-10 pt-10 bg-slate-50/40">
                <div className="flex overflow-x-auto pb-6 pt-2 gap-6 no-scrollbar snap-x">
                    {daily_forecast.map((day: any, idx: number) => (
                        <ForecastCard 
                            key={idx}
                            day={idx === 0 ? t('current_day') : t(day.day_name.substring(0, 3).toLowerCase())}
                            icon={day.icon}
                            max={Math.round(day.temp)}
                            min={Math.round(day.temp - 6)}
                        />
                    ))}
                </div>
                
                <div className="mt-10 flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('agronomist_insights')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const WeatherMetric = ({ label, value, icon }: any) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-base font-black text-slate-800">{value}</span>
        </div>
    </div>
);

const TabButton = ({ active, label, onClick, color }: any) => (
    <button
        onClick={onClick}
        className="relative py-4 px-2 group"
    >
        <span className={`text-sm font-black transition-colors duration-300 ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
            {label}
        </span>
        {active && (
            <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                style={{ backgroundColor: color }}
            />
        )}
    </button>
);

const ForecastCard = ({ day, icon, max, min }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="flex flex-col items-center gap-4 min-w-[100px] p-6 bg-white border border-slate-100 rounded-3xl shadow-sm transition-all hover:shadow-xl hover:border-nature-200"
    >
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{day}</span>
        <AnimatedWeatherIcon condition={icon} className="w-10 h-10" />
        <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900">{max}°</span>
            <span className="text-xs font-bold text-slate-400">{min}°</span>
        </div>
    </motion.div>
);

export default FarmWeatherForecast;
