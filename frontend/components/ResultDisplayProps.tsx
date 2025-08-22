import React from 'react';
import { Image, AlertCircle, Maximize2, Download } from 'lucide-react';

interface ResultDisplayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  error: string | null;
  hasActiveImage: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  canvasRef,
  error,
  hasActiveImage,
}) => {
  const handleFullscreen = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'analysis-result.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (!hasActiveImage) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">画像が選択されていません</h3>
          <p className="text-gray-600">ギャラリーから画像を選択して、検出結果を表示します。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Image className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">検出結果</h3>
              <p className="text-sm text-gray-600">AIによって処理された画像と検出結果</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors group"
              title="View fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-gray-600 group-hover:text-black" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors group"
              title="Download result"
            >
              <Download className="w-4 h-4 text-gray-600 group-hover:text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="p-6">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          {/* Canvas wrapper with aspect ratio preservation */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[500px] w-auto h-auto rounded-lg shadow-lg"
              style={{ 
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-400/50"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400/50"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400/50"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-400/50"></div>
        </div>
      </div>
    </div>
  );
};