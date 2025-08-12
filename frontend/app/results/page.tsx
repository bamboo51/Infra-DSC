"use client";

import { useState } from "react";
import { MapDisplayProps } from "@/components/Map";
import { useAllResults } from "@/hooks/allResults";
import dynamic from "next/dynamic";
import { ResultDisplay } from "@/components/ResultDisplayProps";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => <p className="text-center mt-8">Loading map...</p>,
  }
);

export default function ResultsPage() {
  const {
    allFiles,
    activeFileIndex,
    setActiveFileIndex,
    isLoading,
    error,
    canvasRef,
  } = useAllResults();
  
  const activeFile =
    activeFileIndex !== null && allFiles.length > 0
      ? allFiles[activeFileIndex]
      : null;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-gray-900 text-white font-sans">
      {/* Main container: Stacks vertically on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        
        {/* Photo List Section */}
        {allFiles.length > 0 && (
            <div className="flex-shrink-0 p-4 border-b md:border-b-0 md:border-r border-gray-700 md:w-1/3 lg:w-1/4 md:h-full md:overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">All Uploaded Photos</h2>
              
              {/* Photo Rail: Scrolls horizontally on mobile, stacks vertically on desktop */}
              <div className="flex flex-row space-x-3 pb-2 overflow-x-auto md:flex-col md:space-x-0 md:space-y-2 md:pb-0">
                {allFiles.map((file, index) => (
                  <div
                    key={file.id}
                    onClick={() => setActiveFileIndex(index)}
                    // flex-shrink-0 prevents items from shrinking in the horizontal scroll view
                    className={`flex-shrink-0 flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      activeFileIndex === index
                        ? "bg-blue-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <img
                      src={file.image}
                      alt={`Thumbnail for ID ${file.id}`}
                      className="w-12 h-12 rounded-md object-cover mr-3"
                    />
                    <span className="font-medium">ID: {file.id}</span>
                  </div>
                ))}
              </div>
            </div>
        )}

        {/* Right Column: Canvas and Map */}
        <div className="flex-grow p-6 overflow-y-auto">
          {activeFile ? (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Results for Photo ID: {activeFile.id}
              </h2>
              <div className="space-y-6">
                <ResultDisplay
                  canvasRef={canvasRef}
                  hasActiveImage={true}
                  error={""}
                />
                <DynamicMapDisplay
                  files={allFiles}
                  activeIndex={activeFileIndex}
                />
              </div>
            </>
          ) : (
            // Improved placeholder text based on whether files exist
            <div className="flex items-center justify-center h-full text-gray-400">
              {allFiles.length > 0 ? (
                <p className="text-lg">Select a photo to view its results.</p>
              ) : (
                <p className="text-lg">No photos have been uploaded yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}