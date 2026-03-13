import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Shield, Users, Briefcase, Bell, CheckCircle2, XCircle,
    ChevronRight, LogOut, Loader2, Send, Activity, Trash2, Search,
    MapPin, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets,
    TrendingUp, TrendingDown, AlertTriangle, Eye, BarChart3,
    MessageSquare, Settings, Map, Calendar, Clock, Award
} from "lucide-react";
import axios from "axios";

const CoordinatorDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [farmersList, setFarmersList] = useState<any[]>([]);
    const [laborList, setLaborList] = useState<any[]>([]);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [notificationForm, setNotificationForm] = useState({ title: "", message: "", type: "general" });
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [userData, setUserData] = useState<any>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserData(user);

                // Fetch weather for coordinator's district
                if (user.assigned_district) {
                    try {
                        const weatherRes = await axios.get(`http://localhost:8000/api/weather/village-weather/`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setWeatherData(weatherRes.data);
                    } catch (e) {
                        console.log("Village weather not available", e);
                    }
                }
            }

            // Fetch farmers - for coordinators, use district filter
            try {
                const farmersRes = await axios.get("http://localhost:8000/api/authentication/coordinators/farmers", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const allFarmers = farmersRes.data || [];
                setFarmersList(allFarmers);
                // Calculate stats from fetched data
                setStats({
                    total_farmers: allFarmers.length,
                    total_labor: 0,
                    active_labor: 0
                });
            } catch (e) {
                setFarmersList([]);
                setStats({ total_farmers: 0, total_labor: 0, active_labor: 0 });
            }

            // Fetch labor in coordinator's district
            try {
                const laborRes = await axios.get("http://localhost:8000/api/labor/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLaborList(laborRes.data.results || laborRes.data || []);
            } catch (e) {
                setLaborList([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/authentication/coordinators/send-alert",
                { title: notificationForm.title, message: notificationForm.message, type: notificationForm.type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Notification sent to all farmers in your district!");
            setNotificationForm({ title: "", message: "", type: "general" });
        } catch (err) {
            alert("Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredFarmers = farmersList.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.village?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "farmers", label: "Farmers", icon: <Users className="w-4 h-4" /> },
        { id: "labor", label: "Labor", icon: <Briefcase className="w-4 h-4" /> },
        { id: "alerts", label: "Send Alerts", icon: <Bell className="w-4 h-4" /> },
        { id: "weather", label: "Weather", icon: <Cloud className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Coordinator Dashboard</h1>
                                <p className="text-purple-100 text-xs">
                                    {userData?.assigned_district ? `Managing: ${userData.assigned_district.charAt(0).toUpperCase() + userData.assigned_district.slice(1)} District` : 'Regional Manager'}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome, Coordinator!</h2>
                    <p className="text-purple-100">You are managing {userData?.assigned_district || 'your assigned region'} in Maharashtra</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Farmers</p>
                                <p className="font-bold text-xl text-slate-900">{stats?.total_farmers || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Labor</p>
                                <p className="font-bold text-xl text-slate-900">{stats?.total_labor || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Available Labor</p>
                                <p className="font-bold text-xl text-slate-900">{stats?.active_labor || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">District</p>
                                <p className="font-bold text-xl text-slate-900 capitalize">{userData?.assigned_district || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather Alert Banner */}
                {weatherData && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Cloud className="w-12 h-12" />
                                <div>
                                    <p className="text-blue-100 text-sm">Current Weather</p>
                                    <p className="text-3xl font-bold">{weatherData.temperature || "28"}°C</p>
                                    <p className="text-blue-100">{weatherData.description || "Partly Cloudy"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="flex items-center gap-2"><Droplets className="w-4 h-4" /> Humidity: {weatherData.humidity || "65"}%</p>
                                <p className="flex items-center gap-2"><Wind className="w-4 h-4" /> Wind: {weatherData.wind_speed || "12"} km/h</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap ${activeTab === tab.id ? "bg-purple-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search farmers or labor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-4">District Overview</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="font-medium">Total Farmers</span>
                                    <span className="font-bold text-blue-600">{stats?.total_farmers || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="font-medium">Total Labor</span>
                                    <span className="font-bold text-green-600">{stats?.total_labor || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="font-medium">Active Labor</span>
                                    <span className="font-bold text-amber-600">{stats?.active_labor || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setActiveTab("alerts")} className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-left">
                                    <Bell className="w-6 h-6 text-amber-600 mb-2" />
                                    <p className="font-bold text-slate-800">Send Alert</p>
                                </button>
                                <button onClick={() => setActiveTab("weather")} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-left">
                                    <Cloud className="w-6 h-6 text-blue-600 mb-2" />
                                    <p className="font-bold text-slate-800">Weather</p>
                                </button>
                                <button onClick={() => setActiveTab("farmers")} className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-left">
                                    <Users className="w-6 h-6 text-green-600 mb-2" />
                                    <p className="font-bold text-slate-800">View Farmers</p>
                                </button>
                                <button onClick={() => setActiveTab("labor")} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left">
                                    <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
                                    <p className="font-bold text-slate-800">View Labor</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Farmers Tab */}
                {activeTab === "farmers" && (
                    <div className="bg-white rounded-2xl p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Farmers in Your District</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                                        <th className="pb-3">Name</th>
                                        <th className="pb-3">Village</th>
                                        <th className="pb-3">Crop</th>
                                        <th className="pb-3">Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredFarmers.slice(0, 10).map(farmer => (
                                        <tr key={farmer.id} className="hover:bg-slate-50">
                                            <td className="py-3 font-medium">{farmer.name}</td>
                                            <td className="py-3 text-slate-500">{farmer.village || 'N/A'}</td>
                                            <td className="py-3 text-slate-500">{farmer.crop_type || 'N/A'}</td>
                                            <td className="py-3 text-slate-500">{farmer.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredFarmers.length === 0 && (
                                <p className="text-center text-slate-500 py-8">No farmers found</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Labor Tab */}
                {activeTab === "labor" && (
                    <div className="bg-white rounded-2xl p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Labor in Your District</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                                        <th className="pb-3">Name</th>
                                        <th className="pb-3">Village</th>
                                        <th className="pb-3">Skills</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {laborList.slice(0, 10).map(labor => (
                                        <tr key={labor.id} className="hover:bg-slate-50">
                                            <td className="py-3 font-medium">{labor.name}</td>
                                            <td className="py-3 text-slate-500">{labor.village || 'N/A'}</td>
                                            <td className="py-3 text-slate-500">{labor.skills || labor.experience}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${labor.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {labor.status || 'pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {laborList.length === 0 && (
                                <p className="text-center text-slate-500 py-8">No labor found</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Alerts Tab */}
                {activeTab === "alerts" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Send Alert to Your District</h3>
                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alert Title</label>
                                    <input required value={notificationForm.title} onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl" placeholder="e.g. Heavy Rain Warning" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select value={notificationForm.type} onChange={e => setNotificationForm({ ...notificationForm, type: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl">
                                        <option value="weather">Weather Alert</option>
                                        <option value="disease">Disease Alert</option>
                                        <option value="advisory">Advisory</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                    <textarea required rows={4} value={notificationForm.message} onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl" placeholder="Enter alert message..." />
                                </div>
                                <button disabled={isSending} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Send to All in District</>}
                                </button>
                            </form>
                        </div>
                        <div className="bg-slate-900 rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-4">Preview</h3>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-xs text-purple-400 uppercase mb-1">{notificationForm.type || 'Alert'}</p>
                                <p className="font-bold text-xl">{notificationForm.title || 'Title'}</p>
                                <p className="text-slate-400 mt-2">{notificationForm.message || 'Message preview'}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">This alert will be sent to all farmers and labor in {userData?.assigned_district || 'your district'}</p>
                        </div>
                    </div>
                )}

                {/* Weather Tab */}
                {activeTab === "weather" && (
                    <div className="space-y-6">
                        {/* District Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Your District</p>
                                    <h2 className="text-2xl font-bold">{weatherData?.district || userData?.assigned_district || 'N/A'}</h2>
                                    <p className="text-blue-100 mt-1">{weatherData?.total_villages || 0} Villages</p>
                                </div>
                                <div className="text-right">
                                    <Cloud className="w-12 h-12 mx-auto" />
                                    <p className="text-sm mt-1">Village Weather</p>
                                </div>
                            </div>
                        </div>

                        {/* Village Weather Cards */}
                        {weatherData?.villages ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {weatherData.villages.map((village: any, index: number) => (
                                    <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-purple-600" />
                                                <h4 className="font-bold text-slate-900">{village.village_name}</h4>
                                            </div>
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{village.district}</span>
                                        </div>

                                        {/* Current Weather */}
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                            <div>
                                                <p className="text-3xl font-bold text-slate-900">{village.current.temperature}°C</p>
                                                <p className="text-sm text-slate-500">{village.current.condition}</p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="flex items-center gap-1 text-slate-600"><Droplets className="w-3 h-3" /> {village.current.humidity}%</p>
                                                <p className="flex items-center gap-1 text-slate-600"><Wind className="w-3 h-3" /> {village.current.wind_speed} km/h</p>
                                            </div>
                                        </div>

                                        {/* 5-Day Forecast */}
                                        <div className="mb-3">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">5-Day Forecast</p>
                                            <div className="flex justify-between">
                                                {village.forecast.slice(0, 5).map((day: any, d: number) => (
                                                    <div key={d} className="text-center">
                                                        <p className="text-[10px] text-slate-500">{day.day.slice(0, 3)}</p>
                                                        <p className="text-sm font-bold">{day.temp}°</p>
                                                        <p className="text-[10px] text-blue-500">{day.rain_prob}%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Advisory */}
                                        <div className="bg-amber-50 rounded-lg p-2">
                                            <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">Advisory</p>
                                            {village.advisory?.slice(0, 2).map((adv: string, a: number) => (
                                                <p key={a} className="text-xs text-amber-800">{adv}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-6 text-center">
                                <Cloud className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                <p className="text-slate-500">Village weather data not available</p>
                                <p className="text-sm text-slate-400 mt-1">Make sure your district is assigned</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
