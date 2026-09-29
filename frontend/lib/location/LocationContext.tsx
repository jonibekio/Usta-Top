"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RegionItem, DistrictItem, getLocationHierarchy } from "../api/locations";

interface LocationState {
  region: string;
  regionSlug: string;
  district: string;
  districtSlug: string;
  neighborhood?: string;
}

interface LocationContextType {
  location: LocationState;
  regions: RegionItem[];
  isLoading: boolean;
  isModalOpen: boolean;
  setLocation: (region: string, regionSlug: string, district: string, districtSlug: string, neighborhood?: string) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const DEFAULT_LOCATION: LocationState = {
  region: "Toshkent shahri",
  regionSlug: "toshkent-shahri",
  district: "Barcha tumanlar",
  districtSlug: "",
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationState>(DEFAULT_LOCATION);
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Load saved location from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("usta_top_location");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.region) {
            setLocationState(parsed);
          }
        } catch {}
      }
    }

    // 2. Fetch hierarchy from backend
    getLocationHierarchy()
      .then((data) => {
        if (data && data.length > 0) {
          setRegions(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setLocation = (
    region: string,
    regionSlug: string,
    district: string,
    districtSlug: string,
    neighborhood?: string
  ) => {
    const newState: LocationState = {
      region,
      regionSlug,
      district,
      districtSlug,
      neighborhood,
    };
    setLocationState(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("usta_top_location", JSON.stringify(newState));
    }
  };

  const openLocationModal = () => setIsModalOpen(true);
  const closeLocationModal = () => setIsModalOpen(false);

  return (
    <LocationContext.Provider
      value={{
        location,
        regions,
        isLoading,
        isModalOpen,
        setLocation,
        openLocationModal,
        closeLocationModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
