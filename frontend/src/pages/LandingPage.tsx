import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/Logo";
import {
    TrendingUp, MapPin, Bell, Leaf,
    ArrowRight, Star, ShieldCheck, Sun, Droplets, CheckCircle2, Wheat, Bug, Beaker, Play, ChevronRight, Menu, X, Phone, Mail, Instagram, Twitter, Linkedin, Check, XCircle, Landmark, HandCoins, ExternalLink,
    Globe
} from "lucide-react";
import InteractiveWeatherMap from "../components/InteractiveWeatherMap";

/* ─── Helper Components ─────────────────────────────────────────────── */

const SectionHeader = ({ subtitle, title, description, center = false }: { subtitle?: string; title: string; description?: string; center?: boolean }) => (
    <div className={`mb-12 ${center ? 'text-center max-w-3xl mx-auto' : ''}`}>
        {subtitle && (
            <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-50 text-forest-700 text-xs font-black uppercase tracking-widest mb-4 border border-forest-100/50 shadow-sm"
            >
                {subtitle}
            </motion.span>
        )}
        <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
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
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
        <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-600 mb-7 group-hover:bg-forest-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
    </motion.div>
);

const StepItem = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
    >
        <div className="w-20 h-20 bg-gradient-to-br from-forest-500 to-forest-700 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-forest-500/30 transform group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h4>
        <p className="text-slate-600 font-medium leading-relaxed">{description}</p>
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

