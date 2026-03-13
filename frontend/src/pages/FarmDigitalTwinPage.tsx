import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft, Cpu, TrendingUp, TrendingDown,
    Droplets, ThermometerSun, CloudRain, Wind, AlertTriangle, CheckCircle2
} from "lucide-react";

/* ── Farm zone data ──────────────────────────────────────────────────── */
interface Zone {
    id: string;
    name: string;
    crop: string;
    emoji: string;
    health: number;
    moisture: number;
    baseYield: number;
    color: string;
    status: "Optimal" | "Monitor" | "At Risk";
}

const zones: Zone[] = [
    { id: "A", name: "Zone A", crop: "Wheat", emoji: "🌾", health: 88, moisture: 52, baseYield: 4.2, color: "bg-amber-100 border-amber-300", status: "Optimal" },
    { id: "B", name: "Zone B", crop: "Soybean", emoji: "🌱", health: 74, moisture: 38, baseYield: 2.8, color: "bg-nature-100 border-nature-300", status: "Monitor" },
    { id: "C", name: "Zone C", crop: "Rice", emoji: "🍚", health: 61, moisture: 68, baseYield: 3.5, color: "bg-sky-100 border-sky-300", status: "At Risk" },
    { id: "D", name: "Zone D", crop: "Maize", emoji: "🌽", health: 91, moisture: 45, baseYield: 5.1, color: "bg-yellow-100 border-yellow-300", status: "Optimal" },
    { id: "E", name: "Zone E", crop: "Tomato", emoji: "🍅", health: 55, moisture: 71, baseYield: 18.0, color: "bg-red-100 border-red-300", status: "At Risk" },
    { id: "F", name: "Zone F", crop: "Groundnut", emoji: "🥜", health: 82, moisture: 42, baseYield: 2.2, color: "bg-orange-100 border-orange-300", status: "Optimal" },
];

const statusColor: Record<Zone["status"], string> = {
    Optimal: "text-nature-600 bg-nature-100",
    Monitor: "text-amber-600 bg-amber-100",
    "At Risk": "text-red-600 bg-red-100",
};

/* ── Scenario simulation ─────────────────────────────────────────────── */
const applyScenario = (zone: Zone, rainfall: number, temp: number) => {
    // Simulate yield change based on sliders
    let yieldMul = 1;
    if (rainfall > 50) yieldMul -= (rainfall - 50) * 0.006;   // excess rain hurts
    if (rainfall < 20) yieldMul -= (20 - rainfall) * 0.008;   // drought hurts more
    if (temp > 38) yieldMul -= (temp - 38) * 0.04;            // heat stress
    if (temp < 18) yieldMul -= (18 - temp) * 0.03;            // cold stress
    yieldMul = Math.max(0.3, yieldMul);
    return +(zone.baseYield * yieldMul).toFixed(2);
};

