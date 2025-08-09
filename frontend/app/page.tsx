"use client";

import { crackDetection } from "@/hooks/crackDetection";
import { PredictButton } from "@/components/PredictButtonProps";
import { ResultDisplay } from "@/components/ResultDisplayProps";
import { Dropzone } from "@/components/DropZone";
import { ImageGallery } from "@/components/ImageGallery";

export default function App(){
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

const allPredicted = selectedFiles.length > 0 && Object.keys(results).length === selectedFiles.length;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Infra-DSC Crack Detection
          </h1>
        </header>

        <section className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col items-center">
          <Dropzone 
            processFiles={processFiles}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            disabled={isLoading}
          />
          <PredictButton onClick={handlePredictAll} isLoading={isLoading} disabled={activeFileIndex === null || allPredicted} />
          <ImageGallery files={selectedFiles} results={results} activeIndex={activeFileIndex} onSelect={setActiveFileIndex} />
        </section>

        <ResultDisplay
          canvasRef={canvasRef}
          hasActiveImage={activeFileIndex !== null}
          error={error}
        />
      </div>
    </main>
  );
}