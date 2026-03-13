import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Save, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// Fix for default marker icons in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Center on India as requested
const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
};

const LocationMarker = ({ position, setPosition }: { position: { lat: number, lng: number } | null, setPosition: (pos: { lat: number, lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>This is your farm location</Popup>
        </Marker>
    );
};

const MapUpdater = ({ center, zoom }: { center: { lat: number, lng: number }, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);
    return null;
};

const FarmLocationSetup = () => {
    const navigate = useNavigate();
    const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [center, setCenter] = useState(defaultCenter);
    const [zoom, setZoom] = useState(5);
    const [isSaving, setIsSaving] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load existing location from profile on page load
    useEffect(() => {
        const loadExistingLocation = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("http://localhost:8000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = response.data;
                if (userData.latitude && userData.longitude) {
                    const pos = {
                        lat: userData.latitude,
                        lng: userData.longitude
                    };
                    setMarkerPosition(pos);
                    setCenter(pos);
                    setZoom(15);
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingLocation();
    }, [navigate]);

    const handleDetectLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMarkerPosition(pos);
                    setCenter(pos);
                    setZoom(15);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error detecting location", error);
                    alert("Could not detect your location. Please click on the map to set it manually.");
                    setIsLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setIsLocating(false);
        }
    };

    const handleSaveLocation = async () => {
        if (!markerPosition) return;
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post('http://localhost:8000/api/save-farm-location/', {
                latitude: markerPosition.lat,
                longitude: markerPosition.lng
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Also save to localStorage for quick access
            localStorage.setItem('farmLocation', JSON.stringify({
                latitude: markerPosition.lat,
                longitude: markerPosition.lng
            }));

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Failed to save location", error);
            alert("Failed to save location. Please try again.");
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-nature-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600 font-bold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-nature-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-600/15 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl z-10 space-y-8"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-nature-100 rounded-2xl mb-2 border border-nature-200 shadow-sm">
                        <MapPin className="w-8 h-8 text-nature-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">Select Your Farm Location</h1>
                    <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
                        Click anywhere on the map to mark the location of your farm. This helps us provide hyper-local weather forecasts and climate alerts specifically for your land.
                    </p>
                </div>

                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-nature-50 border border-nature-200 p-4 rounded-xl flex items-center justify-center gap-3 text-nature-700 max-w-md mx-auto shadow-sm"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="font-bold">Farm location saved successfully.</span>
                    </motion.div>
                )}

                <div className="glass-card p-4 md:p-6 bg-white/80 border border-slate-200 rounded-[2.5rem] shadow-xl backdrop-blur-md">
                    <div className="h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden relative shadow-inner ring-1 ring-slate-200 z-0">
                        <MapContainer
                            center={[center.lat, center.lng]}
                            zoom={zoom}
                            style={{ width: '100%', height: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker position={markerPosition} setPosition={setMarkerPosition} />
                            <MapUpdater center={center} zoom={zoom} />
                        </MapContainer>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">Selected Coordinates</h3>
                            {markerPosition ? (
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                                        <span className="text-xs text-slate-500 font-bold">LATITUDE</span>
                                        <span className="text-slate-800 font-mono font-black">{markerPosition.lat.toFixed(6)}°</span>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                                        <span className="text-xs text-slate-500 font-bold">LONGITUDE</span>
                                        <span className="text-slate-800 font-mono font-black">{markerPosition.lng.toFixed(6)}°</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500 font-medium italic text-sm py-2">No location selected yet.</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={handleDetectLocation}
                                disabled={isLocating || showSuccess}
                                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />}
                                Detect My Location
                            </button>
                            <button
                                onClick={handleSaveLocation}
                                disabled={!markerPosition || isSaving || showSuccess}
                                className="w-full sm:w-auto px-8 py-3.5 bg-nature-600 hover:bg-nature-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-nature-600/30 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Farm Location
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FarmLocationSetup;
