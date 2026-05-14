"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface CoordinatePickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function CoordinatePicker({ latitude, longitude, onChange }: CoordinatePickerProps) {
  const defaultPosition: [number, number] = [34.0522, -118.2437]; // Default to LA if no coords
  const position: [number, number] | null = (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude))
    ? [latitude, longitude]
    : null;

  const [mapCenter] = useState<[number, number]>(position || defaultPosition);
  const [address, setAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Fetch address from OpenStreetMap (Reverse Geocoding)
  useEffect(() => {
    if (!position) {
      setAddress("");
      return;
    }
    
    const fetchAddress = async () => {
      setIsLoadingAddress(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`);
        const data = await response.json();
        if (data && data.display_name) {
          // Simplify the address display
          const parts = data.display_name.split(', ');
          const shortAddress = parts.slice(Math.max(parts.length - 3, 0)).join(', ');
          setAddress(shortAddress);
        } else {
          setAddress("Unknown Location");
        }
      } catch (error) {
        setAddress("Failed to fetch location");
      }
      setIsLoadingAddress(false);
    };

    // Debounce the API call slightly so we don't spam OSM when dragging/clicking rapidly
    const delay = setTimeout(() => {
      fetchAddress();
    }, 800);

    return () => clearTimeout(delay);
  }, [position?.[0], position?.[1]]);

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner" style={{ zIndex: 0 }}>
        <MapContainer 
          center={mapCenter} 
          zoom={position ? 12 : 3} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={(pos: [number, number]) => onChange(pos[0], pos[1])} 
          />
        </MapContainer>
      </div>
      
      {/* Reverse Geocoding Address Box */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <MapPin className={`w-5 h-5 flex-shrink-0 ${position ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {isLoadingAddress ? "Searching location..." : (address || (position ? "Unknown Location" : "No GPS data. Click the map to pin a location!"))}
        </span>
      </div>
    </div>
  );
}
