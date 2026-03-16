import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Satellite, Info, Activity, Droplets, RefreshCw, Navigation } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Fix for default marker icons in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 14);
    }, [center, map]);
    return null;
};

const SatelliteMonitoringPanel = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredNdvi, setHoveredNdvi] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token') || localStorage.getItem('token');
                const [satRes, summaryRes] = await Promise.all([
                    axios.get('/satellite/crop-health', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('/crop/summary', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setData(satRes.data);
                setSummaryData(summaryRes.data);
            } catch (err) {
                console.error("Error fetching satellite data:", err);
                setError("Failed to load satellite insights.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            const response = await axios.get('/crop-report', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const cropName = summaryData?.crop || 'Crop';
            link.setAttribute('download', `KrushiSarthi_Crop_Report_${cropName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Failed to generate report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <RefreshCw className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-500 font-medium">{t('satellite.loading_message')}</p>
            </div>
        );
    }

    if (error || !data || !data.latitude || !data.longitude) {
        return (
            <div className="p-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-300 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                    <MapPin className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{t('satellite.location_not_set_title')}</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm">
                    {t('satellite.location_not_set_description')}
                </p>
                <button
                    onClick={() => window.location.href = '/setup-location'}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                >
                    <Navigation className="w-5 h-5" /> {t('satellite.locate_farm_button')}
                </button>
            </div>
        );
    }

    const getNDVIColor = (ndvi: number) => {
        if (ndvi >= 0.7) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
        if (ndvi >= 0.4) return 'text-amber-700 bg-amber-50 border-amber-100';
        return 'text-red-700 bg-red-50 border-red-100';
    };

    const getNDVIProgressColor = (ndvi: number) => {
        if (ndvi >= 0.7) return 'bg-emerald-500';
        if (ndvi >= 0.4) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getNDVIHexColor = (ndvi: number) => {
        if (ndvi >= 0.7) return '#10b981'; // emerald-500
        if (ndvi >= 0.4) return '#f59e0b'; // amber-500
        return '#ef4444'; // red-500
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Satellite Map Panel */}
                <div className="flex-[5] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t('satellite.live_feed')}</p>
                            <div className="flex items-center gap-2">
                                <Satellite className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800 font-brand">{t('satellite.monitoring_title')}</h3>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {t('satellite.multi_spectral_analysis')}
                        </div>
                    </div>
                    <div className="h-[450px] w-full relative z-0">
                        <MapContainer
                            center={[data.latitude, data.longitude]}
                            zoom={14}
                            style={{ width: '100%', height: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />

                            {/* Simulated NDVI Grid Overlays */}
                            {data.grid_data?.map((point: any, index: number) => (
                                <Circle
                                    key={index}
                                    center={[point.lat, point.lon]}
                                    radius={100}
                                    pathOptions={{
                                        fillColor: getNDVIHexColor(point.ndvi),
                                        fillOpacity: 0.4,
                                        color: 'transparent',
                                        weight: 0
                                    }}
                                    eventHandlers={{
                                        mouseover: () => setHoveredNdvi(point.ndvi),
                                        mouseout: () => setHoveredNdvi(null),
                                    }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('satellite.vegetation_health')}</p>
                                            <p className="text-sm font-black text-slate-800">NDVI: {point.ndvi}</p>
                                        </div>
                                    </Popup>
                                </Circle>
                            ))}

                            <Marker position={[data.latitude, data.longitude]}>
                                <Popup>
                                    <div className="p-2">
                                        <p className="font-bold text-slate-800">{t('satellite.farm_location_marker')}</p>
                                        <p className="text-xs text-slate-500 font-medium">Lat: {data.latitude.toFixed(4)}, Lon: {data.longitude.toFixed(4)}</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <MapUpdater center={[data.latitude, data.longitude]} />
                        </MapContainer>

                        {/* Status Overlay */}
                        {hoveredNdvi !== null && (
                            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-xl">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('satellite.point_ndvi')}</p>
                                <p className="text-xl font-black text-slate-800">{hoveredNdvi}</p>
                            </div>
                        )}

                        {/* Map Legend */}
                        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl text-[10px] space-y-3 min-w-[150px]">
                            <p className="font-black text-slate-900 uppercase tracking-wider mb-2">{t('satellite.ndvi_scale')}</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                        <span className="font-bold">{t('satellite.healthy')}</span>
                                    </div>
                                    <span className="text-slate-400">0.7 - 1.0</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                                        <span className="font-bold">{t('satellite.moderate')}</span>
                                    </div>
                                    <span className="text-slate-400">0.4 - 0.6</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-sm" />
                                        <span className="font-bold">{t('satellite.stressed')}</span>
                                    </div>
                                    <span className="text-slate-400">0.0 - 0.3</span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Tooltip/Info */}
                        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-emerald-500/20 shadow-lg flex items-center gap-3">
                            <Info className="w-4 h-4 text-emerald-400" />
                            <p className="text-[11px] text-white font-medium">{t('satellite.hover_info')}</p>
                        </div>
                    </div>
                </div>

                {/* Analytics Side Panel */}
                <div className="flex-[2] flex flex-col gap-4">
                    {/* Health Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-[2rem] border-2 ${getNDVIColor(data.ndvi)} shadow-lg shadow-emerald-500/5`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('satellite.vegetation_health_index')}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{t('satellite.current_ndvi_score')}</p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-5xl font-black">{data.ndvi}</h4>
                                    <span className="text-sm font-bold opacity-60">/ 1.0</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span>{t('satellite.poor')}</span>
                                    <span>{t('satellite.neutral')}</span>
                                    <span>{t('satellite.healthy')}</span>
                                </div>
                                <div className="w-full h-3 bg-black/5 rounded-full p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data.ndvi * 100}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full rounded-full shadow-sm ${getNDVIProgressColor(data.ndvi)}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs font-bold leading-relaxed">
                                    {t('satellite.state')}: <span className="uppercase">{data.crop_health}</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Droplets className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t('satellite.drought_risk')}</p>
                                    <p className={`text-lg font-black ${data.drought_risk === 'High' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {data.drought_risk}
                                    </p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Info className="w-4 h-4 text-slate-300" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t('satellite.chlorophyll_level')}</p>
                                    <p className="text-lg font-black text-slate-800">
                                        {(data.ndvi * 1.2).toFixed(1)} <span className="text-xs font-normal text-slate-400">mg/m²</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-3xl border border-dashed border-slate-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                    <Satellite className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-1">{t('satellite.observation_details')}</p>
                                    <p className="text-[11px] font-medium text-slate-600 leading-normal">
                                        {t('satellite.observation_description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
            >
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                    <Satellite className="w-64 h-64 -mr-20 -mt-10 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/30">
                        <Activity className="w-10 h-10 text-emerald-300" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                            {t('satellite.ai_summary_title')}: <span className="text-emerald-200">{summaryData?.crop || 'Analyzing...'}</span>
                        </h4>
                        <p className="text-emerald-50/80 leading-relaxed font-medium">
                            {summaryData?.summary || `The multi-spectral analysis indicates ${data.vegetation_status.toLowerCase()}. Your vegetation health score is higher than 78% of similar farms in your region.`}
                        </p>
                    </div>
                    <div className="md:ml-auto">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="w-full py-4 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDownloading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> {t('satellite.processing')}
                                </>
                            ) : (
                                t('satellite.download_pdf')
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SatelliteMonitoringPanel;

