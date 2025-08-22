"use client";

import { MapDisplayProps } from "@/components/Map";
import { useAllResults } from "@/hooks/allResults";
import dynamic from "next/dynamic";
import { ResultDisplay } from "@/components/ResultDisplayProps";
import {
  ChevronLeft,
  ChevronRight,
  Image,
  Upload,
  Grid,
  Map as MapIcon,
  Menu,
  X,
} from "lucide-react";
import { useState, memo, useEffect } from "react";
import { PhotoMetadata } from "@/types/api";

const DynamicMapDisplay = dynamic<MapDisplayProps>(
  () => import("@/components/Map").then((mod) => mod.MapDisplay),
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

// Mobile-first Sidebar component with overlay on mobile
const Sidebar = memo(
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
    // Close sidebar when clicking outside on mobile
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (isOpen && window.innerWidth < 768) {
          const sidebar = document.getElementById("sidebar");
          const target = event.target as Node;
          if (sidebar && !sidebar.contains(target)) {
            onToggle();
          }
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, onToggle]);

    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <div
          id="sidebar"
          className={`
            fixed md:relative top-0 left-0 h-full bg-white border-r border-gray-200 
            transition-transform duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            w-80 md:w-72 lg:w-80 flex flex-col shadow-xl md:shadow-lg
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black">ギャラリー</h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                  道路画像 {files.length} 枚検出済
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 md:hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Photo Grid */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {files.map((file, index) => (
                <button
                  key={file.id}
                  onClick={() => {
                    onSelect(index);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform active:scale-95 ${
                    activeIndex === index
                      ? "ring-2 ring-black shadow-lg scale-105"
                      : "hover:shadow-lg hover:shadow-black/20 hover:scale-105"
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
                      <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full ring-2 ring-white shadow-lg" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs font-semibold text-white">
                        ID: {file.id}
                      </span>
                    </div>
                    {/* Mobile-optimized hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <div className="text-left">
                        <p className="text-white text-xs font-medium">
                          検出完了
                        </p>
                        <p className="text-gray-300 text-xs">タップして表示</p>
                      </div>
                    </div>
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
    sidebarOpen,
    setSidebarOpen,
  }: ReturnType<typeof useAllResults> & {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
  }) => {
    const [activeTab, setActiveTab] = useState<"analysis" | "map">("analysis");
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
              アップロードされた画像
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 md:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            {activeFile ? (
              <>
                {/* Header content for active file - mobile optimized */}
                <div className="flex items-center space-x-3 flex-1 md:flex-initial">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {activeFile.id}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-black truncate">
                      検出結果
                    </h1>
                    <p className="text-gray-600 flex items-center mt-1 text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">
                        Photo ID: {activeFile.id}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Navigation - Mobile optimized */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setActiveFileIndex(
                        Math.max(0, (activeFileIndex || 0) - 1)
                      )
                    }
                    disabled={activeFileIndex === 0}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div className="text-center px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 rounded-lg sm:rounded-xl border border-gray-200">
                    <span className="text-xs sm:text-sm font-semibold text-black whitespace-nowrap">
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
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 md:flex-initial">
                <h1 className="text-xl sm:text-3xl font-bold text-black">
                  ギャラリー
                </h1>
                <p className="text-gray-600 mt-2 flex items-center text-sm sm:text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ギャラリーから画像を選択して、検出結果を表示します。
                </p>
              </div>
            )}
          </div>

          {/* Mobile Tab Navigation */}
          {activeFile && (
            <div className="flex mt-4 bg-gray-100 rounded-xl p-1 xl:hidden">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeTab === "analysis"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                検出結果
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeTab === "map"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <MapIcon className="w-4 h-4 mr-2" />
                マップ
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Single column with tabs, Desktop: Two columns */}
            <div className="xl:grid xl:grid-cols-2 xl:gap-8">
              {/* Analysis Section */}
              <div
                className={`relative group ${
                  activeTab === "map" ? "hidden xl:block" : ""
                }`}
              >
                
                  {isDetailsLoading ? (
                    <div className="flex items-center justify-center h-48 sm:h-64">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin"
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
                          <p className="text-base sm:text-lg text-black font-semibold mb-1">
                            検出結果を処理中...
                          </p>
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
                    <div className="flex items-center justify-center h-48 sm:h-64 text-center">
                      <div>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-black mb-2">
                          画像を選択
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          ギャラリーから画像を選択して、検出結果を表示します。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              

              {/* Map Section */}
              <div
                className={`relative group ${
                  activeTab === "analysis" ? "hidden xl:block" : ""
                } ${activeTab === "map" ? "mt-4 xl:mt-0" : ""}`}
              >
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

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
          <Sidebar
            files={resultsData.allFiles}
            activeIndex={resultsData.activeFileIndex}
            onSelect={resultsData.setActiveFileIndex}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        <MainContent
          {...resultsData}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Custom CSS for animations and mobile optimizations */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }

          /* Prevent zoom on input focus on iOS */
          input,
          select,
          textarea,
          button {
            font-size: 16px;
          }

          /* Safe area adjustments for devices with notches */
          .mobile-safe-area {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
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

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:hover {
            transform: none;
          }
          .group:hover .group-hover\\:scale-110 {
            transform: none;
          }
          .group:hover .group-hover\\:opacity-100 {
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
