import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
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
const indiaCenter = {
    lat: 20.5937,
    lng: 78.9629
};

const MapUpdater = ({ center, zoom }: { center: { lat: number, lng: number }, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);
    return null;
};

// Component to handle map clicks for marking location
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

interface InteractiveWeatherMapProps {
    initialLocation?: { lat: number, lng: number };
    initialZoom?: number;
    initialName?: string;
    showSearch?: boolean;
    height?: string;
}

const InteractiveWeatherMap = ({
    initialLocation,
    initialZoom = 5,
    initialName = '',
    showSearch = true,
    height = '500px'
}: InteractiveWeatherMapProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(initialLocation || null);
    const [mapCenter, setMapCenter] = useState(initialLocation || indiaCenter);
    const [mapZoom, setMapZoom] = useState(initialLocation ? 11 : initialZoom);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [locationName, setLocationName] = useState<string>(initialName);
    const [error, setError] = useState<string | null>(null);

    // Initial weather fetch if location provided
    useEffect(() => {
        if (initialLocation && !weatherData) {
            fetchWeather(initialLocation.lat, initialLocation.lng, initialName);
        }
    }, [initialLocation]);

    const fetchWeather = async (lat: number, lng: number, name: string) => {
        setIsSearching(true);
        setError(null);
        try {
            const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
                }
            });
            setWeatherData(weatherRes.data.current);
            setLocationName(name || "Your Farm");
            setMarkerPosition({ lat, lng });
            setMapCenter({ lat, lng });
            setMapZoom(11);
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setError("Failed to fetch weather for this location.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);
        setWeatherData(null);

        try {
            // 1. Geocoding using Nominatim (OpenStreetMap)
            const geocodeRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: searchQuery,
                    format: 'json',
                    limit: 1,
                    countrycodes: 'in' // limit to India based on user request
                }
            });

            if (geocodeRes.data && geocodeRes.data.length > 0) {
                const result = geocodeRes.data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                const display_name = result.display_name;

                await fetchWeather(lat, lng, display_name.split(',')[0]);
            } else {
                setError("Location not found. Please try another village or city in India.");
                setIsSearching(false);
            }
        } catch (err) {
            console.error("Error fetching map data:", err);
            setError("An error occurred while fetching data.");
            setIsSearching(false);
        }
    };

    // Helper to get simple weather description from WMO code
    const getWeatherDescription = (code: number) => {
        if (code === 0) return 'Clear sky';
        if (code <= 3) return 'Partly cloudy';
        if (code <= 49) return 'Fog or overcast';
        if (code <= 69) return 'Rain';
        if (code <= 79) return 'Snow';
        if (code <= 99) return 'Thunderstorm';
        return 'Unknown';
    };

    // Handle click on map to mark location
    const handleMapClick = async (lat: number, lng: number) => {
        setIsSearching(true);
        setError(null);
        try {
            // Reverse geocoding to get location name
            const reverseGeocodeRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: lat,
                    lon: lng,
                    format: 'json'
                }
            });

            const locationName = reverseGeocodeRes.data?.display_name?.split(',')[0] || 'Selected Location';
            await fetchWeather(lat, lng, locationName);
        } catch (err) {
            console.error("Error getting location name:", err);
            // Still try to fetch weather even if reverse geocoding fails
            await fetchWeather(lat, lng, 'Selected Location');
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Search Bar */}
            {showSearch && (
                <div className="max-w-2xl mx-auto mb-8">
                    <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-nature-500/20 transition-all">
                        <div className="pl-4 text-slate-400">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a village or district in India..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-4 px-4 outline-none text-slate-800 font-medium placeholder:text-slate-400"
                            disabled={isSearching}
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !searchQuery.trim()}
                            className="bg-nature-600 hover:bg-nature-500 text-white px-8 py-4 font-bold flex items-center justify-center min-w-[120px] transition-colors disabled:opacity-70"
                        >
                            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-3 font-medium text-center">{error}</p>}
                </div>
            )}

            {/* Content Layout: Map left, Weather right */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Map Container */}
                <div className="flex-[3] glass-card p-4 bg-white/80 border border-slate-200 rounded-[2.5rem] shadow-xl backdrop-blur-md" style={{ minHeight: height }}>
                    <div className="h-full w-full rounded-3xl overflow-hidden relative shadow-inner ring-1 ring-slate-200 z-0 bg-slate-100">
                        <MapContainer
                            center={[mapCenter.lat, mapCenter.lng]}
                            zoom={mapZoom}
                            style={{ width: '100%', height: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <MapClickHandler onLocationSelect={handleMapClick} />
                            <LayersControl position="topright">
                                <LayersControl.BaseLayer checked name="Map View">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Satellite View">
                                    <TileLayer
                                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    />
                                </LayersControl.BaseLayer>

                                <LayersControl.Overlay name="Rain Intensity">
                                    <TileLayer
                                        attribution='Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                                        url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=dummy_key_for_hackathon"
                                    />
                                </LayersControl.Overlay>
                                <LayersControl.Overlay name="Temperature Heatmap">
                                    <TileLayer
                                        attribution='Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                                        url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=dummy_key_for_hackathon"
                                    />
                                </LayersControl.Overlay>
                                <LayersControl.Overlay name="Wind Speed">
                                    <TileLayer
                                        attribution='Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                                        url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=dummy_key_for_hackathon"
                                    />
                                </LayersControl.Overlay>
                                <LayersControl.Overlay name="Cloud Cover">
                                    <TileLayer
                                        attribution='Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                                        url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=dummy_key_for_hackathon"
                                    />
                                </LayersControl.Overlay>
                            </LayersControl>

                            {markerPosition && (
                                <Marker position={markerPosition}>
                                    <Popup className="custom-popup">
                                        <div className="p-1">
                                            <p className="font-bold text-slate-800">{locationName}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                            <MapUpdater center={mapCenter} zoom={mapZoom} />
                        </MapContainer>
                    </div>
                </div>

                {/* Weather Details Panel */}
                <div className="flex-1 glass-card p-8 bg-white/90 border border-slate-200 rounded-[2.5rem] shadow-xl backdrop-blur-md flex flex-col justify-center min-h-[400px]">
                    {isSearching ? (
                        <div className="flex flex-col items-center justify-center gap-4 text-slate-400 py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-nature-500" />
                            <p className="font-bold">Fetching updates...</p>
                        </div>
                    ) : weatherData ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{locationName}</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Current conditions</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-50 rounded-3xl">
                                    <Thermometer className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-5xl font-black text-slate-900">{weatherData.temperature_2m}°C</p>
                                    <p className="text-slate-600 font-bold text-lg">{getWeatherDescription(weatherData.weather_code)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                    <Wind className="w-6 h-6 text-blue-500 mb-3" />
                                    <p className="text-2xl font-black text-slate-900">{weatherData.wind_speed_10m}</p>
                                    <p className="text-slate-500 text-sm font-bold">km/h Wind</p>
                                </div>
                                <div className="p-6 bg-cyan-50/50 rounded-3xl border border-cyan-100/50">
                                    <Droplets className="w-6 h-6 text-cyan-500 mb-3" />
                                    <p className="text-2xl font-black text-slate-900">{weatherData.relative_humidity_2m}%</p>
                                    <p className="text-slate-500 text-sm font-bold">Humidity</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-nature-600 hover:bg-nature-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-nature-600/20 active:scale-95">
                                View Full Report
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-6 py-12">
                            <div className="w-20 h-20 bg-nature-50 rounded-full flex items-center justify-center">
                                <MapPin className="w-10 h-10 text-nature-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Location</h3>
                                <p className="text-slate-500 font-medium">Search for your village to get hyperlocal weather insights.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveWeatherMap;

