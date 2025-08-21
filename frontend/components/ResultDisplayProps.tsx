interface ResultDisplayProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  error: string;
  hasActiveImage: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  canvasRef,
  error,
  hasActiveImage,
}) => {
  if (!hasActiveImage) {
    return <div className="mt-8 text-gray-500">No photos was selected.</div>;
  }
  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">Result</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {hasActiveImage && (
        <div className="relative w-full max-w-4xl border-2 border-gray-600 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};
