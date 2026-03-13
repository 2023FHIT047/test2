import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search, MapPin, Briefcase, Phone, ChevronRight,
    ArrowLeft, User, Filter, SlidersHorizontal, LayoutDashboard, Cloud, Activity, AlertTriangle, Leaf, Bug, Beaker, Droplets
} from "lucide-react";
import axios from "axios";

const FindLaborPage = () => {
    const [laborList, setLaborList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLabor = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/labor/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLaborList(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLabor();
    }, []);

    const filteredLabor = laborList.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Standard Sidebar */}
            <aside className="fixed w-20 xl:w-72 h-screen pt-24 pb-24 px-5 flex flex-col gap-2 border-r border-slate-200 bg-white/40 backdrop-blur-2xl hidden md:flex z-50 overflow-y-auto no-scrollbar">
                <Link to="/dashboard"><SidebarItem icon={<LayoutDashboard />} label="Dashboard" /></Link>
                <Link to="/forecast-models"><SidebarItem icon={<Cloud />} label="Forecast Models" /></Link>
                <Link to="/crop-analytics"><SidebarItem icon={<Activity />} label="Crop Analytics" /></Link>
                <Link to="/risk-analytics"><SidebarItem icon={<AlertTriangle />} label="Risk Center" /></Link>
                <div className="h-px bg-slate-200/50 my-6 mx-4" />
                <Link to="/crop-advisory"><SidebarItem icon={<Leaf />} label="Crop Advisory" /></Link>
                <Link to="/dashboard"><SidebarItem icon={<Droplets />} label="Smart Irrigation" /></Link>
                <Link to="/disease-detection"><SidebarItem icon={<Beaker />} label="Crop Disease Detection" /></Link>
                <Link to="/pest-detection"><SidebarItem icon={<Bug />} label="Pest Detection" /></Link>
                <Link to="/find-labor"><SidebarItem icon={<Briefcase />} label="Find Labor" active /></Link>
            </aside>

            <main className="flex-1 ml-0 md:ml-20 xl:ml-72 bg-transparent">
                {/* Header */}
                <header className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16">
                    <div className="max-w-7xl mx-auto px-10 h-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Link>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <UsersIcon className="w-6 h-6 text-nature-600" /> FIND EXPERT LABOR
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-nature-50 rounded-full border border-nature-100 italic">
                                <span className="w-2 h-2 bg-nature-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-nature-700 uppercase tracking-widest">Active Workforce Registry</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="pt-24 px-10 pb-16">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-10">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nature-600 transition-colors" />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-14 pr-6 py-4 font-bold text-slate-700 focus:border-nature-500 outline-none transition-all shadow-xl shadow-slate-200/20"
                                placeholder="Search by name, village or district expert..."
                            />
                        </div>
                        <button className="px-8 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center gap-3 font-black text-xs uppercase tracking-widest text-slate-600 hover:border-nature-500 hover:text-nature-600 transition-all shadow-xl shadow-slate-200/20">
                            <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
                        </button>
                    </div>

                    {/* Labor Grid */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Activity className="w-12 h-12 text-nature-100 animate-pulse mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Workforce Database...</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredLabor.map((labor, i) => (
                                    <motion.div
                                        key={labor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="modern-card p-6 bg-white hover:border-nature-200 hover:shadow-2xl hover:shadow-nature-600/5 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-nature-50 group-hover:text-nature-600 transition-colors duration-500">
                                                <User className="w-8 h-8" />
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${labor.availability === 'available'
                                                    ? 'bg-nature-50 text-nature-600 border-nature-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {labor.availability}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-nature-600 transition-colors">{labor.name}</h3>
                                        <p className="text-slate-500 font-bold text-sm flex items-center gap-2 mb-4 italic">
                                            <MapPin className="w-3 h-3" /> {labor.village}, {labor.district}
                                        </p>

                                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Experience</p>
                                                <p className="text-sm font-black text-slate-800">{labor.experience} Years</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Specialization</p>
                                                <p className="text-sm font-black text-slate-800 italic">General Agri</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/labor/${labor.id}`}
                                                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                View Profile <ChevronRight className="w-3 h-3" />
                                            </Link>
                                            <a
                                                href={`tel:${labor.phone}`}
                                                className="p-3 bg-nature-600 text-white rounded-xl hover:bg-nature-500 transition-all active:scale-95 shadow-lg shadow-nature-600/20"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}

                                {filteredLabor.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="p-10 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 inline-block">
                                            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-black text-lg">No Experts Found Matching Criteria</p>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Try adjusting your search radius or parameters</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
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

const UsersIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export default FindLaborPage;
