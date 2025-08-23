// components/results/MainContent.tsx
import { memo } from 'react';
import dynamic from 'next/dynamic';
import { MainContentHeader } from '@/components/results/MainContentHeader';
import { WelcomePrompt } from '@/components/results/WelcomePrompt';
import { ResultDisplay } from '@/components/ui/ResultDisplayProps';
import type { MapDisplayProps } from '@/components/ui/Map';
import type { useAllResults } from '@/hooks/allResults';

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

interface MainContentProps extends ReturnType<typeof useAllResults> {
  onMenuClick: () => void;
}

const MainContentComponent: React.FC<MainContentProps> = ({
  allFiles, activeFile, activeFileIndex, setActiveFileIndex,
  isDetailsLoading, error, canvasRef, onMenuClick
}) => (
  <div className="flex-1 flex flex-col bg-gray-100 min-h-0">
    <MainContentHeader
      fileCount={allFiles.length}
      activeFileIndex={activeFileIndex}
      onMenuClick={onMenuClick}
      onPrev={() => setActiveFileIndex(Math.max(0, (activeFileIndex || 0) - 1))}
      onNext={() => setActiveFileIndex(Math.min(allFiles.length - 1, (activeFileIndex || 0) + 1))}
    />
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-1 sm:p-2 gap-1 sm:gap-2 custom-scrollbar min-h-0">
      <div className={`transition-all duration-300 flex-shrink-0 ${activeFile ? "h-64 sm:h-80 lg:h-full lg:w-1/2" : "h-64 sm:h-80 lg:h-full lg:flex-1"}`}>
        <div className="h-full rounded-lg overflow-hidden shadow-md">
          <DynamicMapDisplay files={allFiles} activeIndex={activeFileIndex} onActiveIndexChange={setActiveFileIndex} />
        </div>
      </div>
      {activeFile ? (
        <div className="h-96 sm:h-[32rem] lg:h-full lg:w-1/2 bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden flex-shrink-0">
          {isDetailsLoading ? (
            <div className="flex items-center justify-center h-full">
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
            <ResultDisplay canvasRef={canvasRef} hasActiveImage={!!activeFile} error={error} />
          )}
        </div>
      ) : (
        <div className="flex-shrink-0 lg:flex-1">
          <WelcomePrompt />
        </div>
      )}
    </div>
    
    
  </div>
);

export const MainContent = memo(MainContentComponent);