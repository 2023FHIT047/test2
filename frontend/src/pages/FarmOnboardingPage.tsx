import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { 
    Sprout, Droplets, Calendar, Wheat, ClipboardCheck, ArrowRight, 
    Leaf, Info
} from "lucide-react";

const FarmOnboardingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        crop_type: "Soybean",
        soil_type: "loamy",
        irrigation_type: "drip",
        planting_date: new Date().toISOString().split('T')[0],
        crop_variety: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setFormData({
                        crop_type: res.data.crop_type || "Soybean",
                        soil_type: res.data.soil_type || "loamy",
                        irrigation_type: res.data.irrigation_type || "drip",
                        planting_date: res.data.planting_date || new Date().toISOString().split('T')[0],
                        crop_variety: res.data.crop_variety || ""
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.patch("http://localhost:8000/api/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Redirect back to farming calendar to see results immediately
            navigate("/farming-calendar");
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to save farm details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('/grid_pattern.svg')] bg-fixed">
            <div className="max-w-2xl w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden"
                >
                    <div className="bg-nature-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <Sprout className="w-12 h-12 mb-4" />
                        <h1 className="text-3xl font-black mb-2">Complete Your Farm Profile</h1>
                        <p className="text-nature-100 font-medium opacity-90">Tell us more about your farm so our AI can provide hyper-personalized advice.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Crop Type Selection */}
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                    <Wheat className="w-4 h-4 text-nature-600" /> Select Your Crop
                                </label>
                                <select 
                                    name="crop_type"
                                    value={formData.crop_type}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 font-bold text-slate-800 outline-none focus:border-nature-500 transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Select Crop</option>
                                    <option value="Soybean">Soybean</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Cotton">Cotton</option>
                                </select>
                            </div>

                            {/* Soil Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                    <Leaf className="w-4 h-4 text-nature-600" /> Soil Type
                                </label>
                                <select 
                                    name="soil_type"
                                    value={formData.soil_type}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 font-bold text-slate-800 outline-none focus:border-nature-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="clay">Clay</option>
                                    <option value="sandy">Sandy</option>
                                    <option value="loamy">Loamy</option>
                                    <option value="silt">Silt</option>
                                    <option value="peaty">Peaty</option>
                                    <option value="chalky">Chalky</option>
                                </select>
                            </div>

                            {/* Irrigation Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                    <Droplets className="w-4 h-4 text-blue-500" /> Irrigation System
                                </label>
                                <select 
                                    name="irrigation_type"
                                    value={formData.irrigation_type}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 font-bold text-slate-800 outline-none focus:border-nature-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="drip">Drip Irrigation</option>
                                    <option value="sprinkler">Sprinkler</option>
                                    <option value="flood">Flood Irrigation</option>
                                    <option value="manual">Manual Watering</option>
                                    <option value="none">Rain-fed Only</option>
                                </select>
                            </div>

                            {/* Planting Date */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                    <Calendar className="w-4 h-4 text-orange-500" /> Planting Date
                                </label>
                                <input 
                                    type="date"
                                    name="planting_date"
                                    value={formData.planting_date}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 font-bold text-slate-800 outline-none focus:border-nature-500 transition-all"
                                />
                            </div>

                            {/* Crop Variety */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                    <Wheat className="w-4 h-4 text-nature-600" /> Crop Variety
                                </label>
                                <input 
                                    type="text"
                                    name="crop_variety"
                                    value={formData.crop_variety}
                                    onChange={handleChange}
                                    placeholder="e.g. Basmati, Hybrid-7"
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 font-bold text-slate-800 outline-none focus:border-nature-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
                            <Info className="w-6 h-6 text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                Provide accurate details! For example, **Sandy soil** dries faster and may trigger irrigation alerts more frequently than **Clay soil**.
                            </p>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-nature-600 hover:bg-nature-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-nature-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Save & Continue to Dashboard <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
                
                <p className="text-center mt-8 text-slate-400 font-medium flex items-center justify-center gap-2">
                    <ClipboardCheck className="w-4 h-4" /> Your data is secure and used only for agronomic optimization.
                </p>
            </div>
        </div>
    );
};

export default FarmOnboardingPage;
