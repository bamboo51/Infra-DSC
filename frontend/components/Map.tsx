"use client";
// Added leaflet import for typing (L)
import L from 'leaflet'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import React, { useEffect, useRef, useMemo, RefObject } from 'react';
import { SelectedFile } from '@/types/api';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

// Defined Coords type for clarity
export interface Coords {
    latitude: number;
    longitude: number;
}

export interface MapDisplayProps {
    files: SelectedFile[];
    activeIndex: number | null;
}

// --- Custom Hook (Slightly Simplified) ---
// No major changes needed here, it's already well-designed.
// We remove `initialCenter` as it's no longer needed thanks to `fitBounds`.
const useMapLogic = (files: SelectedFile[]) => {
    const filesWithCoords = useMemo(() => 
        files.map((f, i) => ({...f, index: i})).filter(f => f.coords), 
    [files]);

    return { filesWithCoords };
};


// --- New Centralized Effects Component ---
// This component handles all imperative interactions with the map instance.
interface MapEventsProps {
    filesWithCoords: (SelectedFile & { index: number })[];
    activeIndex: number | null;
    markerRefs: RefObject<(L.Marker | null)[]>;
}

const MapEvents: React.FC<MapEventsProps> = ({ filesWithCoords, activeIndex, markerRefs }) => {
    const map = useMap();

    // Effect 1: On initial load, fit the map to show all markers.
    useEffect(() => {
        if (filesWithCoords.length === 0) return;

        const bounds = L.latLngBounds(
            filesWithCoords.map(f => [f.coords!.latitude, f.coords!.longitude])
        );
        
        map.fitBounds(bounds, { padding: [50, 50] }); // Add padding so markers aren't on the edge
    }, [map, filesWithCoords]); // Reruns if the set of photos changes

    // Effect 2: Pan the map and open the popup for the active file.
    useEffect(() => {
        if (activeIndex === null) return;
        
        const activeFile = filesWithCoords.find(f => f.index === activeIndex);
        const activeMarker = markerRefs.current[activeIndex];

        if (activeFile?.coords && activeMarker) {
            map.panTo([activeFile.coords.latitude, activeFile.coords.longitude]);
            activeMarker.openPopup();
        }
    }, [activeIndex, map, filesWithCoords, markerRefs]);

    return null;
}

// --- Main Component (Refactored) ---
export const MapDisplay: React.FC<MapDisplayProps> = ({ files, activeIndex }) => {
    // 1. Simplified the hook call
    const { filesWithCoords } = useMapLogic(files);
    const markerRefs = useRef<(L.Marker | null)[]>([]);

    // This effect is still useful to prevent stale refs if the `files` array shrinks.
    useEffect(() => {
        markerRefs.current = markerRefs.current.slice(0, files.length);
    }, [files.length]);

    if (filesWithCoords.length === 0) {
        return <div className="mt-8 text-gray-500">No photos with location data found.</div>;
    }

    return (
        <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Photo Locations</h3>
            {/* 2. Removed `center` and `zoom` props. The MapEvents component will handle the view. */}
            <MapContainer scrollWheelZoom={true} className="h-96 w-full rounded-lg z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filesWithCoords.map(({ coords, preview, index }) => (
                    // The conditional check here is redundant because filesWithCoords are pre-filtered, but it's harmless.
                    coords && (
                        <Marker 
                            key={index} 
                            position={[coords.latitude, coords.longitude]}
                            ref={(el) => { markerRefs.current[index] = el; }}
                        >
                            <Popup>
                                <img src={preview} alt="preview" className="w-24 h-24 object-cover"/>
                            </Popup>
                        </Marker>
                    )
                ))}

                {/* 3. Use the new centralized MapEvents component */}
                <MapEvents 
                    filesWithCoords={filesWithCoords}
                    activeIndex={activeIndex}
                    markerRefs={markerRefs}
                />
            </MapContainer>
        </div>
    );
};