/* ── Page ────────────────────────────────────────────────────────────── */
const FarmDigitalTwinPage = () => {
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [rainfall, setRainfall] = useState(35);
    const [temp, setTemp] = useState(31);

    const simYield = selectedZone ? applyScenario(selectedZone, rainfall, temp) : null;
    const yieldDelta = simYield && selectedZone ? simYield - selectedZone.baseYield : 0;

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center gap-4">
                    <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Cpu className="text-white w-4 h-4" />
                    </div>
                    <span className="font-black text-slate-800 text-lg">Farm Digital Twin</span>
                    <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                        Simulation Mode
                    </span>
                </div>
            </header>

            <main className="pt-20 max-w-6xl mx-auto px-6 pb-16">
                <div className="my-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Farm Grid */}
                    <div className="lg:col-span-2">
                        <h2 className="font-black text-xl text-slate-900 mb-2">Virtual Farm Map</h2>
                        <p className="text-sm text-slate-500 font-medium mb-4">Click a zone to run weather scenario simulation</p>
                        <div className="grid grid-cols-3 gap-3">
                            {zones.map((zone, i) => (
                                <motion.button
                                    key={zone.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.06 }}
                                    onClick={() => setSelectedZone(zone)}
                                    className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:scale-105 active:scale-95 ${zone.color}
                                        ${selectedZone?.id === zone.id ? "ring-2 ring-nature-500 ring-offset-2" : ""}`}
                                >
                                    <div className="text-3xl mb-2">{zone.emoji}</div>
                                    <p className="font-black text-slate-800 text-sm">{zone.name}</p>
                                    <p className="text-xs text-slate-600 font-semibold">{zone.crop}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${statusColor[zone.status]}`}>
                                            {zone.status}
                                        </span>
                                        <span className="text-xs font-black text-slate-700">{zone.health}%</span>
                                    </div>
                                    {/* Health bar */}
                                    <div className="mt-2 h-1 bg-white/60 rounded-full">
                                        <div
                                            className={`h-1 rounded-full ${zone.health > 75 ? "bg-nature-500" : zone.health > 55 ? "bg-amber-400" : "bg-red-400"}`}
                                            style={{ width: `${zone.health}%` }}
                                        />
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex gap-4 flex-wrap">
                            {(Object.keys(statusColor) as Zone["status"][]).map(s => (
                                <span key={s} className={`text-xs font-bold px-2 py-1 rounded-lg ${statusColor[s]}`}>{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Simulation Panel */}
                    <div>
                        <h2 className="font-black text-xl text-slate-900 mb-2">Scenario Simulator</h2>
                        <p className="text-sm text-slate-500 font-medium mb-4">
                            {selectedZone ? `Simulating impact on ${selectedZone.name} (${selectedZone.crop})` : "Select a zone to simulate"}
                        </p>

                        <div className="glass-card p-5 space-y-6">
                            {/* Rainfall Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                        <CloudRain className="w-4 h-4 text-blue-500" /> Rainfall
                                    </label>
                                    <span className="text-sm font-black text-nature-700">{rainfall} mm</span>
                                </div>
                                <input
                                    type="range" min={0} max={120} value={rainfall}
                                    onChange={e => setRainfall(+e.target.value)}
                                    className="w-full accent-nature-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 font-medium mt-0.5">
                                    <span>Drought</span><span>Optimal</span><span>Flood</span>
                                </div>
                            </div>

                            {/* Temperature Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                        <ThermometerSun className="w-4 h-4 text-orange-500" /> Temperature
                                    </label>
                                    <span className="text-sm font-black text-orange-600">{temp}°C</span>
                                </div>
                                <input
                                    type="range" min={10} max={46} value={temp}
                                    onChange={e => setTemp(+e.target.value)}
                                    className="w-full accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400 font-medium mt-0.5">
                                    <span>Cold</span><span>Ideal</span><span>Heat Stress</span>
                                </div>
                            </div>

                            {/* Result */}
                            {selectedZone && simYield !== null && (
                                <motion.div
                                    key={`${rainfall}-${temp}-${selectedZone.id}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`rounded-xl p-4 border ${yieldDelta >= 0 ? "bg-nature-50 border-nature-200" : "bg-red-50 border-red-200"}`}
                                >
                                    <p className="text-xs font-bold text-slate-500 mb-2">Simulated Yield Impact</p>
                                    <div className="flex items-end gap-3">
                                        <div>
                                            <p className="text-3xl font-black text-slate-800">{simYield} t/ha</p>
                                            <p className="text-xs text-slate-400 font-medium">Projected yield</p>
                                        </div>
                                        <div className={`flex items-center gap-1 font-black text-lg ${yieldDelta >= 0 ? "text-nature-600" : "text-red-500"}`}>
                                            {yieldDelta >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                            {yieldDelta >= 0 ? "+" : ""}{yieldDelta.toFixed(2)} t/ha
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium mt-2 text-slate-500">
                                        Baseline: {selectedZone.baseYield} t/ha
                                    </p>
                                    {/* Visual impact bars */}
                                    <div className="mt-3 space-y-2">
                                        {[
                                            { label: "Baseline", value: selectedZone.baseYield, max: 25, color: "bg-slate-300" },
                                            { label: "Simulated", value: simYield, max: 25, color: yieldDelta >= 0 ? "bg-nature-500" : "bg-red-400" },
                                        ].map(b => (
                                            <div key={b.label}>
                                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-0.5">
                                                    <span>{b.label}</span><span>{b.value} t/ha</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full">
                                                    <div className={`h-2 ${b.color} rounded-full transition-all duration-500`}
                                                        style={{ width: `${(b.value / b.max) * 100}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {!selectedZone && (
                                <div className="text-center py-4 text-slate-400">
                                    <Cpu className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-medium">Click a zone on the left to simulate</p>
                                </div>
                            )}
                        </div>

                        {/* Weather advisories */}
                        <div className="mt-6 space-y-3">
                            <h3 className="font-black text-slate-800">Current Conditions</h3>
                            {[
                                { icon: <Droplets className="w-4 h-4 text-blue-500" />, label: "Soil Moisture Avg", value: "53%", ok: true },
                                { icon: <Wind className="w-4 h-4 text-slate-500" />, label: "Wind Speed", value: "7 km/h", ok: true },
                                { icon: <ThermometerSun className="w-4 h-4 text-orange-500" />, label: "Temperature", value: "31°C", ok: true },
                                { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, label: "Flood Risk", value: "Zone C", ok: false },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2.5 border border-slate-100 shadow-sm">
                                    {s.icon}
                                    <span className="text-sm font-semibold text-slate-600 flex-1">{s.label}</span>
                                    <span className="font-black text-slate-800 text-sm">{s.value}</span>
                                    {s.ok
                                        ? <CheckCircle2 className="w-4 h-4 text-nature-500" />
                                        : <AlertTriangle className="w-4 h-4 text-red-400" />
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FarmDigitalTwinPage;
