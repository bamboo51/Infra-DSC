// components/results/EmptyState.tsx
import React from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex h-screen w-screen items-center justify-center p-4 sm:p-6 bg-white">
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
        <Link
          href="/"
          className="inline-flex items-center px-5 py-3 sm:px-6 sm:py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          アップロードされた画像
        </Link>
      </div>
    </div>
  );
};