const SchemeCard = ({ scheme, delay }: { scheme: any; delay: number }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay }}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full"
        >
            <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-600 mb-8 group-hover:bg-forest-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm">
                {scheme.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{scheme.name}</h3>
            <p className="text-slate-600 mb-6 flex-grow">{scheme.description}</p>

            <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">{t('schemes.benefits')}</h4>
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
                {t('schemes.visit_official')} <ExternalLink className="w-4 h-4" />
            </a>
        </motion.div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────────────── */

const LandingPage = () => {
    const { language, setLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const features = [
        { icon: <Sun className="w-7 h-7" />, title: t('features.weather.title'), description: t('features.weather.desc') },
        { icon: <ShieldCheck className="w-7 h-7" />, title: t('features.risk.title'), description: t('features.risk.desc') },
        { icon: <Leaf className="w-7 h-7" />, title: t('features.advisory.title'), description: t('features.advisory.desc') },
        { icon: <Bug className="w-7 h-7" />, title: t('features.pests.title'), description: t('features.pests.desc') },
        { icon: <Bell className="w-7 h-7" />, title: t('features.alerts.title'), description: t('features.alerts.desc') },
        { icon: <MapPin className="w-7 h-7" />, title: t('features.mapping.title'), description: t('features.mapping.desc') },
    ];

    const steps = [
        { number: "1", title: t('how_it_works.step1.title'), description: t('how_it_works.step1.desc'), icon: <MapPin className="w-8 h-8" /> },
        { number: "2", title: t('how_it_works.step2.title'), description: t('how_it_works.step2.desc'), icon: <Wheat className="w-8 h-8" /> },
        { number: "3", title: t('how_it_works.step3.title'), description: t('how_it_works.step3.desc'), icon: <Bell className="w-8 h-8" /> },
        { number: "4", title: t('how_it_works.step4.title'), description: t('how_it_works.step4.desc'), icon: <TrendingUp className="w-8 h-8" /> },
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
        { name: t('testimonials.t1.name'), role: t('testimonials.t1.role'), content: t('testimonials.t1.content'), avatar: "R" },
        { name: t('testimonials.t2.name'), role: t('testimonials.t2.role'), content: t('testimonials.t2.content'), avatar: "P" },
        { name: t('testimonials.t3.name'), role: t('testimonials.t3.role'), content: t('testimonials.t3.content'), avatar: "S" },
    ];

    // Disease-specific Do's and Don'ts with exact disease images
    const diseases = [
        {
            name: t('dos_donts.diseases.blast'),
            image: "/images/diseases/blast.png",
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
            name: t('dos_donts.diseases.blight'),
            image: "/images/diseases/blight.png",
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
            name: t('dos_donts.diseases.mildew'),
            image: "/images/diseases/mildew.png",
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
            name: t('dos_donts.diseases.rust'),
            image: "/images/diseases/rust.png",
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
            name: t('dos_donts.diseases.leaf_spot'),
            image: "/images/diseases/leaf_spot.png",
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
            name: t('dos_donts.diseases.root_rot'),
            image: "/images/diseases/root_rot.png",
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
            name: t('dos_donts.diseases.fungal'),
            image: "/images/diseases/fungal.png",
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
            name: t('dos_donts.diseases.viral'),
            image: "/images/diseases/mosaic.png",
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
        { question: "How does KrushiSarthi help farmers?", answer: "KrushiSarthi provides AI-powered weather forecasts, crop advisories, pest predictions, and smart alerts to help farmers make data-driven decisions and maximize their yields." },
        { question: "Is KrushiSarthi free to use?", answer: "Yes, KrushiSarthi offers a free starter plan with basic weather forecasts and 5 field alerts per month. You can upgrade to premium plans for advanced features." },
        { question: "How accurate are the weather predictions?", answer: "Our weather predictions use advanced ML models and satellite data, providing up to 85% accuracy for hyper-local forecasts." },
        { question: "Can I use KrushiSarthi in my local language?", answer: "Yes! KrushiSarthi supports multiple Indian languages including Hindi, Marathi, Telugu, and more through our voice assistant feature." },
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
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                            <Logo size={24} />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">KrushiSarthi</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#features" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.features')}</a>
                        <a href="#how-it-works" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.how_it_works')}</a>
                        <a href="#schemes" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.schemes')}</a>
                        <a href="#dos-donts" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.dos_donts')}</a>
                        <a href="#testimonials" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.testimonials')}</a>
                        <a href="#faq" className="text-slate-600 hover:text-forest-600 font-bold transition-colors">{t('nav.faq')}</a>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative mr-4">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 font-bold transition-all border border-slate-200"
                            >
                                <Globe className="w-4 h-4 text-forest-600" />
                                <span>{language === 'en' ? 'English' : language === 'mr' ? 'मराठी' : 'हिंदी'}</span>
                            </button>

                            {langMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50 p-1"
                                >
                                    {(['en', 'mr', 'hi'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setLangMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all ${language === lang ? 'text-forest-700 bg-forest-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {lang === 'en' ? 'English' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        <Link to="/login" className="text-slate-600 hover:text-slate-900 font-bold transition-colors">{t('nav.login')}</Link>
                        <Link to="/register" className="bg-gradient-to-r from-forest-500 to-forest-700 hover:from-forest-600 hover:to-forest-800 text-white px-7 py-3 rounded-2xl font-black transition-all shadow-lg shadow-forest-500/25 active:scale-95">
                            {t('nav.get_started')}
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
                            <a href="#features" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.features')}</a>
                            <a href="#how-it-works" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.how_it_works')}</a>
                            <a href="#schemes" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.schemes')}</a>
                            <a href="#dos-donts" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.dos_donts')}</a>
                            <a href="#testimonials" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.testimonials')}</a>
                            <a href="#faq" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('nav.faq')}</a>
                            <div className="flex flex-col gap-2 mt-2 py-4 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{t('nav.select_language')}</p>
                                <div className="flex gap-2">
                                    {(['en', 'mr', 'hi'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`flex-1 py-3 rounded-xl text-sm font-black border transition-all ${language === lang ? 'bg-forest-600 text-white border-forest-600 shadow-lg shadow-forest-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                                        >
                                            {lang === 'en' ? 'English' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Link to="/login" className="text-slate-600 font-medium">{t('nav.login')}</Link>
                            <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium text-sm text-center">
                                {t('nav.get_started')}
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
                            src="/images/hero/agriculture-main.png"
                            alt="Farm Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
                    </div>

                    <div className="absolute top-20 right-20 w-72 h-72 bg-forest-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-soil-500/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest mb-8 shadow-xl">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                                    <Sun className="w-4 h-4 text-wheat-500" />
                                </motion.div>
                                {t('landing.trusted_by')}
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                                {t('landing.hero_title')}
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl leading-relaxed font-medium">
                                {t('landing.hero_subtitle')}
                            </p>

                            <div className="flex flex-wrap gap-5">
                                <Link to="/register" className="bg-gradient-to-r from-forest-500 to-forest-700 hover:from-forest-600 hover:to-forest-800 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 transition-all shadow-2xl shadow-forest-900/40 hover:-translate-y-1 active:scale-95 group">
                                    {t('landing.start_trial')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <a href="#features" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-white/20 transition-all hover:-translate-y-1 shadow-xl">
                                    {t('landing.see_features')}
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
                <section className="py-24 bg-forest-50/20 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-soil-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <SectionHeader
                            subtitle={t('landing.demo_subtitle')}
                            title={t('landing.demo_title')}
                            description={t('landing.demo_desc')}
                            center
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white shadow-forest-900/5"
                        >
                            <InteractiveWeatherMap />
                        </motion.div>
                    </div>
                </section>

                {/* ── Features Section ───────────────────────────────────────── */}
                <section id="features" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle={t('features.subtitle')}
                            title={t('features.title')}
                            description={t('features.description')}
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
                <section id="how-it-works" className="py-28 bg-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-[30%] bg-forest-50/30 -skew-y-3 -translate-y-1/2" />
                    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                        <SectionHeader
                            subtitle={t('how_it_works.subtitle')}
                            title={t('how_it_works.title')}
                            description={t('how_it_works.description')}
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative">
                            {/* Animated Connector Line */}
                            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    whileInView={{ x: "0%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="w-full h-full bg-gradient-to-r from-forest-500 via-wheat-500 to-forest-500"
                                />
                            </div>

                            {steps.map((step, index) => (
                                <div key={index} className="relative group">
                                    <StepItem {...step} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Government Schemes Section ────────────────────────────────── */}
                <section id="schemes" className="py-28 bg-forest-50/10">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle={t('schemes.subtitle')}
                            title={t('schemes.title')}
                            description={t('schemes.description')}
                            center
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {schemesList.map((scheme, index) => (
                                <SchemeCard key={index} scheme={scheme} delay={index * 0.1} />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-20 text-center"
                        >
                            <a
                                href="https://krishi.maharashtra.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white px-10 py-5 rounded-2xl font-black hover:from-forest-700 hover:to-forest-800 transition-all shadow-2xl shadow-forest-500/30 hover:-translate-y-1 active:scale-95 group"
                            >
                                View All Schemes <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ── Do's and Don'ts for Diseases ───────────────────────────────── */}
                <section id="dos-donts" className="py-24 bg-slate-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <SectionHeader
                            subtitle={t('dos_donts.subtitle')}
                            title={t('dos_donts.title')}
                            description={t('dos_donts.description')}
                            center
                        />
                    </div>

                    {/* Horizontal Scrollable Carousel */}
                    <div className="relative">
                        {/* Gradient overlays for swipe hint */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-auto pb-8 px-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
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
                                                    <Check className="w-4 h-4" /> {t('dos_donts.dos')}
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
                                                    <XCircle className="w-4 h-4" /> {t('dos_donts.donts')}
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

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-xl flex items-center justify-center text-slate-600 hover:bg-forest-600 hover:text-white transition-all z-20 group"
                        >
                            <ArrowRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-xl flex items-center justify-center text-slate-600 hover:bg-forest-600 hover:text-white transition-all z-20 group"
                        >
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex justify-center mt-6 gap-3">
                            <span className="text-forest-600/60 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-px bg-forest-200" />
                                Use arrows or swipe to browse
                                <div className="w-8 h-px bg-forest-200" />
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Video Carousel Section ───────────────────────────────────────────── */}
                <section className="py-24 bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-500 to-transparent opacity-30" />
                    <div className="mb-12 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-500/10 text-forest-400 text-xs font-black uppercase tracking-widest mb-4 border border-forest-500/20 shadow-sm"
                            >
                                Watch More
                            </motion.span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Farming & Weather Videos</h2>
                            <p className="text-lg text-slate-400">Learn about agriculture and weather patterns from experts</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="flex animate-scroll gap-8">
                            {[...videos, ...videos, ...videos].map((video, index) => (
                                <a
                                    key={index}
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 w-80 md:w-[450px] group transition-all duration-500"
                                >
                                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video border-4 border-white/5">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-forest-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                                <Play className="w-8 h-8 text-forest-600 fill-forest-600" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <p className="text-white font-black text-lg tracking-tight">{video.title}</p>
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
                            description="Hear from our community of successful farmers who have transformed their yields with KrushiSarthi."
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
                            description="Everything you need to know about KrushiSarthi platform and features."
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
                <section className="py-32 bg-gradient-to-br from-forest-700 via-forest-800 to-soil-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-wheat-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-forest-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                                Ready to Transform Your Farm?
                            </h2>
                            <p className="text-xl md:text-2xl text-forest-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                Join over 10,000 farmers who are already using KrushiSarthi to increase their yields and reduce risks.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link to="/register" className="bg-white text-forest-700 px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-forest-50 transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
                                    Get Started Free
                                </Link>
                                <a href="#features" className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-white/10 transition-all hover:-translate-y-1">
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
                            <div className="flex items-center gap-3 mb-6 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                    <Logo size={24} />
                                </div>
                                <span className="text-xl font-black tracking-tight">KrushiSarthi</span>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed mb-8">
                                Empowering Indian farmers with AI-powered weather forecasts and crop intelligence for better yields and reduced risks.
                            </p>
                            <div className="flex gap-5">
                                <a href="#" className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center hover:bg-forest-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center hover:bg-forest-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center hover:bg-forest-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
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
                        © 2026 KrushiSarthi. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
