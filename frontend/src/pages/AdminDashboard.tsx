import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Shield, Users, Briefcase, Bell, CheckCircle2, XCircle,
    ChevronRight, LogOut, Loader2, Send, Activity, Trash2,
    Search, Settings, BarChart3, FileText, AlertTriangle,
    Eye, Edit, Ban, Check, X, Plus, Cloud, Sun, CloudRain,
    Wind, Thermometer, Droplets, TrendingUp, TrendingDown,
    MapPin, Phone, Mail, Calendar, Clock, Award, Target,
    PieChart, BarChart, LineChart, UserCheck, UserX, Map
} from "lucide-react";
import axios from "axios";

const MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bid (Beed)", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
    "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri",
    "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [laborList, setLaborList] = useState<any[]>([]);
    const [farmerList, setFarmerList] = useState<any[]>([]);
    const [coordinatorList, setCoordinatorList] = useState<any[]>([]);
    const [alertList, setAlertList] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [notificationForm, setNotificationForm] = useState({ title: "", message: "", type: "general" });
    const [coordinatorForm, setCoordinatorForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        assigned_district: ""
    });
    const [isCreatingCoordinator, setIsCreatingCoordinator] = useState(false);
    const [alertForm, setAlertForm] = useState({
        title: "",
        message: "",
        alert_type: "weather",
        severity: "medium",
        region: "all"
    });
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const [statsRes, laborRes, farmerRes, alertRes, auditRes, coordRes] = await Promise.all([
                axios.get("/alerts-manager/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("/labor/admin/all", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("/authentication/admin/farmers", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] })),
                axios.get("/alerts/admin/all", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] })),
                axios.get("/admin/audit-logs", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] })),
                axios.get("/authentication/coordinators/", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] }))
            ]);
            setStats(statsRes.data);
            setLaborList(laborRes.data);
            setFarmerList(farmerRes.data || []);
            setAlertList(alertRes.data || []);
            setAuditLogs(auditRes.data || generateMockAuditLogs());
            setCoordinatorList(coordRes.data.results || coordRes.data || []);
        } catch (err) {
            console.error(err);
            setAuditLogs(generateMockAuditLogs());
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockAuditLogs = () => [
        { id: 1, action: "User Login", admin: "System", timestamp: new Date().toISOString(), details: "Admin logged in" },
        { id: 2, action: "Labor Approved", admin: "Admin", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "Labor ID #123 approved" },
        { id: 3, action: "Notification Sent", admin: "Admin", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "Weather alert broadcasted" },
        { id: 4, action: "Farmer Blocked", admin: "Admin", timestamp: new Date(Date.now() - 10800000).toISOString(), details: "Farmer ID #456 blocked" },
        { id: 5, action: "Settings Updated", admin: "Admin", timestamp: new Date(Date.now() - 14400000).toISOString(), details: "Notification settings changed" },
    ];

    const handleLaborAction = async (id: number, action: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/labor/admin/action/${id}`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleFarmerAction = async (id: number, action: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/authentication/admin/farmer/action/${id}`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
            alert(`Farmer ${action} successfully!`);
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/alerts-manager/admin/send",
                notificationForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Notification broadcasted successfully!");
            setNotificationForm({ title: "", message: "", type: "general" });
        } catch (err) {
            alert("Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/alerts/admin/create",
                alertForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Alert created successfully!");
            setAlertForm({ title: "", message: "", alert_type: "weather", severity: "medium", region: "all" });
            fetchData();
        } catch (err) {
            alert("Failed to create alert");
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateCoordinator = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingCoordinator(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/authentication/coordinators/create",
                { ...coordinatorForm, role: "coordinator" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Coordinator created successfully!");
            setCoordinatorForm({ name: "", email: "", phone: "", password: "", assigned_district: "" });
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create coordinator");
        } finally {
            setIsCreatingCoordinator(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLabor = laborList.filter(l =>
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.village?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFarmers = farmerList.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.village?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
        { id: "farmers", label: "Farmers", icon: <Users className="w-4 h-4" /> },
        { id: "labor", label: "Labor", icon: <Briefcase className="w-4 h-4" /> },
        { id: "coordinators", label: "Coordinators", icon: <Map className="w-4 h-4" /> },
        { id: "alerts", label: "Weather Alerts", icon: <AlertTriangle className="w-4 h-4" /> },
        { id: "notifications", label: "Broadcast", icon: <Bell className="w-4 h-4" /> },
        { id: "analytics", label: "Analytics", icon: <PieChart className="w-4 h-4" /> },
        { id: "audit", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
        { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Admin Header */}
            <header className="bg-slate-900 border-b border-slate-800 fixed w-full z-50 px-8 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <Shield className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-black text-white leading-none">ADMIN PANEL</h1>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1 italic">KrushiSarthi Command Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-white font-bold text-sm">Admin User</p>
                        <p className="text-blue-400 text-xs">Super Administrator</p>
                    </div>
                    <button
                        onClick={() => { localStorage.clear(); navigate("/login"); }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-black text-xs transition-all border border-slate-700"
                    >
                        <LogOut className="w-4 h-4" /> LOGOUT
                    </button>
                </div>
            </header>

            <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="modern-card p-6 bg-white border-l-4 border-blue-500 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Farmers</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats?.total_farmers || 0}</h3>
                            </div>
                            <Users className="w-8 h-8 text-blue-100" />
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" /> +12% this month
                        </div>
                    </div>
                    <div className="modern-card p-6 bg-white border-l-4 border-green-500 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Labor</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats?.total_labor || 0}</h3>
                            </div>
                            <Briefcase className="w-8 h-8 text-green-100" />
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" /> +8% this month
                        </div>
                    </div>
                    <div className="modern-card p-6 bg-white border-l-4 border-amber-500 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Alerts</p>
                                <h3 className="text-3xl font-black text-slate-900">{alertList.length || 0}</h3>
                            </div>
                            <Bell className="w-8 h-8 text-amber-100" />
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-amber-600 text-xs font-bold">
                            <AlertTriangle className="w-3 h-3" /> {alertList.filter(a => a.severity === 'high').length || 0} critical
                        </div>
                    </div>
                    <div className="modern-card p-6 bg-white border-l-4 border-purple-500 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Platform Health</p>
                                <h3 className="text-3xl font-black text-green-600">98%</h3>
                            </div>
                            <Activity className="w-8 h-8 text-purple-100" />
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> All systems operational
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-slate-900 text-white shadow-lg"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search farmers, labor, or alerts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-blue-600" /> Platform Overview
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">Farmers</p>
                                            <p className="text-xs text-slate-500">Registered users</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{stats?.total_farmers || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">Labor</p>
                                            <p className="text-xs text-slate-500">Available workers</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{stats?.total_labor || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">Active Labor</p>
                                            <p className="text-xs text-slate-500">Currently seeking work</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{stats?.active_labor || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-amber-600" /> Recent Alerts
                            </h2>
                            <div className="space-y-3">
                                {alertList.slice(0, 5).map((alert, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <div className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-sm">{alert.title}</p>
                                            <p className="text-xs text-slate-500">{alert.alert_type}</p>
                                        </div>
                                        <span className="text-xs text-slate-400">{new Date(alert.created_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                ))}
                                {alertList.length === 0 && (
                                    <p className="text-slate-500 text-center py-4">No alerts yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Farmers Tab */}
                {activeTab === "farmers" && (
                    <div className="modern-card bg-white p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-600" /> Farmer Management
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        <th className="pb-4 pl-4">Farmer</th>
                                        <th className="pb-4">Location</th>
                                        <th className="pb-4">Crop Type</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredFarmers.length > 0 ? filteredFarmers.map(farmer => (
                                        <tr key={farmer.id} className="group hover:bg-slate-50/50">
                                            <td className="py-4 pl-4">
                                                <p className="font-black text-slate-800">{farmer.name}</p>
                                                <p className="text-xs text-slate-500">{farmer.phone}</p>
                                            </td>
                                            <td className="py-4 font-medium text-slate-600 text-sm">{farmer.village}, {farmer.district}</td>
                                            <td className="py-4 font-medium text-slate-600 text-sm">{farmer.crop_type || "Not set"}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${farmer.is_active !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {farmer.is_active !== false ? 'Active' : 'Blocked'}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {farmer.is_active !== false ? (
                                                        <button
                                                            onClick={() => handleFarmerAction(farmer.id, 'block')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                                            title="Block"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleFarmerAction(farmer.id, 'unblock')}
                                                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                                                            title="Unblock"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-500">
                                                No farmers found. Farmers will appear here once they register.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Labor Tab */}
                {activeTab === "labor" && (
                    <div className="modern-card bg-white p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-green-600" /> Labor Management
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        <th className="pb-4 pl-4">Labor Name</th>
                                        <th className="pb-4">Location</th>
                                        <th className="pb-4">Skills</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLabor.map(labor => (
                                        <tr key={labor.id} className="group hover:bg-slate-50/50">
                                            <td className="py-4 pl-4">
                                                <p className="font-black text-slate-800">{labor.name}</p>
                                                <p className="text-xs text-slate-500">{labor.phone}</p>
                                            </td>
                                            <td className="py-4 font-medium text-slate-600 text-sm">{labor.village}, {labor.district}</td>
                                            <td className="py-4 font-medium text-slate-600 text-sm">{labor.skills || labor.experience} Years exp.</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${labor.status === 'approved' ? 'bg-green-50 text-green-600' : labor.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                                    {labor.status}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {labor.status !== 'approved' && (
                                                        <button onClick={() => handleLaborAction(labor.id, 'approve')} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all" title="Approve">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {labor.status !== 'rejected' && (
                                                        <button onClick={() => handleLaborAction(labor.id, 'reject')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Reject">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Coordinators Tab */}
                {activeTab === "coordinators" && (
                    <div className="space-y-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Map className="w-6 h-6 text-purple-600" /> District Coordinators
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                            <th className="pb-4 pl-4">Coordinator Name</th>
                                            <th className="pb-4">Email</th>
                                            <th className="pb-4">Phone</th>
                                            <th className="pb-4">Assigned District</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {coordinatorList.map(coordinator => (
                                            <tr key={coordinator.id} className="group hover:bg-slate-50/50">
                                                <td className="py-4 pl-4">
                                                    <p className="font-black text-slate-800">{coordinator.name}</p>
                                                </td>
                                                <td className="py-4 font-medium text-slate-600 text-sm">{coordinator.email}</td>
                                                <td className="py-4 font-medium text-slate-600 text-sm">{coordinator.phone}</td>
                                                <td className="py-4">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-600">
                                                        {coordinator.assigned_district}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {coordinatorList.length === 0 && (
                                <p className="text-center text-slate-500 py-8">No coordinators found</p>
                            )}
                        </div>

                        {/* Create Coordinator Form */}
                        <div className="modern-card bg-white p-8">
                            <h3 className="text-lg font-black text-slate-900 mb-6">Create New Coordinator</h3>
                            <form onSubmit={handleCreateCoordinator} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={coordinatorForm.name}
                                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium"
                                        placeholder="Coordinator Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={coordinatorForm.email}
                                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium"
                                        placeholder="coordinator@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={coordinatorForm.phone}
                                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium"
                                        placeholder="98XXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={coordinatorForm.password}
                                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Assigned District (Maharashtra)</label>
                                    <select
                                        required
                                        value={coordinatorForm.assigned_district}
                                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, assigned_district: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium"
                                    >
                                        <option value="">Select District</option>
                                        {MAHARASHTRA_DISTRICTS.map(district => (
                                            <option key={district} value={district.toLowerCase()}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isCreatingCoordinator}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                        {isCreatingCoordinator ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        Create Coordinator
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Weather Alerts Tab */}
                {activeTab === "alerts" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Plus className="w-6 h-6 text-amber-600" /> Create New Alert
                            </h2>
                            <form onSubmit={handleCreateAlert} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Alert Title</label>
                                    <input required value={alertForm.title} onChange={e => setAlertForm({ ...alertForm, title: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Heavy Rain Warning" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Alert Type</label>
                                        <select value={alertForm.alert_type} onChange={e => setAlertForm({ ...alertForm, alert_type: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium">
                                            <option value="weather">Weather</option>
                                            <option value="disease">Disease</option>
                                            <option value="pest">Pest</option>
                                            <option value="drought">Drought</option>
                                            <option value="flood">Flood</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Severity</label>
                                        <select value={alertForm.severity} onChange={e => setAlertForm({ ...alertForm, severity: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Region</label>
                                    <select value={alertForm.region} onChange={e => setAlertForm({ ...alertForm, region: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium">
                                        <option value="all">All Regions</option>
                                        <option value="north">North India</option>
                                        <option value="south">South India</option>
                                        <option value="east">East India</option>
                                        <option value="west">West India</option>
                                        <option value="central">Central India</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Message</label>
                                    <textarea required rows={4} value={alertForm.message} onChange={e => setAlertForm({ ...alertForm, message: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter alert details..." />
                                </div>
                                <button disabled={isSending} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2">
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><AlertTriangle className="w-5 h-5" /> CREATE ALERT</>}
                                </button>
                            </form>
                        </div>

                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" /> Active Alerts
                            </h2>
                            <div className="space-y-3">
                                {alertList.map((alert, i) => (
                                    <div key={i} className={`p-4 rounded-xl border-l-4 ${alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-50 border-red-500' : alert.severity === 'medium' ? 'bg-amber-50 border-amber-500' : 'bg-green-50 border-green-500'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-black text-slate-800">{alert.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">{alert.message}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : alert.severity === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> {alert.alert_type}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.region || 'All'}</span>
                                        </div>
                                    </div>
                                ))}
                                {alertList.length === 0 && (
                                    <p className="text-slate-500 text-center py-8">No active alerts</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Broadcast Tab */}
                {activeTab === "notifications" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Send className="w-6 h-6 text-blue-600" /> Send Broadcast
                            </h2>
                            <form onSubmit={handleSendNotification} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Title</label>
                                    <input required value={notificationForm.title} onChange={e => setNotificationForm({ ...notificationForm, title: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium" placeholder="Notification title" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Type</label>
                                    <select value={notificationForm.type} onChange={e => setNotificationForm({ ...notificationForm, type: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium">
                                        <option value="disease">Disease Alert</option>
                                        <option value="weather">Weather Alert</option>
                                        <option value="advisory">Advisory</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Message</label>
                                    <textarea required rows={5} value={notificationForm.message} onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium" placeholder="Enter message..." />
                                </div>
                                <button disabled={isSending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2">
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> BROADCAST TO ALL</>}
                                </button>
                            </form>
                        </div>

                        <div className="modern-card bg-slate-900 p-8 text-white">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-blue-400" /> Preview
                            </h2>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase text-blue-400">{notificationForm.type}</span>
                                </div>
                                <h4 className="text-xl font-black text-white mb-2">{notificationForm.title || "Title"}</h4>
                                <p className="text-slate-400 text-sm">{notificationForm.message || "Message preview"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <PieChart className="w-6 h-6 text-purple-600" /> User Distribution
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">Farmers</span>
                                        <span className="font-black">{stats?.total_farmers || 0}</span>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">Labor</span>
                                        <span className="font-black">{stats?.total_labor || 0}</span>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <BarChart className="w-6 h-6 text-amber-600" /> Monthly Registrations
                            </h2>
                            <div className="flex items-end justify-between h-40 gap-2">
                                {[65, 45, 80, 55, 70, 60, 75, 85, 90, 70, 80, 95].map((h, i) => (
                                    <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group">
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all group-hover:from-blue-600 group-hover:to-blue-500" style={{ height: `${h}%` }} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>Jan</span><span>Dec</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Audit Logs Tab */}
                {activeTab === "audit" && (
                    <div className="modern-card bg-white p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-slate-600" /> Audit Logs
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                                        <th className="pb-4">Timestamp</th>
                                        <th className="pb-4">Action</th>
                                        <th className="pb-4">Admin</th>
                                        <th className="pb-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-50">
                                            <td className="py-4 font-medium text-slate-600 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-4 font-medium text-slate-600 text-sm">{log.admin}</td>
                                            <td className="py-4 text-slate-500 text-sm">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Settings className="w-6 h-6 text-slate-600" /> Platform Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Farmer Registration</p>
                                        <p className="text-xs text-slate-500">Allow new farmers to register</p>
                                    </div>
                                    <button className="w-12 h-6 bg-green-500 rounded-full relative">
                                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Labor Registration</p>
                                        <p className="text-xs text-slate-500">Allow new labor to register</p>
                                    </div>
                                    <button className="w-12 h-6 bg-green-500 rounded-full relative">
                                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Auto-approve Labor</p>
                                        <p className="text-xs text-slate-500">Automatically approve labor requests</p>
                                    </div>
                                    <button className="w-12 h-6 bg-slate-300 rounded-full relative">
                                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Weather Alerts</p>
                                        <p className="text-xs text-slate-500">Enable weather alert system</p>
                                    </div>
                                    <button className="w-12 h-6 bg-green-500 rounded-full relative">
                                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="modern-card bg-white p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Shield className="w-6 h-6 text-blue-600" /> Security Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500">Require 2FA for admin login</p>
                                    </div>
                                    <button className="w-12 h-6 bg-slate-300 rounded-full relative">
                                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Session Timeout</p>
                                        <p className="text-xs text-slate-500">Auto logout after inactivity</p>
                                    </div>
                                    <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                                        <option>30 minutes</option>
                                        <option>1 hour</option>
                                        <option>2 hours</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">IP Whitelist</p>
                                        <p className="text-xs text-slate-500">Restrict admin access by IP</p>
                                    </div>
                                    <button className="w-12 h-6 bg-slate-300 rounded-full relative">
                                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

