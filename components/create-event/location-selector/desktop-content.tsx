"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Search, Plus } from "lucide-react";
import { MapComponent } from "./map-component";
import type { Location } from "./types";
import { useClientData } from "@/utils/data/client";

interface DesktopContentProps {
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
  organisationId: string;
  onClose: () => void;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
  selectedLocation,
  onLocationSelect,
  organisationId,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const createLocation = useClientData().locations.useCreate();
  const { data: organisationLocations } =
    useClientData().locations.useByOrganisation(organisationId);

  const filteredLocations =
    organisationLocations?.filter((location) =>
      location.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleLocationSelect = (location: Location) => {
    onLocationSelect({
      ...location,
      name: location.name ?? "",
    });

    onClose();
  };

  const handleMapLocationSelect = (
    coordinates: [number, number],
    name?: string
  ) => {
    setSelectedCoordinates(coordinates);
    if (name) {
      setNewLocationName(name);
    }
    setIsAddingLocation(true);
  };

  const handleAddNewLocation = async () => {
    if (!selectedCoordinates || !newLocationName.trim() || !createLocation)
      return;

    try {
      const newLocation = {
        name: newLocationName.trim(),
        coordinates: selectedCoordinates,
        organisation_id: organisationId,
      };

      const locationResponse = await createLocation.mutateAsync({
        ...newLocation,
        name: newLocation.name !== null ? newLocation.name : "",
        coordinates: selectedCoordinates.join(" "),
      });

      const location: Location = {
        ...locationResponse,
        name: locationResponse.name !== null ? locationResponse.name : "",
        coordinates:
          locationResponse.coordinates == null
            ? [0, 0]
            : typeof locationResponse.coordinates === "string"
              ? locationResponse.coordinates.split(" ").map(Number) as [number, number]
              : locationResponse.coordinates,
        organisation_id: locationResponse.organisation_id ?? "",
      };

      onLocationSelect(location);

      onClose();
    } catch (error) {
      console.error("Failed to add location:", error);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingLocation(false);
    setSelectedCoordinates(null);
    setNewLocationName("");
  };

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Location</h2>
        </div>
      </div>

      <div className="flex h-[500px]">
        <div className="w-1/3 border-r p-4 flex flex-col">
          <h3 className="font-medium mb-3 text-sm">Recent Locations</h3>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center p-2 rounded-md bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleLocationSelect({
                      ...location,
                      name: location.name ?? "",
                      coordinates:
                        location.coordinates == null
                          ? [0, 0]
                          : typeof location.coordinates === "string"
                            ? location.coordinates.split(" ").map(Number) as [number, number]
                            : location.coordinates,
                      organisation_id: location.organisation_id ?? "",
                    })}
                  >
                    <MapPin className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">
                        {location.name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">No locations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="w-2/3 p-4 flex flex-col">
          <h3 className="font-medium mb-3 text-sm">Map Search</h3>

          {isAddingLocation ? (
            <div className="p-3 bg-yellow-50 rounded-md mb-4">
              <h4 className="font-medium text-sm mb-2">Add New Location</h4>
              <Input
                placeholder="Enter location name..."
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="mb-3"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddNewLocation}
                  disabled={!newLocationName.trim()}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Location
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-md mb-4">
              <p className="text-xs text-blue-700">
                Use the search bar above the map to find locations, or click
                anywhere on the map to add a custom location
              </p>
            </div>
          )}

          <div className="flex-1 rounded-md overflow-hidden">
            <MapComponent
              onLocationSelect={handleMapLocationSelect}
              selectedCoordinates={selectedCoordinates}
              height="100%"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {selectedLocation
              ? `Selected: ${selectedLocation.name}`
              : "No location selected"}
          </p>
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 h-8"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
};
