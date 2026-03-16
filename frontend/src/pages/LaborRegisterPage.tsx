import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, User, Phone, MapPin, Briefcase, ChevronRight, Lock } from "lucide-react";
import Logo from "../components/Logo";
import axios from "axios";

const MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bid (Beed)", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
    "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri",
    "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const LaborRegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        village: "",
        district: "",
        state: "",
        experience: "",
        password: "",
        confirmPassword: ""
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
            // Updated endpoint for labor registration
            const response = await axios.post("/labor/register", {
                name: formData.name,
                phone: formData.phone,
                village: formData.village,
                district: formData.district,
                state: formData.state,
                experience: formData.experience ? parseInt(formData.experience) : 0,
                password: formData.password
            });

            if (response.status === 201) {
                setIsSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please check your details.");
        } finally {
            setIsLoading(false);
        }
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
                    <h2 className="text-4xl font-black mb-4 text-slate-900 tracking-tight">Registration Sent!</h2>
                    <p className="text-slate-500 mb-10 font-bold text-lg leading-relaxed">Your profile has been sent to Admin for approval. You will be able to log in once approved.</p>
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
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-nature-950 items-center justify-center p-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-50 brightness-[0.6]"
                        alt="Farming background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-nature-950 via-nature-950/30 to-nature-950" />
                </div>

                <div className="relative z-10 max-w-md text-center lg:text-left">
                    <Link to="/" className="inline-flex items-center gap-4 mb-20 justify-center lg:justify-start">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                            <Logo size={32} />
                        </div>
                        <span className="text-3xl font-black text-white italic tracking-tighter">KrushiSarthi</span>
                    </Link>

                    <h2 className="text-5xl font-black text-white mb-8 leading-tight tracking-tighter">
                        Join the <br />
                        Agro-Labor <br />
                        <span className="text-nature-500">Network.</span>
                    </h2>
                    <p className="text-lg text-white/60 font-medium leading-relaxed">
                        Register as a farming expert and connect with farmers looking for your skills in your region.
                    </p>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 bg-slate-50 relative overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto py-20 px-8">
                    <div className="mb-12 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Labor Registration</h1>
                        <p className="text-slate-500 font-bold text-lg">Create your professional profile to start receiving work alerts.</p>
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

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Personal Details */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-nature-600/30" /> Worker Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="label-text">Full Name *</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="name" type="text" placeholder="Ganesh Patil" required
                                                className="input-field pl-14"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label-text">Phone Number *</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="phone" type="tel" placeholder="98XXXXXXXX" required
                                                className="input-field pl-14"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Location Details */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-nature-600/30" /> Work Location
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="label-text">Village *</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                name="village" type="text" placeholder="Village" required
                                                className="input-field pl-12 text-sm"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="label-text">District (Maharashtra) *</label>
                                        <select
                                            name="district" required
                                            className="input-field text-sm"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select District</option>
                                            {MAHARASHTRA_DISTRICTS.map(district => (
                                                <option key={district} value={district.toLowerCase()}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2 text-left">
                                        <label className="label-text">State *</label>
                                        <input
                                            name="state" type="text" value="Maharashtra" required
                                            className="input-field"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Professional Info */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-nature-600/30" /> Professional Experience
                                </h3>
                                <div className="space-y-2">
                                    <label className="label-text">Years of Farming Experience (Optional)</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            name="experience" type="number" placeholder="5"
                                            className="input-field pl-14"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Security */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-nature-600 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-nature-600/30" /> Security
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="label-text">Password *</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="password" type={showPassword ? "text" : "password"} required
                                                className="input-field pl-14"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label-text">Confirm Password *</label>
                                        <input
                                            name="confirmPassword" type="password" required
                                            className="input-field"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full btn-primary !py-6 text-xl flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    <>
                                        Register as Labor
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-slate-500 font-bold pt-6">
                                Looking to hire experts?
                                <Link to="/register" className="text-nature-600 hover:text-nature-500 ml-2 transition-colors">Register as Farmer</Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LaborRegisterPage;
