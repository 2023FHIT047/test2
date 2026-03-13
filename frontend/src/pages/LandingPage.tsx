import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Cloud, Sprout, TrendingUp, MapPin, Bell, Leaf,
    ArrowRight, Star, ShieldCheck, Sun, Droplets, CheckCircle2, Wheat, Bug, Beaker, Play, ChevronRight, Menu, X, Phone, Mail, Instagram, Twitter, Linkedin, Check, XCircle, Landmark, HandCoins, ExternalLink
} from "lucide-react";
import { useState } from "react";
import InteractiveWeatherMap from "../components/InteractiveWeatherMap";

/* ─── Helper Components ─────────────────────────────────────────────── */

const SectionHeader = ({ subtitle, title, description, center = false }: { subtitle?: string; title: string; description?: string; center?: boolean }) => (
    <div className={`mb-12 ${center ? 'text-center max-w-3xl mx-auto' : ''}`}>
        {subtitle && (
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4"
            >
                {subtitle}
            </motion.span>
        )}
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
        >
            {title}
        </motion.h2>
        {description && (
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600"
            >
                {description}
            </motion.p>
        )}
    </div>
);

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const StepItem = ({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
    >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-emerald-500/30">
            {icon}
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
        <p className="text-slate-600">{description}</p>
    </motion.div>
);

const TestimonialCard = ({ name, role, content, avatar, rating = 5 }: { name: string; role: string; content: string; avatar: string; rating?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg"
    >
        <div className="flex gap-1 mb-4">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
        </div>
        <p className="text-slate-700 leading-relaxed mb-6">{content}</p>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {avatar}
            </div>
            <div>
                <div className="font-bold text-slate-900">{name}</div>
                <div className="text-slate-500 text-sm">{role}</div>
            </div>
        </div>
    </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-b border-slate-200"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left"
            >
                <span className="text-lg font-semibold text-slate-900">{question}</span>
                <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pb-5"
                >
                    <p className="text-slate-600">{answer}</p>
                </motion.div>
            )}
        </motion.div>
    );
};

