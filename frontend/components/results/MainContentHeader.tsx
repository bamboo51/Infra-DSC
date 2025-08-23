import { memo } from 'react';
import { ChevronLeft, ChevronRight, Map as MapIcon, Menu } from "lucide-react";

interface MainContentHeaderProps {
  onMenuClick: () => void;
  fileCount: number;
  activeFileIndex: number | null;
  onPrev: () => void;
  onNext: () => void;
}

const MainContentHeaderComponent: React.FC<MainContentHeaderProps> = ({
  onMenuClick,
  fileCount,
  activeFileIndex,
  onPrev,
  onNext
}) => {
  const hasActiveFile = activeFileIndex !== null;

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Mobile gallery toggle button */}
        <button
          onClick={onMenuClick}
          className="flex items-center space-x-1 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 md:hidden"
        >
          <Menu className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">ギャラリー</span>
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-2 flex-1 justify-center md:justify-start">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center shadow-md">
            <MapIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-black">道路劣化検出</h1>
            <p className="text-gray-600 text-xs">{fileCount} 枚検出済み</p>
          </div>
        </div>

        {/* Navigation Controls */}
        {hasActiveFile && (
          <div className="flex items-center space-x-1">
            <button
              onClick={onPrev}
              disabled={activeFileIndex === 0}
              className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3 h-3 text-gray-600" />
            </button>
            <div className="text-center px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
              <span className="text-xs font-semibold text-black whitespace-nowrap">
                {activeFileIndex + 1}/{fileCount}
              </span>
            </div>
            <button
              onClick={onNext}
              disabled={activeFileIndex === fileCount - 1}
              className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const MainContentHeader = memo(MainContentHeaderComponent);