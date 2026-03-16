import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout, ArrowLeft, Droplets, Wind, Beaker, Bug,
    CheckCircle2, AlertTriangle, Clock, Leaf, ChevronRight,
    Wheat, Sun, CloudRain, ThermometerSun, Activity, ShieldCheck, Microscope, Search, LayoutDashboard, Cloud, ArrowRight, Briefcase
} from "lucide-react";
import axios from "axios";

/* ── Types ──────────────────────────────────────────────────────────── */
interface Activity {
    activity: string;
    icon: React.ReactNode;
    advice: string;
    timing: string;
    risk: "safe" | "caution" | "avoid";
    details: string;
}

interface CropRec {
    name: string;
    emoji: string;
    score: number;
    reason: string;
}

/* ── Data ───────────────────────────────────────────────────────────── */
const activities: Activity[] = [
    {
        activity: "Irrigation",
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        advice: "Irrigate Tuesday morning (6–8am)",
        timing: "Tue, 06:00 – 08:00",
        risk: "safe",
        details: "Soil moisture at 38% — below optimal threshold of 50%. Rain not expected until Thursday. Early morning irrigation avoids evaporation loss.",
    },
    {
        activity: "Fertilizer Application",
        icon: <Beaker className="w-5 h-5 text-purple-500" />,
        advice: "Avoid — rain expected in 48hrs",
        timing: "Wait until Friday",
        risk: "caution",
        details: "Heavy rainfall forecast for Thursday will wash away nitrogen fertilizer. Apply after rain clears on Friday for maximum absorption.",
    },
    {
        activity: "Pesticide Spray",
        icon: <Bug className="w-5 h-5 text-orange-500" />,
        advice: "Spray tonight — calm winds",
        timing: "Tonight, 19:00 – 21:00",
        risk: "safe",
        details: "Wind speed below 8 km/h tonight — ideal for pesticide application. High humidity (72%) detected; fungal risk elevated, spray recommended.",
    },
    {
        activity: "Harvesting",
        icon: <Wheat className="w-5 h-5 text-amber-500" />,
        advice: "Delay — wet conditions ahead",
        timing: "Wait 5–6 days",
        risk: "avoid",
        details: "Predicted rainfall for next 3 days will create wet field conditions. Harvesting now risks grain spoilage and machinery damage. Best window: next Sunday.",
    },
    {
        activity: "Sowing / Planting",
        icon: <Sprout className="w-5 h-5 text-nature-600" />,
        advice: "Ideal window this week",
        timing: "Wed – Thu",
        risk: "safe",
        details: "Soil temperature at 22°C, moisture adequate. Pre-monsoon showers expected — perfect germination conditions. Plant before Thursday afternoon.",
    },
];

const soilTypes = ["Black Cotton", "Red Laterite", "Alluvial", "Sandy Loam", "Clay"];
const cropOptions = [
    { name: "Soybean", emoji: "🌱", score: 94, reason: "Ideal for black cotton soil + pre-monsoon rainfall", soilTypes: ["Black Cotton", "Alluvial"], seasons: ["Kharif (Jun–Oct)", "Zaid (Apr–Jun)"] },
    { name: "Cotton", emoji: "🪻", score: 88, reason: "High temperature tolerance + moderate moisture needed", soilTypes: ["Black Cotton", "Clay"], seasons: ["Kharif (Jun–Oct)"] },
    { name: "Millets (Jowar)", emoji: "🌾", score: 81, reason: "Drought-resistant, suits current soil moisture levels", soilTypes: ["Sandy Loam", "Red Laterite", "Alluvial"], seasons: ["Kharif (Jun–Oct)", "Rabi (Nov–Mar)"] },
    { name: "Groundnut", emoji: "🥜", score: 75, reason: "Works in sandy loam; watch for aflatoxin in humidity", soilTypes: ["Sandy Loam", "Red Laterite"], seasons: ["Kharif (Jun–Oct)", "Zaid (Apr–Jun)"] },
    { name: "Pigeonpea (Tur)", emoji: "🫘", score: 70, reason: "Good for mixed cropping; moderate water requirement", soilTypes: ["Black Cotton", "Alluvial", "Clay"], seasons: ["Kharif (Jun–Oct)"] },
    { name: "Wheat", emoji: "🌾", score: 85, reason: "Ideal for Rabi season with moderate temperature", soilTypes: ["Alluvial", "Clay", "Sandy Loam"], seasons: ["Rabi (Nov–Mar)"] },
    { name: "Rice", emoji: "🍚", score: 92, reason: "Perfect for water-retentive soils during monsoon", soilTypes: ["Alluvial", "Clay"], seasons: ["Kharif (Jun–Oct)"] },
    { name: "Maize", emoji: "🌽", score: 78, reason: "Warm season crop with high yield potential", soilTypes: ["Alluvial", "Sandy Loam", "Red Laterite"], seasons: ["Kharif (Jun–Oct)", "Zaid (Apr–Jun)"] },
    { name: "Chickpea (Chana)", emoji: "🫘", score: 82, reason: "Excellent for Rabi with low water requirement", soilTypes: ["Sandy Loam", "Alluvial", "Black Cotton"], seasons: ["Rabi (Nov–Mar)"] },
    { name: "Mustard", emoji: "🌼", score: 79, reason: "Winter crop with good oil content", soilTypes: ["Alluvial", "Clay", "Sandy Loam"], seasons: ["Rabi (Nov–Mar)"] },
    { name: "Sugarcane", emoji: "🎋", score: 88, reason: "Long-duration crop, needs fertile soil", soilTypes: ["Alluvial", "Clay", "Black Cotton"], seasons: ["Kharif (Jun–Oct)"] },
    { name: " Onion", emoji: "🧅", score: 76, reason: "Short duration crop for Zaid season", soilTypes: ["Sandy Loam", "Alluvial"], seasons: ["Zaid (Apr–Jun)", "Rabi (Nov–Mar)"] },
];

