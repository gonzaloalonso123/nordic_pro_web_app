"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapSearchBar } from "./map-search-bar";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  onLocationSelect: (coordinates: [number, number], name?: string) => void;
  selectedCoordinates?: [number, number] | null;
  height?: string;
}

function MapEvents({
  onLocationSelect,
}: {
  onLocationSelect: (coordinates: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  selectedCoordinates,
  height = "400px",
}) => {
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-md"
        style={{ height }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const handleLocationSelect = (
    coordinates: [number, number],
    name?: string
  ) => {
    onLocationSelect(coordinates, name);
  };

  const handleSearchSelect = (coordinates: [number, number], name: string) => {
    if (map) {
      map.setView(coordinates, 16);
    }
    handleLocationSelect(coordinates, name);
  };

  return (
    <div style={{ height, width: "100%" }} className="relative">
      <MapContainer
        center={[51.505, -0.09]} // Default to London
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-md"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents
          onLocationSelect={(coords) => handleLocationSelect(coords)}
        />
        {selectedCoordinates && <Marker position={selectedCoordinates} />}
      </MapContainer>
      <div className="absolute top-4 left-4 right-4 z-1000">
        <MapSearchBar onLocationSelect={handleSearchSelect} />
      </div>
    </div>
  );
};
