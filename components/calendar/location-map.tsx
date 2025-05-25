"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationMapProps {
  coordinates: string;
  locationName: string;
  className?: string;
}

export function LocationMap({
  coordinates,
  locationName,
  className = "",
}: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const [lat, lng] = coordinates.split(" ").map(Number);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500 ${className}`}
      >
        Invalid coordinates
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "200px", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
