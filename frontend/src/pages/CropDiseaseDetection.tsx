import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, ShieldCheck, Bug, Info, ArrowRight, Loader2, Leaf, Beaker, CheckCircle2, LayoutDashboard, Cloud, Activity, AlertTriangle, Droplets, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface DetectionResult {
    disease_name: string;
    confidence: string;
    treatment: string;
    pesticide: string;
}

const CropDiseaseDetection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DetectionResult | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/disease/detect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setResult(response.data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex font-sans">
            {/* Fixed Left Sidebar Navigation */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label="Crop Analytics" /></Link>
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label="Risk Center" /></Link>
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label="Crop Advisory" /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <SidebarItem icon={<Beaker />} label="Crop Disease Detection" active />
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label="Pest Detection" /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label="Find Labor" /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 pt-12 px-10 pb-20">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="px-4 py-1.5 bg-nature-50 text-nature-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-nature-100 mb-4 inline-block">
                            AI Diagnostic Lab
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Crop Disease Detection</h2>
                        <p className="text-slate-500 mt-2 font-bold text-lg">Upload a leaf photo for instant <span className="text-nature-600">AI-powered diagnosis</span></p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Section */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="modern-card p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-nature-500 transition-all cursor-pointer relative overflow-hidden group min-h-[400px]"
                        >
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleImageChange}
                                accept="image/*"
                            />

                            {!previewUrl ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-nature-50 rounded-3xl flex items-center justify-center text-nature-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">Select Crop Leaf Image</h3>
                                    <p className="text-slate-400 font-bold text-sm max-w-xs uppercase tracking-widest leading-relaxed">
                                        Drag and drop or click to upload HQ image
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full"
                                >
                                    <img
                                        src={previewUrl}
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl brightness-90"
                                        alt="Preview"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                                    <button
                                        onClick={() => { setPreviewUrl(null); setSelectedImage(null); }}
                                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-xl hover:bg-white/40 z-20"
                                    >
                                        Remove
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedImage || isAnalyzing}
                            className="w-full py-5 bg-nature-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-nature-500 hover:shadow-[0_20px_40px_rgba(22,163,74,0.3)] disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Biological Markers...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" /> Execute AI Diagnosis
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="relative w-32 h-32 mb-8">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border-[6px] border-nature-100 border-t-nature-600 rounded-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Leaf className="w-12 h-12 text-nature-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">Processing Neural Networks</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning for pathogenic patterns...</p>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="modern-card p-10 h-full bg-gradient-to-br from-white to-red-50/20 border-red-100"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shadow-inner">
                                            <Bug className="w-8 h-8" />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Confidence Score</span>
                                            <span className="text-3xl font-black text-red-600 leading-none">{result.confidence}</span>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                            Pathogen Detected <Info className="w-3 h-3" />
                                        </span>
                                        <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter">
                                            {result.disease_name}
                                        </h3>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-red-100 shadow-sm">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Beaker className="w-3 h-3 text-nature-500" /> Recommended Treatment
                                            </h4>
                                            <p className="text-slate-700 font-bold leading-relaxed">
                                                {result.treatment}
                                            </p>
                                        </div>

                                        <div className="bg-nature-950 p-6 rounded-3xl border border-white/10 shadow-xl overflow-hidden relative">
                                            <div className="relative z-10">
                                                <h4 className="text-[10px] font-black text-nature-500 uppercase tracking-widest mb-3">Targeted Pesticide</h4>
                                                <p className="text-white text-xl font-black">{result.pesticide}</p>
                                            </div>
                                            <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-nature-500" /> AI Verified
                                        </div>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4" /> Export Report
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-slate-100 rounded-[3rem] bg-slate-50/30">
                                    <Beaker className="w-16 h-16 text-slate-200 mb-6" />
                                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Awaiting Samples</h3>
                                    <p className="text-slate-300 font-bold text-xs max-w-xs mt-2 uppercase tracking-widest">Upload a leaf photo to initiate high-precision biological analysis</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
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

export default CropDiseaseDetection;
