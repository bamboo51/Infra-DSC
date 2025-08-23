"use client";

import { useAllResults } from "@/hooks/allResults";
import { Gallery } from "@/components/results/Gallery";
import { MainContent } from "@/components/results/MainContent";
import { EmptyState } from "@/components/results/EmptyState";
import { useResponsiveGallery } from "@/hooks/useResponsiveGallery";

interface ResultsLayoutProps {
  resultsData: ReturnType<typeof useAllResults>;
}

const InitialLoadingScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center px-4">
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
        <div>
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
};

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-red-50 p-4">
      <div className="text-center max-w-sm sm:max-w-md">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
          接続エラー
        </h2>
        <p className="text-red-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
          {error || "不明なエラーが発生しました。"}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-5 py-3 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          再度試行
        </button>
      </div>
    </div>
  );
};

const ResultsLayout: React.FC<ResultsLayoutProps> = ({ resultsData }) => {
  const { isOpen, toggle } = useResponsiveGallery();
  
  if (resultsData.allFiles.length === 0) {
    return <EmptyState />; 
  }

  return (
    <main className="flex h-screen bg-white text-black overflow-hidden">
      <Gallery
        files={resultsData.allFiles}
        activeIndex={resultsData.activeFileIndex}
        onSelect={resultsData.setActiveFileIndex}
        isOpen={isOpen}
        onToggle={toggle}
      />
      <MainContent {...resultsData} onMenuClick={toggle} />
    </main>
  );
};

export default function ResultsPage() {
  const resultsData = useAllResults();

  if (resultsData.isListLoading) {
    return <InitialLoadingScreen />;
  }

  if (resultsData.error && resultsData.allFiles.length === 0) {
    return <ErrorScreen error={resultsData.error} onRetry={() => window.location.reload()} />;
  }

  return <ResultsLayout resultsData={resultsData} />;
}