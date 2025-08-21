"use client";

import { MapDisplayProps } from "@/components/Map";
import { useAllResults } from "@/hooks/allResults";
import dynamic from "next/dynamic";
import { ResultDisplay } from "@/components/ResultDisplayProps";
import { ChevronLeft, ChevronRight, Image, MapPin, Upload } from "lucide-react";
import { useState, memo } from "react";
import { PhotoMetadata } from "@/types/api";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
            flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 ease-in-out
            ${isCollapsed ? "w-16" : "w-80 lg:w-96"} flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Photo Gallery
                </h2>
                <p className="text-sm text-gray-400">{files.length} photos</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
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
                  className={`w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 ${
                    activeIndex === index
                      ? "ring-2 ring-blue-500 scale-110"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  title={`Photo ID: ${file.id}`}
                >
                  <img
                    src={file.thumbnail}
                    alt={`Thumbnail ${file.id}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(index)}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeIndex === index
                      ? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20"
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
                          ? "bg-blue-500/20"
                          : "bg-black/0 group-hover:bg-black/20"
                      }`}
                    />
                    {activeIndex === index && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs font-medium text-white">
                        ID: {file.id}
                      </span>
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
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              No Photos Yet
            </h2>
            <p className="text-gray-400 text-lg">
              Your analyzed photos will appear here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between h-10">
            {activeFile ? (
              <>
                {/* Header content for active file */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">{activeFile.id}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Photo Analysis Results
                    </h1>
                    <p className="text-gray-400">Photo ID: {activeFile.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setActiveFileIndex(
                        Math.max(0, (activeFileIndex || 0) - 1)
                      )
                    }
                    disabled={activeFileIndex === 0}
                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 px-2">
                    {(activeFileIndex || 0) + 1} of {allFiles.length}
                  </span>
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
                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Photo Analysis
                </h1>
                <p className="text-gray-400">
                  Select a photo from the gallery to begin.
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl mx-auto">
            <div className="space-y-6">
              {isDetailsLoading ? (
                <div className="flex items-center justify-center h-96 bg-gray-800/50 rounded-xl">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl text-gray-300 font-medium">
                      Loading details...
                    </p>
                  </div>
                </div>
              ) : activeFile ? (
                <ResultDisplay
                  canvasRef={canvasRef}
                  hasActiveImage={!!activeFile}
                  error={error}
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-800/50 rounded-xl text-center max-w-md mx-auto">
                  <div>
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Image className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Select a Photo
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Choose a photo from the gallery to view its results.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <DynamicMapDisplay
                files={allFiles}
                activeIndex={activeFileIndex}
                onActiveIndexChange={setActiveFileIndex}
              />
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
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-300 font-medium">
            Loading all photos...
          </p>
        </div>
      </div>
    );
  }

  if (resultsData.error && resultsData.allFiles.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
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
          <h2 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-red-400 text-lg">{resultsData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
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
      `}</style>
    </main>
  );
}