const riskColors = {
    safe: "bg-nature-50 border-nature-200 text-nature-700",
    caution: "bg-amber-50 border-amber-200 text-amber-700",
    avoid: "bg-red-50 border-red-200 text-red-700",
};
const riskBadge = {
    safe: "bg-nature-100 text-nature-700",
    caution: "bg-amber-100 text-amber-700",
    avoid: "bg-red-100 text-red-700",
};
const riskIcon = {
    safe: <CheckCircle2 className="w-4 h-4 text-nature-600" />,
    caution: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    avoid: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

/* ── Sub-components ─────────────────────────────────────────────────── */
const ActivityRow = ({ item, index }: { item: Activity; index: number }) => {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-3xl border glass-card hover:scale-[1.01] transition-all overflow-hidden ${item.risk === 'safe' ? 'border-nature-200/50' :
                item.risk === 'caution' ? 'border-harvest-200/50' :
                    'border-red-200/50'
                }`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-6 p-6 text-left"
            >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${item.risk === 'safe' ? 'bg-nature-50 text-nature-600' :
                    item.risk === 'caution' ? 'bg-harvest-50 text-harvest-600' :
                        'bg-red-50 text-red-600'
                    }`}>
                    {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-slate-900 text-lg tracking-tight">{item.activity}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${riskBadge[item.risk]}`}>
                            {item.risk}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        {item.advice}
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {item.timing}
                    </span>
                    <div className={`p-2 rounded-full bg-slate-50 text-slate-400 transition-transform ${open ? "rotate-90 bg-slate-900 text-white" : ""}`}>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 pt-0"
                    >
                        <div className="bg-slate-900/5 rounded-2xl p-6 text-sm text-slate-700 font-bold leading-relaxed border border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-nature-600">
                                <Activity className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">AI Intelligence Report</span>
                            </div>
                            {item.details}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const CropCard = ({ crop, index }: { crop: CropRec; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6 flex items-center gap-6 group hover:scale-[1.02] transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-nature-500"
    >
        <div className="w-16 h-16 bg-nature-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
            {crop.emoji}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
                <span className="font-black text-slate-900 text-lg tracking-tight">{crop.name}</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compatibility</span>
                    <span className="text-nature-600 font-black text-xl">{crop.score}%</span>
                </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${crop.score}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-2 bg-gradient-to-r from-nature-600 to-emerald-400 rounded-full"
                />
            </div>
            <p className="text-sm text-slate-500 font-bold leading-snug">{crop.reason}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-nature-600 group-hover:translate-x-2 transition-all" />
    </motion.div>
);

/* ── Page ───────────────────────────────────────────────────────────── */
const CropAdvisoryPage = () => {
    const [selectedSoil, setSelectedSoil] = useState("Black Cotton");
    const [selectedSeason, setSelectedSeason] = useState("Kharif (Jun–Oct)");
    const [growthStage, setGrowthStage] = useState("Vegetative");
    const [showRecs, setShowRecs] = useState(false);
    const [recommendedCrops, setRecommendedCrops] = useState<typeof cropOptions>([]);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const profileRes = await axios.get("/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(profileRes.data);
                setSelectedSoil(profileRes.data.soil_type || "Black Cotton");

                try {
                    const weatherRes = await axios.get("/weather/farm-forecast/", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWeatherData(weatherRes.data);
                    setLocationError(null);
                } catch (weatherErr: any) {
                    if (weatherErr.response?.data?.error) {
                        setLocationError(weatherErr.response.data.error);
                    } else {
                        console.error("Weather fetch failed", weatherErr);
                    }
                }
            } catch (err) {
                console.error("Advisory fetch failed", err);
            }
        };
        fetchData();
    }, []);

    const generateDeepAnalysis = () => {
        if (!user || !weatherData) return null;

        const humidity = weatherData.current.humidity;
        const rain = weatherData.current.rain_chance;
        const soil = user.soil_type;

        let analysis = `Based on your **${soil}** soil and **${growthStage}** stage, current conditions are `;
        let risks = [];

        if (humidity > 75 && growthStage === "Flowering") {
            risks.push("High risk of fungal blossom blight due to high humidity.");
        }
        if (soil === "sandy" && rain < 20) {
            risks.push("Sandy soil moisture is dropping rapidly; increase irrigation frequency.");
        }
        if (weatherData.current.uv_index > 8) {
            risks.push("Extreme UV intensity detected — possible leaf scorch in vegetative period.");
        }

        return {
            summary: analysis + (risks.length > 0 ? "challenging." : "optimal."),
            points: risks.length > 0 ? risks : ["All metrics are within safe range for current growth phase."]
        };
    };

    const deepReport = generateDeepAnalysis();

    const getRecommendations = () => {
        const filtered = cropOptions.filter(crop =>
            crop.soilTypes.includes(selectedSoil) && crop.seasons.includes(selectedSeason)
        );
        // Sort by score descending
        const sorted = [...filtered].sort((a, b) => b.score - a.score);
        setRecommendedCrops(sorted);
        setShowRecs(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Fixed Left Sidebar Navigation */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label="Crop Analytics" /></Link>
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label="Risk Center" /></Link>
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <SidebarItem icon={<Leaf />} label="Crop Advisory" active />
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label="Crop Disease Detection" /></Link>
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label="Pest Detection" /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label="Find Labor" /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 bg-transparent">
                {/* Header */}
                <header className="fixed top-0 w-full z-[100] bg-white/10 backdrop-blur-2xl border-b border-white/10 h-20 transition-all duration-500">
                    <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link to="/dashboard" className="p-2.5 bg-slate-900/5 hover:bg-slate-900/10 rounded-xl transition-all group">
                                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center shadow-lg shadow-nature-600/20">
                                    <Sprout className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h1 className="font-black text-slate-900 tracking-tight">CROP ADVISORY</h1>
                                    <p className="text-[10px] font-black text-nature-600 uppercase tracking-[0.2em] leading-none">Intelligence Hub</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:flex items-center gap-2 px-4 py-2 bg-nature-50 border border-nature-200 rounded-full text-[10px] font-black text-nature-700 uppercase tracking-widest animate-pulse">
                                <div className="w-1.5 h-1.5 bg-nature-600 rounded-full" /> Live Agronomy Analysis
                            </span>
                        </div>
                    </div>
                </header>

                <div className="pt-20 px-10 pb-16">

                    {/* Current Weather Context */}
                    {locationError && (
                        <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div className="flex-1">
                                <p className="font-black text-amber-800">{locationError}</p>
                                <p className="text-sm text-amber-700 font-medium">Please set your farm location to get weather forecasts.</p>
                            </div>
                            <Link
                                to="/setup-location"
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm transition-all"
                            >
                                Set Location
                            </Link>
                        </div>
                    )}
                    <div className="my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <ThermometerSun className="w-5 h-5 text-orange-500" />, label: "Temperature", value: weatherData ? `${weatherData.current.temperature}°C` : "Loading..." },
                            { icon: <Droplets className="w-5 h-5 text-blue-500" />, label: "Humidity", value: weatherData ? `${weatherData.current.humidity}%` : "Loading..." },
                            { icon: <Wind className="w-5 h-5 text-slate-500" />, label: "Wind", value: weatherData ? `${weatherData.current.wind_speed} km/h` : "Loading..." },
                            { icon: <CloudRain className="w-5 h-5 text-nature-600" />, label: "Rain Prob.", value: weatherData ? `${weatherData.current.rain_chance}%` : "Loading..." },
                        ].map((s) => (
                            <div key={s.label} className="glass-card p-4 flex items-center gap-3">
                                {s.icon}
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
                                    <p className="font-black text-slate-800">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Deep Analysis Section */}
                    {user && deepReport && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 glass-card overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-nature-900 opacity-95"></div>
                            <div className="absolute top-0 right-0 w-[600px] h-full bg-white/5 opacity-10 pointer-events-none"></div>

                            <div className="relative z-10 p-10">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-700">
                                            <Microscope className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">AI Agronomic Deep Scan</span>
                                                <span className="text-xs font-bold text-nature-400">SESSION ID: #AC-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                            </div>
                                            <h2 className="text-4xl font-black text-white tracking-tighter">PHASE ANALYSIS</h2>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[300px]">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Current Growth Phase</label>
                                        <div className="relative">
                                            <select
                                                value={growthStage}
                                                onChange={e => setGrowthStage(e.target.value)}
                                                className="w-full bg-slate-900/40 border border-white/20 rounded-xl px-4 py-3 text-sm font-black text-white outline-none appearance-none cursor-pointer focus:border-nature-500 transition-colors"
                                            >
                                                <option className="bg-slate-900">Sowing</option>
                                                <option className="bg-slate-900">Vegetative</option>
                                                <option className="bg-slate-900">Flowering</option>
                                                <option className="bg-slate-900">Fruiting</option>
                                                <option className="bg-slate-900">Ripening</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-white/40 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 bg-nature-500/20 rounded-lg flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-nature-400" />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Condition Summary</h4>
                                        </div>
                                        <p className="text-2xl font-black text-white leading-tight">{deepReport.summary}</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {deepReport.points.map((p: string, i: number) => (
                                            <div key={i} className="flex gap-4 bg-slate-900/40 p-5 rounded-2xl border border-white/5 hover:border-nature-500/50 transition-all group/item">
                                                <div className="w-10 h-10 bg-nature-950/50 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                                    <ShieldCheck className="w-5 h-5 text-nature-500" />
                                                </div>
                                                <p className="text-sm font-bold text-white/80 leading-relaxed">{p}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-nature-600 rounded-2xl flex items-center justify-center shadow-lg shadow-nature-600/20">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-black text-2xl text-slate-900 tracking-tight">AI Farming Decision Assistant</h2>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Intelligent field operations protocols</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {activities.map((a, i) => <ActivityRow key={a.activity} item={a} index={i} />)}
                        </div>
                    </section>

                    {/* Crop Recommendation System */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-harvest-600 rounded-2xl flex items-center justify-center shadow-lg shadow-harvest-600/20">
                                <Wheat className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-black text-2xl text-slate-900 tracking-tight">Crop Recommendation System</h2>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Optimized for soil, climate & historical yields</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="glass-card p-10 mb-10 overflow-hidden relative border-slate-200/50">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Soil Type</label>
                                    <div className="relative">
                                        <select
                                            value={selectedSoil}
                                            onChange={e => setSelectedSoil(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer focus:border-nature-500 focus:ring-4 focus:ring-nature-500/5 transition-all"
                                        >
                                            {soilTypes.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Target Season</label>
                                    <div className="relative">
                                        <select
                                            value={selectedSeason}
                                            onChange={e => setSelectedSeason(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer focus:border-nature-500 focus:ring-4 focus:ring-nature-500/5 transition-all"
                                        >
                                            <option>Kharif (Jun–Oct)</option>
                                            <option>Rabi (Nov–Mar)</option>
                                            <option>Zaid (Apr–Jun)</option>
                                        </select>
                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={getRecommendations}
                                        className="btn-primary w-full !py-4 !text-[10px]"
                                    >
                                        <Sun className="w-4 h-4" /> Run Simulation
                                    </button>
                                </div>
                            </div>
                        </div>

                        {showRecs && (
                            <div className="space-y-4 animate-entrance">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Simulating optimal results for <span className="text-nature-600">{selectedSoil}</span> soil in <span className="text-nature-600">{selectedSeason}</span>
                                    </p>
                                    <span className="text-xs font-bold text-slate-400">{recommendedCrops.length} Results Found</span>
                                </div>
                                {recommendedCrops.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recommendedCrops.map((c: any, i: number) => <CropCard key={c.name} crop={c} index={i} />)}
                                    </div>
                                ) : (
                                    <div className="glass-card p-12 text-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-lg font-black text-slate-900">No Compatible Crops Found</p>
                                        <p className="text-sm text-slate-500 font-bold mt-1">Adjust soil type or target season to run a new simulation.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
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

export default CropAdvisoryPage;

