"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React, { useEffect, useRef, useMemo, RefObject, memo, useCallback } from "react";
import { PhotoMetadata } from "@/types/api";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Types
export interface MapFile {
  id: number;
  thumbnail: string;
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  uploaded_at: string;
}

interface PhotoWithIndex extends PhotoMetadata {
  index: number;
}

// Constants
const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  MAX_ZOOM: 15,
  PADDING: [20, 20] as [number, number],
  ANIMATION_DURATION: 0.5,
  POPUP_DELAY: 200,
} as const;

// Custom marker icons - memoized to prevent recreation
const createCustomIcon = (isActive: boolean): L.DivIcon => {
  const size = isActive ? 6 : 5;
  const bgColor = isActive ? "bg-red-600" : "bg-gray-600";
  const shadowClass = isActive ? "shadow-lg" : "shadow-md";
  const pulseRing = isActive 
    ? '<div class="absolute -top-1 -left-1 w-8 h-8 bg-red-400/30 rounded-full animate-pulse"></div>'
    : "";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative">
        <div class="w-${size} h-${size} ${bgColor} border-2 border-white ${shadowClass} rounded-full transition-all duration-200 ${isActive ? "scale-110" : ""}"></div>
        ${pulseRing}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Memoized icons
const ICONS = {
  active: createCustomIcon(true),
  inactive: createCustomIcon(false),
} as const;

// Map Marker Component
interface MapMarkerProps {
  file: PhotoWithIndex;
  isActive: boolean;
  onSelect: (index: number) => void;
  markerRef: (el: L.Marker | null) => void;
}

const MapMarker = memo<MapMarkerProps>(({ file, isActive, onSelect, markerRef }) => {
  const handleClick = useCallback(() => {
    onSelect(file.index);
  }, [file.index, onSelect]);

  const eventHandlers = useMemo(() => ({
    click: handleClick,
  }), [handleClick]);

  if (!file.coords) return null;

  return (
    <Marker
      key={file.id}
      position={[file.coords.latitude, file.coords.longitude]}
      icon={isActive ? ICONS.active : ICONS.inactive}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup className="custom-popup">
        <div className="w-32 space-y-2">
          <img
            src={file.thumbnail}
            alt={`Photo ${file.id}`}
            className="w-full h-24 object-cover rounded-lg"
            loading="lazy"
          />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">
              Photo ID: {file.id}
            </p>
            <p className="text-xs text-gray-600">
              {new Date(file.uploaded_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});
MapMarker.displayName = 'MapMarker'; 

// Custom hooks
const useFilesWithCoords = (files: PhotoMetadata[]): PhotoWithIndex[] => {
  return useMemo(
    () => files
      .map((file, index) => ({ ...file, index }))
      .filter((file): file is PhotoWithIndex => Boolean(file.coords)),
    [files]
  );
};

const useMarkerRefs = (filesLength: number) => {
  const markerRefs = useRef<(L.Marker | null)[]>([]);

  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, filesLength);
  }, [filesLength]);

  return markerRefs;
};

// Map Display Props
export interface MapDisplayProps {
  files: PhotoMetadata[];
  activeIndex: number | null;
  onActiveIndexChange: (index: number) => void;
}

// Map Events Component
interface MapEventsProps {
  filesWithCoords: PhotoWithIndex[];
  activeIndex: number | null;
  markerRefs: RefObject<(L.Marker | null)[]>;
}

const MapEvents = memo<MapEventsProps>(({
  filesWithCoords,
  activeIndex,
  markerRefs,
}) => {
  const map = useMap();

  // Fit bounds to show all markers
  useEffect(() => {
    if (filesWithCoords.length === 0) return;

    const bounds = L.latLngBounds(
      filesWithCoords.map((file) => [
        file.coords!.latitude,
        file.coords!.longitude
      ])
    );
    
    map.fitBounds(bounds, {
      padding: MAP_CONFIG.PADDING,
      maxZoom: MAP_CONFIG.MAX_ZOOM
    });
  }, [map, filesWithCoords]);

  // Handle active marker changes
  useEffect(() => {
    if (activeIndex === null) return;

    const activeFile = filesWithCoords.find((file) => file.index === activeIndex);
    const activeMarker = markerRefs.current?.[activeIndex];

    if (activeFile?.coords && activeMarker) {
      map.setView(
        [activeFile.coords.latitude, activeFile.coords.longitude],
        Math.max(map.getZoom(), MAP_CONFIG.DEFAULT_ZOOM),
        {
          animate: true,
          duration: MAP_CONFIG.ANIMATION_DURATION,
        }
      );
      
      setTimeout(() => {
        activeMarker.openPopup();
      }, MAP_CONFIG.POPUP_DELAY);
    }
  }, [activeIndex, map, filesWithCoords, markerRefs]);

  return null;
});
MapEvents.displayName = 'MapEvents';

// Zoom Controls Component
const ZoomControls = memo(() => {
  const map = useMap();

  const handleZoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);

  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white border border-gray-300 rounded-t-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 border-b-0"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white border border-gray-300 rounded-b-lg shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});
ZoomControls.displayName = 'ZoomControls';

// Empty State Component
const EmptyMapState = memo(() => (
  <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">
        位置データなし
      </h3>
      <p className="text-gray-600">
        GPS座標を含む写真がマップに表示されます。
      </p>
    </div>
  </div>
));
EmptyMapState.displayName = 'EmptyMapState';

// Map Header Component
interface MapHeaderProps {
  filesCount: number;
}

const MapHeader = memo<MapHeaderProps>(({ filesCount }) => (
  <div className="p-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black">劣化位置データ</h3>
        <p className="text-sm text-gray-600">
          {filesCount} 枚の画像にGPSデータがあります
        </p>
      </div>
      </div>
    </div>
  </div>
));
MapHeader.displayName = 'MapHeader';

// Map Stats Overlay
interface MapStatsProps {
  count: number;
}

const MapStats = memo<MapStatsProps>(({ count }) => (
  <div className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-black">
    <div className="flex items-center space-x-2">
      <MapPin className="w-4 h-4 text-gray-600" />
      <span>{count} locations</span>
    </div>
  </div>
));
MapStats.displayName = 'MapStats';
// Main Map Display Component
const MapDisplayComponent = memo<MapDisplayProps>(({
  files,
  activeIndex,
  onActiveIndexChange,
}) => {
  const filesWithCoords = useFilesWithCoords(files);
  const markerRefs = useMarkerRefs(files.length);

  if (filesWithCoords.length === 0) {
    return <EmptyMapState />;
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <MapHeader filesCount={filesWithCoords.length} />

      {/* Map Container */}
      <div className="relative z-0">
        <MapContainer
          scrollWheelZoom={true}
          className="h-96 w-full relative z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControls />

          {filesWithCoords.map((file: PhotoWithIndex) => (
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

        <MapStats count={filesWithCoords.length} />
      </div>

      {/* Custom Styles for Leaflet */}
      <style jsx global>{`
        /* Fix z-index layering to prevent map from appearing over navbar */
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 10 !important;
        }
        .leaflet-popup-pane {
          z-index: 700 !important;
        }
        .leaflet-tooltip-pane {
          z-index: 650 !important;
        }
        .leaflet-marker-pane {
          z-index: 600 !important;
        }
        .leaflet-shadow-pane {
          z-index: 500 !important;
        }
        .leaflet-overlay-pane {
          z-index: 400 !important;
        }
        .leaflet-map-pane {
          z-index: auto !important;
        }
        .leaflet-tile-pane {
          z-index: 200 !important;
        }
        
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
        .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
});
MapDisplayComponent.displayName = 'MapDisplayComponent';

export const MapDisplay = memo(MapDisplayComponent);