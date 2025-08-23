"use client";

import { MapDisplayProps } from "@/components/ui/Map";
import { useAllResults } from "@/hooks/allResults";
import dynamic from "next/dynamic";
import { ResultDisplay } from "@/components/ui/ResultDisplayProps";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Grid,
  Map as MapIcon,
  Menu,
  X,
  List,
} from "lucide-react";
import { useState, memo, useEffect } from "react";
import { PhotoMetadata } from "@/types/api";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/ui/Map").then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base">マップロード中...</span>
        </div>
      </div>
    ),
  }
);

// Compact Gallery component as a collapsible list
const Gallery = memo(
  ({
    files,
    activeIndex,
    onSelect,
    isOpen,
    onToggle,
  }: {
    files: PhotoMetadata[];
    activeIndex: number | null;
    onSelect: (index: number) => void;
    isOpen: boolean;
    onToggle: () => void;
  }) => {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}

        {/* Gallery Panel - More compact */}
        <div
          className={`
            fixed md:relative top-0 left-0 bg-white border-r border-gray-200 
            transition-all duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            w-72 md:w-56 lg:w-64 shadow-lg md:shadow-md
            ${isOpen ? "h-full" : "md:h-auto"}
          `}
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                <List className="w-3 h-3 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-black">ギャラリー</h2>
                <p className="text-xs text-gray-600">{files.length} 枚</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-200 md:hidden"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Compact Photo List */}
          <div className="overflow-y-auto custom-scrollbar max-h-80 md:max-h-screen">
            <div className="p-1">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => {
                    onSelect(index);
                    // Close gallery on mobile after selection
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`w-full p-2 mb-1 rounded-lg transition-all duration-200 transform active:scale-95 text-left ${
                    activeIndex === index
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-black hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={file.thumbnail}
                        alt={`Photo ${file.id}`}
                        className="w-full h-full object-cover"
                      />
                      {activeIndex === index && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">
                        ID: {file.id}
                      </p>
                      <p className={`text-xs ${
                        activeIndex === index ? "text-gray-300" : "text-gray-500"
                      }`}>
                        検出済み
                      </p>
                    </div>
                    {activeIndex === index && (
                      <div className="w-1 h-1 bg-white rounded-full flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
);
Gallery.displayName = "Gallery";

const MainContent = memo(
  ({
    allFiles,
    activeFile,
    activeFileIndex,
    setActiveFileIndex,
    isDetailsLoading,
    error,
    canvasRef,
    galleryOpen,
    setGalleryOpen,
  }: ReturnType<typeof useAllResults> & {
    galleryOpen: boolean;
    setGalleryOpen: (open: boolean) => void;
  }) => {
    // This is the initial "welcome screen" when no photos have ever been processed.
    if (allFiles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center max-w-sm sm:max-w-md bg-gray-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
              画像がまだありません。
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              アップロードして画像を処理すると、ここに分析済みの画像が表示されます。
            </p>
            <a
              href="/"
              className="inline-flex items-center px-5 py-3 sm:px-6 sm:py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              画像をアップロード
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Mobile Header with Menu Button */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Mobile gallery toggle button - more compact */}
            <button
              onClick={() => setGalleryOpen(!galleryOpen)}
              className="flex items-center space-x-1 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 md:hidden"
            >
              <Menu className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">ギャラリー</span>
            </button>

            {/* Compact Header content */}
            <div className="flex items-center space-x-2 flex-1 justify-center md:justify-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center shadow-md">
                <MapIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-black">
                  道路劣化検出
                </h1>
                <p className="text-gray-600 text-xs">
                  {allFiles.length} 枚検出済み
                </p>
              </div>
            </div>

            {/* Compact Navigation controls */}
            {activeFile && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    setActiveFileIndex(
                      Math.max(0, (activeFileIndex || 0) - 1)
                    )
                  }
                  disabled={activeFileIndex === 0}
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-3 h-3 text-gray-600" />
                </button>
                <div className="text-center px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
                  <span className="text-xs font-semibold text-black whitespace-nowrap">
                    {(activeFileIndex || 0) + 1}/{allFiles.length}
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
                  className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Compact Main Content Area - Map and Results Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Map Section - Always visible, more compact */}
          <div className={`bg-white border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300 ${
            activeFile 
              ? "h-1/2 lg:h-full lg:w-1/2" // Map takes half space when results are shown
              : "h-1/2 lg:h-full lg:flex-1"  // Map takes full space when no results
          }`}>
            <div className="h-full p-1 sm:p-2">
              <div className="h-full rounded-lg overflow-hidden shadow-md">
                <DynamicMapDisplay
                  files={allFiles}
                  activeIndex={activeFileIndex}
                  onActiveIndexChange={setActiveFileIndex}
                />
              </div>
            </div>
          </div>

          {/* Results Section - More compact when shown */}
          {activeFile && (
            <div className="h-1/2 lg:h-full lg:w-1/2 bg-white overflow-hidden">
              <div className="h-full p-1 sm:p-2">
                <div className="h-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden flex flex-col">


                  {/* Compact Results Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {isDetailsLoading ? (
                      <div className="flex items-center justify-center h-full min-h-32">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md">
                            <svg
                              className="w-4 h-4 text-white animate-spin"
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
                          <p className="text-xs text-gray-600">処理中...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full">
                        <ResultDisplay
                          canvasRef={canvasRef}
                          hasActiveImage={!!activeFile}
                          error={error}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compact welcome message when no file is selected */}
          {!activeFile && (
            <div className="h-1/2 lg:h-full lg:flex-1 bg-white flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Grid className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  画像を選択
                </h3>
                <p className="text-gray-600 text-sm">
                  ギャラリーまたはマップから選択してください
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
MainContent.displayName = "MainContent";

export default function ResultsPage() {
  const resultsData = useAllResults();
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Close gallery when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && galleryOpen) {
        setGalleryOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [galleryOpen]);

  if (resultsData.isListLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white relative overflow-hidden">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin"
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
          <div className="text-center px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
              画像ロード中...
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              検出結果を取得しています。しばらくお待ちください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (resultsData.error && resultsData.allFiles.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-red-50 relative overflow-hidden">
        <div className="text-center max-w-sm sm:max-w-md px-4 sm:px-6">
          <div className="relative mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
            Connection Error
          </h2>
          <p className="text-red-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
            {resultsData.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-5 py-3 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
            再度試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-white text-black font-sans relative overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {resultsData.allFiles.length > 0 && (
          <Gallery
            files={resultsData.allFiles}
            activeIndex={resultsData.activeFileIndex}
            onSelect={resultsData.setActiveFileIndex}
            isOpen={galleryOpen}
            onToggle={() => setGalleryOpen(!galleryOpen)}
          />
        )}
        <MainContent
          {...resultsData}
          galleryOpen={galleryOpen}
          setGalleryOpen={setGalleryOpen}
        />
      </div>
    </main>
  );
}
