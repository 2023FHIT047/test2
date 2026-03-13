import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Thermometer, Droplets, Wind, CloudRain, Sun, Cloud, CloudLightning, MapPin, AlertCircle, Loader2, Sprout, TrendingUp, Activity
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const getWeatherIcon = (condition: string, className = "w-8 h-8") => {
    switch (condition.toLowerCase()) {
        case 'sunny': return <Sun className={`${className} text-yellow-400`} />;
        case 'cloudy': return <Cloud className={`${className} text-slate-400`} />;
        case 'rain': return <CloudRain className={`${className} text-blue-400`} />;
        case 'storm': return <CloudLightning className={`${className} text-purple-400`} />;
        case 'clear': return <Sun className={`${className} text-yellow-400`} />;
        case 'clouds': return <Cloud className={`${className} text-slate-400`} />;
        case 'drizzle': return <CloudRain className={`${className} text-blue-300`} />;
        case 'thunderstorm': return <CloudLightning className={`${className} text-purple-400`} />;
        default: return <Cloud className={`${className} text-slate-400`} />;
    }
};

const FarmWeatherForecast = () => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    setError("Please select your farm location to view weather forecasts.");
                } else {
                    setError("Unable to fetch weather data at this time.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm">
                <Loader2 className="w-10 h-10 text-nature-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold">Analyzing localized climate models...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200 p-8 text-center max-w-3xl mx-auto shadow-xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Location Required</h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto font-medium leading-relaxed">{error}</p>
                <Link to="/setup-location" className="inline-flex items-center gap-2 px-8 py-4 bg-nature-600 hover:bg-nature-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-nature-600/30 active:scale-95">
                    <MapPin className="w-5 h-5" /> Set Farm Location
                </Link>
            </div>
        );
    }

    if (!weatherData) return null;

    const { current, daily_forecast, hourly_trend } = weatherData;

    // Chart.js Configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#64748b', font: { family: "'Inter', sans-serif", weight: 'bold' as const } }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                ticks: { color: '#64748b' }
            }
        }
    };

    const trendData = {
        labels: hourly_trend.map((h: any) => h.time),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: hourly_trend.map((h: any) => h.temp),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                type: 'line' as const,
                yAxisID: 'y'
            },
            {
                label: 'Rain Probability (%)',
                data: hourly_trend.map((h: any) => h.rain_prob),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4,
                type: 'bar' as const,
                yAxisID: 'y1'
            }
        ]
    };

    const multiAxisOptions = {
        ...chartOptions,
        scales: {
            x: chartOptions.scales.x,
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: { display: true, text: 'Temperature °C', color: '#64748b', font: { weight: 'bold' as const } },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: { display: true, text: 'Rain %', color: '#64748b', font: { weight: 'bold' as const } },
                grid: { drawOnChartArea: false },
                min: 0,
                max: 100
            }
        }
    };

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <CloudLightning className="text-nature-600 w-8 h-8" />
                        Farm Weather Forecast
                    </h2>
                    <p className="text-slate-600 font-medium mt-2">Hyper-Local Weather Insights for Your Farm</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-nature-50 border border-nature-200 px-4 py-2 rounded-xl text-sm font-bold text-nature-700 shadow-sm">
                    <MapPin className="w-4 h-4" /> Coordinates Active
                </div>
            </div>

            {/* Current Conditions - Weather Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <WeatherInsightCard
                    icon={<Thermometer className="w-7 h-7 text-orange-500" />}
                    title="Current Temperature"
                    value={`${current.temperature}°C`}
                    desc={current.description}
                    color="orange"
                />
                <WeatherInsightCard
                    icon={<Droplets className="w-7 h-7 text-cyan-400" />}
                    title="Humidity"
                    value={`${current.humidity}%`}
                    desc="Atmospheric moisture"
                    color="cyan"
                />
                <WeatherInsightCard
                    icon={<Wind className="w-7 h-7 text-slate-400" />}
                    title="Wind Speed"
                    value={`${current.wind_speed} km/h`}
                    desc="Surface level flow"
                    color="slate"
                />
                <WeatherInsightCard
                    icon={<CloudRain className="w-7 h-7 text-blue-500" />}
                    title="Rain Chance"
                    value={`${current.rain_chance}%`}
                    desc="Precipitation probability"
                    color="blue"
                />
            </div>

            {/* Advanced Agronomic Metrics - Professional View */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Activity className="text-nature-600 w-5 h-5" /> Agronomist Insights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <MiniMetricCard label="Soil Temp" value={`${current.soil_temperature}°C`} icon={<Sprout className="w-4 h-4 text-nature-600" />} />
                    <MiniMetricCard label="Dew Point" value={`${current.dew_point}°C`} icon={<Droplets className="w-4 h-4 text-blue-500" />} />
                    <MiniMetricCard label="UV Index" value={current.uv_index} icon={<Sun className="w-4 h-4 text-orange-500" />} />
                    <MiniMetricCard label="Evap (ET)" value={`${current.evapotranspiration}mm`} icon={<CloudRain className="w-4 h-4 text-blue-400" />} />
                    <MiniMetricCard label="Pressure" value={`${current.pressure}hPa`} icon={<TrendingUp className="w-4 h-4 text-slate-500" />} />
                    <MiniMetricCard label="Visibility" value={`${current.visibility}km`} icon={<Activity className="w-4 h-4 text-slate-400" />} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weather Chart */}
                <div className="lg:col-span-2 glass-card p-6 bg-white/80 border border-slate-200 rounded-[2rem] shadow-xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-nature-200/50 rounded-full blur-[80px] pointer-events-none"></div>
                    <h3 className="text-xl font-black text-slate-800 mb-6 relative z-10">24-Hour Trend Analysis</h3>
                    <div className="h-[350px] w-full relative z-10">
                        {/* @ts-ignore */}
                        <Bar data={trendData} options={multiAxisOptions} />
                    </div>
                </div>

                {/* 5 Day Forecast Grid */}
                <div className="lg:col-span-1 glass-card p-6 bg-white/80 border border-slate-200 rounded-[2rem] shadow-xl backdrop-blur-md">
                    <h3 className="text-xl font-black text-slate-800 mb-6">5-Day Forecast</h3>
                    <div className="space-y-4">
                        {daily_forecast.map((day: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors shadow-sm"
                            >
                                <div className="flex items-center gap-4 w-1/2">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {getWeatherIcon(day.icon, "w-6 h-6")}
                                    </div>
                                    <div>
                                        <p className="text-slate-800 font-bold">{day.day_name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{day.date}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-blue-500 text-xs font-bold flex items-center gap-1">
                                            <Droplets className="w-3 h-3" /> {day.rain_prob}%
                                        </span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900 w-12 text-right">{day.temp}°</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const WeatherInsightCard = ({ icon, title, value, desc, color }: any) => {
    const getStyles = () => {
        switch (color) {
            case 'orange': return { bg: 'bg-orange-50', border: 'border-orange-200' };
            case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'cyan': return { bg: 'bg-cyan-50', border: 'border-cyan-200' };
            default: return { bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };
    const styles = getStyles();

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-6 bg-white/80 border border-slate-200 shadow-lg rounded-[2rem] hover:shadow-xl hover:border-nature-300 transition-all duration-300 relative overflow-hidden backdrop-blur-md`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 ${styles.bg}`}></div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3.5 rounded-2xl ${styles.bg} ${styles.border} border ring-1 ring-white/50 backdrop-blur-md relative z-10 shadow-sm`}>
                    {icon}
                </div>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-wide mb-1 relative z-10">{title}</p>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 relative z-10">{value}</h3>
            <p className="text-slate-600 font-medium text-xs relative z-10">{desc}</p>
        </motion.div>
    );
};

const MiniMetricCard = ({ label, value, icon }: any) => (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="p-2 bg-slate-50 rounded-lg mb-2">
            {icon}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
);

export default FarmWeatherForecast;
