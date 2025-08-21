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
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Photo Selected</h3>
          <p className="text-gray-500">Select a photo from the gallery to view analysis results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Image className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Analysis Result</h3>
              <p className="text-sm text-gray-400">AI-processed image with detections</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors group"
              title="View fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors group"
              title="Download result"
            >
              <Download className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="p-6">
        <div className="relative bg-gray-900/50 rounded-lg overflow-hidden border border-gray-600/30">
          {/* Canvas wrapper with aspect ratio preservation */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="max-w-full max-h-[500px] w-auto h-auto rounded-lg shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))',
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