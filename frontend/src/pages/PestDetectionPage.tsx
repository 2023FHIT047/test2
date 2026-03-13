import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft, Upload, Bug, AlertTriangle,
    CheckCircle2, Camera, Zap, ShieldAlert, Leaf, LayoutDashboard, Cloud, Beaker, Droplets, Activity
} from "lucide-react";

/* ── Mock disease results ───────────────────────────────────────────── */
const mockResults = [
    {
        disease: "Late Blight (Phytophthora infestans)",
        confidence: 91,
        severity: "High",
        action: "Apply copper-based fungicide immediately. Remove infected leaves. Avoid overhead irrigation.",
        color: "red",
    },
    {
        disease: "Powdery Mildew",
        confidence: 76,
        severity: "Medium",
        action: "Apply sulfur-based fungicide. Improve air circulation around plants.",
        color: "orange",
    },
    {
        disease: "Healthy Crop",
        confidence: 98,
        severity: "None",
        action: "No treatment needed. Continue regular monitoring.",
        color: "green",
    },
];

/* ── Pest risk data ─────────────────────────────────────────────────── */
const pestRisks = [
    { pest: "Aphids", risk: 72, icon: "🦟", trigger: "High humidity (72%) + warm nights" },
    { pest: "Leaf Borer", risk: 55, icon: "🐛", trigger: "Dense canopy + stagnant air" },
    { pest: "Whitefly", risk: 40, icon: "🦋", trigger: "Dry spells + high temperature" },
    { pest: "Stem Fly", risk: 28, icon: "🪰", trigger: "Waterlogged soil detected" },
];

const severityColor = {
    High: "text-red-700 bg-red-100 border-red-200",
    Medium: "text-orange-700 bg-amber-100 border-amber-200",
    None: "text-nature-700 bg-nature-100 border-nature-200",
};

const riskColor = (r: number) =>
    r > 65 ? "from-red-500 to-red-400" : r > 40 ? "from-amber-500 to-amber-400" : "from-nature-500 to-emerald-400";

/* ── Page ───────────────────────────────────────────────────────────── */
const PestDetectionPage = () => {
    const [dragging, setDragging] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<typeof mockResults[0] | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setResult(null);
        setScanning(true);
        // Simulate AI processing delay
        setTimeout(() => {
            setScanning(false);
            setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
        }, 2200);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) handleFile(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
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
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label="Crop Advisory" /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label="Crop Disease Detection" /></Link>
                <SidebarItem icon={<Bug />} label="Pest Detection" active />
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 bg-transparent">
                {/* Header */}
                <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16">
                    <div className="max-w-6xl mx-auto px-6 h-full flex items-center gap-4">
                        <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <Bug className="text-white w-4 h-4" />
                        </div>
                        <span className="font-black text-slate-800 text-lg">Pest & Disease Detection</span>
                        <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                            AI Vision
                        </span>
                    </div>
                </header>

                <div className="pt-20 px-10 pb-16">

                    {/* Upload + Result Row */}
                    <div className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Upload Zone */}
                        <div>
                            <h2 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-slate-600" /> Upload Crop Photo
                            </h2>
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer h-64 flex items-center justify-center
                                ${dragging ? "border-nature-500 bg-nature-50" : "border-slate-300 bg-white/60 hover:border-nature-400 hover:bg-nature-50/50"}`}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Uploaded crop" className="h-full w-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="font-bold text-slate-500">Drop a crop image here</p>
                                        <p className="text-sm text-slate-400 mt-1">or click to browse · JPG, PNG</p>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                            </div>

                            {/* Scanning animation */}
                            <AnimatePresence>
                                {scanning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-4 glass-card p-4 flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 border-4 border-nature-600 border-t-transparent rounded-full animate-spin" />
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">AI Vision Model Scanning...</p>
                                            <p className="text-xs text-slate-500">Running CNN / MobileNet inference</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Result Panel */}
                        <div>
                            <h2 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Detection Result
                            </h2>
                            <AnimatePresence>
                                {result ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-6 h-64 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-black text-slate-800 text-lg leading-tight">{result.disease}</h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${severityColor[result.severity as keyof typeof severityColor]}`}>
                                                    {result.severity} Severity
                                                </span>
                                            </div>
                                            {/* Confidence bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                                    <span>Confidence</span><span>{result.confidence}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full">
                                                    <div
                                                        className={`h-2 rounded-full bg-gradient-to-r ${result.color === "red" ? "from-red-500 to-red-400" : result.color === "orange" ? "from-amber-500 to-amber-400" : "from-nature-500 to-emerald-400"}`}
                                                        style={{ width: `${result.confidence}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-xl text-sm font-medium ${result.color === "green" ? "bg-nature-50 text-nature-800 border border-nature-200" : result.color === "red" ? "bg-red-50 text-red-800 border border-red-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                                            {result.color === "green" ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : <AlertTriangle className="w-4 h-4 inline mr-1" />}
                                            <strong>Recommended Action:</strong> {result.action}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="glass-card h-64 flex items-center justify-center text-center p-6">
                                        <div>
                                            <Leaf className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">Upload a crop image to detect diseases</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Pest Risk Gauges */}
                    <section className="mt-6">
                        <h2 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-orange-500" /> Current Pest Risk Forecast
                            <span className="text-xs font-bold text-slate-400 ml-1">· Based on weather conditions</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {pestRisks.map((p, i) => (
                                <motion.div
                                    key={p.pest}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="glass-card p-5"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{p.icon}</span>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm">{p.pest}</p>
                                            <p className={`text-xs font-bold ${p.risk > 65 ? "text-red-600" : p.risk > 40 ? "text-amber-600" : "text-nature-600"}`}>
                                                Risk: {p.risk}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full mb-3">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${riskColor(p.risk)} transition-all`}
                                            style={{ width: `${p.risk}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{p.trigger}</p>
                                </motion.div>
                            ))}
                        </div>
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

export default PestDetectionPage;
