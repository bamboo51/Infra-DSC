"use client";

import L from 'leaflet'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import React, { useEffect, useRef, useMemo, RefObject } from 'react';
import { SelectedFile, PhotoWithResults } from '@/types/api';
import 'leaflet/dist/leaflet.css';

// eslint-disable-next-line
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
})
type MapFile = Partial<PhotoWithResults> & Partial<SelectedFile>;
export interface MapDisplayProps {
    files: MapFile[];
    activeIndex: number | null;
    onActiveIndexChange: (index: number) => void;
}

const useMapLogic = (files: MapFile[]) => {
    const filesWithCoords = useMemo(() => 
        files.map((f, i) => ({...f, index: i})).filter(f => f.coords), 
    [files]);

    return { filesWithCoords };
};

interface MapEventsProps {
    filesWithCoords: (MapFile & { index: number })[];
    activeIndex: number | null;
    markerRefs: RefObject<(L.Marker | null)[]>;
}

const MapEvents: React.FC<MapEventsProps> = ({ filesWithCoords, activeIndex, markerRefs }) => {
    const map = useMap();

    useEffect(() => {
        if (filesWithCoords.length === 0) return;

        const bounds = L.latLngBounds(
            filesWithCoords.map(f => [f.coords!.latitude, f.coords!.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] }); 
    }, [map, filesWithCoords]);

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

export const MapDisplay: React.FC<MapDisplayProps> = ({ files, activeIndex, onActiveIndexChange }) => {
    const { filesWithCoords } = useMapLogic(files);
    const markerRefs = useRef<(L.Marker | null)[]>([]);

    useEffect(() => {
        markerRefs.current = markerRefs.current.slice(0, files.length);
    }, [files.length]);

    if (filesWithCoords.length === 0) {
        return <div className="mt-8 text-gray-500">No photos with location data found.</div>;
    }

    return (
        <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Photo Locations</h3>
            <MapContainer scrollWheelZoom={true} className="h-96 w-full rounded-lg z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filesWithCoords.map((file) => {
                    if (file.coords === null) return null; // Skip if no coordinates
                    return (
                        <Marker
                            key={file.id ?? file.file?.name}
                            position={[
                                file.coords?.latitude ?? 0,
                                file.coords?.longitude ?? 0
                            ]}
                            ref={(el) => { if (file.index !== undefined) markerRefs.current[file.index] = el; }}
                            eventHandlers={{
                                click: () => {
                                    onActiveIndexChange(file.index!);
                                }
                            }}
                        >
                            <Popup>
                                <img src={file.image || file.preview} alt="preview" className="w-24 h-24 object-cover"/>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapEvents 
                    filesWithCoords={filesWithCoords}
                    activeIndex={activeIndex}
                    markerRefs={markerRefs}
                />
            </MapContainer>
        </div>
    );
};