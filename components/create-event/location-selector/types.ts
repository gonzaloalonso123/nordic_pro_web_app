export interface Location {
  id?: string;
  name: string;
  coordinates: [number, number];
  organisation_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface LocationSelectorProps {
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
  organisationId: string;
  recentLocations?: Location[];
  onAddLocation?: (
    location: Omit<Location, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
}
