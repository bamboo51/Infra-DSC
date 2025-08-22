"use client";

import { crackDetection } from "@/hooks/crackDetection";
import { PredictButton } from "@/components/PredictButtonProps";
import { ResultDisplay } from "@/components/ResultDisplayProps";
import { Dropzone } from "@/components/DropZone";
import { ImageGallery } from "@/components/ImageGallery";
import { MapDisplayProps } from "@/components/Map";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => <p className="text-center mt-8">Loading map...</p>,
  }
);

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
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-100 rounded-full filter blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-50 rounded-full filter blur-xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 2l-4 20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 2l4 20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 2v20"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-black">
              Infra-DSC
            </h1>
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-2xl text-gray-800 font-semibold">
                目指そう。安全な道路をみんなへ。
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                私たちは安全な移動の実現をお手伝いします。
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Upload Section */}
          <section className="mb-12 relative">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center mb-8 justify-center">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-black">
                  Upload Images for Analysis
                </h2>
              </div>

              <div className="space-y-6">
                <Dropzone
                  processFiles={processFiles}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  disabled={isLoading}
                />

                <div className="flex justify-center">
                  <PredictButton
                    onClick={handlePredictAll}
                    isLoading={isLoading}
                    disabled={activeFileIndex === null || allPredicted}
                  />
                </div>

                <ImageGallery
                  files={selectedFiles}
                  results={results}
                  activeIndex={activeFileIndex}
                  onSelect={setActiveFileIndex}
                />
              </div>
            </div>
          </section>

          {/* Results Section */}
          {(selectedFiles.length > 0 || activeFileIndex !== null) && (
            <section className="relative">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="flex items-center mb-8 justify-center">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    Analysis Results
                  </h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="relative group">
                    <div className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm">
                      <ResultDisplay
                        canvasRef={canvasRef}
                        hasActiveImage={activeFileIndex !== null}
                        error={error}
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm">
                      <DynamicMapDisplay
                        files={filesForMap}
                        activeIndex={activeFileIndex}
                        onActiveIndexChange={setActiveFileIndex}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}
