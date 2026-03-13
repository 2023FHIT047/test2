import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Info } from "lucide-react";

interface IrrigationData {
    recommendation: string;
    soil_moisture: string;
    rain_probability: number;
    crop_type: string;
    recommended_duration: number;
}

const SmartIrrigationCard: React.FC = () => {
    const [data, setData] = useState<IrrigationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real environment, we'd use the centralized axios instance
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/api/irrigation/recommendation', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching irrigation data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="glass-card p-8 h-full flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-600"></div>
        </div>
    );

    if (!data) return null;

    const getMoistureColor = (level: string) => {
        switch (level) {
            case 'Low': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'High': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    // Calculate percentage for progress circle (max 40 mins for scale)
    const progressPercentage = Math.min((data.recommended_duration / 40) * 100, 100);
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="modern-card p-9 h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-cyan-50/20"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 shadow-inner group-hover:scale-110 group-hover:bg-cyan-100 transition-all duration-500">
                    <Droplets className="w-7 h-7" />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${getMoistureColor(data.soil_moisture)} border shadow-sm`}>
                    Moisture: {data.soil_moisture}
                </div>
            </div>

            {/* Title & Recommendation */}
            <div className="mb-10 min-h-[100px] flex flex-col justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                    Irrigation Advisory <Info className="w-3 h-3 text-cyan-400" />
                </span>
                <h3 id="recommendation-text" className="text-3xl font-black text-slate-900 leading-[1.2] tracking-tighter break-words">
                    {data.recommendation}
                </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Rain Probability</p>
                    <p className="text-xl font-black text-cyan-600">{data.rain_probability}%</p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Crop Target</p>
                    <p className="text-xl font-black text-slate-800">{data.crop_type}</p>
                </div>
            </div>

            {/* Progress Visualization */}
            <div className="flex items-center gap-6 bg-cyan-50/30 p-5 rounded-[2rem] border border-cyan-100/50">
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background mask */}
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="7"
                            fill="transparent"
                            className="text-cyan-100/50"
                        />
                        {/* Progress line */}
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="7"
                            fill="transparent"
                            strokeDasharray={circumference}
                            className="text-cyan-500"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-0.5">
                        <span className="text-lg font-black text-slate-800 leading-none">{data.recommended_duration}</span>
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">MINS</span>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                        "Recommended drip duration for optimal root saturation today."
                    </p>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
        </motion.div>
    );
};

export default SmartIrrigationCard;
