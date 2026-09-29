"use client";

import React, { useState } from "react";
import { X, MapPin, Check, ChevronRight, Search } from "lucide-react";
import { useLocation } from "@/lib/location/LocationContext";

export default function LocationSelectorModal() {
  const { location, regions, isModalOpen, closeLocationModal, setLocation } = useLocation();

  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>(location.regionSlug);
  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState<string>(location.districtSlug);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(location.neighborhood || "");
  const [search, setSearch] = useState("");

  if (!isModalOpen) return null;

  const currentRegion = regions.find((r) => r.slug === selectedRegionSlug) || regions[0];
  const currentDistricts = currentRegion?.districts || [];
  const currentDistrict = currentDistricts.find((d) => d.slug === selectedDistrictSlug);
  const currentNeighborhoods = currentDistrict?.neighborhoods || [];

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = () => {
    const reg = regions.find((r) => r.slug === selectedRegionSlug);
    const dist = currentDistricts.find((d) => d.slug === selectedDistrictSlug);

    const regionName = reg ? reg.name : "Toshkent shahri";
    const districtName = dist ? dist.name : "Barcha tumanlar";

    setLocation(
      regionName,
      selectedRegionSlug,
      districtName,
      selectedDistrictSlug,
      selectedNeighborhood || undefined
    );
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Hududingizni tanlang</h2>
              <p className="text-xs text-on-surface-variant">
                O‘zbekiston bo‘yicha usta va xizmatlarni topish uchun
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLocationModal}
            className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
          {/* Column 1: Regions */}
          <div className="p-5 flex flex-col gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Viloyat qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-xl text-xs outline-none border border-outline-variant/30 text-on-surface"
              />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Viloyat / Shahar (14 ta)
            </span>

            <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
              {filteredRegions.map((reg) => {
                const isSelected = reg.slug === selectedRegionSlug;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      setSelectedRegionSlug(reg.slug);
                      setSelectedDistrictSlug("");
                      setSelectedNeighborhood("");
                    }}
                    className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <span>{reg.name}</span>
                    {isSelected ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Districts in Selected Region */}
          <div className="p-5 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              {currentRegion?.name}: Tuman / Shahar
            </span>

            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
              {/* Option: Whole region */}
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrictSlug("");
                  setSelectedNeighborhood("");
                }}
                className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors cursor-pointer ${
                  !selectedDistrictSlug
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "hover:bg-surface-container text-on-surface"
                }`}
              >
                <span>Barcha tumanlar ({currentRegion?.name})</span>
                {!selectedDistrictSlug && <Check className="w-4 h-4" />}
              </button>

              {currentDistricts.map((dist) => {
                const isSelected = dist.slug === selectedDistrictSlug;
                return (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => {
                      setSelectedDistrictSlug(dist.slug);
                      setSelectedNeighborhood("");
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold border border-primary/30"
                        : "hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <span>{dist.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Neighborhoods (if selected district has any) */}
            {currentNeighborhoods.length > 0 && selectedDistrictSlug && (
              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                  Mahalla / Hudud (Ixtiyoriy)
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {currentNeighborhoods.map((n) => {
                    const isNSelected = selectedNeighborhood === n.name;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() =>
                          setSelectedNeighborhood(isNSelected ? "" : n.name)
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          isNSelected
                            ? "bg-primary text-on-primary font-bold"
                            : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant font-medium">
            Tanlangan: <strong className="text-on-surface">{currentRegion?.name}</strong>
            {selectedDistrictSlug && (
              <>
                {" • "}
                <strong className="text-on-surface">
                  {currentDistricts.find((d) => d.slug === selectedDistrictSlug)?.name}
                </strong>
              </>
            )}
            {selectedNeighborhood && (
              <>
                {" • "}
                <strong className="text-primary">{selectedNeighborhood}</strong>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Tasdiqlash va saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
