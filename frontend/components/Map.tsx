"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React, { useEffect, useRef, useMemo, RefObject , memo} from "react";
import { PhotoMetadata } from "@/types/api";
import { MapPin, Image } from "lucide-react";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl; // eslint-disable-line

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Create custom active marker icon
const createCustomIcon = (isActive: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative">
        <div class="${
          isActive
            ? "w-6 h-6 bg-red-600 border-2 border-white shadow-lg"
            : "w-5 h-5 bg-gray-600 border-2 border-white shadow-md"
        } rounded-full transition-all duration-200 ${
      isActive ? "scale-110" : ""
    }"></div>
        ${
          isActive
            ? '<div class="absolute -top-1 -left-1 w-8 h-8 bg-gray-400/30 rounded-full animate-pulse"></div>'
            : ""
        }
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const activeIcon = createCustomIcon(true);
const inactiveIcon = createCustomIcon(false);

interface MapMarkerProps {
  file: PhotoMetadata & { index: number };
  isActive: boolean;
  onSelect: (index: number) => void;
  markerRef: (el: L.Marker | null) => void;
}

const MapMarker: React.FC<MapMarkerProps> = memo(({ file, isActive, onSelect, markerRef }) => {
  const eventHandlers = useMemo(
    () => ({
      click() {
        onSelect(file.index);
      },
    }),
    [file.index, onSelect]
  );

  if (!file.coords) return null;

  return (
    <Marker
      key={file.id}
      position={[file.coords.latitude, file.coords.longitude]}
      icon={isActive ? activeIcon : inactiveIcon}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup className="custom-popup">
        <div className="w-32 space-y-2">
          <img
            src={file.thumbnail}
            alt={`Photo ${file.id}`}
            className="w-full h-24 object-cover rounded-lg"
          />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">Photo ID: {file.id}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});
MapMarker.displayName = 'MapMarker'; 

export interface MapDisplayProps {
  files: PhotoMetadata[];
  activeIndex: number | null;
  onActiveIndexChange: (index: number) => void;
}

const useMapLogic = (files: PhotoMetadata[]) => {
  const filesWithCoords = useMemo(
    () => files.map((f, i) => ({ ...f, index: i })).filter((f) => f.coords),
    [files]
  );

  return { filesWithCoords };
};

interface MapEventsProps {
  filesWithCoords: (PhotoMetadata & { index: number })[];
  activeIndex: number | null;
  markerRefs: RefObject<(L.Marker | null)[]>;
}

const MapEvents: React.FC<MapEventsProps> = ({
  filesWithCoords,
  activeIndex,
  markerRefs,
}) => {
  const map = useMap();

  useEffect(() => {
    if (filesWithCoords.length === 0) return;

    const bounds = L.latLngBounds(
      filesWithCoords.map((f) => [f.coords!.latitude, f.coords!.longitude])
    );
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
  }, [map, filesWithCoords]);

  useEffect(() => {
    if (activeIndex === null) return;

    const activeFile = filesWithCoords.find((f) => f.index === activeIndex);
    const activeMarker = markerRefs.current[activeIndex];

    if (activeFile?.coords && activeMarker) {
      map.setView(
        [activeFile.coords.latitude, activeFile.coords.longitude],
        Math.max(map.getZoom(), 12),
        {
          animate: true,
          duration: 0.5,
        }
      );
      setTimeout(() => activeMarker.openPopup(), 200);
    }
  }, [activeIndex, map, filesWithCoords, markerRefs]);

  return null;
};

const ZoomControls = () => {
    const map = useMap();
    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            <button
                onClick={() => map.zoomIn()}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-md shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                title="Zoom in"
            >+</button>
            <button
                onClick={() => map.zoomOut()}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-md shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                title="Zoom out"
            >−</button>
        </div>
    );
}

const MapDisplayComponent: React.FC<MapDisplayProps> = ({
  files,
  activeIndex,
  onActiveIndexChange,
}) => {
  const { filesWithCoords } = useMapLogic(files);
  const markerRefs = useRef<(L.Marker | null)[]>([]);

  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, files.length);
  }, [files.length]);

  if (filesWithCoords.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">
            No Location Data
          </h3>
          <p className="text-gray-600">
            Photos with GPS coordinates will appear on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">
              Photo Locations
            </h3>
            <p className="text-sm text-gray-600">
              {filesWithCoords.length} photo
              {filesWithCoords.length !== 1 ? "s" : ""} with GPS data
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <MapContainer
          scrollWheelZoom={true}
          className="h-96 w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControls />

          {filesWithCoords.map((file) => (
            <MapMarker
              key={file.id}
              file={file}
              isActive={file.index === activeIndex}
              onSelect={onActiveIndexChange}
              markerRef={(el) => {
                if (file.index !== undefined) {
                  markerRefs.current[file.index] = el;
                }
              }}
            />
          ))}

          <MapEvents
            filesWithCoords={filesWithCoords}
            activeIndex={activeIndex}
            markerRefs={markerRefs}
          />
        </MapContainer>

        {/* Map Stats Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-black">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-black-400" />
            <span>{filesWithCoords.length} locations</span>
          </div>
        </div>
      </div>

      {/* Custom Styles for Leaflet */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: none;
        }
        .leaflet-popup-tip {
          background: white;
          border: none;
          box-shadow: none;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
        .custom-marker {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
};

export const MapDisplay = memo(MapDisplayComponent);