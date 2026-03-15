import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Leaf, Scale, User, Phone, Mail, Lock, MapPin, Wheat, Ruler, ChevronRight } from "lucide-react";
import Logo from "../components/Logo";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bid (Beed)", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
    "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri",
    "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const RegisterPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        village: "",
        district: "",
        farm_location: "",
        farm_size: "",
        crop_type: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/register", {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                village: formData.village,
                district: formData.district,
                farm_location: formData.farm_location,
                farm_size: formData.farm_size,
                crop_type: formData.crop_type
            });

            if (response.status === 201) {
                setIsSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const len = formData.password.length;
        if (len === 0) return 0;
        if (len < 6) return 33;
        if (len < 10) return 66;
        return 100;
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="modern-card p-12 text-center max-w-md w-full bg-white shadow-2xl"
                >
                    <div className="w-24 h-24 bg-nature-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-nature-600/30">
                        <CheckCircle2 className="text-white w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 text-slate-900 tracking-tight">{t('auth.success_title')}</h2>
                    <p className="text-slate-500 mb-10 font-bold text-lg leading-relaxed">{t('auth.success_desc')}</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                            className="bg-nature-600 h-full"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
            {/* Left Section: Image & Value Prop */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-nature-950 items-center justify-center p-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        className="w-full h-full object-cover opacity-50 brightness-[0.6] contrast-110"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-large-green-field-42777-large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-nature-950 via-nature-950/30 to-nature-950" />
                </div>

                <div className="relative z-10 max-w-md">
                    <Link to="/" className="inline-flex items-center gap-4 mb-20">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                            <Logo size={32} />
                        </div>
                        <span className="text-3xl font-black text-white italic tracking-tighter">KrushiSarthi</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <h2 className="text-5xl font-black text-white mb-8 leading-tight tracking-tighter">
                            {t('auth.register_title')}
                        </h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed">
                            {t('auth.register_subtitle')}
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { icon: <Leaf />, title: t('auth.benefit1'), desc: "Precision Analytics" },
                            { icon: <Scale />, title: t('auth.benefit2'), desc: "Asset Optimization" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                            >
                                <div className="w-10 h-10 rounded-xl bg-nature-500/20 flex items-center justify-center text-nature-500 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">{item.title}</p>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 bg-slate-50 relative overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto py-20 px-8">
                    {/* Mobile Branding */}
                    <div className="lg:hidden flex flex-col items-center mb-12">
                        <div className="w-12 h-12 bg-nature-600 rounded-2xl flex items-center justify-center mb-4">
                            <Logo size={28} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 italic">KrushiSarthi</h1>
                    </div>

                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{t('auth.register_title')}</h1>
                        <p className="text-slate-500 font-bold text-lg">{t('auth.register_subtitle')}</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="modern-card p-10 bg-white shadow-2xl shadow-slate-200/50"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-xs font-black uppercase tracking-tight">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-grid">
                                {/* Row 1: Full Legal Name | Mobile Contact */}
                                <div className="form-field">
                                    <label className="label-text">{t('auth.full_name')}</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="name" type="text" placeholder="e.g. Ganesh Patil" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="label-text">{t('auth.phone')}</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="phone" type="tel" placeholder="+91 98XXX XXX00" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Professional Email (full width) */}
                                <div className="form-field full-width">
                                    <label className="label-text">{t('auth.email_label')}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="email" type="email" placeholder="farmer@agrocast.com" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Security Password | Confirm Password */}
                                <div className="form-field">
                                    <label className="label-text">{t('auth.password_label')}</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                                            className="form-input form-input-password pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-nature-600 transition-colors z-10"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getPasswordStrength()}%` }}
                                            className={`h-full transition-all duration-500 ${getPasswordStrength() === 100 ? 'bg-nature-500' : 'bg-yellow-500'}`}
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="label-text">{t('auth.confirm_password')}</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="confirmPassword" type="password" placeholder="••••••••" required
                                            className="form-input form-input-password pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Village Name | District */}
                                <div className="form-field">
                                    <label className="label-text">{t('auth.village')}</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="village" type="text" placeholder="Enter village name" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="label-text">{t('auth.district')}</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <select
                                            name="district" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5 appearance-none"
                                            onChange={handleChange}
                                        >
                                            <option value="">{t('auth.select_district')}</option>
                                            {MAHARASHTRA_DISTRICTS.map(district => (
                                                <option key={district} value={district.toLowerCase()}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 5: Farm Location (Village, District, State) (full width) */}
                                <div className="form-field full-width">
                                    <label className="label-text">{t('auth.farm_location')}</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="farm_location" type="text" placeholder="Village name, District, Maharashtra" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Row 6: Total Farm Size | Major Crop Classification */}
                                <div className="form-field">
                                    <label className="label-text">{t('auth.farm_size')}</label>
                                    <div className="relative group">
                                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <input
                                            name="farm_size" type="number" placeholder="5.4" step="0.1" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="label-text">{t('auth.crop_class')}</label>
                                    <div className="relative group">
                                        <Wheat className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                        <select
                                            name="crop_type" required
                                            className="form-input pl-12 bg-slate-50 border border-slate-200/60 transition-all duration-300 focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5 appearance-none"
                                            onChange={handleChange}
                                        >
                                            <option value="">{t('auth.select_crop')}</option>
                                            <option value="Soybean">{t('dashboard.crops.soybean')}</option>
                                            <option value="Wheat">{t('dashboard.crops.wheat')}</option>
                                            <option value="Cotton">{t('dashboard.crops.cotton')}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row 7: Submit Button (centered full width) */}
                                <div className="full-width pt-4">
                                    <button
                                        type="submit" disabled={isLoading}
                                        className="w-full btn-primary !py-4 text-lg flex items-center justify-center gap-4 group"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-3">
                                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t('auth.creating_profile')}
                                            </span>
                                        ) : (
                                            <>
                                                {t('auth.complete_reg')}
                                                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-slate-500 font-bold pt-4">
                                {t('auth.already_registered')}
                                <Link to="/login" className="text-nature-600 hover:text-nature-500 ml-2 transition-colors">{t('auth.login_link')}</Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
