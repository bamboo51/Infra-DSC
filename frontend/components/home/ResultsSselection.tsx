import React from "react";
import dynamic from "next/dynamic";
import { ResultDisplay } from "../ui/ResultDisplayProps";
import { MapDisplayProps, MapFile } from "../ui/Map";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/ui/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => <p className="text-center mt-8">Loading map...</p>,
  }
);

interface ResultsSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeFileIndex: number | null;
  error: string | null;
  filesForMap: MapFile[];
  setActiveFileIndex: (index: number | null) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  canvasRef,
  activeFileIndex,
  error,
  filesForMap,
  setActiveFileIndex,
}) => {
  return (
    <section className="relative">
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="flex items-center mb-8 justify-center">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black">
            検出結果
          </h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="relative group">
            <ResultDisplay
              canvasRef={canvasRef}
              hasActiveImage={activeFileIndex !== null}
              error={error}
            />
          </div>
          <div className="relative group">
            <DynamicMapDisplay
              files={filesForMap}
              activeIndex={activeFileIndex}
              onActiveIndexChange={setActiveFileIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
};