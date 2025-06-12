"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Search, Plus } from "lucide-react";
import { MapComponent } from "./map-component";
import { useClientData } from "@/utils/data/client";
import { Location } from "./types";

interface MobileContentProps {
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
  organisationId: string;
  onAddLocation?: (
    location: Omit<Location, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  onClose: () => void;
  activeTab: "recent" | "map";
  setActiveTab: (tab: "recent" | "map") => void;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  selectedLocation,
  onLocationSelect,
  organisationId,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newLocationName, setNewLocationName] = useState<string>("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const { data: organisationLocations } =
    useClientData().locations.useByOrganisation(organisationId);
  const createLocation = useClientData().locations.useCreate();

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
      <div className="p-4 px-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Select Location</h2>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-0 border rounded-md overflow-hidden">
          <button
            className={`py-3 text-center ${activeTab === "recent"
              ? "bg-blue-100 text-blue-600 font-medium border-blue-500"
              : "bg-gray-50 text-gray-600"
              }`}
            onClick={() => setActiveTab("recent")}
          >
            Recent
          </button>
          <button
            className={`py-3 text-center ${activeTab === "map"
              ? "bg-blue-100 text-blue-600 font-medium border-blue-500"
              : "bg-gray-50 text-gray-600"
              }`}
            onClick={() => setActiveTab("map")}
          >
            Map
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 py-4 flex flex-col">
        {activeTab === "recent" && (
          <div className="flex flex-col h-full">
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
                      className="flex items-center p-3 rounded-md bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() =>
                        handleLocationSelect({
                          ...location,
                          name: location.name ?? "",
                          coordinates:
                            location.coordinates == null
                              ? [0, 0]
                              : typeof location.coordinates === "string"
                                ? location.coordinates.split(" ").map(Number) as [number, number]
                                : location.coordinates,
                          organisation_id: location.organisation_id ?? "",
                        })
                      }
                    >
                      <MapPin className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {location.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No locations found</p>
                    <p className="text-xs">Try searching on the map</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {activeTab === "map" && (
          <div className="flex flex-col h-full">
            {isAddingLocation ? (
              <div className="p-4 bg-yellow-50 rounded-md mb-4">
                <h3 className="font-medium text-sm mb-2">Add New Location</h3>
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
              <div className="p-4 bg-blue-50 rounded-md mb-4">
                <p className="text-sm text-blue-700">
                  Use the search bar above the map to find locations, or tap
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
        )}
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            {selectedLocation
              ? `Selected: ${selectedLocation.name}`
              : "No location selected"}
          </p>
          <Button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
};
