"use client";

import { useMemo } from "react";

import Hero from "@/components/ui/Hero";
import BackgroundBlobs from "@/components/ui/BackgroundBlobs";
import { crackDetection } from "@/hooks/crackDetection";
import { heroData } from "@/data/about";
import { ResultsSection } from "@/components/home/ResultsSselection";
import { UploadSection } from "@/components/home/UploadSelection";

export default function App() {
  const {
    selectedFiles,
    activeFileIndex,
    setActiveFileIndex,
    results,
    isLoading,
    isDragging,
    setIsDragging,
    error,
    canvasRef,
    processFiles,
    handlePredictAll,
  } = crackDetection();

  const allPredicted =
    selectedFiles.length > 0 &&
    Object.keys(results).length === selectedFiles.length;

  const filesForMap = useMemo(() => {
    return selectedFiles.map((file, index) => ({
      id: index,
      thumbnail: file.preview,
      coords: file.coords,
      uploaded_at: new Date().toISOString(),
    }));
  }, [selectedFiles]);

  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">
      <BackgroundBlobs />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Hero {...heroData} />

        <div className="max-w-7xl mx-auto">
          <UploadSection
            processFiles={processFiles}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            isLoading={isLoading}
            handlePredictAll={handlePredictAll}
            selectedFiles={selectedFiles}
            results={results}
            activeFileIndex={activeFileIndex}
            setActiveFileIndex={setActiveFileIndex}
            allPredicted={allPredicted}
          />

          {/* Conditional rendering is now much cleaner */}
          {(selectedFiles.length > 0 || activeFileIndex !== null) && (
            <ResultsSection
              canvasRef={canvasRef}
              activeFileIndex={activeFileIndex}
              error={error}
              filesForMap={filesForMap}
              setActiveFileIndex={setActiveFileIndex}
            />
          )}
        </div>
      </div>
    </main>
  );
}
