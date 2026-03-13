import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Eye, EyeOff, LogIn, AlertCircle, Mail, Lock, CheckCircle2 } from "lucide-react";
import axios from "axios";

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email: formData.email,
                password: formData.password
            });

            if (response.data.access) {
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                window.dispatchEvent(new Event('storage'));

                // Check user role and redirect accordingly
                const userData = response.data.user;

                // Check if user has location - either from user data or localStorage
                const farmLocation = localStorage.getItem('farmLocation');
                const hasLocation = (userData.latitude && userData.longitude) || farmLocation;

                if (userData.is_staff || userData.is_superuser) {
                    // Admin user - redirect to admin dashboard
                    navigate("/admin-dashboard");
                } else if (userData.role === 'coordinator') {
                    // Coordinator user - redirect to coordinator dashboard
                    navigate("/coordinator-dashboard");
                } else if (userData.role === 'labor') {
                    // Labor user - redirect to labor dashboard
                    navigate("/labor-dashboard");
                } else if (hasLocation) {
                    // User has location set - redirect to dashboard
                    navigate("/dashboard");
                } else {
                    // No location - redirect to setup
                    navigate("/setup-location");
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Left Section: Branding & Image (Desktop only) */}
            <div className="hidden md:flex md:w-1/2 relative bg-nature-950 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        className="w-full h-full object-cover opacity-50 brightness-[0.6] contrast-110"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-organic-vegetables-growing-in-a-greenhouse-42774-large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12"
                    >
                        <Link to="/" className="inline-flex items-center gap-4 mb-16">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
                                <Sprout className="text-nature-600 w-10 h-10" />
                            </div>
                            <span className="text-4xl font-black text-white tracking-tighter italic">AgroCast</span>
                        </Link>

                        <h2 className="text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                            Empowering The <span className="text-nature-500">Green</span> Revolution.
                        </h2>
                        <p className="text-xl text-white/60 font-medium leading-relaxed mb-12">
                            Join thousands of farmers using real-time data to protect their livelihood and maximize harvest capacity.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Village-level Weather Accuracy",
                                "AI-Powered Pest Predictions",
                                "Real-time Climate Risk Alerts"
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-center gap-4 text-white/80 font-bold"
                                >
                                    <div className="w-6 h-6 rounded-full bg-nature-500/20 flex items-center justify-center border border-nature-500/30">
                                        <CheckCircle2 className="w-4 h-4 text-nature-500" />
                                    </div>
                                    <span>{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-nature-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            </div>

            {/* Right Section: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center mb-12">
                        <Link to="/" className="w-14 h-14 bg-nature-600 rounded-2xl flex items-center justify-center shadow-lg shadow-nature-600/30 mb-4">
                            <Sprout className="text-white w-8 h-8" />
                        </Link>
                        <h1 className="text-3xl font-black text-slate-800 italic">AgroCast</h1>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 font-bold text-lg leading-relaxed">Access your professional farm monitoring cockpit.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="modern-card p-10 bg-white shadow-2xl shadow-slate-200/50"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-black uppercase tracking-tight">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="label-text">Professional Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                    <input
                                        name="email" type="email" placeholder="name@farm.com" required
                                        className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-12 py-4 outline-none transition-all duration-300 placeholder:text-slate-400 font-bold focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5 shadow-sm"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label-text mb-0">Security Password</label>
                                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-nature-600 hover:text-nature-500 transition-colors">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors z-10" />
                                    <input
                                        name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                                        className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-12 py-4 outline-none transition-all duration-300 placeholder:text-slate-400 font-bold focus:border-nature-500 focus:bg-white focus:ring-[6px] focus:ring-nature-500/5 shadow-sm"
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
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full btn-primary flex items-center justify-center gap-4 text-lg !py-5"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <>
                                        <LogIn className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                        <span>Secure Log In</span>
                                    </>
                                )}
                            </button>

                            <div className="pt-8 border-t border-slate-100 mt-10">
                                <p className="text-center text-slate-500 font-bold mb-4">
                                    New to the platform?
                                    <Link to="/register" className="text-nature-600 hover:text-nature-500 ml-2 transition-colors">Apply for Account</Link>
                                </p>
                                <p className="text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    Agricultural Expert?
                                    <Link to="/labor-register" className="text-slate-900 hover:text-nature-600 ml-2 transition-colors">Register as Labor</Link>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Decorative background flair */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-slate-200/40 rounded-full blur-[80px] pointer-events-none" />
            </div>
        </div>
    );
};

export default LoginPage;
