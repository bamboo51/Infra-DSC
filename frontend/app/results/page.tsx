"use client";

import { MapDisplayProps } from "@/components/Map";
import { useAllResults } from "@/hooks/allResults";
import dynamic from "next/dynamic";
import { ResultDisplay } from "@/components/ResultDisplayProps";
import { ChevronLeft, ChevronRight, Image, Upload } from "lucide-react";
import { useState, memo } from "react";
import { PhotoMetadata } from "@/types/api";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span>Loading map...</span>
        </div>
      </div>
    ),
  }
);

const Sidebar = memo(
  ({
    files,
    activeIndex,
    onSelect,
    isCollapsed,
    onToggleCollapse,
  }: {
    files: PhotoMetadata[];
    activeIndex: number | null;
    onSelect: (index: number) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
  }) => {
    return (
      <div
        className={`
            flex-shrink-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out
            ${isCollapsed ? "w-16" : "w-80 lg:w-96"} flex flex-col shadow-lg
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Photo Gallery
                </h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                  {files.length} photos analyzed
                </p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isCollapsed ? (
            <div className="space-y-3">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(index)}
                  className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 transform ${
                    activeIndex === index
                      ? "ring-2 ring-black scale-110 shadow-lg"
                      : "hover:scale-105 opacity-70 hover:opacity-100 hover:shadow-lg"
                  }`}
                  title={`Photo ID: ${file.id}`}
                >
                  <img
                    src={file.thumbnail}
                    alt={`Thumbnail ${file.id}`}
                    className="w-full h-full object-cover"
                  />
                  {activeIndex === index && (
                    <div className="absolute inset-0 bg-black/20"></div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(index)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeIndex === index
                      ? "ring-2 ring-black shadow-xl"
                      : "hover:shadow-xl hover:shadow-black/30"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={file.thumbnail}
                      alt={`Photo ${file.id}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${
                        activeIndex === index
                          ? "bg-black/20"
                          : "bg-black/0 group-hover:bg-black/20"
                      }`}
                    />
                    {activeIndex === index && (
                      <div className="absolute top-3 right-3 w-4 h-4 bg-black rounded-full ring-2 ring-white shadow-lg" />
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-600/50">
                      <span className="text-xs font-semibold text-white">
                        ID: {file.id}
                      </span>
                    </div>
                    {/* Hover overlay with analysis info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">Analysis Complete</p>
                        <p className="text-gray-300 text-xs">Click to view details</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

const MainContent = memo(
  ({
    allFiles,
    activeFile,
    activeFileIndex,
    setActiveFileIndex,
    isDetailsLoading,
    error,
    canvasRef,
  }: ReturnType<typeof useAllResults>) => {
    // This is the initial "welcome screen" when no photos have ever been processed.
    if (allFiles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="text-center max-w-md bg-gray-50 rounded-3xl p-12 border border-gray-200 shadow-lg">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">No Photos Yet</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Your analyzed photos will appear here once you start uploading and processing images.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Photos
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-6 shadow-lg">
          <div className="flex items-center justify-between h-auto">
            {activeFile ? (
              <>
                {/* Header content for active file */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{activeFile.id}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-black">
                      Analysis Results
                    </h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Photo ID: {activeFile.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      setActiveFileIndex(
                        Math.max(0, (activeFileIndex || 0) - 1)
                      )
                    }
                    disabled={activeFileIndex === 0}
                    className="p-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="text-center px-4 py-2 bg-gray-100 rounded-xl border border-gray-200">
                    <span className="text-sm font-semibold text-black">
                      {(activeFileIndex || 0) + 1} of {allFiles.length}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setActiveFileIndex(
                        Math.min(
                          allFiles.length - 1,
                          (activeFileIndex || 0) + 1
                        )
                      )
                    }
                    disabled={activeFileIndex === allFiles.length - 1}
                    className="p-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Photo Analysis Dashboard
                </h1>
                <p className="text-gray-600 mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Select a photo from the gallery to begin analysis review
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="relative group">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                {isDetailsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-lg text-black font-semibold mb-1">Analyzing Photo</p>
                        <p className="text-gray-600 text-sm">Processing detection results...</p>
                      </div>
                    </div>
                  </div>
                ) : activeFile ? (
                  <ResultDisplay
                    canvasRef={canvasRef}
                    hasActiveImage={!!activeFile}
                    error={error}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-center">
                    <div>
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image className="w-8 h-8 text-black" />
                      </div>
                      <h4 className="text-lg font-semibold text-black mb-2">
                        Select a Photo
                      </h4>
                      <p className="text-gray-600">
                        Choose a photo from the gallery to view its detailed analysis results.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative group">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <DynamicMapDisplay
                  files={allFiles}
                  activeIndex={activeFileIndex}
                  onActiveIndexChange={setActiveFileIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
MainContent.displayName = "MainContent";

export default function ResultsPage() {
  const resultsData = useAllResults();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (resultsData.isListLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white relative overflow-hidden">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Loading Photos</h2>
            <p className="text-gray-600">Retrieving your analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (resultsData.error && resultsData.allFiles.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-red-50 relative overflow-hidden">
        <div className="text-center max-w-md px-6">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Connection Error</h2>
          <p className="text-red-600 text-lg leading-relaxed mb-6">{resultsData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-white text-black font-sans relative overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {resultsData.allFiles.length > 0 && (
          <Sidebar
            files={resultsData.allFiles}
            activeIndex={resultsData.activeFileIndex}
            onSelect={resultsData.setActiveFileIndex}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />
        )}
        <MainContent {...resultsData} />
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
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
