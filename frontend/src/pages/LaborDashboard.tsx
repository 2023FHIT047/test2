import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    User, MapPin, Phone, Briefcase, Power,
    CheckCircle2, Clock, Map, PhoneCall, LogOut, Loader2, RefreshCcw,
    DollarSign, Calendar, TrendingUp, Star, MessageSquare, Bell,
    Search, Filter, Eye, Settings, Award, Wrench, Sprout, Cloud
} from "lucide-react";
import axios from "axios";

const LaborDashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("jobs");
    const [availableJobs, setAvailableJobs] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [weatherData, setWeatherData] = useState<any>(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/labor/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);

            // Fetch available jobs
            try {
                const jobsRes = await axios.get("http://localhost:8000/api/labor/jobs", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvailableJobs(jobsRes.data.results || jobsRes.data || []);
            } catch (e) {
                console.log("No jobs available");
            }

            // Fetch weather data
            if (response.data.latitude && response.data.longitude) {
                try {
                    const weatherRes = await axios.get(`http://localhost:8000/api/weather/?lat=${response.data.latitude}&lon=${response.data.longitude}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWeatherData(weatherRes.data);
                } catch (e) {
                    console.log("Weather not available");
                }
            }
        } catch (err: any) {
            setError("Failed to load profile. Please log in again.");
            if (err.response?.status === 401) navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAvailability = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const newAvailability = profile.availability === 'available' ? 'busy' : 'available';
            const response = await axios.patch("http://localhost:8000/api/labor/availability",
                { availability: newAvailability },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status === "success") {
                setProfile({ ...profile, availability: response.data.availability });
            }
        } catch (err) {
            setError("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: "jobs", label: "Find Jobs", icon: <Briefcase className="w-4 h-4" /> },
        { id: "applications", label: "My Applications", icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
        { id: "weather", label: "Weather", icon: <Cloud className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-emerald-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Labor Dashboard</h1>
                                <p className="text-emerald-100 text-xs">AgroCast Worker Portal</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <User className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-slate-900">{profile?.name}</h2>
                                <p className="text-slate-500 text-sm">{profile?.phone}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span className="text-slate-500 text-xs">{profile?.village}, {profile?.district}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-xl font-bold text-sm ${profile?.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {profile?.availability === 'available' ? 'Available for Work' : 'Currently Busy'}
                            </div>
                            <button
                                onClick={toggleAvailability}
                                disabled={isUpdating}
                                className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${profile?.availability === 'available' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                            >
                                <Power className="w-4 h-4" />
                                {isUpdating ? 'Updating...' : profile?.availability === 'available' ? 'Go Busy' : 'Go Available'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Available Jobs</p>
                                <p className="font-bold text-xl text-slate-900">{availableJobs.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Applications</p>
                                <p className="font-bold text-xl text-slate-900">{myApplications.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Rating</p>
                                <p className="font-bold text-xl text-slate-900">4.5</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Jobs Completed</p>
                                <p className="font-bold text-xl text-slate-900">{profile?.jobs_completed || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap ${activeTab === tab.id ? "bg-emerald-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "jobs" && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Available Job Opportunities</h3>
                        {availableJobs.length > 0 ? (
                            <div className="grid gap-4">
                                {availableJobs.map((job, i) => (
                                    <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{job.title || "Farm Work"}</h4>
                                                <p className="text-slate-500 text-sm mt-1">{job.description || "General farm work"}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location || "Nearby"}</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.wage || "₹500"}/day</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.duration || "1 week"}</span>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>No jobs available right now. Check back later!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "applications" && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">My Applications</h3>
                        {myApplications.length > 0 ? (
                            <div className="space-y-3">
                                {myApplications.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <p className="font-bold text-slate-900">{app.job_title}</p>
                                            <p className="text-slate-500 text-sm">Applied on: {app.applied_date}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {app.status || 'pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>No applications yet. Start applying for jobs!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">My Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Full Name</p>
                                <p className="font-bold text-slate-900">{profile?.name}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Phone Number</p>
                                <p className="font-bold text-slate-900">{profile?.phone}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Location</p>
                                <p className="font-bold text-slate-900">{profile?.village}, {profile?.district}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Skills</p>
                                <p className="font-bold text-slate-900">{profile?.skills || "General Farm Work"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Experience</p>
                                <p className="font-bold text-slate-900">{profile?.experience || 0} years</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-slate-500 text-xs mb-1">Availability Status</p>
                                <p className="font-bold text-slate-900">{profile?.availability}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "weather" && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Local Weather</h3>
                        {weatherData ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <Cloud className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="text-2xl font-bold text-slate-900">{weatherData.temperature || "28"}°C</p>
                                    <p className="text-slate-500 text-sm">Temperature</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl text-center">
                                    <Sprout className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <p className="text-2xl font-bold text-slate-900">{weatherData.humidity || "65"}%</p>
                                    <p className="text-slate-500 text-sm">Humidity</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl text-center">
                                    <Wrench className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                                    <p className="text-2xl font-bold text-slate-900">{weatherData.wind_speed || "12"} km/h</p>
                                    <p className="text-slate-500 text-sm">Wind Speed</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Cloud className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p>Weather data not available. Update your location in profile.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LaborDashboard;