const SchemeCard = ({ scheme, delay }: { scheme: any; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
    >
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            {scheme.icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{scheme.name}</h3>
        <p className="text-slate-600 mb-6 flex-grow">{scheme.description}</p>
        
        <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Key Benefits</h4>
            <ul className="space-y-2">
                {scheme.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
        
        <a 
            href={scheme.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-slate-50 text-slate-900 font-semibold rounded-2xl flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
        >
            Visit Official Website <ExternalLink className="w-4 h-4" />
        </a>
    </motion.div>
);

/* ─── Main Page ──────────────────────────────────────────────────────── */

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const features = [
        { icon: <Sun className="w-7 h-7" />, title: "Weather Forecasting", description: "Hyper-local hourly forecasts powered by satellite data and ML models for your exact location." },
        { icon: <ShieldCheck className="w-7 h-7" />, title: "Risk Prediction", description: "AI-powered crop risk assessment using Random Forest & XGBoost for weather-related damage." },
        { icon: <Leaf className="w-7 h-7" />, title: "Crop Advisory", description: "Smart recommendations for irrigation, fertilization, and pest control based on real-time data." },
        { icon: <Bug className="w-7 h-7" />, title: "Pest Detection", description: "Predict pest and disease outbreaks by analyzing humidity, temperature, and weather patterns." },
        { icon: <Bell className="w-7 h-7" />, title: "Smart Alerts", description: "Instant notifications for storms, heatwaves, drought, and frost via SMS and push alerts." },
        { icon: <MapPin className="w-7 h-7" />, title: "Farm Mapping", description: "Interactive maps with rain heatmaps, wind direction, and soil moisture layers." },
    ];

    const steps = [
        { number: "1", title: "Pin Your Farm", description: "Enter your village location or use GPS to set your farm's exact coordinates on the map.", icon: <MapPin className="w-8 h-8" /> },
        { number: "2", title: "Add Your Crops", description: "Tell us what you grow - we customize every alert and advisory for your specific crops.", icon: <Wheat className="w-8 h-8" /> },
        { number: "3", title: "Get Live Alerts", description: "Receive real-time notifications for any weather event that could affect your field.", icon: <Bell className="w-8 h-8" /> },
        { number: "4", title: "Boost Your Yield", description: "Use data-driven insights to make smarter decisions and maximize farm profitability.", icon: <TrendingUp className="w-8 h-8" /> },
    ];

    const schemesList = [
        {
            name: "PM-KISAN Samman Nidhi",
            description: "Provides ₹6000 per year to eligible farmers in three installments.",
            benefits: ["Direct financial support to farmers."],
            website: "https://pmkisan.gov.in",
            icon: <HandCoins className="w-7 h-7" />
        },
        {
            name: "Mahatma Jyotirao Phule Shetkari Karj Mukti Yojana",
            description: "Loan waiver scheme for farmers in Maharashtra.",
            benefits: ["Reduces financial burden of agricultural loans."],
            website: "https://mjpsky.maharashtra.gov.in",
            icon: <Landmark className="w-7 h-7" />
        },
        {
            name: "Pradhan Mantri Fasal Bima Yojana",
            description: "Crop insurance scheme protecting farmers against crop loss due to natural disasters.",
            benefits: ["Insurance coverage for crop damage."],
            website: "https://pmfby.gov.in",
            icon: <ShieldCheck className="w-7 h-7" />
        },
        {
            name: "Pradhan Mantri Krishi Sinchai Yojana",
            description: "Provides financial assistance for irrigation systems.",
            benefits: ["Improves water management and irrigation efficiency."],
            website: "https://pmksy.gov.in",
            icon: <Droplets className="w-7 h-7" />
        },
        {
            name: "Soil Health Card Scheme",
            description: "Provides soil testing reports and recommendations for farmers.",
            benefits: ["Helps improve crop productivity and soil health."],
            website: "https://soilhealth.dac.gov.in",
            icon: <Beaker className="w-7 h-7" />
        }
    ];

    const testimonials = [
        { name: "Ramesh Singh", role: "Wheat Farmer, Madhya Pradesh", content: "AgroCast helped me save my wheat crop during an unexpected heatwave. The 6-hour advance warning gave me time to irrigate and protect my harvest.", avatar: "R" },
        { name: "Priya Devi", role: "Vegetable Grower, Maharashtra", content: "The pest prediction feature is incredible! I was able to prevent a fungal outbreak in my tomato crop before it spread. Highly recommended for all farmers.", avatar: "P" },
        { name: "Suresh Kumar", role: "Rice Farmer, Tamil Nadu", content: "The weather forecasts are so accurate for my village. I've reduced my irrigation costs by 40% and improved my rice yield significantly.", avatar: "S" },
    ];

    // Disease-specific Do's and Don'ts with exact disease images
    const diseases = [
        {
            name: "Blast Disease",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
            dos: [
                "Apply nitrogen fertilizer in split doses",
                "Maintain proper plant spacing for airflow",
                "Use resistant varieties when available",
                "Monitor humidity levels regularly",
            ],
            donts: [
                "Avoid excessive nitrogen application",
                "Don't over irrigate fields",
                "Avoid planting near infected fields",
                "Don't ignore early symptoms",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Bacterial Blight",
            image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
            dos: [
                "Use disease-free seeds and planting material",
                "Apply copper-based fungicides preventively",
                "Remove and destroy infected plant parts",
                "Practice crop rotation",
            ],
            donts: [
                "Don't work in wet fields",
                "Avoid overhead irrigation",
                "Don't use contaminated tools",
                "Don't compost infected debris",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Powdery Mildew",
            image: "https://images.unsplash.com/photo-1598516082726-253c3014a682?w=400&h=300&fit=crop",
            dos: [
                "Ensure good air circulation around plants",
                "Apply sulfur-based fungicides early",
                "Remove severely infected leaves",
                "Water at the base not on foliage",
            ],
            donts: [
                "Don't over fertilize with nitrogen",
                "Avoid shade conditions",
                "Don't plant too densely",
                "Don't ignore white powder signs",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Rust Disease",
            image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop",
            dos: [
                "Apply fungicides at first sign of infection",
                "Use resistant crop varieties",
                "Remove alternate host plants",
                "Monitor fields weekly",
            ],
            donts: [
                "Don't delay treatment",
                "Avoid wet foliage for long",
                "Don't ignore orange-brown spots",
                "Don't skip preventive sprays",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Leaf Spot",
            image: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=400&h=300&fit=crop",
            dos: [
                "Remove infected leaves promptly",
                "Apply appropriate fungicides",
                "Improve drainage in fields",
                "Use mulch to prevent soil splash",
            ],
            donts: [
                "Don't overhead water",
                "Avoid working with wet plants",
                "Don't ignore brown spots",
                "Don't neglect field sanitation",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Root Rot",
            image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
            dos: [
                "Ensure proper soil drainage",
                "Use biocontrol agents",
                "Practice crop rotation",
                "Apply fungicides to soil",
            ],
            donts: [
                "Avoid overwatering",
                "Don't plant in compacted soil",
                "Avoid poorly drained areas",
                "Don't ignore wilting plants",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Fungal Infection",
            image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
            dos: [
                "Use fungicides as recommended",
                "Remove infected plant parts",
                "Improve air circulation",
                "Apply preventive sprays",
            ],
            donts: [
                "Don't ignore black spots",
                "Avoid high humidity conditions",
                "Don't use contaminated equipment",
                "Don't delay treatment",
            ],
            colorClass: "bg-gray-800"
        },
        {
            name: "Viral Disease",
            image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop",
            dos: [
                "Use virus-free planting material",
                "Control insect vectors",
                "Remove infected plants immediately",
                "Practice quarantine measures",
            ],
            donts: [
                "Don't save seeds from infected plants",
                "Don't ignore mosaic patterns",
                "Avoid spreading through tools",
                "Don't ignore stunted growth",
            ],
            colorClass: "bg-gray-800"
        }
    ];

    const faqs = [
        { question: "How does AgroCast help farmers?", answer: "AgroCast provides AI-powered weather forecasts, crop advisories, pest predictions, and smart alerts to help farmers make data-driven decisions and maximize their yields." },
        { question: "Is AgroCast free to use?", answer: "Yes, AgroCast offers a free starter plan with basic weather forecasts and 5 field alerts per month. You can upgrade to premium plans for advanced features." },
        { question: "How accurate are the weather predictions?", answer: "Our weather predictions use advanced ML models and satellite data, providing up to 85% accuracy for hyper-local forecasts." },
        { question: "Can I use AgroCast in my local language?", answer: "Yes! AgroCast supports multiple Indian languages including Hindi, Marathi, Telugu, and more through our voice assistant feature." },
    ];

    const videos = [
        { thumbnail: "https://img.youtube.com/vi/xXJXKfsIiBc/maxresdefault.jpg", youtubeUrl: "https://youtube.com/shorts/xXJXKfsIiBc?si=DNidiGPh9bk64VPP", title: "Smart Farming Techniques" },
        { thumbnail: "https://img.youtube.com/vi/INYAzC0ue0s/maxresdefault.jpg", youtubeUrl: "https://youtu.be/INYAzC0ue0s?si=kdvEFyJ6hxBXUAeV", title: "Weather Forecasting" },
        { thumbnail: "https://img.youtube.com/vi/cM5XuAhxirg/maxresdefault.jpg", youtubeUrl: "https://youtu.be/cM5XuAhxirg?si=9Pkd0DsgzOOe3Qy7", title: "Modern Agriculture" },
        { thumbnail: "https://img.youtube.com/vi/q7JnJ0oBa94/maxresdefault.jpg", youtubeUrl: "https://youtu.be/q7JnJ0oBa94?si=zAFBaTRBW_nhJ94K", title: "Crop Management" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* ── Navigation ───────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Sprout className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">AgroCast</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#features" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">How It Works</a>
                        <a href="#schemes" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Schemes</a>
                        <a href="#dos-donts" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Do's & Don'ts</a>
                        <a href="#testimonials" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Testimonials</a>
                        <a href="#faq" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">FAQ</a>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Login</Link>
                        <Link to="/register" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25">
                            Get Started
                        </Link>
                    </div>

                    <button
                        className="lg:hidden p-2 text-slate-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4">
                        <div className="flex flex-col gap-4">
                            <a href="#features" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                            <a href="#how-it-works" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                            <a href="#schemes" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Schemes</a>
                            <a href="#dos-donts" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Do's & Don'ts</a>
                            <a href="#testimonials" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                            <a href="#faq" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                            <Link to="/login" className="text-slate-600 font-medium">Login</Link>
                            <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium text-sm text-center">
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="pt-20">
                {/* ── Hero Section ───────────────────────────────────────────── */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80"
                            alt="Farm Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
                    </div>

                    <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-8">
                                <Cloud className="w-4 h-4 text-emerald-400" /> Trusted by 10,000+ Farmers
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                Smart Farming <br />
                                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Intelligence</span> Platform
                            </h1>

                            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                                Empower your farm with precision weather forecasts, AI-powered crop advisories, and early climate alerts. Make data-driven decisions for better yields.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/register" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30">
                                    Start Free Trial <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a href="#features" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all">
                                    See Features
                                </a>
                            </div>

                            <div className="flex items-center gap-6 mt-10">
                                <div className="flex -space-x-2">
                                    {["R", "P", "S", "A", "K"].map((letter, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-white">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <div className="text-sm text-slate-300">4.9/5 from 500+ reviews</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-1.5 h-1.5 bg-white rounded-full"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* ── Interactive Weather Map ────────────────────────────────── */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Live Demo"
                            title="See Weather in Your Area"
                            description="Explore hyper-local weather data for villages across India."
                            center
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <InteractiveWeatherMap />
                        </motion.div>
                    </div>
                </section>

                {/* ── Features Section ───────────────────────────────────────── */}
                <section id="features" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Platform Features"
                            title="Everything Your Farm Needs"
                            description="From village-level weather to AI-powered crop advisories, AgroCast has you covered."
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} delay={index * 0.1} />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 text-center"
                        >
                            <Link to="/register" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                                View All Features <ChevronRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ── How It Works ───────────────────────────────────────────── */}
                <section id="how-it-works" className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Simple Process"
                            title="How AgroCast Works"
                            description="Get started in minutes - no technical knowledge required."
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <StepItem {...step} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Government Schemes Section ────────────────────────────────── */}
                <section id="schemes" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Government Support"
                            title="Government Schemes for Farmers"
                            description="Explore Maharashtra and Central Government schemes that support farmers with subsidies, insurance, irrigation assistance, and financial benefits."
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {schemesList.map((scheme, index) => (
                                <SchemeCard key={index} scheme={scheme} delay={index * 0.1} />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 text-center"
                        >
                            <a 
                                href="https://krishi.maharashtra.gov.in" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
                            >
                                View All Schemes <ArrowRight className="w-5 h-5" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ── Do's and Don'ts for Diseases ───────────────────────────────── */}
                <section id="dos-donts" className="py-24 bg-slate-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Disease Prevention"
                            title="Do's & Don'ts for Common Diseases"
                            description="Follow these guidelines to prevent and manage common crop diseases."
                            center
                        />
                    </div>

                    {/* Horizontal Scrollable Carousel */}
                    <div className="relative">
                        {/* Gradient overlays for swipe hint */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                        <div
                            className="flex gap-6 overflow-x-auto pb-6 px-8 snap-x snap-mandatory scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {[...diseases, ...diseases].map((disease, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (index % diseases.length) * 0.1 }}
                                    className="flex-shrink-0 w-80 md:w-96 snap-center"
                                >
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                                        {/* Disease Image */}
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={disease.image}
                                                alt={disease.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gray-900/70 px-6 py-3">
                                                <h3 className="text-xl font-bold text-white">{disease.name}</h3>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                    <Check className="w-4 h-4" /> Do's
                                                </h4>
                                                <ul className="space-y-2">
                                                    {disease.dos.slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                    <XCircle className="w-4 h-4" /> Don'ts
                                                </h4>
                                                <ul className="space-y-2">
                                                    {disease.donts.slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Swipe indicator */}
                        <div className="flex justify-center mt-4 gap-2">
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 rotate-180" /> Swipe to view more <ChevronRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Video Carousel Section ───────────────────────────────────────────── */}
                <section className="py-16 bg-slate-900 overflow-hidden">
                    <div className="mb-8">
                        <SectionHeader
                            subtitle="Watch More"
                            title="Farming & Weather Videos"
                            description="Learn about agriculture and weather patterns"
                            center
                        />
                    </div>
                    <div className="relative">
                        <div className="flex animate-scroll gap-6">
                            {[...videos, ...videos, ...videos].map((video, index) => (
                                <a
                                    key={index}
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 w-80 md:w-96 group"
                                >
                                    <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-white font-medium text-sm">{video.title}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Video Carousel Section ───────────────────────────────────────────── */}
                <section className="py-16 bg-slate-900 overflow-hidden">
                    <div className="mb-8">
                        <SectionHeader
                            subtitle="Watch More"
                            title="Farming & Weather Videos"
                            description="Learn about agriculture and weather patterns"
                            center
                        />
                    </div>
                    <div className="relative">
                        <div className="flex animate-scroll gap-6">
                            {[...videos, ...videos, ...videos].map((video, index) => (
                                <a
                                    key={index}
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 w-80 md:w-96 group"
                                >
                                    <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-white font-medium text-sm">{video.title}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
                {/* ── Testimonials Section ────────────────────────────────────────── */}
                <section id="testimonials" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Success Stories"
                            title="Trusted by Farmers Across India"
                            description="Hear from our community of successful farmers who have transformed their yields with AgroCast."
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={index} {...testimonial} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ────────────────────────────────────────────────── */}
                <section id="faq" className="py-24 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle="Common Questions"
                            title="Frequently Asked Questions"
                            description="Everything you need to know about AgroCast platform and features."
                            center
                        />

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} {...faq} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ────────────────────────────────────────────── */}
                <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Farm?
                            </h2>
                            <p className="text-xl text-emerald-100 mb-10">
                                Join over 10,000 farmers who are already using AgroCast to increase their yields and reduce risks.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/register" className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-emerald-50 transition-all shadow-lg">
                                    Get Started Free
                                </Link>
                                <a href="#features" className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
                                    Learn More
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Sprout className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold">AgroCast</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Empowering Indian farmers with AI-powered weather forecasts and crop intelligence for better yields and reduced risks.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Product</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Company</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Contact</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> +91 98765 43210
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> info@agrocast.in
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                        © 2024 AgroCast. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
